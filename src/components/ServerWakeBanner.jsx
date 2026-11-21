import { useEffect, useState } from "react";
import { API_BASE } from "../services/api";

/**
 * ServerWakeBanner — báo cho người dùng biết khi backend (Render gói free)
 * đang "ngủ" và cần 30–60 giây để khởi động lại.
 *
 * Cơ chế: lúc mở app, gọi GET {API_BASE}/health.
 *   · Trả lời nhanh (< SLOW_MS)  → không hiện gì.
 *   · Chưa trả lời sau SLOW_MS   → hiện "Máy chủ đang khởi động…", tiếp tục
 *                                  thử lại cho tới khi OK.
 *   · Quá GIVE_UP_MS vẫn không được → đổi thành thông báo lỗi kèm nút thử lại.
 *
 * Chỉ THÔNG BÁO, không chặn app — game offline vẫn chơi được trong lúc chờ.
 */
const SLOW_MS = 3000;
const RETRY_MS = 4000;
const GIVE_UP_MS = 90000;
const REQUEST_TIMEOUT_MS = 8000;

async function ping() {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
    try {
        const res = await fetch(`${API_BASE}/health`, {
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

export default function ServerWakeBanner() {
    // "ok" | "waking" | "failed"
    const [status, setStatus] = useState("ok");
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        let cancelled = false;
        let slowTimer = null;
        let retryTimer = null;
        const startedAt = Date.now();

        // Chỉ hiện banner nếu lần gọi đầu chậm — tránh chớp banner khi server nhanh.
        slowTimer = setTimeout(() => {
            if (!cancelled) setStatus((s) => (s === "ok" ? "waking" : s));
        }, SLOW_MS);

        const tryOnce = async () => {
            const ok = await ping();
            if (cancelled) return;
            if (ok) {
                clearTimeout(slowTimer);
                setStatus("ok");
                return;
            }
            if (Date.now() - startedAt >= GIVE_UP_MS) {
                clearTimeout(slowTimer);
                setStatus("failed");
                return;
            }
            retryTimer = setTimeout(tryOnce, RETRY_MS);
        };
        tryOnce();

        return () => {
            cancelled = true;
            clearTimeout(slowTimer);
            clearTimeout(retryTimer);
        };
    }, [attempt]);

    if (status === "ok") return null;

    const failed = status === "failed";
    return (
        <div
            role="status"
            aria-live="polite"
            className="w-full border-b"
            style={{
                background: "var(--card)",
                borderColor: "var(--line)",
                color: "var(--text-dark)",
            }}
        >
            <div className="mx-auto flex max-w-6xl items-start gap-2 px-4 py-2 text-sm">
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
                                className="font-semibold underline"
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
    );
}
