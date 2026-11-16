import { useCallback, useEffect, useMemo, useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { navigate } from '../../lib/router.js'
import { templateService } from '../../services/api.js'
import { BulkDeleteBar, Checkbox, GridCard, IconButton, ManagementHeader, ManagementTable, ConfirmModal, TemplateThumb } from '../../components/ui'
import { useBulkSelection, bulkInChunks } from '../../lib/hooks.js'
import { matchesQuery } from '../../lib/searchText.js'

const STATUS_BADGE = {
  published: { label: "Hoạt động", tone: "mint" },
  inactive: { label: "Đã tắt", tone: "gray" },
  draft: { label: "Bản nháp", tone: "gold" },
};

export default function TemplateManagement({ showToast }) {
  const [templates, setTemplates] = useState(null);
  const [error, setError] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, item: null });

  const load = useCallback(() => {
    setTemplates(null); setError(null);
    templateService.list().then(setTemplates).catch(e => setError(e.message));
  }, []);
  useEffect(() => { load(); }, [load]);

  const confirmRemove = (t) => setConfirm({ open: true, item: t });

  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => (templates ?? []).filter((t) => matchesQuery(query, t.name, t.category, t.type, t.status)),
    [templates, query]
  );
  const doRemove = async () => {
    try {
      const result = await templateService.remove(confirm.item._id);
      showToast(result?.deactivated ? `Template đang được ${result.gamesCount} game dùng, đã chuyển inactive` : "Đã xóa template");
      setConfirm({ open: false, item: null }); load();
    } catch (err) { showToast(err.message || "Không thể xóa", "error"); }
  };

  // ── Xóa hàng loạt (chọn nhiều) ──────────────────────────────────────
  // Template đang được game dùng KHÔNG bị xóa cứng — server trả chúng ở
  // `deactivated` (đã chuyển inactive) và trang phải báo lại số này.
  const sel = useBulkSelection();
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const reportBulk = (r) => {
    const parts = [];
    if (r.deleted.length) parts.push(`Đã xóa ${r.deleted.length} template`);
    if (r.deactivated?.length) parts.push(`${r.deactivated.length} template đang được game dùng, đã chuyển inactive`);
    if (r.failed.length) parts.push(`${r.failed.length} không xóa được`);
    showToast(parts.join("; ") || "Không có gì thay đổi", r.failed.length && !r.deleted.length && !r.deactivated?.length ? "error" : undefined);
  };

  const doBulkRemove = async () => {
    if (!sel.count) return;
    setBulkDeleting(true);
    try {
      const r = await bulkInChunks(sel.selected, (ids) => templateService.bulkRemove(ids));
      reportBulk(r);
      sel.clear(); load();
    } catch (err) { showToast(err.message || "Không thể xóa hàng loạt", "error"); }
    finally { setBulkDeleting(false); }
  };

  const doRemoveAll = async () => {
    setBulkDeleting(true);
    try {
      const r = await templateService.removeAll();
      showToast(`Đã xóa ${r?.deleted ?? "toàn bộ"} template`);
      sel.clear(); load();
    } catch (err) { showToast(err.message || "Không thể xóa toàn bộ template", "error"); }
    finally { setBulkDeleting(false); }
  };

  return (
    <div>
      <ManagementHeader subtitle="Quản lý template trò chơi" title="Templates" />

      <div className="mb-4">
        <BulkDeleteBar count={sel.count} itemLabel="template" deleting={bulkDeleting}
          onDeleteSelected={doBulkRemove} onDeleteAll={doRemoveAll} onClear={sel.clear} />
      </div>

      <ManagementTable
        viewKey="templates"
        count={templates ? filtered.length : 0}
        data={templates ? filtered : templates}
        error={error && !templates ? error : null}
        onRetry={load}
        emptyLabel={query ? "Không tìm thấy template nào khớp tìm kiếm." : "Chưa có template nào."}
        onCreate={() => navigate("/dashboard/templates/new")}
        search={{ value: query, onChange: setQuery, placeholder: "Tìm kiếm" }}
        headers={[<Checkbox key="sel-all" checked={sel.allSelected(filtered.map((t) => t._id))} onChange={() => sel.toggleAll(filtered.map((t) => t._id))} />, "Ảnh", "Tên", "Loại", "Thể loại", "Trạng thái", "Cập nhật", ""]}
        renderGridCard={(t) => (
          <GridCard
            key={t._id}
            media={<TemplateThumb thumbnail={t.thumbnail} name={t.name} ring={t.ring} size={40} className="shrink-0" />}
            title={t.name}
            badge={STATUS_BADGE[t.status] || { label: t.status, tone: "gray" }}
            mono={t.category}
            extra={(
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-[#646970]">Loại: {t.type === "play-to-win" ? "Chơi để thắng (Win)" : "Học tập (Learn)"}</span>
                <Checkbox checked={sel.isSelected(t._id)} onChange={() => sel.toggle(t._id)} />
              </div>
            )}
            meta={t.updatedAt ? `Cập nhật: ${new Date(t.updatedAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}` : undefined}
            onEdit={() => navigate(`/dashboard/templates/${t._id}`)}
            onRemove={() => confirmRemove(t)}
          />
        )}
        renderRow={(t) => (
          <tr key={t._id} className="border-b border-ink/5 last:border-0">
            <td className="px-5 py-3">
              <Checkbox checked={sel.isSelected(t._id)} onChange={() => sel.toggle(t._id)} />
            </td>
            <td className="px-5 py-3"><TemplateThumb thumbnail={t.thumbnail} name={t.name} ring={t.ring} size={36} /></td>
            <td className="px-5 py-3 font-body text-ink">{t.name}</td>
            <td className="px-5 py-3">
              <span className={`text-[11px] font-mono uppercase px-2.5 py-1 rounded-full border ${t.type === "play-to-win" ? "bg-teal/15 text-teal border-teal/30" : "bg-ticket/15 text-ticket border-ticket/30"}`}>
                {t.type === "play-to-win" ? "Win" : "Learn"}
              </span>
            </td>
            <td className="px-5 py-3">
              <span className="text-[11px] font-mono uppercase px-2.5 py-1 rounded-full border"
                style={{ color: t.ring, borderColor: t.ring + "40", backgroundColor: t.ring + "15" }}>{t.category}</span>
            </td>
            <td className="px-5 py-3">
              <span className={`text-[11px] font-mono uppercase px-2.5 py-1 rounded-full border ${t.status === "published" ? "bg-teal/15 text-teal border-teal/30"
                : t.status === "inactive" ? "bg-ink/10 text-ink/50 border-ink/20" : "bg-gold/15 text-gold border-gold/30"
                }`}>{t.status}</span>
            </td>
            <td className="px-5 py-3 text-sm text-[#8A7C63]">
              {t.updatedAt ? new Date(t.updatedAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
            </td>
            <td className="px-5 py-3 text-right flex gap-1 justify-end">
              <IconButton title="Sửa" onClick={() => navigate(`/dashboard/templates/${t._id}`)}><Pencil /></IconButton>
              <IconButton title="Xóa" tone="danger" onClick={() => confirmRemove(t)}><Trash2 /></IconButton>
            </td>
          </tr>
        )}
      />

      <ConfirmModal open={confirm.open} title="Xóa template"
        message={confirm.item ? `Xóa template "${confirm.item.name}"?` : ""}
        onConfirm={doRemove} onClose={() => setConfirm({ open: false, item: null })} />
    </div>
  );
}
