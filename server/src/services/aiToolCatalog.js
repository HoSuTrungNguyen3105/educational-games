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
 *
 * Cấu trúc mô tả của MỖI công cụ (vá định tuyến 2026-11-10, sau hai ca
 * production chọn sai/trượt công cụ trên cả gpt-oss-20b lẫn qwen3.8-27b):
 *   PHẠM VI — công cụ tra đúng dữ liệu gì;
 *   "Ví dụ câu hỏi:" — 2–4 câu mẫu tiếng Việt, gồm cả cách diễn đạt đời
 *     thường admin hay dùng (model nhỏ bám ví dụ tốt hơn hẳn mô tả trừu
 *     tượng, và test-ai-tool-use dùng chính các ví dụ này để đóng vai
 *     model khi kiểm tra định tuyến);
 *   "Phân biệt:" — ranh giới với công cụ dễ nhầm nhất.
 * Cặp dễ nhầm nhất là overview/new_students: overview là TỔNG SỐ TĨNH
 * toàn hệ thống (không kỳ, không "mới"); BẤT KỲ câu số lượng nào gắn kỳ
 * (hôm nay/tuần này/tháng này) hoặc nhắc đối tượng MỚI đều thuộc công cụ
 * theo kỳ của đúng đối tượng đó. Bản cũ của mô tả overview có câu "hoặc
 * số lượng một loại đối tượng" — chính câu này kéo câu "bao nhiêu học
 * sinh mới tháng này" vào overview trên production.
 */
export const AI_TOOLS = [
  {
    name: "my_permissions",
    description:
      "Tra cứu các QUYỀN của chính người đang hỏi: vai trò của họ được phép làm gì trong hệ thống, " +
      "liệt kê theo mô-đun bằng nhãn tiếng Việt. " +
      "Ví dụ câu hỏi: \"Tôi có những quyền gì?\"; \"Tôi được phép làm gì trong hệ thống?\"; \"Quyền hạn của tôi gồm những gì?\". " +
      "Phân biệt: chỉ dùng khi câu hỏi nói về quyền của CHÍNH người hỏi; câu hỏi về phân quyền cho người khác hay cách phân quyền nói chung là hỏi kiến thức — không dùng công cụ này.",
    parameters: NO_PARAMS,
  },
  {
    name: "overview",
    description:
      "Tổng quan hệ thống tại thời điểm hiện tại: TỔNG số học sinh, giáo viên, quản trị viên, lớp học, trò chơi, " +
      "bài học, câu hỏi trong ngân hàng, bài kiểm tra đã giao và tổng lượt chơi. Đây là các con số TỔNG TĨNH của " +
      "toàn hệ thống — không lọc theo kỳ thời gian, không lọc theo đối tượng mới/cũ, không có danh sách chi tiết. " +
      "Ví dụ câu hỏi: \"Cho xem tình hình hệ thống\"; \"Hệ thống giờ có bao nhiêu người dùng?\"; \"Tổng quan toàn hệ thống hiện nay thế nào?\". " +
      "Phân biệt: nếu câu hỏi gắn một KỲ cụ thể (hôm nay, tuần này, tháng này, tháng trước) hoặc nói về đối tượng MỚI " +
      "(học sinh mới, nội dung mới, lượt hỏi mới) thì KHÔNG dùng công cụ này — hãy dùng công cụ theo kỳ của đúng đối tượng đó " +
      "(học sinh mới → new_students; nội dung mới → content_new; lượt hỏi AI → ai_activity).",
    parameters: NO_PARAMS,
  },
  {
    name: "content_new",
    description:
      "Nội dung MỚI của hệ thống: các trò chơi và bài học MỚI ĐƯỢC TẠO GẦN ĐÂY NHẤT (5 mục mỗi loại, kèm môn, trạng thái, " +
      "ngày tạo) và tổng số câu hỏi hiện có trong ngân hàng câu hỏi. Đây là công cụ trả lời cho MỌI câu hỏi dạng \"có gì mới\" " +
      "về nội dung của trường/hệ thống — kể cả khi câu hỏi nhắc một kỳ cụ thể như tháng này hay tuần này (công cụ trả các mục " +
      "mới nhất, không nhận tham số kỳ). " +
      "Ví dụ câu hỏi: \"Tháng này trường mình có gì mới không?\"; \"Dạo này trường có gì mới không?\"; \"Có game hay bài học nào mới thêm gần đây không?\"; \"Nội dung mới nhất của hệ thống là gì?\". " +
      "Phân biệt: hỏi về NGƯỜI mới (học sinh đăng ký mới, thành viên mới) thì dùng new_students, không dùng công cụ này; hỏi TỔNG SỐ tĩnh toàn hệ thống thì dùng overview.",
    parameters: NO_PARAMS,
  },
  {
    name: "new_students",
    description:
      "Học sinh MỚI ĐĂNG KÝ trong một KỲ (mặc định tháng này): tổng số học sinh mới của kỳ và danh sách tên, lớp, ngày đăng ký. " +
      "Mọi câu hỏi đếm hoặc liệt kê học sinh MỚI — dù có nói chữ \"đăng ký\" hay không — đều thuộc công cụ này. " +
      "Ví dụ câu hỏi: \"Tháng này có bao nhiêu học sinh mới?\"; \"Tháng này có thêm bạn nào mới vào học không?\"; \"Hôm nay có ai đăng ký mới không?\"; \"Tuần này có bao nhiêu học sinh mới đăng ký?\". " +
      "Phân biệt: TỔNG số học sinh của TOÀN hệ thống (không gắn kỳ, không có chữ \"mới\") mới thuộc overview; nội dung mới (game/bài học mới) thuộc content_new.",
    parameters: PERIOD_PARAMS,
  },
  {
    name: "low_scores",
    description:
      "Bài kiểm tra có ĐIỂM THẤP: danh sách học sinh có bài nộp dưới ngưỡng điểm thấp đang cấu hình trong hệ thống " +
      "(ngưỡng do quản trị đặt sẵn trong cấu hình, KHÔNG nhận ngưỡng từ câu hỏi hay tham số; chưa cấu hình thì backend " +
      "trả trạng thái để AI hỏi lại ngưỡng). " +
      "Ví dụ câu hỏi: \"Học sinh nào điểm thấp cần quan tâm?\"; \"Bài kiểm tra nào có nhiều bài nộp điểm kém?\"; \"Danh sách học sinh điểm thấp tháng này\". " +
      "Phân biệt: hỏi ĐIỂM TRUNG BÌNH/theo lớp/theo môn thì dùng stats; hỏi học sinh có điểm GIẢM dần theo thời gian thì dùng declining.",
    parameters: PERIOD_PARAMS,
  },
  {
    name: "unfinished",
    description:
      "Học sinh CHƯA HOÀN THÀNH bài kiểm tra đang mở: theo từng bài — số học sinh chưa nộp, số em đang làm dở và tên các em. " +
      "Ví dụ câu hỏi: \"Ai chưa nộp bài kiểm tra?\"; \"Học sinh nào chưa làm xong bài đang mở?\"; \"Bài nào còn nhiều em chưa hoàn thành?\". " +
      "Phân biệt: học sinh ĐÃ nộp nhưng điểm thấp thì thuộc low_scores, không phải công cụ này.",
    parameters: NO_PARAMS,
  },
  {
    name: "stats",
    description:
      "THỐNG KÊ kết quả học tập: điểm trung bình theo lớp (và lớp có trung bình thấp nhất) cùng tỉ lệ đúng trung bình theo môn. " +
      "Ví dụ câu hỏi: \"Điểm trung bình theo lớp thế nào?\"; \"Thống kê kết quả học tập theo môn\"; \"Lớp nào điểm trung bình thấp nhất?\". " +
      "Phân biệt: hỏi DANH SÁCH bài nộp dưới một ngưỡng điểm thì dùng low_scores; hỏi riêng học sinh sa sút thì dùng declining.",
    parameters: NO_PARAMS,
  },
  {
    name: "declining",
    description:
      "Học sinh có KẾT QUẢ GIẢM rõ rệt theo thời gian: điểm trung bình nửa sau thấp hơn nửa đầu từ 5 điểm trở lên (so các lần kiểm tra của chính em đó). " +
      "Ví dụ câu hỏi: \"Học sinh nào đang sa sút?\"; \"Em nào điểm đi xuống gần đây?\"; \"Kết quả học tập của ai giảm rõ rệt?\". " +
      "Phân biệt: điểm thấp tại MỘT thời điểm (không so với trước đây) thì dùng low_scores; điểm trung bình chung theo lớp/môn thì dùng stats.",
    parameters: NO_PARAMS,
  },
  {
    name: "support_backlog",
    description:
      "Báo cáo người dùng vi phạm CHƯA XỬ LÝ và yêu cầu hỗ trợ (ticket) đang chờ xử lý: số lượng tồn đọng và các mục gần nhất. " +
      "Ví dụ câu hỏi: \"Có báo cáo vi phạm nào chưa xử lý không?\"; \"Ticket hỗ trợ còn tồn đọng bao nhiêu?\"; \"Yêu cầu hỗ trợ nào đang chờ xử lý?\". " +
      "Phân biệt: hỏi về lượt hỏi/trò chuyện với AI Bạn Học thì dùng ai_activity, không phải công cụ này.",
    parameters: NO_PARAMS,
  },
  {
    name: "ai_activity",
    description:
      "HOẠT ĐỘNG HỎI AI trong một kỳ (mặc định tuần này): tổng lượt hỏi AI Bạn Học, tách chat thường và tra cứu quản trị, " +
      "người hỏi nhiều nhất và các câu hỏi gần nhất. " +
      "Ví dụ câu hỏi: \"Tuần này có bao nhiêu lượt hỏi AI?\"; \"Học sinh hỏi AI những gì nhiều nhất?\"; \"Hoạt động AI Bạn Học dạo này thế nào?\". " +
      "Phân biệt: hỏi TRẠNG THÁI/CẤU HÌNH của AI (đang bật/tắt, model đang dùng, ngưỡng đã đặt chưa) thì dùng ai_config.",
    parameters: PERIOD_PARAMS,
  },
  {
    name: "ai_config",
    description:
      "TRẠNG THÁI CẤU HÌNH của trợ lý AI: đang bật hay tắt, nhà cung cấp và model đang dùng, ngưỡng điểm thấp đã được đặt hay chưa " +
      "(chỉ trạng thái an toàn, không có khoá bí mật). " +
      "Ví dụ câu hỏi: \"AI đang dùng model nào?\"; \"Trợ lý AI đang bật hay tắt?\"; \"Ngưỡng điểm thấp đã đặt chưa?\". " +
      "Phân biệt: hỏi LƯỢT HỎI AI/người dùng đã hỏi những gì thì dùng ai_activity.",
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
