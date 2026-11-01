import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { permissionService } from "../../services/api.js";
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
} from "../../components/ui";
import { Crown, Eye, GraduationCap, Shield, Trash2 } from "lucide-react";

const EMPTY_FORM = { key: "", label: "", name_en: "", description: "", dashboardAccess: false };

function roleIcon(key) {
  if (key === "admin") return Crown;
  if (key === "teacher") return GraduationCap;
  if (key === "student") return Shield;
  return Shield;
}

function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function RoleManagement({ user, showToast }) {
  const [roles, setRoles] = useState(null);
  const [features, setFeatures] = useState(null);
  const [catalog, setCatalog] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ ...EMPTY_FORM });
  const [createError, setCreateError] = useState("");
  const [creating, setCreating] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, item: null });

  const [permOpen, setPermOpen] = useState(false);
  const [permRole, setPermRole] = useState(null);
  const [permLoading, setPermLoading] = useState(false);
  const [permError, setPermError] = useState("");
  const [permSearch, setPermSearch] = useState("");
  const [permModule, setPermModule] = useState("all");
  // Mặc định "all": ở chế độ "Đã cấp" việc BỎ tick làm dòng biến mất ngay tại
  // chỗ, trông như checkbox không hoạt động.
  const [permStatus, setPermStatus] = useState("all");
  const [granted, setGranted] = useState(() => new Set());

  const isAdmin = user?.role === "admin";

  // Đồng bộ modal đang mở lên URL (?m=…&role=…) — xem hooks/useModalParam.js.
  const modalParam = useModalParam();
  const restoredRef = useRef(false);

  const load = useCallback(() => {
    setError(null);
    Promise.all([
      permissionService.listRoles(),
      permissionService.features(),
      permissionService.catalog(),
    ])
      .then(([nextRoles, nextFeatures, nextCatalog]) => {
        setRoles(nextRoles || []);
        setFeatures(nextFeatures || []);
        setCatalog(nextCatalog || []);
      })
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  const filteredRoles = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (roles || []).filter((role) => {
      if (!q) return true;
      return [role.key, role.label, role.name_vi, role.name_en, role.description]
        .some((value) => String(value || "").toLowerCase().includes(q));
    });
  }, [roles, search]);

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
      const isGranted = granted.has(permission.slug);
      if (permStatus === "granted" && !isGranted) return false;
      if (permStatus === "not_granted" && isGranted) return false;
      if (permModule !== "all" && permission.module !== permModule) return false;
      if (!q) return true;
      return [permission.slug, permission.name_vi, permission.name_en, permission.module]
        .some((value) => String(value || "").toLowerCase().includes(q));
    });
  }, [catalog, granted, permModule, permSearch, permStatus]);

  const grantedCount = useMemo(
    () => (catalog || []).filter((permission) => granted.has(permission.slug)).length,
    [catalog, granted]
  );

  const canEditPermissions = isAdmin && permRole?.key !== "admin";

  const openCreate = () => {
    setCreateForm({ ...EMPTY_FORM });
    setCreateError("");
    setCreateOpen(true);
    modalParam.open("roleCreate");
  };

  const closeCreate = () => {
    setCreateOpen(false);
    modalParam.close("roleCreate");
  };

  const submitCreate = async () => {
    if (!createForm.key.trim() || !createForm.label.trim()) {
      setCreateError("Vui lòng nhập key và tên vai trò");
      return;
    }
    setCreating(true);
    setCreateError("");
    try {
      await permissionService.createRole({
        key: createForm.key.trim(),
        label: createForm.label.trim(),
        name_en: createForm.name_en.trim() || createForm.label.trim(),
        description: createForm.description.trim(),
        dashboardAccess: createForm.dashboardAccess,
      });
      closeCreate();
      showToast?.("Đã tạo vai trò", "success");
      load();
    } catch (e) {
      setCreateError(e.message || "Không thể tạo vai trò");
    } finally {
      setCreating(false);
    }
  };

  const openPermissions = async (role) => {
    setPermOpen(true);
    setPermRole(role);
    setPermLoading(true);
    setPermError("");
    setPermSearch("");
    setPermModule("all");
    setPermStatus("all");
    setGranted(new Set());
    modalParam.open("rolePerms", { role: role.key });
    try {
      const detail = await permissionService.getRole(role.key);
      setPermRole(detail);
      setGranted(new Set((detail.permission_details || []).map((permission) => permission.slug)));
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
      if (next.has(permission.slug)) next.delete(permission.slug);
      else next.add(permission.slug);
      return next;
    });
  };

  const savePermissions = async () => {
    if (!permRole || !features) return;
    const nextMatrix = {};
    for (const feature of features) {
      nextMatrix[feature.key] = { view: false, edit: false, delete: false };
    }
    for (const permission of catalog || []) {
      if (permission.is_base) continue;
      if (!granted.has(permission.slug) || !permission.feature_key || !permission.action) continue;
      if (!nextMatrix[permission.feature_key]) {
        nextMatrix[permission.feature_key] = { view: false, edit: false, delete: false };
      }
      nextMatrix[permission.feature_key][permission.action] = true;
    }

    // Quyền `_all` (toàn quyền) không có ô ma trận → gửi riêng ở extraPermissions,
    // server chỉ nhận các slug `_all` hợp lệ (admin tổng mới được seed sẵn).
    const extraPermissions = (catalog || [])
      .filter((permission) => permission.slug.endsWith("_all") && granted.has(permission.slug))
      .map((permission) => permission.slug);

    setSaving(true);
    try {
      const updated = await permissionService.updateRole(permRole.key, { matrix: nextMatrix, extraPermissions });
      setRoles((prev) => (prev || []).map((role) => (role.key === updated.key ? { ...role, ...updated } : role)));
      closePermissions();
      showToast?.("Đã cập nhật quyền", "success");
    } catch (e) {
      showToast?.(e.message || "Lỗi cập nhật quyền", "error");
    } finally {
      setSaving(false);
    }
  };

  const openDelete = (role) => {
    setConfirm({ open: true, item: role });
    modalParam.open("roleDelete", { role: role.key });
  };

  const closeDelete = () => {
    setConfirm({ open: false, item: null });
    modalParam.close("roleDelete");
  };

  const doDelete = async () => {
    const item = confirm.item;
    if (!item) return;
    try {
      await permissionService.deleteRole(item.key);
      showToast?.("Đã xóa vai trò", "success");
      closeDelete();
      setRoles((prev) => (prev || []).filter((role) => role.id !== item.id));
    } catch (e) {
      showToast?.(e.message || "Lỗi xóa vai trò", "error");
      closeDelete();
    }
  };

  // ── Modal ⇄ URL params ────────────────────────────────────────────────
  // Vào thẳng link có ?m=rolePerms&role=… / ?m=roleCreate / ?m=roleDelete&role=…
  // (reload, dán link chia sẻ) → modal tương ứng tự mở sau khi tải danh sách.
  // setTimeout(...,0) theo đúng convention của effect `load` ở trên để không
  // setState đồng bộ ngay trong thân effect.
  useEffect(() => {
    const t = setTimeout(() => {
      if (restoredRef.current || !roles) return;
      restoredRef.current = true;
      const m = modalParam.modal;
      if (!m) return;
      if (m === "roleCreate") { openCreate(); return; }
      const role = roles.find((r) => r.key === modalParam.params.get("role"));
      if (!role) return;
      if (m === "rolePerms") openPermissions(role);
      else if (m === "roleDelete") openDelete(role);
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roles]);

  // Nút Back của trình duyệt làm mất params → đóng modal đang mở.
  useEffect(() => {
    const t = setTimeout(() => {
      const m = modalParam.modal;
      if (m !== "rolePerms" && permOpen) setPermOpen(false);
      if (m !== "roleCreate" && createOpen) setCreateOpen(false);
      if (m !== "roleDelete" && confirm.open) setConfirm({ open: false, item: null });
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalParam.modal]);

  if (error && !roles) {
    return (
      <div>
        <ManagementHeader subtitle="Quản lý hệ thống" title="Vai trò & quyền hạn" />
        <ErrorState subtitle={error} onRetry={load} />
      </div>
    );
  }

  if (!roles || !features || !catalog) {
    return (
      <div>
        <ManagementHeader subtitle="Quản lý hệ thống" title="Vai trò & quyền hạn" />
        <Loader label="Đang tải vai trò và quyền..." />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <ManagementHeader subtitle="Quản lý hệ thống" title="Vai trò & quyền hạn" />
        {isAdmin && (
          <PrimaryButton onClick={openCreate} className="!px-4 !py-2.5 text-sm flex items-center gap-1.5">
            <IconAdd className="w-4 h-4" />
            Thêm vai trò
          </PrimaryButton>
        )}
      </div>

      <div className="note-card p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Tìm vai trò..."
            className="w-full sm:w-72"
          />
          <p className="text-xs font-mono text-[#8A7C63]">
            {filteredRoles.length} / {roles.length} vai trò
          </p>
        </div>

        {filteredRoles.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#8A7C63] font-body">
            Không tìm thấy vai trò phù hợp.
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[860px]">
              <thead>
                <tr className="text-left text-[#8A7C63] font-mono text-[11px] uppercase border-b border-ink/10">
                  <th className="pb-3 pr-3 font-medium w-12">ID</th>
                  <th className="pb-3 pr-4 font-medium">Tên viết tắt</th>
                  <th className="pb-3 pr-4 font-medium">Tên vai trò</th>
                  <th className="pb-3 px-3 font-medium text-center w-24">Số quyền</th>
                  <th className="pb-3 px-3 font-medium text-center w-24">Tài khoản</th>
                  <th className="pb-3 px-3 font-medium w-40">Ngày tạo</th>
                  <th className="pb-3 px-3 font-medium w-40">Ngày cập nhật</th>
                  <th className="pb-3 pl-3 font-medium text-right w-24">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoles.map((role, index) => {
                  const Icon = roleIcon(role.key);
                  return (
                    <tr key={role.id || role.key} className="border-b border-ink/5 last:border-0 hover:bg-ink/[0.02]">
                      <td className="py-3 pr-3 text-xs font-mono text-[#8A7C63]">{index + 1}</td>
                      <td className="py-3 pr-4">
                        <span className="text-sm font-mono text-ink">{role.key}</span>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-lg bg-ink/5 text-ink/50 flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="font-display text-sm text-ink truncate">{role.name_vi || role.label}</p>
                            <p className="text-[11px] text-[#8A7C63] font-body truncate">{role.name_en || "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => openPermissions(role)}
                          title={`Xem ${role.permission_count || 0} quyền của ${role.name_vi || role.label}`}
                          className="inline-flex min-w-8 h-8 items-center justify-center rounded-full bg-teal text-paper px-2.5 text-xs font-mono font-semibold hover:bg-teal/90 active:scale-95 transition"
                        >
                          {role.permission_count || 0}
                        </button>
                      </td>
                      <td className="py-3 px-3 text-center text-sm font-mono text-ink/70">
                        {role.accountCount || 0}
                      </td>
                      <td className="py-3 px-3 text-xs text-[#8A7C63] font-body whitespace-nowrap">
                        {formatDateTime(role.created_at)}
                      </td>
                      <td className="py-3 px-3 text-xs text-[#8A7C63] font-body whitespace-nowrap">
                        {formatDateTime(role.updated_at || role.created_at)}
                      </td>
                      <td className="py-3 pl-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openPermissions(role)}
                            title="Xem quyền hạn"
                            className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-ink/45 hover:text-teal hover:bg-teal/10 transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {isAdmin && !role.isBuiltIn && (
                            <button
                              type="button"
                              onClick={() => openDelete(role)}
                              title="Xóa vai trò"
                              className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-ink/45 hover:text-ticket hover:bg-ticket/10 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Role permissions modal */}
      {permOpen && (
        <Modal
          onClose={closePermissions}
          wide
          contentStyle={{ maxWidth: "min(1120px, 95vw)" }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-xl text-ink">Xem quyền hạn</h3>
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
                <span className="text-[#8A7C63]"> / {catalog.length}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_160px_200px] gap-2 mt-4">
            <SearchInput
              value={permSearch}
              onChange={setPermSearch}
              placeholder="Tìm quyền hạn..."
            />
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
                        const checked = granted.has(permission.slug);
                        return (
                          <tr
                            key={permission.slug}
                            className={`border-b border-ink/5 last:border-0 ${index % 2 ? "bg-paper2/45" : "bg-paper"}`}
                          >
                            <td className="py-2.5 pl-4 pr-2">
                              <input
                                type="checkbox"
                                checked={checked}
                                disabled={!canEditPermissions || permission.is_base || saving}
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
                <PrimaryButton onClick={savePermissions} disabled={saving || permLoading}>
                  {saving ? "Đang lưu..." : "Lưu"}
                </PrimaryButton>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Create role modal */}
      {createOpen && (
        <Modal onClose={closeCreate}>
          <h3 className="font-display text-lg text-ink mb-3">Tạo vai trò</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitCreate();
            }}
            className="space-y-3"
          >
            <div>
              <label className="text-[11px] font-mono uppercase text-[#8A7C63]">Key (a-z, 0-9, -)</label>
              <input
                value={createForm.key}
                onChange={(e) => setCreateForm((f) => ({ ...f, key: e.target.value }))}
                placeholder="VD: assistant"
                autoComplete="off"
                className="w-full note-card px-4 py-2.5 mt-0.5 border-ink/10 focus:border-ticket rounded-2xl text-sm font-mono outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono uppercase text-[#8A7C63]">Tên hiển thị (VI)</label>
              <input
                value={createForm.label}
                onChange={(e) => setCreateForm((f) => ({ ...f, label: e.target.value }))}
                placeholder="VD: Trợ giảng"
                autoComplete="off"
                className="w-full note-card px-4 py-2.5 mt-0.5 border-ink/10 focus:border-ticket rounded-2xl text-sm outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono uppercase text-[#8A7C63]">Tên hiển thị (EN)</label>
              <input
                value={createForm.name_en}
                onChange={(e) => setCreateForm((f) => ({ ...f, name_en: e.target.value }))}
                placeholder="VD: Teaching Assistant"
                autoComplete="off"
                className="w-full note-card px-4 py-2.5 mt-0.5 border-ink/10 focus:border-ticket rounded-2xl text-sm outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono uppercase text-[#8A7C63]">Mô tả</label>
              <input
                value={createForm.description}
                onChange={(e) => setCreateForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Tuỳ chọn"
                autoComplete="off"
                className="w-full note-card px-4 py-2.5 mt-0.5 border-ink/10 focus:border-ticket rounded-2xl text-sm outline-none"
              />
            </div>
            <label className="flex items-center gap-2 text-sm font-body text-ink cursor-pointer">
              <input
                type="checkbox"
                checked={createForm.dashboardAccess}
                onChange={(e) => setCreateForm((f) => ({ ...f, dashboardAccess: e.target.checked }))}
                className="w-4 h-4 accent-[#7C5CFF]"
              />
              Được truy cập dashboard admin
            </label>
            {createError && <p className="text-ticket text-sm">{createError}</p>}
            <div className="flex justify-end gap-2 pt-1">
              <GhostButton type="button" onClick={closeCreate}>
                Hủy
              </GhostButton>
              <PrimaryButton type="submit" disabled={creating}>
                {creating ? "Đang tạo..." : "Tạo vai trò"}
              </PrimaryButton>
            </div>
          </form>
        </Modal>
      )}

      <ConfirmModal
        open={confirm.open}
        title="Xóa vai trò"
        message={confirm.item ? `Xóa vai trò "${confirm.item.label}"?` : ""}
        onConfirm={doDelete}
        onClose={closeDelete}
        confirmLabel="Xóa"
      />
    </div>
  );
}
