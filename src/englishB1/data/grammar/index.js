// Gộp toàn bộ chuyên đề ngữ pháp B1 theo nhóm. Xem README §4.2.
// GRAMMAR_LESSONS: 20 chuyên đề (001–020), id đánh số liên tục, đúng thứ tự chương trình.

import { GRAMMAR_TENSES } from "./tenses.js";
import { GRAMMAR_PAST_FUTURE } from "./past-future.js";
import { GRAMMAR_MODALS } from "./modals.js";
import { GRAMMAR_PASSIVE } from "./passive.js";
import { GRAMMAR_CONDITIONALS } from "./conditionals.js";
import { GRAMMAR_REPORTED_SPEECH } from "./reported-speech.js";
import { GRAMMAR_RELATIVE } from "./relative.js";
import { GRAMMAR_COMPARISON } from "./comparison.js";
import { GRAMMAR_GERUND_INFINITIVE } from "./gerund-infinitive.js";
import { GRAMMAR_ARTICLES } from "./articles.js";
import { GRAMMAR_PREPOSITIONS } from "./prepositions.js";
import { GRAMMAR_CONJUNCTIONS } from "./conjunctions.js";
import { GRAMMAR_QUANTIFIERS } from "./quantifiers.js";
import { GRAMMAR_QUESTION_TAGS } from "./question-tags.js";

export {
  GRAMMAR_TENSES,
  GRAMMAR_PAST_FUTURE,
  GRAMMAR_MODALS,
  GRAMMAR_PASSIVE,
  GRAMMAR_CONDITIONALS,
  GRAMMAR_REPORTED_SPEECH,
  GRAMMAR_RELATIVE,
  GRAMMAR_COMPARISON,
  GRAMMAR_GERUND_INFINITIVE,
  GRAMMAR_ARTICLES,
  GRAMMAR_PREPOSITIONS,
  GRAMMAR_CONJUNCTIONS,
  GRAMMAR_QUANTIFIERS,
  GRAMMAR_QUESTION_TAGS,
};

export const GRAMMAR_LESSONS = [
  ...GRAMMAR_TENSES,
  ...GRAMMAR_PAST_FUTURE,
  ...GRAMMAR_MODALS,
  ...GRAMMAR_PASSIVE,
  ...GRAMMAR_CONDITIONALS,
  ...GRAMMAR_REPORTED_SPEECH,
  ...GRAMMAR_RELATIVE,
  ...GRAMMAR_COMPARISON,
  ...GRAMMAR_GERUND_INFINITIVE,
  ...GRAMMAR_ARTICLES,
  ...GRAMMAR_PREPOSITIONS,
  ...GRAMMAR_CONJUNCTIONS,
  ...GRAMMAR_QUANTIFIERS,
  ...GRAMMAR_QUESTION_TAGS,
];
