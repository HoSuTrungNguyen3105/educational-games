import { useEffect, useState } from 'react'
import PlayGameScreen from './PlayGameScreen.jsx'
import LuckyWheelPlayScreen from './LuckyWheel.jsx'
import DungeonQuestPlayScreen from './DungeonQuest.jsx'
import { WhackAMolePlayScreen, SpaceShipPlayScreen, BalloonPopPlayScreen, DartThrowPlayScreen, SailingBoatPlayScreen, MoonLanternPlayScreen, TreasureMapPlayScreen, SortingGamePlayScreen, WordScramblePlayScreen, MemoryMatchPlayScreen, HeroAdventurePlayScreen, NinjaDashPlayScreen } from './TimedGames.jsx'
import HtmlGameLoader from './HtmlGameLoader.jsx'
import { templateService } from '../services/api.js'

// Local HTML game files (fallback)
import blockMasterHtml from './block-master/BlockMaster.html?raw'
import findNumberHtml from './find-number/FindNumber.html?raw'
import mergeBlastHtml from './merge-blast/MergeBlast.html?raw'
import ticTacToeHtml from './tic-tac-toe/TicTacToe.html?raw'
import mathsRacingHtml from './maths-racing/MathsRacing.html?raw'
import snailRaceHtml from './snail-race/SnailRace.html?raw'

const HTML_GAME_FILES = {
  'block-master': blockMasterHtml,
  'find-number': findNumberHtml,
  'merge-blast': mergeBlastHtml,
  'tic-tac-toe': ticTacToeHtml,
  'maths-racing': mathsRacingHtml,
  'snail-race': snailRaceHtml,
}

const QUIZ_GAME_COMPONENTS = {
  'lucky-wheel': LuckyWheelPlayScreen,
  'whack-a-mole': WhackAMolePlayScreen,
  'space-ship': SpaceShipPlayScreen,
  'balloon-pop': BalloonPopPlayScreen,
  'dart-throw': DartThrowPlayScreen,
  'sailing-boat': SailingBoatPlayScreen,
  'moon-lantern': MoonLanternPlayScreen,
  'treasure-map': TreasureMapPlayScreen,
  'sorting-game': SortingGamePlayScreen,
  'word-scramble': WordScramblePlayScreen,
  'memory-match': MemoryMatchPlayScreen,
  'hero-adventure': HeroAdventurePlayScreen,
  'dungeon-quest': DungeonQuestPlayScreen,
  'ninja-dash': NinjaDashPlayScreen,
}

export function GamePlayRouter({ game, questions, playerName, onFinish, onQuit, template: initialTemplate }) {
  // Dùng template truyền xuống chỉ làm giá trị tạm trong lúc chờ API,
  // LUÔN gọi GET /api/templates/:templateId để lấy type + htmlTemplate mới nhất
  const [tpl, setTpl] = useState(initialTemplate || null);
  const tid = game?.templateId
    ? (typeof game.templateId === "string" ? game.templateId : game.templateId?.$oid || String(game.templateId))
    : null;
  const [loading, setLoading] = useState(!!tid);
  const slug = tpl?.slug || game.slug || game.template || "";

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

  // Type quyết định theo TEMPLATE lấy từ API, fallback về game.type nếu chưa có
  const isPlayToWin = tpl ? tpl.type === "play-to-win" : game.type === "play-to-win";

  // Play-to-win HTML games: htmlTemplate từ API template hoặc local fallback
  if (!loading && isPlayToWin && (tpl?.htmlTemplate || HTML_GAME_FILES[slug])) {
    const content = tpl?.htmlTemplate || HTML_GAME_FILES[slug];
    return <HtmlGameLoader htmlContent={content} game={game} questions={questions} playerName={playerName} onFinish={onFinish} onQuit={onQuit} />;
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-paper">
        <p className="text-sm text-[#8A7C63]">Đang tải game...</p>
      </div>
    );
  }

  // Quiz/traditional games: map theo slug của template
  const QuizComponent = QUIZ_GAME_COMPONENTS[slug];
  if (QuizComponent) {
    return <QuizComponent game={game} questions={questions} playerName={playerName} onQuit={onQuit} onFinish={onFinish} />;
  }

  // Fallback: default play screen
  return <PlayGameScreen game={game} questions={questions} onFinish={onFinish} />;
}
