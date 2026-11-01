import { useSiteConfig } from "../hooks/useSiteConfig.js";

/**
 * MaintenanceBanner — dòng thông báo bảo trì admin bật ở trang Cài đặt
 * (Cấu hình chung → Chế độ bảo trì). Nội dung lấy từ /api/public-config,
 * không phải chữ hardcode trong mã nguồn.
 *
 * Banner chỉ THÔNG BÁO, không chặn app: giáo viên vẫn cần vào sửa bài, học
 * sinh vẫn chơi được các game đã tải. Muốn chặn thật thì phải đổi ở server.
 */
export default function MaintenanceBanner() {
  const { maintenance } = useSiteConfig();
  if (!maintenance.enabled) return null;

  const until = String(maintenance.until || "").trim();
  // "2026-11-01T20:00" → "20:00 01/11" (display gọn, vẫn đủ nghĩa).
  let untilLabel = until;
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(until)) {
    const [, y, m, d, hh, mm] = until.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    untilLabel = `${hh}:${mm} ${d}/${m}/${y}`;
  }

  return (
    <div
      role="status"
      className="w-full border-b"
      style={{
        background: "var(--card)",
        borderColor: "var(--line)",
        color: "var(--text-dark)",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-start gap-2 px-4 py-2 text-sm">
        <span
          aria-hidden="true"
          className="mt-[3px] h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ background: "var(--gold)" }}
        />
        <p className="min-w-0 flex-1 leading-snug">
          <span className="font-semibold">Đang bảo trì. </span>
          {maintenance.message || "Hệ thống đang được cập nhật, một số tính năng có thể tạm gián đoạn."}
          {untilLabel ? <span className="font-medium"> · Dự kiến xong: {untilLabel}.</span> : null}
        </p>
      </div>
    </div>
  );
}
