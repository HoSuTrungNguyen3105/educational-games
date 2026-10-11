// lib/useOutfitDraft.js
//
// State tạm cho trang phục đang thử.
//
// Tách riêng khỏi component để không vi phạm quy tắc "một file chỉ export
// component" (react-refresh/only-export-components) — sửa PetPreview sẽ không
// làm reload nóng toàn bộ trang Kho đồ.
//
// Bản nháp KHÔNG phải dữ liệu chính thức: chỉ `equip()` mới gửi lên server.

import { useState } from "react";

export function useOutfitDraft(initial) {
  const [draft, setDraft] = useState(initial ?? null);

  return {
    draft,
    setDraft,
    /** setSlot("hat", "hat_crown_01") để mặc, setSlot("hat", null) để tháo. */
    setSlot: (slot, entry) =>
      setDraft((prev) => ({ ...(prev ?? {}), [slot]: entry })),
    clear: () => setDraft(null),
  };
}