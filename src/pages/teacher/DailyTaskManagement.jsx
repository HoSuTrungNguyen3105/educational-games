import { useCallback, useEffect, useState } from "react";
import { dailyTaskService } from "../../services/api.js";
import { ManagementHeader, ManagementTable, Modal, GhostButton, PrimaryButton } from "../../components/ui.jsx";

const TASK_TYPES = [
  { value: "play_game", label: "Chơi game" },
  { value: "answer_question", label: "Trả lời câu hỏi" },
  { value: "correct_answer", label: "Trả lời đúng" },
  { value: "earn_xp", label: "Kiếm XP" },
  { value: "win_game", label: "Thắng game" },
  { value: "login", label: "Đăng nhập" },
];

const TASK_ICONS = ["🎮", "🏆", "📖", "🧠", "⭐", "🌟", "🎉", "👋", "📋", "🎯", "🔥", "💪", "✅", "📝"];

const emptyForm = { name: "", desc: "", icon: "📋", type: "play_game", target: 1, coinReward: 10, conditions: {} };

export default function DailyTaskManagement({ showToast }) {
  const [stats, setStats] = useState(null);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("tasks");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setStats(null);
    setProgress(null);
    setError(null);
    Promise.all([dailyTaskService.adminStats(), dailyTaskService.adminProgress()])
      .then(([s, p]) => { setStats(s); setProgress(p); })
      .catch((e) => setError(e.message || "Lỗi tải dữ liệu"));
  }, []);
  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditId(null);
    setForm({ ...emptyForm });
    setShowForm(true);
  };

  const openEdit = (task) => {
    if (task.builtin) { showToast("Nhiệm vụ mặc định không thể sửa", "error"); return; }
    setEditId(task.id);
    setForm({ name: task.name, desc: task.desc || "", icon: task.icon || "📋", type: task.type, target: task.target, coinReward: task.coinReward, conditions: task.conditions || {} });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.type) { showToast("Thiếu tên hoặc loại nhiệm vụ", "error"); return; }
    setSaving(true);
    try {
      if (editId) {
        await dailyTaskService.adminUpdateTask(editId, form);
        showToast("Đã cập nhật!", "success");
      } else {
        await dailyTaskService.adminCreateTask(form);
        showToast("Đã tạo nhiệm vụ mới!", "success");
      }
      setShowForm(false);
      load();
    } catch (e) { showToast(e.message || "Lỗi lưu", "error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (task) => {
    if (task.builtin) { showToast("Nhiệm vụ mặc định không thể xóa", "error"); return; }
    if (!confirm(`Xóa nhiệm vụ "${task.name}"?`)) return;
    try {
      await dailyTaskService.adminDeleteTask(task.id);
      showToast("Đã xóa!", "success");
      load();
    } catch (e) { showToast(e.message || "Lỗi xóa", "error"); }
  };

  const handleReset = async (userId, userName) => {
    if (!confirm(`Reset nhiệm vụ hôm nay của "${userName}"?`)) return;
    try {
      await dailyTaskService.adminReset(userId);
      showToast("Đã reset progress", "success");
      load();
    } catch (e) { showToast(e.message || "Lỗi reset", "error"); }
  };

  const taskHeaders = ["Nhiệm vụ", "Loại", "Mục tiêu", "Thưởng", "Hoàn thành", "Đã nhận", "Thao tác"];
  const renderTaskRow = (task) => (
    <tr key={task.id} className="border-t border-ink/5 hover:bg-ink/[0.02] transition">
      <td className="py-2.5 px-3 text-sm font-body text-ink">
        <div className="flex items-center gap-2">
          <span className="text-lg">{task.icon}</span>
          <div>
            <p className="font-semibold">{task.name}</p>
            <p className="text-[10px] text-[#8A7C63]">{task.desc}</p>
            {task.builtin && <span className="text-[9px] text-teal bg-teal/10 px-1.5 py-0.5 rounded">mặc định</span>}
          </div>
        </div>
      </td>
      <td className="py-2.5 px-3 text-sm font-mono text-ink">{TASK_TYPES.find(t => t.value === task.type)?.label || task.type}</td>
      <td className="py-2.5 px-3 text-sm font-mono text-ink">{task.target}</td>
      <td className="py-2.5 px-3 text-sm font-mono font-bold text-gold">+{task.coinReward} 💰</td>
      <td className="py-2.5 px-3 text-sm font-mono text-ink">{task.completed}</td>
      <td className="py-2.5 px-3 text-sm font-mono text-teal">{task.claimed}</td>
      <td className="py-2.5 px-3">
        <div className="flex items-center gap-1.5">
          <button onClick={() => openEdit(task)} className={`text-xs font-semibold hover:underline ${task.builtin ? "text-gray-300" : "text-ticket"}`}>Sửa</button>
          <button onClick={() => handleDelete(task)} className={`text-xs font-semibold hover:underline ${task.builtin ? "text-gray-300" : "text-red-400"}`}>Xóa</button>
        </div>
      </td>
    </tr>
  );

  const progressHeaders = ["Người dùng", "Đã nhận", "Xu nhận", "Thao tác"];
  const renderProgressRow = (item) => (
    <tr key={item.userId} className="border-t border-ink/5 hover:bg-ink/[0.02] transition">
      <td className="py-2.5 px-3 text-sm font-body text-ink">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-xs text-white font-bold shrink-0">
            {(item.userName || "?").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold truncate max-w-[160px]">{item.userName}</p>
            <p className="text-[10px] text-[#8A7C63] font-mono truncate max-w-[160px]">{item.userId}</p>
          </div>
        </div>
      </td>
      <td className="py-2.5 px-3 text-sm font-mono text-teal font-bold">{item.claimedCount}</td>
      <td className="py-2.5 px-3 text-sm font-mono text-gold font-bold">{item.totalReward.toLocaleString()} 💰</td>
      <td className="py-2.5 px-3">
        <button onClick={() => handleReset(item.userId, item.userName)} className="text-xs font-semibold text-red-400 hover:underline">Reset</button>
      </td>
    </tr>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <ManagementHeader subtitle="Quản trị" title="📝 Nhiệm vụ hàng ngày" />
        <PrimaryButton onClick={openCreate}>+ Tạo nhiệm vụ</PrimaryButton>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setTab("tasks")} className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${tab === "tasks" ? "bg-gold/20 text-gold" : "text-[#8A7C63] hover:bg-ink/5"}`}>
          📋 Danh sách nhiệm vụ
        </button>
        <button onClick={() => setTab("progress")} className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${tab === "progress" ? "bg-gold/20 text-gold" : "text-[#8A7C63] hover:bg-ink/5"}`}>
          👥 Tiến trình người dùng
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Người tham gia", value: stats?.totalUsersToday ?? "...", icon: "👥" },
          { label: "Lượt nhận thưởng", value: stats?.totalClaimedToday ?? "...", icon: "✅" },
          { label: "Xu đã phát", value: stats?.totalCoinsAwarded != null ? stats.totalCoinsAwarded.toLocaleString() : "...", icon: "💰" },
          { label: "Nhiệm vụ", value: stats?.taskStats?.length ?? "...", icon: "📝" },
        ].map((s) => (
          <div key={s.label} className="note-card p-4">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="font-display text-xl text-ink">{s.value}</div>
            <div className="text-[10px] text-[#8A7C63] font-mono uppercase">{s.label}</div>
          </div>
        ))}
      </div>

      {tab === "tasks" && (
        <ManagementTable
          title="Danh sách nhiệm vụ"
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

      {showForm && (
        <Modal onClose={() => !saving && setShowForm(false)}>
          <div className="space-y-4">
            <h3 className="font-display text-xl text-ink">{editId ? "Sửa nhiệm vụ" : "Tạo nhiệm vụ mới"}</h3>

            <div>
              <label className="text-xs font-mono text-[#8A7C63] uppercase block mb-1">Tên nhiệm vụ *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="VD: Chơi 5 trận game"
                className="w-full px-4 py-2.5 rounded-xl border border-ink/15 bg-paper text-ink text-sm font-body focus:outline-none focus:border-ticket" />
            </div>

            <div>
              <label className="text-xs font-mono text-[#8A7C63] uppercase block mb-1">Mô tả</label>
              <input value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })}
                placeholder="Mô tả ngắn"
                className="w-full px-4 py-2.5 rounded-xl border border-ink/15 bg-paper text-ink text-sm font-body focus:outline-none focus:border-ticket" />
            </div>

            <div>
              <label className="text-xs font-mono text-[#8A7C63] uppercase block mb-2">Icon</label>
              <div className="flex flex-wrap gap-2">
                {TASK_ICONS.map((icon) => (
                  <button key={icon} onClick={() => setForm({ ...form, icon })}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border transition ${form.icon === icon ? "border-ticket bg-ticket/10 scale-110" : "border-ink/10 bg-paper hover:border-ink/25"}`}>
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-[#8A7C63] uppercase block mb-1">Loại *</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-ink/15 bg-paper text-ink text-sm font-body focus:outline-none focus:border-ticket">
                  {TASK_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-mono text-[#8A7C63] uppercase block mb-1">Mục tiêu *</label>
                <input type="number" min="1" value={form.target} onChange={(e) => setForm({ ...form, target: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-ink/15 bg-paper text-ink text-sm font-body focus:outline-none focus:border-ticket" />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-[#8A7C63] uppercase block mb-1">💰 Thưởng xu *</label>
              <input type="number" min="1" value={form.coinReward} onChange={(e) => setForm({ ...form, coinReward: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-ink/15 bg-paper text-ink text-sm font-body focus:outline-none focus:border-ticket" />
            </div>

            <div className="border-t border-ink/10 pt-3">
              <label className="text-xs font-mono text-[#8A7C63] uppercase block mb-2">Điều kiện (tùy chọn)</label>
              <p className="text-[10px] text-[#8A7C63] mb-2">Nhiệm vụ chỉ tính khi event khớp điều kiện. Để trống = áp dụng cho tất cả game.</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-[#8A7C63] uppercase block mb-1">Game code</label>
                  <input value={form.conditions?.gameType || ""} onChange={(e) => setForm({ ...form, conditions: { ...form.conditions, gameType: e.target.value || undefined } })}
                    placeholder="VD: monopoly"
                    className="w-full px-3 py-2 rounded-xl border border-ink/15 bg-paper text-ink text-xs font-mono focus:outline-none focus:border-ticket" />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-[#8A7C63] uppercase block mb-1">Điểm tối thiểu</label>
                  <input type="number" min="0" value={form.conditions?.minScore || ""} onChange={(e) => setForm({ ...form, conditions: { ...form.conditions, minScore: e.target.value ? Number(e.target.value) : undefined } })}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-xl border border-ink/15 bg-paper text-ink text-xs font-mono focus:outline-none focus:border-ticket" />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <GhostButton onClick={() => setShowForm(false)} disabled={saving}>Hủy</GhostButton>
              <PrimaryButton onClick={handleSave} disabled={saving}>{saving ? "Đang lưu..." : editId ? "Lưu thay đổi" : "Tạo mới"}</PrimaryButton>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
