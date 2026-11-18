// ComponentPreview — hình xem trước NHỎ, tĩnh cho từng thẻ trong thư
// viện "Thành phần" của Document Studio. Vẽ hoàn toàn bằng div/style
// thu nhỏ (không dùng iframe sandbox cho từng thẻ — nhẹ và an toàn),
// chỉ mang tính minh hoạ hình dáng, không phải nội dung thật.
// ComponentCard là nút thẻ mẫu hoàn chỉnh (icon + tên + xem trước),
// nhận handler chèn qua prop như các nút chèn sẵn có của editor.

export function ComponentCard({ comp, available, onInsert }) {
  const Icon = comp.icon;
  return (
    <button type="button"
      className="docstudio-comp-card"
      disabled={!available}
      title={available ? `Chèn “${comp.name}” vào tài liệu` : "Thành phần này chỉ dùng cho tài liệu Word"}
      onClick={() => onInsert(comp)}>
      <span className="docstudio-comp-card-head">
        <Icon className="w-4 h-4" /> <b>{comp.name}</b>
      </span>
      <ComponentPreview preview={comp.preview} />
      {!available && <small className="docstudio-comp-na">Chỉ cho Word</small>}
    </button>
  );
}

const LINE = "#cbd5e1";
const FAINT = "#e2e8f0";
const INK = "#94a3b8";

function Bar({ w = "100%", h = 4, c = FAINT, r = 2, style }) {
  return <span style={{ display: "block", width: w, height: h, background: c, borderRadius: r, ...style }} />;
}

const FRAME_TONES = {
  note: { bg: "#fefce8", border: "#facc15", label: "#854d0e" },
  warning: { bg: "#fef2f2", border: "#f87171", label: "#b91c1c" },
  key: { bg: "#eff6ff", border: "#60a5fa", label: "#1d4ed8" },
  example: { bg: "#ecfdf5", border: "#34d399", label: "#047857" },
};

export default function ComponentPreview({ preview }) {
  if (!preview) return null;
  const wrap = { display: "flex", flexDirection: "column", gap: 3, width: "100%" };

  if (preview.kind === "table") {
    const cols = Math.max(2, Math.min(preview.cols || 3, 6));
    const rows = Math.max(2, Math.min(preview.rows || 3, 4));
    return (
      <div style={{ ...wrap, gap: 0, border: `1px solid ${LINE}`, borderRadius: 3, overflow: "hidden" }} aria-hidden="true">
        {Array.from({ length: rows }, (_, r) => (
          <div key={r} style={{ display: "flex" }}>
            {Array.from({ length: cols }, (_, c) => (
              <span key={c} style={{
                flex: 1, height: 7,
                background: r === 0 ? "#dbeafe" : r % 2 ? "#f8fafc" : "#fff",
                borderRight: c < cols - 1 ? `1px solid ${FAINT}` : "none",
                borderTop: r > 0 ? `1px solid ${FAINT}` : "none",
              }} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (preview.kind === "list") {
    return (
      <div style={wrap} aria-hidden="true">
        {Array.from({ length: preview.lines || 3 }, (_, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 9, lineHeight: 1, color: "#2563eb", fontWeight: 700, minWidth: 12 }}>
              {preview.marker === "1." ? `${i + 1}.` : preview.marker}
            </span>
            <Bar w={`${88 - i * 14}%`} />
          </div>
        ))}
      </div>
    );
  }

  if (preview.kind === "quote") {
    return (
      <div style={{ borderLeft: "3px solid #cbd5e1", paddingLeft: 7, display: "flex", flexDirection: "column", gap: 3 }} aria-hidden="true">
        <Bar w="92%" c="#cbd5e1" />
        <Bar w="70%" c="#cbd5e1" />
        <Bar w="45%" c="#cbd5e1" />
      </div>
    );
  }

  if (preview.kind === "frame") {
    const tone = FRAME_TONES[preview.tone] || FRAME_TONES.note;
    return (
      <div style={{ background: tone.bg, border: `1px solid ${tone.border}`, borderRadius: 5, padding: "5px 7px", display: "flex", flexDirection: "column", gap: 3 }} aria-hidden="true">
        <span style={{ fontSize: 8.5, fontWeight: 700, color: tone.label, lineHeight: 1.2 }}>{preview.label}</span>
        <Bar w="94%" c={tone.border} style={{ opacity: 0.55 }} />
        <Bar w="72%" c={tone.border} style={{ opacity: 0.55 }} />
      </div>
    );
  }

  if (preview.kind === "heading") {
    return (
      <div style={{ ...wrap, alignItems: "center", gap: 4 }} aria-hidden="true">
        <Bar w="78%" h={7} c="#64748b" />
        <Bar w="52%" h={4} c={LINE} />
      </div>
    );
  }

  if (preview.kind === "paragraph") {
    return (
      <div style={wrap} aria-hidden="true">
        <Bar w="100%" />
        <Bar w="96%" />
        <Bar w="88%" />
        <Bar w="55%" />
      </div>
    );
  }

  if (preview.kind === "divider") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 0" }} aria-hidden="true">
        <span style={{ flex: 1, borderTop: `2px solid ${LINE}` }} />
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: INK }} />
        <span style={{ flex: 1, borderTop: `2px solid ${LINE}` }} />
      </div>
    );
  }

  if (preview.kind === "info") {
    return (
      <div style={{ border: `1px solid ${LINE}`, borderRadius: 5, padding: "5px 7px", display: "flex", flexDirection: "column", gap: 4 }} aria-hidden="true">
        {Array.from({ length: preview.lines || 3 }, (_, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Bar w={i === 0 ? "34%" : "26%"} c="#cbd5e1" />
            <span style={{ flex: 1, borderBottom: `1px dotted ${INK}` }} />
          </div>
        ))}
      </div>
    );
  }

  if (preview.kind === "lines") {
    return (
      <div style={{ ...wrap, gap: 6, paddingTop: 2 }} aria-hidden="true">
        {Array.from({ length: preview.lines || 4 }, (_, i) => (
          <span key={i} style={{ display: "block", borderBottom: `1.5px dotted ${INK}` }} />
        ))}
      </div>
    );
  }

  return null;
}
