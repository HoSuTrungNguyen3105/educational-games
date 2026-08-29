import { useEffect, useState, useCallback } from "react";
import { taskService } from "../../services/taskService.js";
import { coinService } from "../../services/api.js";
import { getLevelProgress, getLevelEmoji, getLevelTitle } from "../../lib/utils.js";
import { PrimaryButton, Loader } from "../../components/ui.jsx";
import { TaskList } from "../../components/tasks/index.js";

export default function DailyTasksPage({ userAuth, onBack }) {
  const [tasks, setTasks] = useState(null);
  const [coins, setCoins] = useState(0);
  const [claiming, setClaiming] = useState(false);
  const [toast, setToast] = useState(null);
  const [scope, setScope] = useState("DAILY");

  const load = useCallback(async () => {
    try {
      const [taskData, coinData] = await Promise.all([
        taskService.getTasks(scope),
        coinService.get(),
      ]);
      setTasks(taskData?.tasks || []);
      setCoins(coinData?.coins || 0);
    } catch {
      setTasks([]);
    }
  }, [scope]);

  useEffect(() => {
    load();
  }, [load]);

  const handleClaim = async (taskId) => {
    if (claiming) return;
    setClaiming(true);
    setToast(null);
    try {
      const res = await taskService.claimReward(taskId);
      setCoins(res?.newCoins || coins);
      setToast({ type: "success", msg: `Nhận thành công ${res?.rewardCoin || 0} xu!` });
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
          <p className="text-sm text-[#8A7C63] mb-4">Bạn cần đăng nhập để xem nhiệm vụ</p>
          <PrimaryButton onClick={onBack}>← Về trang chủ</PrimaryButton>
        </div>
      </div>
    );
  }

  const lv = getLevelProgress(coins);
  const completedCount = tasks ? tasks.filter((t) => t.claimed).length : 0;
  const totalReward = tasks ? tasks.reduce((s, t) => s + (t.claimed ? t.rewardCoin : 0), 0) : 0;

  const scopes = [
    { key: "DAILY", label: "Hàng ngày" },
    { key: "WEEKLY", label: "Hàng tuần" },
    { key: "TOTAL", label: "Tổng cộng" },
  ];

  return (
    <div className="flex-1 px-4 sm:px-6 py-6 sm:py-10 max-w-4xl mx-auto w-full">
      <button onClick={onBack} className="text-sm text-[#8A7C63] hover:text-ink transition inline-flex items-center gap-1 mb-6">
        ← Về trang chủ
      </button>

      <div className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl text-ink">📝 Nhiệm vụ</h1>
        <p className="text-sm text-[#8A7C63] mt-1">Hoàn thành nhiệm vụ — nhận coin thưởng!</p>
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

      {/* Scope tabs */}
      <div className="flex gap-2 mb-4">
        {scopes.map((s) => (
          <button
            key={s.key}
            onClick={() => setScope(s.key)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              scope === s.key
                ? "bg-purple-500 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-purple-50 border border-purple-100"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

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
                +{totalReward} xu đã nhận
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
      ) : (
        <TaskList tasks={tasks} onClaim={handleClaim} claiming={claiming} />
      )}

      {/* Hint */}
      <div className="mt-8 text-center">
        <p className="text-xs text-[#8A7C63]">
          Nhiệm vụ sẽ được làm mới theo chu kỳ
        </p>
      </div>
    </div>
  );
}
