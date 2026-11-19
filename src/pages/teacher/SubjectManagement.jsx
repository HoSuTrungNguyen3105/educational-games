import { useEffect, useRef, useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { setupService } from '../../services/setupService.js'
import { GridCard, IconButton, ManagementHeader, ManagementTable, ConfirmModal, FormModal } from '../../components/ui'
import { useCrudList } from '../../hooks/useCrudList.js'
import { rangeForPage } from '../../lib/rangePagination.js'
import { useRangePager } from '../../hooks/useRangePager.js'

const FIELDS = [{ name: "name", label: "Tên môn học", placeholder: "VD: Toán, Văn, Anh..." }];

// Phân trang PHÍA SERVER theo mẫu trang /dashboard/permissions: danh
// sách nạp theo ?from=&to= kèm ?q= (server lọc trước khi cắt — xem
// routes/setup.js), cụm RangePagination dùng chung hiện qua prop
// serverPager của ManagementTable.
const PER_PAGE = 10;

export default function SubjectManagement({ showToast }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  // page/từ khoá mới nhất cho fetchList của useCrudList đọc (xem ghi chú
  // tương tự ở CategoryManagement).
  const pagerRef = useRef({ page: 1, q: "" });
  const {
    items: subjects, total, error, load,
    form, setField, editingId, saving, modalOpen,
    openCreate, openEdit, closeModal, submit,
    confirmProps, askRemove,
  } = useCrudList({
    fetchList: () => setupService.listSubjectsPaged(
      rangeForPage(pagerRef.current.page, PER_PAGE),
      { q: pagerRef.current.q },
    ),
    onSave: (form, editingId) => editingId
      ? setupService.updateSubject(editingId, form.name.trim())
      : setupService.addSubject(form.name.trim()),
    onRemove: (item) => setupService.removeSubject(item.name),
    emptyForm: { name: "" },
    toForm: (item) => ({ name: item.name }),
    idOf: (item) => item.name,
    validate: (form) => form.name.trim() ? null : "Vui lòng nhập tên môn học",
    describe: (item) => `môn học "${item.name}"`,
    removeTitle: "Xóa môn học",
    messages: { created: "Đã thêm môn học", updated: "Đã cập nhật môn học", removed: "Đã xóa môn học" },
    showToast,
  });

  const pager = useRangePager(total ?? 0, PER_PAGE);
  // Đồng bộ page/từ khoá mới nhất vào ref cho fetchList đọc (effect này
  // khai trước effect nạp lại bên dưới nên ref luôn kịp cập nhật).
  useEffect(() => {
    pagerRef.current = { page: pager.page, q: debouncedQuery };
  }, [pager.page, debouncedQuery]);

  // Gõ tìm kiếm: chờ 350ms rồi về trang 1 với từ khoá mới (mẫu Permissions).
  useEffect(() => {
    const t = setTimeout(() => {
      pager.setPage(1);
      setDebouncedQuery(query.trim());
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // Đổi trang/từ khoá → nạp lại đoạn tương ứng (lần mount đầu do
  // useCrudList tự nạp nên bỏ qua).
  const firstLoadRef = useRef(true);
  useEffect(() => {
    if (firstLoadRef.current) { firstLoadRef.current = false; return; }
    load();
  }, [pager.page, debouncedQuery, load]);

  return (
    <div>
      <ManagementHeader subtitle="Quản lý môn học" title="Môn học" />

      <ManagementTable
        viewKey="subjects"
        data={subjects}
        serverPager={pager.props}
        error={error && !subjects ? error : null}
        onRetry={load}
        emptyLabel={query ? "Không tìm thấy môn học nào khớp tìm kiếm." : "Chưa có môn học nào."}
        onCreate={openCreate}
        search={{ value: query, onChange: setQuery, placeholder: "Tìm kiếm" }}
        headers={["STT", "Tên môn học", ""]}
        renderGridCard={(item, idx) => (
          <GridCard
            key={item._id || item.name}
            title={item.name}
            badge={{ label: "Hoạt động", tone: "mint" }}
            meta={`Thứ tự: ${idx}`}
            onEdit={() => openEdit(item)}
            onRemove={() => askRemove(item)}
          />
        )}
        renderRow={(item, idx) => (
          <tr key={item._id || idx} className="border-b border-ink/5 last:border-0">
            <td className="px-5 py-3 font-mono text-[#8A7C63]">{idx + 1}</td>
            <td className="px-5 py-3 font-body text-ink">{item.name}</td>
            <td className="px-5 py-3">
              <div className="flex items-center justify-end gap-2">
                <IconButton title="Chỉnh sửa" onClick={() => openEdit(item)}>
                  <Pencil />
                </IconButton>
                <IconButton title="Xóa" tone="danger" onClick={() => askRemove(item)}>
                  <Trash2 />
                </IconButton>
              </div>
            </td>
          </tr>
        )}
      />

      <FormModal open={modalOpen} title="Môn học" fields={FIELDS} values={form} onChange={setField}
        onSubmit={submit} onClose={closeModal} error={error} saving={saving} editId={editingId} />

      <ConfirmModal {...confirmProps} />
    </div>
  );
}
