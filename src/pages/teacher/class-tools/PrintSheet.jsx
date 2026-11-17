import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { TEAM_COLOR_BY_ID, GENDER_LABEL, levelForPoints } from "./shared.js";
import "./print.css";

/**
 * PrintSheet — vùng in của tab Bảng điểm ("Xuất PDF" = hộp thoại in của
 * trình duyệt, chọn "Lưu thành PDF"), theo tiền lệ phiếu bài tập
 * (AssignmentWorksheet): render qua portal ra body, CSS @media print ẩn
 * toàn bộ app và chỉ in vùng này. Khác phiếu bài tập ở chỗ CSS được
 * scope bằng class `ctp-printing` trên body (gắn trong lúc in, gỡ ngay
 * sau) để không ảnh hưởng thao tác in ở trang khác.
 *
 * job: { kind: "teams", teams } | { kind: "honor", rows }
 * rows của bảng vàng: [{ student, rank }] đã sắp xếp sẵn.
 */
export default function PrintSheet({ job, className, onDone }) {
  // Ghim onDone vào ref để effect chỉ chạy đúng 1 lần cho mỗi job in
  // (không gọi lại window.print nếu component render lại giữa chừng).
  const doneRef = useRef(onDone);
  useEffect(() => { doneRef.current = onDone; });

  useEffect(() => {
    if (!job) return undefined;
    document.body.classList.add("ctp-printing");
    const timer = setTimeout(() => window.print(), 80);
    const done = () => doneRef.current?.();
    window.addEventListener("afterprint", done);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("afterprint", done);
      document.body.classList.remove("ctp-printing");
    };
  }, [job]);

  if (!job) return null;

  const now = new Date();
  const dateText = `Ngày ${now.getDate()} tháng ${now.getMonth() + 1} năm ${now.getFullYear()}`;
  const classLabel = className?.trim() || "(chưa đặt tên)";

  return createPortal(
    <div className="ctp-root" aria-hidden="true">
      <div className="ctp-sheet">
        {job.kind === "teams" ? (
          <>
            <h1 className="ctp-title">Bảng điểm thi đua — Lớp {classLabel}</h1>
            <p className="ctp-date">{dateText}</p>
            {job.teams.length === 0 ? (
              <p className="ctp-empty">Chưa có đội thi đua nào.</p>
            ) : (
              <div className="ctp-team-grid">
                {job.teams.map((t) => {
                  const color = TEAM_COLOR_BY_ID[t.colorId];
                  return (
                    <div key={t.id} className="ctp-team" style={{ borderColor: color?.border, background: color?.bg }}>
                      <p className="ctp-team-name">{t.name}</p>
                      <p className="ctp-team-points">{t.points}</p>
                      <p className="ctp-team-unit">điểm</p>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <>
            <h1 className="ctp-title">Bảng vàng cá nhân — Lớp {classLabel}</h1>
            <p className="ctp-date">{dateText}</p>
            {job.rows.length === 0 ? (
              <p className="ctp-empty">Lớp chưa có học sinh nào.</p>
            ) : (
              <table className="ctp-table">
                <thead>
                  <tr>
                    <th className="ctp-num" style={{ width: 56 }}>Hạng</th>
                    <th>Họ và tên</th>
                    <th style={{ width: 90 }}>Giới tính</th>
                    <th style={{ width: 110 }}>Cấp độ</th>
                    <th className="ctp-num" style={{ width: 80 }}>Điểm</th>
                  </tr>
                </thead>
                <tbody>
                  {job.rows.map(({ student, rank }) => (
                    <tr key={student.id}>
                      <td className="ctp-num">{rank}</td>
                      <td>{student.name}{student.star ? " ★" : ""}</td>
                      <td>{student.gender ? GENDER_LABEL[student.gender] : ""}</td>
                      <td>{levelForPoints(student.points).label} ({levelForPoints(student.points).range} điểm)</td>
                      <td className="ctp-num"><b>{student.points}</b></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
