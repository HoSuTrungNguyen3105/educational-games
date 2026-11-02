// Harness kiểm thử RangePagination ngoài trình duyệt thật (không cần dev server).
// Giả lập PermissionManagement: onRangeChange(from) → suy ra page → "gọi API".
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import RangePagination from '../src/components/RangePagination.jsx';

const PER_PAGE = 10;
const TOTAL = 100;

window.__calls = [];
window.__api = [];

function Harness() {
  const [page, setPage] = useState(1);

  // Giống hệt PermissionManagement.jsx / RoleListManagement.jsx
  const changeRange = (from, to) => {
    window.__calls.push([from, to]);                 // đúng 2 số component gửi lên
    const p = Math.max(1, Math.min(Math.ceil(TOTAL / PER_PAGE), Math.ceil((Number(from) || 1) / PER_PAGE)));
    setPage(p);
    window.__api.push({ page: p, perPage: PER_PAGE, to }); // == load() gọi GET /api/...?page=p
  };
  const prevPage = () => setPage((p) => Math.max(1, p - 1));
  const nextPage = () => setPage((p) => Math.min(Math.ceil(TOTAL / PER_PAGE), p + 1));

  const fromRecord = (page - 1) * PER_PAGE + 1;
  const toRecord = Math.min(page * PER_PAGE, TOTAL);

  return (
    <div>
      <p id="shown">{fromRecord}-{toRecord} / {TOTAL}</p>
      <RangePagination
        fromRecord={fromRecord}
        toRecord={toRecord}
        totalItems={TOTAL}
        onRangeChange={changeRange}
        onPrevPage={prevPage}
        onNextPage={nextPage}
      />
    </div>
  );
}

createRoot(document.getElementById('root')).render(<Harness />);
window.__ready = true;
