// GrammarExercise.jsx — bọc QuestionCard cho 6 dạng bài tập ngữ pháp
// (spec §5.3): multiple_choice, fill_blank, error_correction,
// sentence_transformation, sentence_ordering, word_formation.
//
// Giữ cùng API với QuestionCard để trang Ngữ pháp chỉ cần một component.
import QuestionCard from "./QuestionCard.jsx";

/**
 * @param {object} props  xem QuestionCard (item, index, total, given, onChange, revealed, correct, disabled, onReveal)
 */
export default function GrammarExercise(props) {
  return <QuestionCard {...props} />;
}
