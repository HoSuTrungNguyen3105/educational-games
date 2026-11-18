// Chuyên đề ngữ pháp B1 — SO SÁNH (Comparisons). Xem README §4.2 và §4.7.

export const GRAMMAR_COMPARISON = [
  {
    id: "B1_GRAMMAR_014",
    title: "Comparisons - So sánh hơn và so sánh nhất",
    category: "comparison",
    level: "B1",
    difficulty: "easy",
    content: {
      explanationVi:
        "So sánh hơn dùng để đối chiếu hai người hoặc hai vật, còn so sánh nhất dùng cho một đối tượng nổi bật nhất trong nhóm từ ba trở lên. " +
        "Tính từ ngắn thêm -er/-est, tính từ dài dùng more/the most, và một số tính từ bất quy tắc phải học thuộc như good → better → best. " +
        "Ngoài ra, cấu trúc as + tính từ + as diễn tả sự ngang bằng, dạng phủ định not as … as nghĩa là 'không … bằng'.",
      formula: "adj ngắn + -er + than | more + adj dài + than | the + adj ngắn-est / the most + adj dài | as + adj + as",
      usageVi: [
        "So sánh hai đối tượng: This exercise is easier than the last one.",
        "So sánh nhất trong nhóm: She is the tallest student in our class.",
        "So sánh ngang bằng: He runs as fast as his brother.",
      ],
      examples: [
        { english: "This exercise is easier than the last one.", vietnamese: "Bài tập này dễ hơn bài tập trước." },
        { english: "Ho Chi Minh City is the largest city in Vietnam.", vietnamese: "Thành phố Hồ Chí Minh là thành phố lớn nhất Việt Nam." },
        { english: "She is as tall as her brother.", vietnamese: "Cô ấy cao bằng anh trai của cô ấy." },
      ],
      mistakesVi: [
        "Dùng hai lớp so sánh cùng lúc: 'more cheaper' → cheaper (chỉ chọn một cách).",
        "Quên từ than trong so sánh hơn: 'He is taller his brother' → taller than his brother.",
        "Thiếu mạo từ the trước so sánh nhất: 'He is tallest boy' → the tallest boy.",
      ],
    },
    exercises: [
      {
        id: "014-mc1",
        type: "multiple_choice",
        question: "My bag is ___ than yours.",
        options: ["heavy", "heavier", "heaviest", "more heavy"],
        answer: 1,
        explanationVi:
          "Có từ than nên phải là so sánh hơn; heavy là tính từ ngắn, đổi y thành i rồi thêm -er: heavier. Kiến thức cần nhớ: tính từ ngắn không đi với more.",
      },
      {
        id: "014-fb1",
        type: "fill_blank",
        question: "This is the ___ (interesting) book I have ever read.",
        answer: "most interesting",
        explanationVi:
          "Có 'the' và 'I have ever read' → so sánh nhất; interesting là tính từ dài nên dùng most: the most interesting. Kiến thức cần nhớ: tính từ từ 3 âm tiết trở lên dùng more/most.",
      },
      {
        id: "014-ec1",
        type: "error_correction",
        question: "Tìm và sửa lỗi sai trong câu sau.",
        sentence: "He is the most fastest runner in our class.",
        answer: "fastest",
        explanationVi:
          "fast là tính từ ngắn nên so sánh nhất chỉ cần -est, bỏ 'most': the fastest. Kiến thức cần nhớ: không dùng đồng thời most và -est.",
      },
      {
        id: "014-st1",
        type: "sentence_transformation",
        question: "Viết lại câu sau dùng cấu trúc 'not as … as': Football is more popular than basketball in my school.",
        hint: "not as popular as",
        answer: "Basketball is not as popular as football in my school.",
        explanationVi:
          "A hơn B chuyển thành B không bằng A: not as + tính từ nguyên dạng (popular) + as. Kiến thức cần nhớ: trong cấu trúc as … as, tính từ giữ nguyên, không chia so sánh.",
      },
      {
        id: "014-so1",
        type: "sentence_ordering",
        question: "Sắp xếp các từ thành câu có nghĩa.",
        words: ["Today", "is", "hotter", "than", "yesterday"],
        answer: "Today is hotter than yesterday",
        explanationVi:
          "So sánh hơn cần cặp cấu trúc: tính từ-er + than. Kiến thức cần nhớ: hot gấp đôi phụ âm cuối trước -er (hot → hotter).",
      },
      {
        id: "014-wf1",
        type: "word_formation",
        question: "Of the three sisters, Lan is the ___ (young).",
        answer: "youngest",
        explanationVi:
          "So sánh trong nhóm ba người và có 'the' → so sánh nhất: youngest. Kiến thức cần nhớ: tính từ một âm tiết tận cùng bằng phụ âm thường chỉ thêm -est (young → youngest).",
      },
    ],
  },
];
