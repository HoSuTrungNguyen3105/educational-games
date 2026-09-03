import { useEffect, useState, lazy, Suspense } from 'react'
import { templateService } from '../services/api.js'
import { Loader } from '../components/ui.jsx'

const PlayGameScreen = lazy(() => import('./PlayGameScreen.jsx'));
const HtmlGameLoader = lazy(() => import('./HtmlGameLoader.jsx'));

export function GamePlayRouter({ game, questions, players, playerName, onFinish, onQuit, onStateUpdate, template: initialTemplate, userAuth }) {
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

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-paper py-16">
        <Loader label="Đang tải trò chơi..." />
      </div>
    );
  }

  if (tpl?.htmlTemplate && tpl.htmlTemplate.trim() !== "") {
    return (
      <Suspense fallback={<div className="flex-1 flex items-center justify-center bg-paper py-16"><Loader label="Đang tải trò chơi..." /></div>}>
        <HtmlGameLoader htmlContent={tpl.htmlTemplate} game={game} questions={questions} players={players} playerName={playerName} playMode={tpl.playMode || "solo"} onFinish={onFinish} onQuit={onQuit} onStateUpdate={onStateUpdate} userAuth={userAuth} />
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

