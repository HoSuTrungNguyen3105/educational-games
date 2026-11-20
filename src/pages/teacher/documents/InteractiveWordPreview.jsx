import { PAGE_NUMBER_FOOTER_HTML, wordBlockToHtml } from "../../../lib/documents/modelRender.js";
import { cmToPx, pageMarginsCm } from "../../../lib/documents/pageConfig.js";

// InteractiveWordPreview — xem trước Word DẠNG DOM cho MOBILE ở chế độ
// Normal (JSON), thay cho iframe sandbox ở ngữ cảnh này.
//
// Vì sao cần bản DOM riêng: preview thường nằm trong iframe sandbox
// KHÔNG có allow-scripts nên trang cha không nhận được thao tác chạm
// vào từng đoạn bên trong khung (và ta KHÔNG nới sandbox cho mã HTML
// của giáo viên). Ở chế độ Normal, nội dung là MÔ HÌNH CÓ CẤU TRÚC do
// chính app render (mọi chuỗi người dùng đã qua escapeHtml trong
// modelRender) — không phải HTML thô — nên render trực tiếp từng khối
// ra DOM của app là an toàn: mỗi khối là một vùng chạm, giáo viên chạm
// để CHỌN khối rồi áp định dạng bằng thanh công cụ ở đáy màn hình.
//
// Trang giấy dùng class .ds-page (docstudio.css) với các quy tắc TRANG
// TRÍ tương đương WORD_PREVIEW_CSS nhưng đã scope theo class riêng —
// không tiêm CSS toàn cục (body/@page) của bản iframe vào DOM của app.
// Bề rộng chảy theo khung (không cố định 794px) để đọc/gõ trên điện
// thoại không phải cuộn ngang; xuất file và in A4 vẫn đi qua model +
// iframe như cũ, không bị ảnh hưởng.
//
// Cấu hình trang (model.page): áp lề + chữ mặc định bằng inline style
// trên .ds-page — cùng quy tắc với preview iframe (mẫu có theme thì
// theme giữ chữ riêng, page chỉ quyết định lề). `highlight` =
// { blockIndex, rows } tô sáng các hàng bảng khớp tìm kiếm.
export default function InteractiveWordPreview({ model, selectedIndex = null, highlight = null, onSelectBlock }) {
  const blocks = model?.blocks || [];
  const page = model?.page || null;
  const hasTheme = Boolean(model?.theme);
  const pageStyle = {};
  if (page) {
    const m = pageMarginsCm(page);
    pageStyle.padding = `${cmToPx(m.top)}px ${cmToPx(m.right)}px ${cmToPx(m.bottom)}px ${cmToPx(m.left)}px`;
    if (!hasTheme) {
      if (page.font) pageStyle.fontFamily = `'${String(page.font).replace(/'/g, "")}', sans-serif`;
      if (page.fontSize) pageStyle.fontSize = `${page.fontSize}pt`;
      if (page.color) pageStyle.color = page.color;
      if (page.align) pageStyle.textAlign = page.align;
      if (page.lineHeight) pageStyle.lineHeight = page.lineHeight;
    }
  }
  return (
    <div className="ds-interactive-wrap">
      <p className="ds-interactive-hint">
        Chạm vào một đoạn để chọn khối, rồi dùng thanh định dạng ở cuối màn hình.
      </p>
      <div className="ds-page" style={pageStyle}>
        {blocks.map((block, i) => (
          <div
            key={i}
            role="button"
            tabIndex={0}
            aria-pressed={selectedIndex === i}
            aria-label={`Khối ${i + 1}${block.type ? ` (${block.type})` : ""}`}
            className={`ds-block-pick ${selectedIndex === i ? "is-selected" : ""}`}
            onClick={() => onSelectBlock?.(i)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectBlock?.(i);
              }
            }}
            dangerouslySetInnerHTML={{
              __html: wordBlockToHtml(block, {
                highlightRows: highlight && highlight.blockIndex === i ? highlight.rows : null,
              }),
            }}
          />
        ))}
        {!blocks.length && (
          <p className="ds-interactive-empty">Tài liệu chưa có nội dung — chuyển sang tab Soạn để thêm.</p>
        )}
        {page?.pageNumber && (
          <div dangerouslySetInnerHTML={{ __html: PAGE_NUMBER_FOOTER_HTML }} />
        )}
      </div>
    </div>
  );
}
