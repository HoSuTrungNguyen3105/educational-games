/**
 * speech.js — đọc to văn bản bằng giọng đọc máy (Web Speech API).
 *
 * Tách khỏi KidDashboard (2026-11-21) để mọi nơi cần đọc to (tiêu đề nhiệm
 * vụ, hướng dẫn, lời chào) dùng chung một hàm, không copy đoạn
 * `new SpeechSynthesisUtterance` mỗi trang.
 *
 *   speak("Chào bé")           — đọc to (tự cancel câu đang đọc trước)
 *   speak("Chào bé", { rate: .9 })
 *   stopSpeaking()              — ngưng đọc
 *   canSpeak()                  — trình duyệt có hỗ trợ TTS không
 *
 * Bé lớp 1–2 chưa đọc thạo dựa vào nút 🔊 để tự thao tác nên mọi lỗi đều
 * nuốt im lặng — đọc không được thì app vẫn chạy bình thường.
 */

export function canSpeak() {
  return (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window
  );
}

/** Ngưng câu đang đọc (nếu có) — nuốt lỗi ở trình duyệt không hỗ trợ. */
export function stopSpeaking() {
  if (!canSpeak()) return;
  try {
    window.speechSynthesis.cancel();
  } catch { /* ignore */ }
}

/**
 * Đọc to `text`. Mặc định tiếng Việt, `rate` = 1 (bé đọc quen thì để 0.95).
 * Trả về true nếu đã gửi câu vào hàng đọc — nơi gọi có thể hiện trạng thái
 * "đang đọc".
 */
export function speak(text, { lang = "vi-VN", rate = 1, pitch = 1 } = {}) {
  const value = String(text || "").trim();
  if (!value || !canSpeak()) return false;
  try {
    // Đọc chuỗi mới thì câu cũ phải dừng trước, không thì hai câu chồng nhau.
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(value);
    u.lang = lang;
    u.rate = rate;
    u.pitch = pitch;
    window.speechSynthesis.speak(u);
    return true;
  } catch {
    return false;
  }
}
