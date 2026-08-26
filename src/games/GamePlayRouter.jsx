import { useEffect, useState } from 'react'
import PlayGameScreen from './PlayGameScreen.jsx'
import HtmlGameLoader from './HtmlGameLoader.jsx'
import { templateService } from '../services/api.js'

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
      <div className="flex-1 flex items-center justify-center bg-paper">
        <p className="text-sm text-[#8A7C63]">Đang tải game...</p>
      </div>
    );
  }

  if (tpl?.htmlTemplate && tpl.htmlTemplate.trim() !== "") {
    return <HtmlGameLoader htmlContent={tpl.htmlTemplate} game={game} questions={questions} players={players} playerName={playerName} playMode={tpl.playMode || "solo"} onFinish={onFinish} onQuit={onQuit} onStateUpdate={onStateUpdate} userAuth={userAuth} />;
  }

  return <PlayGameScreen game={game} questions={questions} onFinish={onFinish} />;
}
