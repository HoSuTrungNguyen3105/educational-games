import { useEffect, useMemo, useState, lazy, Suspense } from 'react'
import { gameService, templateService } from '../services/api.js'
import { Loader } from '../components/ui.jsx'
import { resolveGameKey } from './gameConfigSchema.js'

const PlayGameScreen = lazy(() => import('./PlayGameScreen.jsx'));
const HtmlGameLoader = lazy(() => import('./HtmlGameLoader.jsx'));

const EMPTY_CONFIG = { key: null, schemaVersion: 0, values: {} };

export function GamePlayRouter({ game, questions, players, playerName, onFinish, onQuit, onStateUpdate, template: initialTemplate, userAuth, coopSession }) {
  const [tpl, setTpl] = useState(initialTemplate || null);
  const tid = game?.templateId
    ? (typeof game.templateId === "string" ? game.templateId : game.templateId?.$oid || String(game.templateId))
    : null;
  const [loading, setLoading] = useState(!!tid);

  useEffect(() => {
    if (!tid) { setTpl(null); setLoading(false); return; }
    let active = true;
    setLoading(true);
    templateService.get(tid)
      .then((t) => { if (active) setTpl(t || null); })
      .catch(() => { if (active) setTpl(null); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [tid]);

  // /api/games chỉ trả config.key — gọi tiếp API cấu hình để lấy values.
  const gameKey = useMemo(() => resolveGameKey({ game, template: tpl }), [game, tpl]);
  const [gameConfig, setGameConfig] = useState(EMPTY_CONFIG);
  const [loadedFor, setLoadedFor] = useState(null);
  const gameId = game?._id?.toString() || game?.id || null;
  const requestKey = gameKey && gameId ? `${gameId}:${gameKey}` : null;
  const configLoading = !!requestKey && loadedFor !== requestKey;

  useEffect(() => {
    if (!requestKey) return;
    let active = true;
    gameService.getConfig(gameId)
      .then((res) => {
        if (!active) return;
        const cfg = res?.config;
        setGameConfig(cfg && cfg.key === gameKey ? cfg : { ...EMPTY_CONFIG, key: gameKey });
        setLoadedFor(requestKey);
      })
      .catch(() => {
        if (!active) return;
        setGameConfig({ ...EMPTY_CONFIG, key: gameKey });
        setLoadedFor(requestKey);
      });
    return () => { active = false; };
  }, [requestKey, gameId, gameKey]);

  if (loading || configLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-paper py-16">
        <Loader label="Đang tải trò chơi..." />
      </div>
    );
  }

  if (tpl?.htmlTemplate && tpl.htmlTemplate.trim() !== "") {
    return (
      <Suspense fallback={<div className="flex-1 flex items-center justify-center bg-paper py-16"><Loader label="Đang tải trò chơi..." /></div>}>
        <HtmlGameLoader htmlContent={tpl.htmlTemplate} game={game} questions={questions} players={players} playerName={playerName} playMode={coopSession ? "multiplayer" : (tpl.playMode || "solo")} onFinish={onFinish} onQuit={onQuit} onStateUpdate={onStateUpdate} userAuth={userAuth} coopSessionId={coopSession?.sessionId} coopOpponent={coopSession ? { acceptedBy: coopSession.fromUserId, acceptedByName: coopSession.fromName } : null} gameKey={gameKey} gameConfig={gameConfig} />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center bg-paper py-16"><Loader label="Đang tải câu hỏi..." /></div>}>
      <PlayGameScreen game={game} questions={questions} onFinish={onFinish} />
    </Suspense>
  );
}

export default GamePlayRouter;