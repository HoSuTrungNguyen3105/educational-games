/**
 * ageCurriculum.js — "lớp này nên học gì".
 *
 * Trước đây khối Cài đặt chỉ có 3 ô chủ đề cố định cho MỌI độ tuổi
 * (`TOPIC_SHORTCUTS` cũ trong KidSettingsCard.jsx). Giờ mỗi Lớp 1→5 khai báo
 * trọng tâm + 3 chủ đề, mỗi chủ đề trỏ tới một game có thật trong
 * `src/games/offline/games-src/manifest.js` (route `/offline/:gameId`).
 *
 * Thêm chủ đề  → thêm dòng vào `topics` của lớp đó.
 * Đổi game    → sửa `gameId`, id phải khớp manifest.
 * Xoá chủ đề  → xoá dòng (card tự co lại, không cần sửa KidSettingsCard).
 */

import { clampGrade, gradeForAge } from "../lib/kidSettings.js";

export const CURRICULUM_BY_GRADE = {
  1: {
    focus: "Nhận biết số, chữ cái, màu sắc — học ngắn theo từng màn 10–15 phút.",
    topics: [
      { icon: "🔢", name: "Đếm 1–20", sub: "Số học", gameId: "math" },
      { icon: "🔤", name: "Bảng chữ cái", sub: "Tiếng Việt", gameId: "anagram" },
      { icon: "🧊", name: "Hình khối & màu", sub: "Logic", gameId: "xep-khoi" },
    ],
  },
  2: {
    focus: "Cộng trừ trong 100, ghi nhớ có chủ đích, tập đọc hiểu câu ngắn.",
    topics: [
      { icon: "➕", name: "Cộng trừ trong 100", sub: "Toán", gameId: "bang-tinh" },
      { icon: "🃏", name: "Ghép cặp hình", sub: "Trí nhớ", gameId: "memory" },
      { icon: "🌱", name: "Tìm cặp theo chủ đề", sub: "Quan sát", gameId: "ghep-cap-vuon" },
    ],
  },
  3: {
    focus: "Bảng nhân chia, tìm quy luật dãy số, tăng tốc độ đọc.",
    topics: [
      { icon: "🍉", name: "Ghép ô số", sub: "Luyện tính", gameId: "g2048" },
      { icon: "⭐", name: "Tìm quy luật", sub: "Logic", gameId: "pattern" },
      { icon: "🎉", name: "Hỏi đáp kiến thức", sub: "Tổng hợp", gameId: "quiz" },
    ],
  },
  4: {
    focus: "Phân số, đo lường, tính tiền — bắt đầu chơi game cần chiến thuật.",
    topics: [
      { icon: "🌻", name: "Thực vật & động vật", sub: "Khoa học", gameId: "plantvsanimal" },
      { icon: "🚜", name: "Tính tiền, quản lý trại", sub: "Toán đời sống", gameId: "nong-trai-moi" },
      { icon: "🏰", name: "Mê cung tri thức", sub: "Đọc hiểu", gameId: "me-cung-tri-thuc" },
    ],
  },
  5: {
    focus: "Toán trộn, suy luận logic, ôn trước buổi kiểm tra.",
    topics: [
      { icon: "🚚", name: "Mua bán & tiền tệ", sub: "Toán áp dụng", gameId: "cargo" },
      { icon: "🌾", name: "Lập kế hoạch phòng thủ", sub: "Chiến thuật", gameId: "fieldrunner" },
      { icon: "🌀", name: "Không gian 3D", sub: "Tư duy", gameId: "me-cung-kham-pha" },
    ],
  },
};

/** Tra theo lớp (1–5) hoặc tuổi (6–10); giá trị lạ thì kẹp về lớp gần nhất. */
export function curriculumFor(gradeOrAge) {
  const g = clampGrade(gradeOrAge >= 6 ? gradeForAge(gradeOrAge) : gradeOrAge);
  return { grade: g, ...CURRICULUM_BY_GRADE[g] };
}

export const curriculumTopicsFor = (gradeOrAge) => curriculumFor(gradeOrAge).topics;

/** Dòng tóm tắt cho bảng "chương trình các lớp". */
export const curriculumSummary = (g) =>
  CURRICULUM_BY_GRADE[clampGrade(g)].topics.map((t) => t.name).join(" · ");

export const CURRICULUM_GRADES = Object.keys(CURRICULUM_BY_GRADE).map(Number);
