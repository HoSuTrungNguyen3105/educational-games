import { useCallback, useEffect, useRef, useState } from "react";
import { useConfirm } from "./useConfirm.js";

/**
 * useCrudList — logic dùng chung cho các trang quản trị dạng "danh sách + thêm/sửa/xóa"
 * (Category, Subject, DailyTask, PlantType...).
 *
 * Gom lại: tải danh sách (loading = data null, error), state form thêm/sửa,
 * lưu có validate, và xóa / xóa tất cả có hộp xác nhận.
 *
 * const {
 *   items, error, load,
 *   form, setField, editingId, saving, modalOpen,
 *   openCreate, openEdit, closeModal, submit,
 *   confirmProps, askRemove, askRemoveAll,
 * } = useCrudList({
 *   fetchList: () => setupService.listCategories(),
 *   onSave: (form, editingId) => editingId
 *     ? setupService.updateCategory(editingId, { label: form.label })
 *     : setupService.createCategory(form),
 *   onRemove: (item) => setupService.removeCategory(item.id),
 *   onRemoveAll: () => setupService.removeAllCategories(),   // tùy chọn
 *   emptyForm: { id: "", label: "" },
 *   toForm: (item) => ({ id: item.id, label: item.label }),   // tùy chọn
 *   idOf: (item) => item.name,                              // tùy chọn, khóa định danh dùng khi sửa (mặc định item.id ?? item._id ?? item.name)
 *   validate: (form) => form.id.trim() ? null : "Thiếu ID",   // tùy chọn, trả về message lỗi hoặc null
 *   describe: (item) => item.label,                          // tùy chọn, nhãn hiện trong hộp xác nhận
 *   removeTitle: "Xóa category",                             // tùy chọn
 *   messages: { created, updated, removed, removedAll },      // tùy chọn
 *   showToast,
 * });
 *
 * Render: <ManagementTable data={items} .../> + <FormModal .../> + <ConfirmModal {...confirmProps} />
 */
export function useCrudList(options) {
  // Giữ options mới nhất trong ref để các callback ổn định, không gây re-fetch vòng lặp
  const optsRef = useRef(options);
  optsRef.current = options;

  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ ...options.emptyForm });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { askConfirm, confirmProps } = useConfirm();

  // ref cho form/editingId để submit luôn dùng giá trị mới nhất dù callback ổn định
  const formRef = useRef(form);
  formRef.current = form;
  const editingIdRef = useRef(editingId);
  editingIdRef.current = editingId;

  const load = useCallback(async () => {
    setItems(null);
    setError(null);
    try {
      setItems(await optsRef.current.fetchList());
    } catch (e) {
      setError(e.message || "Lỗi tải dữ liệu");
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = useCallback(() => {
    setForm({ ...optsRef.current.emptyForm });
    setEditingId(null);
    setError(null);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((item) => {
    const { toForm, emptyForm, idOf } = optsRef.current;
    setForm(toForm ? toForm(item) : { ...emptyForm, ...item });
    setEditingId(idOf ? idOf(item) : (item.id ?? item._id ?? item.name));
    setError(null);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setError(null);
  }, []);

  const setField = useCallback((name, val) => {
    setForm((f) => ({ ...f, [name]: val }));
    setError(null);
  }, []);

  const submit = useCallback(async () => {
    const { validate, onSave, messages = {}, showToast } = optsRef.current;
    if (validate) {
      const msg = validate(formRef.current);
      if (msg) { setError(msg); return; }
    }
    setSaving(true);
    setError(null);
    try {
      await onSave(formRef.current, editingIdRef.current);
      showToast?.(
        editingIdRef.current ? (messages.updated || "Đã cập nhật") : (messages.created || "Đã tạo mới"),
        "success"
      );
      setModalOpen(false);
      setError(null);
      load();
    } catch (e) {
      setError(e.message || "Lỗi lưu");
    } finally {
      setSaving(false);
    }
  }, [load]);

  const describeOf = useCallback((item) => {
    const { describe } = optsRef.current;
    if (describe) return describe(item);
    return String(item.label ?? item.name ?? item.title ?? item.id ?? "");
  }, []);

  const askRemove = useCallback((item) => {
    const { onRemove, removeTitle, messages = {}, showToast } = optsRef.current;
    askConfirm({
      title: removeTitle || "Xóa",
      message: `Xóa "${describeOf(item)}"?`,
      confirmLabel: "Xóa",
      danger: true,
      onConfirm: async () => {
        try {
          await onRemove(item);
          showToast?.(messages.removed || "Đã xóa", "success");
          load();
        } catch (e) {
          showToast?.(e.message || "Lỗi xóa", "error");
        }
      },
    });
  }, [askConfirm, describeOf, load]);

  const askRemoveAll = useCallback((allLabel) => {
    const { onRemoveAll, messages = {}, showToast } = optsRef.current;
    if (!onRemoveAll) return;
    askConfirm({
      title: "Xóa tất cả",
      message: `Xóa ${allLabel}? Hành động này không thể hoàn tác.`,
      confirmLabel: "Xóa tất cả",
      danger: true,
      onConfirm: async () => {
        try {
          const res = await onRemoveAll();
          const n = res && typeof res.deleted === "number" ? res.deleted : null;
          showToast?.(n !== null ? `Đã xóa ${n}` : (messages.removedAll || "Đã xóa tất cả"), "success");
          load();
        } catch (e) {
          showToast?.(e.message || "Lỗi xóa", "error");
        }
      },
    });
  }, [askConfirm, load]);

  return {
    items, error, load,
    form, setField, editingId, saving, modalOpen,
    openCreate, openEdit, closeModal, submit,
    confirmProps, askRemove, askRemoveAll,
  };
}
