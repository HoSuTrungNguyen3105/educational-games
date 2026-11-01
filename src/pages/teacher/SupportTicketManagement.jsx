// SupportTicketManagement.jsx — trang /dashboard/support quản lý ticket hỗ trợ.
//
// Bố cục theo mẫu trang hỗ trợ HiWeb (ảnh yêu cầu):
//   · Thanh trên: tiêu đề, ô "Tìm ticket", nút Tạo, nút xuất CSV, nút xoá bộ lọc,
//     chuyển bảng/thẻ, phân trang dạng khoảng "1-25 / 37" với mũi tên trước/sau.
//   · Bảng: mỗi cột có ô lọc riêng (Mã ticket, Tiêu đề, Nội dung, Ưu tiên,
//     Trạng thái, Ngày tạo, Cập nhật).
//   · Modal chi tiết ticket mở bằng cách bấm dòng — đồng bộ lên URL qua
//     useModalParam (?m=supportDetail&tid=…), đóng thì xoá params.
//
// API: server/src/routes/support.js — chỉ role admin gọi được nhóm /admin/*.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supportService } from "../../services/api.js";
import { useModalParam } from "../../hooks/useModalParam.js";
import {
  ConfirmModal,
  ErrorState,
  GhostButton,
  IconAdd,
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
import { Download, Eye, Filter, Trash2 } from "lucide-react";

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

/** "2026-11-01" so khớp theo ngày dương lịch local với ISO string trong DB. */
function sameDay(isoValue, dayStr) {
  if (!dayStr) return true;
  const d = new Date(isoValue);
  if (Number.isNaN(d.getTime())) return false;
  const local = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return local === dayStr;
}

const EMPTY_FILTERS = { code: "", title: "", content: "", priority: "all", status: "all", assignee: "all", createdDay: "", updatedDay: "" };
const EMPTY_FORM = { title: "", content: "", priority: "medium" };

/** Ticket được server gán sẵn: GV chủ nhiệm lớp người gửi, hoặc admin tổng. */
const ASSIGNEE_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "teacher", label: "Giáo viên" },
  { value: "admin", label: "Admin tổng" },
];
const assigneeLabel = (t) => (t.assigneeType === "teacher" ? (t.assigneeName || t.assigneeUsername || "Giáo viên") : "Admin tổng");

export default function SupportTicketManagement({ user, showToast }) {
  const isAdmin = user?.role === "admin";
  const modalParam = useModalParam();
  const [mode, setMode] = useViewMode("support-tickets", "list");

  const [tickets, setTickets] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [range, setRange] = useState({ from: 1, size: PAGE_SIZE });

  const [detail, setDetail] = useState(null);        // ticket đang mở modal
  const [detailForm, setDetailForm] = useState({ status: "open", priority: "medium", reply: "" });
  const [saving, setSaving] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ ...EMPTY_FORM });
  const [createError, setCreateError] = useState("");
  const [creating, setCreating] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, item: null });

  const setFilter = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setRange((r) => ({ ...r, from: 1 }));
  };

  const load = useCallback(() => {
    setError(null);
    supportService.list()
      .then((data) => setTickets(data || []))
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  const byId = useMemo(() => new Map((tickets || []).map((t) => [t.id, t])), [tickets]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (tickets || []).filter((t) => {
      if (q && ![t.code, t.title, t.content, t.username].some((v) => String(v || "").toLowerCase().includes(q))) return false;
      if (filters.code && !String(t.code || "").toLowerCase().includes(filters.code.trim().toLowerCase())) return false;
      if (filters.title && !String(t.title || "").toLowerCase().includes(filters.title.trim().toLowerCase())) return false;
      if (filters.content && !String(t.content || "").toLowerCase().includes(filters.content.trim().toLowerCase())) return false;
      if (filters.priority !== "all" && t.priority !== filters.priority) return false;
      if (filters.status !== "all" && t.status !== filters.status) return false;
      if (filters.assignee !== "all") {
        const type = t.assigneeType === "teacher" ? "teacher" : "admin";
        if (type !== filters.assignee) return false;
      }
      if (!sameDay(t.createdAt, filters.createdDay)) return false;
      if (!sameDay(t.updatedAt, filters.updatedDay)) return false;
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

  // ── Modal chi tiết (đồng bộ ?m=supportDetail&tid=…) ──────────────────
  const openDetail = (ticket) => {
    setDetail(ticket);
    setDetailForm({ status: ticket.status || "open", priority: ticket.priority || "medium", reply: ticket.reply || "" });
    modalParam.open("supportDetail", { tid: ticket.id });
  };
  const closeDetail = () => {
    setDetail(null);
    modalParam.close("supportDetail");
  };

  const saveDetail = async () => {
    if (!detail) return;
    setSaving(true);
    try {
      const updated = await supportService.update(detail.id, detailForm);
      setTickets((prev) => (prev || []).map((t) => (t.id === updated.id ? { ...t, ...updated } : t)));
      showToast?.("Đã cập nhật ticket", "success");
      closeDetail();
    } catch (e) {
      showToast?.(e.message || "Lỗi cập nhật ticket", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Modal tạo ────────────────────────────────────────────────────────
  const openCreate = () => {
    setCreateForm({ ...EMPTY_FORM });
    setCreateError("");
    setCreateOpen(true);
    modalParam.open("supportCreate");
  };
  const closeCreate = () => {
    setCreateOpen(false);
    modalParam.close("supportCreate");
  };
  const submitCreate = async () => {
    if (!createForm.title.trim() || !createForm.content.trim()) {
      setCreateError("Vui lòng nhập tiêu đề và nội dung");
      return;
    }
    setCreating(true);
    try {
      await supportService.create(createForm);
      closeCreate();
      showToast?.("Đã tạo ticket hỗ trợ", "success");
      load();
    } catch (e) {
      setCreateError(e.message || "Không tạo được ticket");
    } finally {
      setCreating(false);
    }
  };

  // ── Xoá ──────────────────────────────────────────────────────────────
  const openDelete = (ticket) => {
    setConfirm({ open: true, item: ticket });
    modalParam.open("supportDelete", { tid: ticket.id });
  };
  const closeDelete = () => {
    setConfirm({ open: false, item: null });
    modalParam.close("supportDelete");
  };
  const doDelete = async () => {
    const item = confirm.item;
    if (!item) return;
    try {
      await supportService.remove(item.id);
      showToast?.("Đã xóa ticket", "success");
      setTickets((prev) => (prev || []).filter((t) => t.id !== item.id));
    } catch (e) {
      showToast?.(e.message || "Lỗi xóa ticket", "error");
    } finally {
      closeDelete();
    }
  };

  // ── Mở modal từ URL (reload / dán link có ?m=…) — setTimeout(...,0) để
  // không setState đồng bộ trong thân effect (convention của repo) ────────
  const restoredRef = useRef(false);
  useEffect(() => {
    const t = setTimeout(() => {
      if (restoredRef.current || !tickets) return;
      restoredRef.current = true;
      const m = modalParam.modal;
      const tid = modalParam.params.get("tid");
      if (!m) return;
      if (m === "supportCreate") { setCreateForm({ ...EMPTY_FORM }); setCreateOpen(true); return; }
      const ticket = byId.get(tid);
      if (!ticket) return;
      if (m === "supportDetail") {
        setDetail(ticket);
        setDetailForm({ status: ticket.status || "open", priority: ticket.priority || "medium", reply: ticket.reply || "" });
      }
      else if (m === "supportDelete") setConfirm({ open: true, item: ticket });
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickets]);

  // Nút Back của trình duyệt (params mất đi) → đóng modal đang mở.
  useEffect(() => {
    const t = setTimeout(() => {
      const m = modalParam.modal;
      if (m !== "supportDetail" && detail) setDetail(null);
      if (m !== "supportCreate" && createOpen) setCreateOpen(false);
      if (m !== "supportDelete" && confirm.open) setConfirm({ open: false, item: null });
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalParam.modal]);

  const exportCsv = () => {
    const head = ["Mã ticket", "Tiêu đề", "Nội dung", "Ưu tiên", "Trạng thái", "Người nhận", "Người gửi", "Ngày tạo", "Cập nhật"];
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = filtered.map((t) => [t.code, t.title, t.content, priorityLabel(t.priority), statusLabel(t.status), assigneeLabel(t), t.username, formatDate(t.createdAt), formatDate(t.updatedAt)].map(esc).join(","));
    const blob = new Blob(["\uFEFF" + [head.map(esc).join(","), ...rows].join("\r\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "support-tickets.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isAdmin) {
    return (
      <div>
        <ManagementHeader subtitle="Hệ thống" title="Quản lý hỗ trợ" />
        <div className="note-card p-6 text-sm text-[#8A7C63] font-body">
          Chỉ tài khoản <span className="font-mono text-ink">admin</span> mới xem được trang này.
        </div>
      </div>
    );
  }

  const filterActive = search || Object.entries(filters).some(([k, v]) => (k === "priority" || k === "status" || k === "assignee" ? v !== "all" : v));
  const clearFilters = () => { setSearch(""); setFilters(EMPTY_FILTERS); setRange({ from: 1, size: PAGE_SIZE }); };

  const cellInput = "w-full rounded-lg border border-ink/15 bg-paper px-2.5 py-1.5 text-xs font-body outline-none focus:border-teal";

  return (
    <div className="space-y-4">
      {/* Thanh trên: tiêu đề + công cụ */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ManagementHeader subtitle="Hệ thống" title="Quản lý hỗ trợ" />
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput value={search} onChange={setSearch} placeholder="Tìm ticket" className="w-48" />
          <PrimaryButton onClick={openCreate} className="!px-4 !py-2 text-sm flex items-center gap-1.5">
            <IconAdd className="w-4 h-4" />
            Tạo
          </PrimaryButton>
          <button
            type="button"
            onClick={exportCsv}
            disabled={!total}
            title="Xuất CSV"
            className="w-9 h-9 rounded-lg border border-ink/15 bg-paper inline-flex items-center justify-center text-ink/60 hover:text-teal disabled:opacity-40 transition"
          >
            <Download className="w-4 h-4" />
          </button>
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

      {error && !tickets ? (
        <ErrorState subtitle={error} onRetry={load} />
      ) : !tickets ? (
        <Loader label="Đang tải ticket..." />
      ) : total === 0 ? (
        <div className="note-card py-14 text-center text-sm text-[#8A7C63] font-body">
          Chưa có ticket hỗ trợ nào.
        </div>
      ) : (
        <>
          {/* Dạng bảng (desktop) */}
          <div className={`note-card overflow-x-auto ${tableWrapClass(mode)}`}>
            <table className="w-full min-w-[1160px]">
              <thead>
                <tr className="text-left text-[#8A7C63] font-mono text-[11px] uppercase border-b border-ink/10">
                  <th className="py-2.5 pl-4 pr-3 font-medium w-32">Mã ticket</th>
                  <th className="py-2.5 pr-4 font-medium">Tiêu đề</th>
                  <th className="py-2.5 pr-4 font-medium">Nội dung</th>
                  <th className="py-2.5 pr-3 font-medium w-32">Ưu tiên</th>
                  <th className="py-2.5 px-3 font-medium w-32">Trạng thái</th>
                  <th className="py-2.5 px-3 font-medium w-36">Người nhận</th>
                  <th className="py-2.5 px-3 font-medium w-32">Ngày tạo</th>
                  <th className="py-2.5 px-3 font-medium w-32">Cập nhật</th>
                  <th className="py-2.5 pl-3 pr-4 font-medium text-right w-20">Thao tác</th>
                </tr>
                {/* Hàng lọc theo cột */}
                <tr className="border-b border-ink/10">
                  <td className="py-2 pl-4 pr-3">
                    <input className={cellInput} placeholder="Tìm kiếm" value={filters.code} onChange={(e) => setFilter("code", e.target.value)} />
                  </td>
                  <td className="py-2 pr-4">
                    <input className={cellInput} placeholder="Tìm kiếm" value={filters.title} onChange={(e) => setFilter("title", e.target.value)} />
                  </td>
                  <td className="py-2 pr-4">
                    <input className={cellInput} placeholder="Tìm kiếm" value={filters.content} onChange={(e) => setFilter("content", e.target.value)} />
                  </td>
                  <td className="py-2 pr-3">
                    <Select className={cellInput} value={filters.priority} onChange={(v) => setFilter("priority", v)} options={[{ value: "all", label: "Tất cả" }, ...PRIORITY_OPTIONS]} />
                  </td>
                  <td className="py-2 px-3">
                    <Select className={cellInput} value={filters.status} onChange={(v) => setFilter("status", v)} options={[{ value: "all", label: "Tất cả" }, ...STATUS_OPTIONS]} />
                  </td>
                  <td className="py-2 px-3">
                    <Select className={cellInput} value={filters.assignee} onChange={(v) => setFilter("assignee", v)} options={ASSIGNEE_OPTIONS} />
                  </td>
                  <td className="py-2 px-3">
                    <input type="date" className={cellInput} value={filters.createdDay} onChange={(e) => setFilter("createdDay", e.target.value)} />
                  </td>
                  <td className="py-2 px-3">
                    <input type="date" className={cellInput} value={filters.updatedDay} onChange={(e) => setFilter("updatedDay", e.target.value)} />
                  </td>
                  <td className="py-2 pl-3 pr-4" />
                </tr>
              </thead>
              <tbody>
                {pageItems.map((t) => (
                  <tr key={t.id} className="border-b border-ink/5 last:border-0 hover:bg-ink/[0.02] cursor-pointer" onClick={() => openDetail(t)}>
                    <td className="py-3 pl-4 pr-3 text-xs font-mono text-ink">{t.code}</td>
                    <td className="py-3 pr-4 text-sm font-body text-ink max-w-[220px] truncate" title={t.title}>{t.title}</td>
                    <td className="py-3 pr-4 text-xs font-body text-ink/70 max-w-[320px] truncate" title={t.content}>{t.content}</td>
                    <td className="py-3 pr-3"><PriorityBadge value={t.priority} /></td>
                    <td className="py-3 px-3"><StatusBadge value={t.status} /></td>
                    <td className="py-3 px-3 text-xs font-body text-ink/70 max-w-[140px] truncate" title={assigneeLabel(t)}>{assigneeLabel(t)}</td>
                    <td className="py-3 px-3 text-xs text-[#8A7C63] font-body whitespace-nowrap">{formatDate(t.createdAt)}</td>
                    <td className="py-3 px-3 text-xs text-[#8A7C63] font-body whitespace-nowrap">{formatDate(t.updatedAt)}</td>
                    <td className="py-3 pl-3 pr-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex items-center gap-1">
                        <button type="button" onClick={() => openDetail(t)} title="Xem chi tiết" className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-ink/45 hover:text-teal hover:bg-teal/10 transition">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => openDelete(t)} title="Xóa ticket" className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-ink/45 hover:text-ticket hover:bg-ticket/10 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Dạng thẻ (mobile luôn hiện; desktop khi chọn Lưới) */}
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

      {/* Modal chi tiết ticket — bố cục theo ảnh 2 (lưới nhãn + giá trị) */}
      {detail && (
        <Modal onClose={closeDetail} wide contentStyle={{ maxWidth: "min(860px, 95vw)" }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-xl text-ink">Chi tiết ticket hỗ trợ</h3>
              <p className="text-xs text-[#8A7C63] font-body mt-0.5">
                Cập nhật trạng thái, ưu tiên và câu trả lời cho người gửi.
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
              <p className="text-[11px] font-mono uppercase text-[#8A7C63]">Người nhận</p>
              <p className="text-sm font-body text-ink mt-0.5">{assigneeLabel(detail)}</p>
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

      {/* Modal tạo ticket */}
      {createOpen && (
        <Modal onClose={closeCreate}>
          <h3 className="font-display text-lg text-ink mb-3">Tạo ticket hỗ trợ</h3>
          <form
            onSubmit={(e) => { e.preventDefault(); submitCreate(); }}
            className="space-y-3"
          >
            <div>
              <label className="text-[11px] font-mono uppercase text-[#8A7C63]">Tiêu đề</label>
              <input
                value={createForm.title}
                onChange={(e) => setCreateForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="VD: Không vào được game Vườn Thủ Hộ"
                autoComplete="off"
                className="w-full note-card px-4 py-2.5 mt-0.5 border-ink/10 focus:border-ticket rounded-2xl text-sm outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono uppercase text-[#8A7C63]">Nội dung</label>
              <textarea
                value={createForm.content}
                onChange={(e) => setCreateForm((f) => ({ ...f, content: e.target.value }))}
                rows={4}
                placeholder="Mô tả vấn đề..."
                className="w-full note-card px-4 py-2.5 mt-0.5 border-ink/10 focus:border-ticket rounded-2xl text-sm outline-none resize-y"
              />
            </div>
            <Select
              label="Ưu tiên"
              value={createForm.priority}
              onChange={(v) => setCreateForm((f) => ({ ...f, priority: v }))}
              options={PRIORITY_OPTIONS}
            />
            {createError && <p className="text-ticket text-sm">{createError}</p>}
            <div className="flex justify-end gap-2 pt-1">
              <GhostButton type="button" onClick={closeCreate}>Hủy</GhostButton>
              <PrimaryButton type="submit" disabled={creating}>
                {creating ? "Đang tạo..." : "Tạo ticket"}
              </PrimaryButton>
            </div>
          </form>
        </Modal>
      )}

      <ConfirmModal
        open={confirm.open}
        title="Xóa ticket"
        message={confirm.item ? `Xóa ticket "${confirm.item.code}" — ${confirm.item.title}?` : ""}
        onConfirm={doDelete}
        onClose={closeDelete}
        confirmLabel="Xóa"
      />
    </div>
  );
}
