import { useCallback, useEffect, useRef, useState } from 'react';

export function useToast() {
  const [toast, setToast] = useState(null);
  const show = useCallback((message, type = "info") => {
    setToast({ message, type });
    window.clearTimeout(show._t);
    show._t = window.setTimeout(() => setToast(null), 2600);
  }, []);
  return [toast, show];
}

export function useTimedQuestion(questions, onFinish) {
  const [idx, setIdx] = useState(0);
  const q = questions[idx];
  const [timeLeft, setTimeLeft] = useState(q.timeLimit);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => { setTimeLeft(q.timeLimit); setSelected(null); setRevealed(false); }, [idx]);

  useEffect(() => {
    if (revealed) return;
    if (timeLeft <= 0) { handleAnswer(null); return; }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [timeLeft, revealed]);

  function handleAnswer(optionId) {
    if (revealed) return;
    const isCorrect = optionId === q.correctAnswer;
    const earned = isCorrect ? q.points + Math.round((timeLeft / q.timeLimit) * 40) : 0;
    setSelected(optionId);
    setRevealed(true);
    const nextScore = score + earned;
    const nextCorrect = correctCount + (isCorrect ? 1 : 0);
    setScore(nextScore);
    setCorrectCount(nextCorrect);
    setTimeout(() => {
      if (idx + 1 < questions.length) { setIdx(i => i + 1); }
      else {
        const timeUsed = Math.round((Date.now() - startRef.current) / 1000);
        onFinish({ score: nextScore, correct: nextCorrect, timeUsed });
      }
    }, 1300);
    return isCorrect;
  }

  return { idx, q, timeLeft, selected, revealed, score, handleAnswer, total: questions.length };
}