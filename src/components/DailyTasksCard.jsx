import { useEffect, useState, useCallback } from "react";
import { dailyTaskService } from "../services/api.js";

const TASK_COLORS = [
  "from-violet-400 to-purple-400",
  "from-emerald-400 to-teal-400",
  "from-amber-400 to-orange-400",
  "from-pink-400 to-rose-400",
  "from-cyan-400 to-blue-400",
  "from-indigo-400 to-violet-400",
  "from-yellow-400 to-amber-400",
  "from-rose-400 to-pink-400",
];

function taskGradient(index) {
  return TASK_COLORS[index % TASK_COLORS.length];
}

function MiniTaskRow({ task, index, onClaim, claiming }) {
  const pct = Math.min(100, (task.current / task.target) * 100);
  const isDone = task.completed && !task.claimed;
  const isClaimed = task.claimed;
  const canClaim = isDone && !claiming;

  return (
    <div className="flex items-center gap-2.5 group">
      <span
        className={`w-8 h-8 shrink-0 rounded-xl bg-gradient-to-br ${taskGradient(index)} text-white flex items-center justify-center text-sm shadow-sm`}
      >
        {task.icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold text-gray-700 truncate leading-tight mb-0.5">
          {task.name}
        </p>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isClaimed
                  ? "bg-gray-300"
                  : "bg-gradient-to-r from-emerald-400 to-teal-400"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-gray-400 shrink-0 tabular-nums">
            {task.current}/{task.target}
          </span>
        </div>
      </div>
      <span className="shrink-0 text-[11px] font-bold text-amber-600 whitespace-nowrap">
        +{task.coinReward}💰
      </span>
      {isClaimed ? (
        <span className="shrink-0 text-[10px] font-bold text-teal-500 bg-teal-50 px-2 py-0.5 rounded-full">
          ✓
        </span>
      ) : canClaim ? (
        <button
          onClick={() => onClaim(task.id)}
          className="shrink-0 text-[10px] font-bold text-white bg-gradient-to-r from-amber-400 to-orange-400 px-2.5 py-1 rounded-full hover:from-amber-500 hover:to-orange-500 transition active:scale-95 shadow-sm"
        >
          Nhận
        </button>
      ) : null}
    </div>
  );
}

export default function DailyTasksCard({
  compact = false,
  showTitle = true,
  onClaimCoins,
  className = "",
}) {
  const [tasks, setTasks] = useState(null);
  const [claiming, setClaiming] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await dailyTaskService.getMyStatus();
      setTasks(Array.isArray(data) ? data : data?.tasks || []);
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
    try {
      const res = await dailyTaskService.claim(taskId);
      if (res?.newCoins != null && onClaimCoins) {
        onClaimCoins(res.newCoins);
      }
      await load();
    } catch {
    } finally {
      setClaiming(false);
    }
  };

  if (tasks === null) {
    return (
      <div className={`py-6 text-center ${className}`}>
        <p className="text-xs text-gray-400 animate-pulse">Đang tải nhiệm vụ...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className={`py-6 text-center ${className}`}>
        <p className="text-xs text-gray-400">Không có nhiệm vụ nào hôm nay</p>
      </div>
    );
  }

  const completedCount = tasks.filter((t) => t.claimed).length;
  const totalCount = tasks.length;

  const visibleTasks = compact ? tasks.slice(0, 3) : tasks;

  return (
    <div className={className}>
      {showTitle && (
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold text-gray-500">
            {completedCount}/{totalCount} hoàn thành
          </span>
          {completedCount === totalCount && (
            <span className="text-[10px] font-bold text-teal-500 bg-teal-50 px-2 py-0.5 rounded-full animate-pulse">
              🎉 Xong hết!
            </span>
          )}
        </div>
      )}
      <div className="flex flex-col gap-2.5">
        {visibleTasks.map((task, i) => (
          <MiniTaskRow
            key={task.id}
            task={task}
            index={i}
            onClaim={handleClaim}
            claiming={claiming}
          />
        ))}
      </div>
      {compact && tasks.length > 3 && (
        <p className="text-[10px] text-gray-400 text-center mt-2">
          +{tasks.length - 3} nhiệm vụ nữa...
        </p>
      )}
    </div>
  );
}
