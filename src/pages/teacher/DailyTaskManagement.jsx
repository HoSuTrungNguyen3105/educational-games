import { useCallback, useEffect, useState } from "react";
import { taskService } from "../../services/taskService.js";
import { ManagementHeader, ManagementTable, Modal, GhostButton, PrimaryButton } from "../../components/ui.jsx";

const TASK_TYPES = [
  { value: "GAME_PLAYED", label: "Chơi game" },
  { value: "QUESTION_ANSWERED", label: "Trả lời câu hỏi" },
  { value: "ANSWER_CORRECT", label: "Trả lời đúng" },
  { value: "XP_EARNED", label: "Kiếm XP" },
  { value: "GAME_WON", label: "Thắng game" },
  { value: "LOGIN", label: "Đăng nhập" },
];

const TASK_SCOPES = [
  { value: "DAILY", label: "Hàng ngày" },
  { value: "WEEKLY", label: "Hàng tuần" },
  { value: "TOTAL", label: "Tổng cộng" },
];

const TASK_ICONS = ["🎮", "🏆", "📖", "🧠", "⭐", "🌟", "🎉", "👋", "📋", "🎯", "🔥", "💪", "✅", "📝"];

const emptyForm = { code: "", name: "", description: "", icon: "📋", type: "GAME_PLAYED", target: 1, rewardCoin: 10, rewardXp: 0, scope: "DAILY", gameId: null, isActive: true, sortOrder: 0 };

export default function DailyTaskManagement({ showToast }) {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("tasks");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setStats(null);
    setError(null);
    taskService.adminStats()
      .then((s) => setStats(s))
      .catch((e) => setError(e.message || "Lỗi tải dữ liệu"));
  }, []);
  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditId(null);
    setForm({ ...emptyForm });
    setShowForm(true);
  };

  const openEdit = (task) => {
    setEditId(task.id);
    setForm({ code: task.code || "", name: task.name, description: task.description || "", icon: task.icon || "📋", type: task.type, target: task.target, rewardCoin: task.rewardCoin || 0, rewardXp: task.rewardXp || 0, scope: task.scope || "DAILY", gameId: task.gameId || null, isActive: task.isActive !== false, sortOrder: task.sortOrder || 0 });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.code.trim() || !form.name.trim() || !form.type) { showToast("Thiếu mã, tên hoặc loại nhiệm vụ", "error"); return; }
    setSaving(true);
    try {
      if (editId) {
        await taskService.adminUpdateTask(editId, form);
        showToast("Đã cập nhật!", "success");
      } else {
        await taskService.adminCreateTask(form);
        showToast("Đã tạo nhiệm vụ mới!", "success");
      }
      setShowForm(false);
      load();
    } catch (e) { showToast(e.message || "Lỗi lưu", "error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (task) => {
    if (!confirm(`Xóa nhiệm vụ "${task.name}"?`)) return;
    try {
      await taskService.adminDeleteTask(task.id);
      showToast("Đã xóa!", "success");
      load();
    } catch (e) { showToast(e.message || "Lỗi xóa", "error"); }
  };

  const taskHeaders = ["Nhiệm vụ", "Loại", "Phạm vi", "Mục tiêu", "Thưởng", "Hoàn thành", "Đã nhận", "Thao tác"];
  const renderTaskRow = (task) => (
    <tr key={task.id} className="border-t border-ink/5 hover:bg-ink/[0.02] transition">
      <td className="py-2.5 px-3 text-sm font-body text-ink">
        <div className="flex items-center gap-2">
          <span className="text-lg">{task.icon}</span>
          <div>
            <p className="font-semibold">{task.name}</p>
            <p className="text-[10px] text-[#8A7C63]">{task.description || task.code}</p>
          </div>
        </div>
      </td>
      <td className="py-2.5 px-3 text-sm font-mono text-ink">{TASK_TYPES.find(t => t.value === task.type)?.label || task.type}</td>
      <td className="py-2.5 px-3 text-sm font-mono text-ink">{TASK_SCOPES.find(s => s.value === task.scope)?.label || task.scope}</td>
      <td className="py-2.5 px-3 text-sm font-mono text-ink">{task.target}</td>
      <td className="py-2.5 px-3 text-sm font-mono font-bold text-gold">+{task.rewardCoin} 💰</td>
      <td className="py-2.5 px-3 text-sm font-mono text-ink">{task.completedCount ?? 0}</td>
      <td className="py-2.5 px-3 text-sm font-mono text-teal">{task.claimedCount ?? 0}</td>
      <td className="py-2.5 px-3">
        <div className="flex items-center gap-1.5">
          <button onClick={() => openEdit(task)} className="text-xs font-semibold text-ticket hover:underline">Sửa</button>
          <button onClick={() => handleDelete(task)} className="text-xs font-semibold text-red-400 hover:underline">Xóa</button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <ManagementHeader subtitle="Quản trị" title="📝 Nhiệm vụ" />
        <PrimaryButton onClick={openCreate}>+ Tạo nhiệm vụ</PrimaryButton>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setTab("tasks")} className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${tab === "tasks" ? "bg-gold/20 text-gold" : "text-[#8A7C63] hover:bg-ink/5"}`}>
          📋 Danh sách nhiệm vụ
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Người tham gia", value: stats?.totalParticipants ?? "...", icon: "👥" },
          { label: "Lượt nhận thưởng", value: stats?.totalClaimed ?? "...", icon: "✅" },
          { label: "Xu đã phát", value: stats?.totalCoinsAwarded != null ? stats.totalCoinsAwarded.toLocaleString() : "...", icon: "💰" },
          { label: "Nhiệm vụ", value: stats?.totalTasks ?? "...", icon: "📝" },
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
          count={stats?.tasks?.length || 0}
          data={stats?.tasks || []}
          error={error}
          onRetry={load}
          emptyLabel="Chưa có dữ liệu"
          headers={taskHeaders}
          renderRow={renderTaskRow}
        />
      )}

      {showForm && (
        <Modal onClose={() => !saving && setShowForm(false)}>
          <div className="space-y-4">
            <h3 className="font-display text-xl text-ink">{editId ? "Sửa nhiệm vụ" : "Tạo nhiệm vụ mới"}</h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-[#8A7C63] uppercase block mb-1">Mã nhiệm vụ *</label>
                <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="VD: PLAY_5"
                  disabled={!!editId}
                  className="w-full px-4 py-2.5 rounded-xl border border-ink/15 bg-paper text-ink text-sm font-mono focus:outline-none focus:border-ticket disabled:opacity-50" />
              </div>
              <div>
                <label className="text-xs font-mono text-[#8A7C63] uppercase block mb-1">Tên nhiệm vụ *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="VD: Chơi 5 trận game"
                  className="w-full px-4 py-2.5 rounded-xl border border-ink/15 bg-paper text-ink text-sm font-body focus:outline-none focus:border-ticket" />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-[#8A7C63] uppercase block mb-1">Mô tả</label>
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
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

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-mono text-[#8A7C63] uppercase block mb-1">Loại *</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-ink/15 bg-paper text-ink text-sm font-body focus:outline-none focus:border-ticket">
                  {TASK_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-mono text-[#8A7C63] uppercase block mb-1">Phạm vi *</label>
                <select value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-ink/15 bg-paper text-ink text-sm font-body focus:outline-none focus:border-ticket">
                  {TASK_SCOPES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-mono text-[#8A7C63] uppercase block mb-1">Mục tiêu *</label>
                <input type="number" min="1" value={form.target} onChange={(e) => setForm({ ...form, target: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-ink/15 bg-paper text-ink text-sm font-body focus:outline-none focus:border-ticket" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-[#8A7C63] uppercase block mb-1">💰 Thưởng xu</label>
                <input type="number" min="0" value={form.rewardCoin} onChange={(e) => setForm({ ...form, rewardCoin: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-ink/15 bg-paper text-ink text-sm font-body focus:outline-none focus:border-ticket" />
              </div>
              <div>
                <label className="text-xs font-mono text-[#8A7C63] uppercase block mb-1">⭐ Thưởng XP</label>
                <input type="number" min="0" value={form.rewardXp} onChange={(e) => setForm({ ...form, rewardXp: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-ink/15 bg-paper text-ink text-sm font-body focus:outline-none focus:border-ticket" />
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
