// pages/teacher/EventManagement.jsx
//
// Sự kiện & Thử thách Theo Mùa (Đợt 3) — trang quản trị cho ADMIN:
// tạo chiến dịch giới hạn thời gian (vd "Tuần lễ Vui Toán") KHÔNG cần
// sửa code: tên, cửa sổ thời gian, phạm vi (toàn trường / theo khối lớp)
// và chuỗi cột mốc nhiệm vụ kèm phần thưởng giới hạn.
//
// Trung thực theo dữ liệu thật:
//  · Loại nhiệm vụ CHỈ gồm những gì server đo được từ lịch sử ván chơi:
//    số ván hoàn thành / số ván theo chủ đề / tổng XP. KHÔNG có nhiệm vụ
//    "tích lũy Sao/coin" vì hệ thống không ghi sổ sao/coin theo từng ván
//    (ghi chú này cũng hiện ngay trong form).
//  · Phần thưởng CHỈ gồm Huy hiệu (ghi vào user_badges) và Hạt giống
//    cây quý (chọn từ danh mục cây thật). KHÔNG có Khung avatar — hệ
//    avatar chưa có loại "khung" lẫn đường hiển thị khung.
//  · Bật/tắt có hiệu lực ngay ở lần tải tiếp theo phía học sinh; sự kiện
//    kết thúc được server tự tổng kết (trao thưởng + chốt bảng xếp
//    hạng), admin cũng bấm tổng kết tay được khi đã qua giờ kết thúc.

import { useCallback, useEffect, useState } from "react";
import { CalendarRange, Flag, Pencil, Plus, Power, Trash2, Trophy } from "lucide-react";
import { ConfirmModal, Loader, Modal } from "../../components/ui";
import RangePagination from "../../components/RangePagination.jsx";
import { useRangePager } from "../../hooks/useRangePager.js";
import { eventService, gardenService } from "../../services/api.js";

const QUEST_TYPE_OPTIONS = [
  { value: "plays", label: "Số ván hoàn thành" },
  { value: "topic_plays", label: "Số ván theo chủ đề" },
  { value: "xp", label: "Tổng XP" },
];
const questTypeLabel = (t) => QUEST_TYPE_OPTIONS.find((o) => o.value === t)?.label || t;

const emptyQuestForm = () => ({
  id: null,
  title: "",
  type: "plays",
  target: 5,
  topicKey: "",
  rewardKind: "badge",
  badgeName: "",
  badgeIcon: "🏅",
  plantTypeId: "",
});
const emptyForm = () => ({
  name: "",
  description: "",
  startsAt: "",
  endsAt: "",
  scopeType: "all",
  grades: [],
  enabled: true,
  quests: [emptyQuestForm()],
});

/** ISO → giá trị cho input datetime-local (giờ địa phương). */
function toLocalInput(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
const fmtDateTime = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString("vi-VN");
};

function eventStatus(ev, nowMs) {
  if (ev.finalizedAt) return { key: "finalized", label: "Đã tổng kết", cls: "bg-slate-200 text-slate-700" };
  if (!ev.enabled) return { key: "off", label: "Đang tắt", cls: "bg-rose-100 text-rose-700" };
  if (nowMs < new Date(ev.startsAt).getTime()) return { key: "upcoming", label: "Sắp diễn ra", cls: "bg-sky-100 text-sky-700" };
  if (nowMs > new Date(ev.endsAt).getTime()) return { key: "ended", label: "Đã kết thúc · chờ tổng kết", cls: "bg-amber-100 text-amber-700" };
  return { key: "running", label: "Đang diễn ra", cls: "bg-emerald-100 text-emerald-700" };
}

function formFromEvent(ev) {
  return {
    name: ev.name || "",
    description: ev.description || "",
    startsAt: toLocalInput(ev.startsAt),
    endsAt: toLocalInput(ev.endsAt),
    scopeType: ev.scope?.type === "grades" ? "grades" : "all",
    grades: ev.scope?.grades || [],
    enabled: ev.enabled !== false,
    quests: (ev.quests || []).map((q) => ({
      id: q.id,
      title: q.title || "",
      type: q.type || "plays",
      target: q.target || 1,
      topicKey: q.topicKey || "",
      rewardKind: q.reward?.kind === "seed" ? "seed" : "badge",
      badgeName: q.reward?.name || "",
      badgeIcon: q.reward?.icon || "🏅",
      plantTypeId: q.reward?.plantTypeId || "",
    })),
  };
}

function formToBody(f) {
  return {
    name: f.name.trim(),
    description: f.description.trim(),
    startsAt: f.startsAt ? new Date(f.startsAt).toISOString() : "",
    endsAt: f.endsAt ? new Date(f.endsAt).toISOString() : "",
    scope: f.scopeType === "grades" ? { type: "grades", grades: f.grades } : { type: "all" },
    enabled: f.enabled,
    quests: f.quests.map((q) => ({
      ...(q.id ? { id: q.id } : {}),
      title: q.title.trim(),
      type: q.type,
      target: Number(q.target) || 0,
      ...(q.type === "topic_plays" ? { topicKey: q.topicKey } : {}),
      reward:
        q.rewardKind === "seed"
          ? { kind: "seed", plantTypeId: q.plantTypeId }
          : { kind: "badge", name: q.badgeName.trim(), icon: q.badgeIcon || "🏅" },
    })),
  };
}

export default function EventManagement({ showToast }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState([]);
  const [plantTypes, setPlantTypes] = useState([]);
  const pager = useRangePager(total, 10);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [finalizeTarget, setFinalizeTarget] = useState(null);
  const [board, setBoard] = useState(null); // { event, leaderboard } | null
  const [nowMs] = useState(() => Date.now());

  // Nạp danh sách theo đoạn from/to hiện tại (mẫu KnowledgeHeatmapPage:
  // fetch trong effect với cờ cancelled, setState trong callback async).
  // Các thao tác ghi xong thì bump refreshTick để effect nạp lại.
  const [refreshTick, setRefreshTick] = useState(0);
  const refresh = useCallback(() => setRefreshTick((t) => t + 1), []);
  const rangeFrom = pager.range.from;
  const rangeTo = pager.range.to;
  useEffect(() => {
    let cancelled = false;
    eventService
      .listAdmin({ from: rangeFrom, to: rangeTo })
      .then((res) => {
        if (cancelled) return;
        setItems(res.items || []);
        setTotal(res.total || 0);
        setLoading(false);
      })
      .catch((e) => {
        if (cancelled) return;
        showToast?.(e.message || "Không tải được danh sách sự kiện", "error");
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [rangeFrom, rangeTo, refreshTick, showToast]);

  // Dữ liệu cho form: chủ đề THẬT từ games + danh mục cây THẬT.
  useEffect(() => {
    eventService.topics().then((t) => setTopics(Array.isArray(t) ? t : [])).catch(() => setTopics([]));
    gardenService.getPlantTypes().then((t) => setPlantTypes(Array.isArray(t) ? t : [])).catch(() => setPlantTypes([]));
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    setFormError("");
    setFormOpen(true);
  };
  const openEdit = (ev) => {
    setEditingId(ev.id);
    setForm(formFromEvent(ev));
    setFormError("");
    setFormOpen(true);
  };

  const save = async () => {
    setFormError("");
    setSaving(true);
    try {
      const body = formToBody(form);
      if (editingId) await eventService.update(editingId, body);
      else await eventService.create(body);
      showToast?.(editingId ? "Đã lưu sự kiện" : "Đã tạo sự kiện", "success");
      setFormOpen(false);
      refresh();
    } catch (e) {
      setFormError(e.message || "Không lưu được sự kiện");
    } finally {
      setSaving(false);
    }
  };

  const toggleEnabled = async (ev) => {
    try {
      await eventService.setEnabled(ev.id, !ev.enabled);
      showToast?.(!ev.enabled ? `Đã bật "${ev.name}"` : `Đã tắt "${ev.name}"`, "success");
      refresh();
    } catch (e) {
      showToast?.(e.message || "Không đổi được trạng thái sự kiện", "error");
    }
  };

  const doDelete = async () => {
    if (!deleteTarget) return;
    try {
      await eventService.remove(deleteTarget.id);
      showToast?.(`Đã xoá sự kiện "${deleteTarget.name}"`, "success");
      setDeleteTarget(null);
      refresh();
    } catch (e) {
      showToast?.(e.message || "Không xoá được sự kiện", "error");
    }
  };

  const doFinalize = async () => {
    if (!finalizeTarget) return;
    try {
      const r = await eventService.finalize(finalizeTarget.id);
      showToast?.(`Đã tổng kết "${finalizeTarget.name}" — trao thêm ${r?.grantedCount ?? 0} phần thưởng`, "success");
      setFinalizeTarget(null);
      refresh();
    } catch (e) {
      showToast?.(e.message || "Không tổng kết được sự kiện", "error");
    }
  };

  const openBoard = async (ev) => {
    try {
      const r = await eventService.leaderboard(ev.id);
      setBoard(r);
    } catch (e) {
      showToast?.(e.message || "Không tải được bảng xếp hạng", "error");
    }
  };

  const setQuest = (idx, patch) =>
    setForm((f) => ({ ...f, quests: f.quests.map((q, i) => (i === idx ? { ...q, ...patch } : q)) }));

  const plantName = (id) => plantTypes.find((p) => p.id === id)?.name || id;

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-ink flex items-center gap-2">
            <CalendarRange className="w-6 h-6 text-gold" /> Sự kiện & thử thách theo mùa
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Tạo chiến dịch giới hạn thời gian với chuỗi cột mốc nhiệm vụ — tiến độ của học sinh được tính từ
            lịch sử ván chơi thật, phần thưởng (huy hiệu / hạt giống cây quý) trao tự động khi đạt mốc và khi
            sự kiện kết thúc.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold text-white font-semibold shadow hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> Tạo sự kiện
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader /></div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center text-slate-500">
          Chưa có sự kiện nào. Bấm “Tạo sự kiện” để mở chiến dịch đầu tiên.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((ev) => {
            const st = eventStatus(ev, nowMs);
            return (
              <div key={ev.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-bold text-ink">{ev.name}</h2>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${st.cls}`}>{st.label}</span>
                    </div>
                    {ev.description && <p className="text-sm text-slate-500 mt-0.5">{ev.description}</p>}
                    <p className="text-xs text-slate-400 mt-1">
                      {fmtDateTime(ev.startsAt)} → {fmtDateTime(ev.endsAt)} ·{" "}
                      {ev.scope?.type === "grades" ? `Khối ${(ev.scope.grades || []).join(", ")}` : "Toàn trường"} ·{" "}
                      {(ev.quests || []).length} cột mốc
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button type="button" onClick={() => openBoard(ev)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-sm font-semibold hover:bg-amber-100">
                      <Trophy className="w-4 h-4" /> Xếp hạng
                    </button>
                    {st.key === "ended" && (
                      <button type="button" onClick={() => setFinalizeTarget(ev)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-violet-50 text-violet-700 text-sm font-semibold hover:bg-violet-100">
                        <Flag className="w-4 h-4" /> Tổng kết
                      </button>
                    )}
                    <button type="button" onClick={() => toggleEnabled(ev)} className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold ${ev.enabled ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                      <Power className="w-4 h-4" /> {ev.enabled ? "Đang bật" : "Đang tắt"}
                    </button>
                    <button type="button" onClick={() => openEdit(ev)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 text-sm font-semibold hover:bg-sky-100">
                      <Pencil className="w-4 h-4" /> Sửa
                    </button>
                    <button type="button" onClick={() => setDeleteTarget(ev)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 text-sm font-semibold hover:bg-rose-100">
                      <Trash2 className="w-4 h-4" /> Xoá
                    </button>
                  </div>
                </div>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  {(ev.quests || []).map((q) => (
                    <div key={q.id} className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2 text-sm">
                      <span className="font-semibold text-ink">{q.title}</span>
                      <span className="text-slate-500"> — {questTypeLabel(q.type)}: {q.target}{q.type === "topic_plays" && q.topicKey ? ` · chủ đề “${q.topicKey}”` : ""}</span>
                      <span className="block text-xs text-slate-400 mt-0.5">
                        {q.reward?.kind === "seed" ? (
                          <>Thưởng: hạt giống {plantName(q.reward.plantTypeId)}</>
                        ) : (
                          <>Thưởng: huy hiệu {q.reward?.icon || "🏅"} {q.reward?.name || ""}</>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          <RangePagination {...pager.props} />
        </div>
      )}

      {/* ── Form tạo/sửa ─────────────────────────────────────────── */}
      {formOpen && (
        <Modal onClose={() => setFormOpen(false)} wide>
          <div className="p-5 max-h-[85vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-ink mb-4">{editingId ? "Sửa sự kiện" : "Tạo sự kiện mới"}</h2>
            {formError && <div className="mb-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm px-3 py-2">{formError}</div>}
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm font-semibold text-ink">Tên sự kiện *</span>
                <input className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Tuần lễ Vui Toán" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-ink">Mô tả</span>
                <textarea className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm font-semibold text-ink">Bắt đầu *</span>
                  <input type="datetime-local" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-ink">Kết thúc *</span>
                  <input type="datetime-local" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} />
                </label>
              </div>
              <div>
                <span className="text-sm font-semibold text-ink">Phạm vi áp dụng</span>
                <div className="mt-1 flex gap-2">
                  {[["all", "Toàn trường"], ["grades", "Theo khối lớp"]].map(([v, label]) => (
                    <button key={v} type="button" onClick={() => setForm({ ...form, scopeType: v })} className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${form.scopeType === v ? "bg-gold text-white" : "bg-slate-100 text-slate-600"}`}>
                      {label}
                    </button>
                  ))}
                </div>
                {form.scopeType === "grades" && (
                  <div className="mt-2 flex gap-2">
                    {[1, 2, 3, 4, 5].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, grades: f.grades.includes(g) ? f.grades.filter((x) => x !== g) : [...f.grades, g].sort() }))}
                        className={`w-9 h-9 rounded-lg font-bold ${form.grades.includes(g) ? "bg-sky-500 text-white" : "bg-slate-100 text-slate-500"}`}
                      >
                        {g}
                      </button>
                    ))}
                    <span className="text-xs text-slate-400 self-center">Khối của học sinh suy từ mã tuổi trong hồ sơ.</span>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-ink">Chuỗi cột mốc nhiệm vụ *</span>
                  <button type="button" onClick={() => setForm((f) => ({ ...f, quests: [...f.quests, emptyQuestForm()] }))} className="inline-flex items-center gap-1 text-sm font-semibold text-sky-600 hover:text-sky-700">
                    <Plus className="w-4 h-4" /> Thêm cột mốc
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Chỉ có loại nhiệm vụ đo được từ lịch sử ván chơi thật. Không có nhiệm vụ “tích lũy Sao/coin”
                  (hệ thống không ghi sổ sao/coin theo từng ván) và không có thưởng Khung avatar (hệ avatar
                  chưa có loại khung) — tránh hứa phần thưởng không trao được thật.
                </p>
                <div className="space-y-3 mt-2">
                  {form.quests.map((q, idx) => (
                    <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <input className="flex-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm" placeholder={`Tên cột mốc ${idx + 1}`} value={q.title} onChange={(e) => setQuest(idx, { title: e.target.value })} />
                        {form.quests.length > 1 && (
                          <button type="button" onClick={() => setForm((f) => ({ ...f, quests: f.quests.filter((_, i) => i !== idx) }))} className="text-rose-500 hover:text-rose-600" aria-label="Xoá cột mốc">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <select className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm" value={q.type} onChange={(e) => setQuest(idx, { type: e.target.value })}>
                          {QUEST_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                        <input type="number" min={1} className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm" value={q.target} onChange={(e) => setQuest(idx, { target: e.target.value })} placeholder="Chỉ tiêu" />
                      </div>
                      {q.type === "topic_plays" && (
                        <select className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm" value={q.topicKey} onChange={(e) => setQuest(idx, { topicKey: e.target.value })}>
                          <option value="">— Chọn chủ đề (từ các trò chơi hiện có) —</option>
                          {topics.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                      )}
                      <div className="flex flex-wrap items-center gap-2">
                        <select className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm" value={q.rewardKind} onChange={(e) => setQuest(idx, { rewardKind: e.target.value })}>
                          <option value="badge">Thưởng: Huy hiệu</option>
                          <option value="seed">Thưởng: Hạt giống cây</option>
                        </select>
                        {q.rewardKind === "badge" ? (
                          <>
                            <input className="w-16 rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm text-center" value={q.badgeIcon} onChange={(e) => setQuest(idx, { badgeIcon: e.target.value })} aria-label="Icon huy hiệu" />
                            <input className="flex-1 min-w-40 rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm" placeholder="Tên huy hiệu" value={q.badgeName} onChange={(e) => setQuest(idx, { badgeName: e.target.value })} />
                          </>
                        ) : (
                          <select className="flex-1 min-w-40 rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm" value={q.plantTypeId} onChange={(e) => setQuest(idx, { plantTypeId: e.target.value })}>
                            <option value="">— Chọn loại cây trong danh mục —</option>
                            {plantTypes.map((p) => <option key={p.id} value={p.id}>{p.icon || "🌱"} {p.name}{p.rarity ? ` (${p.rarity})` : ""}</option>)}
                          </select>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={form.enabled} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} className="w-4 h-4" />
                <span className="text-sm text-ink">Bật sự kiện ngay (học sinh thấy ở lần tải trang tiếp theo)</span>
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setFormOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-semibold">Huỷ</button>
              <button type="button" onClick={save} disabled={saving} className="px-4 py-2 rounded-xl bg-gold text-white font-semibold disabled:opacity-50">
                {saving ? "Đang lưu…" : editingId ? "Lưu thay đổi" : "Tạo sự kiện"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Bảng xếp hạng ──────────────────────────────────────── */}
      {board && (
        <Modal onClose={() => setBoard(null)}>
          <div className="p-5">
            <h2 className="text-lg font-bold text-ink flex items-center gap-2">
              <Trophy className="w-5 h-5 text-gold" /> Bảng xếp hạng — {board.event?.name}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {board.event?.finalizedAt ? `Đã chốt lúc tổng kết (${fmtDateTime(board.event.finalizedAt)}).` : "Đang tính trực tiếp từ lịch sử ván chơi trong cửa sổ sự kiện."}
            </p>
            {(board.leaderboard || []).length === 0 ? (
              <p className="text-sm text-slate-500 mt-4">Chưa có học sinh nào có hoạt động trong sự kiện này.</p>
            ) : (
              <table className="w-full mt-3 text-sm">
                <thead>
                  <tr className="text-left text-slate-400">
                    <th className="py-1 pr-2">#</th><th className="py-1 pr-2">Học sinh</th>
                    <th className="py-1 pr-2 text-right">Cột mốc đạt</th><th className="py-1 pr-2 text-right">XP</th><th className="py-1 text-right">Ván</th>
                  </tr>
                </thead>
                <tbody>
                  {board.leaderboard.map((r) => (
                    <tr key={r.userId} className="border-t border-slate-100">
                      <td className="py-1.5 pr-2 font-bold text-ink">{r.rank}</td>
                      <td className="py-1.5 pr-2">{r.name}</td>
                      <td className="py-1.5 pr-2 text-right">{r.questsCompleted}</td>
                      <td className="py-1.5 pr-2 text-right">{r.xp}</td>
                      <td className="py-1.5 text-right">{r.plays}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="mt-4 flex justify-end">
              <button type="button" onClick={() => setBoard(null)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-semibold">Đóng</button>
            </div>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal
          open
          title="Xoá sự kiện"
          message={`Xoá hẳn sự kiện "${deleteTarget.name}"? Sổ phần thưởng đã trao của sự kiện này cũng bị xoá (huy hiệu/hạt đã vào tài khoản học sinh thì giữ nguyên).`}
          onConfirm={doDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
      {finalizeTarget && (
        <ConfirmModal
          open
          title="Tổng kết sự kiện"
          message={`Tổng kết "${finalizeTarget.name}" ngay? Server sẽ trao nốt phần thưởng cho học sinh đã đạt mốc mà chưa nhận và chốt bảng xếp hạng. Sau khi tổng kết, không sửa được thời gian/phạm vi/cột mốc nữa.`}
          confirmLabel="Tổng kết"
          danger={false}
          onConfirm={doFinalize}
          onClose={() => setFinalizeTarget(null)}
        />
      )}
    </div>
  );
}
