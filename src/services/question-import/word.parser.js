import { normalizeQuestion } from './question.normalizer';
import { validateQuestion } from './question.validator';

export async function parseWord(file) {
  const mammothModule = await import('mammoth');
  const mammoth = mammothModule.default || mammothModule;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target.result;
        const result = await mammoth.extractRawText({ arrayBuffer });
        const text = result.value;
        
        const questions = parseTextToQuestions(text);
        
        const validatedQuestions = questions.map(q => {
          const normalized = normalizeQuestion(q);
          return validateQuestion(normalized);
        });
        
        resolve(validatedQuestions);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => reject(error);
    
    reader.readAsArrayBuffer(file);
  });
}

function parseTextToQuestions(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  const questions = [];
  let currentQuestion = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Match "Câu X:"
    if (/^Câu\s*\d+\s*:/i.test(line)) {
      if (currentQuestion) {
        questions.push(currentQuestion);
      }
      currentQuestion = {
        question: line.replace(/^Câu\s*\d+\s*:/i, '').trim(),
      };
      continue;
    }
    
    if (!currentQuestion) continue;

    // Match A., A), A - 
    if (/^A[\.\)\-]\s*/i.test(line)) {
      currentQuestion.answer_a = line.replace(/^A[\.\)\-]\s*/i, '').trim();
    } else if (/^B[\.\)\-]\s*/i.test(line)) {
      currentQuestion.answer_b = line.replace(/^B[\.\)\-]\s*/i, '').trim();
    } else if (/^C[\.\)\-]\s*/i.test(line)) {
      currentQuestion.answer_c = line.replace(/^C[\.\)\-]\s*/i, '').trim();
    } else if (/^D[\.\)\-]\s*/i.test(line)) {
      currentQuestion.answer_d = line.replace(/^D[\.\)\-]\s*/i, '').trim();
    }
    // Metadata
    else if (/^(Đáp án|Đáp án đúng|Answer|Correct Answer)\s*:/i.test(line)) {
      currentQuestion.correct_answer = line.replace(/^(Đáp án|Đáp án đúng|Answer|Correct Answer)\s*:/i, '').trim();
    } else if (/^(Thời gian|Time)\s*:/i.test(line)) {
      currentQuestion.time = line.replace(/^(Thời gian|Time)\s*:/i, '').trim();
    } else if (/^(Điểm|Score)\s*:/i.test(line)) {
      currentQuestion.score = line.replace(/^(Điểm|Score)\s*:/i, '').trim();
    } else if (/^(Chủ đề|Category)\s*:/i.test(line)) {
      currentQuestion.category = line.replace(/^(Chủ đề|Category)\s*:/i, '').trim();
    } else if (/^(Độ khó|Difficulty)\s*:/i.test(line)) {
      currentQuestion.difficulty = line.replace(/^(Độ khó|Difficulty)\s*:/i, '').trim();
    } else if (/^(Giải thích|Explanation)\s*:/i.test(line)) {
      currentQuestion.explanation = line.replace(/^(Giải thích|Explanation)\s*:/i, '').trim();
    } else {
      // Append to question content if it's not an answer or metadata, and no answers have been found yet
      if (!currentQuestion.answer_a && !currentQuestion.answer_b) {
         currentQuestion.question += " " + line;
      }
    }
  }

  if (currentQuestion) {
    questions.push(currentQuestion);
  }

  return questions;
}
