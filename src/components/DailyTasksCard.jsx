import { useEffect, useState, useCallback } from "react";
import { taskService } from "../services/taskService.js";
import { TaskList } from "./tasks/index.js";

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
      const data = await taskService.getTasks("DAILY");
      setTasks(data?.tasks || []);
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
      const res = await taskService.claimReward(taskId);
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
      <TaskList tasks={visibleTasks} onClaim={handleClaim} claiming={claiming} compact />
      {compact && tasks.length > 3 && (
        <p className="text-[10px] text-gray-400 text-center mt-2">
          +{tasks.length - 3} nhiệm vụ nữa...
        </p>
      )}
    </div>
  );
}
