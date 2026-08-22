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

export function GamePlayRouter({ game, questions, playerName, onFinish, onQuit }) {
  const [htmlContent, setHtmlContent] = useState(null);
  const [loading, setLoading] = useState(false);

  // Resolve template slug from game
  const slug = game.slug || game.template || "";

  useEffect(() => {
    // If game has templateId, fetch template's htmlTemplate from API
    const tid = game.templateId ? (typeof game.templateId === "string" ? game.templateId : game.templateId?.$oid || game.templateId) : null;
    if (tid) {
      setLoading(true);
      templateService.get(tid).then(tpl => {
        if (tpl?.htmlTemplate) {
          setHtmlContent(tpl.htmlTemplate);
        } else {
          setHtmlContent(null);
        }
      }).catch(() => setHtmlContent(null)).finally(() => setLoading(false));
    } else {
      setHtmlContent(null);
    }
  }, [game.templateId, slug]);

  // Play-to-win HTML games: from API template or local fallback
  const isPlayToWin = game.type === "play-to-win";
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-paper">
        <p className="text-sm text-[#8A7C63]">Đang tải game...</p>
      </div>
    );
  }

  if (isPlayToWin && (htmlContent || HTML_GAME_FILES[slug])) {
    const content = htmlContent || HTML_GAME_FILES[slug];
    return <HtmlGameLoader htmlContent={content} game={game} questions={questions} playerName={playerName} onFinish={onFinish} onQuit={onQuit} />;
  }

  // Quiz/traditional games: map theo slug
  const QuizComponent = QUIZ_GAME_COMPONENTS[slug];
  if (QuizComponent) {
    return <QuizComponent game={game} questions={questions} playerName={playerName} onQuit={onQuit} onFinish={onFinish} />;
  }

  // Fallback: default play screen
  return <PlayGameScreen game={game} questions={questions} onFinish={onFinish} />;
}
