// templates.js — Điểm vào tương thích cho thư viện 20 mẫu tài liệu.
//
// Toàn bộ dữ liệu mẫu nằm trong templateCatalog.js. File này giữ lại các
// tên API cũ (templateSourceFor + hai hằng mẫu đầu tiên) để các màn hình
// đã viết trước đây không phải sửa import, đồng thời re-export API mới.
export {
  GRADE_FILTERS,
  POWERPOINT_TEMPLATES,
  PPT_CATEGORY_FILTERS,
  TEMPLATE_CATALOG,
  WORD_CATEGORY_FILTERS,
  WORD_TEMPLATES,
  getTemplate,
  sourceForTemplate,
  templateModel,
  templatesFor,
} from "./templateCatalog.js";

import {
  POWERPOINT_TEMPLATES,
  WORD_TEMPLATES,
  templateSourceFor,
} from "./templateCatalog.js";

// Các hằng cũ từng được dùng trong tài liệu/đoạn mã mẫu.
export const WORD_HTML_TEMPLATE = WORD_TEMPLATES[0].html;
export const POWERPOINT_HTML_TEMPLATE = POWERPOINT_TEMPLATES[0].html;
export const WORD_JSON_TEMPLATE_OBJ = WORD_TEMPLATES[0].json;
export const PPT_JSON_TEMPLATE_OBJ = POWERPOINT_TEMPLATES[0].json;
export const WORD_JSON_TEMPLATE = WORD_TEMPLATES[0].sourceFor("json");
export const PPT_JSON_TEMPLATE = POWERPOINT_TEMPLATES[0].sourceFor("json");
export const POWERPOINT_JSON_TEMPLATE = PPT_JSON_TEMPLATE;

// Giữ chữ ký cũ: templateSourceFor(docType, mode, templateId?)
export { templateSourceFor };
