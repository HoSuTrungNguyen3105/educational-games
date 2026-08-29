/**
 * GameTaskBridge — inject script for HTML games.
 *
 * This script is injected into HTML games when saved.
 * Games use it to emit task events via postMessage to the parent React frame.
 *
 * Usage in HTML game:
 *   GameTaskBridge.emit("GAME_PLAYED", { gameId: "..." });
 *   GameTaskBridge.emit("GAME_WON", { gameId: "..." });
 *   GameTaskBridge.emit("ANSWER_CORRECT", { gameId: "..." });
 */
export const BRIDGE_VERSION = "1.0.0";

export const BRIDGE_SCRIPT = `
<!-- GAME_TASK_BRIDGE_START -->
<!-- GAME_TASK_BRIDGE_VERSION: ${BRIDGE_VERSION} -->
<script>
(function() {
  if (window.GameTaskBridge && window.GameTaskBridge.version === "${BRIDGE_VERSION}") return;
  window.GameTaskBridge = {
    version: "${BRIDGE_VERSION}",
    emit: function(type, data) {
      try {
        window.parent.postMessage({
          source: "game",
          type: type,
          data: data || {}
        }, "*");
      } catch(e) { /* ignore */ }
    }
  };
})();
</script>
<!-- GAME_TASK_BRIDGE_END -->
`;

const BRIDGE_MARKER_START = "<!-- GAME_TASK_BRIDGE_START -->";
const BRIDGE_MARKER_END = "<!-- GAME_TASK_BRIDGE_END -->";

/**
 * Inject GameTaskBridge into HTML content.
 * If bridge already exists (markers found), replace it.
 * Otherwise, inject before </body> or at the end.
 */
export function injectTaskBridge(html) {
  if (!html || typeof html !== "string") return html;

  // If bridge markers exist, replace between them
  const startIdx = html.indexOf(BRIDGE_MARKER_START);
  const endIdx = html.indexOf(BRIDGE_MARKER_END);

  if (startIdx !== -1 && endIdx !== -1) {
    const afterEnd = endIdx + BRIDGE_MARKER_END.length;
    return html.slice(0, startIdx) + BRIDGE_SCRIPT.trim() + html.slice(afterEnd);
  }

  // No markers — inject before </body> or at end
  const bodyClose = html.lastIndexOf("</body>");
  if (bodyClose !== -1) {
    return html.slice(0, bodyClose) + "\n" + BRIDGE_SCRIPT.trim() + "\n" + html.slice(bodyClose);
  }

  return html + "\n" + BRIDGE_SCRIPT.trim();
}

/**
 * Process game HTML: inject task bridge.
 * Call this when saving HTML to the database.
 */
export function processGameHtml(html) {
  return injectTaskBridge(html);
}
