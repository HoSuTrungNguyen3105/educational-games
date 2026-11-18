// Chuyên đề ngữ pháp B1 — ĐỘNG TỪ KHUYẾT THIẾU (Modal Verbs). Xem README §4.2 và §4.7.

export const GRAMMAR_MODALS = [
  {
    id: "B1_GRAMMAR_009",
    title: "Modal Verbs - Động từ khuyết thiếu",
    category: "modals",
    level: "B1",
    difficulty: "medium",
    content: {
      explanationVi:
        "Động từ khuyết thiếu (can, could, may, might, must, should…) đứng trước động từ chính để thể hiện khả năng, sự cho phép, nghĩa vụ hoặc lời khuyên. " +
        "Sau động từ khuyết thiếu, động từ chính luôn ở dạng nguyên mẫu không 'to' (ngoại lệ: ought to). " +
        "Bản thân động từ khuyết thiếu không chia theo chủ ngữ và không thêm -s ở ngôi thứ ba.",
      formula: "S + modal (can/could/may/might/must/should) + V(bare)",
      usageVi: [
        "Khả năng: can (hiện tại), could (quá khứ/nói lịch sự): She can speak three languages.",
        "Nghĩa vụ và lời khuyên: must (bắt buộc, luật lệ), should (nên, khuyên nhủ).",
        "Khả năng xảy ra: may/might (có thể): It might rain later.",
      ],
      examples: [
        { english: "You should see a doctor if the pain continues.", vietnamese: "Bạn nên đi gặp bác sĩ nếu cơn đau vẫn tiếp tục." },
        { english: "Students must wear uniforms on Mondays.", vietnamese: "Học sinh phải mặc đồng phục vào thứ Hai." },
        { english: "It might rain later, so take an umbrella.", vietnamese: "Trời có thể mưa lát nữa, nên hãy mang theo ô." },
      ],
      mistakesVi: [
        "Thêm 'to' sau modal: 'You should to rest' → You should rest.",
        "Nhầm mustn't (cấm, không được phép) với don't have to (không cần thiết): bỏ mũ bảo hiểm khi đi xe máy là mustn't, không phải don't have to.",
        "Chia modal theo chủ ngữ: 'He cans swim' → He can swim.",
      ],
    },
    exercises: [
      {
        id: "009-mc1",
        type: "multiple_choice",
        question: "You look very tired. You ___ go to bed early tonight.",
        options: ["should", "mustn't", "can to", "would to"],
        answer: 0,
        explanationVi:
          "Đây là lời khuyên cho người đang mệt → should. Kiến thức cần nhớ: should + V(nguyên mẫu) = nên làm gì; mustn't nghĩa là cấm, không phù hợp ngữ cảnh.",
      },
      {
        id: "009-fb1",
        type: "fill_blank",
        question: "You ___ (should / see) a doctor about that cough.",
        answer: "should see",
        explanationVi:
          "Động từ khuyết thiếu should đi thẳng với động từ nguyên mẫu: should see. Kiến thức cần nhớ: sau should/can/must không bao giờ có 'to' hay dạng -ing.",
      },
      {
        id: "009-ec1",
        type: "error_correction",
        question: "Tìm và sửa lỗi sai trong câu sau.",
        sentence: "You should to drink more water.",
        answer: "drink",
        explanationVi:
          "Sau should phải bỏ 'to', động từ về nguyên mẫu: drink. Kiến thức cần nhớ: modal + V(bare) — chỉ ought mới đi với to (ought to).",
      },
      {
        id: "009-st1",
        type: "sentence_transformation",
        question: "Viết lại câu sau dùng 'mustn't': Don't talk during the exam.",
        hint: "mustn't",
        answer: "You mustn't talk during the exam.",
        explanationVi:
          "Câu mệnh lệnh cấm đoán (Don't…) chuyển thành mustn't + động từ nguyên mẫu. Kiến thức cần nhớ: mustn't = bị cấm làm, khác hẳn don't have to = không cần làm.",
      },
      {
        id: "009-so1",
        type: "sentence_ordering",
        question: "Sắp xếp các từ thành câu có nghĩa.",
        words: ["She", "can", "speak", "three", "languages", "fluently"],
        answer: "She can speak three languages fluently",
        explanationVi:
          "Thứ tự: chủ ngữ + can + động từ nguyên mẫu + tân ngữ + trạng từ cách thức. Kiến thức cần nhớ: trạng từ cách thức (fluently) thường đứng cuối câu.",
      },
      {
        id: "009-wf1",
        type: "word_formation",
        question: "You must be ___ (care) when you cross the street.",
        answer: "careful",
        explanationVi:
          "Sau động từ 'be' cần tính từ: care (động từ/danh từ) → careful (tính từ). Kiến thức cần nhớ: danh từ + -ful → tính từ (care → careful, use → useful).",
      },
    ],
  },
];
