package com.example.edugameai.service.support;

import java.security.SecureRandom;
import java.util.Base64;

/**
 * Sinh id theo ĐÚNG convention của backend chính:
 * {@code server/src/services/questionService.js} và {@code gamePlayService.js}
 * dùng {@code uid("question")} → {@code "question-" + 7 ký tự base36}.
 *
 * <p>Giữ convention này để câu hỏi do AI sinh ra có thể đi thẳng vào API sẵn có mà
 * không cần sửa dữ liệu hay đổi kiểu id.
 */
public final class Ids {

    private static final SecureRandom RANDOM = new SecureRandom();
    private static final String ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";

    private Ids() {
    }

    public static String newQuestionId() {
        return "question-" + suffix();
    }

    public static String newAnswerId() {
        return "answer-" + suffix();
    }

    private static String suffix() {
        byte[] bytes = new byte[8];
        RANDOM.nextBytes(bytes);
        // Base64-url rồi lọc còn ký tự base36 để không lệch convention.
        String raw = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes).toLowerCase();
        StringBuilder sb = new StringBuilder(7);
        for (char c : raw.toCharArray()) {
            if (ALPHABET.indexOf(c) >= 0) {
                sb.append(c);
                if (sb.length() == 7) {
                    break;
                }
            }
        }
        while (sb.length() < 7) {
            sb.append(ALPHABET.charAt(RANDOM.nextInt(ALPHABET.length())));
        }
        return sb.toString();
    }
}