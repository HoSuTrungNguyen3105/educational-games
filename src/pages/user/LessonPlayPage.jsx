import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, Star, Trophy, X } from "lucide-react";
import { ErrorState, Loader, PrimaryButton } from "../../components/ui";
import LessonPlayer from "../../components/studio/LessonPlayer.jsx";
import { lessonService } from "../../services/lessonService.js";
import { gameService, questionService } from "../../services/api.js";
import { navigate } from "../../lib/router.js";

const GamePlayRouter = lazy(() => import("../../games/_shared/GamePlayRouter.jsx"));

// Trang HỌC bài học phía học sinh (EduPlay AI Studio đợt 3) — route
// /lessons/:lessonId. Dùng lại NGUYÊN LessonPlayer/LessonCanvas/
// LessonElementView của đợt 2 với dữ liệu từ /lessons/published/:id
// (DTO đã lọc correctAnswer + explanation/feedback — học sinh KHÔNG tự
// chấm ở client):
//   • checkAnswer → POST /lessons/published/:id/check (server chấm bằng
//     gradeAnswer, trả feedback + explanation-khi-đúng + tiến độ mới).
//   • Tiến độ (GET .../progress) khôi phục các câu đã đúng: chúng hiển
//     thị "đã hoàn thành" và KHOÁ sửa (muốn làm lại thì đó là lượt học
//     mới — server vẫn nhận check và cộng attempts nếu học sinh mở bản
//     xem trước của giáo viên; ở trang học thật, câu đã đúng là xong).
//   • Điểm phiên = tổng điểm các câu đã đúng (điểm từng câu do server
//     quyết khi chấm; khôi phục thì tính lại từ points của phần tử,
//     mặc định 10 — cùng quy tắc DEFAULT_POINTS phía server).
//   • Phần tử game: mở LỚP PHỦ toàn màn hình ngay trong trang học bằng
//     đúng cơ chế chơi độc lập (GamePlayRouter → HtmlGameLoader theo
//     gameId, nạp game + câu hỏi như StudentApp). Game-over ĐÁNH DẤU
//     "đã chơi" cho phần tử và GHI BỀN vào tiến độ server (đợt nâng cấp:
//     POST /lessons/published/:id/played → playedGameIds; trước đó chỉ
//     giữ trong phiên, tải lại trang là mất) — không ghi điểm game vào
//     điểm bài học, không cộng thưởng ở tầng bài học (mọi thưởng của
//     game vẫn đi theo luồng bridge độc lập sẵn có bên trong loader).
export default function LessonPlayPage({ lessonId, userAuth, showToast }) {
  const [lesson, setLesson] = useState(null);
  const [progress, setProgress] = useState(null);
  const [games, setGames] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [playedGames, setPlayedGames] = useState(() => new Set());
  const [activeGame, setActiveGame] = useState(null); // { elementId, game, questions, loading, error }
  const completeCalledRef = useRef(false);
  const completedToastRef = useRef(false);

  // ── Nạp bài + tiến độ + thư viện game (cho thumbnail phần tử game) ──
  // Pattern nạp dữ liệu chuẩn của codebase — tắt rule cho effect này
  // (xem ghi chú tương tự ở StudioLessons.jsx).
  useEffect(() => {
    if (!userAuth?.user) return undefined;
    let alive = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLesson(null);
    setProgress(null);
    setPlayedGames(new Set());
    setLoadError("");
    completeCalledRef.current = false;
    completedToastRef.current = false;
    (async () => {
      try {
        const [l, p] = await Promise.all([
          lessonService.getPublished(lessonId),
          lessonService.getProgress(lessonId).catch(() => null),
        ]);
        if (!alive) return;
        if (!l) { setLoadError("Không tìm thấy bài học (có thể đã bị gỡ xuất bản)."); return; }
        setLesson(l);
        setProgress(p);
        // Khôi phục "đã chơi game" từ tiến độ server (playedGameIds).
        if (Array.isArray(p?.playedGameIds)) setPlayedGames(new Set(p.playedGameIds));
      } catch (e) {
        if (alive) setLoadError(e?.message || "Không tải được bài học");
      }
    })();
    gameService.list({})
      .then((list) => { if (alive) setGames(Array.isArray(list) ? list : []); })
      .catch(() => { /* thumbnail game chỉ là phụ trợ */ });
    return () => { alive = false; };
  }, [lessonId, userAuth, reloadKey]);

  const gameById = useMemo(() => {
    const map = {};
    for (const g of games) map[g._id] = g;
    return map;
  }, [games]);

  const questions = useMemo(() => {
    const out = [];
    for (const page of lesson?.pages || []) {
      for (const el of page.elements || []) if (el.type === "question") out.push(el);
    }
    return out;
  }, [lesson]);

  const pointsOf = useCallback((el) => {
    const pts = Number(el?.props?.points);
    return Number.isFinite(pts) ? pts : 10;
  }, []);

  const score = useMemo(() => {
    const correct = new Set(progress?.correctElementIds || []);
    return questions.reduce((sum, el) => sum + (correct.has(el.id) ? pointsOf(el) : 0), 0);
  }, [questions, progress, pointsOf]);
  const totalScore = useMemo(
    () => questions.reduce((sum, el) => sum + pointsOf(el), 0),
    [questions, pointsOf],
  );

  // Câu đã đúng (từ tiến độ server) → seed cho player: hiện "Đúng rồi!"
  // và khoá sửa. value để trống vì server không lưu đáp án học sinh đã chọn.
  const initialAnswers = useMemo(() => {
    const map = {};
    for (const id of progress?.correctElementIds || []) {
      map[id] = { value: null, result: { correct: true, restored: true } };
    }
    return map;
  }, [progress]);

  // Chấm phía server — player nhận object kết quả nguyên vẹn.
  const checkAnswer = useCallback(async (el, value) => {
    try {
      const res = await lessonService.checkAnswer(lessonId, el.id, value);
      if (res?.progress) setProgress(res.progress);
      return res;
    } catch (e) {
      showToast?.(e?.message || "Không chấm được câu này, em thử lại nhé");
      throw e;
    }
  }, [lessonId, showToast]);

  // Mở tới trang cuối → ghi nhận hoàn thành (server tự quyết: bài không
  // có câu hỏi mới hoàn thành ở đây; bài có câu hỏi phải đúng hết qua
  // /check). Gọi tối đa 1 lần mỗi lượt mở trang học.
  const onPageChange = useCallback((idx, total) => {
    if (!lesson || !progress || progress.completed) return;
    if (idx < total - 1 || completeCalledRef.current) return;
    completeCalledRef.current = true;
    lessonService.complete(lessonId)
      .then((p) => { if (p) setProgress(p); })
      .catch(() => { /* hoàn thành sẽ được thử lại ở lượt mở sau */ });
  }, [lesson, progress, lessonId]);

  // Toast chúc mừng đúng MỘT lần khi tiến độ chuyển sang hoàn thành.
  useEffect(() => {
    if (progress?.completed && !completedToastRef.current) {
      completedToastRef.current = true;
      showToast?.("🎉 Chúc mừng em đã hoàn thành bài học!");
    }
  }, [progress, showToast]);

  // ── Lớp phủ chơi game trong bài ─────────────────────────────────────
  const openGame = useCallback(async (gameId, el) => {
    setActiveGame({ elementId: el?.id || null, gameId, game: null, questions: [], loading: true, error: "" });
    try {
      const [game, qs] = await Promise.all([
        gameService.get(gameId),
        questionService.listByGame(gameId).catch(() => []),
      ]);
      if (!game) throw new Error("Không tìm thấy game này trong thư viện");
      setActiveGame({ elementId: el?.id || null, gameId, game, questions: Array.isArray(qs) ? qs : [], loading: false, error: "" });
    } catch (e) {
      setActiveGame({ elementId: el?.id || null, gameId, game: null, questions: [], loading: false, error: e?.message || "Không tải được game" });
    }
  }, []);

  const closeGame = useCallback(() => setActiveGame(null), []);

  const finishGame = useCallback(() => {
    const elementId = activeGame?.elementId || null;
    setActiveGame(null);
    if (elementId) {
      setPlayedGames((prev) => {
        const next = new Set(prev);
        next.add(elementId);
        return next;
      });
      // Ghi bền phía server — lỗi mạng thì trạng thái trong phiên vẫn
      // đúng, lần mở bài sau sẽ đồng bộ lại từ progress.
      lessonService.recordPlayed(lessonId, elementId)
        .then((p) => { if (p) setProgress(p); })
        .catch(() => { /* bỏ qua — không chặn việc học */ });
    }
    showToast?.("Đã chơi xong game, quay lại bài học nào!");
  }, [activeGame, lessonId, showToast]);

  // Khi lớp phủ game đang mở, Escape chỉ đóng game — chặn không cho
  // LessonPlayer (nghe keydown trên window) thoát cả bài học.
  useEffect(() => {
    if (!activeGame) return undefined;
    const onKey = (e) => { if (e.key === "Escape") e.stopPropagation(); };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [activeGame]);

  if (!userAuth?.user) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center px-6">
        <div className="text-center anim-pop">
          <div className="mb-4 flex justify-center text-sky-600"><BookOpen className="w-14 h-14" /></div>
          <h2 className="font-display text-xl text-ink mb-2">Chưa đăng nhập</h2>
          <p className="text-sm text-[#8A7C63] mb-4">Bạn cần đăng nhập để học bài</p>
          <PrimaryButton onClick={() => navigate("/")}>← Về trang chủ</PrimaryButton>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-paper px-4 py-10">
        <ErrorState title="Không mở được bài học" subtitle={loadError} onRetry={() => setReloadKey((k) => k + 1)} />
        <div className="text-center mt-4">
          <PrimaryButton onClick={() => navigate("/lessons")}>← Danh sách bài học</PrimaryButton>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <Loader label="Đang tải bài học..." />
      </div>
    );
  }

  const headerExtra = (
    <>
      {questions.length > 0 && (
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ background: "#B7791F" }}>
          <Star className="w-3.5 h-3.5" /> {score}/{totalScore} điểm
        </span>
      )}
      {progress?.completed && (
        <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ background: "#1B998B" }}>
          <Trophy className="w-3.5 h-3.5" /> Đã hoàn thành
        </span>
      )}
    </>
  );

  return (
    <>
      <LessonPlayer
        lesson={lesson}
        gameById={gameById}
        checkAnswer={checkAnswer}
        initialAnswers={initialAnswers}
        onPageChange={onPageChange}
        playedGameIds={playedGames}
        headerExtra={headerExtra}
        onPlayGame={openGame}
        onExit={() => navigate("/lessons")}
      />

      {activeGame && (
        <div className="fixed inset-0 z-[120] flex flex-col bg-paper">
          <header className="shrink-0 flex items-center gap-3 px-4 h-14 border-b border-[#E7D9BE] bg-white/80 backdrop-blur">
            <p className="font-display font-bold text-ink truncate flex-1">
              {activeGame.game?.name || "Trò chơi trong bài học"}
            </p>
            <span className="hidden md:inline text-xs text-[#8A7C63]">Đang chơi trong bài học — đóng để quay lại bài</span>
            <button type="button" onClick={closeGame}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-ink text-paper text-sm font-semibold hover:bg-ink2">
              <X className="w-4 h-4" /> Đóng game
            </button>
          </header>
          <div className="relative flex-1 min-h-0">
            {activeGame.loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader label="Đang tải trò chơi..." />
              </div>
            ) : activeGame.error ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
                <p className="text-4xl">🎮</p>
                <p className="font-semibold text-ink">Chưa mở được game này</p>
                <p className="text-sm text-[#8A7C63] max-w-sm">{activeGame.error}. Em quay lại bài học và thử lại sau nhé.</p>
                <PrimaryButton onClick={closeGame}>Quay lại bài học</PrimaryButton>
              </div>
            ) : (
              <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center"><Loader label="Đang tải trò chơi..." /></div>}>
                <GamePlayRouter
                  game={activeGame.game}
                  questions={activeGame.questions}
                  playerName={userAuth.user.name || "Player"}
                  userAuth={userAuth}
                  onFinish={finishGame}
                  onQuit={closeGame}
                />
              </Suspense>
            )}
          </div>
        </div>
      )}
    </>
  );
}
