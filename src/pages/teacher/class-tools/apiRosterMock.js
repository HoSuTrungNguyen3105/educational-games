/**
 * apiRosterMock.js — cầu nối "Lớp từ hệ thống" cho trang Công cụ lớp học.
 *
 * RosterPanel nạp DANH SÁCH LỚP THẬT từ API /classes (classService.list)
 * để giáo viên chọn lớp của mình ngay trong panel, thay vì phải tự gõ
 * tên lớp. Nhưng danh sách HỌC SINH của các lớp đó ở đây là DỮ LIỆU MẪU
 * (mock) sinh ngay phía client — KHÔNG gọi API học sinh, KHÔNG ghi gì
 * lên server — để giáo viên xem trước cách các tab (Gọi tên / Chia nhóm /
 * Bảng điểm / Chỗ ngồi / Nề nếp) vận hành với một lớp đông đủ. Giao diện
 * gắn nhãn "mẫu (demo)" rõ ràng ở mọi nơi lớp này xuất hiện.
 *
 * Mọi dữ liệu sinh ra đều DETERMINISTIC theo apiClassId (hash FNV-1a +
 * mulberry32): cùng một lớp hệ thống luôn cho cùng danh sách mẫu, cùng
 * id học sinh, cùng sơ đồ chỗ ngồi — nạp lại không nhân đôi, không làm
 * vỡ điểm/nhóm/ghế giáo viên đã chỉnh trên bản sao local.
 *
 * Lớp nạp từ API được lưu vào roster local như một lớp bình thường, cộng:
 *   source: "api"          — đánh dấu nguồn hệ thống
 *   apiClassId: <id lớp trên hệ thống>
 *   apiStudentCount: <sĩ số THẬT trên hệ thống, chỉ để hiển thị đối chiếu>
 *   id (local): "api-<apiClassId>" — ổn định để nhận diện khi nạp lại.
 * Các field phụ (groups/teams/seating…) vẫn qua roster.patchClass như cũ.
 */
import { DEFAULT_SEATING_CONFIG } from "../../../hooks/useClassSeating.js";
import { assignSeatsRandomly } from "./seatingUtils.js";

/** Id của lớp local tương ứng một lớp hệ thống — ổn định theo apiClassId. */
export function apiLocalClassId(apiClassId) {
  return `api-${String(apiClassId ?? "")}`;
}

/** Hash chuỗi → số nguyên 32-bit (FNV-1a) làm hạt giống sinh ngẫu nhiên. */
function hashSeed(text) {
  let h = 2166136261;
  const s = String(text ?? "");
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * RNG deterministic (mulberry32): cùng seed → cùng dãy số, mọi lần chạy.
 * Chỉ dùng cho dữ liệu mẫu — các tính năng chọn ngẫu nhiên thật trong
 * lớp vẫn dùng Math.random qua randomUtils như cũ.
 */
export function seededRng(seed) {
  let a = hashSeed(seed);
  return function next() {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FAMILY_NAMES = [
  "Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Vũ", "Võ", "Phan", "Trương",
  "Bùi", "Đặng", "Đỗ", "Ngô", "Hồ", "Dương", "Đinh", "Đoàn", "Mai", "Trịnh",
];
const MALE_MIDDLES = ["Văn", "Minh", "Quốc", "Tuấn", "Hữu", "Đức", "Quang", "Thanh", "Đình", "Xuân"];
const MALE_NAMES = [
  "An", "Bình", "Cường", "Dũng", "Duy", "Hải", "Hiếu", "Huy", "Khang", "Khánh",
  "Long", "Minh", "Nam", "Phúc", "Quân", "Sơn", "Tài", "Thắng", "Trung", "Tuấn",
  "Việt", "Bảo", "Đăng", "Khoa", "Nhật", "Phát", "Sang", "Tiến", "Vinh", "Hùng",
];
const FEMALE_MIDDLES = ["Thị", "Ngọc", "Phương", "Thanh", "Thu", "Mỹ", "Kim", "Hồng", "Lan", "Khánh"];
const FEMALE_NAMES = [
  "Anh", "Chi", "Dung", "Hà", "Hạnh", "Hoa", "Hồng", "Hương", "Lan", "Linh",
  "Mai", "Ngọc", "Nhung", "Phương", "Quỳnh", "Thảo", "Thu", "Trang", "Tuyết", "Vân",
  "Yến", "Diệu", "Kiều", "Trâm", "Xuân", "Giang", "Huyền",
];

const pickWith = (rng, arr) => arr[Math.floor(rng() * arr.length)];

/** Điểm thi đua mẫu: rải từ 0 tới 60 — vài em 0, đa số trung bình, ít em cao. */
function mockPoints(rng) {
  const r = rng();
  if (r < 0.12) return 0;
  if (r < 0.45) return 3 + Math.floor(rng() * 10); // 3–12
  if (r < 0.8) return 13 + Math.floor(rng() * 20); // 13–32
  return 33 + Math.floor(rng() * 28); // 33–60
}

/**
 * Sinh danh sách học sinh MẪU cho một lớp hệ thống: khoảng 26 em
 * (24–28 tuỳ lớp), tên tiểu học Việt Nam không trùng trong lớp, giới
 * tính trộn nam/nữ, điểm rải đa dạng, 3 em gắn sao "đặc biệt".
 * Id học sinh ổn định: "<localClassId>-hs01", "-hs02", …
 */
export function buildMockStudents(apiClassId) {
  const localId = apiLocalClassId(apiClassId);
  const rng = seededRng(`students:${String(apiClassId ?? "")}`);
  const count = 24 + Math.floor(rng() * 5); // 24–28 em

  // Trộn giới tính: khoảng một nửa nam, một nửa nữ.
  const maleCount = Math.round(count * (0.45 + rng() * 0.1));
  const genders = [
    ...Array.from({ length: maleCount }, () => "male"),
    ...Array.from({ length: count - maleCount }, () => "female"),
  ];
  for (let i = genders.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [genders[i], genders[j]] = [genders[j], genders[i]];
  }

  const usedNames = new Set();
  const students = genders.map((gender, i) => {
    let name = "";
    for (let attempt = 0; attempt < 60; attempt += 1) {
      const candidate = [
        pickWith(rng, FAMILY_NAMES),
        pickWith(rng, gender === "male" ? MALE_MIDDLES : FEMALE_MIDDLES),
        pickWith(rng, gender === "male" ? MALE_NAMES : FEMALE_NAMES),
      ].join(" ");
      if (!usedNames.has(candidate)) {
        name = candidate;
        break;
      }
    }
    if (!name) name = `Học sinh ${i + 1}`; // không bao giờ trùng — chỉ là lưới an toàn
    usedNames.add(name);
    return {
      id: `${localId}-hs${String(i + 1).padStart(2, "0")}`,
      name,
      gender,
      star: false,
      points: mockPoints(rng),
    };
  });

  // 3 em "đặc biệt" (đánh sao) — chọn deterministic theo cùng dãy rng.
  const starIdx = new Set();
  while (starIdx.size < Math.min(3, count)) starIdx.add(Math.floor(rng() * count));
  for (const idx of starIdx) students[idx].star = true;

  return students;
}

/**
 * Sơ đồ chỗ ngồi MẪU cho lớp mới nạp: cấu hình mặc định của tab Chỗ
 * ngồi + xếp toàn bộ học sinh vào ghế bằng đúng thuật toán của tab
 * (assignSeatsRandomly) với rng deterministic theo lớp — mở tab Chỗ
 * ngồi là thấy sơ đồ đã xếp đầy như lớp thật.
 */
export function buildMockSeating(students, apiClassId) {
  const config = { ...DEFAULT_SEATING_CONFIG };
  const { seats } = assignSeatsRandomly({
    students: Array.isArray(students) ? students : [],
    config,
    locked: [],
    pinned: {},
    rng: seededRng(`seating:${String(apiClassId ?? "")}`),
  });
  return { config, seats, locked: [], pinned: {} };
}

/**
 * Dựng object lớp local cho một lớp hệ thống.
 * - Chưa có bản sao (existing = null): sinh đủ học sinh mẫu + sơ đồ mẫu.
 * - Đã có bản sao: CHỈ đồng bộ tên + sĩ số hệ thống; học sinh/điểm/nhóm/
 *   đội giữ nguyên bản giáo viên đã chỉnh; sơ đồ chỉ sinh bổ sung khi
 *   lớp chưa hề có field seating (không bao giờ ghi đè sơ đồ đã xếp).
 */
export function buildApiClassEntry(apiClass, existing = null) {
  const apiClassId = String(apiClass?.id ?? "");
  const localId = apiLocalClassId(apiClassId);
  const name = String(apiClass?.name ?? "").trim() || "Lớp (chưa đặt tên)";
  const rawCount = Number(apiClass?.studentCount);
  const apiStudentCount = Number.isFinite(rawCount) ? rawCount : null;

  if (existing && existing.id === localId) {
    const merged = { ...existing, name, source: "api", apiClassId, apiStudentCount };
    if (!existing.seating) {
      merged.seating = buildMockSeating(existing.students ?? [], apiClassId);
    }
    return merged;
  }

  const students = buildMockStudents(apiClassId);
  return {
    id: localId,
    name,
    students,
    source: "api",
    apiClassId,
    apiStudentCount,
    seating: buildMockSeating(students, apiClassId),
  };
}
