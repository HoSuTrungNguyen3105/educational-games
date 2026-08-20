export function validateQuestion(question) {
  const errors = [];
  
  if (!question.question || question.question.trim() === "") {
    errors.push({ field: "question", message: "Nội dung câu hỏi không được để trống" });
  }

  if (!question.answers || question.answers.length < 2) {
    errors.push({ field: "answers", message: "Phải có ít nhất 2 đáp án" });
  } else {
    question.answers.forEach(ans => {
      if (!ans.content || ans.content.trim() === "") {
        errors.push({ field: `answer_${ans.key}`, message: `Đáp án ${ans.key} không được để trống` });
      }
    });
  }

  if (!question.correctAnswer) {
    errors.push({ field: "correctAnswer", message: "Phải chọn đáp án đúng" });
  } else {
    const validKeys = question.answers?.map(a => a.key) || [];
    if (!validKeys.includes(question.correctAnswer)) {
      errors.push({ field: "correctAnswer", message: "Đáp án đúng không hợp lệ" });
    }
  }

  if (question.time !== undefined && question.time !== null) {
    if (isNaN(question.time) || question.time <= 0) {
      errors.push({ field: "time", message: "Thời gian phải là số lớn hơn 0" });
    }
  }

  if (question.score !== undefined && question.score !== null) {
    if (isNaN(question.score) || question.score < 0) {
      errors.push({ field: "score", message: "Điểm số không hợp lệ" });
    }
  }

  return {
    ...question,
    status: errors.length > 0 ? "invalid" : "valid",
    errors
  };
}

export function validateQuestions(questions) {
  return questions.map(validateQuestion);
}
