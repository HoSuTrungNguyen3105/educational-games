import { useEffect, useState } from "react";
import { walletService } from "../../services/api.js";
import { Volume2, Gamepad2, Sprout, Trophy, Medal } from "lucide-react";
import { useKidSettings } from "../../lib/kidSettings.js";
import { navigate } from "../../lib/router.js";
import BottomNav from "../../components/BottomNav.jsx";
import useChatUnread from "../../hooks/useChatUnread.js";

const SECTIONS = [
  { key: "tasks", label: "Nhiệm vụ", icon: Gamepad2 },
  { key: "garden", label: "Khu vườn", icon: Sprout },
  { key: "badges", label: "Kho báu", icon: Medal },
  { key: "leaderboard", label: "Bảng vàng", icon: Trophy },
];

export default function KidDashboard({ userAuth }) {
  const { chatUnread } = useChatUnread(userAuth);
  const kid = useKidSettings();
  const [active, setActive] = useState("tasks");
  const [wallet, setWallet] = useState({ coins: 0, stars: 0 });
  const [tasks] = useState([
    { title: "Hoàn thành 1 trò chơi Toán", cta: "Chơi Ngay", path: "/categories" },
    { title: "Đạt từ 80 điểm trở lên", cta: "Khám Phá", path: "/categories" },
  ]);

  useEffect(() => {
    walletService.get().then((w) => setWallet({ coins: w?.coins ?? 0, stars: w?.stars ?? 0 })).catch(() => {});
  }, []);

  const speak = (text) => {
    if (!("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "vi-VN";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-amber-100 to-emerald-100 p-4 pb-24">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4">
        <aside className="rounded-3xl bg-white/80 p-4 shadow space-y-3">
          <div className="text-center">
            <div className="text-5xl">🦉</div>
            <h1 className="font-bold text-xl text-sky-700 mt-2">Chào {userAuth?.user?.name || "bé"}!</h1>
            <p className="text-xs text-ink/60">Lớp {userAuth?.user?.className || ""}</p>
            <div className="mt-2 flex justify-center gap-3 text-sm font-bold">
              <span>🪙 {wallet.coins}</span>
              <span>⭐ {wallet.stars}</span>
            </div>
            <button onClick={() => speak("Chào bé, hôm nay bé học gì nào?")} className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500 text-white text-xs">
              <Volume2 className="w-3.5 h-3.5" /> Đọc to
            </button>
          </div>
          <nav className="space-y-1">
            {SECTIONS.map((s) => (
              <button key={s.key} onClick={() => setActive(s.key)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition ${active === s.key ? "bg-sky-500 text-white" : "hover:bg-sky-100 text-ink"}`}>
                <s.icon className="w-4 h-4" /> {s.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="rounded-3xl bg-white/80 p-5 shadow">
          {active === "tasks" && (
            <div>
              <h2 className="font-bold text-lg text-emerald-700 mb-3">Nhiệm vụ hôm nay</h2>
              <div className="space-y-3">
                {tasks.map((t, i) => (
                  <div key={i} className="rounded-2xl bg-amber-50 p-3 flex items-center gap-3">
                    <div className="text-3xl">🎯</div>
                    <div className="flex-1">
                      <p className="font-semibold text-ink">{t.title}</p>
                      <button onClick={() => speak(t.title)} className="text-xs text-sky-600 underline">🔊 nghe</button>
                    </div>
                    <button onClick={() => navigate(t.path)} className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold">
                      {t.cta}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {active === "garden" && (
            <div className="text-center space-y-3">
              <div className="text-5xl">🌳</div>
              <p className="font-semibold">Khu vườn điểm tốt</p>
              <button onClick={() => navigate("/garden")} className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold">Vào khu vườn</button>
            </div>
          )}
          {active === "badges" && (
            <div className="text-center space-y-3">
              <div className="text-5xl">🏆</div>
              <p className="font-semibold">Kho báu huy hiệu</p>
              <button onClick={() => navigate("/achievements")} className="px-4 py-2 rounded-xl bg-amber-500 text-white font-bold">Xem huy hiệu</button>
            </div>
          )}
          {active === "leaderboard" && (
            <div className="text-center space-y-3">
              <div className="text-5xl">🥇</div>
              <p className="font-semibold">Bảng vàng lớp mình</p>
              <button onClick={() => navigate("/leaderboard")} className="px-4 py-2 rounded-xl bg-yellow-500 text-white font-bold">Xem bảng vàng</button>
            </div>
          )}
        </main>
      </div>
      <BottomNav userAuth={userAuth} activeKey="kid-dashboard" chatUnread={chatUnread} />
    </div>
  );
}
