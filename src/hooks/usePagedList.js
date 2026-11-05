import { useMemo, useState } from "react";

/**
 * usePagedList — phân trang phía client dùng chung cho các trang quản lý
 * (khu dashboard): cắt danh sách đã lọc thành từng trang và cung cấp
 * thông tin cho cụm phân trang kiểu "x–y / tổng" (GridPager).
 *
 * const pager = usePagedList(filteredItems, 12, searchQuery);
 * // pager.pageItems, pager.from, pager.to, pager.total,
 * // pager.canPrev, pager.canNext, pager.prev(), pager.next(), pager.reset()
 *
 * - `pageSize <= 0` hoặc bỏ trống: không phân trang, trả toàn bộ danh sách.
 * - `resetKey`: khi thay đổi (thường là ô tìm kiếm) tự về trang 1.
 * - Trang hiện tại tự kẹp vào khoảng hợp lệ khi danh sách co lại.
 */
export function usePagedList(items, pageSize = 12, resetKey) {
  const list = items ?? [];
  const [page, setPage] = useState(1);

  // resetKey đổi (vd gõ tìm kiếm) → về trang 1, chỉnh ngay trong render
  // theo pattern React khuyến nghị thay cho useEffect.
  const [prevResetKey, setPrevResetKey] = useState(resetKey);
  if (prevResetKey !== resetKey) {
    setPrevResetKey(resetKey);
    setPage(1);
  }

  const total = list.length;
  const size = pageSize > 0 ? pageSize : Math.max(total, 1);
  const pageCount = Math.max(1, Math.ceil(total / size));
  const safePage = Math.min(page, pageCount);
  const startIndex = (safePage - 1) * size;

  const pageItems = useMemo(
    () => list.slice(startIndex, startIndex + size),
    // list do trang memo hoá (đã lọc) nên identity ổn định theo dữ liệu thật
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, startIndex, size]
  );

  return {
    page: safePage,
    setPage,
    reset: () => setPage(1),
    pageCount,
    total,
    pageItems,
    startIndex,
    from: total === 0 ? 0 : startIndex + 1,
    to: startIndex + pageItems.length,
    canPrev: safePage > 1,
    canNext: safePage < pageCount,
    prev: () => setPage((p) => Math.max(1, p - 1)),
    next: () => setPage((p) => Math.min(pageCount, p + 1)),
  };
}
