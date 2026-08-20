import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { setupService } from '../services/setupService.js';

const FALLBACK_TEMPLATE = { icon: "🎲", ring: "#F4B942" };

export function useSubjects() {
  const [subjects, setSubjects] = useState([]);
  useEffect(() => {
    let active = true;
    setupService.listSubjects().then((list) => { if (active) setSubjects(list); });
    return () => { active = false; };
  }, []);
  return subjects;
}

export function useCategories() {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    let active = true;
    setupService.listCategories().then((list) => { if (active) setCategories(list); });
    return () => { active = false; };
  }, []);
  return categories;
}

export function useTemplates() {
  const [templates, setTemplates] = useState([]);
  useEffect(() => {
    let active = true;
    setupService.listTemplates().then((list) => { if (active) setTemplates(list); });
    return () => { active = false; };
  }, []);
  return templates;
}

export function useTemplate(game) {
  const templates = useTemplates();
  if (!game) return FALLBACK_TEMPLATE;
  return templates.find((t) => t.id === game.template) || FALLBACK_TEMPLATE;
}

export function useMediaQuery(query) {
  const subscribe = useCallback((onChange) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

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