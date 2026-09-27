import { useState, useCallback } from "react";
import { navigate } from "../lib/router.js";
import { useUserAuthStore } from "../stores/userAuth.store.js";
import HtmlGameLoader from "../games/HtmlGameLoader.jsx";
import mathAdventureHtml from "../games/math-adventure.html?raw";

const GAME = {
  id: "math-adventure",
  code: "math-adventure",
  name: "Math Adventure",
  title: "Math Adventure – Phiêu lưu Toán học",
  subject: "Toán học",
};

const mmss = (sec = 0) =>
  `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;

/**
 * Trang chơi Math Adventure (prototype HTML 1 file).
 * Game tự render UI header/pet/nhiệm vụ theo phong cách Edu Garden,
 * nên HtmlGameLoader sẽ tắt HUD nổi (game gửi message "hide-hud").
 */
export default function MathAdventurePage() {
  const { user, token } = useUserAuthStore();
  const userAuth = user ? { user, token } : null;
  const [result, setResult] = useState(null);
  const [mountKey, setMountKey] = useState(0);

  const handleFinish = useCallback((r) => setResult(r), []);
  const handleQuit = useCallback(() => navigate("/"), []);

  const again = () => {
    setResult(null);
    setMountKey((k) => k + 1);   // remount iframe → game chạy lại từ đầu
  };

  return (
    <div className="fixed inset-0 bg-paper">
      <HtmlGameLoader
        key={`math-adventure-${mountKey}`}
        htmlContent={mathAdventureHtml}
        game={GAME}
        questions={[]}
        playerName={user?.fullName || user?.username || "An Nhiên"}
        playMode="solo"
        userAuth={userAuth}
        onFinish={handleFinish}
        onQuit={handleQuit}
        onStateUpdate={() => {}}
      />

      {result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 backdrop-blur-sm p-4">
          <div className="w-full max-w-[420px] rounded-[26px] bg-white p-6 text-center shadow-2xl">
            <div className="text-5xl">🎁</div>
            <h2 className="mt-2 text-2xl font-display font-bold text-ink">Hoàn thành màn chơi!</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              {result.correct}/{result.totalQuestions} câu đúng · {mmss(result.timeUsed)}
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 px-2 py-3 text-sm font-extrabold text-amber-700">
                ⭐ +{result.correct * 10} EXP
              </div>
              <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 px-2 py-3 text-sm font-extrabold text-amber-700">
                🪙 +{result.correct * 20}
              </div>
              <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 px-2 py-3 text-sm font-extrabold text-emerald-700">
                💧 +{result.correct}
              </div>
            </div>

            <button
              onClick={again}
              className="mt-5 w-full rounded-full bg-gradient-to-br from-sky-400 to-blue-600 px-6 py-3 text-sm font-extrabold text-white shadow-lg transition active:translate-y-0.5"
            >
              🔄 Chơi lại
            </button>
            <button
              onClick={() => navigate("/")}
              className="mt-2 w-full rounded-full bg-slate-100 px-6 py-3 text-sm font-extrabold text-slate-500 shadow transition hover:bg-slate-200"
            >
              🏠 Về trang chủ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
