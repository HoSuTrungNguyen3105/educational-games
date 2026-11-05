import { Plus } from "lucide-react";
import { SearchInput } from "../forms/SearchInput.jsx";
import { ViewToggle } from "./ViewToggle.jsx";
import { GridPager } from "./GridPager.jsx";

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
 * - `children`: node phụ chèn trước cụm phân trang (lọc, sắp xếp…)
 */
export function GridToolbar({ search, mode, onModeChange, onAdd, addLabel = "Thêm", pager, children }) {
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
        {pager && pager.total > 0 && (
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
