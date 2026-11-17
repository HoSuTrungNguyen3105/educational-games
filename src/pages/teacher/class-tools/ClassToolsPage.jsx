import { Dices } from "lucide-react";
import { useClassRoster } from "../../../hooks/useClassRoster.js";
import NamePickerTab from "./NamePickerTab.jsx";

/**
 * ClassToolsPage — trang "Công cụ lớp học" ở /dashboard/class-tools
 * (menu nhóm Quản lý, ngay sau "Lớp học").
 *
 * Bộ công cụ giáo viên dùng ngay trên lớp với danh sách học sinh thật của
 * lớp mình: danh sách lớp (roster) dùng CHUNG cho mọi tab, lưu ở
 * localStorage máy giáo viên qua hook useClassRoster.
 *
 * Đợt 1: tab Gọi tên (vòng quay + bốc thăm + xúc xắc / đồng xu / bốc số).
 * Các đợt sau thêm tab Chia nhóm, Bảng điểm (đợt 2) và Chỗ ngồi, Nề nếp
 * (đợt 3) — khung tab dưới đây chỉ liệt kê tab đang hoạt động thật,
 * không dựng tab rỗng.
 */
export default function ClassToolsPage({ showToast }) {
  const roster = useClassRoster();

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="font-display font-bold text-2xl text-ink flex items-center gap-2.5">
          <span className="w-10 h-10 grid place-items-center rounded-2xl bg-emerald-600 text-white">
            <Dices className="w-5 h-5" />
          </span>
          Công cụ lớp học
        </h1>
        <p className="text-sm text-ink/55 mt-1.5 max-w-2xl">
          Gọi tên ngẫu nhiên, cộng điểm thi đua và các tiện ích dùng ngay trên lớp.
          Danh sách lớp được lưu trên máy này — nạp một lần bằng cách dán danh sách hoặc nhập file Excel,
          các buổi sau mở lên dùng tiếp.
        </p>
      </header>

      <div className="inline-flex self-start rounded-2xl bg-ink/5 p-1">
        <span className="text-sm font-display font-semibold rounded-xl px-4 py-2 bg-white text-ink shadow-sm">
          Gọi tên
        </span>
      </div>

      <NamePickerTab roster={roster} showToast={showToast} />
    </div>
  );
}
