export const FONT_STACK = [
  { id: "system", label: "Hệ thống", stack: "system-ui, -apple-system, sans-serif" },
  { id: "fredoka", label: "Fredoka", stack: "'Fredoka', sans-serif" },
  { id: "be-vietnam", label: "Be Vietnam Pro", stack: "'Be Vietnam Pro', sans-serif" },
  { id: "mono", label: "JetBrains Mono", stack: "'JetBrains Mono', monospace" },
];

const fontMap = Object.fromEntries(FONT_STACK.map(f => [f.id, f.stack]));

export function fontStack(id) {
  return fontMap[id] || fontMap.system;
}
