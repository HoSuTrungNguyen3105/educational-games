import { uid } from '../services/api.js'

export const ELEMENT_TYPES = [
  { type: "text", label: "Text", icon: "T", desc: "Văn bản" },
  { type: "image", label: "Image", icon: "🖼️", desc: "Hình ảnh" },
  { type: "button", label: "Button", icon: "🔘", desc: "Nút bấm" },
  { type: "shape", label: "Shape", icon: "⬛", desc: "Hình khối" },
  { type: "question", label: "Question", icon: "❓", desc: "Câu hỏi" },
  { type: "answer", label: "Answer", icon: "✅", desc: "Đáp án" },
  { type: "timer", label: "Timer", icon: "⏱️", desc: "Đồng hồ" },
  { type: "leaderboard", label: "Leaderboard", icon: "🏆", desc: "Bảng xếp hạng" },
];

export const SHAPE_KINDS = [
  { id: "rect", label: "Rectangle", icon: "▭" },
  { id: "circle", label: "Circle", icon: "◯" },
  { id: "line", label: "Line", icon: "╱" },
];

export const FONT_STACK = [
  { id: "system", label: "Hệ thống", stack: "system-ui, -apple-system, sans-serif" },
  { id: "fredoka", label: "Fredoka", stack: "'Fredoka', sans-serif" },
  { id: "be-vietnam", label: "Be Vietnam Pro", stack: "'Be Vietnam Pro', sans-serif" },
  { id: "mono", label: "JetBrains Mono", stack: "'JetBrains Mono', monospace" },
];

export const PALETTE = [
  "#1D2E4A", "#16233A", "#FFF6E7", "#FFFBF2", "#E4572E",
  "#F4B942", "#1B998B", "#FF6F91", "#8B6FF1", "#FFFFFF",
  "#4CAF7D", "#B5651D", "#E7D9BE", "#B7A987", "#8A7C63",
];

const fontMap = Object.fromEntries(FONT_STACK.map(f => [f.id, f.stack]));
export function fontStack(id) {
  return fontMap[id] || fontMap.system;
}

export function defaultCanvas() {
  return {
    width: 1280,
    height: 720,
    background: "#FFF6E7",
  };
}

export function defaultElements() {
  const cx = 640;
  const w = 1280;
  return [
    {
      id: uid("el"), type: "text", x: 40, y: 36, width: 320, height: 60, rotation: 0, zIndex: 1,
      properties: { text: "Đường đua ốc sên", fontSize: 32, fontWeight: 700, color: "#1D2E4A", align: "left", font: "fredoka" },
    },
    {
      id: uid("el"), type: "timer", x: w - 240, y: 36, width: 190, height: 64, rotation: 0, zIndex: 2,
      properties: { fontSize: 36, fontWeight: 700, color: "#E4572E", align: "center", font: "fredoka" },
    },
    {
      id: uid("el"), type: "question", x: cx - 360, y: 180, width: 720, height: 120, rotation: 0, zIndex: 3,
      properties: { fontSize: 34, fontWeight: 700, color: "#1D2E4A", align: "center", font: "fredoka" },
    },
    {
      id: uid("el"), type: "answer", x: cx - 260, y: 360, width: 520, height: 180, rotation: 0, zIndex: 4,
      properties: { fontSize: 22, fontWeight: 500, color: "#1D2E4A", align: "left", font: "be-vietnam", gap: 8, columns: 2, background: "#FFFFFF", radius: 14 },
    },
    {
      id: uid("el"), type: "button", x: cx + 240, y: 600, width: 180, height: 56, rotation: 0, zIndex: 5,
      properties: { text: "Trả lời ✅", fontSize: 20, fontWeight: 600, color: "#FFFFFF", background: "#1B998B", radius: 16, align: "center", font: "fredoka" },
    },
    {
      id: uid("el"), type: "leaderboard", x: 40, y: 440, width: 300, height: 220, rotation: 0, zIndex: 6,
      properties: { fontSize: 16, fontWeight: 500, color: "#1D2E4A", background: "#FFFFFF", radius: 16, gap: 6, font: "be-vietnam" },
    },
  ];
}

export function createElement(type, x, y, pickedProps = null) {
  const base = { id: uid("el"), type, x, y, rotation: 0, zIndex: 1, properties: {} };
  switch (type) {
    case "text":
      return { ...base, width: 320, height: 72, properties: { text: "Chữ của bạn", fontSize: 28, fontWeight: 700, color: "#1D2E4A", align: "center", font: "fredoka", ...(pickedProps || {}) } };
    case "image":
      return { ...base, width: 240, height: 160, properties: { src: "", opacity: 100, radius: 12, alt: "image", ...(pickedProps || {}) } };
    case "button":
      return { ...base, width: 200, height: 60, properties: { text: "Bấm vào đây", fontSize: 20, fontWeight: 600, color: "#FFFFFF", background: "#1B998B", radius: 16, align: "center", font: "fredoka", ...(pickedProps || {}) } };
    case "shape":
      return { ...base, width: 160, height: 120, properties: { kind: "rect", fill: "#F4B942", stroke: "#1D2E4A", strokeWidth: 0, radius: 12, opacity: 100, ...(pickedProps || {}) } };
    case "question":
      return { ...base, width: 720, height: 120, properties: { fontSize: 34, fontWeight: 700, color: "#1D2E4A", align: "center", font: "fredoka", ...(pickedProps || {}) } };
    case "answer":
      return { ...base, width: 560, height: 200, properties: { fontSize: 22, fontWeight: 500, color: "#1D2E4A", align: "left", font: "be-vietnam", gap: 10, columns: 2, background: "#FFFFFF", radius: 14, ...(pickedProps || {}) } };
    case "timer":
      return { ...base, width: 190, height: 64, properties: { fontSize: 36, fontWeight: 700, color: "#E4572E", align: "center", font: "fredoka" } };
    case "leaderboard":
      return { ...base, width: 320, height: 240, properties: { fontSize: 16, fontWeight: 500, color: "#1D2E4A", background: "#FFFFFF", radius: 16, gap: 6, font: "be-vietnam" } };
    default:
      return { ...base, width: 200, height: 60, properties: {} };
  }
}

export function renameTypeLabels(type) {
  const t = ELEMENT_TYPES.find(t => t.type === type);
  return t ? t.label : type;
}

export function sortByZ(elements) {
  return [...elements].sort((a, b) => a.zIndex - b.zIndex);
}