import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, CircleDashed, Gamepad2, Users } from "lucide-react";
import { ErrorState, Loader, Modal } from "../../../components/ui";
import { lessonService } from "../../../services/lessonService.js";

// LessonProgressModal — tiến độ học sinh theo bài cho giáo viên (đợt nâng
// cấp AI Studio, mục (e) trong phân tích khoảng thiếu). Mở từ danh sách
// bài học; dữ liệu từ GET /api/lessons/:id/progress (chỉ chủ sở hữu/admin
// đọc được — server kiểm tra qua loadOwnedLesson). Collection
// lessonProgress vốn đã ghi từ đợt 3 (check/complete/played) nhưng trước
// đợt này giáo viên không có màn hình nào để xem.

function fmtDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  } catch { return iso; }
}

export default function LessonProgressModal({ lesson, onClose }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const load = useCallback(async () => {
    try {
      const res = await lessonService.getStudentProgress(lesson.id);
      setData(res);
      setError("");
    } catch (e) {
      setError(e?.message || "Không tải được tiến độ học sinh");
    }
  }, [lesson.id]);

  // Nạp dữ liệu khi mở modal — pattern chuẩn của codebase (xem
  // StudioLessons.jsx); tắt rule cho effect nạp dữ liệu này.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load, reloadKey]);

  const students = data?.students || [];

  return (
    <Modal onClose={onClose} wide>
      <h3 className="font-display text-lg text-ink mb-1">Tiến độ học sinh</h3>
      <p className="text-sm text-[#8A7C63] mb-4 truncate">
        Bài học: <b className="text-ink">{lesson.title || "(Chưa có tên)"}</b>
      </p>

      {error ? (
        <ErrorState subtitle={error} onRetry={() => setReloadKey((k) => k + 1)} />
      ) : !data ? (
        <div className="py-10 flex justify-center"><Loader label="Đang tải tiến độ..." /></div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold bg-[#EAF1FE] text-[#1D4ED8]">
              <Users className="w-4 h-4" /> {data.studentCount} học sinh đã học
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold bg-[#DBF1EE] text-[#0C5B52]">
              <CheckCircle2 className="w-4 h-4" /> {data.completedCount} đã hoàn thành
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold bg-[#EFE6D2] text-[#5B4A12]">
              {data.totalQuestions} câu hỏi{data.totalGames > 0 ? ` · ${data.totalGames} trò chơi` : ""}
            </span>
          </div>

          {students.length === 0 ? (
            <div className="text-center py-10">
              <CircleDashed className="w-10 h-10 mx-auto text-[#C9BBA0] mb-2" />
              <p className="text-sm text-[#8A7C63]">
                Chưa có học sinh nào học bài này.
                {lesson.status !== "published" && " Bài đang là bản nháp — xuất bản để học sinh nhìn thấy bài."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[55vh] overflow-y-auto rounded-[10px] border border-[#E7D9BE]">
              <table className="w-full text-[13.5px] min-w-[560px]">
                <thead>
                  <tr className="bg-[#FFFBF2] text-left text-[#8A7C63]">
                    <th className="px-3 py-2 font-semibold">Học sinh</th>
                    <th className="px-3 py-2 font-semibold">Đúng</th>
                    <th className="px-3 py-2 font-semibold">Lượt thử</th>
                    <th className="px-3 py-2 font-semibold">Đã chơi game</th>
                    <th className="px-3 py-2 font-semibold">Trạng thái</th>
                    <th className="px-3 py-2 font-semibold">Học gần nhất</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.userId} className="border-t border-[#E7D9BE]/70">
                      <td className="px-3 py-2.5">
                        <span className="block font-semibold text-ink">
                          {s.student?.name || s.student?.username || s.userId}
                        </span>
                        {s.student?.username && s.student?.name && (
                          <span className="block text-[12px] text-[#8A7C63]">@{s.student.username}</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-ink">
                        {data.totalQuestions > 0 ? `${s.correctCount}/${data.totalQuestions} câu` : "—"}
                      </td>
                      <td className="px-3 py-2.5 text-ink">{s.attempts}</td>
                      <td className="px-3 py-2.5 text-ink">
                        {data.totalGames > 0 ? (
                          <span className="inline-flex items-center gap-1">
                            <Gamepad2 className="w-4 h-4 text-[#8A7C63]" /> {s.playedGameCount}/{data.totalGames}
                          </span>
                        ) : "—"}
                      </td>
                      <td className="px-3 py-2.5">
                        {s.completed ? (
                          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold bg-[#DBF1EE] text-[#0C5B52]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Đã hoàn thành
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold bg-[#EAF1FE] text-[#1D4ED8]">
                            Đang học
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-[#5B4A12]">{fmtDate(s.updatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <button type="button" onClick={onClose}
              className="px-4 py-2 rounded-full text-sm font-semibold bg-ink text-paper">Đóng</button>
          </div>
        </>
      )}
    </Modal>
  );
}
