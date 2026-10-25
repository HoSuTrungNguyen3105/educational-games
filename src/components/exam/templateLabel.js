import { examTemplateName } from "../../games/examination/templates.js";

/**
 * Nhãn "hình thức làm bài" cho UI quản trị (danh sách, tóm tắt, sửa bài).
 * Template đã gỡ khỏi bundle vẫn hiện được id để giáo viên biết bài nào cần sửa.
 */
export function templateLabel(templateId) {
  if (!templateId) return "Danh sách câu hỏi";
  return examTemplateName(templateId) || `Mẫu đã gỡ · ${String(templateId).slice(0, 8)}`;
}
