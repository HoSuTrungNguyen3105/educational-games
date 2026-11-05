// RoleListManagement.jsx — trang /dashboard/roles "Vai trò" theo mẫu bảng HiWeb.
//
// Nguồn dữ liệu: GET /api/roles (phân trang + sort + keyword phía server).
//   · Thanh trên: tiêu đề, ô tìm, xuất CSV, xoá bộ lọc, bảng/lưới,
//     phân trang dạng khoảng "1-10 / 34" với mũi tên trước/sau.
//   · Bảng: mỗi cột có ô lọc riêng (lọc ngay trên trang đang xem).
//   · Bấm dòng mở modal chi tiết (?m=roleDetail&role=… qua useModalParam),
//     trong modal có nút mở trang "Ma trận quyền" (/dashboard/roles-matrix) để sửa.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { permissionService } from "../../services/api.js";
import { navigate } from "../../lib/router.js";
import { useModalParam } from "../../hooks/useModalParam.js";
import {
  ErrorState,
  GhostButton,
  GridCard,
  IconClose,
  Loader,
  ManagementHeader,
  Modal,
  PrimaryButton,
  SearchInput,
  tableWrapClass,
  useViewMode,
  ViewToggle,
} from "../../components/ui";
import RangePagination from "../../components/RangePagination.jsx";
import { Download, Eye, Filter, Grid2x2 } from "lucide-react";

const PER_PAGE = 10;

const EMPTY_FILTERS = { id: "", slug: "", name_vi: "", name_en: "", total_permissions: "" };

export default function RoleListManagement({ user }) {
  const isAdmin = user?.role === "admin";
  const modalParam = useModalParam();
  const [mode, setMode] = useViewMode("admin-roles-list", "grid");

  const [rows, setRows] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [error, setError] = useState(null);
  const [detail, setDetail] = useState(null);

  const load = useCallback(() => {
    setError(null);
    permissionService.rolesPaged({ page, perPage: PER_PAGE, keyword: debouncedKeyword })
      .then((res) => {
        setRows(res?.data || []);
        setPagination(res?.pagination || null);
      })
      .catch((e) => setError(e.message));
  }, [page, debouncedKeyword]);

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  // Ô tìm phía server: gõ dừng 350ms mới gọi API và quay về trang 1.
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setDebouncedKeyword(keyword.trim());
    }, 350);
    return () => clearTimeout(t);
  }, [keyword]);

  const setFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value }));

  const filtered = useMemo(() => {
    return (rows || []).filter((r) => {
      if (filters.id && !String(r.id).includes(filters.id.trim())) return false;
      for (const key of ["slug", "name_vi", "name_en"]) {
        const q = filters[key].trim().toLowerCase();
        if (q && !String(r[key] || "").toLowerCase().includes(q)) return false;
      }
      if (filters.total_permissions && !String(r.total_permissions ?? "").includes(filters.total_permissions.trim())) return false;
      return true;
    });
  }, [rows, filters]);

  const totalItems = pagination?.total ?? 0;
  const totalPages = pagination?.total_pages ?? 1;
  const fromRecord = totalItems === 0 ? 1 : (page - 1) * PER_PAGE + 1;
  const toRecord = Math.min(page * PER_PAGE, totalItems);
  const changeRange = (from) => setPage(Math.max(1, Math.min(totalPages, Math.ceil((Number(from) || 1) / PER_PAGE))));
  const prevPage = () => setPage((p) => Math.max(1, p - 1));
  const nextPage = () => setPage((p) => Math.min(totalPages, p + 1));

  // ── Modal chi tiết (?m=roleDetail&role=<slug>) ────────────────────────
  const openDetail = (role) => {
    setDetail(role);
    modalParam.open("roleDetail", { role: role.slug });
  };
  const closeDetail = () => {
    setDetail(null);
    modalParam.close("roleDetail");
  };

  // Reload / dán link có params → mở lại modal; nếu role không nằm ở trang
  // hiện tại thì tìm qua keyword (server lọc theo slug/label).
  const restoredRef = useRef(false);
  useEffect(() => {
    const t = setTimeout(async () => {
      if (restoredRef.current || rows === null || modalParam.modal !== "roleDetail") return;
      restoredRef.current = true;
      const slug = modalParam.params.get("role");
      if (!slug) return;
      const found = (rows || []).find((r) => r.slug === slug);
      if (found) { setDetail(found); return; }
      try {
        const res = await permissionService.rolesPaged({ page: 1, perPage: 20, keyword: slug });
        const match = (res?.data || []).find((r) => r.slug === slug);
        if (match) setDetail(match);
      } catch { /* để nguyên, không chặn trang */ }
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (modalParam.modal !== "roleDetail" && detail) setDetail(null);
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalParam.modal]);

  const exportCsv = () => {
    const head = ["ID", "Mã vai trò", "Tên Việt", "Tên Anh", "Số quyền", "Ngày tạo", "Cập nhật"];
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines = filtered.map((r) => [r.id, r.slug, r.name_vi, r.name_en, r.total_permissions, r.created_at, r.updated_at].map(esc).join(","));
    const blob = new Blob(["\uFEFF" + [head.map(esc).join(","), ...lines].join("\r\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "roles.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isAdmin) {
    return (
      <div>
        <ManagementHeader subtitle="Hệ thống" title="Vai trò" />
        <div className="note-card p-6 text-sm text-[#8A7C63] font-body">
          Chỉ tài khoản <span className="font-mono text-ink">admin</span> mới xem được trang này.
        </div>
      </div>
    );
  }

  const filterActive = keyword || Object.values(filters).some((v) => v);
  const clearFilters = () => { setKeyword(""); setFilters(EMPTY_FILTERS); setPage(1); };
  const cellInput = "w-full rounded-lg border border-ink/15 bg-paper px-2.5 py-1.5 text-xs font-body outline-none focus:border-teal";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ManagementHeader subtitle="Hệ thống" title="Vai trò" />
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput value={keyword} onChange={setKeyword} placeholder="Tìm vai trò" className="w-48" />
          <button
            type="button"
            onClick={exportCsv}
            disabled={!filtered.length}
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
            totalItems={totalItems}
            onRangeChange={changeRange}
            onPrevPage={prevPage}
            onNextPage={nextPage}
            disabled={totalItems === 0}
          />
        </div>
      </div>

      {error && rows === null ? (
        <ErrorState subtitle={error} onRetry={load} />
      ) : rows === null ? (
        <Loader label="Đang tải vai trò..." />
      ) : filtered.length === 0 ? (
        <div className="note-card py-14 text-center text-sm text-[#8A7C63] font-body">
          Không có vai trò nào khớp bộ lọc.
        </div>
      ) : (
        <>
          <div className={`note-card overflow-x-auto ${tableWrapClass(mode)}`}>
            <table className="w-full min-w-[1020px]">
              <thead>
                <tr className="text-left text-[#8A7C63] font-mono text-[11px] uppercase border-b border-ink/10">
                  <th className="py-2.5 pl-4 pr-3 font-medium w-20">ID</th>
                  <th className="py-2.5 pr-3 font-medium w-52">Mã vai trò</th>
                  <th className="py-2.5 pr-3 font-medium">Tên Việt</th>
                  <th className="py-2.5 pr-3 font-medium">Tên Anh</th>
                  <th className="py-2.5 px-3 font-medium w-28">Số quyền</th>
                  <th className="py-2.5 px-3 font-medium w-40">Ngày tạo</th>
                  <th className="py-2.5 px-3 font-medium w-40">Cập nhật</th>
                </tr>
                <tr className="border-b border-ink/10">
                  <td className="py-2 pl-4 pr-3">
                    <input className={cellInput} placeholder="Tìm kiếm" value={filters.id} onChange={(e) => setFilter("id", e.target.value)} />
                  </td>
                  <td className="py-2 pr-3">
                    <input className={cellInput} placeholder="Tìm kiếm" value={filters.slug} onChange={(e) => setFilter("slug", e.target.value)} />
                  </td>
                  <td className="py-2 pr-3">
                    <input className={cellInput} placeholder="Tìm kiếm" value={filters.name_vi} onChange={(e) => setFilter("name_vi", e.target.value)} />
                  </td>
                  <td className="py-2 pr-3">
                    <input className={cellInput} placeholder="Tìm kiếm" value={filters.name_en} onChange={(e) => setFilter("name_en", e.target.value)} />
                  </td>
                  <td className="py-2 px-3">
                    <input className={cellInput} placeholder="Tìm kiếm" value={filters.total_permissions} onChange={(e) => setFilter("total_permissions", e.target.value)} />
                  </td>
                  <td className="py-2 px-3" />
                  <td className="py-2 px-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.slug} className="border-b border-ink/5 last:border-0 hover:bg-ink/[0.02] cursor-pointer" onClick={() => openDetail(r)}>
                    <td className="py-3 pl-4 pr-3 text-xs font-mono text-ink">{r.id}</td>
                    <td className="py-3 pr-3 text-xs font-mono text-teal truncate" title={r.slug}>{r.slug}</td>
                    <td className="py-3 pr-3 text-sm font-body text-ink max-w-[220px] truncate" title={r.name_vi}>{r.name_vi}</td>
                    <td className="py-3 pr-3 text-sm font-body text-ink/70 max-w-[220px] truncate" title={r.name_en}>{r.name_en}</td>
                    <td className="py-3 px-3 text-xs font-mono text-ink">{r.total_permissions}</td>
                    <td className="py-3 px-3 text-xs text-[#8A7C63] font-body whitespace-nowrap">{r.created_at}</td>
                    <td className="py-3 px-3 text-xs text-[#8A7C63] font-body whitespace-nowrap">{r.updated_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={`edu-grid ${mode === "list" ? "md:hidden" : ""}`}>
            {filtered.map((r) => (
              <GridCard
                key={r.slug}
                title={r.name_vi}
                badge={{ label: `${r.total_permissions} quyền`, tone: "blue" }}
                mono={r.slug}
                description={r.name_en || undefined}
                meta={`Cập nhật: ${r.updated_at}`}
                footerActions={[
                  { label: "Chi tiết", icon: <Eye />, onClick: () => openDetail(r), tone: "blue" },
                ]}
              />
            ))}
          </div>
        </>
      )}

      {detail && (
        <Modal onClose={closeDetail} contentStyle={{ maxWidth: "min(560px, 95vw)" }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-xl text-ink">{detail.name_vi}</h3>
              <p className="text-xs font-mono text-teal mt-0.5">{detail.slug}</p>
            </div>
            <button type="button" onClick={closeDetail} title="Đóng" className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-ink/45 hover:text-ticket hover:bg-ticket/10 transition">
              <IconClose className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-4 mt-4">
            <div>
              <p className="text-[11px] font-mono uppercase text-[#8A7C63]">ID</p>
              <p className="text-sm font-mono text-ink mt-0.5">{detail.id}</p>
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase text-[#8A7C63]">Số quyền</p>
              <p className="text-sm font-mono text-ink mt-0.5">{detail.total_permissions}</p>
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase text-[#8A7C63]">Tên Việt</p>
              <p className="text-sm font-body text-ink mt-0.5">{detail.name_vi}</p>
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase text-[#8A7C63]">Tên Anh</p>
              <p className="text-sm font-body text-ink mt-0.5">{detail.name_en}</p>
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase text-[#8A7C63]">Ngày tạo</p>
              <p className="text-sm font-body text-ink mt-0.5">{detail.created_at}</p>
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase text-[#8A7C63]">Cập nhật</p>
              <p className="text-sm font-body text-ink mt-0.5">{detail.updated_at}</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 mt-5">
            <GhostButton onClick={closeDetail}>Đóng</GhostButton>
            <PrimaryButton onClick={() => navigate("/dashboard/roles-matrix")} className="flex items-center gap-1.5">
              <Grid2x2 className="w-4 h-4" />
              Ma trận quyền
            </PrimaryButton>
          </div>
        </Modal>
      )}
    </div>
  );
}
