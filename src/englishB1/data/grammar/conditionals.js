// Chuyên đề ngữ pháp B1 — CÂU ĐIỀU KIỆN (Conditional Sentences loại 0, 1, 2). Xem README §4.2 và §4.7.

export const GRAMMAR_CONDITIONALS = [
  {
    id: "B1_GRAMMAR_011",
    title: "Conditional Sentences - Câu điều kiện loại 0, 1, 2",
    category: "conditionals",
    level: "B1",
    difficulty: "medium",
    content: {
      explanationVi:
        "Câu điều kiện gồm hai mệnh đề: mệnh đề điều kiện bắt đầu bằng if và mệnh đề kết quả. " +
        "Loại 0 nói về sự thật luôn đúng, loại 1 nói về việc có thể xảy ra trong tương lai, loại 2 nói về tình huống giả định trái với hiện tại. " +
        "Điểm quan trọng nhất: trong mệnh đề if của loại 1 không dùng will, và của loại 2 không dùng would — hai từ này chỉ xuất hiện ở mệnh đề kết quả.",
      formula: "Type 0: If + present simple, present simple | Type 1: If + present simple, will + V | Type 2: If + past simple, would + V",
      usageVi: [
        "Loại 0 — quy luật, sự thật khoa học: If you heat ice, it melts.",
        "Loại 1 — điều kiện có thật trong tương lai: If it rains tomorrow, we will stay at home.",
        "Loại 2 — giả định trái hiện tại, lời khuyên (If I were you…): If I had money, I would travel.",
      ],
      examples: [
        { english: "If you heat ice, it melts.", vietnamese: "Nếu bạn đun nóng đá, nó tan chảy." },
        { english: "If it rains tomorrow, we will stay at home.", vietnamese: "Nếu mai trời mưa, chúng tôi sẽ ở nhà." },
        { english: "If I had a lot of money, I would travel around the world.", vietnamese: "Nếu tôi có nhiều tiền, tôi sẽ đi du lịch vòng quanh thế giới." },
      ],
      mistakesVi: [
        "Cho will vào mệnh đề if loại 1: 'If it will rain' → If it rains.",
        "Cho would vào mệnh đề if loại 2: 'If I would have time' → If I had time.",
        "Quên rằng động từ to be ở loại 2 dùng were cho mọi chủ ngữ trong văn viết chuẩn: If I were you…",
      ],
    },
    exercises: [
      {
        id: "011-mc1",
        type: "multiple_choice",
        question: "If it ___ tomorrow, we will cancel the picnic.",
        options: ["rains", "will rain", "rained", "would rain"],
        answer: 0,
        explanationVi:
          "Mệnh đề kết quả có will → điều kiện loại 1 → mệnh đề if dùng hiện tại đơn: rains. Kiến thức cần nhớ: không bao giờ đặt will ngay sau if trong loại 1.",
      },
      {
        id: "011-fb1",
        type: "fill_blank",
        question: "If I ___ (be) you, I would apologise to her.",
        answer: "were",
        explanationVi:
          "Mệnh đề kết quả có would → loại 2 → mệnh đề if dùng quá khứ đơn, và to be phải là were cho mọi chủ ngữ. Kiến thức cần nhớ: 'If I were you' là cấu trúc khuyên nhủ cố định.",
      },
      {
        id: "011-ec1",
        type: "error_correction",
        question: "Tìm và sửa lỗi sai trong câu sau.",
        sentence: "If it will be sunny, we will go camping.",
        answer: "is",
        explanationVi:
          "Điều kiện loại 1: mệnh đề if dùng hiện tại đơn nên 'will be' phải sửa thành is. Kiến thức cần nhớ: will chỉ đứng ở mệnh đề kết quả.",
      },
      {
        id: "011-st1",
        type: "sentence_transformation",
        question: "Viết lại câu sau thành câu điều kiện loại 2: I don't have time, so I can't help you.",
        hint: "If I had",
        answer: "If I had time, I would help you.",
        explanationVi:
          "Hiện tại không có thời gian (sự thật) → giả định ngược lại: If I had time; kết quả can't help chuyển thành would help. Kiến thức cần nhớ: loại 2 luôn nói ngược với thực tế hiện tại.",
      },
      {
        id: "011-so1",
        type: "sentence_ordering",
        question: "Sắp xếp các từ thành câu có nghĩa.",
        words: ["If", "you", "heat", "ice", "it", "melts"],
        answer: "If you heat ice it melts",
        explanationVi:
          "Đây là điều kiện loại 0: cả hai mệnh đề đều ở hiện tại đơn vì nói về quy luật tự nhiên. Kiến thức cần nhớ: loại 0 không dùng will/would ở bất kỳ mệnh đề nào.",
      },
      {
        id: "011-wf1",
        type: "word_formation",
        question: "If we don't protect the environment, many animals will lose their natural ___ (habit).",
        answer: "habitat",
        explanationVi:
          "Sau tính từ 'natural' cần danh từ: habit (thói quen) → habitat (môi trường sống). Kiến thức cần nhớ: habitat là danh từ chỉ nơi sinh sống của động thực vật, khác hẳn habit là thói quen.",
      },
    ],
  },
];
