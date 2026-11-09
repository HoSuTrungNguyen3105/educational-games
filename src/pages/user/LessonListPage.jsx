import { useEffect, useMemo, useState } from "react";
import { BookOpen, Check, Clock, FileText, Search } from "lucide-react";
import { ErrorState, Loader, PrimaryButton } from "../../components/ui";
import { lessonService } from "../../services/lessonService.js";
import { navigate } from "../../lib/router.js";

// Danh sách BÀI HỌC (EduPlay AI Studio) phía học sinh — route /lessons.
// Chỉ bài đã xuất bản (API /lessons/published), kèm trạng thái tiến độ
// của chính học sinh từ /lessons/progress/mine (một request cho cả
// danh sách): Chưa học / Đang học (đúng X/Y câu) / Đã hoàn thành.
export default function LessonListPage({ userAuth, onBack }) {
  const [lessons, setLessons] = useState(null);
  const [progressByLesson, setProgressByLesson] = useState({});
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");

  // Nạp dữ liệu khi mở trang — pattern chuẩn của codebase (như
  // StudioLessons/ImageLibrary); tắt rule set-state-in-effect cho dòng này.
  useEffect(() => {
    if (!userAuth?.user) return undefined;
    let alive = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLessons(null);
    setError("");
    (async () => {
      try {
        const res = await lessonService.listPublished({ perPage: 100 });
        if (!alive) return;
        // listPublished dùng _withPagination → apiFetch trả envelope
        // { data, pagination } (như listMine ở StudioLessons).
        setLessons(Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
      } catch (e) {
        if (alive) setError(e?.message || "Không tải được danh sách bài học");
      }
      // Tiến độ lỗi thì chỉ mất badge trạng thái — không chặn danh sách.
      try {
        const mine = await lessonService.listMyProgress();
        if (!alive) return;
        const map = {};
        for (const p of Array.isArray(mine) ? mine : []) map[p.lessonId] = p;
        setProgressByLesson(map);
      } catch { /* bỏ qua */ }
    })();
    return () => { alive = false; };
  }, [userAuth, reloadKey]);

  const subjects = useMemo(() => {
    const set = new Set((lessons || []).map((l) => l.subject).filter(Boolean));
    return [...set].sort();
  }, [lessons]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (lessons || []).filter((l) => {
      if (subject && l.subject !== subject) return false;
      if (grade && String(l.grade ?? "") !== grade) return false;
      if (q && !`${l.title} ${l.subject}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [lessons, query, subject, grade]);

  if (!userAuth?.user) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="text-center anim-pop">
          <div className="mb-4 flex justify-center text-sky-600"><BookOpen className="w-14 h-14" /></div>
          <h2 className="font-display text-xl text-ink mb-2">Chưa đăng nhập</h2>
          <p className="text-sm text-[#8A7C63] mb-4">Bạn cần đăng nhập để xem bài học</p>
          <PrimaryButton onClick={onBack}>← Về trang chủ</PrimaryButton>
        </div>
      </div>
    );
  }

  const badgeFor = (lesson) => {
    const p = progressByLesson[lesson.id];
    if (!p || (p.attempts === 0 && p.correctElementIds.length === 0 && !p.completed)) {
      return { text: "Chưa học", bg: "#EFE6D2", color: "#5B4A12", icon: null };
    }
    if (p.completed) {
      return { text: "Đã hoàn thành", bg: "#DBF1EE", color: "#0C5B52", icon: <Check className="w-3.5 h-3.5" /> };
    }
    return {
      text: p.totalQuestions > 0 ? `Đang học · đúng ${p.correctCount}/${p.totalQuestions} câu` : "Đang học",
      bg: "#EAF1FE", color: "#1D4ED8", icon: <Clock className="w-3.5 h-3.5" />,
    };
  };

  return (
    <div className="flex-1 px-4 sm:px-6 py-6 sm:py-10 w-full">
      <button onClick={onBack} className="text-sm text-[#8A7C63] hover:text-ink transition inline-flex items-center gap-1 mb-6">
        ← Về trang chủ
      </button>

      <div className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl text-ink flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-sky-600" /> Bài học
        </h1>
        <p className="text-sm text-[#8A7C63] mt-1">
          {lessons === null ? "Đang tải..." : `${filtered.length} bài học đang chờ em khám phá`}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <label className="flex items-center gap-2 rounded-full border border-[#E7D9BE] bg-white px-3.5 py-2 flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 text-[#8A7C63] shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm bài học..."
            className="flex-1 outline-none text-sm bg-transparent text-ink placeholder:text-[#B4A888]"
          />
        </label>
        <select value={subject} onChange={(e) => setSubject(e.target.value)}
          className="rounded-full border border-[#E7D9BE] bg-white px-3.5 py-2 text-sm text-ink outline-none">
          <option value="">Tất cả môn học</option>
          {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={grade} onChange={(e) => setGrade(e.target.value)}
          className="rounded-full border border-[#E7D9BE] bg-white px-3.5 py-2 text-sm text-ink outline-none">
          <option value="">Tất cả lớp</option>
          {[1, 2, 3, 4, 5].map((g) => <option key={g} value={String(g)}>Lớp {g}</option>)}
        </select>
      </div>

      {error ? (
        <ErrorState title="Không tải được bài học" subtitle={error} onRetry={() => setReloadKey((k) => k + 1)} />
      ) : lessons === null ? (
        <div className="py-16 flex justify-center"><Loader label="Đang tải bài học..." /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-12 h-12 mx-auto text-[#C9BBA0] mb-3" />
          <p className="text-[#8A7C63] text-sm">
            {lessons.length === 0 ? "Chưa có bài học nào được xuất bản. Quay lại sau nhé!" : "Không tìm thấy bài học phù hợp với bộ lọc."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((lesson) => {
            const badge = badgeFor(lesson);
            const done = badge.text === "Đã hoàn thành";
            return (
              <button key={lesson.id} type="button" onClick={() => navigate(`/lessons/${lesson.id}`)}
                className="text-left rounded-3xl border border-[#E7D9BE] bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition flex flex-col gap-3">
                {lesson.coverImage && (
                  <img src={lesson.coverImage} alt="" className="w-full h-32 object-cover rounded-2xl border border-[#E7D9BE]" />
                )}
                <div className="flex items-start justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold"
                    style={{ background: badge.bg, color: badge.color }}>
                    {badge.icon}{badge.text}
                  </span>
                  {lesson.grade ? (
                    <span className="text-[12px] font-semibold text-[#8A7C63]">Lớp {lesson.grade}</span>
                  ) : null}
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-ink leading-snug">{lesson.title || "Bài học"}</h3>
                  {lesson.subject && <p className="text-[13px] font-medium text-sky-700 mt-0.5">{lesson.subject}</p>}
                  {lesson.description && (
                    <p className="text-sm text-[#8A7C63] mt-1.5" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {lesson.description}
                    </p>
                  )}
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-[13px] text-[#8A7C63]">{lesson.pageCount} trang · {lesson.elementCount} nội dung</span>
                  <span className="inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-[13px] font-semibold text-white"
                    style={{ background: done ? "#1B998B" : "#2F6FED" }}>
                    {done ? "Học lại" : progressByLesson[lesson.id] ? "Học tiếp" : "Học ngay"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
