import { useState } from "react";
import { rangeForPage } from "../lib/rangePagination.js";

/**
 * useRangePager — state phân trang PHÍA SERVER dùng chung cho các trang
 * quản lý dashboard, ghép với component RangePagination (cụm "x–y / tổng"
 * có ô nhập khoảng — mẫu chuẩn là trang /dashboard/permissions).
 *
 * const pager = useRangePager(totalItems, 10);
 * // pager.page, pager.setPage, pager.range ({ from, to } để gọi API),
 * // pager.props — truyền thẳng vào RangePagination hoặc prop
 * // serverPager của ManagementTable / rangePager của GridToolbar.
 *
 * - `totalItems`: tổng số bản ghi SAU lọc do server trả (pagination.total).
 * - Đổi trang qua nút ‹ › hoặc nhập khoảng vào ô input: nhập "from" nào
 *   thì nhảy tới trang chứa bản ghi đó (đúng hành vi trang Permissions).
 * - Trang hiện tại được kẹp vào [1, tổng số trang] khi tính props.
 */
export function useRangePager(totalItems, pageSize = 10) {
  const [page, setPage] = useState(1);
  const total = Math.max(0, Number(totalItems) || 0);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const range = rangeForPage(safePage, pageSize);

  const props = {
    fromRecord: total === 0 ? 1 : range.from,
    toRecord: Math.min(range.to, total),
    totalItems: total,
    onRangeChange: (from) =>
      setPage(Math.max(1, Math.min(totalPages, Math.ceil((Number(from) || 1) / pageSize)))),
    onPrevPage: () => setPage((p) => Math.max(1, p - 1)),
    onNextPage: () => setPage((p) => Math.min(totalPages, p + 1)),
    disabled: total === 0,
  };

  return { page: safePage, setPage, totalPages, range, props };
}
