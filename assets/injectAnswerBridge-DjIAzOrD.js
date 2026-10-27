var e=`1.1.0`,t=`
<!-- EG_ANSWER_BRIDGE_START -->
<script>
(function() {
  if (window.EG_ANSWER && window.EG_ANSWER.version === "${e}") return;

  var _answers = {};   // questionId -> { questionId, value, timeSpent }
  var _sentReady = false;

  function _post(type, data) {
    try { window.parent.postMessage({ type: type, data: data || {} }, "*"); } catch (e) {}
  }

  window.EG_ANSWER = {
    version: "${e}",

    /** Ghi 1 câu trả lời (ghi đè nếu câu đó đã trả lời). */
    answer: function(questionId, value, timeSpent) {
      if (questionId == null) return;
      _answers[String(questionId)] = {
        questionId: String(questionId),
        value: value == null ? null : value,
        timeSpent: typeof timeSpent === "number" ? timeSpent : undefined
      };
      // Kèm cả value để frame cha theo dõi được tiến độ làm bài (trước đây chỉ
      // có questionId nên host không biết học sinh chọn gì cho tới lúc nộp).
      _post("answer-recorded", { questionId: String(questionId), value: _answers[String(questionId)].value, timeSpent: _answers[String(questionId)].timeSpent });
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
<\/script>
<!-- EG_ANSWER_BRIDGE_END -->
`,n=`<!-- EG_ANSWER_BRIDGE_START -->`,r=`<!-- EG_ANSWER_BRIDGE_END -->`;function i(e){if(!e||typeof e!=`string`)return e;let i=e.indexOf(n),a=e.indexOf(r);if(i!==-1&&a!==-1&&a>i)return e.slice(0,i)+t.trim()+e.slice(a+29);let o=e.lastIndexOf(`</body>`);return o===-1?e+`
`+t.trim():e.slice(0,o)+`
`+t.trim()+`
`+e.slice(o)}export{i as t};