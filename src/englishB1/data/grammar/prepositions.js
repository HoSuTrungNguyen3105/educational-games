// Chuyên đề ngữ pháp B1 — GIỚI TỪ (Prepositions). Xem README §4.2 và §4.7.

export const GRAMMAR_PREPOSITIONS = [
  {
    id: "B1_GRAMMAR_017",
    title: "Prepositions - Giới từ thời gian, nơi chốn và cụm cố định",
    category: "prepositions",
    level: "B1",
    difficulty: "medium",
    content: {
      explanationVi:
        "Giới từ thời gian tuân theo quy tắc từ cụ thể đến khái quát: at cho giờ và thời điểm ngắn, on cho ngày và buổi của ngày cụ thể, in cho tháng, năm, mùa và buổi nói chung. " +
        "Giới từ nơi chốn cũng tương tự: at cho điểm, on cho bề mặt, in cho không gian kín hoặc khu vực lớn. " +
        "Ngoài ra, nhiều động từ và tính từ có giới từ đi kèm cố định như depend on, good at, interested in, afraid of — những cụm này phải học thuộc như một đơn vị.",
      formula: "at + giờ (at 7.30) | on + ngày (on Monday) | in + tháng/năm/mùa (in June, in 2025) | by + phương tiện | V/adj + giới từ cố định",
      usageVi: [
        "Thời gian: The meeting is at 9 o'clock on Monday in June.",
        "Nơi chốn: at the station, on the table, in the kitchen, in Hanoi.",
        "Cụm cố định: depend on, listen to, good at, interested in, wait for, afraid of.",
      ],
      examples: [
        { english: "The meeting is on Monday at 9 o'clock.", vietnamese: "Cuộc họp diễn ra vào thứ Hai lúc 9 giờ." },
        { english: "She is very good at maths but afraid of dogs.", vietnamese: "Cô ấy rất giỏi toán nhưng sợ chó." },
        { english: "We travelled to Hue by train last year.", vietnamese: "Năm ngoái chúng tôi đã đi Huế bằng tàu hỏa." },
      ],
      mistakesVi: [
        "Dùng in cho ngày cụ thể: 'in Monday' → on Monday.",
        "Dùng at cho tháng/năm: 'at June' → in June.",
        "Sai giới từ đi kèm: 'depend of' → depend on; 'arrive to the airport' → arrive at the airport.",
      ],
    },
    exercises: [
      {
        id: "017-mc1",
        type: "multiple_choice",
        question: "Her birthday is ___ June.",
        options: ["in", "on", "at", "by"],
        answer: 0,
        explanationVi:
          "Tháng dùng giới từ in. Kiến thức cần nhớ: in + tháng/năm/mùa; on + ngày; at + giờ.",
      },
      {
        id: "017-fb1",
        type: "fill_blank",
        question: "He is afraid ___ dogs. (điền giới từ đúng)",
        answer: "of",
        explanationVi:
          "Cụm cố định afraid of = sợ cái gì. Kiến thức cần nhớ: tính từ + giới từ phải học theo cụm: afraid of, interested in, good at, proud of.",
      },
      {
        id: "017-ec1",
        type: "error_correction",
        question: "Tìm và sửa lỗi sai trong câu sau.",
        sentence: "She arrived to the airport two hours early.",
        answer: "at",
        explanationVi:
          "arrive không đi với to: arrive at + địa điểm nhỏ (sân ga, sân bay), arrive in + thành phố/quốc gia. Kiến thức cần nhớ: arrive at the airport, arrive in Hanoi.",
      },
      {
        id: "017-st1",
        type: "sentence_transformation",
        question: "Viết lại câu sau dùng 'by': We went to Da Lat in our car.",
        hint: "by car",
        answer: "We went to Da Lat by car.",
        explanationVi:
          "Phương tiện di chuyển dùng by + danh từ không mạo từ: by car, by train, by bus. Kiến thức cần nhớ: by + phương tiện không bao giờ có a/the ở giữa.",
      },
      {
        id: "017-so1",
        type: "sentence_ordering",
        question: "Sắp xếp các từ thành câu có nghĩa.",
        words: ["The", "keys", "are", "on", "the", "table", "in", "the", "kitchen"],
        answer: "The keys are on the table in the kitchen",
        explanationVi:
          "on the table chỉ bề mặt, in the kitchen chỉ không gian chứa — cụm nơi chốn nhỏ đứng trước, lớn đứng sau. Kiến thức cần nhớ: place nhỏ → place lớn ở cuối câu.",
      },
      {
        id: "017-wf1",
        type: "word_formation",
        question: "He took part in the competition with great ___ (confident).",
        answer: "confidence",
        explanationVi:
          "Sau tính từ 'great' cần danh từ: confident (tính từ) → confidence (danh từ). Kiến thức cần nhớ: -ent → -ence (confident → confidence, different → difference).",
      },
    ],
  },
];
