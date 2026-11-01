// TeacherSupportTickets.jsx — trang /teacher-support "Hỗ trợ lớp" dành cho giáo viên.
//
// Học sinh gửi ticket từ nút "Hỗ trợ" ở trang chủ → server tự gán ticket cho
// giáo viên phụ trách lớp của học sinh (không có lớp → về admin tổng).
// Giáo viên mở trang này CHỈ thấy ticket được gán cho mình — danh sách lấy từ
// GET /api/support/tickets/assigned (lọc theo assigneeId phía server).
// Tài khoản có quyền `support_all` (admin tổng) gọi cùng endpoint sẽ thấy hết.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supportService } from "../../services/api.js";
import { useModalParam } from "../../hooks/useModalParam.js";
import {
  ErrorState,
  GhostButton,
  IconClose,
  Loader,
  ManagementHeader,
  Modal,
  PrimaryButton,
  SearchInput,
  Select,
  cardGridClass,
  tableWrapClass,
  useViewMode,
  ViewToggle,
} from "../../components/ui";
import RangePagination from "../../components/RangePagination.jsx";
import { Filter, Eye } from "lucide-react";

const PAGE_SIZE = 25;

const PRIORITY_OPTIONS = [
  { value: "low", label: "Thấp" },
  { value: "medium", label: "Trung bình" },
  { value: "high", label: "Cao" },
];

const STATUS_OPTIONS = [
  { value: "open", label: "Mới" },
  { value: "processing", label: "Đang xử lý" },
  { value: "pending", label: "Chờ phản hồi" },
  { value: "done", label: "Hoàn thành" },
  { value: "closed", label: "Đã đóng" },
];

const priorityLabel = (v) => PRIORITY_OPTIONS.find((o) => o.value === v)?.label || v || "—";
const statusLabel = (v) => STATUS_OPTIONS.find((o) => o.value === v)?.label || v || "—";

function PriorityBadge({ value }) {
  const cls =
    value === "high" ? "bg-ticket/10 text-ticket"
    : value === "low" ? "bg-ink/5 text-ink/60"
    : "bg-gold/15 text-[#8A6D1C]";
  return <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-mono ${cls}`}>{priorityLabel(value)}</span>;
}

function StatusBadge({ value }) {
  const cls =
    value === "open" ? "bg-teal/10 text-teal"
    : value === "processing" ? "bg-gold/15 text-[#8A6D1C]"
    : value === "pending" ? "bg-ink/5 text-ink/60"
    : value === "done" ? "bg-[#2F9E44]/10 text-[#2F9E44]"
    : "bg-ink/5 text-ink/40";
  return <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-mono ${cls}`}>{statusLabel(value)}</span>;
}

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" });
}

function sameDay(isoValue, dayStr) {
  if (!dayStr) return true;
  const d = new Date(isoValue);
  if (Number.isNaN(d.getTime())) return false;
  const local = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return local === dayStr;
}

const EMPTY_FILTERS = { code: "", title: "", priority: "all", status: "all", createdDay: "" };

export default function TeacherSupportTickets({ user, showToast }) {
  const canView = user?.role === "admin" || user?.role === "teacher" || (user?.permissions || []).includes("support.view");
  const modalParam = useModalParam();
  const [mode, setMode] = useViewMode("teacher-support-tickets", "list");

  const [tickets, setTickets] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [range, setRange] = useState({ from: 1, size: PAGE_SIZE });

  const [detail, setDetail] = useState(null);
  const [detailForm, setDetailForm] = useState({ status: "open", priority: "medium", reply: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setError(null);
    supportService.assigned()
      .then((data) => setTickets(data || []))
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  const setFilter = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setRange((r) => ({ ...r, from: 1 }));
  };

  const byId = useMemo(() => new Map((tickets || []).map((t) => [t.id, t])), [tickets]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (tickets || []).filter((t) => {
      if (q && ![t.code, t.title, t.content, t.username].some((v) => String(v || "").toLowerCase().includes(q))) return false;
      if (filters.code && !String(t.code || "").toLowerCase().includes(filters.code.trim().toLowerCase())) return false;
      if (filters.title && !String(t.title || "").toLowerCase().includes(filters.title.trim().toLowerCase())) return false;
      if (filters.priority !== "all" && t.priority !== filters.priority) return false;
      if (filters.status !== "all" && t.status !== filters.status) return false;
      if (!sameDay(t.createdAt, filters.createdDay)) return false;
      return true;
    });
  }, [tickets, search, filters]);

  const total = filtered.length;
  const fromRecord = total === 0 ? 1 : Math.min(Math.max(1, range.from), total);
  const toRecord = Math.min(fromRecord + range.size - 1, total);
  const pageItems = filtered.slice(fromRecord - 1, toRecord);

  const changeRange = (from, to) => {
    const size = Math.max(1, (Number(to) || from) - (Number(from) || 1) + 1);
    setRange({ from: Math.max(1, Number(from) || 1), size });
  };
  const prevPage = () => setRange((r) => ({ ...r, from: Math.max(1, r.from - r.size) }));
  const nextPage = () => setRange((r) => ({
    ...r,
    from: Math.min(Math.floor((Math.max(total, 1) - 1) / r.size) * r.size + 1, r.from + r.size),
  }));

  // ── Modal chi tiết (?m=tSupportDetail&tid=…) ──────────────────────────
  const openDetail = (ticket) => {
    setDetail(ticket);
    setDetailForm({ status: ticket.status || "open", priority: ticket.priority || "medium", reply: ticket.reply || "" });
    modalParam.open("tSupportDetail", { tid: ticket.id });
  };
  const closeDetail = () => {
    setDetail(null);
    modalParam.close("tSupportDetail");
  };

  const saveDetail = async () => {
    if (!detail) return;
    setSaving(true);
    try {
      const updated = await supportService.updateAssigned(detail.id, detailForm);
      setTickets((prev) => (prev || []).map((t) => (t.id === updated.id ? { ...t, ...updated } : t)));
      showToast?.("Đã cập nhật ticket", "success");
      closeDetail();
    } catch (e) {
      showToast?.(e.message || "Lỗi cập nhật ticket", "error");
    } finally {
      setSaving(false);
    }
  };

  const restoredRef = useRef(false);
  useEffect(() => {
    const t = setTimeout(() => {
      if (restoredRef.current || !tickets) return;
      restoredRef.current = true;
      if (modalParam.modal !== "tSupportDetail") return;
      const ticket = byId.get(modalParam.params.get("tid"));
      if (!ticket) return;
      setDetail(ticket);
      setDetailForm({ status: ticket.status || "open", priority: ticket.priority || "medium", reply: ticket.reply || "" });
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickets]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (modalParam.modal !== "tSupportDetail" && detail) setDetail(null);
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalParam.modal]);

  if (!canView) {
    return (
      <div>
        <ManagementHeader subtitle="Hệ thống" title="Hỗ trợ lớp" />
        <div className="note-card p-6 text-sm text-[#8A7C63] font-body">
          Bạn không có quyền xem trang này (cần quyền <span className="font-mono text-ink">support.view</span>).
        </div>
      </div>
    );
  }

  const filterActive = search || Object.entries(filters).some(([k, v]) => (k === "priority" || k === "status" ? v !== "all" : v));
  const clearFilters = () => { setSearch(""); setFilters(EMPTY_FILTERS); setRange({ from: 1, size: PAGE_SIZE }); };
  const cellInput = "w-full rounded-lg border border-ink/15 bg-paper px-2.5 py-1.5 text-xs font-body outline-none focus:border-teal";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ManagementHeader subtitle="Hệ thống" title="Hỗ trợ lớp" />
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput value={search} onChange={setSearch} placeholder="Tìm ticket" className="w-48" />
          <button
            type="button"
            onClick={clearFilters}
            disabled={!filterActive}
            title="Xoá bộ lọc"
            className="w-9 h-9 rounded-lg border border-ink/15 bg-paper inline-flex items-center justify-center text-ink/60 hover:text-ticket disabled:opacity-40 transition"
          >
            <Filter className="w-4 h-4" />
          </button>
          <ViewToggle mode={mode} onChange={setMode} />
          <RangePagination
            fromRecord={fromRecord}
            toRecord={toRecord}
            totalItems={total}
            onRangeChange={changeRange}
            onPrevPage={prevPage}
            onNextPage={nextPage}
            disabled={total === 0}
          />
        </div>
      </div>

      <p className="text-xs text-[#8A7C63] font-body">
        Chỉ hiện các ticket học sinh lớp bạn gửi (ticket được gán cho giáo viên phụ trách lớp).
      </p>

      {error && !tickets ? (
        <ErrorState subtitle={error} onRetry={load} />
      ) : !tickets ? (
        <Loader label="Đang tải ticket..." />
      ) : total === 0 ? (
        <div className="note-card py-14 text-center text-sm text-[#8A7C63] font-body">
          Chưa có ticket nào được gán cho bạn.
        </div>
      ) : (
        <>
          <div className={`note-card overflow-x-auto ${tableWrapClass(mode)}`}>
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="text-left text-[#8A7C63] font-mono text-[11px] uppercase border-b border-ink/10">
                  <th className="py-2.5 pl-4 pr-3 font-medium w-32">Mã ticket</th>
                  <th className="py-2.5 pr-4 font-medium">Tiêu đề</th>
                  <th className="py-2.5 pr-4 font-medium">Nội dung</th>
                  <th className="py-2.5 pr-3 font-medium w-36">Ưu tiên</th>
                  <th className="py-2.5 px-3 font-medium w-36">Trạng thái</th>
                  <th className="py-2.5 px-3 font-medium w-32">Người gửi</th>
                  <th className="py-2.5 px-3 font-medium w-32">Ngày tạo</th>
                  <th className="py-2.5 pl-3 pr-4 font-medium text-right w-16">Thao tác</th>
                </tr>
                <tr className="border-b border-ink/10">
                  <td className="py-2 pl-4 pr-3">
                    <input className={cellInput} placeholder="Tìm kiếm" value={filters.code} onChange={(e) => setFilter("code", e.target.value)} />
                  </td>
                  <td className="py-2 pr-4">
                    <input className={cellInput} placeholder="Tìm kiếm" value={filters.title} onChange={(e) => setFilter("title", e.target.value)} />
                  </td>
                  <td className="py-2 pr-4" />
                  <td className="py-2 pr-3">
                    <Select className={cellInput} value={filters.priority} onChange={(v) => setFilter("priority", v)} options={[{ value: "all", label: "Tất cả" }, ...PRIORITY_OPTIONS]} />
                  </td>
                  <td className="py-2 px-3">
                    <Select className={cellInput} value={filters.status} onChange={(v) => setFilter("status", v)} options={[{ value: "all", label: "Tất cả" }, ...STATUS_OPTIONS]} />
                  </td>
                  <td className="py-2 px-3" />
                  <td className="py-2 px-3">
                    <input type="date" className={cellInput} value={filters.createdDay} onChange={(e) => setFilter("createdDay", e.target.value)} />
                  </td>
                  <td className="py-2 pl-3 pr-4" />
                </tr>
              </thead>
              <tbody>
                {pageItems.map((t) => (
                  <tr key={t.id} className="border-b border-ink/5 last:border-0 hover:bg-ink/[0.02] cursor-pointer" onClick={() => openDetail(t)}>
                    <td className="py-3 pl-4 pr-3 text-xs font-mono text-ink">{t.code}</td>
                    <td className="py-3 pr-4 text-sm font-body text-ink max-w-[220px] truncate" title={t.title}>{t.title}</td>
                    <td className="py-3 pr-4 text-xs font-body text-ink/70 max-w-[300px] truncate" title={t.content}>{t.content}</td>
                    <td className="py-3 pr-3"><PriorityBadge value={t.priority} /></td>
                    <td className="py-3 px-3"><StatusBadge value={t.status} /></td>
                    <td className="py-3 px-3 text-xs font-mono text-ink/70 truncate" title={t.username}>{t.username || "—"}</td>
                    <td className="py-3 px-3 text-xs text-[#8A7C63] font-body whitespace-nowrap">{formatDate(t.createdAt)}</td>
                    <td className="py-3 pl-3 pr-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button type="button" onClick={() => openDetail(t)} title="Xem chi tiết" className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-ink/45 hover:text-teal hover:bg-teal/10 transition">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={cardGridClass(mode)}>
            {pageItems.map((t) => (
              <button key={t.id} type="button" onClick={() => openDetail(t)} className="note-card p-4 text-left">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono text-ink">{t.code}</span>
                  <StatusBadge value={t.status} />
                </div>
                <p className="font-display text-sm text-ink mt-1.5 line-clamp-1">{t.title}</p>
                <p className="text-xs font-body text-ink/60 mt-1 line-clamp-2">{t.content}</p>
                <div className="flex items-center justify-between gap-2 mt-2.5">
                  <PriorityBadge value={t.priority} />
                  <span className="text-[11px] text-[#8A7C63] font-body">{formatDate(t.createdAt)}</span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {detail && (
        <Modal onClose={closeDetail} wide contentStyle={{ maxWidth: "min(860px, 95vw)" }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-xl text-ink">Chi tiết ticket hỗ trợ</h3>
              <p className="text-xs text-[#8A7C63] font-body mt-0.5">
                Cập nhật trạng thái và trả lời cho {detail.username || "người gửi"}.
              </p>
            </div>
            <button type="button" onClick={closeDetail} title="Đóng" className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-ink/45 hover:text-ticket hover:bg-ticket/10 transition">
              <IconClose className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mt-4">
            <div>
              <p className="text-[11px] font-mono uppercase text-[#8A7C63]">Mã ticket</p>
              <p className="text-sm font-mono text-ink mt-0.5">{detail.code}</p>
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase text-[#8A7C63]">Người gửi</p>
              <p className="text-sm font-body text-ink mt-0.5">
                {detail.username || "—"}
                {detail.userRole ? <span className="text-[#8A7C63]"> · {detail.userRole}</span> : null}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase text-[#8A7C63]">Tiêu đề</p>
              <p className="text-sm font-body text-ink mt-0.5">{detail.title}</p>
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase text-[#8A7C63]">Ngày tạo</p>
              <p className="text-sm font-body text-ink mt-0.5">{formatDate(detail.createdAt)}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-[11px] font-mono uppercase text-[#8A7C63]">Nội dung</p>
              <p className="text-sm font-body text-ink/80 mt-0.5 whitespace-pre-wrap break-words max-h-40 overflow-y-auto">{detail.content || "—"}</p>
            </div>
            <div>
              <Select
                label="Ưu tiên"
                value={detailForm.priority}
                onChange={(v) => setDetailForm((f) => ({ ...f, priority: v }))}
                options={PRIORITY_OPTIONS}
              />
            </div>
            <div>
              <Select
                label="Trạng thái"
                value={detailForm.status}
                onChange={(v) => setDetailForm((f) => ({ ...f, status: v }))}
                options={STATUS_OPTIONS}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[11px] font-mono uppercase text-[#8A7C63] leading-tight block mb-1">Phản hồi</label>
              <textarea
                value={detailForm.reply}
                onChange={(e) => setDetailForm((f) => ({ ...f, reply: e.target.value }))}
                rows={3}
                placeholder="Nội dung trả lời người gửi (không bắt buộc)"
                className="w-full rounded-xl border border-ink/15 bg-paper px-3 py-2 text-sm font-body outline-none focus:border-teal resize-y"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 mt-4">
            <p className="text-[11px] text-[#8A7C63] font-body">Cập nhật lần gần nhất: {formatDate(detail.updatedAt)}</p>
            <div className="flex items-center gap-2">
              <GhostButton onClick={closeDetail}>Đóng</GhostButton>
              <PrimaryButton onClick={saveDetail} disabled={saving}>
                {saving ? "Đang lưu..." : "Lưu"}
              </PrimaryButton>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
