import { useEffect, useState } from "react";
import { API_BASE } from "../services/api";

/**
 * ServerWakeBanner — báo cho người dùng biết khi backend (Render gói free)
 * đang "ngủ" và cần 30–60 giây để khởi động lại.
 *
 * Cơ chế: lúc mở app, gọi GET {API_BASE}/health.
 *   · Trả lời nhanh (< SLOW_MS)  → không hiện gì.
 *   · Chưa trả lời sau SLOW_MS   → hiện thanh tiến trình, tiếp tục
 *                                  thử lại cho tới khi OK.
 *   · Quá GIVE_UP_MS vẫn không được → thanh chuyển màu lỗi kèm nút thử lại.
 *
 * Hiển thị: thanh progress NGANG cố định ở đỉnh màn hình (không chặn thao
 * tác, không xô lệch layout). Trong lúc chờ, thanh tiến dần về ~90% theo
 * thời gian chờ thật và KHÔNG tự chạm 100%; máy chủ trả lời OK thì thanh
 * chạy nốt tới 100% rồi mờ dần biến mất.
 *
 * Chỉ THÔNG BÁO, không chặn app — game offline vẫn chơi được trong lúc chờ.
 *
 * Các props slowMs/retryMs/giveUpMs/requestTimeoutMs chỉ để harness kiểm
 * chứng rút ngắn ngưỡng; App dùng component không props nên luôn chạy đúng
 * các hằng số production bên dưới.
 */
const SLOW_MS = 3000;
const RETRY_MS = 4000;
const GIVE_UP_MS = 90000;
const REQUEST_TIMEOUT_MS = 8000;

async function ping(requestTimeoutMs = REQUEST_TIMEOUT_MS) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), requestTimeoutMs);
    try {
        const res = await fetch(`${API_BASE}/api/health`, {
            cache: "no-store",
            signal: ctrl.signal,
        });
        return res.ok;
    } catch {
        return false;
    } finally {
        clearTimeout(timer);
    }
}

export default function ServerWakeBanner({
    slowMs = SLOW_MS,
    retryMs = RETRY_MS,
    giveUpMs = GIVE_UP_MS,
    requestTimeoutMs = REQUEST_TIMEOUT_MS,
} = {}) {
    // "ok" | "waking" | "failed" — trạng thái kết nối (logic giữ nguyên).
    const [status, setStatus] = useState("ok");
    const [attempt, setAttempt] = useState(0);
    // "hidden" | "active" | "completing" | "failed" — pha hiển thị của thanh.
    const [phase, setPhase] = useState("hidden");
    const [progress, setProgress] = useState(0);
    const [prevStatus, setPrevStatus] = useState(status);

    useEffect(() => {
        let cancelled = false;
        let slowTimer = null;
        let retryTimer = null;
        const startedAt = Date.now();

        // Chỉ hiện thanh nếu lần gọi đầu chậm — tránh chớp thanh khi server nhanh.
        slowTimer = setTimeout(() => {
            if (!cancelled) setStatus((s) => (s === "ok" ? "waking" : s));
        }, slowMs);

        const tryOnce = async () => {
            const ok = await ping(requestTimeoutMs);
            if (cancelled) return;
            if (ok) {
                clearTimeout(slowTimer);
                setStatus("ok");
                return;
            }
            if (Date.now() - startedAt >= giveUpMs) {
                clearTimeout(slowTimer);
                setStatus("failed");
                return;
            }
            retryTimer = setTimeout(tryOnce, retryMs);
        };
        tryOnce();

        return () => {
            cancelled = true;
            clearTimeout(slowTimer);
            clearTimeout(retryTimer);
        };
    }, [attempt, slowMs, retryMs, giveUpMs, requestTimeoutMs]);

    // Ánh xạ trạng thái kết nối → pha hiển thị của thanh tiến trình, theo
    // pattern "điều chỉnh state khi render" của React (không qua effect).
    if (status !== prevStatus) {
        setPrevStatus(status);
        if (status === "waking") {
            setProgress(0);
            setPhase("active");
        } else if (status === "failed") {
            setPhase("failed");
        } else if (status === "ok" && (phase === "active" || phase === "failed")) {
            // Máy chủ vừa trả lời sau một thời gian chờ: chạy nốt tới 100%
            // rồi mờ dần (CSS có delay để thấy thanh đầy trước khi mờ).
            setPhase("completing");
            setProgress(100);
        }
    }

    // Pha completing: chờ thanh đầy + mờ xong thì ẩn hẳn và reset.
    useEffect(() => {
        if (phase !== "completing") return;
        const t = setTimeout(() => {
            setPhase("hidden");
            setProgress(0);
        }, 800);
        return () => clearTimeout(t);
    }, [phase]);

    // Trong lúc chờ: thanh tiến dần về 90% theo thời gian chờ thật, càng
    // gần 90% càng chậm lại — không bao giờ tự chạm 100% khi chưa có OK.
    useEffect(() => {
        if (phase !== "active") return;
        const startedAt = Date.now();
        const id = setInterval(() => {
            const elapsed = Date.now() - startedAt;
            setProgress(90 * (1 - Math.exp(-elapsed / 10000)));
        }, 100);
        return () => clearInterval(id);
    }, [phase, attempt]);

    if (phase === "hidden") return null;

    const failed = phase === "failed";
    const barColor = failed ? "#e5484d" : "var(--accent)";
    return (
        <div
            className={`server-wake${phase === "completing" ? " server-wake--completing" : ""}`}
            data-testid="server-wake-progress"
            data-phase={phase}
            role="status"
            aria-live="polite"
        >
            <div
                className="server-wake__track"
                role="progressbar"
                aria-label="Đang kết nối máy chủ"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
            >
                <div
                    className="server-wake__fill"
                    data-testid="server-wake-fill"
                    style={{ width: `${progress}%`, background: barColor, color: barColor }}
                />
            </div>
            <div className="server-wake__label">
                <div
                    className="server-wake__pill"
                    style={{
                        background: "var(--card)",
                        borderColor: "var(--line)",
                        color: "var(--text-dark)",
                    }}
                >
                    <span
                        aria-hidden="true"
                        className={`mt-[3px] h-2.5 w-2.5 shrink-0 rounded-full ${failed ? "" : "animate-pulse"}`}
                        style={{ background: failed ? "#e5484d" : "var(--gold)" }}
                    />
                    <p className="min-w-0 flex-1 leading-snug">
                        {failed ? (
                            <>
                                <span className="font-semibold">Chưa kết nối được máy chủ. </span>
                                Đăng nhập, xu và tiến độ có thể chưa dùng được; các game offline vẫn chơi bình thường.{" "}
                                <button
                                    type="button"
                                    className="server-wake__retry font-semibold underline"
                                    onClick={() => {
                                        setStatus("waking");
                                        setAttempt((n) => n + 1);
                                    }}
                                >
                                    Thử lại
                                </button>
                            </>
                        ) : (
                            <>
                                <span className="font-semibold">Máy chủ đang khởi động… </span>
                                Có thể mất tới 1 phút ở lần mở đầu tiên. Bạn cứ chơi game offline trong lúc chờ nhé!
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}
