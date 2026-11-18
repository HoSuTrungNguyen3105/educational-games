// Chuyên đề ngữ pháp B1 — TỪ CHỈ SỐ LƯỢNG (Quantifiers). Xem README §4.2 và §4.7.

export const GRAMMAR_QUANTIFIERS = [
  {
    id: "B1_GRAMMAR_019",
    title: "Quantifiers - Từ chỉ số lượng",
    category: "quantifiers",
    level: "B1",
    difficulty: "easy",
    content: {
      explanationVi:
        "Từ chỉ số lượng được chọn theo loại danh từ theo sau: many và a few đi với danh từ đếm được số nhiều, much và a little đi với danh từ không đếm được, còn a lot of dùng được cho cả hai. " +
        "Trong câu khẳng định thường dùng some, còn câu phủ định và nghi vấn thường dùng any. " +
        "Cặp dễ nhầm nhất là few/little (gần như không có, mang nghĩa tiêu cực) so với a few/a little (một ít, vẫn đủ dùng, mang nghĩa tích cực).",
      formula: "many/a few + N đếm được số nhiều | much/a little + N không đếm được | a lot of + cả hai | some (khẳng định) / any (phủ định, nghi vấn)",
      usageVi: [
        "Số lượng lớn: There are many students here. We don't have much time.",
        "Số lượng nhỏ: a few friends (một vài người bạn), a little sugar (một ít đường).",
        "Hỏi và phủ định với any: Do you have any questions? I don't have any money.",
      ],
      examples: [
        { english: "There isn't much milk left in the fridge.", vietnamese: "Không còn nhiều sữa trong tủ lạnh." },
        { english: "She has a few close friends in this city.", vietnamese: "Cô ấy có một vài người bạn thân ở thành phố này." },
        { english: "Do you have any questions about the lesson?", vietnamese: "Bạn có câu hỏi nào về bài học không?" },
      ],
      mistakesVi: [
        "Dùng much với danh từ đếm được: 'much people' → many people.",
        "Dùng some trong câu phủ định: 'I don't have some money' → I don't have any money.",
        "Bỏ mạo từ a làm đổi nghĩa: 'few friends' (hầu như không có bạn) khác 'a few friends' (có một vài người bạn).",
      ],
    },
    exercises: [
      {
        id: "019-mc1",
        type: "multiple_choice",
        question: "There are ___ students in the classroom today.",
        options: ["many", "much", "a little", "little"],
        answer: 0,
        explanationVi:
          "students là danh từ đếm được số nhiều → many. Kiến thức cần nhớ: much/a little/little chỉ đi với danh từ không đếm được như water, time, money.",
      },
      {
        id: "019-fb1",
        type: "fill_blank",
        question: "I don't have ___ money with me today. (some / any)",
        answer: "any",
        explanationVi:
          "Câu phủ định (don't) dùng any thay cho some. Kiến thức cần nhớ: some cho câu khẳng định, any cho câu phủ định và câu hỏi.",
      },
      {
        id: "019-ec1",
        type: "error_correction",
        question: "Tìm và sửa lỗi sai trong câu sau.",
        sentence: "How much friends do you have in this class?",
        answer: "many",
        explanationVi:
          "friends đếm được nên câu hỏi số lượng phải là How many. Kiến thức cần nhớ: How many + danh từ đếm được số nhiều; How much + danh từ không đếm được (và giá tiền).",
      },
      {
        id: "019-st1",
        type: "sentence_transformation",
        question: "Viết lại câu sau dùng 'a lot of': She has many books.",
        hint: "a lot of",
        answer: "She has a lot of books.",
        explanationVi:
          "a lot of thay thế được cho many (đếm được) và much (không đếm được) trong câu khẳng định. Kiến thức cần nhớ: a lot of + danh từ, động từ chia theo danh từ theo sau.",
      },
      {
        id: "019-so1",
        type: "sentence_ordering",
        question: "Sắp xếp các từ thành câu có nghĩa.",
        words: ["There", "is", "a", "little", "sugar", "in", "the", "jar"],
        answer: "There is a little sugar in the jar",
        explanationVi:
          "sugar không đếm được nên dùng a little và động từ is. Kiến thức cần nhớ: a little = một ít (vẫn còn đủ dùng), khác little = gần như không có.",
      },
      {
        id: "019-wf1",
        type: "word_formation",
        question: "Too much ___ (noisy) makes it hard to concentrate.",
        answer: "noise",
        explanationVi:
          "Sau too much cần danh từ không đếm được: noisy (tính từ) → noise (danh từ). Kiến thức cần nhớ: noise là danh từ không đếm được nên đi với much, không phải many.",
      },
    ],
  },
];
