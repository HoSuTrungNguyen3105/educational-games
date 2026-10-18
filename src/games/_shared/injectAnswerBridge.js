/**
 * injectAnswerBridge.js — script nhỏ tiêm vào HTML game trước khi nạp vào iframe.
 *
 * Mục đích: để game HTML gửi câu trả lời về React frame, để React chuyển lên
 * server chấm điểm. Nhờ vậy điểm số không phải do client tự khai.
 *
 * Script này là ADDITIVE: game cũ không dùng hàm nào thì hành vi y như cũ.
 *
 * Dùng trong game HTML:
 *   <script>
 *     EG_ANSWER.answer(questionId, value, timeSpent);  // 1 câu
 *     EG_ANSWER.answerAll([{ questionId, value, timeSpent }]);
 *     EG_ANSWER.getAnswers();                         // [{ questionId, value, timeSpent }]
 *     EG_ANSWER.clear();
 *     EG_ANSWER.markReady();                           // báo đã sẵn sàng nhận init
 *   </script>
 */

export const ANSWER_BRIDGE_VERSION = "1.0.0";

export const ANSWER_BRIDGE_SCRIPT = `
<!-- EG_ANSWER_BRIDGE_START -->
<script>
(function() {
  if (window.EG_ANSWER && window.EG_ANSWER.version === "${ANSWER_BRIDGE_VERSION}") return;

  var _answers = {};   // questionId -> { questionId, value, timeSpent }
  var _sentReady = false;

  function _post(type, data) {
    try { window.parent.postMessage({ type: type, data: data || {} }, "*"); } catch (e) {}
  }

  window.EG_ANSWER = {
    version: "${ANSWER_BRIDGE_VERSION}",

    /** Ghi 1 câu trả lời (ghi đè nếu câu đó đã trả lời). */
    answer: function(questionId, value, timeSpent) {
      if (questionId == null) return;
      _answers[String(questionId)] = {
        questionId: String(questionId),
        value: value == null ? null : value,
        timeSpent: typeof timeSpent === "number" ? timeSpent : undefined
      };
      _post("answer-recorded", { questionId: String(questionId) });
    },

    /** Ghi nhiều câu một lượt. */
    answerAll: function(list) {
      if (!Array.isArray(list)) return;
      for (var i = 0; i < list.length; i++) {
        var a = list[i];
        if (!a) continue;
        this.answer(a.questionId, a.value, a.timeSpent);
      }
    },

    /** Đáp án dạng mảng để gửi lên server. */
    getAnswers: function() {
      return Object.keys(_answers).map(function(k) { return _answers[k]; });
    },

    clear: function() { _answers = {}; },

    /** Báo frame cha đã sẵn sàng (frame cha sẽ gửi init với questions). */
    markReady: function() {
      if (_sentReady) return;
      _sentReady = true;
      _post("ready");
    },

    /**
     * Gửi kết quả ván chơi. Danh sách answers mặc định lấy từ getAnswers().
     * Frame cha sẽ chấm lại ở server.
     */
    finish: function(payload) {
      var p = payload || {};
      var answers = Array.isArray(p.answers) ? p.answers : this.getAnswers();
      _post("game-over", {
        score: p.score || 0,
        correct: p.correct || 0,
        totalQuestions: p.totalQuestions || 0,
        timeUsed: p.timeUsed || 0,
        coinReward: p.coinReward || 0,
        answers: answers
      });
    }
  };

  // Bridge tự báo ready khi DOM sẵn sàng — game không cần chỉnh gì.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() { window.EG_ANSWER.markReady(); });
  } else {
    window.EG_ANSWER.markReady();
  }
})();
</` + `script>
<!-- EG_ANSWER_BRIDGE_END -->
`;

const BRIDGE_START = "<!-- EG_ANSWER_BRIDGE_START -->";
const BRIDGE_END = "<!-- EG_ANSWER_BRIDGE_END -->";

/**
 * Tiêm bridge vào HTML game. Nếu HTML đã có bridge thì thay bằng bản mới,
 * nếu chưa có thì chèn trước </body> (hoặc cuối file).
 */
export function injectAnswerBridge(html) {
  if (!html || typeof html !== "string") return html;

  const startIdx = html.indexOf(BRIDGE_START);
  const endIdx = html.indexOf(BRIDGE_END);

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    return html.slice(0, startIdx) + ANSWER_BRIDGE_SCRIPT.trim() + html.slice(endIdx + BRIDGE_END.length);
  }

  const bodyClose = html.lastIndexOf("</body>");
  if (bodyClose !== -1) {
    return html.slice(0, bodyClose) + "\n" + ANSWER_BRIDGE_SCRIPT.trim() + "\n" + html.slice(bodyClose);
  }
  return html + "\n" + ANSWER_BRIDGE_SCRIPT.trim();
}

/** Gỡ bridge ra khỏi HTML (dùng khi render ra file để soạn thảo). */
export function stripAnswerBridge(html) {
  if (!html || typeof html !== "string") return html;
  const startIdx = html.indexOf(BRIDGE_START);
  const endIdx = html.indexOf(BRIDGE_END);
  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) return html;
  return html.slice(0, startIdx) + html.slice(endIdx + BRIDGE_END.length);
}