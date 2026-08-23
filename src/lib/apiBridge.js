/**
 * apiBridge.js
 *
 * Quét HTML template tìm các marker có dạng id="api_*".
 * Tự động inject script gọi API tương ứng trước </body>.
 *
 * Các marker hỗ trợ:
 *   id="api_submit"  → window.apiSubmitAnswer(questionId, answerId)  → POST /games/answer
 *   id="api_questions" → window.apiGetQuestions(gameId)              → GET /questions/game/:gameId
 *   id="api_players"   → window.apiGetPlayers(gameId)               → GET /games/:gameId/players
 *
 * Ví dụ trong HTML template:
 *   <div id="api_submit"></div>
 *   <button onclick="apiSubmitAnswer(q.id, opt.id)">Trả lời</button>
 */

const MARKER_RE = /\bid=["']api_(\w+)["']/g;

const BRIDGE_SCRIPT_ID = "data-api-bridge";

const API_DEFINITIONS = {
  submit: {
    fnName: "apiSubmitAnswer",
    params: "questionId, answerId",
    body: `
    if (!apiBase) return Promise.reject(new Error("apiBase not ready"));
    return fetch(apiBase + "/games/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: questionId, answerId: answerId })
    }).then(function(r) { return r.json(); });`,
  },
  questions: {
    fnName: "apiGetQuestions",
    params: "gameId",
    body: `
    if (!apiBase) return Promise.reject(new Error("apiBase not ready"));
    return fetch(apiBase + "/questions/game/" + encodeURIComponent(gameId))
      .then(function(r) { return r.json(); });`,
  },
  players: {
    fnName: "apiGetPlayers",
    params: "gameId",
    body: `
    if (!apiBase) return Promise.reject(new Error("apiBase not ready"));
    return fetch(apiBase + "/games/" + encodeURIComponent(gameId) + "/players")
      .then(function(r) { return r.json(); });`,
  },
};

/**
 * Quét HTML, trả về danh sách marker name tìm được (ví dụ ["submit", "questions"]).
 */
export function detectApiMarkers(html) {
  if (!html || typeof html !== "string") return [];
  const found = new Set();
  let m;
  while ((m = MARKER_RE.exec(html)) !== null) {
    if (API_DEFINITIONS[m[1]]) found.add(m[1]);
  }
  return [...found];
}

/**
 * Inject API bridge vào HTML.
 * - Chỉ inject những marker có trong HTML.
 * - Idempotent: nếu đã có bridge cũ thì gỡ trước khi inject lại.
 * - Nếu không tìm thấy marker nào → trả về HTML gốc, không thay đổi.
 */
export function injectApiBridge(html) {
  if (!html || typeof html !== "string") return html;

  const markers = detectApiMarkers(html);
  if (markers.length === 0) return html;

  // ---- Xây dựng script bridge ----
  let js = "(function(){\n";
  js += 'var apiBase="";\n';
  js += 'var gameId="";\n';

  // Lắng nghe init message từ parent React
  js += 'window.addEventListener("message",function(e){\n';
  js += "  var d=e&&e.data;\n";
  js += '  if(d&&d.type==="init"&&d.data){\n';
  js += '    apiBase=d.data.apiBase||"";\n';
  js += '    gameId=d.data.gameId||"";\n';
  js += "  }\n";
  js += "});\n\n";

  // Inject function cho mỗi marker
  for (const key of markers) {
    const def = API_DEFINITIONS[key];
    js += `window.${def.fnName}=function(${def.params}){\n`;
    js += def.body + "\n";
    js += "};\n\n";
  }

  js += "})();\n";

  const scriptTag = `<script ${BRIDGE_SCRIPT_ID}>\n${js}</script>\n`;

  // Gỡ bridge cũ (nếu có) để đảm bảo idempotent
  const cleaned = html.replace(
    new RegExp(`<script ${BRIDGE_SCRIPT_ID}>[\\s\\S]*?</script>`, "g"),
    ""
  );

  // Chèn trước </body> hoặc cuối cùng
  const bodyIdx = cleaned.lastIndexOf("</body>");
  if (bodyIdx !== -1) {
    return cleaned.slice(0, bodyIdx) + scriptTag + cleaned.slice(bodyIdx);
  }
  return cleaned + scriptTag;
}
