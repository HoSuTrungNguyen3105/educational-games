// slideOps.js — Thao tác slide bằng NÚT cho bài PowerPoint ở chế độ JSON
// (Đợt 2 Teacher Document Studio): thêm / nhân bản / xoá / di chuyển.
//
// Các hàm ở đây THUẦN (không chạm DOM/state): nhận đối tượng JSON
// presentation (đã validate) + vị trí, trả đối tượng MỚI. Phía editor
// (DocumentStudioEditor) chịu trách nhiệm: parse + validate bản nháp →
// gọi hàm ở đây → serialize JSON.stringify(…, null, 2) ghi lại vào bản
// nháp của chế độ JSON → dựng lại preview từ model. Nhờ vậy code JSON
// trong editor luôn là nguồn sự thật duy nhất, thao tác nút và gõ code
// không bao giờ lệch nhau.

/** Các loại slide giáo viên có thể thêm từ menu nút "Thêm slide". */
export const SLIDE_TYPE_OPTIONS = [
  { type: "title", label: "Slide tiêu đề" },
  { type: "content", label: "Nội dung (gạch đầu dòng)" },
  { type: "image", label: "Hình ảnh" },
  { type: "two-column", label: "Hai cột" },
  { type: "table", label: "Bảng" },
  { type: "summary", label: "Tổng kết" },
];

/**
 * Slide khung sườn theo loại — nội dung mẫu tối thiểu để giáo viên sửa
 * tiếp trong mã JSON. Mọi loại đều qua được validate của schemas.js,
 * NGOẠI TRỪ "image": schema bắt buộc src khác rỗng khi Áp dụng, còn ở
 * đây src để trống có chủ đích (giáo viên dán đường dẫn ảnh thật của
 * mình; preview hiện khung nhắc "chưa có đường dẫn ảnh", xuất file thì
 * có cảnh báo + ghi chú thay thế — không chặn các thao tác khác).
 */
export function emptySlide(type) {
  switch (type) {
    case "title": return { type: "title", title: "Tiêu đề mới", subtitle: "" };
    case "image": return { type: "image", title: "Slide hình ảnh mới", src: "", caption: "" };
    case "two-column": return { type: "two-column", title: "Slide hai cột mới", left: ["Ý cột trái 1", "Ý cột trái 2"], right: ["Ý cột phải 1", "Ý cột phải 2"] };
    case "table": return { type: "table", title: "Bảng mới", rows: [["Cột A", "Cột B"], ["", ""]] };
    case "summary": return { type: "summary", title: "Tổng kết", content: ["Ý chính cần nhớ 1", "Ý chính cần nhớ 2"] };
    default: return { type: "content", title: "Slide mới", content: ["Ý chính 1", "Ý chính 2"] };
  }
}

const cloneSlides = (json) => (json.slides || []).map((s) => JSON.parse(JSON.stringify(s)));
const withSlides = (json, slides) => ({ ...json, slides });
const clampIndex = (i, len) => Math.min(Math.max(0, i), Math.max(0, len - 1));

/** Chèn slide khung sườn NGAY SAU vị trí `index`. Trả { json, index } — index là vị trí slide mới. */
export function insertSlideAfter(json, index, type) {
  const slides = cloneSlides(json);
  const at = slides.length ? clampIndex(index, slides.length) + 1 : 0;
  slides.splice(at, 0, emptySlide(type));
  return { json: withSlides(json, slides), index: at };
}

/** Nhân bản slide tại `index` (bản sao nằm ngay sau bản gốc). */
export function duplicateSlide(json, index) {
  const slides = cloneSlides(json);
  if (!slides.length) return { json, index: 0 };
  const at = clampIndex(index, slides.length);
  slides.splice(at + 1, 0, JSON.parse(JSON.stringify(slides[at])));
  return { json: withSlides(json, slides), index: at + 1 };
}

/** Xoá slide tại `index` — từ chối khi chỉ còn 1 slide (trả null). */
export function removeSlide(json, index) {
  const slides = cloneSlides(json);
  if (slides.length <= 1) return null;
  const at = clampIndex(index, slides.length);
  slides.splice(at, 1);
  return { json: withSlides(json, slides), index: Math.min(at, slides.length - 1) };
}

/** Di chuyển slide tại `index` lên (dir=-1) hoặc xuống (dir=+1); ở biên thì giữ nguyên vị trí. */
export function moveSlide(json, index, dir) {
  const slides = cloneSlides(json);
  if (!slides.length) return { json, index: 0 };
  const from = clampIndex(index, slides.length);
  const to = clampIndex(from + dir, slides.length);
  if (to === from) return { json, index: from };
  const [moved] = slides.splice(from, 1);
  slides.splice(to, 0, moved);
  return { json: withSlides(json, slides), index: to };
}

/** Kéo thả: đưa slide tại `from` tới vị trí `to` (các slide giữa dịch theo). */
export function moveSlideTo(json, from, to) {
  const slides = cloneSlides(json);
  if (!slides.length) return { json, index: 0 };
  const f = clampIndex(from, slides.length);
  const t = clampIndex(to, slides.length);
  if (f === t) return { json, index: f };
  const [moved] = slides.splice(f, 1);
  slides.splice(t, 0, moved);
  return { json: withSlides(json, slides), index: t };
}
