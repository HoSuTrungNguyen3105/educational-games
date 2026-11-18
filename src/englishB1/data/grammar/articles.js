// Chuyên đề ngữ pháp B1 — MẠO TỪ (Articles: a, an, the). Xem README §4.2 và §4.7.

export const GRAMMAR_ARTICLES = [
  {
    id: "B1_GRAMMAR_016",
    title: "Articles - Mạo từ a, an, the",
    category: "articles",
    level: "B1",
    difficulty: "medium",
    content: {
      explanationVi:
        "Mạo từ a/an dùng cho danh từ đếm được số ít khi nhắc tới lần đầu hoặc nói về một đối tượng bất kỳ trong nhóm, còn the dùng khi người nghe đã biết rõ đối tượng đó là cái nào. " +
        "Việc chọn a hay an phụ thuộc vào ÂM đầu tiên của từ theo sau, không phụ thuộc chữ cái: an hour (h câm) nhưng a university (đọc là /juː/). " +
        "Nhiều trường hợp không dùng mạo từ nào cả: danh từ không đếm được nói chung chung, tên môn học, môn thể thao và bữa ăn.",
      formula: "a/an + danh từ số ít (lần đầu, chưa xác định) | the + danh từ đã xác định/duy nhất | Ø + danh từ nói chung, môn học, thể thao",
      usageVi: [
        "Nghề nghiệp và lần đầu nhắc tới: She is a doctor. I saw a dog in the street.",
        "Đối tượng duy nhất hoặc đã nhắc lại: the sun, the moon; I bought a book and the book was cheap.",
        "Không mạo từ: play football, study maths, have breakfast, Life is beautiful.",
      ],
      examples: [
        { english: "She is a doctor at the city hospital.", vietnamese: "Cô ấy là bác sĩ tại bệnh viện thành phố." },
        { english: "The sun rises in the east.", vietnamese: "Mặt trời mọc ở hướng đông." },
        { english: "I play football on Sundays and have breakfast at seven.", vietnamese: "Tôi chơi bóng đá vào các ngày Chủ nhật và ăn sáng lúc bảy giờ." },
      ],
      mistakesVi: [
        "Dùng the cho danh từ nói chung chung: 'The life is hard' → Life is hard.",
        "Chọn a/an theo mặt chữ thay vì âm: 'an university' → a university; 'a hour' → an hour.",
        "Thiếu the trước đối tượng duy nhất: 'Moon is bright tonight' → The moon is bright tonight.",
      ],
    },
    exercises: [
      {
        id: "016-mc1",
        type: "multiple_choice",
        question: "___ sun rises in the east.",
        options: ["A", "An", "The", "Some"],
        answer: 2,
        explanationVi:
          "Mặt trời là đối tượng duy nhất trên thế giới → mạo từ xác định The. Kiến thức cần nhớ: the + sun/moon/earth/world và các thứ duy nhất.",
      },
      {
        id: "016-fb1",
        type: "fill_blank",
        question: "He is ___ honest man. (điền mạo từ phù hợp)",
        answer: "an",
        explanationVi:
          "honest bắt đầu bằng chữ h câm nên âm đầu là nguyên âm /ɒ/ → dùng an. Kiến thức cần nhớ: an đứng trước ÂM nguyên âm (an hour, an honest man), không phải chữ cái.",
      },
      {
        id: "016-ec1",
        type: "error_correction",
        question: "Tìm và sửa lỗi sai trong câu sau.",
        sentence: "I saw an university in the city centre.",
        answer: "a",
        explanationVi:
          "university phát âm bắt đầu bằng /juː/ — âm phụ âm — nên phải dùng a. Kiến thức cần nhớ: a university, a unit, a European country.",
      },
      {
        id: "016-st1",
        type: "sentence_transformation",
        question: "Viết lại câu sau, thêm mạo từ 'the' vào đúng vị trí: Moon looks bright tonight.",
        hint: "The",
        answer: "The moon looks bright tonight.",
        explanationVi:
          "Mặt trăng là đối tượng duy nhất nên cần The ở đầu câu. Kiến thức cần nhớ: danh từ chỉ vật duy nhất trong tự nhiên luôn đi với the.",
      },
      {
        id: "016-so1",
        type: "sentence_ordering",
        question: "Sắp xếp các từ thành câu có nghĩa.",
        words: ["She", "bought", "a", "new", "dress", "yesterday"],
        answer: "She bought a new dress yesterday",
        explanationVi:
          "dress được nhắc lần đầu nên dùng a, đặt trước tính từ new: a new dress. Kiến thức cần nhớ: mạo từ đứng trước cả cụm tính từ + danh từ.",
      },
      {
        id: "016-wf1",
        type: "word_formation",
        question: "The story was so ___ (interest) that I read it twice in one day.",
        answer: "interesting",
        explanationVi:
          "Sau 'so' cần tính từ miêu tả sự vật gây cảm xúc: interesting (dạng -ing). Kiến thức cần nhớ: câu chuyện (vật) → -ing; người đọc cảm thấy → interested.",
      },
    ],
  },
];
