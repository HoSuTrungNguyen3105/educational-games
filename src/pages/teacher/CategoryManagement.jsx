import { useEffect, useRef, useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { setupService } from '../../services/setupService.js'
import { GridCard, IconButton, ManagementHeader, ManagementTable, ConfirmModal, FormModal } from '../../components/ui'
import { useCrudList } from '../../hooks/useCrudList.js'
import { rangeForPage } from '../../lib/rangePagination.js'
import { useRangePager } from '../../hooks/useRangePager.js'

const FIELDS = [
  { name: "id", label: "ID (không dấu, không khoảng trắng)", placeholder: "VD: quiz, puzzle, adventure" },
  { name: "label", label: "Tên hiển thị", placeholder: "VD: Trắc nghiệm, Pseudo code" },
];

const EMPTY = { id: "", label: "" };

// Phân trang PHÍA SERVER theo mẫu trang /dashboard/permissions: danh
// sách nạp theo ?from=&to= kèm ?q= (server lọc trước khi cắt — xem
// routes/setup.js), cụm RangePagination dùng chung hiện qua prop
// serverPager của ManagementTable.
const PER_PAGE = 10;

export default function CategoryManagement({ showToast }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  // page/từ khoá mới nhất cho fetchList của useCrudList đọc (hook giữ
  // options trong ref nhưng closure tạo ở lần render đầu sẽ đóng băng
  // state nếu đọc trực tiếp).
  const pagerRef = useRef({ page: 1, q: "" });
  const {
    items: categories, total, error, load,
    form, setField, editingId, saving, modalOpen,
    openCreate, openEdit, closeModal, submit,
    confirmProps, askRemove, askRemoveAll,
  } = useCrudList({
    // fetchList đọc page/từ khoá MỚI NHẤT qua closure (useCrudList giữ
    // options trong ref) và trả { items, total } cho hook.
    fetchList: () => setupService.listCategoriesPaged(
      rangeForPage(pagerRef.current.page, PER_PAGE),
      { q: pagerRef.current.q },
    ),
    onSave: (form, editingId) => editingId
      ? setupService.updateCategory(editingId, { label: form.label })
      : setupService.createCategory({ id: form.id.trim(), label: form.label }),
    onRemove: (cat) => setupService.removeCategory(cat.id),
    onRemoveAll: () => setupService.removeAllCategories(),
    emptyForm: EMPTY,
    toForm: (cat) => ({ id: cat.id, label: cat.label }),
    validate: (form) => (!form.id.trim() || !form.label.trim()) ? "Vui lòng nhập đầy đủ ID và tên" : null,
    describe: (cat) => `${cat.label} (${cat.id})`,
    removeTitle: "Xóa category",
    messages: { created: "Đã tạo category mới", updated: "Đã cập nhật category", removed: "Đã xóa category" },
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
      <ManagementHeader subtitle="Quản lý danh mục" title="Categories" />

      <ManagementTable
        viewKey="categories"
        data={categories}
        serverPager={pager.props}
        error={error && !categories ? error : null}
        onRetry={load}
        emptyLabel={query ? "Không tìm thấy category nào khớp tìm kiếm." : "Chưa có category nào."}
        onCreate={openCreate}
        search={{ value: query, onChange: setQuery, placeholder: "Tìm kiếm" }}
        onRemoveAll={categories && categories.length > 0 ? () => askRemoveAll("TẤT CẢ category") : null}
        headers={["ID", "Tên hiển thị", ""]}
        renderGridCard={(cat, idx) => (
          <GridCard
            key={cat.id}
            title={cat.label}
            badge={{ label: "Hoạt động", tone: "mint" }}
            mono={cat.id}
            meta={`Thứ tự: ${idx}`}
            onEdit={() => openEdit(cat)}
            onRemove={() => askRemove(cat)}
          />
        )}
        renderRow={(cat) => (
          <tr key={cat.id} className="border-b border-ink/5 last:border-0">
            <td className="px-5 py-3 font-mono text-ink">{cat.id}</td>
            <td className="px-5 py-3 font-body text-ink">{cat.label}</td>
            <td className="px-5 py-3">
              <div className="flex items-center justify-end gap-2">
                <IconButton title="Chỉnh sửa" onClick={() => openEdit(cat)}><Pencil /></IconButton>
                <IconButton title="Xóa" tone="danger" onClick={() => askRemove(cat)}><Trash2 /></IconButton>
              </div>
            </td>
          </tr>
        )}
      />

      <FormModal open={modalOpen} title="Category" fields={FIELDS} values={form} onChange={setField}
        onSubmit={submit} onClose={closeModal} error={error} saving={saving} editId={editingId} />

      <ConfirmModal {...confirmProps} />
    </div>
  );
}
