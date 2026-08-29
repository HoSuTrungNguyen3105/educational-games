import { useCallback, useEffect, useState } from 'react'
import { navigate } from '../../lib/router.js'
import { templateService } from '../../services/api.js'
import { IconButton, ManagementHeader, ManagementTable, ConfirmModal } from '../../components/ui.jsx'

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
  const doRemove = async () => {
    try {
      const result = await templateService.remove(confirm.item._id);
      showToast(result?.deactivated ? `Template đang được ${result.gamesCount} game dùng, đã chuyển inactive` : "Đã xóa template");
      setConfirm({ open: false, item: null }); load();
    } catch (err) { showToast(err.message || "Không thể xóa", "error"); }
  };

  return (
    <div>
      <ManagementHeader subtitle="Quản lý template trò chơi" title="Templates" />

      <ManagementTable
        count={templates ? templates.length : 0}
        data={templates}
        error={error && !templates ? error : null}
        onRetry={load}
        emptyLabel="Chưa có template nào."
        onCreate={() => navigate("/admin/templates/new")}
        headers={["Icon", "Tên", "Loại", "Thể loại", "Trạng thái", "Màu", ""]}
        renderRow={(t) => (
          <tr key={t._id} className="border-b border-ink/5 last:border-0">
            <td className="px-5 py-3 text-xl">{t.icon}</td>
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
            <td className="px-5 py-3"><span className="inline-block w-6 h-6 rounded-full border border-ink/10" style={{ backgroundColor: t.ring }}></span></td>
            <td className="px-5 py-3 text-right flex gap-1 justify-end">
              <IconButton title="Sửa" onClick={() => navigate(`/admin/templates/${t._id}`)}>✏️</IconButton>
              <IconButton title="Xóa" onClick={() => confirmRemove(t)}>🗑️</IconButton>
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
