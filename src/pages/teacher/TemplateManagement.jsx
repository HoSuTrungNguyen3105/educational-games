import { useCallback, useEffect, useState } from 'react'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { navigate } from '../../lib/router.js'
import { gameService, templateService } from '../../services/api.js'
import { BulkDeleteBar, Checkbox, GhostButton, GridCard, IconButton, ManagementHeader, ManagementTable, ConfirmModal, Modal, StatusBadge, TemplateThumb } from '../../components/ui'
import { useBulkSelection, bulkInChunks } from '../../lib/hooks.js'
import { useRangePager } from '../../hooks/useRangePager.js'

// Phân trang PHÍA SERVER theo mẫu trang /dashboard/permissions: danh
// sách nạp theo ?from=&to= kèm ?q=&status=&sort= (server lọc/sắp xếp
// trước khi cắt — xem routes/setup.js), cụm RangePagination dùng chung
// hiện qua prop serverPager của ManagementTable. Hệ quả: ô "chọn tất
// cả" của xóa hàng loạt áp cho TRANG ĐANG HIỂN THỊ (giống trang Ảnh ở
// PR #149); nút "Xóa tất cả" của BulkDeleteBar vẫn xóa toàn bộ qua
// endpoint riêng như trước.
const PER_PAGE = 10

const STATUS_BADGE = {
  published: { label: "Hoạt động", tone: "mint" },
  inactive: { label: "Đã tắt", tone: "gray" },
  draft: { label: "Bản nháp", tone: "gold" },
};

export default function TemplateManagement({ showToast }) {
  const [templates, setTemplates] = useState(null);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, item: null });
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const pager = useRangePager(total, PER_PAGE);

  const load = useCallback(() => {
    setError(null);
    templateService.list(pager.range, { q: debouncedQuery, status: statusFilter, sort: sortBy })
      .then((res) => { setTemplates(res.items); setTotal(res.total); })
      .catch(e => setError(e.message));
    // pager.range suy ra từ page hiện tại — load chạy lại khi trang đổi.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pager.range.from, pager.range.to, debouncedQuery, statusFilter, sortBy]);
  useEffect(() => { load(); }, [load]);

  // Gõ tìm kiếm: chờ 350ms rồi về trang 1 với từ khoá mới (mẫu Permissions).
  useEffect(() => {
    const t = setTimeout(() => {
      pager.setPage(1);
      setDebouncedQuery(query.trim());
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // Xoá làm tổng co lại: trang vượt quá trang cuối thì lùi về.
  useEffect(() => {
    if (total > 0 && pager.page > pager.totalPages) pager.setPage(pager.totalPages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  const confirmRemove = (t) => setConfirm({ open: true, item: t });

  // ── Xem danh sách game đang dùng 1 template ─────────────────────────
  const [gamesTpl, setGamesTpl] = useState(null);
  const [gamesState, setGamesState] = useState({ loading: false, error: null, items: [] });

  const openGames = async (t) => {
    setGamesTpl(t);
    setGamesState({ loading: true, error: null, items: [] });
    try {
      const res = await gameService.list({ templateId: t._id, from: 1, to: 200 });
      setGamesState({ loading: false, error: null, items: res?.items || [] });
    } catch (e) {
      setGamesState({ loading: false, error: e.message || "Không tải được danh sách game", items: [] });
    }
  };

  const openPreview = (t) => {
    if (t.htmlUrl) window.open(t.htmlUrl, "_blank", "noopener");
  };
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

      <div className="flex flex-wrap gap-3 mb-4">
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); pager.setPage(1); }} className="note-card px-4 py-2.5 text-sm">
          <option value="all">Tất cả trạng thái</option>
          <option value="published">Hoạt động</option>
          <option value="draft">Bản nháp</option>
          <option value="inactive">Đã tắt</option>
        </select>
        <select value={sortBy} onChange={e => { setSortBy(e.target.value); pager.setPage(1); }} className="note-card px-4 py-2.5 text-sm">
          <option value="name">Tên A–Z</option>
          <option value="games">Nhiều game nhất</option>
          <option value="updated">Mới cập nhật</option>
        </select>
      </div>

      <ManagementTable
        viewKey="templates"
        count={total}
        data={templates}
        serverPager={pager.props}
        error={!templates ? error : null}
        onRetry={load}
        emptyLabel={query ? "Không tìm thấy template nào khớp tìm kiếm." : "Chưa có template nào."}
        onCreate={() => navigate("/dashboard/templates/new")}
        search={{ value: query, onChange: setQuery, placeholder: "Tìm kiếm" }}
        headers={[<Checkbox key="sel-all" checked={sel.allSelected((templates ?? []).map((t) => t._id))} onChange={() => sel.toggleAll((templates ?? []).map((t) => t._id))} />, "Ảnh", "Tên", "Loại", "Thể loại", "Trạng thái", "Game dùng", "Cập nhật", ""]}
        renderGridCard={(t) => (
          <GridCard
            key={t._id}
            media={<TemplateThumb thumbnail={t.thumbnail} name={t.name} ring={t.ring} size={40} className="shrink-0" />}
            title={<>{t.name} <span className="text-[11px] font-mono font-normal text-[#8A7C63]">v{t.version}</span></>}
            badge={STATUS_BADGE[t.status] || { label: t.status, tone: "gray" }}
            mono={t.category}
            extra={(
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-[#646970]">Loại: {t.type === "play-to-win" ? "Chơi để thắng (Win)" : "Học tập (Learn)"}</span>
                  <Checkbox checked={sel.isSelected(t._id)} onChange={() => sel.toggle(t._id)} />
                </div>
                <div className="flex items-center justify-between gap-2">
                  {t.gamesCount > 0 ? (
                    <button onClick={() => openGames(t)} className="text-xs font-semibold text-ticket hover:underline">
                      Đang dùng: {t.gamesCount} game
                    </button>
                  ) : (
                    <span className="text-xs text-[#646970]">Đang dùng: 0 game</span>
                  )}
                  {t.htmlUrl && (
                    <button onClick={() => openPreview(t)} className="inline-flex items-center gap-1 text-xs font-semibold text-teal hover:underline">
                      <Eye className="w-3.5 h-3.5" /> Xem trước
                    </button>
                  )}
                </div>
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
            <td className="px-5 py-3 font-body text-ink">
              {t.name}
              <span className="ml-2 text-[11px] font-mono text-[#8A7C63]">v{t.version}</span>
            </td>
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
              <span className={`edu-grid-badge edu-grid-badge--${(STATUS_BADGE[t.status] || { tone: "gray" }).tone}`}>
                {(STATUS_BADGE[t.status] || { label: t.status }).label}
              </span>
            </td>
            <td className="px-5 py-3">
              {t.gamesCount > 0 ? (
                <button onClick={() => openGames(t)} className="text-sm font-semibold text-ticket hover:underline">
                  {t.gamesCount} game
                </button>
              ) : (
                <span className="text-sm text-[#8A7C63]">0 game</span>
              )}
            </td>
            <td className="px-5 py-3 text-sm text-[#8A7C63]">
              {t.updatedAt ? new Date(t.updatedAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
            </td>
            <td className="px-5 py-3 text-right whitespace-nowrap">
              <div className="flex gap-1 justify-end">
                {t.htmlUrl && <IconButton title="Xem trước" onClick={() => openPreview(t)}><Eye /></IconButton>}
                <IconButton title="Sửa" onClick={() => navigate(`/dashboard/templates/${t._id}`)}><Pencil /></IconButton>
                <IconButton title="Xóa" tone="danger" onClick={() => confirmRemove(t)}><Trash2 /></IconButton>
              </div>
            </td>
          </tr>
        )}
      />

      <ConfirmModal open={confirm.open} title="Xóa template"
        message={confirm.item
          ? (confirm.item.gamesCount > 0
            ? `Template "${confirm.item.name}" đang được ${confirm.item.gamesCount} game sử dụng. Xóa sẽ chuyển template sang trạng thái inactive (đã tắt) và KHÔNG xóa các game liên quan.`
            : `Xóa template "${confirm.item.name}"?`)
          : ""}
        onConfirm={doRemove} onClose={() => setConfirm({ open: false, item: null })} />

      {gamesTpl && (
        <Modal onClose={() => setGamesTpl(null)}>
          <h3 className="font-display text-xl text-ink mb-1">Game đang dùng template</h3>
          <p className="text-sm text-[#8A7C63] mb-4">"{gamesTpl.name}" — {gamesTpl.gamesCount || 0} game</p>
          {gamesState.loading && <p className="text-sm text-[#8A7C63] py-4">Đang tải danh sách game...</p>}
          {!gamesState.loading && gamesState.error && (
            <p className="text-sm text-ticket py-4">Không tải được danh sách game: {gamesState.error}</p>
          )}
          {!gamesState.loading && !gamesState.error && gamesState.items.length === 0 && (
            <p className="text-sm text-[#8A7C63] py-4">Chưa có game nào dùng template này.</p>
          )}
          {!gamesState.loading && !gamesState.error && gamesState.items.length > 0 && (
            <div className="max-h-[50vh] overflow-y-auto space-y-2 mb-4">
              {gamesState.items.map((g) => (
                <div key={g._id} className="note-card p-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-body text-ink truncate">{g.name}</p>
                    <p className="text-[11px] font-mono text-[#8A7C63]">{g.subject || "Khác"} · {g.questionsCount || 0} câu hỏi</p>
                  </div>
                  <StatusBadge status={g.status} />
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-end">
            <GhostButton onClick={() => setGamesTpl(null)}>Đóng</GhostButton>
          </div>
        </Modal>
      )}
    </div>
  );
}
