import PlayGameScreen from './PlayGameScreen.jsx'
import SnailRacePlayScreen from './SnailRace.jsx'
import LuckyWheelPlayScreen from './LuckyWheel.jsx'
import DungeonQuestPlayScreen from './DungeonQuest.jsx'
import { WhackAMolePlayScreen, SpaceShipPlayScreen, BalloonPopPlayScreen, DartThrowPlayScreen, SailingBoatPlayScreen, MoonLanternPlayScreen, TreasureMapPlayScreen, SortingGamePlayScreen, WordScramblePlayScreen, MemoryMatchPlayScreen, HeroAdventurePlayScreen, NinjaDashPlayScreen } from './TimedGames.jsx'

export function GamePlayRouter({ game, questions, playerName, onFinish, onQuit }) {
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