import { useEffect, useState, useCallback } from "react";
import { dailyTaskService, coinService } from "../../services/api.js";
import { getLevelProgress, getLevelEmoji, getLevelTitle } from "../../lib/utils.js";
import { PrimaryButton, Loader } from "../../components/ui.jsx";
import { navigate } from "../../lib/router.js";

const TASK_GRADIENTS = [
  "from-violet-400 to-purple-400",
  "from-emerald-400 to-teal-400",
  "from-amber-400 to-orange-400",
  "from-pink-400 to-rose-400",
  "from-cyan-400 to-blue-400",
  "from-indigo-400 to-violet-400",
  "from-yellow-400 to-amber-400",
  "from-rose-400 to-pink-400",
];

function FullTaskRow({ task, index, onClaim, claiming }) {
  const pct = Math.min(100, (task.current / task.target) * 100);
  const isDone = task.completed && !task.claimed;
  const isClaimed = task.claimed;

  return (
    <div className="note-card p-4 flex items-center gap-4">
      <span
        className={`w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br ${
          TASK_GRADIENTS[index % TASK_GRADIENTS.length]
        } text-white flex items-center justify-center text-xl shadow-md`}
      >
        {task.icon}
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-ink truncate">{task.name}</p>
        <p className="text-xs text-[#8A7C63] mt-0.5">{task.desc}</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 h-2 bg-ink/5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isClaimed
                  ? "bg-gray-300"
                  : "bg-gradient-to-r from-emerald-400 to-teal-400"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-[11px] font-mono text-[#8A7C63] tabular-nums shrink-0">
            {task.current}/{task.target}
          </span>
        </div>
      </div>

      <div className="shrink-0 flex flex-col items-center gap-1">
        <span className="text-sm font-bold text-gold">
          +{task.coinReward} 💰
        </span>
        {isClaimed ? (
          <span className="text-[10px] font-bold text-teal bg-teal/10 px-3 py-1 rounded-full">
            ✓ Đã nhận
          </span>
        ) : isDone ? (
          <button
            onClick={() => onClaim(task.id)}
            disabled={claiming}
            className="text-[11px] font-bold text-white bg-gradient-to-r from-amber-400 to-orange-400 px-4 py-1.5 rounded-full hover:from-amber-500 hover:to-orange-500 transition active:scale-95 shadow-sm disabled:opacity-50"
          >
            Nhận thưởng
          </button>
        ) : (
          <span className="text-[10px] font-mono text-[#8A7C63]">
            {Math.round(pct)}%
          </span>
        )}
      </div>
    </div>
  );
}

export default function DailyTasksPage({ userAuth, onBack }) {
  const [tasks, setTasks] = useState(null);
  const [coins, setCoins] = useState(0);
  const [claiming, setClaiming] = useState(false);
  const [toast, setToast] = useState(null);

  const load = useCallback(async () => {
    try {
      const [taskData, coinData] = await Promise.all([
        dailyTaskService.getMyStatus(),
        coinService.get(),
      ]);
      setTasks(Array.isArray(taskData) ? taskData : taskData?.tasks || []);
      setCoins(coinData?.coins || 0);
    } catch {
      setTasks([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleClaim = async (taskId) => {
    if (claiming) return;
    setClaiming(true);
    setToast(null);
    try {
      const res = await dailyTaskService.claim(taskId);
      setCoins(res?.newCoins || coins);
      setToast({ type: "success", msg: `Nhận thành công ${res?.coinReward || 0} xu!` });
      await load();
    } catch (e) {
      setToast({ type: "error", msg: e?.message || "Không thể nhận thưởng" });
    } finally {
      setClaiming(false);
    }
  };

  if (!userAuth?.user) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="text-center anim-pop">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="font-display text-xl text-ink mb-2">Chưa đăng nhập</h2>
          <p className="text-sm text-[#8A7C63] mb-4">Bạn cần đăng nhập để xem nhiệm vụ hàng ngày</p>
          <PrimaryButton onClick={onBack}>← Về trang chủ</PrimaryButton>
        </div>
      </div>
    );
  }

  const lv = getLevelProgress(coins);
  const completedCount = tasks ? tasks.filter((t) => t.claimed).length : 0;
  const totalReward = tasks ? tasks.reduce((s, t) => s + (t.claimed ? t.coinReward : 0), 0) : 0;

  return (
    <div className="flex-1 px-4 sm:px-6 py-6 sm:py-10 max-w-4xl mx-auto w-full">
      <button onClick={onBack} className="text-sm text-[#8A7C63] hover:text-ink transition inline-flex items-center gap-1 mb-6">
        ← Về trang chủ
      </button>

      <div className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl text-ink">📝 Nhiệm vụ hàng ngày</h1>
        <p className="text-sm text-[#8A7C63] mt-1">Hoàn thành nhiệm vụ — nhận coin thưởng mỗi ngày!</p>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`mb-4 px-4 py-3 rounded-2xl text-sm font-semibold text-center anim-pop ${
            toast.type === "success"
              ? "bg-teal/10 text-teal border border-teal/20"
              : "bg-ticket/10 text-ticket border border-ticket/20"
          }`}
          onClick={() => setToast(null)}
        >
          {toast.msg}
        </div>
      )}

      {/* Tổng quan */}
      <div className="note-card p-5 sm:p-6 mb-6 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="text-center">
            <div className="text-5xl mb-1">📝</div>
            <div className="font-display text-3xl text-ink">{completedCount}/{tasks?.length || 0}</div>
            <div className="text-xs font-mono text-violet-600 font-bold uppercase">hoàn thành</div>
          </div>
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-body text-ink font-semibold">💰 {coins.toLocaleString()} Coin</span>
              <span className="text-xs font-mono text-[#8A7C63]">
                +{totalReward} xu hôm nay
              </span>
            </div>
            <div className="h-3 bg-ink/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-400 to-purple-400 rounded-full transition-all duration-700"
                style={{ width: `${tasks && tasks.length ? (completedCount / tasks.length) * 100 : 0}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] font-mono text-[#8A7C63]">{getLevelEmoji(lv.level)} Level {lv.level}</span>
              <span className="text-[10px] font-mono text-[#8A7C63]">{getLevelTitle(lv.level)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách nhiệm vụ */}
      {tasks === null ? (
        <Loader label="Đang tải nhiệm vụ..." />
      ) : tasks.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-4xl mb-3">🌙</p>
          <p className="text-sm text-[#8A7C63]">Không có nhiệm vụ nào hôm nay</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {tasks.map((task, i) => (
            <FullTaskRow
              key={task.id}
              task={task}
              index={i}
              onClaim={handleClaim}
              claiming={claiming}
            />
          ))}
        </div>
      )}

      {/* Hint */}
      <div className="mt-8 text-center">
        <p className="text-xs text-[#8A7C63]">
          Nhiệm vụ sẽ được làm mới mỗi ngày lúc 00:00 UTC
        </p>
      </div>
    </div>
  );
}
