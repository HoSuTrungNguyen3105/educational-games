import { useState, useEffect, useMemo } from 'react';
import { assignmentService, classService } from '../../services/api.js';
import { navigate } from '../../lib/router.js';
import { Clock, Users, CircleX, Eye, Link2, ClipboardList, Trash2, Download } from 'lucide-react';
import { BulkDeleteBar, Checkbox, ConfirmModal, EmptyState, GridCard, GridToolbar, IconAdd, IconCheckCircle, Loader, ManagementHeader, PrimaryButton, useViewMode } from '../../components/ui';
import { useBulkSelection, bulkInChunks } from '../../lib/hooks.js';
import { useConfirm } from '../../hooks/useConfirm.js';
import { useCopy } from '../../hooks/useCopy.js';
import { usePagedList } from '../../hooks/usePagedList.js';
import { matchesQuery } from '../../lib/searchText.js';
import { templateLabel } from '../../components/exam/templateLabel.js';
import { exportCsv } from '../../lib/exportCsv.js';

export default function AssignmentList({ showToast }) {
  const [assignments, setAssignments] = useState(null);
  const [classes, setClasses] = useState({});
  const [error, setError] = useState(null);
  const { askConfirm, confirmProps } = useConfirm();
  const [copiedKey, copy] = useCopy();
  const [query, setQuery] = useState('');
  const [mode, setMode] = useViewMode('assignments');

  const filtered = useMemo(
    () => (assignments ?? []).filter((a) => matchesQuery(query, a.title, a.code, classes[a.classId], templateLabel(a.templateId))),
    [assignments, query, classes]
  );
  const pager = usePagedList(filtered, 12, query);

  useEffect(() => { load(); }, []);

  async function load() {
    setAssignments(null);
    setError(null);
    try {
      const [all, allClasses] = await Promise.all([
        assignmentService.list(),
        classService.list(),
      ]);
      setAssignments(all);
      const cMap = {}; allClasses.forEach(c => { cMap[c.id] = c.name; });
      setClasses(cMap);
    } catch (e) {
      setError(e.message || 'Lỗi tải danh sách bài tập');
    }
  }

  function handleClose(a) {
    askConfirm({
      title: 'Đóng bài tập',
      message: `Đóng bài "${a.title}"? Học sinh sẽ không thể nộp thêm.`,
      confirmLabel: 'Đóng',
      danger: false,
      onConfirm: async () => {
        await assignmentService.close(a.id);
        load();
      },
    });
  }

  // ── Xoá bài tập (trước đây trang này không có nút xoá nào) ──────────
  function handleDelete(a) {
    askConfirm({
      title: 'Xóa bài tập',
      message: `Xóa bài "${a.title}"? Toàn bộ bài nộp của học sinh cũng bị xóa. Không hoàn tác được.`,
      confirmLabel: 'Xóa',
      onConfirm: async () => {
        try {
          await assignmentService.delete_(a.id);
          showToast?.('Đã xóa bài tập');
          load();
        } catch (e) { showToast?.(e.message || 'Lỗi xóa bài tập', 'error'); }
      },
    });
  }

  // ── Xóa hàng loạt (chọn nhiều) ──────────────────────────────────────
  // Không có endpoint removeAll riêng: "Xóa tất cả" = bulk toàn bộ id.
  const sel = useBulkSelection();
  const [bulkDeleting, setBulkDeleting] = useState(false);

  function reportBulkAssignments(r) {
    if (r.failed.length) {
      showToast?.(`Đã xóa ${r.deleted.length} bài tập, ${r.failed.length} không xóa được`, r.deleted.length ? 'info' : 'error');
    } else {
      showToast?.(`Đã xóa ${r.deleted.length} bài tập`);
    }
  }

  async function doBulkRemoveAssignments() {
    if (!sel.count) return;
    setBulkDeleting(true);
    try {
      const r = await bulkInChunks(sel.selected, (ids) => assignmentService.bulkRemove(ids));
      reportBulkAssignments(r);
      sel.clear(); load();
    } catch (e) { showToast?.(e.message || 'Lỗi xóa hàng loạt', 'error'); }
    finally { setBulkDeleting(false); }
  }

  async function doRemoveAllAssignments() {
    const ids = (assignments || []).map((a) => a.id);
    if (!ids.length) return;
    setBulkDeleting(true);
    try {
      const r = await bulkInChunks(ids, (chunk) => assignmentService.bulkRemove(chunk));
      reportBulkAssignments(r);
      sel.clear(); load();
    } catch (e) { showToast?.(e.message || 'Lỗi xóa toàn bộ', 'error'); }
    finally { setBulkDeleting(false); }
  }

  function copyLink(assignment) {
    const url = `${window.location.origin}/educational-games/#/assignment/${assignment.code || assignment.id}`;
    copy(url, assignment.id);
  }

  function handleExportCsv() {
    exportCsv(
      'assignments.csv',
      ['Tiêu đề', 'Lớp', 'Mã', 'Trạng thái', 'Loại', 'Mẫu game', 'Hạn nộp', 'Ngày tạo'],
      filtered.map((a) => [
        a.title,
        classes[a.classId] || a.classId || '',
        a.code || '',
        a.status === 'ACTIVE' ? 'Đang mở' : 'Đã đóng',
        a.isExam ? 'Bài thi' : 'Bài tập',
        templateLabel(a.templateId),
        a.deadline || '',
        a.createdAt || '',
      ]),
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <ManagementHeader subtitle="Quản lý bài tập" title="Bài tập đã giao" />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={!filtered.length}
            title="Xuất CSV"
            className="w-9 h-9 rounded-lg border border-ink/15 bg-paper inline-flex items-center justify-center text-ink/60 hover:text-teal disabled:opacity-40 transition"
          >
            <Download className="w-4 h-4" />
          </button>
          <PrimaryButton onClick={() => navigate('/dashboard/assignments/new')} className="!bg-gold hover:!bg-gold/80 !px-4 !py-2 !text-sm flex items-center gap-2">
            <IconAdd className="w-4 h-4" /> Tạo bài tập
          </PrimaryButton>
        </div>
      </div>

      {error && !assignments && (
        <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-body flex items-center justify-between">
          <span>{error}</span>
          <button onClick={load} className="font-semibold hover:underline">Thử lại</button>
        </div>
      )}
      {!error && !assignments && <Loader label="Đang tải bài tập..." />}
      {!error && assignments && assignments.length === 0 && (
        <EmptyState icon={<ClipboardList />} title="Chưa có bài tập nào"
          subtitle="Tạo bài tập đầu tiên để giao cho học sinh."
          action={<PrimaryButton onClick={() => navigate('/dashboard/assignments/new')} className="!bg-gold hover:!bg-gold/80 !px-4 !py-2 !text-sm">+ Tạo bài tập</PrimaryButton>} />
      )}
      {!error && assignments && assignments.length > 0 && (
        <div className="space-y-4">
          <GridToolbar
            search={{ value: query, onChange: setQuery, placeholder: "Tìm bài tập" }}
            mode={mode}
            onModeChange={setMode}
            pager={pager}
          />
          <BulkDeleteBar count={sel.count} itemLabel="bài tập" deleting={bulkDeleting}
            onDeleteSelected={doBulkRemoveAssignments} onDeleteAll={doRemoveAllAssignments} onClear={sel.clear} />
          {filtered.length === 0 ? (
            <div className="note-card edu-empty">Không tìm thấy bài tập nào khớp tìm kiếm.</div>
          ) : mode === "grid" ? (
            <div className="edu-grid">
              {pager.pageItems.map(a => (
                <GridCard
                  key={a.id}
                  title={a.title}
                  badge={a.status === 'ACTIVE' ? { label: 'Đang mở', tone: 'mint' } : { label: 'Đã đóng', tone: 'red' }}
                  mono={a.code}
                  meta={`${classes[a.classId] || a.classId} · ${templateLabel(a.templateId)}`}
                  extra={(
                    <div className="flex items-center gap-2">
                      <Checkbox checked={sel.isSelected(a.id)} onChange={() => sel.toggle(a.id)} />
                      {a.isExam && (
                        <span className="self-start px-2 py-0.5 rounded-full text-[10px] font-body font-semibold bg-blue-100 text-blue-600">Bài thi</span>
                      )}
                    </div>
                  )}
                  footerActions={[
                    { label: 'Xem', icon: <Eye />, onClick: () => navigate(`/dashboard/assignments/${a.id}`), tone: 'blue' },
                    { label: copiedKey === a.id ? 'Đã copy' : 'Copy link', icon: copiedKey === a.id ? <IconCheckCircle /> : <Link2 />, onClick: () => copyLink(a), tone: 'muted' },
                    ...(a.status === 'ACTIVE' ? [{ label: 'Đóng', icon: <CircleX />, onClick: () => handleClose(a), tone: 'red' }] : []),
                    { label: 'Xoá', icon: <Trash2 />, onClick: () => handleDelete(a), tone: 'red' },
                  ]}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {pager.pageItems.map(a => (
            <div key={a.id} className="note-card p-4 flex items-center gap-4">
            <Checkbox checked={sel.isSelected(a.id)} onChange={() => sel.toggle(a.id)} />
  {/* Thông tin bài tập */}
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-sm text-ink truncate">
                {a.title}
              </h3>

              <div className="flex items-center gap-3 mt-1 text-xs font-body text-ink/40">
                <span>{classes[a.classId] || a.classId}</span>
                <span>•</span>
                <span>{templateLabel(a.templateId)}</span>
                <span>•</span>
                <span className="font-mono text-gold">{a.code}</span>
              </div>
            </div>

            {/* Badge và các nút action nằm cùng hàng */}
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-body font-semibold ${
                  a.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-500'
                }`}
              >
                {a.status === 'ACTIVE' ? 'Đang mở' : 'Đã đóng'}
              </span>

              {a.isExam && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-body font-semibold bg-blue-100 text-blue-600">
                  Bài thi
                </span>
              )}

              <button
                onClick={() => copyLink(a)}
                className={`p-2 rounded-lg hover:bg-ink/5 transition ${
                  copiedKey === a.id
                    ? 'text-green-500'
                    : 'text-ink/40 hover:text-gold'
                }`}
                title="Copy link bài tập"
              >
                {copiedKey === a.id
                  ? <IconCheckCircle className="w-4 h-4" />
                  : <Link2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => navigate(`/dashboard/assignments/${a.id}`)}
                className="p-2 rounded-lg hover:bg-ink/5 transition text-ink/40 hover:text-gold"
                title="Xem bài tập"
              >
                <Eye className="w-4 h-4" />
              </button>

              {a.status === 'ACTIVE' && (
                <button
                  onClick={() => handleClose(a)}
                  className="p-2 rounded-lg hover:bg-red-50 transition text-ink/30 hover:text-red-500"
                  title="Đóng bài tập"
                >
                  <CircleX className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => handleDelete(a)}
                className="p-2 rounded-lg hover:bg-red-50 transition text-ink/30 hover:text-red-500"
                title="Xóa bài tập"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          ))}
            </div>
          )}
        </div>
      )}

      <ConfirmModal {...confirmProps} />
    </div>
  );
}
