import { useCallback, useEffect, useState } from "react";
import { permissionService } from "../../services/api.js";
import {
  ManagementHeader,
  Modal,
  GhostButton,
  PrimaryButton,
  Loader,
  ErrorState,
  ConfirmModal,
} from "../../components/ui.jsx";
import { Shield, Check, X, Plus, MoreHorizontal, Crown, GraduationCap, User } from "lucide-react";

const COLS = [
  { key: "view", label: "Xem" },
  { key: "edit", label: "Sửa" },
  { key: "delete", label: "Xóa" },
];

const EMPTY_FORM = { key: "", label: "", description: "", dashboardAccess: false };

function roleIcon(key) {
  if (key === "admin") return Crown;
  if (key === "teacher") return GraduationCap;
  if (key === "student") return User;
  return Shield;
}

function allOn(matrix) {
  if (!matrix) return false;
  return Object.values(matrix).every((m) => m?.view && m?.edit && m?.delete);
}

function anyOn(matrix) {
  if (!matrix) return false;
  return Object.values(matrix).some((m) => m?.view || m?.edit || m?.delete);
}

export default function RoleManagement({ user, showToast }) {
  const [roles, setRoles] = useState(null);
  const [features, setFeatures] = useState(null);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ ...EMPTY_FORM });
  const [createError, setCreateError] = useState("");
  const [creating, setCreating] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, item: null });
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = user?.role === "admin";

  const load = useCallback(() => {
    setError(null);
    Promise.all([permissionService.listRoles(), permissionService.features()])
      .then(([r, f]) => {
        setRoles(r || []);
        setFeatures(f || []);
        setSelectedId((prev) => prev || (r && r[0]?.id) || null);
      })
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  const selected = roles?.find((r) => r.id === selectedId) || roles?.[0] || null;

  const toggleCell = async (featureKey, action) => {
    if (!selected || !isAdmin || selected.key === "admin") return;
    const nextMatrix = {
      ...selected.matrix,
      [featureKey]: {
        ...selected.matrix[featureKey],
        [action]: !selected.matrix[featureKey]?.[action],
      },
    };
    // Optimistic
    setRoles((prev) =>
      prev.map((r) => (r.id === selected.id ? { ...r, matrix: nextMatrix } : r))
    );
    setSaving(true);
    try {
      const updated = await permissionService.updateRole(selected.key, { matrix: nextMatrix });
      setRoles((prev) => prev.map((r) => (r.id === selected.id || r.key === updated.key ? { ...r, ...updated } : r)));
      showToast?.("Đã cập nhật quyền", "success");
    } catch (e) {
      showToast?.(e.message || "Lỗi cập nhật quyền", "error");
      load();
    } finally {
      setSaving(false);
    }
  };

  const openCreate = () => {
    setCreateForm({ ...EMPTY_FORM });
    setCreateError("");
    setCreateOpen(true);
    setMenuOpen(false);
  };

  const submitCreate = async () => {
    if (!createForm.key.trim() || !createForm.label.trim()) {
      setCreateError("Vui lòng nhập key và tên vai trò");
      return;
    }
    setCreating(true);
    setCreateError("");
    try {
      const created = await permissionService.createRole({
        key: createForm.key.trim(),
        label: createForm.label.trim(),
        description: createForm.description.trim(),
        dashboardAccess: createForm.dashboardAccess,
      });
      setCreateOpen(false);
      showToast?.("Đã tạo vai trò", "success");
      setRoles((prev) => [...(prev || []), created]);
      setSelectedId(created.id);
    } catch (e) {
      setCreateError(e.message || "Không thể tạo vai trò");
    } finally {
      setCreating(false);
    }
  };

  const doDelete = async () => {
    const item = confirm.item;
    if (!item) return;
    try {
      await permissionService.deleteRole(item.key);
      showToast?.("Đã xóa vai trò", "success");
      setConfirm({ open: false, item: null });
      setRoles((prev) => prev.filter((r) => r.id !== item.id));
      if (selectedId === item.id) setSelectedId(null);
    } catch (e) {
      showToast?.(e.message || "Lỗi xóa vai trò", "error");
      setConfirm({ open: false, item: null });
    }
  };

  if (error && !roles) {
    return (
      <div>
        <ManagementHeader subtitle="Quản lý hệ thống" title="Phân quyền" />
        <ErrorState subtitle={error} onRetry={load} />
      </div>
    );
  }

  if (!roles || !features) {
    return (
      <div>
        <ManagementHeader subtitle="Quản lý hệ thống" title="Phân quyền" />
        <Loader label="Đang tải phân quyền..." />
      </div>
    );
  }

  const fullAccess = selected && allOn(selected.matrix);
  const partial = selected && anyOn(selected.matrix) && !fullAccess;
  const badgeLabel = selected?.key === "admin"
    ? "Toàn quyền hệ thống"
    : fullAccess
      ? "Toàn quyền"
      : partial
        ? "Một phần quyền"
        : "Không có quyền dashboard";

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <ManagementHeader subtitle="Quản lý hệ thống" title="Phân quyền" />
        <div className="relative shrink-0">
          {isAdmin && (
            <PrimaryButton onClick={openCreate} className="!px-4 !py-2.5 text-sm flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              Tạo vai trò
            </PrimaryButton>
          )}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="absolute -right-11 top-0 w-9 h-9 rounded-full border border-ink/15 flex items-center justify-center text-ink/50 hover:bg-ink/5 transition"
            title="Tuỳ chọn"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-11 z-50 note-card p-1 min-w-[160px] shadow-lg anim-pop">
                <button
                  onClick={load}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm font-body text-ink hover:bg-ink/5 transition"
                >
                  Làm mới
                </button>
                {isAdmin && (
                  <button
                    onClick={openCreate}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm font-body text-ink hover:bg-ink/5 transition"
                  >
                    Tạo vai trò
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] gap-4 items-start">
        {/* Role list */}
        <div className="space-y-2.5">
          {roles.map((r) => {
            const Icon = roleIcon(r.key);
            const isActive = selected?.id === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setSelectedId(r.id)}
                className={`w-full text-left note-card p-4 transition border-2 ${
                  isActive
                    ? "border-[#7C5CFF] shadow-[0_0_0_1px_rgba(124,92,255,0.25)]"
                    : "border-transparent hover:border-ink/15"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isActive ? "bg-[#7C5CFF]/15 text-[#7C5CFF]" : "bg-ink/5 text-ink/50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-base text-ink truncate">{r.label}</p>
                    <p className="text-xs text-[#8A7C63] font-body">
                      {r.accountCount} tài khoản
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Permission matrix */}
        <div className="note-card p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <h2 className="font-display text-xl text-ink">
              Quyền của {selected?.label || "—"}
            </h2>
            <span
              className={`text-[11px] font-mono uppercase px-3 py-1 rounded-full border ${
                selected?.key === "admin" || fullAccess
                  ? "bg-[#7C5CFF]/10 text-[#7C5CFF] border-[#7C5CFF]/30"
                  : partial
                    ? "bg-gold/15 text-[#8a6a10] border-gold/40"
                    : "bg-ink/5 text-ink/40 border-ink/15"
              }`}
            >
              {badgeLabel}
            </span>
          </div>

          {saving && (
            <p className="text-xs text-[#8A7C63] font-mono mb-3">Đang lưu...</p>
          )}

          <div className="overflow-x-auto -mx-1 px-1">
            <table className="w-full min-w-[420px]">
              <thead>
                <tr className="text-left text-[#8A7C63] font-mono text-xs uppercase border-b border-ink/10">
                  <th className="pb-3 pr-4 font-medium">Chức năng</th>
                  {COLS.map((c) => (
                    <th key={c.key} className="pb-3 px-3 text-center font-medium w-16">
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((f) => {
                  const row = selected?.matrix?.[f.key] || {};
                  const locked = !isAdmin || selected?.key === "admin";
                  return (
                    <tr key={f.key} className="border-b border-ink/5 last:border-0">
                      <td className="py-3.5 pr-4 font-body text-sm text-ink">{f.label}</td>
                      {COLS.map((c) => {
                        const on = !!row[c.key];
                        return (
                          <td key={c.key} className="py-3.5 px-3 text-center">
                            <button
                              type="button"
                              disabled={locked || saving}
                              onClick={() => toggleCell(f.key, c.key)}
                              aria-label={`${c.label} ${f.label}: ${on ? "bật" : "tắt"}`}
                              className={`w-8 h-8 rounded-lg inline-flex items-center justify-center transition ${
                                on
                                  ? "text-teal bg-teal/10 hover:bg-teal/15"
                                  : "text-ink/25 hover:bg-ink/5"
                              } ${locked ? "cursor-default opacity-80" : "cursor-pointer"}`}
                            >
                              {on ? <Check className="w-5 h-5" strokeWidth={2.5} /> : <X className="w-4 h-4" strokeWidth={2} />}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {selected && !selected.isBuiltIn && isAdmin && (
            <div className="mt-5 pt-4 border-t border-ink/8 flex justify-end">
              <button
                onClick={() => setConfirm({ open: true, item: selected })}
                className="text-xs text-ticket/70 hover:text-ticket font-semibold"
              >
                Xóa vai trò này
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create role modal */}
      {createOpen && (
        <Modal onClose={() => setCreateOpen(false)}>
          <h3 className="font-display text-lg text-ink mb-3">➕ Tạo vai trò</h3>
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
              <label className="text-[11px] font-mono uppercase text-[#8A7C63]">Tên hiển thị</label>
              <input
                value={createForm.label}
                onChange={(e) => setCreateForm((f) => ({ ...f, label: e.target.value }))}
                placeholder="VD: Trợ giảng"
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
              <GhostButton type="button" onClick={() => setCreateOpen(false)}>
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
        onClose={() => setConfirm({ open: false, item: null })}
        confirmLabel="Xóa"
      />
    </div>
  );
}
