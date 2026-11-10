// services/aiToolUseService.js
//
// VÒNG CHỌN CÔNG CỤ của đường A (Nguyên chốt 2026-11-10): thay cho việc
// backend đoán intent bằng từ khoá, lượt chat của ADMIN được đưa qua MỘT
// lượt gọi model phụ kèm danh mục công cụ (aiToolCatalog) — model tự chọn
// 0, 1 hoặc tối đa 2 công cụ + tham số, backend validate rồi thực thi nội
// bộ qua executeAdminQuery dùng chung, kết quả thật được gắn vào ngữ cảnh
// prompt như đường từ khoá vẫn làm (adminData).
//
// Vì sao giữ đường từ khoá làm FALLBACK (không xoá detectAdminQuery):
//  - Nhà cung cấp/model hiệu lực có thể không hỗ trợ tool calling (đường
//    Ollama không có; model admin chọn nhỡ không hỗ trợ) — lượt chọn lỗi
//    hoặc không trả công cụ nào thì đường từ khoá vẫn cứu được các câu
//    khớp mẫu quen thuộc, chat không bao giờ hỏng vì tính năng mới.
//  - gpt-oss trên Groq từng được cộng đồng báo lỗi 400 tool_use_failed ở
//    tầng provider; nuốt lỗi ở đây là có chủ đích.
// Thứ tự trong buildChatContext: thử đường công cụ TRƯỚC (hiểu được cả
// câu diễn đạt lạ), không có kết quả mới lùi về từ khoá.
//
// Giới hạn bảo vệ mỗi lượt chat:
//  - ĐÚNG 1 lượt gọi model phụ cho việc chọn (không vòng lặp agent);
//    model trả nhiều tool_calls thì chỉ thực thi tối đa MAX_TOOLS_PER_TURN
//    lời gọi đầu tiên hợp lệ.
//  - Timeout dùng chung của gateway (AI_BACKEND_TIMEOUT_MS).
//  - CHỈ chạy cho admin (cổng cứng như runAdminQuery) và CHỈ khi nhà
//    cung cấp hiệu lực là Groq — gateway duy nhất đã tích hợp tool
//    calling; học sinh/giáo viên không bao giờ nhận danh mục công cụ.

import { config } from "../config.js";
import { groqCompleteWithTools } from "./aiGroqGateway.js";
import {
  toolDefinitionsForModel, isKnownTool, validateToolArgs, executeToolCall,
} from "./aiToolCatalog.js";

/** Số công cụ tối đa thực thi trong một lượt chat (model gpt-oss không gọi song song được). */
export const MAX_TOOLS_PER_TURN = 2;

const TOOL_SELECTION_SYSTEM = [
  "Bạn là bộ điều phối tra cứu dữ liệu quản trị của hệ thống học tập EduPlay.",
  "Người đang hỏi là quản trị viên. Nếu câu hỏi cần SỐ LIỆU THẬT của hệ thống (người dùng, lớp, nội dung, điểm số, báo cáo, hoạt động AI, cấu hình AI, hoặc quyền của chính người hỏi) thì hãy GỌI công cụ phù hợp trong danh sách được cấp — có thể gọi tối đa 2 công cụ khi câu hỏi gồm hai ý độc lập.",
  "Khi quản trị viên hỏi về tình hình hay dữ liệu của hệ thống/trường, hãy ƯU TIÊN gọi công cụ phù hợp nhất để backend tra cứu thật, thay vì không gọi gì và trả lời rằng chưa có dữ liệu. Chỉ KHÔNG gọi công cụ khi câu hỏi hoàn toàn là trò chuyện xã giao, hỏi kiến thức chung, hoặc nhờ soạn/viết nội dung.",
  // Quy tắc phân biệt — vá định tuyến 2026-11-10. Hai ca production đã
  // fail trên cả gpt-oss-20b lẫn qwen3.8-27b vì thiếu các quy tắc này:
  // (1) "Tháng này có bao nhiêu học sinh mới?" bị chọn overview thay vì
  // new_students; (2) "Tháng này trường mình có gì mới không?" không nổ
  // công cụ nào (nghe như câu trò chuyện nên model bỏ qua).
  "QUY TẮC PHÂN BIỆT (áp dụng trước khi quyết định không gọi công cụ):",
  "- Ưu tiên công cụ CỤ THỂ đúng đối tượng và đúng kỳ thời gian hơn công cụ TỔNG QUÁT. overview chỉ dành cho TỔNG SỐ tĩnh của toàn hệ thống khi câu hỏi KHÔNG gắn kỳ thời gian và KHÔNG nói về đối tượng mới.",
  "- Mọi câu hỏi SỐ LƯỢNG gắn một kỳ (hôm nay, tuần này, tháng này, tháng trước) hoặc có chữ \"mới\" đều thuộc công cụ theo kỳ của đúng đối tượng đó — ví dụ số học sinh mới trong kỳ → new_students — KHÔNG chọn overview cho các câu này.",
  "- Câu hỏi dạng \"có gì mới\" (kể cả \"dạo này có gì mới\", \"tháng này có gì mới không\") là hỏi NỘI DUNG mới → gọi content_new. Nếu câu hỏi gồm cả ý NGƯỜI mới (học sinh/thành viên mới) thì gọi thêm new_students.",
  "- Đối chiếu câu hỏi với các VÍ DỤ trong mô tả của từng công cụ: ví dụ nào giống câu hỏi nhất thì công cụ đó là lựa chọn đúng.",
  "Chỉ dùng đúng tên công cụ được cấp, không tự nghĩ ra công cụ khác. Tham số period chỉ đặt khi người hỏi nhắc rõ khoảng thời gian.",
].join("\n");

/**
 * Cho model chọn công cụ cho MỘT lượt chat của admin và thực thi các lựa
 * chọn hợp lệ. Trả cùng shape adminData như runAdminQuery (cộng thêm
 * `selection: "tool"` và `tools: [tên công cụ đã chạy]`), hoặc null khi:
 * không phải admin, nhà cung cấp không phải Groq, lượt chọn lỗi, model
 * không chọn công cụ nào, hoặc mọi lựa chọn đều không hợp lệ — mọi trường
 * hợp null đều để caller lùi về đường từ khoá/chat thường.
 */
export async function runToolAdminQuery(req, message, identity) {
  if (identity?.role !== "admin") return null;
  if (config.ollama.provider !== "groq") return null;

  let picked;
  try {
    picked = await groqCompleteWithTools(
      TOOL_SELECTION_SYSTEM,
      [{ role: "user", content: String(message || "") }],
      toolDefinitionsForModel(),
    );
  } catch (e) {
    console.warn(`[ai] Lượt chọn công cụ lỗi, lùi về tra cứu từ khoá: ${e?.message || e}`);
    return null;
  }

  const calls = (picked?.toolCalls || []).slice(0, MAX_TOOLS_PER_TURN);
  if (calls.length === 0) return null;

  const results = [];
  for (const call of calls) {
    // Chống bịa: tên lạ → bỏ qua; tham số sai schema → validateToolArgs
    // trả null → bỏ qua. Không lựa chọn hợp lệ nào thì coi như model
    // không chọn được (null) để đường từ khoá còn cơ hội.
    if (!isKnownTool(call.name)) continue;
    if (!validateToolArgs(call.name, call.arguments)) continue;
    try {
      const r = await executeToolCall(call.name, call.arguments, { req, identity });
      if (r) results.push(r);
    } catch (e) {
      // Lỗi thực thi một công cụ: bỏ qua công cụ đó, không sập cả lượt —
      // phần kết quả còn lại (nếu có) vẫn dùng được; không còn gì thì
      // trả null cho fallback xử lý tiếp.
      console.warn(`[ai] Thực thi công cụ ${call.name} lỗi: ${e?.message || e}`);
    }
  }
  if (results.length === 0) return null;

  return {
    // Nhiều công cụ: type ghép bằng dấu phẩy — ai_chat_logs ghi nguyên
    // chuỗi này ở queryType, audit từng công cụ đã ghi riêng ở
    // executeAdminQuery với selection "tool".
    type: results.map((r) => r.type).join(","),
    needsThreshold: results.some((r) => r.needsThreshold),
    resultCount: results.reduce((sum, r) => sum + (r.resultCount || 0), 0),
    text: results.map((r) => r.text).join("\n\n"),
    selection: "tool",
    tools: results.map((r) => r.type),
  };
}
