// Gộp 15 chủ đề từ vựng B1 — thứ tự theo spec (update_features.md §4.1).
import { VOCAB_EDUCATION } from "./education.js";
import { VOCAB_ENVIRONMENT } from "./environment.js";
import { VOCAB_HEALTH } from "./health.js";
import { VOCAB_TECHNOLOGY } from "./technology.js";
import { VOCAB_TRAVEL } from "./travel.js";
import { VOCAB_FOOD_DRINK } from "./food-drink.js";
import { VOCAB_FAMILY } from "./family.js";
import { VOCAB_WORK_CAREER } from "./work-career.js";
import { VOCAB_SOCIETY } from "./society.js";
import { VOCAB_ENTERTAINMENT } from "./entertainment.js";
import { VOCAB_CULTURE } from "./culture.js";
import { VOCAB_TRANSPORTATION } from "./transportation.js";
import { VOCAB_SHOPPING } from "./shopping.js";
import { VOCAB_COMMUNICATION } from "./communication.js";
import { VOCAB_DAILY_LIFE } from "./daily-life.js";

// 15 chủ đề, đúng thứ tự spec §4.1.
export const VOCAB_TOPICS = [
  VOCAB_EDUCATION,
  VOCAB_ENVIRONMENT,
  VOCAB_HEALTH,
  VOCAB_TECHNOLOGY,
  VOCAB_TRAVEL,
  VOCAB_FOOD_DRINK,
  VOCAB_FAMILY,
  VOCAB_WORK_CAREER,
  VOCAB_SOCIETY,
  VOCAB_ENTERTAINMENT,
  VOCAB_CULTURE,
  VOCAB_TRANSPORTATION,
  VOCAB_SHOPPING,
  VOCAB_COMMUNICATION,
  VOCAB_DAILY_LIFE,
];

// Danh sách phẳng mọi từ, mỗi từ kèm topicId của chủ đề chứa nó.
export const ALL_VOCAB_WORDS = VOCAB_TOPICS.flatMap((topic) =>
  topic.words.map((word) => ({ ...word, topicId: topic.id })),
);
