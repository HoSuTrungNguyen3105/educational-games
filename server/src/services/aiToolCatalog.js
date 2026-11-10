// services/aiToolCatalog.js
//
// DANH MỤC CÔNG CỤ của đường A — "AI tự chọn công cụ, backend thực thi"
// (Nguyên chốt hướng 2026-11-10). Mỗi công cụ là một nhóm tra cứu quản trị
// ĐÃ CÓ của aiAdminQueryService (11 nhóm của các đợt #74/#80/#81), bọc lại
// thành định nghĩa cho model chọn: tên, mô tả tiếng Việt để model hiểu khi
// nào dùng, và schema tham số chặt. Hàm thực thi KHÔNG viết lại logic truy
// vấn — mọi công cụ đều đi qua executeAdminQuery dùng chung với đường từ
// khoá, nên hai đường không bao giờ trôi lệch dữ liệu.
//
// Nguyên tắc an toàn (cứng, không nới):
//  - Model CHỈ được chọn trong danh mục này. Tên công cụ lạ → bỏ qua an
//    toàn ở aiToolUseService (chống model bịa công cụ).
//  - Tham số model chọn PHẢI qua validateToolArgs: kỳ thời gian chỉ thuộc
//    {today, week, month, last_month}; tham số ngoài schema bị LOẠI BỎ.
//    Ngưỡng điểm thấp KHÔNG BAO GIỜ là tham số công cụ — ngưỡng luôn lấy
//    từ cấu hình ai.lowScoreThreshold do admin đặt (giữ nguyên luật #74:
//    chưa cấu hình thì AI hỏi lại, không tự đặt số).
//  - Model không thấy URL endpoint, token hay khoá nào: định nghĩa công
//    cụ chỉ gồm tên + mô tả nghiệp vụ + schema tham số. Việc thực thi là
//    lời gọi service nội bộ trong cùng tiến trình backend.

import { executeAdminQuery } from "./aiAdminQueryService.js";

/** Các kỳ thời gian hợp lệ — khớp PERIOD_PATTERNS/periodRange của aiAdminQueryService. */
export const TOOL_PERIODS = ["today", "week", "month", "last_month"];

const periodProperty = {
  type: "string",
  enum: TOOL_PERIODS,
  description:
    "Kỳ thời gian tra cứu theo giờ Việt Nam: today = hôm nay, week = tuần này, " +
    "month = tháng này, last_month = tháng trước. Chỉ đặt khi người hỏi nhắc " +
    "tới một khoảng thời gian cụ thể; không nhắc thì bỏ qua để dùng kỳ mặc định.",
};

const NO_PARAMS = { type: "object", properties: {}, additionalProperties: false };
const PERIOD_PARAMS = {
  type: "object",
  properties: { period: periodProperty },
  additionalProperties: false,
};

/**
 * Danh mục công cụ. `type` = loại tra cứu tương ứng trong
 * aiAdminQueryService (giữ nguyên tên để audit/ai_chat_logs dùng chung một
 * hệ queryType với đường từ khoá). Thứ tự liệt kê không mang ý nghĩa ưu
 * tiên — model tự chọn theo mô tả.
 */
export const AI_TOOLS = [
  {
    name: "my_permissions",
    description:
      "Tra cứu các QUYỀN của chính người đang hỏi (admin tự hỏi mình có những quyền gì, " +
      "được phép làm gì trong hệ thống). Chỉ dùng khi câu hỏi nói về quyền của CHÍNH người hỏi; " +
      "không dùng cho câu hỏi về phân quyền cho người khác hay cách phân quyền nói chung.",
    parameters: NO_PARAMS,
  },
  {
    name: "overview",
    description:
      "Tổng quan hệ thống: tổng số học sinh, giáo viên, quản trị viên, lớp học, trò chơi, " +
      "bài học, câu hỏi trong ngân hàng, bài kiểm tra đã giao và tổng lượt chơi. Dùng khi " +
      "người hỏi muốn biết quy mô/tình hình chung của hệ thống hoặc số lượng một loại đối tượng.",
    parameters: NO_PARAMS,
  },
  {
    name: "content_new",
    description:
      "Nội dung MỚI NHẤT của hệ thống: các trò chơi và bài học vừa được tạo gần đây, kèm " +
      "tổng số câu hỏi hiện có trong ngân hàng câu hỏi. Dùng khi người hỏi hỏi có gì mới, " +
      "nội dung mới thêm gần đây, hoặc tình hình nội dung của trường/hệ thống trong một kỳ.",
    parameters: NO_PARAMS,
  },
  {
    name: "new_students",
    description:
      "Học sinh MỚI ĐĂNG KÝ trong một kỳ (mặc định tháng này): tổng số và danh sách tên, lớp, " +
      "ngày đăng ký. Dùng khi người hỏi hỏi về học sinh mới, lượt đăng ký mới trong kỳ.",
    parameters: PERIOD_PARAMS,
  },
  {
    name: "low_scores",
    description:
      "Bài kiểm tra có ĐIỂM THẤP: danh sách học sinh có bài nộp dưới ngưỡng điểm thấp đang " +
      "cấu hình trong hệ thống (ngưỡng do quản trị đặt sẵn, KHÔNG nhận ngưỡng từ câu hỏi hay " +
      "tham số). Dùng khi người hỏi hỏi về điểm thấp, học sinh yếu, bài nộp kém.",
    parameters: PERIOD_PARAMS,
  },
  {
    name: "unfinished",
    description:
      "Học sinh CHƯA HOÀN THÀNH bài kiểm tra đang mở: theo từng bài — số học sinh chưa nộp, " +
      "số em đang làm dở và tên các em. Dùng khi người hỏi hỏi ai chưa nộp/chưa làm xong bài.",
    parameters: NO_PARAMS,
  },
  {
    name: "stats",
    description:
      "THỐNG KÊ kết quả học tập: điểm trung bình theo lớp (và lớp thấp nhất) cùng tỉ lệ đúng " +
      "trung bình theo môn. Dùng khi người hỏi hỏi thống kê, điểm trung bình, so sánh theo lớp/môn.",
    parameters: NO_PARAMS,
  },
  {
    name: "declining",
    description:
      "Học sinh có KẾT QUẢ GIẢM rõ rệt so với các lần kiểm tra trước (điểm trung bình nửa sau " +
      "thấp hơn nửa đầu từ 5 điểm trở lên). Dùng khi người hỏi hỏi học sinh nào đang sa sút, " +
      "điểm đi xuống, cần quan tâm.",
    parameters: NO_PARAMS,
  },
  {
    name: "support_backlog",
    description:
      "Báo cáo người dùng vi phạm CHƯA XỬ LÝ và yêu cầu hỗ trợ đang chờ xử lý (số lượng + các " +
      "mục gần nhất). Dùng khi người hỏi hỏi về báo cáo xấu, ticket/phiếu hỗ trợ còn tồn đọng.",
    parameters: NO_PARAMS,
  },
  {
    name: "ai_activity",
    description:
      "HOẠT ĐỘNG HỎI AI trong một kỳ (mặc định tuần này): tổng lượt hỏi, tách chat thường và " +
      "tra cứu quản trị, người hỏi nhiều nhất và các câu hỏi gần nhất. Dùng khi người hỏi hỏi " +
      "về tình hình sử dụng AI Bạn Học.",
    parameters: PERIOD_PARAMS,
  },
  {
    name: "ai_config",
    description:
      "TRẠNG THÁI CẤU HÌNH của trợ lý AI: đang bật hay tắt, nhà cung cấp và model đang dùng, " +
      "ngưỡng điểm thấp đã được đặt hay chưa (chỉ trạng thái, không có khoá bí mật). Dùng khi " +
      "người hỏi hỏi về cấu hình/trạng thái của AI hoặc model đang chạy.",
    parameters: NO_PARAMS,
  },
];

const TOOL_BY_NAME = new Map(AI_TOOLS.map((t) => [t.name, t]));

/** Định nghĩa công cụ theo đúng định dạng `tools` của API tương thích OpenAI. */
export function toolDefinitionsForModel() {
  return AI_TOOLS.map((t) => ({
    type: "function",
    function: { name: t.name, description: t.description, parameters: t.parameters },
  }));
}

/** Tên có nằm trong danh mục không (chống model bịa công cụ). */
export function isKnownTool(name) {
  return TOOL_BY_NAME.has(String(name || ""));
}

/**
 * Validate + làm sạch tham số model chọn cho một công cụ. Hàm thuần.
 * - Công cụ không tồn tại → null (caller bỏ qua lời gọi này).
 * - `period` ngoài tập cho phép → BỎ (null = kỳ mặc định của tra cứu),
 *   không bao giờ truyền giá trị lạ xuống tầng dữ liệu.
 * - Mọi khoá ngoài schema (kể cả `threshold` model tự thêm) bị LOẠI BỎ —
 *   ngưỡng điểm thấp chỉ đến từ cấu hình hệ thống.
 * @returns {null|{period: string|null}}
 */
export function validateToolArgs(name, rawArgs) {
  const tool = TOOL_BY_NAME.get(String(name || ""));
  if (!tool) return null;
  let args = rawArgs;
  if (typeof args === "string") {
    try { args = JSON.parse(args); } catch { return null; }
  }
  if (args == null || typeof args !== "object" || Array.isArray(args)) args = {};
  const allowsPeriod = Object.prototype.hasOwnProperty.call(tool.parameters.properties || {}, "period");
  const period = allowsPeriod && TOOL_PERIODS.includes(args.period) ? args.period : null;
  return { period };
}

/**
 * Thực thi một lời gọi công cụ ĐÃ qua validate qua điểm thực thi dùng
 * chung executeAdminQuery (selection = "tool" để audit phân biệt đường).
 * @returns {Promise<null|{type, needsThreshold, resultCount, text, selection}>}
 */
export async function executeToolCall(name, rawArgs, { req, identity } = {}) {
  const args = validateToolArgs(name, rawArgs);
  if (!args) return null;
  return executeAdminQuery(
    { type: String(name), period: args.period },
    { req, identity, selection: "tool" },
  );
}
