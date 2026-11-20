import { useState } from "react";
import { Modal } from "../../../components/ui";

// FindReplaceDialog — hộp Tìm & thay thế NỘI DUNG ở chế độ Normal
// (Giai đoạn 1 §4). Chỉ tìm trong phần chữ của tài liệu (đoạn văn, tiêu
// đề, mục danh sách, ô bảng) qua wordFindReplace.js — không đụng cú
// pháp JSON. `onCount(query)` đếm số chỗ khớp trong bản nháp hiện tại;
// `onReplace(query, replacement, all)` thực thi và trả số chỗ đã thay.
// Ở chế độ Beautiful, nút Tìm & thay thế mở panel có sẵn của
// CodeMirror nên hộp này không được dùng.

export default function FindReplaceDialog({ open, onClose, onCount, onReplace }) {
  const [query, setQuery] = useState("");
  const [replacement, setReplacement] = useState("");
  const [result, setResult] = useState("");
  if (!open) return null;

  const count = query ? onCount(query) : 0;

  const runReplace = (all) => {
    const n = onReplace(query, replacement, all);
    setResult(n > 0
      ? `Đã thay ${n} chỗ.`
      : "Không tìm thấy chỗ nào khớp để thay.");
  };

  return (
    <Modal onClose={onClose}>
      <h3 className="font-display text-xl text-ink mb-1">Tìm và thay thế</h3>
      <p className="text-sm font-body text-ink/60 mb-4">
        Tìm trong nội dung bài (đoạn văn, tiêu đề, danh sách, bảng) — không tìm trong mã JSON.
        Phân biệt chữ hoa/thường.
      </p>
      <label className="docstudio-label" htmlFor="ds-find-query">Tìm</label>
      <input id="ds-find-query" className="docstudio-input" value={query} autoFocus
        onChange={(e) => { setQuery(e.target.value); setResult(""); }}
        placeholder="Nhập chữ cần tìm…" />
      <label className="docstudio-label" htmlFor="ds-find-replacement">Thay bằng</label>
      <input id="ds-find-replacement" className="docstudio-input" value={replacement}
        onChange={(e) => setReplacement(e.target.value)}
        placeholder="Nhập chữ thay thế…" />
      <p className="text-sm font-body text-ink/60 mt-3" role="status">
        {query
          ? (count ? `Tìm thấy ${count} chỗ khớp.` : "Không tìm thấy chỗ nào khớp.")
          : "Nhập chữ cần tìm để xem số chỗ khớp."}
        {result && <> {result}</>}
      </p>
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <button type="button" onClick={onClose}
          className="px-4 py-2 rounded-full text-sm font-semibold border border-ink/15 bg-white text-ink">
          Đóng
        </button>
        <button type="button" disabled={!count} onClick={() => runReplace(false)}
          className="px-4 py-2 rounded-full text-sm font-semibold border border-ink/15 bg-white text-ink disabled:opacity-40">
          Thay thế một chỗ
        </button>
        <button type="button" disabled={!count} onClick={() => runReplace(true)}
          className="px-4 py-2 rounded-full text-sm font-semibold bg-ink text-paper disabled:opacity-40">
          Thay thế tất cả
        </button>
      </div>
    </Modal>
  );
}
