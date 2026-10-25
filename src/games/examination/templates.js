/**
 * templates.js — danh mục MẪU ĐỀ THI (khác với game thường).
 *
 * Mỗi mẫu là một file HTML tự chứa nằm ngay trong thư mục này, Vite nạp về
 * dạng chuỗi qua `?raw` nên không cần gọi /api/templates (mất ~7s cho 1.7MB).
 *
 * Bài giao lưu `templateId` của mẫu đã chọn (xem assignmentService phía server).
 * Không có templateId → trang làm bài render form trắc nghiệm React mặc định.
 *
 * HTML mẫu KHÔNG được gọi API: câu hỏi do frame cha đẩy xuống qua postMessage,
 * đáp án gửi ngược lên để server chấm. Xem ExamPlayer.jsx.
 */
import thithapHtml from "./thithap.html?raw";
import thithap3dHtml from "./thithap-3d.html?raw";

export const EXAM_TEMPLATES = [
  {
    id: "thithap",
    name: "🐲 Đại Chiến Boss Tri Thức",
    html: thithapHtml,
    desc: "Leo tháp, mỗi câu hỏi là một con quái. Điểm server chấm quyết định boss mất bao nhiêu máu.",
    style: "2D",
  },
  {
    id: "thithap-3d",
    name: "🗡️ Đấu Trường Phong Linh 3D",
    html: thithap3dHtml,
    desc: "Đi lại trong thế giới 3D, tìm thủ vệ để thách đấu từng câu, cuối trận đánh Thạch Giáp.",
    style: "3D",
  },
];

const BY_ID = Object.fromEntries(EXAM_TEMPLATES.map(t => [t.id, t]));

export function getExamTemplate(id) {
  return BY_ID[String(id || "")] || null;
}

/** Tên hiển thị cho UI (admin/liệt kê); id lạ hoặc trống → null. */
export function examTemplateName(id) {
  return getExamTemplate(id)?.name || null;
}
