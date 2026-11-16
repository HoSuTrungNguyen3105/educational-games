import { useState } from "react";
import { Trash2 } from "lucide-react";
import { ConfirmModal } from "../overlay/ConfirmModal.jsx";

/**
 * BulkDeleteBar — thanh "chọn nhiều để xoá" DÙNG CHUNG cho các trang quản
 * lý dashboard, đi cặp với hook useBulkSelection (src/lib/hooks.js).
 * Chỉ hiện khi đã chọn ít nhất 1 mục. Cả hai thao tác xoá đều qua
 * ConfirmModal dùng chung (không dùng window.confirm).
 *
 * <BulkDeleteBar
 *   count={sel.count}
 *   itemLabel="trò chơi"
 *   deleting={deleting}
 *   onDeleteSelected={...}          // bắt buộc
 *   onDeleteAll={...}               // tùy chọn — không truyền thì ẩn nút
 *   onClear={sel.clear}
 * />
 *
 * Trang cha tự gọi API, reload danh sách, clear selection và showToast kết
 * quả trong các handler; component này chỉ lo hiển thị + xác nhận.
 */
export function BulkDeleteBar({ count, onDeleteSelected, onDeleteAll, onClear, deleting = false, itemLabel = "mục" }) {
  const [confirmKind, setConfirmKind] = useState(null); // 'selected' | 'all'

  if (!count) return null;

  const btnBase = "inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50";

  return (
    <div className="note-card p-2.5 bg-amber-50 border-amber-200 flex flex-wrap items-center gap-2 text-sm">
      <span className="font-semibold text-amber-800">Đã chọn {count} {itemLabel}</span>
      <button
        type="button"
        disabled={deleting}
        onClick={() => setConfirmKind("selected")}
        className={`${btnBase} bg-white text-red-600 border-red-200 hover:bg-red-50`}
      >
        <Trash2 className="w-3.5 h-3.5" /> {deleting ? "Đang xóa..." : "Xóa đã chọn"}
      </button>
      {onDeleteAll && (
        <button
          type="button"
          disabled={deleting}
          onClick={() => setConfirmKind("all")}
          className={`${btnBase} bg-ticket text-white border-ticket hover:bg-ticket/90`}
        >
          <Trash2 className="w-3.5 h-3.5" /> Xóa tất cả
        </button>
      )}
      <button
        type="button"
        disabled={deleting}
        onClick={onClear}
        className={`${btnBase} bg-white text-ink/70 border-ink/15`}
      >
        Bỏ chọn
      </button>

      <ConfirmModal
        open={confirmKind === "selected"}
        title={`Xóa ${count} ${itemLabel} đã chọn`}
        message={`Xóa ${count} ${itemLabel} đã chọn? Thao tác này không thể hoàn tác.`}
        confirmLabel="Xóa đã chọn"
        onConfirm={() => { setConfirmKind(null); onDeleteSelected?.(); }}
        onClose={() => setConfirmKind(null)}
      />
      <ConfirmModal
        open={confirmKind === "all"}
        title={`Xóa tất cả ${itemLabel}`}
        message={`Xóa TOÀN BỘ ${itemLabel} trong danh sách? Thao tác này không thể hoàn tác.`}
        confirmLabel="Xóa tất cả"
        onConfirm={() => { setConfirmKind(null); onDeleteAll?.(); }}
        onClose={() => setConfirmKind(null)}
      />
    </div>
  );
}
