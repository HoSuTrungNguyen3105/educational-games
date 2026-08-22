import { useEffect, useState } from 'react'
import { uid, resultService, questionService, gameService, templateService } from '../../services/api.js'
import { useTemplate, useTemplates } from '../../lib/hooks.js'
import { rankMedal } from '../../lib/utils.js'
import { PrimaryButton, GhostButton, StampToken, Loader, ErrorState, EmptyState, Toast } from '../../components/ui.jsx'
import { EnterCodeModal } from '../../components/EnterCodeModal.jsx'
import { GamePlayRouter } from '../../games/GamePlayRouter.jsx'
import { socket } from '../../socket/socket.js'
import { SOCKET_EVENTS } from '../../socket/socket.events.js'
import { useSocketEvent, useSocketConnected } from '../../socket/socket.listeners.js'
import { useGameStore } from '../../stores/game.store.js'
import { useChatStore } from '../../stores/chat.store.js'
import ChatPanel from '../../components/chat/ChatPanel.jsx'
import ChatBubble from '../../components/chat/ChatBubble.jsx'

export default function StudentApp({ initialGame, onExit, toast, userAuth, onUserLogin, onUserLogout }) {
  const [screen, setScreen] = useState(() => {
    if (initialGame && userAuth?.user) return "waiting";
    return initialGame ? "name" : "join";
  });
  const [game, setGame] = useState(initialGame || null);
  const [questions, setQuestions] = useState([]);
  const [playerName, setPlayerName] = useState(userAuth?.user?.name || "");
  const [finalResult, setFinalResult] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);

  const resetStore = () => useGameStore.getState().resetGame();

  // Loại chơi quyết định theo TEMPLATE (templateId → template.type),
  // fallback về game.type nếu chưa tải được template
  const templates = useTemplates();
  const tplIdOf = (g) => {
    if (!g?.templateId) return null;
    return typeof g.templateId === "string" ? g.templateId : g.templateId?.$oid || String(g.templateId);
  };
  const template = game ? templates.find(t => t._id === tplIdOf(game)) || null : null;
  const isPlayToWin = template ? template.type === "play-to-win" : game?.type === "play-to-win";

  const restart = () => {
    resetStore();
    setScreen(initialGame && userAuth?.user ? "waiting" : initialGame ? "name" : "join");
    setGame(initialGame || null); setQuestions([]); setPlayerName(userAuth?.user?.name || ""); setFinalResult(null); setLeaderboard(null);
  };
  const goHome = () => { resetStore(); setGame(null); setQuestions([]); setFinalResult(null); setLeaderboard(null); onExit(); };

  // Khởi tạo chat store khi có game
  const initChat = useChatStore((s) => s.init);
  const resetChat = useChatStore((s) => s.reset);
  const senderId = userAuth?.user?.id || null;
  const displayName = userAuth?.user?.name || playerName;
  const gameGid = game?._id?.toString() || game?.id;
  useEffect(() => {
    if (gameGid && senderId) {
      initChat(gameGid, senderId, displayName);
    }
    return () => resetChat();
  }, [gameGid, senderId, displayName]);

  // Khi route thay đổi sang một game cụ thể → đồng bộ game hiển thị
  useEffect(() => {
    const gid = initialGame?._id?.toString() || initialGame?.id;
    const currentGid = game?._id?.toString() || game?.id;
    if (initialGame && gid && gid !== currentGid) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGame(initialGame);
      setQuestions([]);
      const tid = tplIdOf(initialGame);
      const tpl = tid ? templates.find(t => t._id === tid) : null;
      const win = tpl ? tpl.type === "play-to-win" : initialGame.type === "play-to-win";
      if (win) {
        setScreen("play");
      } else {
        setScreen(userAuth?.user ? "waiting" : "name");
      }
    }
  }, [initialGame, game, userAuth, templates]);

  const handleFound = async (g) => {
    setGame(g);
    // Quyết định theo template type, không tin game.type
    let win = g.type === "play-to-win";
    const tid = tplIdOf(g);
    if (tid) {
      const tpl = templates.find(t => t._id === tid) || await templateService.get(tid).catch(() => null);
      if (tpl?.type) win = tpl.type === "play-to-win";
    }
    if (win) {
      setQuestions([]);
      setScreen("play");
    } else {
      setQuestions([]);
      setScreen(userAuth?.user ? "waiting" : "name");
    }
  };

  const handleStart = async () => {
    const gid = game?._id?.toString() || game?.id;
    if (isPlayToWin) { setScreen("play"); return; }
    const qs = await questionService.listByGame(gid); setQuestions(qs); setScreen("play");
  };

  const handleFinish = async (sessionResult) => {
    if (isPlayToWin) {
      setFinalResult({ score: sessionResult.score, correctAnswers: 0, totalQuestions: 0, accuracy: 0, completionTime: sessionResult.timeUsed });
      setScreen("result");
      return;
    }
    const entry = await resultService.submit({
      gameId: gameGid, playerId: uid("player"), playerName,
      score: sessionResult.score, correctAnswers: sessionResult.correct,
      totalQuestions: questions.length, accuracy: Math.round((sessionResult.correct / questions.length) * 100),
      completionTime: sessionResult.timeUsed,
    });
    setFinalResult(entry);
    setScreen("result");
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      {screen !== "play" && <StudentTopBar onExit={goHome} />}
      <main className="flex-1 flex flex-col">
        {screen === "join" && <JoinGameScreen onFound={handleFound} />}
        {screen === "name" && game && (
          <EnterNameScreen
            game={game}
            onBack={initialGame ? goHome : restart}
            onSubmit={async (name) => {
              setPlayerName(name);
              setScreen(isPlayToWin ? "play" : "waiting");
            }}
            userAuth={userAuth}
          />
        )}
        {screen === "waiting" && game && (
          <WaitingRoomScreen game={game} playerName={playerName}
            onStart={handleStart} userAuth={userAuth} onUserLogin={onUserLogin} onUserLogout={onUserLogout} />
        )}
        {screen === "play" && game && (isPlayToWin || questions.length > 0) && (
          <>
            <GamePlayRouter game={game} questions={questions} playerName={playerName} onQuit={restart} onFinish={handleFinish} template={template} />
            <ChatBubble userAuth={userAuth} onUserLogin={onUserLogin} />
          </>
        )}
        {screen === "result" && finalResult && (
          <ResultScreen result={finalResult} onSeeLeaderboard={async () => { const r = await resultService.listByGame(gameGid); setLeaderboard(r); setScreen("leaderboard"); }} />
        )}
        {screen === "leaderboard" && leaderboard && <LeaderboardScreen results={leaderboard} playerName={playerName} onPlayAgain={restart} />}
      </main>
      <Toast toast={toast} />
    </div>
  );
}

export function StudentTopBar({ onExit }) {
  return (
    <div className="flex items-center justify-between px-3 md:px-6 py-2 md:py-3 border-b border-ink/5 shrink-0">
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="text-base md:text-xl">🎪</span>
        <span className="font-display text-sm md:text-base text-ink truncate">Lớp Học Vui</span>
      </div>
      <button onClick={onExit} className="text-xs md:text-sm text-[#8A7C63] hover:text-ink shrink-0 ml-2">Thoát</button>
    </div>
  );
}

function JoinGameScreen({ onFound }) {
  const [games, setGames] = useState(null);
  const [error, setError] = useState(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const templates = useTemplates();

  const loadGames = async () => {
    setGames(null); setError(null);
    try {
      setGames(await gameService.list({ status: "published" }));
    } catch (e) {
      setError(e.message);
    }
  };
  useEffect(() => { loadGames(); }, []);

  return (
    <div className="flex-1 px-6 py-10">
      <div className="max-w-4xl mx-auto anim-pop">
        <div className="flex items-start justify-between gap-3 mb-6">
          <div>
            <h1 className="font-display text-2xl md:text-3xl text-ink">Chọn trò chơi</h1>
            <p className="text-sm text-[#8A7C63] mt-1">Chọn một trò chơi để tham gia, hoặc nhập mã vé nếu bạn quên trò chơi ở đâu 😉</p>
          </div>
          <button onClick={() => setShowCodeModal(true)}
            className="shrink-0 note-card px-4 py-2.5 text-sm font-semibold text-ink flex items-center gap-2 hover:bg-ink/5 transition">
            🔑 Nhập mã vé
          </button>
        </div>

        {games === null ? (
          <Loader label="Đang tải danh sách trò chơi..." />
        ) : error ? (
          <ErrorState title="Không tải được danh sách" subtitle={error} onRetry={loadGames} />
        ) : games.length === 0 ? (
          <EmptyState icon="🕹️" title="Chưa có trò chơi nào" subtitle="Giáo viên chưa xuất bản trò chơi nào. Hãy thử nhập mã vé hoặc quay lại sau nhé!" />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map(g => {
              const gid = g._id?.toString() || g.id;
              const tplId = g.templateId ? (typeof g.templateId === "string" ? g.templateId : g.templateId?.$oid || g.templateId) : null;
              const tpl = tplId ? templates.find(t => t._id === tplId) : templates.find(t => t.slug === g.template);
              return (
                <button key={gid} onClick={() => onFound(g)}
                  className="note-card p-5 text-left flex flex-col gap-3 hover:-translate-y-1 hover:shadow-[0_8px_0_rgba(0,0,0,0.1)] transition shadow-[0_3px_0_rgba(0,0,0,0.09)] group anim-pop bg-paper2">
                  <div className="flex items-center justify-between">
                    <StampToken icon={tpl ? tpl.icon : "🎲"} ring={tpl ? tpl.ring : "#1D2E4A"} size={46} fontSize={22} />
                    <span className="font-mono text-[11px] text-[#8A7C63] bg-ink/5 rounded-full px-2.5 py-1">{g.code}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-ink leading-snug clamp-2">{g.name}</h3>
                    <p className="text-sm text-[#8A7C63] mt-1 clamp-2">{g.description}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#8A7C63] font-mono flex-wrap">
                    <span>{g.subject}</span><span>·</span><span>{g.questionsCount} câu hỏi</span><span>·</span><span>{g.playersCount} lượt chơi</span>
                  </div>
                  <div className="mt-auto pt-2">
                    <span className="inline-block text-sm font-semibold text-teal group-hover:translate-x-1 transition">Chơi ngay →</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal nhập mã vé */}
      <EnterCodeModal open={showCodeModal} onClose={() => setShowCodeModal(false)} onFound={onFound} />
    </div>
  );
}

function EnterNameScreen({ game, onBack, onSubmit, userAuth }) {
  const [name, setName] = useState(userAuth?.user?.name || "");
  const tpl = useTemplate(game);
  return (
    <div className="flex-1 flex items-start sm:items-center justify-center px-6 pt-[14dvh] sm:pt-10 pb-10">
      <form onSubmit={e => { e.preventDefault(); if (name.trim()) onSubmit(name.trim()); }} className="max-w-sm w-full text-center anim-pop">
        <StampToken icon={tpl ? tpl.icon : "🎲"} ring={tpl ? tpl.ring : "#F4B942"} size={72} fontSize={32} className="mx-auto mb-4" />
        <h1 className="font-display text-2xl text-ink mb-1">{game.name}</h1>
        <p className="text-sm text-[#8A7C63] mb-6">{game.subject} · {game.topic}</p>
        {userAuth?.user ? (
          <div className="note-card px-4 py-3 text-lg text-ink bg-ink/5 text-center">
            👤 {userAuth.user.name}
          </div>
        ) : (
          <input value={name} onChange={e => setName(e.target.value)} maxLength={24} autoFocus placeholder="Nhập tên của bạn"
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); if (name.trim()) onSubmit(name.trim()); } }}
            className="w-full text-center note-card px-4 py-3 text-lg border-ink/10 focus:border-ticket" />
        )}
        <div className="flex gap-3 mt-5">
          <GhostButton onClick={onBack} className="flex-1">← Quay lại</GhostButton>
          <PrimaryButton type="submit" className="flex-1" disabled={!name.trim()}>Vào phòng chờ →</PrimaryButton>
        </div>
      </form>
    </div>
  );
}

function WaitingRoomScreen({ game, playerName, onStart, userAuth, onUserLogin, onUserLogout }) {
  const tpl = useTemplate(game);
  const connected = useSocketConnected();
  const players = useGameStore(s => s.players);
  const gameStatus = useGameStore(s => s.gameStatus);
  const joined = players.length > 0 && connected;
  const others = joined
    ? players.filter(p => p.name !== playerName).map(p => p.name).slice(0, 6)
    : [];
  const started = gameStatus === "playing";
  const gameGid = game?._id?.toString() || game?.id;

  // Tham gia trò chơi qua socket khi vào phòng chờ
  useEffect(() => {
    if (!connected) {
      socket.auth = {};
      socket.connect();
    }
    socket.emit(SOCKET_EVENTS.JOIN_GAME, { gameId: gameGid, playerName });
    return () => {
      socket.emit(SOCKET_EVENTS.LEAVE_CLASSROOM, { gameId: gameGid });
    };
  }, [connected, gameGid, playerName]);

  // Backend gửi game:started → tự động vào chơi
  useSocketEvent(SOCKET_EVENTS.GAME_STARTED, () => onStart());

  return (
    <div className="flex-1 flex min-h-0">
      {/* Game area */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 min-w-0">
        <div className="max-w-md w-full text-center anim-pop">
          <StampToken icon={tpl ? tpl.icon : "🎲"} ring={tpl ? tpl.ring : "#F4B942"} size={80} fontSize={36} className="mx-auto mb-5 float-slow" />
          <h1 className="font-display text-2xl text-ink mb-1">Phòng chờ</h1>
          <p className="text-sm text-[#8A7C63] mb-6">Chờ giáo viên bắt đầu trò chơi "{game.name}"</p>
          <div className="note-card p-5 mb-6">
            <p className="text-xs font-mono text-[#8A7C63] uppercase mb-3">{others.length + 1} người đã tham gia{connected && <span className="ml-2 text-teal">● realtime</span>}</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="px-3 py-1.5 rounded-full bg-ticket/10 text-ticket text-sm font-semibold">{playerName} (bạn)</span>
              {others.map(n => <span key={n} className="px-3 py-1.5 rounded-full bg-ink/5 text-ink text-sm anim-pop">{n}</span>)}
            </div>
          </div>
          {!started && <PrimaryButton onClick={onStart} className="w-full">Vào chơi 🚀</PrimaryButton>}
          {started && <p className="text-xs text-[#8A7C63] font-mono">Giáo viên đã bắt đầu — đang vào trò chơi... 🎬</p>}
        </div>
      </div>

      {/* Chat sidebar (desktop) / overlay (mobile) */}
      <ChatPanel userAuth={userAuth} onUserLogin={onUserLogin} onUserLogout={onUserLogout} />
    </div>
  );
}

export function ResultScreen({ result, onSeeLeaderboard }) {
  const isGreat = result.accuracy >= 80;
  return (
    <div className="flex-1 flex items-center justify-center px-6 py-10">
      <div className="max-w-md w-full text-center anim-pop">
        <div className="text-7xl mb-4 float-slow">{isGreat ? "🏆" : result.accuracy >= 50 ? "🌟" : "💪"}</div>
        <h1 className="font-display text-3xl text-ink mb-1">{result.score} điểm</h1>
        <p className="text-[#8A7C63] mb-8">{result.correctAnswers}/{result.totalQuestions} câu đúng · độ chính xác {result.accuracy}%</p>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="note-card p-4"><div className="font-display text-2xl text-teal">{result.correctAnswers}</div><div className="text-xs text-[#8A7C63] font-mono uppercase mt-1">Câu đúng</div></div>
          <div className="note-card p-4"><div className="font-display text-2xl text-ticket">{result.completionTime}s</div><div className="text-xs text-[#8A7C63] font-mono uppercase mt-1">Thời gian</div></div>
        </div>
        <PrimaryButton onClick={onSeeLeaderboard} className="w-full">Xem bảng xếp hạng →</PrimaryButton>
      </div>
    </div>
  );
}

export function LeaderboardScreen({ results, playerName, onPlayAgain }) {
  return (
    <div className="flex-1 flex items-center justify-center px-6 py-10">
      <div className="max-w-md w-full anim-pop">
        <h1 className="font-display text-2xl text-ink text-center mb-6">🏅 Bảng xếp hạng</h1>
        <div className="note-card divide-y divide-ink/5 overflow-hidden mb-6">
          {results.map((r, i) => {
            const medal = rankMedal(i + 1);
            const isMe = r.playerName === playerName;
            return (
              <div key={r.id} className={`flex items-center gap-3 px-4 py-3 ${isMe ? "bg-ticket/5" : ""}`}>
                <StampToken icon={medal.icon} ring={medal.ring} size={34} fontSize={i < 3 ? 16 : 13} />
                <span className={`flex-1 font-body ${isMe ? "font-semibold text-ticket" : "text-ink"}`}>{r.playerName}{isMe && " (bạn)"}</span>
                <span className="font-display text-ink">{r.score}</span>
              </div>
            );
          })}
        </div>
        <PrimaryButton onClick={onPlayAgain} className="w-full">Chơi trò chơi khác</PrimaryButton>
      </div>
    </div>
  );
}