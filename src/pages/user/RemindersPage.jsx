import { useState, useEffect, useCallback, useMemo } from "react";
import { reminderService } from "../../services/api.js";
import { Loader, EmptyState, ErrorState, ConfirmModal, PrimaryButton } from "../../components/ui.jsx";
import { useConfirm } from "../../hooks/useConfirm.js";
import DateTimePicker from "../../components/DateTimePicker.jsx";
import VibratePatternPicker from "../../components/VibratePatternPicker.jsx";
import ReminderCalendar from "../../components/ReminderCalendar.jsx";
import {
  localDatetimeToISO,
  isoToLocalDatetimeValue,
  formatDateTime,
  formatTime,
  localDateKey,
  VI_MONTHS,
} from "../../lib/reminderUtils.js";
import {
  Bell, BellRing, Plus, Trash2, Pencil, Clock, RotateCcw,
  CheckCircle2, CalendarDays, List, Power, X,
} from "lucide-react";

const REPEAT_OPTIONS = [
  { value: "none", label: "Không lặp" },
  { value: "daily", label: "Hàng ngày" },
  { value: "weekly", label: "Hàng tuần" },
];

const EMPTY_FORM = { title: "", message: "", remindAt: "", repeat: "none", vibrate: true, sound: true, vibratePattern: "" };

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

function getCountdown(remindAt) {
  const diff = new Date(remindAt) - new Date();
  if (diff <= 0) return "Đến giờ!";
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `Còn ${mins} phút`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Còn ${hours} giờ ${mins % 60} phút`;
  const days = Math.floor(hours / 24);
  return `Còn ${days} ngày`;
}

export default function RemindersPage({ userAuth, onBack, showToast }) {
  const [reminders, setReminders] = useState(null);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("list"); // list | calendar
  const [selectedDate, setSelectedDate] = useState(() => localDateKey(new Date()));
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const { askConfirm, confirmProps } = useConfirm();

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await reminderService.list();
      setReminders(data || []);
    } catch (e) {
      setError(e.message || "Không tải được nhắc nhở");
      setReminders([]);
    }
  }, []);

  useEffect(() => { if (userAuth?.user) load(); }, [userAuth?.user, load]);

  const activeReminders = useMemo(
    () => (reminders || []).filter((r) => !r.triggered).sort((a, b) => new Date(a.remindAt) - new Date(b.remindAt)),
    [reminders]
  );
  const doneReminders = useMemo(
    () => (reminders || []).filter((r) => r.triggered).sort((a, b) => new Date(b.remindAt) - new Date(a.remindAt)),
    [reminders]
  );

  const dayReminders = useMemo(
    () => activeReminders.filter((r) => localDateKey(r.remindAt) === selectedDate),
    [activeReminders, selectedDate]
  );

  const selectedDateLabel = useMemo(() => {
    const [y, m, d] = selectedDate.split("-").map(Number);
    return `${d} ${VI_MONTHS[m - 1]} ${y}`;
  }, [selectedDate]);

  if (!userAuth?.user) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="text-center anim-pop">
          <div className="text-6xl mb-4">🔔</div>
          <h2 className="font-display text-xl text-ink mb-2">Chưa đăng nhập</h2>
          <p className="text-sm text-[#8A7C63] mb-4">Bạn cần đăng nhập để dùng nhắc nhở</p>
          <PrimaryButton onClick={onBack}>← Về trang chủ</PrimaryButton>
        </div>
      </div>
    );
  }

  const openCreate = (presetDate) => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, remindAt: presetDate ? `${presetDate}T08:00` : "" });
    setShowForm(true);
  };

  const openEdit = (r) => {
    setEditingId(r.id);
    setForm({
      title: r.title || "",
      message: r.message || "",
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

  // Bật/tắt: dùng cờ triggered (tắt = đánh dấu đã xong để không kích hoạt nữa)
  const handleToggle = async (r) => {
    try {
      if (r.triggered) {
        // Bật lại: nếu giờ đã qua thì phải chọn giờ mới
        if (new Date(r.remindAt) <= new Date()) {
          openEdit(r);
          showToast?.("Giờ nhắc đã qua, hãy chọn giờ mới", "error");
          return;
        }
        await reminderService.update(r.id, { triggered: false });
      } else {
        await reminderService.update(r.id, { triggered: true });
      }
      load();
    } catch (e) {
      showToast?.("Lỗi: " + (e.message || ""), "error");
    }
  };

  const renderCard = (r, done = false) => (
    <div
      key={r.id}
      className={`flex items-center gap-3 rounded-2xl p-4 border transition ${
        done ? "bg-ink/5 border-ink/5 opacity-60" : "bg-white border-ink/10 hover:border-gold/40 hover:shadow-md"
      }`}
    >
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${
        done ? "bg-green-100 text-green-600" : "bg-gradient-to-br from-amber-300 to-orange-400 text-white"
      }`}>
        {done ? <CheckCircle2 className="w-5 h-5" /> : <BellRing className="w-5 h-5" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-bold text-ink text-sm truncate ${done ? "line-through" : ""}`}>{r.title}</p>
        {r.message && <p className="text-xs text-ink/50 truncate mt-0.5">{r.message}</p>}
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gold bg-gold/10 rounded-full px-2 py-0.5">
            <Clock className="w-3 h-3" />
            {done ? formatDateTime(r.remindAt) : `${formatDateTime(r.remindAt)} · ${getCountdown(r.remindAt)}`}
          </span>
          {r.repeat && r.repeat !== "none" && (
            <span className="inline-flex items-center gap-1 text-[11px] text-blue-600 bg-blue-50 rounded-full px-2 py-0.5">
              <RotateCcw className="w-3 h-3" />
              {REPEAT_OPTIONS.find((o) => o.value === r.repeat)?.label}
            </span>
          )}
          {!done && (
            <span className="text-[11px] text-ink/40">
              {r.vibrate !== false ? "📱" : ""}{r.sound !== false ? "🔔" : ""}
            </span>
          )}
        </div>
      </div>
      {!done && (
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => handleToggle(r)}
            title="Tắt nhắc nhở"
            className="p-2 rounded-xl text-green-500 hover:bg-green-50 transition"
          >
            <Power className="w-4 h-4" />
          </button>
          <button onClick={() => openEdit(r)} title="Sửa" className="p-2 rounded-xl text-ink/30 hover:text-gold hover:bg-gold/10 transition">
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(r.id, r.title)} title="Xóa" className="p-2 rounded-xl text-ink/30 hover:text-red-500 hover:bg-red-50 transition">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
      {done && (
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => handleToggle(r)}
            title="Bật lại"
            className="p-2 rounded-xl text-ink/30 hover:text-green-500 hover:bg-green-50 transition"
          >
            <Power className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(r.id, r.title)} title="Xóa" className="p-2 rounded-xl text-ink/30 hover:text-red-500 hover:bg-red-50 transition">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-ink flex items-center gap-2">
            <span className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </span>
            Nhắc nhở của tôi
          </h1>
          <p className="text-xs text-ink/50 mt-1 ml-11">
            {activeReminders.length > 0
              ? `${activeReminders.length} nhắc nhở đang bật`
              : "Chưa có nhắc nhở nào đang bật"}
          </p>
        </div>
        <button
          onClick={() => openCreate()}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-orange-200 hover:shadow-xl active:scale-95 transition"
        >
          <Plus className="w-4 h-4" /> Tạo mới
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-ink/5 rounded-2xl p-1 gap-1">
        {[
          { key: "list", label: "Danh sách", icon: List },
          { key: "calendar", label: "Lịch", icon: CalendarDays },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-bold transition ${
              tab === t.key ? "bg-white text-ink shadow" : "text-ink/40 hover:text-ink/70"
            }`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {reminders === null ? (
        <div className="flex justify-center py-16"><Loader label="Đang tải..." /></div>
      ) : error ? (
        <ErrorState subtitle={error} onRetry={load} />
      ) : tab === "calendar" ? (
        <div className="space-y-4">
          <ReminderCalendar
            reminders={reminders}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold text-ink text-sm">Ngày {selectedDateLabel}</h2>
              <button
                onClick={() => openCreate(selectedDate)}
                className="text-xs font-bold text-gold hover:underline"
              >
                + Thêm vào ngày này
              </button>
            </div>
            {dayReminders.length === 0 ? (
              <p className="text-center text-sm text-ink/40 py-8 bg-white rounded-2xl border border-ink/10">
                Không có nhắc nhở nào vào ngày này
              </p>
            ) : (
              <div className="space-y-2">{dayReminders.map((r) => renderCard(r))}</div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {activeReminders.length === 0 && doneReminders.length === 0 ? (
            <EmptyState
              icon="🔔"
              title="Chưa có nhắc nhở nào"
              subtitle="Tạo nhắc nhở để không bỏ lỡ việc quan trọng nhé!"
              action={<PrimaryButton onClick={() => openCreate()}>+ Tạo nhắc nhở</PrimaryButton>}
            />
          ) : (
            <>
              {activeReminders.length > 0 && (
                <div className="space-y-2">{activeReminders.map((r) => renderCard(r))}</div>
              )}
              {doneReminders.length > 0 && (
                <details className="group">
                  <summary className="cursor-pointer text-xs font-bold text-ink/40 uppercase tracking-wide py-2 list-none flex items-center gap-1">
                    <span className="group-open:rotate-90 transition-transform">▶</span>
                    Đã xong / đã tắt ({doneReminders.length})
                  </summary>
                  <div className="space-y-2 mt-1">{doneReminders.map((r) => renderCard(r, true))}</div>
                </details>
              )}
            </>
          )}
        </div>
      )}

      {/* Form tạo/sửa */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4" onClick={() => setShowForm(false)}>
          <div
            className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[92vh] overflow-y-auto p-6 space-y-4 anim-pop"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-ink">
                {editingId ? "Sửa nhắc nhở" : "Nhắc nhở mới"}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-ink/5 transition">
                <X className="w-5 h-5 text-ink/40" />
              </button>
            </div>

            <div>
              <label className="block text-sm font-bold text-ink mb-1">Tên nhắc nhở *</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="VD: Ôn bài Toán, Uống nước..."
                className="w-full px-4 py-2.5 border border-ink/10 rounded-2xl text-sm focus:border-gold outline-none bg-ink/[0.02]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-ink mb-1">Ghi chú</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Chi tiết thêm (tùy chọn)..."
                rows={2}
                className="w-full px-4 py-2.5 border border-ink/10 rounded-2xl text-sm focus:border-gold outline-none resize-none bg-ink/[0.02]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-sm font-bold text-ink mb-1">Nhắc lúc *</label>
                <DateTimePicker
                  value={form.remindAt}
                  onChange={(v) => setForm({ ...form, remindAt: v })}
                  placeholder="Chọn ngày giờ"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-bold text-ink mb-1">Lặp lại</label>
                <div className="flex gap-1.5">
                  {REPEAT_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => setForm({ ...form, repeat: o.value })}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                        form.repeat === o.value
                          ? "bg-gold text-white border-gold shadow-md shadow-gold/20"
                          : "bg-white text-ink/50 border-ink/10 hover:border-gold/40"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 bg-ink/[0.03] rounded-2xl px-4 py-3">
              <Toggle checked={form.vibrate} onChange={(v) => setForm({ ...form, vibrate: v })} label="📱 Rung" />
              <Toggle checked={form.sound} onChange={(v) => setForm({ ...form, sound: v })} label="🔔 Chuông" />
            </div>
            <VibratePatternPicker
              value={form.vibratePattern}
              onChange={(v) => setForm({ ...form, vibratePattern: v })}
              enabled={form.vibrate}
            />

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-2xl font-bold shadow-lg shadow-orange-200 hover:shadow-xl active:scale-[0.98] transition disabled:opacity-50"
            >
              {saving ? "Đang lưu..." : editingId ? "Lưu thay đổi" : "Tạo nhắc nhở"}
            </button>
          </div>
        </div>
      )}

      <ConfirmModal {...confirmProps} />
    </div>
  );
}
