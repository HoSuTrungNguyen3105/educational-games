/* Icon SVG tượng trưng cho từng môn học (thay emoji ở khu "Môn học").
 * Nhận diện môn theo tên (không dấu) cùng cách khớp từ khoá với
 * SUBJECT_META trong lib/subjectMeta.js. Môn lạ thì dùng icon "Chung" (mũ tốt nghiệp). */

const INK = "#2f3b52";
const L = { stroke: INK, strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" };

const ICONS = {
  // Toán: máy tính bỏ túi
  math: (
    <>
      <rect x="11" y="7" width="42" height="50" rx="8" fill="#ffe08a" {...L} />
      <rect x="18" y="14" width="28" height="11" rx="3" fill="#fff" {...L} strokeWidth={2.5} />
      {[22, 32, 42].map((x) =>
        [35, 46].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill={INK} />)
      )}
    </>
  ),
  // Tiếng Việt: quyển sách mở
  viet: (
    <>
      <path d="M32 17C26 12 16 11 8 13V49C16 47 26 48 32 53Z" fill="#ffc9a3" {...L} />
      <path d="M32 17C38 12 48 11 56 13V49C48 47 38 48 32 53Z" fill="#ffe9d6" {...L} />
      <path d="M15 24H25M15 31H25M15 38H25M39 24H49M39 31H49M39 38H49" fill="none" {...L} strokeWidth={2.5} />
    </>
  ),
  // Tiếng Anh: bong bóng thoại "Aa"
  english: (
    <>
      <path
        d="M12 10H52a6 6 0 0 1 6 6V36a6 6 0 0 1-6 6H34L22 54V42H12a6 6 0 0 1-6-6V16a6 6 0 0 1 6-6Z"
        fill="#bfe6f5"
        {...L}
      />
      <text x="32" y="33" textAnchor="middle" fontSize="20" fontWeight="800" fill={INK} fontFamily="system-ui, sans-serif">
        Aa
      </text>
    </>
  ),
  // Khoa học: bình tam giác + bọt khí
  science: (
    <>
      <path d="M20 41H44L50 50a3 3 0 0 1-2.6 4.5H16.6A3 3 0 0 1 14 50Z" fill="#7fd18a" />
      <path d="M26 8H38M28 8V26L12 50a5 5 0 0 0 4.5 7.5H47.5A5 5 0 0 0 52 50L36 26V8" fill="none" {...L} />
      <circle cx="28" cy="46" r="2.5" fill="#fff" />
      <circle cx="37" cy="48" r="2" fill="#fff" />
      <circle cx="33" cy="14" r="2" fill="#7fd18a" stroke={INK} strokeWidth="1.5" />
    </>
  ),
  // Lịch sử / Địa lý: quả địa cầu
  geo: (
    <>
      <circle cx="32" cy="32" r="22" fill="#8fd3f4" {...L} />
      <ellipse cx="32" cy="32" rx="10" ry="22" fill="none" {...L} strokeWidth={2.5} />
      <path d="M10 32H54M14 21H50M14 43H50" fill="none" {...L} strokeWidth={2.5} />
    </>
  ),
  // Tin học: laptop có dấu </>
  it: (
    <>
      <rect x="10" y="11" width="44" height="31" rx="4" fill="#cfe0ff" {...L} />
      <path d="M5 48H59L55 54H9Z" fill="#dcc7f5" {...L} />
      <path d="M26 20L19 26.5L26 33M38 20L45 26.5L38 33" fill="none" {...L} />
    </>
  ),
  // Thể dục: quả bóng
  pe: (
    <>
      <circle cx="32" cy="32" r="22" fill="#fff" {...L} />
      <path d="M32 23L40.5 29L37.5 39H26.5L23.5 29Z" fill={INK} {...L} strokeWidth={2} />
      <path d="M32 23V10M40.5 29L52 24M37.5 39L45 50M26.5 39L19 50M23.5 29L12 24" fill="none" {...L} strokeWidth={2.5} />
    </>
  ),
  // Âm nhạc: nốt nhạc đôi
  music: (
    <>
      <path d="M24 16L48 10V20L24 26Z" fill="#f9bcd6" />
      <path d="M24 46V16L48 10V40" fill="none" {...L} />
      <ellipse cx="18.5" cy="46" rx="6.5" ry="5" fill="#f9bcd6" {...L} />
      <ellipse cx="42.5" cy="40" rx="6.5" ry="5" fill="#f9bcd6" {...L} />
    </>
  ),
  // Chung / môn khác: mũ tốt nghiệp
  general: (
    <>
      <path d="M16 34V46C24 53 40 53 48 46V34L32 41Z" fill="#c2a8f0" {...L} />
      <path d="M32 11L60 25L32 39L4 25Z" fill="#7c5ce0" {...L} />
      <path d="M56 28V42" fill="none" {...L} />
      <circle cx="56" cy="44" r="3" fill="#ffd45e" stroke={INK} strokeWidth="2" />
    </>
  ),
};

const has = (slug, words) => words.some((w) => slug.includes(w));
// Từ khoá ngắn (so, pe) phải đứng riêng một từ, kẻo "special", "sinh học"... khớp nhầm
const hasWord = (slug, words) => words.some((w) => new RegExp(`(^|\\s)${w}(\\s|$)`).test(slug));

export function subjectIconKey(subject = "") {
  const slug = String(subject)
    .toLowerCase()
    .replace(/đ/g, "d") // NFD không tách được "đ" nên phải đổi tay (Địa lý)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (has(slug, ["toan", "math"]) || hasWord(slug, ["so"])) return "math";
  if (has(slug, ["tieng viet", "ngu van"]) || hasWord(slug, ["van"])) return "viet";
  if (has(slug, ["tieng anh", "english"])) return "english";
  if (has(slug, ["khoa hoc", "sinh", "hoa", "vat ly", "science"])) return "science";
  if (has(slug, ["lich su", "dia ly", "history", "geography"])) return "geo";
  if (has(slug, ["tin hoc", "lap trinh", "computer"])) return "it";
  if (has(slug, ["the duc"]) || hasWord(slug, ["pe"])) return "pe";
  if (has(slug, ["am nhac", "music"])) return "music";
  return "general";
}

export default function SubjectIcon({ subject, style }) {
  const key = subjectIconKey(subject);
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label={`Biểu tượng môn ${subject}`}
      style={{ width: "62%", maxWidth: 76, height: "auto", aspectRatio: "1", ...style }}
    >
      {ICONS[key]}
    </svg>
  );
}