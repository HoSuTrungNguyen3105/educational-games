import { Plus } from "lucide-react";
import { SearchInput } from "../forms/SearchInput.jsx";
import { ViewToggle } from "./ViewToggle.jsx";
import { GridPager } from "./GridPager.jsx";
import RangePagination from "../../RangePagination.jsx";

/**
 * GridToolbar — thanh công cụ dùng chung phía trên danh sách quản lý:
 * ô tìm kiếm · cặp nút chuyển Lưới/Bảng · nút "Thêm" xanh lá · phân trang.
 *
 * Dành cho các trang không đi qua ManagementTable (ManagementTable đã tự
 * lắp các mảnh này trong header của nó). Mọi phần đều tùy chọn — chỉ render
 * khi được truyền prop tương ứng.
 *
 * - `search`: { value, onChange, placeholder }
 * - `mode` + `onModeChange`: từ useViewMode (data/ViewToggle.jsx)
 * - `onAdd` + `addLabel`: nút Thêm
 * - `pager`: đầu ra của usePagedList (hooks/usePagedList.js)
 * - `rangePager`: { fromRecord, toRecord, totalItems, onRangeChange,
 *   onPrevPage, onNextPage, disabled } — chế độ PHÂN TRANG PHÍA SERVER:
 *   hiện cụm RangePagination dùng chung (có ô nhập khoảng, mẫu trang
 *   /dashboard/permissions) thay cho GridPager của `pager`. Truyền
 *   rangePager thì `pager` bị bỏ qua.
 * - `children`: node phụ chèn trước cụm phân trang (lọc, sắp xếp…)
 */
export function GridToolbar({ search, mode, onModeChange, onAdd, addLabel = "Thêm", pager, rangePager, children }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {search && (
        <SearchInput
          value={search.value}
          onChange={search.onChange}
          placeholder={search.placeholder || "Tìm kiếm"}
          className="w-full sm:w-64"
        />
      )}
      <div className="flex items-center gap-2 flex-wrap ml-auto">
        {children}
        {mode !== undefined && onModeChange && <ViewToggle mode={mode} onChange={onModeChange} className="inline-flex" />}
        {onAdd && (
          <button type="button" className="edu-add-btn" onClick={onAdd}>
            <Plus />
            <span>{addLabel}</span>
          </button>
        )}
        {rangePager ? (
          <RangePagination
            fromRecord={rangePager.fromRecord}
            toRecord={rangePager.toRecord}
            totalItems={rangePager.totalItems}
            onRangeChange={rangePager.onRangeChange}
            onPrevPage={rangePager.onPrevPage}
            onNextPage={rangePager.onNextPage}
            disabled={rangePager.disabled}
          />
        ) : pager && pager.total > 0 && (
          <GridPager
            from={pager.from} to={pager.to} total={pager.total}
            canPrev={pager.canPrev} canNext={pager.canNext}
            onPrev={pager.prev} onNext={pager.next}
          />
        )}
      </div>
    </div>
  );
}
