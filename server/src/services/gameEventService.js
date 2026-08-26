import { getCollection } from "../db.js";
import { trackAction } from "./dailyTaskService.js";

const EVENTS_COL = "gameEvents";

export const EVENT_TYPES = {
  GAME_STARTED: "GAME_STARTED",
  GAME_COMPLETED: "GAME_COMPLETED",
  GAME_WON: "GAME_WON",
  GAME_LOST: "GAME_LOST",
  QUESTION_ANSWERED: "QUESTION_ANSWERED",
  QUESTION_CORRECT: "QUESTION_CORRECT",
  QUESTION_WRONG: "QUESTION_WRONG",
  LEVEL_COMPLETED: "LEVEL_COMPLETED",
  SCORE_ACHIEVED: "SCORE_ACHIEVED",
  TIME_PLAYED: "TIME_PLAYED",
  STREAK_ACHIEVED: "STREAK_ACHIEVED",
  LOGIN: "LOGIN",
};

const EVENT_TO_TASK = {
  [EVENT_TYPES.GAME_COMPLETED]: "play_game",
  [EVENT_TYPES.GAME_WON]: "win_game",
  [EVENT_TYPES.QUESTION_ANSWERED]: "answer_question",
  [EVENT_TYPES.QUESTION_CORRECT]: "correct_answer",
  [EVENT_TYPES.SCORE_ACHIEVED]: "earn_xp",
  [EVENT_TYPES.LOGIN]: "login",
};

export async function processEvent(userId, eventData) {
  const { eventId, event, gameId, gameType, score, won, questionsAnswered, questionsCorrect } = eventData;

  if (!event || !EVENT_TYPES[event]) {
    throw new Error(`Event không hợp lệ: ${event}`);
  }

  if (eventId) {
    const exists = await getCollection(EVENTS_COL).findOne({ eventId });
    if (exists) return { processed: false, reason: "duplicate" };
  }

  const taskType = EVENT_TO_TASK[event];
  if (!taskType) return { processed: false, reason: "no_matching_task" };

  let amount = 1;
  if (event === EVENT_TYPES.QUESTION_ANSWERED && questionsAnswered > 0) {
    amount = questionsAnswered;
  } else if (event === EVENT_TYPES.QUESTION_CORRECT && questionsCorrect > 0) {
    amount = questionsCorrect;
  } else if (event === EVENT_TYPES.SCORE_ACHIEVED && score > 0) {
    amount = score;
  }

  const eventContext = { gameId, gameType, score: score || 0, won: !!won };
  await trackAction(userId, taskType, amount, eventContext);

  if (eventId) {
    await getCollection(EVENTS_COL).insertOne({
      eventId,
      userId,
      event,
      gameType: gameType || null,
      score: score || 0,
      processedAt: new Date().toISOString(),
    });
  }

  return { processed: true, taskType, amount };
}
