import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * GridPager — cụm phân trang "x–y / tổng" + nút trước/sau, dùng chung cho
 * các trang quản lý. Nhận đầu ra của usePagedList (src/hooks/usePagedList.js)
 * hoặc các prop rời tương đương.
 */
export function GridPager({ from, to, total, canPrev, canNext, onPrev, onNext }) {
  return (
    <span className="edu-pager">
      <span>{from}–{to} / {total}</span>
      <button type="button" className="edu-pager-btn" onClick={onPrev} disabled={!canPrev} title="Trang trước">
        <ChevronLeft />
      </button>
      <button type="button" className="edu-pager-btn" onClick={onNext} disabled={!canNext} title="Trang sau">
        <ChevronRight />
      </button>
    </span>
  );
}
