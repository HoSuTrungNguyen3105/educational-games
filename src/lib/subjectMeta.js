// ─── Metadata môn học DÙNG CHUNG (trang chủ + trang Danh mục) ──────────
// Trước đây các helper này nằm trong HomeScreen.jsx nên trang khác muốn
// dùng phải viết lại; nay tách ra lib để một nguồn sự thật duy nhất.

export const NO_SUBJECT = "Chung";
export const subjectLabel = (subject) => (subject && subject.trim()) || NO_SUBJECT;

/* Màu nền ô tròn của mỗi thẻ. Băm theo khoá nên màu giữ nguyên giữa các
   lần render và giữa các lần F5. */
export const CARD_TINTS = [
  "#8fd3f4", "#ffc9a3", "#c2e9c8", "#dcc7f5",
  "#ffe08a", "#bfe6f5", "#f9bcd6", "#cfe0ff",
];

// Băm chuỗi về số nguyên để màu ổn định giữa các lần render.
export function hashString(s = "") {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (s.charCodeAt(i) + ((h << 5) - h)) | 0;
  return Math.abs(h);
}

export const tintFor = (key = "") => CARD_TINTS[hashString(key) % CARD_TINTS.length];

// ─── Card môn học ───────────────────────────────────────────────────────
// Mỗi môn lấy từ API (`games[].subject`) nên tên tuỳ ý. Bảng dưới khớp
// theo từ khoá; môn không khớp thì nhận màu theo thứ tự băm, và câu mô
// tả luôn nhắc lại tên môn nên không bao giờ hiện sai nội dung.
// Bảng màu + nhóm tuổi gợi ý theo môn học.
// `kind` quyết định badge trên ô game (Học/Chơi); `age` là pill "2–8 tuổi".
// LƯU Ý: `age` ở đây là nhãn GỢI Ý cố định theo môn (không phải dữ liệu
// tuổi trên từng game — game không có trường tuổi), nên không dùng làm
// bộ lọc độ tuổi được.
export const SUBJECT_META = [
  { keys: ["toan", "math", "so"], kind: "learn", age: "2–8 tuổi", icon: "🧮", desc: "Rèn luyện tư duy và kỹ năng tính toán" },
  { keys: ["tieng viet", "ngu van", "van"], kind: "learn", age: "3–7 tuổi", icon: "📖", desc: "Luyện đọc, viết và mở rộng vốn từ" },
  { keys: ["tieng anh", "english"], kind: "learn", age: "4–8 tuổi", icon: "🗣️", desc: "Luyện nói và từ vựng tiếng Anh" },
  { keys: ["khoa hoc", "sinh", "hoa", "vat ly", "science"], kind: "learn", age: "5–8 tuổi", icon: "🔬", desc: "Khám phá thế giới xung quanh" },
  { keys: ["lich su", "dia ly", "history", "geography"], kind: "learn", age: "6–8 tuổi", icon: "🌍", desc: "Khám phá về hóa và các cùng miền" },
  { keys: ["tin hoc", "lap trinh", "computer"], kind: "play", age: "6–8 tuổi", icon: "💻", desc: "Lập trình và tư duy máy tính" },
  { keys: ["the duc", "pe"], kind: "play", age: "5–8 tuổi", icon: "⚽", desc: "Vận động và rèn luyện sức khoẻ" },
  { keys: ["am nhac", "music"], kind: "play", age: "4–8 tuổi", icon: "🎵", desc: "Khám phá thế giới âm nhạc" },
];

/** Tên chủ đề gốc của một game: trường `topic` sau khi bỏ hậu tố biến
 *  thể "· Đối kháng". Hai biến thể solo / đối kháng của cùng một game
 *  chỉ khác nhau ở hậu tố này (khớp 1-1 với playMode "classroom"), nên
 *  trang Danh mục gộp chúng về một chủ đề bằng hàm này. */
export function topicBaseName(topic) {
  const t = String(topic || "").replace(/\s+/g, " ").trim();
  return t.replace(/\s*·\s*Đối kháng\s*$/i, "").trim();
}

export function metaForSubject(subject = "") {
  const slug = subject.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const hit = SUBJECT_META.find((m) => m.keys.some((k) => slug.includes(k)));
  if (hit) return hit;
  return { ...SUBJECT_META[hashString(subject) % SUBJECT_META.length], desc: `Thử thách môn ${subject} với những câu hỏi thú vị` };
}
