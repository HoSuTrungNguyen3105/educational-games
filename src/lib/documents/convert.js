// convert.js — Điều phối chuyển đổi giữa hai chế độ soạn (HTML ⇄ JSON)
// và "áp dụng" (Apply) mã nguồn thành mô hình trung gian cho preview.
//
// Nguyên tắc an toàn (§11 đặc tả): parse/validate lỗi thì KHÔNG ghi đè
// gì cả — hàm trả { ok: false, errors } và phía UI giữ nguyên preview
// của bản hợp lệ gần nhất + giữ nguyên nội dung đang sửa.
import { parseHtmlToModel, validateHtmlBalance } from "./htmlParser.js";
import { validateDocumentJson } from "./schemas.js";
import { jsonToModel, modelToJson } from "./model.js";
import { pageStyleBlockHtml } from "./pageConfig.js";
import { escapeHtml, renderModelBodyHtml, themeCssForModel, buildSlidesScrollSrcDoc } from "./modelRender.js";
import { jsonErrorPosition } from "./format.js";

const errText = (e) => [{ message: String(e?.message || e) }];

/**
 * Áp dụng mã nguồn HTML: kiểm tra cân bằng thẻ → parse ra model + body/css
 * cho preview. Trả { ok, model, warnings, bodyHtml, cssText } hoặc
 * { ok: false, errors: [{ message, line? }] }.
 */
export function applyHtmlSource(source, docType) {
  const balanceErrors = validateHtmlBalance(source);
  if (balanceErrors.length) return { ok: false, errors: balanceErrors };
  try {
    const { model, warnings, bodyHtml, cssText } = parseHtmlToModel(source, docType);
    return { ok: true, model, warnings, bodyHtml, cssText };
  } catch (e) {
    return { ok: false, errors: errText(e) };
  }
}

/**
 * Áp dụng mã nguồn JSON: parse cú pháp (báo dòng/cột) → validate schema
 * (báo đường dẫn trường) → model. Trả { ok, model, json } hoặc
 * { ok: false, errors: [{ message, path?, line?, column? }] }.
 */
export function applyJsonSource(source, docType) {
  let obj;
  try {
    obj = JSON.parse(source);
  } catch (e) {
    const pos = jsonErrorPosition(source, e);
    return {
      ok: false,
      errors: [{
        message: `JSON sai cú pháp${pos.line ? ` ở dòng ${pos.line}, cột ${pos.column}` : ""}: ${pos.message}`,
        line: pos.line, column: pos.column,
      }],
    };
  }
  const schemaErrors = validateDocumentJson(obj, docType);
  if (schemaErrors.length) {
    return {
      ok: false,
      errors: schemaErrors.map((e) => ({
        message: e.path ? `${e.path}: ${e.message}` : e.message,
        path: e.path,
      })),
    };
  }
  return { ok: true, model: jsonToModel(obj, docType), json: obj };
}

/** Áp dụng theo chế độ hiện tại. */
export function applySource(source, mode, docType) {
  return mode === "json" ? applyJsonSource(source, docType) : applyHtmlSource(source, docType);
}

/**
 * Chuyển đổi mã nguồn từ chế độ này sang chế độ kia qua mô hình trung
 * gian. Nguồn lỗi → { ok: false, errors } và KHÔNG sinh mã đích (UI giữ
 * nguyên bản nháp của chế độ đích).
 */
export function convertSource(source, fromMode, docType) {
  const applied = applySource(source, fromMode, docType);
  if (!applied.ok) return { ok: false, errors: applied.errors };
  if (fromMode === "html") {
    return {
      ok: true,
      source: JSON.stringify(modelToJson(applied.model), null, 2),
      model: applied.model,
      warnings: applied.warnings || [],
    };
  }
  // JSON → HTML: sinh tài liệu HTML đầy đủ để giáo viên tiếp tục sửa.
  // Theme trong JSON được sinh thành CSS để bản HTML giữ đúng nhận diện
  // màu sắc/kiểu chữ của mẫu thay vì rơi về giao diện mặc định.
  const bodyHtml = renderModelBodyHtml(applied.model);
  const title = escapeHtml(applied.model.title || "Tài liệu");
  const css = themeCssForModel(applied.model);

  // Sử dụng buildSlidesScrollSrcDoc cho PowerPoint để đảm bảo consistency
  // với preview trong PowerPointPreview component
  // Cấu hình trang của Word đi sang Beautiful bằng khối <style
  // id="docstudio-page"> để vòng JSON → HTML → JSON không mất cấu hình.
  const pageBlock = docType === "powerpoint" ? "" : pageStyleBlockHtml(applied.model.page);
  const html = docType === "powerpoint"
    ? buildSlidesScrollSrcDoc({ bodyHtml, cssText: css })
    : `<!doctype html>\n<html lang="vi">\n<head>\n<meta charset="utf-8">\n<title>${title}</title>\n<style>\n.doc-page { font-family: Arial, sans-serif; padding: 8px 0; }\n${css}\n</style>${pageBlock ? `\n${pageBlock}` : ""}\n</head>\n<body>\n<div class="doc-page">${bodyHtml}</div>\n</body>\n</html>\n`;
  return { ok: true, source: html, model: applied.model, warnings: [] };
}
