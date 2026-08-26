import { useCallback, useEffect, useState } from "react";
import { dailyTaskService } from "../../services/api.js";
import { ManagementHeader, ManagementTable, PrimaryButton } from "../../components/ui.jsx";

const TASK_ICONS = {
  play_game: "🎮",
  correct_answer: "📖",
  earn_xp: "⭐",
  win_game: "🎉",
  login: "👋",
};

const TYPE_LABELS = {
  play_game: "Chơi game",
  correct_answer: "Trả lời đúng",
  earn_xp: "Kiếm XP",
  win_game: "Thắng game",
  login: "Đăng nhập",
};

export default function DailyTaskManagement({ showToast }) {
  const [stats, setStats] = useState(null);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("tasks");

  const load = useCallback(() => {
    setStats(null);
    setProgress(null);
    setError(null);
    Promise.all([dailyTaskService.adminStats(), dailyTaskService.adminProgress()])
      .then(([s, p]) => {
        setStats(s);
        setProgress(p);
      })
      .catch((e) => setError(e.message || "Lỗi tải dữ liệu"));
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const handleReset = async (userId, userName) => {
    if (!confirm(`Reset nhiệm vụ hôm nay của "${userName}"?`)) return;
    try {
      await dailyTaskService.adminReset(userId);
      showToast("Đã reset progress", "success");
      load();
    } catch (e) {
      showToast(e.message || "Lỗi reset", "error");
    }
  };

  const taskHeaders = [
    "Nhiệm vụ",
    "Loại",
    "Mục tiêu",
    "Thưởng",
    "Hoàn thành",
    "Đã nhận",
    "Xu đã phát",
  ];
  const renderTaskRow = (task) => (
    <tr
      key={task.id}
      className="border-t border-ink/5 hover:bg-ink/[0.02] transition"
    >
      <td className="py-2.5 px-3 text-sm font-body text-ink">
        <div className="flex items-center gap-2">
          <span className="text-lg">{task.icon}</span>
          <div>
            <p className="font-semibold">{task.name}</p>
            <p className="text-[10px] text-[#8A7C63]">{task.desc}</p>
          </div>
        </div>
      </td>
      <td className="py-2.5 px-3 text-sm font-mono text-ink">
        {TYPE_LABELS[task.type] || task.type}
      </td>
      <td className="py-2.5 px-3 text-sm font-mono text-ink">{task.target}</td>
      <td className="py-2.5 px-3 text-sm font-mono font-bold text-gold">
        +{task.coinReward} 💰
      </td>
      <td className="py-2.5 px-3 text-sm font-mono text-ink">
        {task.completed}
      </td>
      <td className="py-2.5 px-3 text-sm font-mono text-teal">{task.claimed}</td>
      <td className="py-2.5 px-3 text-sm font-mono text-gold font-bold">
        {task.totalCoinsAwarded.toLocaleString()} 💰
      </td>
    </tr>
  );

  const progressHeaders = [
    "Người dùng",
    "Hoàn thành",
    "Đã nhận",
    "Xu nhận",
    "Thao tác",
  ];
  const renderProgressRow = (item) => (
    <tr
      key={item.userId}
      className="border-t border-ink/5 hover:bg-ink/[0.02] transition"
    >
      <td className="py-2.5 px-3 text-sm font-body text-ink">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-xs text-white font-bold shrink-0">
            {(item.userName || "?").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold truncate max-w-[160px]">
              {item.userName}
            </p>
            <p className="text-[10px] text-[#8A7C63] font-mono truncate max-w-[160px]">
              {item.userId}
            </p>
          </div>
        </div>
      </td>
      <td className="py-2.5 px-3 text-sm font-mono text-ink">
        {Object.keys(item.tasks || {}).length} task(s)
      </td>
      <td className="py-2.5 px-3 text-sm font-mono text-teal font-bold">
        {item.claimedCount}
      </td>
      <td className="py-2.5 px-3 text-sm font-mono text-gold font-bold">
        {item.totalReward.toLocaleString()} 💰
      </td>
      <td className="py-2.5 px-3">
        <button
          onClick={() => handleReset(item.userId, item.userName)}
          className="text-xs font-semibold text-red-400 hover:underline"
        >
          Reset
        </button>
      </td>
    </tr>
  );

  return (
    <div className="space-y-5">
      <ManagementHeader
        subtitle="Quản trị"
        title="📝 Nhiệm vụ hàng ngày"
      />

      <div className="flex gap-2">
        <button
          onClick={() => setTab("tasks")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
            tab === "tasks"
              ? "bg-gold/20 text-gold"
              : "text-[#8A7C63] hover:bg-ink/5"
          }`}
        >
          📋 Danh sách nhiệm vụ
        </button>
        <button
          onClick={() => setTab("progress")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
            tab === "progress"
              ? "bg-gold/20 text-gold"
              : "text-[#8A7C63] hover:bg-ink/5"
          }`}
        >
          👥 Tiến trình người dùng
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Người tham gia",
            value: stats?.totalUsersToday ?? "...",
            icon: "👥",
          },
          {
            label: "Lượt nhận thưởng",
            value: stats?.totalClaimedToday ?? "...",
            icon: "✅",
          },
          {
            label: "Xu đã phát",
            value: stats?.totalCoinsAwarded != null
              ? stats.totalCoinsAwarded.toLocaleString()
              : "...",
            icon: "💰",
          },
          {
            label: "Nhiệm vụ",
            value: stats?.taskStats?.length ?? "...",
            icon: "📝",
          },
        ].map((s) => (
          <div key={s.label} className="note-card p-4">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="font-display text-xl text-ink">{s.value}</div>
            <div className="text-[10px] text-[#8A7C63] font-mono uppercase">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {tab === "tasks" && (
        <ManagementTable
          title="Danh sách nhiệm vụ hôm nay"
          count={stats?.taskStats?.length || 0}
          data={stats?.taskStats || []}
          error={error}
          onRetry={load}
          emptyLabel="Chưa có dữ liệu"
          headers={taskHeaders}
          renderRow={renderTaskRow}
        />
      )}

      {tab === "progress" && (
        <ManagementTable
          title="Tiến trình người dùng hôm nay"
          count={progress?.length || 0}
          data={progress || []}
          error={error}
          onRetry={load}
          emptyLabel="Chưa có người dùng nào tham gia hôm nay"
          headers={progressHeaders}
          renderRow={renderProgressRow}
        />
      )}
    </div>
  );
}
