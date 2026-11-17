import { useCallback, useEffect, useState } from "react";
import { LayoutGrid, List } from "lucide-react";

// Toàn bộ khu admin dùng CHUNG một chế độ xem (lưới/bảng) với mọi trang:
// một key duy nhất — đổi ở trang này là áp dụng cho mọi trang admin khác.
// Trước đây mỗi trang một key `edu_view_mode_<trang>`; các key cũ chỉ còn
// được đọc đúng một lần để di trú (ưu tiên key của chính trang đang mở),
// sau đó bị xoá sạch khỏi localStorage.
const VIEW_MODE_KEY = "edu_view_mode_admin";
const LEGACY_PREFIX = "edu_view_mode_";
// storage event không bắn trong cùng tab nên dùng event riêng để các bảng
// khác trên cùng trang (và các tab khác qua storage) cập nhật ngay.
const VIEW_MODE_EVENT = "edu-view-mode-change";
const isValidMode = (v) => v === "grid" || v === "list";

function cleanupLegacyKeys() {
  try {
    const doomed = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(LEGACY_PREFIX) && k !== VIEW_MODE_KEY) doomed.push(k);
    }
    doomed.forEach((k) => localStorage.removeItem(k));
  } catch {
    /* ignore */
  }
}

function readInitialMode(legacyKey, initial) {
  try {
    const saved = localStorage.getItem(VIEW_MODE_KEY);
    if (isValidMode(saved)) return saved;
    // Di trú: ưu tiên key cũ của chính trang này, rồi tới bất kỳ key cũ nào.
    // Ghi ngay vào key chung + dọn key cũ để các component mount cùng lượt
    // (vd hai bảng trên một trang) đọc được cùng một giá trị đã di trú.
    let migrated = null;
    if (legacyKey) {
      const own = localStorage.getItem(`${LEGACY_PREFIX}${legacyKey}`);
      if (isValidMode(own)) migrated = own;
    }
    if (!migrated) {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(LEGACY_PREFIX) && k !== VIEW_MODE_KEY) {
          const v = localStorage.getItem(k);
          if (isValidMode(v)) {
            migrated = v;
            break;
          }
        }
      }
    }
    if (migrated) {
      localStorage.setItem(VIEW_MODE_KEY, migrated);
      cleanupLegacyKeys();
      return migrated;
    }
  } catch {
    /* ignore */
  }
  return initial;
}

// Tham số `key` giữ nguyên chữ ký cho các trang đang gọi (chỉ còn dùng làm
// gợi ý di trú key cũ của trang đó) — giá trị lưu luôn là key dùng chung.
export function useViewMode(key, initial = "grid") {
  const [mode, setModeState] = useState(() => readInitialMode(key, initial));

  // Ghi key chung mỗi khi mode đổi + dọn nốt key cũ nếu còn sót.
  useEffect(() => {
    try {
      localStorage.setItem(VIEW_MODE_KEY, mode);
    } catch {
      /* ignore */
    }
    cleanupLegacyKeys();
  }, [mode]);

  const setMode = useCallback((next) => {
    if (!isValidMode(next)) return;
    setModeState(next);
    try {
      localStorage.setItem(VIEW_MODE_KEY, next);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new CustomEvent(VIEW_MODE_EVENT, { detail: next }));
  }, []);

  // Đồng bộ giữa các tab (storage) và trong cùng tab (custom event).
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === VIEW_MODE_KEY && isValidMode(e.newValue)) setModeState(e.newValue);
    };
    const onSameTab = (e) => {
      if (isValidMode(e.detail)) setModeState(e.detail);
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(VIEW_MODE_EVENT, onSameTab);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(VIEW_MODE_EVENT, onSameTab);
    };
  }, []);

  return [mode, setMode];
}

// Mobile luôn hiện card; desktop ẩn card khi mode === "list".
// Grid: 1 cột trên mobile, 2 cột desktop, 3 cột màn hình rất rộng.
export const cardGridClass = (mode) => `grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-2 ${mode === "grid" ? "" : "md:hidden"}`;

// Mobile luôn ẩn bảng; desktop chỉ hiện bảng khi mode === "list".
export const tableWrapClass = (mode) => `edu-table-wrap ${mode === "list" ? "hidden md:block" : "hidden"}`;

export function ViewToggle({ mode, onChange, className = "hidden md:inline-flex" }) {
  return (
    <div className={`edu-view-toggle ${className}`}>
      <button type="button" onClick={() => onChange("grid")} title="Dạng thẻ"
        className={mode === "grid" ? "is-active" : ""}>
        <LayoutGrid />
        <span>Lưới</span>
      </button>
      <button type="button" onClick={() => onChange("list")} title="Dạng bảng"
        className={mode === "list" ? "is-active" : ""}>
        <List />
        <span>Bảng</span>
      </button>
    </div>
  );
}
