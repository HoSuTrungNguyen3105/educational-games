package com.example.edugameai.service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import com.example.edugameai.config.AiProperties;
import com.example.edugameai.exception.AiErrors;
import org.springframework.stereotype.Service;

/**
 * Giới hạn tần suất theo người dùng, dùng cửa sổ trượt lưu trong bộ nhớ.
 *
 * <p>Mỗi request chỉ ghi một mốc thời gian. Khi số mốc trong 60 giây gần nhất vượt hạn mức
 * thì từ chối. Ở mức tải của một dịch vụ AI, đây là đủ; nếu chạy nhiều instance thì thay
 * bằng Redis mà không cần đổi interface của service.
 *
 * <p>Không lưu nội dung yêu cầu — chỉ lưu thời điểm — nên không rò rỉ dữ liệu học sinh.
 */
@Service
public class AiRateLimiter {

    private static final Duration WINDOW = Duration.ofMinutes(1);
    private static final int MAX_TRACKED_KEYS = 50_000;

    private final AiProperties properties;
    private final Map<String, Window> windows = new ConcurrentHashMap<>();

    public AiRateLimiter(AiProperties properties) {
        this.properties = properties;
    }

    /**
     * Ghi một lượt dùng và ném lỗi 429 nếu vượt hạn mức.
     *
     * @param key     định danh người dùng/IP đã gắn tiền tố bởi {@code AuthenticatedUser.rateLimitKey}
     * @param bucket  nhóm hạn mức: {@code chat}, {@code quiz} hoặc {@code analysis}
     */
    public void check(String key, Bucket bucket) {
        if (!properties.rateLimit().enabled()) {
            return;
        }
        int limit = switch (bucket) {
            case CHAT -> properties.rateLimit().chatPerMinute();
            case QUIZ -> properties.rateLimit().quizPerMinute();
            case ANALYSIS -> properties.rateLimit().analysisPerMinute();
        };
        if (limit <= 0) {
            return;
        }

        long now = System.currentTimeMillis();
        Window window = windows.computeIfAbsent(bucket.name() + ':' + key, k -> new Window());
        synchronized (window) {
            window.evictOlderThan(now - WINDOW.toMillis());
            if (window.timestamps.size() >= limit) {
                throw new AiErrors.RateLimited(
                        "Bạn hỏi AI quá nhiều trong thời gian ngắn. Vui lòng đợi một lát rồi thử lại.");
            }
            window.timestamps.add(now);
        }

        if (windows.size() > MAX_TRACKED_KEYS) {
            evictIdle(now);
        }
    }

    private void evictIdle(long now) {
        windows.entrySet().removeIf(e -> {
            Window w = e.getValue();
            synchronized (w) {
                w.evictOlderThan(now - 10 * WINDOW.toMillis());
                return w.timestamps.isEmpty();
            }
        });
    }

    /** Nhóm hạn mức. */
    public enum Bucket {
        CHAT, QUIZ, ANALYSIS
    }

    private static final class Window {
        private final java.util.ArrayDeque<Long> timestamps = new java.util.ArrayDeque<>();

        void evictOlderThan(long cutoff) {
            while (!timestamps.isEmpty() && timestamps.peekFirst() <= cutoff) {
                timestamps.pollFirst();
            }
        }
    }
}