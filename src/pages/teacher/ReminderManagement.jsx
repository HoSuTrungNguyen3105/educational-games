import { useState, useEffect, useCallback } from "react";
import { reminderService } from "../../services/api.js";
import { Loader, ConfirmModal, EmptyState } from "../../components/ui.jsx";
import { useConfirm } from "../../hooks/useConfirm.js";
import DateTimePicker from "../../components/DateTimePicker.jsx";
import VibratePatternPicker from "../../components/VibratePatternPicker.jsx";
import {
  localDatetimeToISO,
  isoToLocalDatetimeValue,
  formatDateTime,
} from "../../lib/reminderUtils.js";
import { Bell, Plus, Trash2, Clock, RotateCcw, CheckCircle, AlertCircle, Pencil } from "lucide-react";

const REPEAT_OPTIONS = [
  { value: "none", label: "Không lặp" },
  { value: "daily", label: "Hàng ngày" },
  { value: "weekly", label: "Hàng tuần" },
];

const EMPTY_FORM = { title: "", message: "", remindAt: "", repeat: "none", vibrate: true, sound: true, vibratePattern: "" };

function getRepeatLabel(v) {
  return REPEAT_OPTIONS.find((o) => o.value === v)?.label || "Không lặp";
}

function getTimeStatus(remindAt, triggered) {
  if (triggered) return { label: "Đã nhắc", color: "text-green-600 bg-green-50", icon: CheckCircle };
  const now = new Date();
  const target = new Date(remindAt);
  const diff = target - now;
  if (diff < 0) return { label: "Đến giờ!", color: "text-red-600 bg-red-50", icon: AlertCircle };
  if (diff < 3600000) return { label: `Còn ${Math.ceil(diff / 60000)} phút`, color: "text-amber-600 bg-amber-50", icon: Clock };
  if (diff < 86400000) return { label: `Còn ${Math.floor(diff / 3600000)} giờ`, color: "text-blue-600 bg-blue-50", icon: Clock };
  return { label: `Còn ${Math.floor(diff / 86400000)} ngày`, color: "text-gray-600 bg-gray-50", icon: Clock };
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors ${checked ? "bg-gold" : "bg-gray-300"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : ""}`} />
      </button>
      <span className="text-sm text-ink">{label}</span>
    </label>
  );
}

export default function ReminderManagement({ showToast }) {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [dueAlert, setDueAlert] = useState(null);
  const { askConfirm, confirmProps } = useConfirm();

  const load = useCallback(async () => {
    try {
      const data = await reminderService.list();
      setReminders(data || []);
    } catch (e) {
      showToast?.("Lỗi tải danh sách nhắc nhở", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const due = await reminderService.getDue();
        if (due && due.length > 0 && !dueAlert) {
          setDueAlert(due[0]);
        }
      } catch { /* ignore */ }
    }, 30000);
    return () => clearInterval(interval);
  }, [dueAlert]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (r) => {
    setEditingId(r.id);
    setForm({
      title: r.title || "",
      message: r.message || "",
      // ISO (UTC) từ backend → giờ địa phương để điền vào picker
      remindAt: isoToLocalDatetimeValue(r.remindAt),
      repeat: r.repeat || "none",
      vibrate: r.vibrate !== false,
      sound: r.sound !== false,
      vibratePattern: r.vibratePattern || "",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.remindAt) {
      showToast?.("Vui lòng nhập tên và thời gian nhắc", "error");
      return;
    }
    // Giờ địa phương user chọn → ISO UTC rõ ràng, không phụ thuộc browser parse
    const remindAt = localDatetimeToISO(form.remindAt);
    if (!remindAt) {
      showToast?.("Thời gian nhắc không hợp lệ", "error");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        message: form.message.trim(),
        remindAt,
        repeat: form.repeat,
        vibrate: form.vibrate,
        sound: form.sound,
        vibratePattern: form.vibratePattern,
      };
      if (editingId) {
        await reminderService.update(editingId, payload);
        showToast?.("Đã cập nhật nhắc nhở!", "success");
      } else {
        await reminderService.create(payload);
        showToast?.("Đã tạo nhắc nhở!", "success");
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
      load();
    } catch (e) {
      showToast?.("Lỗi lưu nhắc nhở: " + (e.message || ""), "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id, title) => {
    askConfirm({
      title: "Xóa nhắc nhở",
      message: title ? `Xóa nhắc nhở "${title}"?` : "Xóa nhắc nhở này?",
      onConfirm: async () => {
        try {
          await reminderService.delete_(id);
          showToast?.("Đã xóa", "success");
          load();
        } catch (e) {
          showToast?.("Lỗi xóa", "error");
        }
      },
    });
  };

  const handleDismissDue = async () => {
    if (!dueAlert) return;
    try {
      await reminderService.trigger(dueAlert.id);
    } catch { /* ignore */ }
    setDueAlert(null);
    load();
  };

  const activeReminders = reminders.filter((r) => !r.triggered);
  const pastReminders = reminders.filter((r) => r.triggered);

  if (loading) return <div className="flex items-center justify-center p-12"><Loader label="Đang tải..." /></div>;

  return (
    <div className="space-y-6">
      {dueAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl animate-[popIn_.3s_ease]">
            <div className="text-center mb-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
                <Bell className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-lg font-bold text-ink">🔔 Nhắc nhở!</h3>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
              <p className="font-semibold text-ink">{dueAlert.title}</p>
              {dueAlert.message && <p className="text-sm text-gray-600 mt-1">{dueAlert.message}</p>}
              <p className="text-xs text-gray-400 mt-2">{formatDateTime(dueAlert.remindAt)}</p>
            </div>
            <button onClick={handleDismissDue} className="w-full py-2.5 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition">
              Đã nhớ!
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink flex items-center gap-2">
            <Bell className="w-6 h-6 text-gold" />
            Nhắc nhở
          </h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý thời gian biểu và nhắc nhở cá nhân</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-gold text-white rounded-xl font-semibold text-sm hover:bg-gold/90 transition">
          <Plus className="w-4 h-4" />
          Tạo nhắc nhở
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-ink/10 p-6 space-y-4">
          <h3 className="font-bold text-ink">{editingId ? "Sửa nhắc nhở" : "Thêm nhắc nhở mới"}</h3>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Tiêu đề *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border border-ink/10 rounded-xl text-sm focus:border-gold outline-none"
              placeholder="VD: Kiểm tra bài tập lớp 3A" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Ghi chú</label>
            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-3 py-2 border border-ink/10 rounded-xl text-sm focus:border-gold outline-none resize-none"
              rows={2} placeholder="Chi tiết (tùy chọn)..." />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Thời gian nhắc *</label>
              <DateTimePicker
                value={form.remindAt}
                onChange={(v) => setForm({ ...form, remindAt: v })}
                placeholder="Chọn ngày giờ nhắc"
              />
              <p className="text-[10px] text-gray-400 mt-1">Theo giờ trên thiết bị của bạn.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Lặp lại</label>
              <select value={form.repeat} onChange={(e) => setForm({ ...form, repeat: e.target.value })}
                className="w-full px-3 py-2 border border-ink/10 rounded-xl text-sm focus:border-gold outline-none bg-white">
                {REPEAT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-6 pt-1">
            <Toggle checked={form.vibrate} onChange={(v) => setForm({ ...form, vibrate: v })} label="📱 Rung" />
            <Toggle checked={form.sound} onChange={(v) => setForm({ ...form, sound: v })} label="🔔 Âm thanh" />
          </div>
          <VibratePatternPicker
            value={form.vibratePattern}
            onChange={(v) => setForm({ ...form, vibratePattern: v })}
            enabled={form.vibrate}
          />
          <div className="flex gap-2 justify-end">
            <button onClick={() => { setShowForm(false); setEditingId(null); }} className="px-4 py-2 text-sm text-gray-500 hover:text-ink transition">Hủy</button>
            <button onClick={handleSave} disabled={saving}
              className="px-5 py-2 bg-gold text-white rounded-xl text-sm font-semibold hover:bg-gold/90 transition disabled:opacity-50">
              {saving ? "Đang lưu..." : editingId ? "Cập nhật" : "Tạo nhắc nhở"}
            </button>
          </div>
        </div>
      )}

      {activeReminders.length === 0 && pastReminders.length === 0 && (
        <EmptyState
          icon="🔔"
          title="Chưa có nhắc nhở nào"
          subtitle='Nhấn "Tạo nhắc nhở" để bắt đầu'
        />
      )}

      {activeReminders.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">Sắp tới ({activeReminders.length})</h2>
          <div className="space-y-2">
            {activeReminders.map((r) => {
              const status = getTimeStatus(r.remindAt, r.triggered);
              const StatusIcon = status.icon;
              return (
                <div key={r.id} className="flex items-center gap-3 bg-white border border-ink/5 rounded-xl p-4 hover:border-ink/10 transition">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${status.color}`}>
                    <StatusIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink text-sm truncate">{r.title}</p>
                    {r.message && <p className="text-xs text-gray-500 truncate mt-0.5">{r.message}</p>}
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-400">{formatDateTime(r.remindAt)}</span>
                      {r.repeat !== "none" && (
                        <span className="text-xs text-blue-500 flex items-center gap-1">
                          <RotateCcw className="w-3 h-3" /> {getRepeatLabel(r.repeat)}
                        </span>
                      )}
                      <span className="text-xs">{r.vibrate !== false ? "📱" : ""}{r.sound !== false ? "🔔" : ""}</span>
                    </div>
                  </div>
                  <button onClick={() => openEdit(r)} className="text-gray-300 hover:text-gold transition p-1" title="Sửa">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(r.id, r.title)} className="text-gray-300 hover:text-red-500 transition p-1" title="Xóa">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {pastReminders.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">Đã nhắc ({pastReminders.length})</h2>
          <div className="space-y-2">
            {pastReminders.map((r) => (
              <div key={r.id} className="flex items-center gap-3 bg-gray-50 border border-ink/5 rounded-xl p-4 opacity-60">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-green-50 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ink text-sm truncate line-through">{r.title}</p>
                  <span className="text-xs text-gray-400">{formatDateTime(r.remindAt)}</span>
                </div>
                <button onClick={() => handleDelete(r.id, r.title)} className="text-gray-300 hover:text-red-500 transition p-1" title="Xóa">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <ConfirmModal {...confirmProps} />
    </div>
  );
}
