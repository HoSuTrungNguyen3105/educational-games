import { create } from 'zustand';

export const useQuestionImportStore = create((set, get) => ({
  file: null,
  fileType: null, // "xlsx" | "xls" | "docx"
  questions: [],
  errors: [],
  isParsing: false,
  isValid: false,
  selectedQuestion: null,

  setFile: (file, fileType) => set({ file, fileType }),
  
  setQuestions: (questions) => {
    const { validateList } = get();
    set({ questions });
    validateList(questions);
  },

  updateQuestion: (index, patch) => {
    const { questions, validateList } = get();
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], ...patch };
    set({ questions: newQuestions });
    validateList(newQuestions);
  },

  removeQuestion: (index) => {
    const { questions, validateList } = get();
    const newQuestions = questions.filter((_, i) => i !== index);
    set({ questions: newQuestions });
    validateList(newQuestions);
  },

  clearImport: () => set({
    file: null,
    fileType: null,
    questions: [],
    errors: [],
    isParsing: false,
    isValid: false,
    selectedQuestion: null,
  }),

  setIsParsing: (isParsing) => set({ isParsing }),
  setSelectedQuestion: (index) => set({ selectedQuestion: index }),

  validateList: (questionsList) => {
    let isValid = true;
    if (questionsList.length === 0) isValid = false;
    for (const q of questionsList) {
      if (q.status === 'invalid') {
        isValid = false;
        break;
      }
    }
    set({ isValid });
  }
}));
