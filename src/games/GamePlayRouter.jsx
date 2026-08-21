import PlayGameScreen from './PlayGameScreen.jsx'
import SnailRacePlayScreen from './SnailRace.jsx'
import LuckyWheelPlayScreen from './LuckyWheel.jsx'
import DungeonQuestPlayScreen from './DungeonQuest.jsx'
import CustomDesignPlayScreen from './CustomDesignPlayScreen.jsx'
import { WhackAMolePlayScreen, SpaceShipPlayScreen, BalloonPopPlayScreen, DartThrowPlayScreen, SailingBoatPlayScreen, MoonLanternPlayScreen, TreasureMapPlayScreen, SortingGamePlayScreen, WordScramblePlayScreen, MemoryMatchPlayScreen, HeroAdventurePlayScreen, NinjaDashPlayScreen } from './TimedGames.jsx'
import BlockMasterPlayScreen from './block-master/BlockMaster.jsx'
import FindNumberPlayScreen from './find-number/FindNumber.jsx'
import MergeBlastPlayScreen from './merge-blast/MergeBlast.jsx'
import TicTacToePlayScreen from './tic-tac-toe/TicTacToe.jsx'
import MathsRacingPlayScreen from './maths-racing/MathsRacing.jsx'

export function GamePlayRouter({ game, questions, playerName, onFinish, onQuit }) {
  if (game.design && game.design.elements && game.design.elements.length > 0) {
    return <CustomDesignPlayScreen game={game} questions={questions} playerName={playerName} onQuit={onQuit} onFinish={onFinish} />;
  }

  if (game.type === "play-to-win") {
    switch (game.template || game.id) {
      case "block-master": return <BlockMasterPlayScreen game={game} onFinish={onFinish} onQuit={onQuit} />;
      case "find-number": return <FindNumberPlayScreen game={game} onFinish={onFinish} onQuit={onQuit} />;
      case "merge-blast": return <MergeBlastPlayScreen game={game} onFinish={onFinish} onQuit={onQuit} />;
      case "tic-tac-toe": return <TicTacToePlayScreen game={game} onFinish={onFinish} onQuit={onQuit} />;
      case "maths-racing": return <MathsRacingPlayScreen game={game} onFinish={onFinish} onQuit={onQuit} />;
      default: return <PlayGameScreen game={game} questions={questions} onFinish={onFinish} />;
    }
  }

  switch (game.template) {
    case "snail-race": return <SnailRacePlayScreen game={game} questions={questions} playerName={playerName} onQuit={onQuit} onFinish={onFinish} />;
    case "lucky-wheel": return <LuckyWheelPlayScreen game={game} questions={questions} playerName={playerName} onQuit={onQuit} onFinish={onFinish} />;
    case "whack-a-mole": return <WhackAMolePlayScreen game={game} questions={questions} playerName={playerName} onQuit={onQuit} onFinish={onFinish} />;
    case "space-ship": return <SpaceShipPlayScreen game={game} questions={questions} playerName={playerName} onQuit={onQuit} onFinish={onFinish} />;
    case "balloon-pop": return <BalloonPopPlayScreen game={game} questions={questions} playerName={playerName} onQuit={onQuit} onFinish={onFinish} />;
    case "dart-throw": return <DartThrowPlayScreen game={game} questions={questions} playerName={playerName} onQuit={onQuit} onFinish={onFinish} />;
    case "sailing-boat": return <SailingBoatPlayScreen game={game} questions={questions} playerName={playerName} onQuit={onQuit} onFinish={onFinish} />;
    case "moon-lantern": return <MoonLanternPlayScreen game={game} questions={questions} playerName={playerName} onQuit={onQuit} onFinish={onFinish} />;
    case "treasure-map": return <TreasureMapPlayScreen game={game} questions={questions} playerName={playerName} onQuit={onQuit} onFinish={onFinish} />;
    case "sorting-game": return <SortingGamePlayScreen game={game} questions={questions} playerName={playerName} onQuit={onQuit} onFinish={onFinish} />;
    case "word-scramble": return <WordScramblePlayScreen game={game} questions={questions} playerName={playerName} onQuit={onQuit} onFinish={onFinish} />;
    case "memory-match": return <MemoryMatchPlayScreen game={game} questions={questions} playerName={playerName} onQuit={onQuit} onFinish={onFinish} />;
    case "hero-adventure": return <HeroAdventurePlayScreen game={game} questions={questions} playerName={playerName} onQuit={onQuit} onFinish={onFinish} />;
    case "dungeon-quest": return <DungeonQuestPlayScreen game={game} questions={questions} playerName={playerName} onQuit={onQuit} onFinish={onFinish} />;
    case "ninja-dash": return <NinjaDashPlayScreen game={game} questions={questions} playerName={playerName} onQuit={onQuit} onFinish={onFinish} />;
    default: return <PlayGameScreen game={game} questions={questions} onFinish={onFinish} />;
  }
}
