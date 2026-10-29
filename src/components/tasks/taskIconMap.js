/**
 * taskIconMap.js — bảng tra icon SVG cho nhiệm vụ.
 *
 * Nguyên tắc: frontend TỰ VẼ icon, không hiển thị field `icon` (emoji) mà API
 * trả về nữa. Thứ tự ưu tiên: `code` trước (VD: "PLAY_10" → tay cầm game),
 * code không khớp mới đến `type`, cuối cùng là kẹp giấy.
 *
 * Tách riêng khỏi TaskIcon.jsx vì ESLint (react-refresh) bắt mỗi file component
 * chỉ export component.
 */

export const ICON_PATHS = {
  // tay cầm game
  gamepad: [
    "M7.5 7h9a5 5 0 0 1 0 10h-9a5 5 0 0 1 0-10Z",
    "M9.5 9.5v5",
    "M7 12h5",
    "M16 10.5h.01",
    "M17.5 13.2h.01",
  ],
  // cúp
  trophy: [
    "M7.6 4.6h8.8v4.2a4.4 4.4 0 0 1-8.8 0Z",
    "M7.6 5.8H4.6v1.4a3 3 0 0 0 3 3",
    "M16.4 5.8h3v1.4a3 3 0 0 1-3 3",
    "M12 13.2v3",
    "M12 16.2l2.4 3.2H9.6Z",
  ],
  // bóng thoại có dấu ? — trả lời câu hỏi
  question: [
    "M4.4 5.6h15.2v9.2H11l-4.4 3.4v-3.4H4.4Z",
    "M10.4 8.6a2 2 0 1 1 2.9 1.9c-.8.4-1.3 1-1.3 1.7",
    "M12 13.4h.01",
  ],
  // vòng tròn có dấu tích — trả lời đúng
  check: [
    "M12 3.8a8.2 8.2 0 1 1 0 16.4 8.2 8.2 0 0 1 0-16.4Z",
    "M8.3 12.1l2.6 2.6 4.9-5.1",
  ],
  // ngôi sao — XP
  star: [
    "M12 4l2.3 4.6 5.1.8-3.7 3.6.9 5.1-4.6-2.4-4.6 2.4.9-5.1-3.7-3.6 5.1-.8Z",
  ],
  // mũi tên vào cửa — đăng nhập / điểm danh
  login: [
    "M14 4.6h4.6v14.8H14",
    "M4.8 12h8.8",
    "M10.2 8.4l3.6 3.6-3.6 3.6",
  ],
  // vòng quay
  spin: [
    "M19.4 12a7.4 7.4 0 1 1-2.1-5.2",
    "M17.6 3.6v3.4h-3.4",
    "M8.6 12a3.4 3.4 0 1 1 6.8 0 3.4 3.4 0 0 1-6.8 0Z",
  ],
  // mầm cây — vườn / trồng cây
  sprout: [
    "M12 20.2v-6.6",
    "M12 13.6C12 10 9.4 7.6 6 7.6c0 3.6 2.6 6 6 6Z",
    "M12 13.6c0-3.6 2.6-6 6-6 0 3.6-2.6 6-6 6Z",
  ],
  // sách — đọc / học
  book: [
    "M12 6.6C10.6 5.2 8.8 4.7 5.4 4.7v12.9c3.4 0 5.2.5 6.6 1.9 1.4-1.4 3.2-1.9 6.6-1.9V4.7c-3.4 0-5.2.5-6.6 1.9Z",
    "M12 6.6v12.9",
  ],
  // bóng thoại — chat / nhắn tin
  chat: [
    "M4.4 5.6h15.2v9.2H11l-4.4 3.4v-3.4H4.4Z",
    "M8.6 10.2h.01",
    "M12 10.2h.01",
    "M15.4 10.2h.01",
  ],
  // hộp quà — coin / thưởng
  gift: [
    "M5 11.4h14V19.6H5Z",
    "M4 8.4h16v3H4Z",
    "M12 8.4v11.2",
    "M12 8.4C11 5.6 6.6 6 6.6 8.4Z",
    "M12 8.4C13 5.6 17.4 6 17.4 8.4Z",
  ],
  // kẹp giấy — mặc định khi code/type lạ
  clipboard: [
    "M8.4 5.6H6.8a1.4 1.4 0 0 0-1.4 1.4v11.4a1.4 1.4 0 0 0 1.4 1.4h10.4a1.4 1.4 0 0 0 1.4-1.4V7a1.4 1.4 0 0 0-1.4-1.4h-1.6",
    "M8.8 4h6.4v3.2H8.8Z",
    "M9 11.6h6",
    "M9 15h4",
  ],
};

/** So khớp `code` (không phân biệt hoa/thường, bỏ dấu gạch giữa các từ). */
export const CODE_RULES = [
  [/^PLAY/, "gamepad"],
  [/^(WIN|TOP|FIRST)/, "trophy"],
  [/^(ANSWER|QUESTION|QUIZ|EXAM|TEST)/, "question"],
  [/^(CORRECT|TRUE|RIGHT)/, "check"],
  [/^(XP|LEVEL|STAR)/, "star"],
  [/^(LOGIN|SIGNIN|ATTEND|CHECKIN|DAILY)/, "login"],
  [/^SPIN/, "spin"],
  [/^(PLANT|GARDEN|TREE|WATER|SEED)/, "sprout"],
  [/^(READ|LEARN|STUDY|SUBJECT)/, "book"],
  [/^(CHAT|MESSAGE|TALK|FRIEND|INVITE)/, "chat"],
  [/^(COIN|REWARD|GIFT|CLAIM|SHOP|BUY)/, "gift"],
];

export const TYPE_TO_ICON = {
  GAME_PLAYED: "gamepad",
  GAME_WON: "trophy",
  QUESTION_ANSWERED: "question",
  ANSWER_CORRECT: "check",
  XP_EARNED: "star",
  LOGIN: "login",
  ATTENDANCE: "login",
  play_game: "gamepad",
  win_game: "trophy",
  answer_question: "question",
  correct_answer: "check",
  earn_xp: "star",
  login: "login",
};

const norm = (s) => String(s || "").trim().toUpperCase().replace(/[-\s]+/g, "_");

/** "PLAY_10" → "gamepad"; không khớp thì theo `type`; cuối cùng "clipboard". */
export function taskIconName(code, type) {
  const c = norm(code);
  if (c) {
    const hit = CODE_RULES.find(([re]) => re.test(c));
    if (hit) return hit[1];
  }
  return TYPE_TO_ICON[String(type || "").trim()] || TYPE_TO_ICON[norm(type)] || "clipboard";
}
