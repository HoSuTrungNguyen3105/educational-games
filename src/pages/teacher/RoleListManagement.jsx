// RoleListManagement.jsx — trang /dashboard/roles "Vai trò" theo mẫu bảng HiWeb.
//
// Nguồn dữ liệu: GET /api/roles (phân trang + sort + keyword phía server),
// ghép với GET /api/permissions/roles (isBuiltIn + accountCount + permission_count).
//   · Thanh trên: tiêu đề, ô tìm, xuất CSV, xoá bộ lọc, bảng/lưới,
//     phân trang dạng khoảng "1-10 / 34" với mũi tên trước/sau.
//   · Dạng bảng: cột "Số quyền" là badge bấm vào mở MA TRẬN QUYỀN
//     (?m=rolePerms&role=…), cột "Tài khoản" = số user đang giữ vai trò.
//   · Dạng thẻ: giữ nguyên như cũ + thêm hành động "Quyền" mở ma trận quyền.
//   · Bấm dòng mở modal chi tiết (?m=roleDetail&role=… qua useModalParam).
//   · Thêm/Sửa/Xoá vai trò NGAY tại trang này: vai trò built-in khoá sửa/xoá;
//     cấp/bớt quyền chi tiết làm trong modal ma trận quyền rồi bấm Lưu.
//   · Trang "Ma trận quyền" (/dashboard/roles-matrix) đã gộp vào đây nên bị xoá.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { permissionService } from "../../services/api.js";
import { useModalParam } from "../../hooks/useModalParam.js";
import {
  ConfirmModal,
  ErrorState,
  FormModal,
  GhostButton,
  GridCard,
  IconClose,
  Loader,
  ManagementHeader,
  Modal,
  PrimaryButton,
  SearchInput,
  Select,
  tableWrapClass,
  useViewMode,
  ViewToggle,
} from "../../components/ui";
import RangePagination from "../../components/RangePagination.jsx";
import { rangeAll, rangeForPage } from "../../lib/rangePagination.js";
import { Crown, Download, Eye, Filter, GraduationCap, Grid2x2, KeyRound, Pencil, Plus, Shield, Trash2 } from "lucide-react";

const PER_PAGE = 10;

const EMPTY_FILTERS = { id: "", slug: "", name: "", total_permissions: "" };
const EMPTY_ROLE_FORM = { key: "", label: "", name_en: "", description: "", dashboardAccess: "false" };
const STATIC_BUILTIN_KEYS = ["admin", "teacher", "student"];

/** Icon theo vai trò — cùng bộ với trang Ma trận quyền trước đây. */
function roleIcon(key) {
  if (key === "admin") return Crown;
  if (key === "teacher") return GraduationCap;
  return Shield;
}

export default function RoleListManagement({ user, showToast }) {
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

  // ── Ma trận quyền (?m=rolePerms&role=…) — gộp từ trang /dashboard/roles-matrix
  // Từ đợt refactor Role & Permission: danh mục lấy từ Permission Catalog
  // (GET /api/permissions/catalog), quyền đã gán lấy từ
  // GET /api/rolePermissions?role_id=…, lưu = PUT đồng bộ toàn bộ.
  const [roleMap, setRoleMap] = useState(null); // key → vai trò (GET /permissions/roles)
  const [catalog, setCatalog] = useState(null);
  const [permRoleRef, setPermRoleRef] = useState(null); // id số (seq) hoặc slug của vai trò đang sửa quyền
  const [permOpen, setPermOpen] = useState(false);
  const [permRole, setPermRole] = useState(null);
  const [permLoading, setPermLoading] = useState(false);
  const [permSaving, setPermSaving] = useState(false);
  const [permError, setPermError] = useState("");
  const [permSearch, setPermSearch] = useState("");
  const [permModule, setPermModule] = useState("all");
  // Mặc định "all": ở chế độ "Đã cấp" việc BỎ tick làm dòng biến mất ngay tại
  // chỗ, trông như checkbox không hoạt động.
  const [permStatus, setPermStatus] = useState("all");
  const [granted, setGranted] = useState(() => new Set());
  const permRestoredRef = useRef(false);

  // ── Thêm / Sửa / Xoá vai trò tại chỗ ──────────────────────────────────
  // Danh sách phân trang (GET /roles) không trả isBuiltIn → tra thêm qua
  // listRoles (cùng nguồn trang Ma trận quyền trước đây dùng) để biết vai trò
  // hệ thống, đồng thời lấy accountCount / permission_count cho bảng.
  const [builtinMap, setBuiltinMap] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null); // row đang sửa (null = thêm mới)
  const [form, setForm] = useState(EMPTY_ROLE_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      Promise.all([
        permissionService.listRoles(rangeAll()),
        permissionService.catalogAll(),
      ])
        .then(([rs, cat]) => {
          const list = rs || [];
          setRoleMap(Object.fromEntries(list.map((r) => [r.key, r])));
          setBuiltinMap(Object.fromEntries(list.map((r) => [r.key, !!r.isBuiltIn])));
          setCatalog(cat || []);
        })
        .catch(() => {
          setRoleMap({});
          setBuiltinMap({});
          setCatalog([]);
        });
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const isBuiltin = useCallback((row) => {
    if (!row) return false;
    if (builtinMap && Object.prototype.hasOwnProperty.call(builtinMap, row.slug)) return !!builtinMap[row.slug];
    return STATIC_BUILTIN_KEYS.includes(row.slug);
  }, [builtinMap]);

  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY_ROLE_FORM });
    setFormError("");
    setFormOpen(true);
  };

  const openEdit = async (row) => {
    if (isBuiltin(row)) return;
    setFormError("");
    try {
      // Row phân trang thiếu description/dashboardAccess → lấy chi tiết thật.
      const d = await permissionService.getRole(row.slug);
      setEditing(row);
      setForm({
        key: row.slug,
        label: d?.label || row.name_vi || "",
        name_en: d?.name_en || row.name_en || "",
        description: d?.description || "",
        dashboardAccess: d?.dashboardAccess ? "true" : "false",
      });
      setFormOpen(true);
    } catch (e) {
      showToast?.(e.message || "Không tải được chi tiết vai trò", "error");
    }
  };

  const submitForm = async () => {
    if (!form.label.trim()) { setFormError("Vui lòng nhập tên vai trò"); return; }
    if (!editing && !form.key.trim()) { setFormError("Vui lòng nhập mã vai trò (key)"); return; }
    setSaving(true);
    setFormError("");
    try {
      const payload = {
        label: form.label.trim(),
        name_en: form.name_en.trim() || form.label.trim(),
        description: form.description.trim(),
        dashboardAccess: form.dashboardAccess === "true",
      };
      if (editing) {
        await permissionService.updateRole(editing.slug, payload);
        showToast?.("Đã cập nhật vai trò", "success");
      } else {
        await permissionService.createRole({ key: form.key.trim(), ...payload });
        showToast?.("Đã tạo vai trò", "success");
      }
      setFormOpen(false);
      setEditing(null);
      load();
    } catch (e) {
      setFormError(e.message || "Không lưu được vai trò");
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async () => {
    if (!deleteTarget) return;
    try {
      await permissionService.deleteRole(deleteTarget.slug);
      showToast?.("Đã xóa vai trò", "success");
      if (detail?.slug === deleteTarget.slug) { setDetail(null); modalParam.close("roleDetail"); }
      setDeleteTarget(null);
      load();
    } catch (e) {
      showToast?.(e.message || "Không xóa được vai trò", "error");
      setDeleteTarget(null);
    }
  };

  // ── Ma trận quyền (gộp từ trang /dashboard/roles-matrix) ───────────────
  const canEditPermissions = isAdmin && permRole?.key !== "admin";

  const openPermissions = async (row) => {
    const key = row?.key || row?.slug;
    if (!key) return;
    permRestoredRef.current = true; // mở bằng nút → không mở lại từ URL nữa
    setPermOpen(true);
    setPermRole({ key, name_vi: row.name_vi, name_en: row.name_en, label: row.label || row.name_vi });
    // role_id cho API rolePermissions: ưu tiên id số của dòng (GET /api/roles),
    // thiếu thì dùng slug (server resolve cả hai).
    setPermRoleRef(row.id ?? key);
    setPermLoading(true);
    setPermError("");
    setPermSearch("");
    setPermModule("all");
    setPermStatus("all");
    setGranted(new Set());
    modalParam.open("rolePerms", { role: key });
    try {
      // Vào thẳng link khi effect chính chưa tải xong danh mục → tải bù ngay.
      let nextCatalog = catalog;
      if (!nextCatalog) {
        nextCatalog = await permissionService.catalogAll();
        setCatalog(nextCatalog || []);
      }
      const [detailRole, assigned] = await Promise.all([
        permissionService.getRole(key),
        permissionService.listRolePermissions(row.id ?? key),
      ]);
      setPermRole(detailRole);
      setGranted(new Set((assigned || []).map((p) => p.permission_id)));
    } catch (e) {
      setPermError(e.message || "Không tải được quyền của vai trò");
    } finally {
      setPermLoading(false);
    }
  };

  const closePermissions = () => {
    setPermOpen(false);
    modalParam.close("rolePerms");
  };

  const togglePermission = (permission) => {
    if (!canEditPermissions || permission.is_base) return;
    setGranted((prev) => {
      const next = new Set(prev);
      if (next.has(permission.id)) next.delete(permission.id);
      else next.add(permission.id);
      return next;
    });
  };

  const moduleOptions = useMemo(() => {
    const map = new Map();
    for (const permission of catalog || []) {
      if (permission.module) map.set(permission.module, permission.module_vi || permission.module);
    }
    return [
      { value: "all", label: "Tất cả mô-đun" },
      ...[...map.entries()]
        .sort((a, b) => a[1].localeCompare(b[1], "vi"))
        .map(([value, label]) => ({ value, label })),
    ];
  }, [catalog]);

  const filteredPermissions = useMemo(() => {
    const q = permSearch.trim().toLowerCase();
    return (catalog || []).filter((permission) => {
      const isGranted = granted.has(permission.id);
      if (permStatus === "granted" && !isGranted) return false;
      if (permStatus === "not_granted" && isGranted) return false;
      if (permModule !== "all" && permission.module !== permModule) return false;
      if (!q) return true;
      return [permission.slug, permission.name_vi, permission.name_en, permission.module]
        .some((value) => String(value || "").toLowerCase().includes(q));
    });
  }, [catalog, granted, permModule, permSearch, permStatus]);

  const grantedCount = useMemo(
    () => (catalog || []).filter((permission) => granted.has(permission.id)).length,
    [catalog, granted]
  );

  const savePermissions = async () => {
    // Chưa tải được danh mục quyền (API lỗi) mà bấm Lưu sẽ đồng bộ về rỗng →
    // xoá sạch quyền của vai trò, nên chặn ngay từ đầu.
    if (!permRole || !catalog?.length) {
      showToast?.("Chưa tải được danh mục quyền — không lưu được, thử lại sau", "error");
      return;
    }
    // Đồng bộ toàn bộ qua API Role Permissions: gửi đúng tập id đang tick
    // (quyền cơ bản luôn nằm trong tập — server cũng giữ chúng bắt buộc).
    const permissionIds = (catalog || [])
      .filter((permission) => granted.has(permission.id))
      .map((permission) => permission.id);
    setPermSaving(true);
    try {
      await permissionService.syncRolePermissions(permRoleRef ?? permRole.key, permissionIds);
      closePermissions();
      showToast?.("Đã cập nhật quyền", "success");
      load(); // cột "Số quyền" trên bảng / thẻ tải lại theo
    } catch (e) {
      showToast?.(e.message || "Lỗi cập nhật quyền", "error");
    } finally {
      setPermSaving(false);
    }
  };

  const roleFormFields = [
    { name: "key", label: "Mã vai trò (key)", placeholder: "vd: monitor", disabled: !!editing },
    { name: "label", label: "Tên Việt" },
    { name: "name_en", label: "Tên Anh" },
    { name: "description", label: "Mô tả", type: "textarea", full: true },
    {
      name: "dashboardAccess", label: "Truy cập dashboard", type: "select",
      options: [{ value: "false", label: "Không" }, { value: "true", label: "Có" }],
    },
  ];

  const load = useCallback(() => {
    setError(null);
    // Phân trang bằng đoạn bản ghi ?from=&to= (hợp đồng rangeList phía
    // server, helper dùng chung rangeForPage): client chỉ gửi from/to.
    const { from, to } = rangeForPage(page, PER_PAGE);
    permissionService.rolesPaged({ from, to, keyword: debouncedKeyword })
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
      if (filters.slug && !String(r.slug || "").toLowerCase().includes(filters.slug.trim().toLowerCase())) return false;
      // Cột "Tên vai trò" gộp VI+EN (theo Ma trận quyền) → một ô lọc cho cả hai.
      const name = filters.name.trim().toLowerCase();
      if (name && ![r.name_vi, r.name_en].some((v) => String(v || "").toLowerCase().includes(name))) return false;
      if (filters.total_permissions && !String(r.total_permissions ?? "").includes(filters.total_permissions.trim())) return false;
      return true;
    });
  }, [rows, filters]);

  const totalItems = pagination?.total ?? 0;
  const totalPages = pagination?.total_pages ?? 1;
  const pageRange = rangeForPage(page, PER_PAGE);
  const fromRecord = totalItems === 0 ? 1 : pageRange.from;
  const toRecord = Math.min(pageRange.to, totalItems);
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
        const res = await permissionService.rolesPaged({ from: 1, to: 20, keyword: slug });
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

  // Vào thẳng link ?m=rolePerms&role=… (reload / dán link chia sẻ) → mở modal
  // ma trận quyền của vai trò đó. Vai trò không nằm ở trang hiện tại thì lấy
  // từ danh sách đầy đủ (GET /permissions/roles) hoặc dựng tối thiểu theo key.
  useEffect(() => {
    const t = setTimeout(() => {
      if (permRestoredRef.current || rows === null || modalParam.modal !== "rolePerms") return;
      permRestoredRef.current = true;
      const slug = modalParam.params.get("role");
      if (!slug) return;
      const found = (rows || []).find((r) => r.slug === slug)
        || (roleMap ? Object.values(roleMap).find((r) => r.key === slug) : null)
        || { key: slug, slug, name_vi: slug, name_en: "" };
      openPermissions(found);
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, roleMap]);

  // Nút Back của trình duyệt làm mất params → đóng modal ma trận quyền.
  useEffect(() => {
    const t = setTimeout(() => {
      if (modalParam.modal !== "rolePerms" && permOpen) setPermOpen(false);
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
          <PrimaryButton onClick={openCreate} className="!px-4 !py-2 text-sm flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Thêm vai trò
          </PrimaryButton>
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
            <table className="w-full min-w-[1080px]">
              <thead>
                <tr className="text-left text-[#8A7C63] font-mono text-[11px] uppercase border-b border-ink/10">
                  <th className="py-2.5 pl-4 pr-3 font-medium w-20">ID</th>
                  <th className="py-2.5 pr-3 font-medium w-44">Mã vai trò</th>
                  <th className="py-2.5 pr-3 font-medium">Tên vai trò</th>
                  <th className="py-2.5 px-3 font-medium w-24 text-center">Số quyền</th>
                  <th className="py-2.5 px-3 font-medium w-24 text-center">Tài khoản</th>
                  <th className="py-2.5 px-3 font-medium w-40">Ngày tạo</th>
                  <th className="py-2.5 px-3 font-medium w-40">Cập nhật</th>
                  <th className="py-2.5 pl-3 pr-4 font-medium w-40 text-right">Thao tác</th>
                </tr>
                <tr className="border-b border-ink/10">
                  <td className="py-2 pl-4 pr-3">
                    <input className={cellInput} placeholder="Tìm kiếm" value={filters.id} onChange={(e) => setFilter("id", e.target.value)} />
                  </td>
                  <td className="py-2 pr-3">
                    <input className={cellInput} placeholder="Tìm kiếm" value={filters.slug} onChange={(e) => setFilter("slug", e.target.value)} />
                  </td>
                  <td className="py-2 pr-3">
                    <input className={cellInput} placeholder="Tìm kiếm" value={filters.name} onChange={(e) => setFilter("name", e.target.value)} />
                  </td>
                  <td className="py-2 px-3">
                    <input className={cellInput} placeholder="Tìm kiếm" value={filters.total_permissions} onChange={(e) => setFilter("total_permissions", e.target.value)} />
                  </td>
                  <td className="py-2 px-3" />
                  <td className="py-2 px-3" />
                  <td className="py-2 px-3" />
                  <td className="py-2 px-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const Icon = roleIcon(r.slug);
                  const permCount = r.total_permissions ?? roleMap?.[r.slug]?.permission_count ?? 0;
                  const accounts = roleMap?.[r.slug]?.accountCount ?? 0;
                  return (
                    <tr key={r.slug} className="border-b border-ink/5 last:border-0 hover:bg-ink/[0.02] cursor-pointer" onClick={() => openDetail(r)}>
                      <td className="py-3 pl-4 pr-3 text-xs font-mono text-ink">{r.id}</td>
                      <td className="py-3 pr-3 text-xs font-mono text-teal truncate" title={r.slug}>{r.slug}</td>
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-lg bg-ink/5 text-ink/50 flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="font-display text-sm text-ink truncate">{r.name_vi}</p>
                            <p className="text-[11px] text-[#8A7C63] font-body truncate">{r.name_en || "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); openPermissions(r); }}
                          title={`Xem ${permCount} quyền của ${r.name_vi}`}
                          className="inline-flex min-w-8 h-8 items-center justify-center rounded-full bg-teal text-paper px-2.5 text-xs font-mono font-semibold hover:bg-teal/90 active:scale-95 transition"
                        >
                          {permCount}
                        </button>
                      </td>
                      <td className="py-3 px-3 text-center text-sm font-mono text-ink/70">{accounts}</td>
                      <td className="py-3 px-3 text-xs text-[#8A7C63] font-body whitespace-nowrap">{r.created_at}</td>
                      <td className="py-3 px-3 text-xs text-[#8A7C63] font-body whitespace-nowrap">{r.updated_at}</td>
                      <td className="py-3 pl-3 pr-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); openPermissions(r); }}
                            title="Xem / sửa quyền hạn"
                            className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-ink/45 hover:text-teal hover:bg-teal/10 transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {isBuiltin(r) ? (
                            <span className="text-[11px] font-mono uppercase text-[#8A7C63]">Hệ thống</span>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); openEdit(r); }}
                                title="Sửa vai trò"
                                className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-ink/45 hover:text-teal hover:bg-teal/10 transition"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setDeleteTarget(r); }}
                                title="Xóa vai trò"
                                className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-ink/45 hover:text-ticket hover:bg-ticket/10 transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
                  { label: "Quyền", icon: <KeyRound />, onClick: () => openPermissions(r), tone: "blue" },
                  ...(isBuiltin(r) ? [] : [
                    { label: "Sửa", icon: <Pencil />, onClick: () => openEdit(r), tone: "blue" },
                    { label: "Xóa", icon: <Trash2 />, onClick: () => setDeleteTarget(r), tone: "red" },
                  ]),
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
            {!isBuiltin(detail) && (
              <>
                <GhostButton onClick={() => { closeDetail(); openEdit(detail); }} className="flex items-center gap-1.5">
                  <Pencil className="w-4 h-4" /> Sửa
                </GhostButton>
                <GhostButton onClick={() => setDeleteTarget(detail)} className="flex items-center gap-1.5 !text-ticket">
                  <Trash2 className="w-4 h-4" /> Xóa
                </GhostButton>
              </>
            )}
            <PrimaryButton onClick={() => { closeDetail(); openPermissions(detail); }} className="flex items-center gap-1.5">
              <Grid2x2 className="w-4 h-4" />
              Ma trận quyền
            </PrimaryButton>
          </div>
        </Modal>
      )}

      {/* ── Ma trận quyền (?m=rolePerms&role=…) — gộp từ /dashboard/roles-matrix ── */}
      {permOpen && (
        <Modal onClose={closePermissions} wide contentStyle={{ maxWidth: "min(1120px, 95vw)" }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-xl text-ink">Ma trận quyền</h3>
              <p className="text-xs text-[#8A7C63] font-body mt-0.5">
                Bật/tắt checkbox quyền rồi bấm <span className="font-mono text-ink">Lưu</span> để đổi quyền cho vai trò.
              </p>
            </div>
            <button
              type="button"
              onClick={closePermissions}
              className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-ink/45 hover:text-ticket hover:bg-ticket/10 transition"
              title="Đóng"
            >
              <IconClose className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 mt-4">
            <div className="bg-paper2 rounded-xl px-3 py-2">
              <p className="text-[10px] font-mono uppercase text-[#8A7C63]">Vai trò</p>
              <p className="text-sm font-mono text-ink truncate">{permRole?.key || "—"}</p>
            </div>
            <div className="bg-paper2 rounded-xl px-3 py-2">
              <p className="text-[10px] font-mono uppercase text-[#8A7C63]">Tên vai trò (VI)</p>
              <p className="text-sm font-body text-ink truncate">{permRole?.name_vi || permRole?.label || "—"}</p>
            </div>
            <div className="bg-paper2 rounded-xl px-3 py-2">
              <p className="text-[10px] font-mono uppercase text-[#8A7C63]">Tên vai trò (EN)</p>
              <p className="text-sm font-body text-ink truncate">{permRole?.name_en || "—"}</p>
            </div>
            <div className="bg-paper2 rounded-xl px-3 py-2">
              <p className="text-[10px] font-mono uppercase text-[#8A7C63]">Số quyền</p>
              <p className="text-sm font-mono text-ink">
                {grantedCount}
                <span className="text-[#8A7C63]"> / {(catalog || []).length}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_160px_200px] gap-2 mt-4">
            <SearchInput value={permSearch} onChange={setPermSearch} placeholder="Tìm quyền hạn..." />
            <Select
              value={permStatus}
              onChange={setPermStatus}
              options={[
                { value: "all", label: "Tất cả" },
                { value: "granted", label: "Đã cấp" },
                { value: "not_granted", label: "Chưa cấp" },
              ]}
            />
            <Select value={permModule} onChange={setPermModule} options={moduleOptions} />
          </div>

          {permLoading ? (
            <Loader label="Đang tải quyền..." />
          ) : permError ? (
            <div className="py-8 text-center text-sm text-ticket font-body">{permError}</div>
          ) : (
            <div className="mt-3 rounded-xl border border-ink/10 overflow-hidden">
              <div className="overflow-auto max-h-[48vh]">
                <table className="w-full min-w-[760px]">
                  <thead className="sticky top-0 z-10 bg-paper2">
                    <tr className="text-left text-[#8A7C63] font-mono text-[11px] uppercase border-b border-ink/10">
                      <th className="py-3 pl-4 pr-2 font-medium w-12"> </th>
                      <th className="py-3 pr-4 font-medium">Quyền hạn</th>
                      <th className="py-3 pr-4 font-medium">Tên quyền (VI)</th>
                      <th className="py-3 pr-4 font-medium">Tên quyền (EN)</th>
                      <th className="py-3 pr-4 font-medium">Mô-đun</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPermissions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-10 text-center text-sm text-[#8A7C63] font-body">
                          Không có quyền phù hợp bộ lọc.
                        </td>
                      </tr>
                    ) : (
                      filteredPermissions.map((permission, index) => {
                        const checked = granted.has(permission.id);
                        return (
                          <tr
                            key={permission.slug}
                            className={`border-b border-ink/5 last:border-0 ${index % 2 ? "bg-paper2/45" : "bg-paper"}`}
                          >
                            <td className="py-2.5 pl-4 pr-2">
                              <input
                                type="checkbox"
                                checked={checked}
                                disabled={!canEditPermissions || permission.is_base || permSaving}
                                onChange={() => togglePermission(permission)}
                                className="w-4 h-4 accent-[#7C5CFF] disabled:opacity-50"
                                aria-label={`${permission.name_vi}: ${checked ? "đã cấp" : "chưa cấp"}`}
                              />
                            </td>
                            <td className="py-2.5 pr-4">
                              <span className="text-xs font-mono text-ink">{permission.slug}</span>
                              {permission.is_base && (
                                <span className="ml-2 text-[10px] font-mono uppercase text-[#8A7C63]">mặc định</span>
                              )}
                            </td>
                            <td className="py-2.5 pr-4 text-xs text-ink/80 font-body">{permission.name_vi}</td>
                            <td className="py-2.5 pr-4 text-xs text-ink/60 font-body">{permission.name_en}</td>
                            <td className="py-2.5 pr-4 text-xs font-mono text-[#8A7C63]">{permission.module}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
            <p className="text-[11px] text-[#8A7C63] font-body">
              Quyền có nhãn <span className="font-mono uppercase">mặc định</span> luôn được cấp cho mọi vai trò.
            </p>
            <div className="flex items-center gap-2">
              <GhostButton onClick={closePermissions}>Đóng</GhostButton>
              {canEditPermissions && (
                <PrimaryButton onClick={savePermissions} disabled={permSaving || permLoading}>
                  {permSaving ? "Đang lưu..." : "Lưu"}
                </PrimaryButton>
              )}
            </div>
          </div>
        </Modal>
      )}

      <FormModal
        open={formOpen}
        title="vai trò"
        fields={roleFormFields}
        values={form}
        onChange={setField}
        onSubmit={submitForm}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        error={formError}
        saving={saving}
        editId={editing?.slug}
        wide
      />

      <ConfirmModal
        open={!!deleteTarget}
        title="Xóa vai trò"
        message={deleteTarget ? `Xóa vai trò "${deleteTarget.name_vi}" (${deleteTarget.slug})? Vai trò đang có tài khoản sử dụng sẽ không xóa được.` : ""}
        confirmLabel="Xóa vai trò"
        onConfirm={doDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
