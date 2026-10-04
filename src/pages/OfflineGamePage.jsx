import { useMemo } from "react";
import { navigate } from "../lib/router.js";
import { useUserAuthStore } from "../stores/userAuth.store.js";
import HtmlGameLoader from "../games/HtmlGameLoader.jsx";

// Mỗi game = MỘT file HTML tự chứa trong src/games/offline/.
// Vite cần import tĩnh để bundle, nên khai báo tay bảng này.
// Sinh lại danh sách: npm run games:build (manifest là nguồn sự thật)
import mathHtml from "../games/offline/math.html?raw";
import memoryHtml from "../games/offline/memory.html?raw";
import scrambleHtml from "../games/offline/scramble.html?raw";
import quizHtml from "../games/offline/quiz.html?raw";
import snakeHtml from "../games/offline/snake.html?raw";
import flapHtml from "../games/offline/flap.html?raw";
import g2048Html from "../games/offline/g2048.html?raw";
import chemHtml from "../games/offline/chem.html?raw";
import clockHtml from "../games/offline/clock.html?raw";
import patternHtml from "../games/offline/pattern.html?raw";
import simonHtml from "../games/offline/simon.html?raw";
import anagramHtml from "../games/offline/anagram.html?raw";
import stroopHtml from "../games/offline/stroop.html?raw";
import sumseqHtml from "../games/offline/sumseq.html?raw";
import compareHtml from "../games/offline/compare.html?raw";
import riddleHtml from "../games/offline/riddle.html?raw";
import shapecountHtml from "../games/offline/shapecount.html?raw";

import { findOfflineGame } from "../games/src/manifest.js";

/**
 * id → nội dung HTML thô.
 * Phải ghi rõ tên biến: dùng shorthand `{ math }` sẽ tham chiếu `math` (không tồn tại)
 * chứ không phải `mathHtml`, gây ReferenceError ngay khi module được nạp.
 */
const HTML_BY_ID = {
  math: mathHtml,
  memory: memoryHtml,
  scramble: scrambleHtml,
  quiz: quizHtml,
  snake: snakeHtml,
  flap: flapHtml,
  g2048: g2048Html,
  chem: chemHtml,
  clock: clockHtml,
  pattern: patternHtml,
  simon: simonHtml,
  anagram: anagramHtml,
  stroop: stroopHtml,
  sumseq: sumseqHtml,
  compare: compareHtml,
  riddle: riddleHtml,
  shapecount: shapecountHtml,
};

/**
 * Trang chơi 1 game offline. Dùng chung cho cả 17 game —
 * mỗi game là 1 file HTML riêng, không còn trang gộp nhiều game.
 */
export default function OfflineGamePage({ gameId }) {
  const { user, token } = useUserAuthStore();
  const userAuth = user ? { user, token } : null;
  const meta = useMemo(() => findOfflineGame(gameId), [gameId]);
  const html = HTML_BY_ID[gameId];

  if (!meta || !html) {
    return (
      <div className="fixed inset-0 grid place-items-center bg-paper">
        <div className="text-center">
          <div className="text-5xl">🤔</div>
          <p className="mt-3 font-display text-lg font-bold text-ink">Không tìm thấy game</p>
          <p className="mt-1 text-sm text-slate-500">id: {String(gameId || "(rỗng)")}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 rounded-full bg-slate-100 px-4 py-2 text-sm font-extrabold text-slate-600 shadow-sm hover:bg-slate-200"
          >
            ← Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#0c2a30]">
      <HtmlGameLoader
        key={`offline-${gameId}`}
        htmlContent={html}
        game={{ id: `offline_${gameId}`, code: `offline_${gameId}`, name: meta.name, title: meta.name, subject: meta.tag }}
        questions={[]}
        playerName={user?.fullName || user?.username || "An Nhiên"}
        playMode="solo"
        userAuth={userAuth}
        onFinish={() => {}}
        onQuit={() => navigate("/")}
        onStateUpdate={() => {}}
      />
    </div>
  );
}
