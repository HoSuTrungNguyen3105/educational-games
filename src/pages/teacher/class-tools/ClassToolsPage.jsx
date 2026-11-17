import { useState } from "react";
import { Dices } from "lucide-react";
import { useClassRoster } from "../../../hooks/useClassRoster.js";
import NamePickerTab from "./NamePickerTab.jsx";
import GroupsTab from "./GroupsTab.jsx";
import ScoreTab from "./ScoreTab.jsx";

/**
 * ClassToolsPage — trang "Công cụ lớp học" ở /dashboard/class-tools
 * (menu nhóm Quản lý, ngay sau "Lớp học").
 *
 * Bộ công cụ giáo viên dùng ngay trên lớp với danh sách học sinh thật của
 * lớp mình: danh sách lớp (roster) dùng CHUNG cho mọi tab, lưu ở
 * localStorage máy giáo viên qua hook useClassRoster.
 *
 * Đợt 1: tab Gọi tên (vòng quay + bốc thăm + xúc xắc / đồng xu / bốc số).
 * Đợt 2: tab Chia nhóm (chia cân bằng nam/nữ + gán vai trò) và tab
 * Bảng điểm (đội thi đua + bảng vàng cá nhân, xuất PDF qua in).
 * Đợt 3 sẽ thêm Chỗ ngồi, Nề nếp — khung tab chỉ liệt kê tab đang
 * hoạt động thật, không dựng tab rỗng.
 */

const TABS = [
  { key: "picker", label: "Gọi tên" },
  { key: "groups", label: "Chia nhóm" },
  { key: "score", label: "Bảng điểm" },
];

export default function ClassToolsPage({ showToast }) {
  const roster = useClassRoster();
  const [tab, setTab] = useState("picker");

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
        {TABS.map((t) => (
          <button key={t.key} type="button" onClick={() => setTab(t.key)}
            className={`text-sm font-display font-semibold rounded-xl px-4 py-2 transition ${tab === t.key ? "bg-white text-ink shadow-sm" : "text-ink/50 hover:text-ink"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "picker" && <NamePickerTab roster={roster} showToast={showToast} />}
      {tab === "groups" && <GroupsTab roster={roster} showToast={showToast} />}
      {tab === "score" && <ScoreTab roster={roster} showToast={showToast} />}
    </div>
  );
}
