import { buildWindowConfig, readGameConfig, SCHEMA_VERSION } from "./gameConfigSchema.js";

export const CONFIG_MARKER_START = "<!-- EG_CONFIG_START -->";
export const CONFIG_MARKER_END = "<!-- EG_CONFIG_END -->";

const escapeForScript = (json) =>
  json.replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");

export function buildConfigScript(key, values, aliasKeys = []) {
  const payload = buildWindowConfig(key, values, aliasKeys);
  const json = escapeForScript(JSON.stringify(payload));
  return [
    CONFIG_MARKER_START,
    "<script>",
    `window.EG_CONFIG=Object.assign({},window.EG_CONFIG||{},${json});`,
    "window.EG=window.EG_CONFIG;",
    `window.EG_GAME_KEY=${JSON.stringify(key)};`,
    `window.EG_GAME_CONFIG=window.EG_CONFIG[${JSON.stringify(key)}]||{};`,
    `window.EG_CONFIG_SCHEMA=${JSON.stringify(SCHEMA_VERSION)};`,
    "</" + "script>",
    CONFIG_MARKER_END,
  ].join("\n");
}

export function stripInjectedConfig(html) {
  if (!html || typeof html !== "string") return html;
  const start = html.indexOf(CONFIG_MARKER_START);
  const end = html.indexOf(CONFIG_MARKER_END);
  if (start === -1 || end === -1 || end < start) return html;
  return html.slice(0, start) + html.slice(end + CONFIG_MARKER_END.length);
}

export function injectGameConfig(html, { key, config, aliasKeys } = {}) {
  if (!html || typeof html !== "string" || !key) return html;
  const base = stripInjectedConfig(html);
  const block = buildConfigScript(key, readGameConfig(config).values, aliasKeys);
  const headMatch = base.match(/<head[^>]*>/i);
  if (headMatch) {
    const at = headMatch.index + headMatch[0].length;
    return base.slice(0, at) + "\n" + block + "\n" + base.slice(at);
  }
  return block + "\n" + base;
}