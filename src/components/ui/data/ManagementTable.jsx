import { Plus } from "lucide-react";
import { ErrorState } from "../feedback/ErrorState.jsx";
import { Loader } from "../feedback/Loader.jsx";
import { GhostButton } from "../buttons/GhostButton.jsx";
import { PrimaryButton } from "../buttons/PrimaryButton.jsx";
import { SearchInput } from "../forms/SearchInput.jsx";
import { useViewMode, ViewToggle, cardGridClass, tableWrapClass } from "./ViewToggle.jsx";
import { GridPager } from "./GridPager.jsx";
import RangePagination from "../../RangePagination.jsx";
import { usePagedList } from "../../../hooks/usePagedList.js";

/**
 * ManagementTable — khung danh sách quản lý dùng chung (bảng + thẻ).
 *
 * Ngoài hành vi gốc (renderRow/renderCard + ViewToggle), hỗ trợ thêm bộ kit
 * lưới chuẩn dashboard — tất cả đều tùy chọn, không truyền thì như cũ:
 * - `search`: { value, onChange, placeholder } → ô tìm kiếm trong header;
 *   trang tự lọc `data` theo search trước khi truyền vào.
 * - `pageSize`: số mục mỗi trang → tự phân trang (áp cho cả lưới lẫn bảng)
 *   và hiện cụm "x–y / tổng" ở header. renderRow/renderCard/renderGridCard
 *   nhận (item, chỉSốToànCục) để STT/"Thứ tự" chạy liên tục qua các trang.
 * - `renderGridCard(item, idx)`: thẻ theo anatomy GridCard — khi có, chế độ
 *   "Lưới" dùng lưới chuẩn `.edu-grid` (grid là mặc định qua useViewMode),
 *   chế độ còn lại hiện bảng; nút Thêm đổi sang nút xanh lá kiểu dashboard.
 * - `extraActions`: ReactNode tuỳ chọn hiện trong hàng nút của header (trước
 *   Import/Thêm) — cho trang gắn thêm hành động riêng, vd "Tạo bằng AI".
 * - `serverPager`: { fromRecord, toRecord, totalItems, onRangeChange,
 *   onPrevPage, onNextPage, disabled } — chế độ PHÂN TRANG PHÍA SERVER
 *   (mẫu trang /dashboard/permissions): `data` truyền vào đã là đúng một
 *   đoạn do server cắt theo ?from=&to=, bảng KHÔNG cắt trang ở client nữa
 *   mà hiện cụm RangePagination dùng chung (có ô nhập khoảng) thay cho
 *   GridPager. Không truyền → hành vi phân trang client như cũ, nguyên vẹn
 *   cho mọi trang đang dùng component này.
 */
export function ManagementTable({ title, count, data, error, onRetry, emptyLabel, headers, renderRow, renderCard, renderGridCard, viewKey, onRemoveAll, removeAllLabel, onCreate, createLabel, addLabel, onImport, importLabel, search, pageSize, extraActions, serverPager }) {
  const [mode, setMode] = useViewMode(viewKey || title || "admin-table");
  const gridMode = typeof renderGridCard === "function";
  const hasCards = gridMode || typeof renderCard === "function";
  const pager = usePagedList(data ?? [], serverPager ? 0 : (gridMode || pageSize ? (pageSize ?? 12) : 0), search?.value);

  const pageItems = serverPager ? (data ?? []) : pager.pageItems;
  const startIndex = serverPager ? Math.max(0, (serverPager.fromRecord || 1) - 1) : pager.startIndex;

  const handleSearch = search ? (v) => { search.onChange(v); pager.reset(); } : null;

  return (
    <div>
      <div className="edu-list-head">
        <h2 className="edu-list-title">{title}{count !== undefined ? ` (${count})` : ""}</h2>
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {search && (
            <SearchInput
              value={search.value}
              onChange={handleSearch}
              placeholder={search.placeholder || "Tìm kiếm"}
              className="w-full sm:w-56"
            />
          )}
          {hasCards && <ViewToggle mode={mode} onChange={setMode} />}
          {extraActions}
          {onRemoveAll && <button onClick={onRemoveAll} className="text-xs text-ticket/70 hover:text-ticket">{removeAllLabel || "Xóa tất cả"}</button>}
          {onImport && <GhostButton onClick={onImport}>{importLabel || "Import"}</GhostButton>}
          {onCreate && (gridMode ? (
            <button type="button" className="edu-add-btn" onClick={onCreate}>
              <Plus />
              <span>{addLabel || createLabel || "Thêm"}</span>
            </button>
          ) : (
            <PrimaryButton onClick={onCreate}>{createLabel || "+ Thêm mới"}</PrimaryButton>
          ))}
          {serverPager && data != null && (
            <RangePagination
              fromRecord={serverPager.fromRecord}
              toRecord={serverPager.toRecord}
              totalItems={serverPager.totalItems}
              onRangeChange={serverPager.onRangeChange}
              onPrevPage={serverPager.onPrevPage}
              onNextPage={serverPager.onNextPage}
              disabled={serverPager.disabled}
            />
          )}
          {!serverPager && (gridMode || pageSize) && data && data.length > 0 && (
            <GridPager
              from={pager.from} to={pager.to} total={pager.total}
              canPrev={pager.canPrev} canNext={pager.canNext}
              onPrev={pager.prev} onNext={pager.next}
            />
          )}
        </div>
      </div>
      {error && !data && <ErrorState subtitle={error} onRetry={onRetry} />}
      {!error && !data && <Loader label="Đang tải..." />}
      {!error && data && data.length === 0 && (
        <div className="note-card edu-empty">
          {emptyLabel || "Chưa có dữ liệu."}
        </div>
      )}
      {!error && data && data.length > 0 && (
        gridMode ? (
          mode === "grid" ? (
            <div className="edu-grid">
              {pageItems.map((item, i) => renderGridCard(item, startIndex + i))}
            </div>
          ) : (
            <div className="edu-table-wrap">
              <table>
                <thead>
                  <tr>
                    {headers.map((h, i) => <th key={i}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>{pageItems.map((item, i) => renderRow(item, startIndex + i))}</tbody>
              </table>
            </div>
          )
        ) : (
          <>
            {hasCards && (
              <div className={cardGridClass(mode)}>
                {pageItems.map((item, i) => (
                  <div key={item?.id ?? item?._id ?? (startIndex + i)} className="edu-row-card">
                    {renderCard(item, startIndex + i)}
                  </div>
                ))}
              </div>
            )}
            <div className={`${hasCards ? tableWrapClass(mode) : "edu-table-wrap"}`}>
              <table>
                <thead>
                  <tr>
                    {headers.map((h, i) => <th key={i}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>{pageItems.map((item, i) => renderRow(item, startIndex + i))}</tbody>
              </table>
            </div>
          </>
        )
      )}
    </div>
  );
}
