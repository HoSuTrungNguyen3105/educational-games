/**
 * sounds.js — 6 âm thanh sư phạm của tab Nề nếp, tổng hợp bằng Web Audio
 * API thuần (oscillator + gain envelope). KHÔNG file âm thanh, KHÔNG thư
 * viện — đúng cách app mẫu làm ("Web Audio API").
 *
 * AudioContext được khởi tạo LƯỜI ở lần bấm đầu tiên (chính sách autoplay
 * của trình duyệt chỉ cho phát âm sau tương tác người dùng) và dùng lại
 * cho mọi lần sau. Mỗi lần phát tạo các node độc lập và tự dọn khi phát
 * xong — bấm nhiều nút liên tiếp thì âm chồng lên nhau như đàn piano,
 * không khoá nhau; giáo viên toàn quyền bấm lại.
 *
 * kind: "focus-bell" | "fanfare" | "attention" | "thinking-knock"
 *     | "end-bell" | "point-ting"
 */

let ctx = null;

function ensureContext() {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) {
    try {
      ctx = new AC();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

/**
 * Phát một nốt: dao động `freq` Hz, bắt đầu sau `delay` giây (tính từ
 * hiện tại), ngân `dur` giây với envelope vào nhanh — ra giảm dần theo
 * hàm mũ. `slideTo` cho phép trượt tần số (ít dùng).
 */
function tone(audio, { freq, type = "sine", delay = 0, dur = 0.3, vol = 0.18, slideTo = null }) {
  const t0 = audio.currentTime + delay;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(audio.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

/** Tiếng chuông: nốt gốc + hài âm 2.76× (âm sắc chuông) ngân dài, giảm dần. */
function bell(audio, { freq, delay = 0, dur = 2.2, vol = 0.16 }) {
  tone(audio, { freq, delay, dur, vol });
  tone(audio, { freq: freq * 2.76, delay, dur: dur * 0.55, vol: vol * 0.35 });
  tone(audio, { freq: freq * 5.4, delay, dur: dur * 0.25, vol: vol * 0.12 });
}

/** Tiếng gõ ngắn: sóng tam giác tần thấp, envelope cực ngắn. */
function knock(audio, { delay = 0 }) {
  tone(audio, { freq: 190, type: "triangle", delay, dur: 0.09, vol: 0.3 });
  tone(audio, { freq: 95, type: "square", delay, dur: 0.05, vol: 0.08 });
}

const SOUND_RECIPES = {
  // Chuông định tâm: một tiếng chuông trong, ngân dài ~2,5 giây.
  "focus-bell": (a) => bell(a, { freq: 880, dur: 2.5, vol: 0.17 }),
  // Kèn chiến thắng: fanfare 4 nốt tăng dần Đô–Mi–Sol–Đô cao.
  fanfare: (a) => {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      tone(a, { freq, type: "triangle", delay: i * 0.14, dur: i === notes.length - 1 ? 0.7 : 0.22, vol: 0.2 });
      tone(a, { freq: freq / 2, type: "square", delay: i * 0.14, dur: i === notes.length - 1 ? 0.7 : 0.22, vol: 0.05 });
    });
  },
  // Tín hiệu chú ý: hai tiếng "ting" cao nối tiếp.
  attention: (a) => {
    tone(a, { freq: 1567.98, delay: 0, dur: 0.28, vol: 0.16 });
    tone(a, { freq: 1567.98, delay: 0.22, dur: 0.45, vol: 0.16 });
  },
  // Gõ nhịp suy nghĩ: 5 nhịp gõ đều, cách nhau 0,6 giây.
  "thinking-knock": (a) => {
    for (let i = 0; i < 5; i += 1) knock(a, { delay: i * 0.6 });
  },
  // Chuông kết thúc: hai hồi chuông cách nhau ~1 giây.
  "end-bell": (a) => {
    bell(a, { freq: 783.99, delay: 0, dur: 1.4, vol: 0.17 });
    bell(a, { freq: 783.99, delay: 1.0, dur: 2.0, vol: 0.17 });
  },
  // Ting ting điểm: hợp âm rải 3 nốt vui tăng dần.
  "point-ting": (a) => {
    [1046.5, 1318.51, 1567.98].forEach((freq, i) => {
      tone(a, { freq, delay: i * 0.11, dur: 0.5, vol: 0.15 });
    });
  },
};

export const TEACHER_SOUND_KINDS = Object.keys(SOUND_RECIPES);

/** Phát một âm thanh sư phạm theo kind. Im lặng bỏ qua nếu trình duyệt không hỗ trợ. */
export function playTeacherSound(kind) {
  const recipe = SOUND_RECIPES[kind];
  if (!recipe) return;
  const audio = ensureContext();
  if (!audio) return;
  try {
    recipe(audio);
  } catch {
    /* lỗi tổng hợp âm: bỏ qua, không làm gián đoạn giờ học */
  }
}
