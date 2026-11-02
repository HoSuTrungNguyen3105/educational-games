/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback, useMemo } from "react";
import { CalendarDays, Plus, Pencil, Trash2, Clock, Users } from "lucide-react";
import { classService } from "../../services/api.js";
import { scheduleApi } from "../../services/scheduleApi.js";
import { Loader, EmptyState, ErrorState, PrimaryButton, Modal, ConfirmModal } from "../../components/ui";
import { useConfirm } from "../../hooks/useConfirm.js";
import { navigate } from "../../lib/router.js";

// Trang Lịch học (đợt 3): thời khóa biểu theo TUẦN.
// - Học sinh: buổi học cá nhân của mình + lịch lớp do giáo viên đặt.
// - Giáo viên: thêm được buổi cho cả lớp mình dạy (chọn ở ô "Phạm vi").
// Backend kiểm tra quyền sửa/xóa từng buổi (canEdit) — trang chỉ hiện nút
// khi canEdit = true.

const WEEKDAYS = [
  { d: 1, label: "Thứ 2", short: "T2" },
  { d: 2, label: "Thứ 3", short: "T3" },
  { d: 3, label: "Thứ 4", short: "T4" },
  { d: 4, label: "Thứ 5", short: "T5" },
  { d: 5, label: "Thứ 6", short: "T6" },
  { d: 6, label: "Thứ 7", short: "T7" },
  { d: 7, label: "Chủ nhật", short: "CN" },
];

const todayIso = ((new Date().getDay() + 6) % 7) + 1; // 1=Thứ 2 … 7=Chủ nhật

const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-[#E7D9BE] bg-white text-sm outline-none focus:border-[#1B998B] transition-colors";
const labelCls = "block text-xs font-bold text-[#8A7C63] uppercase tracking-wide mb-1.5";

const EMPTY_FORM = {
  title: "", subject: "", weekday: todayIso, startTime: "07:00", endTime: "08:00",
  note: "", target: "personal",
};

function EntryFormModal({ initial, classes, isStaff, busy, error, onClose, onSave }) {
  const [form, setForm] = useState(initial);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function submit(e) {
    e.preventDefault();
    onSave({
      title: form.title.trim(),
      subject: form.subject.trim() || null,
      weekday: Number(form.weekday),
      startTime: form.startTime,
      endTime: form.endTime,
      note: form.note.trim() || null,
      classId: isStaff && form.target !== "personal" ? form.target : null,
    });
  }

  return (
    <Modal onClose={onClose}>
      <form onSubmit={submit}>
        <h3 className="font-display text-lg text-ink mb-4">{initial.id ? "Sửa buổi học" : "Thêm buổi học"}</h3>
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Tiêu đề *</label>
            <input value={form.title} onChange={set("title")} placeholder="VD: Học thêm Toán, Ôn tập tiếng Anh..." className={inputCls} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Môn học</label>
              <input value={form.subject} onChange={set("subject")} placeholder="VD: Toán" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Thứ *</label>
              <select value={form.weekday} onChange={set("weekday")} className={inputCls}>
                {WEEKDAYS.map((w) => <option key={w.d} value={w.d}>{w.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Bắt đầu *</label>
              <input type="time" value={form.startTime} onChange={set("startTime")} className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>Kết thúc *</label>
              <input type="time" value={form.endTime} onChange={set("endTime")} className={inputCls} required />
            </div>
          </div>
          {isStaff && classes.length > 0 && !initial.id && (
            <div>
              <label className={labelCls}>Phạm vi</label>
              <select value={form.target} onChange={set("target")} className={inputCls}>
                <option value="personal">Chỉ mình tôi</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>Cả lớp {c.name}</option>
                ))}
              </select>
              <p className="text-[11px] text-[#8A7C63] mt-1">Đặt cho cả lớp thì mọi học sinh trong lớp đều thấy buổi học này.</p>
            </div>
          )}
          <div>
            <label className={labelCls}>Ghi chú</label>
            <textarea value={form.note} onChange={set("note")} placeholder="Phòng học, link học online, cần mang theo..." className={`${inputCls} min-h-[64px]`} />
          </div>
          {error && <p className="px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">{error}</p>}
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 bg-white border border-[#E7D9BE] text-sm font-bold rounded-full hover:bg-[#FAF3E3] transition-colors">
              Hủy
            </button>
            <button type="submit" disabled={busy} className="flex-1 px-4 py-2.5 bg-[#1B998B] text-white text-sm font-bold rounded-full hover:bg-[#178a7d] transition-colors disabled:opacity-60">
              {busy ? "Đang lưu..." : "Lưu buổi học"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default function SchedulePage({ userAuth, showToast }) {
  const me = userAuth?.user || null;
  const isStaff = me?.role === "teacher" || me?.role === "admin";
  const [entries, setEntries] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formState, setFormState] = useState(null); // { ...EMPTY_FORM, id? }
  const [formBusy, setFormBusy] = useState(false);
  const [formError, setFormError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const { askConfirm, confirmProps } = useConfirm();

  const load = useCallback(async () => {
    if (!me) return;
    setLoading(true);
    setError("");
    try {
      const [list, classList] = await Promise.all([
        scheduleApi.list(),
        isStaff ? classService.list().catch(() => []) : Promise.resolve([]),
      ]);
      setEntries(Array.isArray(list) ? list : []);
      setClasses(Array.isArray(classList) ? classList : []);
    } catch (e) {
      setError(e.message || "Không tải được lịch học.");
    } finally {
      setLoading(false);
    }
  }, [me, isStaff]);

  useEffect(() => { load(); }, [load, reloadKey]);

  const byDay = useMemo(() => {
    const map = new Map(WEEKDAYS.map((w) => [w.d, []]));
    for (const entry of entries) {
      if (map.has(entry.weekday)) map.get(entry.weekday).push(entry);
    }
    return map;
  }, [entries]);

  async function handleSave(data) {
    setFormBusy(true);
    setFormError("");
    try {
      if (formState?.id) await scheduleApi.update(formState.id, data);
      else await scheduleApi.create(data);
      if (showToast) showToast(formState?.id ? "Đã sửa buổi học" : "Đã thêm buổi học", "success");
      setFormState(null);
      setReloadKey((k) => k + 1);
    } catch (e) {
      setFormError(e.message || "Lưu thất bại, vui lòng thử lại.");
    } finally {
      setFormBusy(false);
    }
  }

  function handleDelete(entry) {
    askConfirm({
      title: "Xóa buổi học",
      message: `Xóa buổi "${entry.title}" (${entry.startTime}–${entry.endTime})?`,
      confirmText: "Xóa",
      onConfirm: async () => {
        try {
          await scheduleApi.remove(entry.id);
          if (showToast) showToast("Đã xóa buổi học", "success");
          setReloadKey((k) => k + 1);
        } catch (e) {
          setError(e.message || "Xóa thất bại.");
        }
      },
    });
  }

  if (!me) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="text-center anim-pop">
          <div className="mb-4 flex justify-center text-purple-500"><CalendarDays className="w-14 h-14" /></div>
          <h2 className="font-display text-xl text-ink mb-2">Chưa đăng nhập</h2>
          <p className="text-sm text-[#8A7C63] mb-4">Bạn cần đăng nhập để xem lịch học</p>
          <PrimaryButton onClick={() => navigate("/")}>← Về trang chủ</PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-5 w-full">
      <ConfirmModal {...confirmProps} />
      <div className="flex items-center justify-between gap-3 mb-1">
        <h1 className="font-display text-xl text-ink">Lịch học tuần</h1>
        <PrimaryButton onClick={() => { setFormError(""); setFormState({ ...EMPTY_FORM }); }}>
          <span className="flex items-center gap-1.5"><Plus className="w-4 h-4" /> Thêm buổi học</span>
        </PrimaryButton>
      </div>
      <p className="text-sm text-[#8A7C63] mb-4">
        Buổi học lặp lại mỗi tuần.{isStaff ? " Giáo viên đặt lịch cho cả lớp ở ô Phạm vi khi thêm buổi." : " Lịch lớp do giáo viên đặt sẽ hiện cùng lịch cá nhân của em."}
      </p>

      {loading && <div className="flex justify-center py-10"><Loader label="Đang tải lịch..." /></div>}
      {!loading && error && <ErrorState title="Không tải được lịch học" subtitle={error} onRetry={() => setReloadKey((k) => k + 1)} />}

      {!loading && !error && entries.length === 0 && (
        <EmptyState
          icon={<CalendarDays className="w-10 h-10 text-purple-400" />}
          title="Chưa có buổi học nào"
          subtitle={'Bấm "Thêm buổi học" để xếp lịch học đầu tiên của tuần.'}
        />
      )}

      {!loading && entries.length > 0 && (
        <div className="overflow-x-auto pb-2 -mx-4 px-4">
          <div className="grid grid-cols-7 gap-2 min-w-[880px]">
            {WEEKDAYS.map((w) => {
              const dayEntries = byDay.get(w.d) || [];
              const isToday = w.d === todayIso;
              return (
                <div key={w.d} className={`rounded-2xl border p-2 min-h-[180px] ${isToday ? "border-[#1B998B] bg-[#1B998B]/5" : "border-[#E7D9BE] bg-white/60"}`}>
                  <p className={`text-center text-xs font-bold uppercase tracking-wide mb-2 ${isToday ? "text-[#1B998B]" : "text-[#8A7C63]"}`}>
                    {w.label}{isToday ? " · Hôm nay" : ""}
                  </p>
                  <div className="space-y-2">
                    {dayEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className={`rounded-xl p-2.5 border ${entry.scope === "class" ? "bg-violet-50 border-violet-200" : "bg-[#FAF3E3] border-[#E7D9BE]"}`}
                      >
                        <p className="flex items-center gap-1 text-[11px] font-bold text-[#20283A]">
                          <Clock className="w-3 h-3" /> {entry.startTime}–{entry.endTime}
                        </p>
                        <p className="text-xs font-semibold text-[#20283A] mt-1 leading-snug">{entry.title}</p>
                        {entry.subject && <p className="text-[11px] text-[#8A7C63]">{entry.subject}</p>}
                        {entry.scope === "class" && (
                          <p className="flex items-center gap-1 text-[11px] font-semibold text-violet-600 mt-1">
                            <Users className="w-3 h-3" /> Lớp {entry.className || ""}
                          </p>
                        )}
                        {entry.note && <p className="text-[11px] text-[#8A7C63] mt-1 leading-snug">{entry.note}</p>}
                        {entry.canEdit && (
                          <div className="flex gap-1.5 mt-2">
                            <button
                              onClick={() => {
                                setFormError("");
                                setFormState({
                                  id: entry.id,
                                  title: entry.title,
                                  subject: entry.subject || "",
                                  weekday: entry.weekday,
                                  startTime: entry.startTime,
                                  endTime: entry.endTime,
                                  note: entry.note || "",
                                  target: entry.scope === "class" ? entry.classId : "personal",
                                });
                              }}
                              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-[#E7D9BE] text-[11px] font-bold text-[#20283A] hover:bg-[#FAF3E3]"
                            >
                              <Pencil className="w-3 h-3" /> Sửa
                            </button>
                            <button
                              onClick={() => handleDelete(entry)}
                              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-red-200 text-[11px] font-bold text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3" /> Xóa
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    {dayEntries.length === 0 && (
                      <p className="text-center text-[11px] text-[#C9BBA0] py-3">Trống</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {formState && (
        <EntryFormModal
          initial={formState}
          classes={classes}
          isStaff={isStaff}
          busy={formBusy}
          error={formError}
          onClose={() => setFormState(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
