export function normalizeQuestion(raw) {
  const answers = [];
  
  if (raw.answer_a !== undefined) answers.push({ key: "A", content: String(raw.answer_a).trim() });
  if (raw.answer_b !== undefined) answers.push({ key: "B", content: String(raw.answer_b).trim() });
  if (raw.answer_c !== undefined) answers.push({ key: "C", content: String(raw.answer_c).trim() });
  if (raw.answer_d !== undefined) answers.push({ key: "D", content: String(raw.answer_d).trim() });

  let correctAnswer = raw.correct_answer ? String(raw.correct_answer).trim().toUpperCase() : null;
  if (correctAnswer && correctAnswer.length > 1) {
      if (correctAnswer.startsWith("A")) correctAnswer = "A";
      else if (correctAnswer.startsWith("B")) correctAnswer = "B";
      else if (correctAnswer.startsWith("C")) correctAnswer = "C";
      else if (correctAnswer.startsWith("D")) correctAnswer = "D";
  }

  return {
    id: null,
    questionType: "multiple_choice",
    question: raw.question ? String(raw.question).trim() : "",
    answers,
    correctAnswer: correctAnswer,
    time: raw.time ? parseInt(raw.time) : null,
    score: raw.score ? parseInt(raw.score) : null,
    image: raw.image || null,
    category: raw.category || null,
    difficulty: raw.difficulty || null,
    explanation: raw.explanation || null,
    status: "valid",
    errors: []
  };
}
