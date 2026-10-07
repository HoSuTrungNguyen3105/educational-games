import { useCallback, useRef, useState } from "react";

/**
 * useConfirm — quản lý hộp thoại xác nhận (dùng với <ConfirmModal/> trong components/ui.jsx),
 * thay thế window.confirm() để đồng nhất giao diện.
 *
 * const { askConfirm, confirmProps } = useConfirm();
 *
 * askConfirm({
 *   title: "Xóa lớp học",
 *   message: 'Xóa lớp "10A1"?',
 *   confirmLabel: "Xóa",   // mặc định "Xóa"
 *   danger: true,          // mặc định true
 *   onConfirm: () => doDelete(id),
 * });
 *
 * return (...
 *   <ConfirmModal {...confirmProps} />
 * );
 */
export function useConfirm() {
  const [state, setState] = useState({ open: false });
  const onConfirmRef = useRef(null);

  const close = useCallback(() => {
    onConfirmRef.current = null;
    setState({ open: false });
  }, []);

  const askConfirm = useCallback((opts = {}) => {
    onConfirmRef.current = typeof opts.onConfirm === "function" ? opts.onConfirm : null;
    setState({
      open: true,
      title: "Xác nhận",
      message: "",
      confirmLabel: "Xóa",
      danger: true,
      ...opts,
    });
  }, []);

  const handleConfirm = useCallback(() => {
    const fn = onConfirmRef.current;
    onConfirmRef.current = null;
    setState({ open: false });
    if (fn) fn();
  }, []);

  return {
    askConfirm,
    confirmProps: {
      open: state.open,
      title: state.title,
      message: state.message,
      confirmLabel: state.confirmLabel,
      danger: state.danger,
      onConfirm: handleConfirm,
      onClose: close,
    },
  };
}
