# English B1 — Hợp đồng kỹ thuật (contract)

Phân hệ "English B1 – Học tiếng Anh và luyện thi" (`update_features.md`).
**Mọi file trong module PHẢI tuân thủ tài liệu này** — trang, component, dữ liệu,
service, utils đều đọc contract từ đây.

## 0. Nguyên tắc cứng

1. Không thêm thư viện ngoài (chỉ dùng `chartist` + `lucide-react` đã có).
2. Không Backend mới → tiến độ học lưu **localStorage** (mở rộng API sau được).
3. **Không bao giờ giả lập**: không audio giả, không đường dẫn chết, không điểm
   "AI chấm" bịa, không kết quả Speech-to-Text bịa.
   Chưa có → ghi rõ trạng thái (`audioStatus: "missing"`, "Chưa khả dụng",
   "Chưa được đánh giá") thay vì tạo dữ liệu giả.
4. Giao diện tiếng Việt (nhãn), nội dung học tiếng Anh.
5. Dùng **token class** của hệ thống để tự đổi màu dark mode:
   `bg-paper bg-paper2 text-ink text-[#8A7C63] border-ink/10 text-teal text-ticket text-gold`
   — **cấm** `bg-white`, `text-gray-*`, `bg-gray-*` (sáng cố định, hỏng dark mode).
6. Responsive: lưới `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`, padding
   `px-4 md:px-8`, và **phải có `pb-24 lg:pb-10`** vì có BottomNav cố định dưới
   (`lg:hidden`).
7. Lint: file `.jsx` **chỉ export component** (rule `react-refresh/only-export-components`),
   không biến unused, không `console.log`. **KHÔNG chạy `npm run build` / `npm run lint`**
   trong lúc giao việc (một người chạy tập trung để tránh xung đột).

## 1. Cấu trúc & tích hợp

```text
src/englishB1/
├── pages/         11 trang (xem §6)
├── components/    component dùng chung (xem §5)
├── data/          dữ liệu thật (xem §4) — KHÔNG để trong pages
├── services/      englishB1Service / vocabularyService / examService / progressService
└── utils/         scoringUtils / examTimerUtils / learningUtils
```

Route (đã/đăng ký ở `src/lib/router.js` + `src/App.jsx`):

| route name | path | page |
|---|---|---|
| `english-b1` | `/english-b1` | `pages/EnglishB1Dashboard.jsx` |
| `english-b1-vocabulary` | `/english-b1/vocabulary` | `pages/VocabularyPage.jsx` |
| `english-b1-grammar` | `/english-b1/grammar` | `pages/GrammarPage.jsx` |
| `english-b1-listening` | `/english-b1/listening` | `pages/ListeningPage.jsx` |
| `english-b1-reading` | `/english-b1/reading` | `pages/ReadingPage.jsx` |
| `english-b1-writing` | `/english-b1/writing` | `pages/WritingPage.jsx` |
| `english-b1-speaking` | `/english-b1/speaking` | `pages/SpeakingPage.jsx` |
| `english-b1-exams` | `/english-b1/exams` | `pages/ExamListPage.jsx` |
| `english-b1-exam` | `/english-b1/exams/:examId` | `pages/ExamTakingPage.jsx` |
| `english-b1-exam-result` | `/english-b1/exams/:examId/result` | `pages/ExamResultPage.jsx` |
| `english-b1-progress` | `/english-b1/progress` | `pages/ProgressPage.jsx` |

Điều hướng tới phân hệ: 1 mục "Tiếng Anh B1" ở `BottomNav.jsx` +
`HomeScreen.jsx` (SIDEBAR_ITEMS / MORE_ITEMS). Trong phân hệ, mọi trang tự
dùng `EnglishB1Shell` có tab nav riêng.

## 2. Props của trang

`App.jsx` truyền vào mỗi trang:

```jsx
<SomePage userAuth={userAuth} showToast={showToast} />          // trang thường
<ExamTakingPage examId={route.params?.examId} userAuth={userAuth} showToast={showToast} />
<ExamResultPage examId={route.params?.examId} userAuth={userAuth} showToast={showToast} />
```

- `userAuth`: `{ user, token } | null` — chỉ để hiển thị (tiến độ là cục bộ).
- `showToast(msg, type)` — `type`: `"success" | "error" | "info"`.
- **Mỗi trang tự render `EnglishB1Shell`** (App bọc `RouteShell showBack={false}`).

## 3. Service & utils — API thật (đã/đang viết, dùng đúng tên này)

### `services/progressService.js` (localStorage, reactive)

```js
getProgress()                 // snapshot (object, không mutate)
useEnglishB1Progress()        // useSyncExternalStore → snapshot
recordLessonResult(kind, refId, { correct, total, score? })
//   kind: "grammar" | "listening" | "reading"
recordVocabularyReview(wordId, correct)   // đúng/sai → SRS cập nhật nextReviewAt
setVocabularyHard(wordId, hard)
saveWritingDraft(topicId, text)
saveWritingSubmission(topicId, result)    // result = evaluateEssay(...) đã chấm
recordSpeakingAttempt(topicId, { recording })   // recording: dataURL | null
saveExamAttempt(examId, attempt)          // attempt: xem examService.gradeExam
recordActivity({ type, refId, label, score })   // lịch sử + biểu đồ (giữ 400 bản ghi)
addStudySeconds(sec)
getStreakDays()               // số ngày học liên tục
resetProgress()
```

Snapshot shape (đọc theo, không tự bịa field):

```js
{
  version: 1,
  startedAt: ISO,
  daily: { date: "YYYY-MM-DD", minutes, questions, correct, words },   // reset mỗi ngày
  vocabulary: { [wordId]: { status, level, correct, wrong, hard, lastReviewedAt, nextReviewAt } },
  //   status: "new" | "learning" | "learned" | "review"
  grammar:    { [lessonId]: { attempts, correct, total, best, lastAt, done } },
  listening:  { [lessonId]: { attempts, correct, total, best, lastAt, done } },
  reading:    { [lessonId]: { attempts, correct, total, best, lastAt, done } },
  writing:    { [topicId]: { draft, draftAt, submissions: [{ at, score, text, criteria }] } },
  speaking:   { [topicId]: { attempts, lastAt, done, recording } },
  exams:      { [examId]: { attempts: [{ at, score, correct, wrong, skipped, durationSec, answers }], best } },
  activity:   [{ at, type, refId, label, score }],
  studySeconds: number,
}
```

### `services/vocabularyService.js`

```js
getWordStatus(progress, wordId)          // → "new"|"learning"|"learned"|"review"
getDueWords(progress, words)             // → word[] cần ôn (nextReviewAt <= now)
getTopicProgress(progress, topicWords)   // → { learned, learning, review, new, percent }
buildPracticeItems(words, mode, rng?)    // → items cho QuestionCard
//   mode: "meaning" | "fill_blank" | "matching" | "listening" | "flashcard"
```

### `services/examService.js`

```js
listExams()                    // từ data/exams — kèm best/percent từ progress
getExam(examId)                // exam object | null
gradeExam(exam, answers)       // → { score, scale, correct, wrong, skipped,
                               //      sections: { listening:{...}, reading:{...}, writing:{...|unscored}, speaking:{...|unscored} } }
saveAttempt(examId, attempt)    // → progressService.saveExamAttempt
getAttempts(examId), getBest(examId), getLatestAttempt(examId)
```

### `services/englishB1Service.js` (dashboard/tổng hợp)

```js
getDashboard(progress) → {
  level: "B1",
  lessonsStudied, questionsPracticed, avgScore, streakDays,
  coursePercent,               // % hoàn thành khóa (đã có / tổng số bài)
  strongestSkill, weakestSkill, // { key:"listening"|"reading"|"grammar"|"vocabulary"|"writing"|"speaking", label, percent }
  continueLesson: { kind, refId, title, href } | null,
  suggestions: [{ kind, refId, title, href, reason }],
  dailyGoal: { done, target },  // target = 20 câu/ngày
  history: [{ date, label, score }],
}
```

### `utils/`

```js
// scoringUtils.js
gradeAnswer(item, given)              // → boolean (so khớp mọi type câu hỏi)
gradeItems(items, answers)            // → { correct, wrong, skipped, details:[{id, ok, given, answer}] }
scaleScore(correct, total)            // → thang 0–100 (làm tròn, tổng=0 → 0)
evaluateEssay(text, topic)            // → { score, total, criteria:[{key,labelVi,score,max,noteVi}], wordCount, suggestionsVi:[], isRuleBased:true }
skillLabel(key), percentOf(a, b)
// examTimerUtils.js
formatClock(sec)                     // → "MM:SS" hoặc "H:MM:SS"
useCountdown(totalSec, { onExpire, paused })  // → secondsLeft   (custom hook, tên bắt đầu bằng use_)
// learningUtils.js
shuffle(arr, rng?), makeRng(seed), sample(arr, n, rng?)
buildDistractors(correctWords, pool, n)
streakFromDates(dates), todayKey(), percentOf(a, b)
```

## 4. Dữ liệu — schema bắt buộc (`data/**`)

Mỗi file `.js` export **named const**; mỗi domain có `data/<domain>/index.js`
gộp lại; sau cùng `data/index.js` re-export.

### 4.1 Vocabulary — `data/vocabulary/<topic>.js` (15 file)

```js
export const VOCAB_EDUCATION = {
  id: "education", title: "Education", titleVi: "Giáo dục", icon: "🎓",
  words: [{
    id: "edu-001",            // duy nhất toàn module: <mã topic>-<3 số>
    word: "curriculum",
    ipa: "/kəˈrɪkjələm/",
    meaningVi: "chương trình đào tạo",
    pos: "noun",              // noun|verb|adjective|adverb|phrase|preposition|pronoun
    example: "The school has revised its curriculum.",
    exampleVi: "Nhà trường đã cập nhật chương trình đào tạo.",
    synonyms: ["syllabus", "program"],
    antonyms: [],             // không có thì [] (không bỏ trống field)
    audioUrl: null,           // KHÔNG bịa file audio → null
    difficulty: "medium",     // easy|medium|hard
  }],
};
```

**Tối thiểu 7 từ/file × 15 file = 105 từ**, mỗi từ đủ 9 field, ví dụ đúng ngữ pháp B1.

### 4.2 Grammar — `data/grammar/<nhóm>.js` (gộp được nhiều chuyên đề/file)

```js
export const GRAMMAR_LESSONS = [{
  id: "B1_GRAMMAR_001",       // đánh số liên tục
  title: "Present Perfect",
  category: "tenses",         // tenses|passive|conditionals|modals|reported-speech|
                              // relative|comparison|gerund-infinitive|articles|
                              // prepositions|conjunctions|quantifiers|question-tags
  level: "B1", difficulty: "medium",   // easy|medium|hard
  content: {
    explanationVi: "…",       // giải thích bằng tiếng Việt, ≥3 câu
    formula: "S + have/has + V3/ed",
    usageVi: ["Cách dùng 1…", "Cách dùng 2…"],   // ≥2
    examples: [{ english: "…", vietnamese: "…" }], // ≥3
    mistakesVi: ["Lỗi thường gặp…"],              // ≥2
  },
  exercises: [ /* đúng 6 dạng, mỗi dạng ≥1 câu — xem §4.7 */ ],
}];
```

**Tối thiểu 15 chuyên đề** (spec §5.1 liệt kê 20 → làm ≥15).

### 4.3 Reading — `data/reading/reading-lessons.js`

```js
export const READING_LESSONS = [{
  id: "B1_READ_001", title: "…", topic: "education", level: "B1",
  difficulty: "medium", wordCount: 320,
  paragraphs: ["Đoạn 1…", "Đoạn 2…"],   // ≥4 đoạn, 200–400 từ
  questions: [{
    id: 1,
    type: "multiple_choice",   // xem §4.7
    question: "…",
    options: ["…", "…", "…", "…"],   // 4 lựa chọn
    answer: 1,                  // index
    paragraphRef: 1,            // index đoạn chứa đáp án (0-based) → "chỉ ra vị trí"
    locationVi: "Đoạn 2, câu “…”. ",
    explanationVi: "…",         // giải thích dựa trên nội dung + vị trí
  }],
}];
```

**Tối thiểu 10 bài**, mỗi bài ≥5 câu, phủ đủ 7 dạng của spec §7.2
(multiple_choice, true_false_not_given, matching_headings, matching_information,
gap_filling, comprehension, vocabulary_in_context).

### 4.4 Listening — `data/listening/listening-lessons.js`

```js
export const LISTENING_LESSONS = [{
  id: "B1_LISTEN_001", title: "…", category: "daily_conversations", level: "B1",
  difficulty: "medium", durationSec: 180,
  audioUrl: null,              // KHÔNG bịa đường dẫn
  audioStatus: "missing",      // "missing" → UI hiện "Nội dung âm thanh chưa được cung cấp"
  transcript: ["A: …", "B: …"],   // ≥8 lượt lời, đủ để làm bài bằng chữ + TTS
  transcriptVi: ["…"],          // dịch nghĩa (1 dòng tương ứng)
  questions: [{ id, type, question, options?, answer, explanationVi }],
}];
```

**Tối thiểu 10 bài** theo 9 nhóm của spec §6.1; mỗi bài ≥4 câu; dạng bài §6.3.

### 4.5 Writing — `data/writing/writing-topics.js`

```js
export const WRITING_TOPICS = [{
  id: "B1_WRITE_001",
  type: "email",   // email|informal_letter|formal_letter|opinion_paragraph|
                   // short_essay|advice|experience
  title: "…", topic: "…", level: "B1",
  promptVi: "Đề bài (tiếng Việt)…",
  requirementsVi: ["Yêu cầu 1…", "Yêu cầu 2…"],   // ≥2
  minWords: 80, maxWords: 120,
  structureVi: ["Mở đầu", "Thân bài", "Kết luận"],
  vocabularyHints: [{ word: "…", meaningVi: "…" }],   // ≥5
  sampleAnswer: "Bài mẫu ≥80 từ…",
  sampleNotesVi: ["Vì sao bài mẫu tốt…"],            // ≥3
  checklist: [{ id: "task", labelVi: "Task Achievement", hintVi: "…" }],
  //   checklist = 5 tiêu chí spec §8.3: task|organization|vocabulary|grammar|spelling
}];
```

**Tối thiểu 15 chủ đề**, mỗi chủ đề ≥1 bài mẫu thật, ≥5 từ gợi ý.

### 4.6 Speaking — `data/speaking/speaking-topics.js`

```js
export const SPEAKING_TOPICS = [{
  id: "B1_SPEAK_001",
  part: 1,                     // 1|2|3  (spec §9.2)
  title: "…", topic: "…", level: "B1",
  promptVi: "…",
  questionsVi: ["Câu hỏi 1…", "…"],   // part 1: ≥3, part 2: 1 đề + 3 gợi ý, part 3: ≥2
  timeLimitSec: 60,            // part1 30–45s, part2 120s, part3 60s
  sampleAnswer: "…",           // câu trả lời mẫu thật
  vocabularyHints: [{ word, meaningVi }],   // ≥4
  structureVi: ["…"],          // dàn ý trả lời
}];
```

**Tối thiểu 20 chủ đề** (part 1 ≥8, part 2 ≥6, part 3 ≥6).

### 4.7 Schema câu hỏi dùng chung (`type` hợp lệ)

```js
{
  id: number|string,
  type: "multiple_choice" | "true_false" | "true_false_not_given" |
        "fill_blank" | "gap_filling" | "short_answer" |
        "matching" | "matching_headings" | "matching_information" |
        "comprehension" | "vocabulary_in_context" |
        "error_correction" | "sentence_transformation" |
        "sentence_ordering" | "word_formation" | "mcq",
  question: string,
  // multiple_choice/mcq/comprehension/vocabulary_in_context/matching_*:
  options: string[],           // 3–4 lựa chọn
  answer: number,              // index của options
  // true_false: options tự sinh ["True","False"], answer: 0|1
  // true_false_not_given: options ["True","False","Not Given"], answer: 0|1|2
  // fill_blank/gap_filling/short_answer/word_formation:
  //   answer: string            (hoặc string[] = các đáp án chấp nhận được)
  //   options: omit
  // error_correction:
  //   sentence: "She go to school yesterday."  answer: "went"  (từ/cụm cần sửa)
  // sentence_transformation: question + hint + answer: "…"
  // sentence_ordering: words: string[] (thứ tự đúng)  answer: "…" (câu hoàn chỉnh)
  // matching / matching_headings / matching_information:
  //   items: string[]           (cột trái)
  //   options: string[]         (cột phải, có thể có đáp án thừa)
  //   answer: number[]          (index vào options cho từng item)
  explanationVi: string,       // BẮT BUỘC, ≥1 câu, giải thích vì sao đúng
  paragraphRef?: number,       // reading: index đoạn chứa đáp án
  locationVi?: string,         // reading: "Đoạn 2, …"
  difficulty?: "easy"|"medium"|"hard",
}
```

`utils/scoringUtils.gradeAnswer(item, given)` là nơi duy nhất chấm — dữ liệu chỉ
đúng khi `answer` khớp đúng type ở trên.

### 4.8 Exams — `data/exams/exam-00N.js`

```js
export const EXAM_001 = {
  id: "exam-001", code: "B1-001", name: "Đề tổng hợp số 1",
  type: "comprehensive",       // basic|intermediate|advanced|comprehensive|mock
  level: "B1", difficulty: "medium",
  durationMin: 60,             // tổng thời gian toàn đề
  description: "…",
  sections: [
    { id: "listening", skill: "listening", title: "Listening", durationMin: 30,
      questions: [ /* 10 câu, mỗi câu có transcriptRef: index câu transcript */ ] },
    { id: "reading",   skill: "reading",   title: "Reading",   durationMin: 30,
      paragraphs: ["…"], questions: [ /* 20 câu */ ] },
    { id: "writing",   skill: "writing",   title: "Writing",
      promptVi: "…", requirementsVi: ["…"], minWords: 80, maxWords: 120,
      sampleAnswer: "…" },      // KHÔNG có câu hỏi chấm tự động
    { id: "speaking",  skill: "speaking",  title: "Speaking",
      promptVi: "…", timeLimitSec: 120, sampleAnswer: "…" },
  ],
};
```

- Listening section mỗi câu thêm `transcriptRef` (index dòng transcript) + `transcript: string[]`
  của section (đề thi tự chứa, không phụ thuộc bài Listening).
- **Tối thiểu 5 đề**, mỗi đề Listening 10 câu + Reading 20 câu (chấm tự động),
  Writing + Speaking **"chưa được đánh giá"** khi xem điểm (spec §11).
- Đề phân loại: cơ bản / trung bình / nâng cao / tổng hợp / thi thử.

## 5. Component — props chính

| Component | Props |
|---|---|
| `EnglishB1Shell` | `{ active, title?, subtitle?, userAuth?, actions?, children }` — `active` ∈ `dashboard\|vocabulary\|grammar\|listening\|reading\|writing\|speaking\|exams\|progress` |
| `Flashcard` | `{ front, back, flipped, onFlip, className? }` — `front`/`back` là `ReactNode` |
| `VocabularyCard` | `{ word, status, hard, onOpen, onToggleHard }` |
| `GrammarLesson` | `{ lesson, expanded, onToggle }` — chỉ phần lý thuyết (bài tập trang tự làm) |
| `ReadingPassage` | `{ paragraphs, activeIndex, onPick, title? }` |
| `ProgressChart` | `{ points: [{label, value}], type?: "line"\|"bar", height?, ariaLabel?, emptyLabel? }` |
| `QuestionCard` | `{ item, index, total, given, onChange, revealed, disabled?, onReveal? }` |
| `GrammarExercise` | `{ item, given, onChange, revealed, index, total, disabled? }` |
| `ExamTimer` | `{ secondsLeft, totalSeconds, onExpire, paused?, compact? }` |
| `ExamNavigation` | `{ index, total, answers, flagged, onJump, onPrev, onNext, onToggleFlag, onSubmit, submitLabel? }` |
| `AudioPlayer` | `{ text, audioUrl, audioStatus, label?, rate?, onRateChange? }` |

- `QuestionCard`/`GrammarExercise` điều khiển bằng `given` + `onChange`;
  `revealed=true` → hiện đáp án đúng/xanh–đỏ + `item.explanationVi`.
- `onChange(given)` với `given` theo type: index (`number`) · chuỗi (`string`) ·
  mảng index (`number[]` cho matching).
- Component **không tự fetch**, không tự sửa progress — trang là nơi điều phối.

## 6. Trang (11)

| File | Nội dung chính (spec) |
|---|---|
| `EnglishB1Dashboard.jsx` | 3.1: chỉ số (bài đã học, câu đã luyện, điểm TB, streak, tiến độ khóa, kỹ năng mạnh/yếu), 8 thẻ chức năng, "Tiếp tục bài gần nhất", "Đề xuất", "Lịch sử luyện tập", "Mục tiêu hôm nay" |
| `VocabularyPage.jsx` | 4: chọn chủ đề → học (flashcard, chọn nghĩa, điền từ, ghép từ, nghe & chọn), ôn tập đã học, đánh dấu từ khó, SRS |
| `GrammarPage.jsx` | 5: 15+ chuyên đề, lý thuyết (GrammarLesson), 6 dạng bài tập, sau khi trả lời hiện đáp án + giải thích |
| `ListeningPage.jsx` | 6: danh sách bài theo nhóm, audio (`AudioPlayer`) + trạng thái "chưa có file audio gốc", Practice/Exam mode |
| `ReadingPage.jsx` | 7: đoạn văn trái / câu hỏi phải (hoặc stacked trên mobile), đánh dấu đoạn, đếm số câu, Exam mode có đồng hồ, sau nộp hiện vị trí thông tin |
| `WritingPage.jsx` | 8: 15+ đề, đề + yêu cầu + số từ, soạn thảo, lưu nháp, chấm theo bộ quy tắc (ghi rõ "chưa tích hợp AI"), 5 tiêu chí, bài mẫu |
| `SpeakingPage.jsx` | 9: 20+ chủ đề theo Part, ghi mic (MediaRecorder) + phát lại, câu trả lời mẫu, gợi ý từ vựng, ô phát âm ghi "Chưa khả dụng" |
| `ExamListPage.jsx` | 10.1: danh sách 5 đề (mã, tên, cấp, số câu, thời gian, độ khó, trạng thái, điểm cao nhất), phân loại |
| `ExamTakingPage.jsx` | 10.3 + 11: đồng hồ đếm ngược, đánh dấu câu, tiến độ, chuyển câu, tự nộp khi hết giờ, xác nhận khi thoát, không lộ đáp án |
| `ExamResultPage.jsx` | 10.4 + 11: tổng điểm, đúng/sai/chưa làm, thời gian, điểm từng kỹ năng (Writing/Speaking = "Chưa được đánh giá"), xem lại đáp án + giải thích, đề xuất ôn tập |
| `ProgressPage.jsx` | 12: tổng thời gian, bài hoàn thành, đề đã làm, điểm TB/cao nhất, tỷ lệ đúng, tiến độ từ vựng/ngữ pháp, biểu đồ điểm theo thời gian, phân tích điểm yếu + đề xuất |

## 7. Quy ước dùng chung khi viết trang

```jsx
import { EnglishB1Shell } from "../components/index.js";
import { useEnglishB1Progress } from "../services/progressService.js";
import { navigate } from "../../lib/router.js";

export default function VocabularyPage({ userAuth, showToast }) {
  const progress = useEnglishB1Progress();
  ...
  return (
    <EnglishB1Shell active="vocabulary" title="Từ vựng B1" userAuth={userAuth}>
      {/* nội dung, có pb-24 lg:pb-10 */}
    </EnglishB1Shell>
  );
}
```

- Khóa trạng thái bằng `useState`, không ghi localStorage trực tiếp — luôn qua service.
- Sau khi làm bài xong gọi `recordLessonResult(...)` + `showToast("…", "success")`.
- Link nội bộ: `navigate("/english-b1/…")`.
- Icon: `lucide-react`; emoji chỉ dùng làm icon chủ đề dữ liệu.
