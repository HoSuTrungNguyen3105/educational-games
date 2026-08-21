import PlayGameScreen from './PlayGameScreen.jsx'
import SnailRacePlayScreen from './SnailRace.jsx'
import LuckyWheelPlayScreen from './LuckyWheel.jsx'
import DungeonQuestPlayScreen from './DungeonQuest.jsx'
import { WhackAMolePlayScreen, SpaceShipPlayScreen, BalloonPopPlayScreen, DartThrowPlayScreen, SailingBoatPlayScreen, MoonLanternPlayScreen, TreasureMapPlayScreen, SortingGamePlayScreen, WordScramblePlayScreen, MemoryMatchPlayScreen, HeroAdventurePlayScreen, NinjaDashPlayScreen } from './TimedGames.jsx'
import HtmlGameLoader from './HtmlGameLoader.jsx'

// Local HTML game files (fallback when game.htmlTemplate is not set)
import blockMasterHtml from './block-master/BlockMaster.html?raw'
import findNumberHtml from './find-number/FindNumber.html?raw'
import mergeBlastHtml from './merge-blast/MergeBlast.html?raw'
import ticTacToeHtml from './tic-tac-toe/TicTacToe.html?raw'
import mathsRacingHtml from './maths-racing/MathsRacing.html?raw'

// Map slug → local HTML fallback
const HTML_GAME_FILES = {
  'block-master': blockMasterHtml,
  'find-number': findNumberHtml,
  'merge-blast': mergeBlastHtml,
  'tic-tac-toe': ticTacToeHtml,
  'maths-racing': mathsRacingHtml,
}

// Map slug → React component (quiz/traditional games)
const QUIZ_GAME_COMPONENTS = {
  'snail-race': SnailRacePlayScreen,
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
  const slug = game.slug || game.template || game.id;

  // Play-to-win HTML games: có htmlTemplate từ API hoặc file local
  if (game.htmlTemplate || HTML_GAME_FILES[slug]) {
    const htmlContent = game.htmlTemplate || HTML_GAME_FILES[slug];
    return <HtmlGameLoader htmlContent={htmlContent} game={game} playerName={playerName} onFinish={onFinish} onQuit={onQuit} />;
  }

  // Quiz/traditional games: map theo slug
  const QuizComponent = QUIZ_GAME_COMPONENTS[slug];
  if (QuizComponent) {
    return <QuizComponent game={game} questions={questions} playerName={playerName} onQuit={onQuit} onFinish={onFinish} />;
  }

  // Fallback: default play screen
  return <PlayGameScreen game={game} questions={questions} onFinish={onFinish} />;
}
