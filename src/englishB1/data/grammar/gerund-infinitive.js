// Chuyên đề ngữ pháp B1 — DANH ĐỘNG TỪ & ĐỘNG TỪ NGUYÊN MẪU (Gerunds and Infinitives). Xem README §4.2 và §4.7.

export const GRAMMAR_GERUND_INFINITIVE = [
  {
    id: "B1_GRAMMAR_015",
    title: "Gerunds and Infinitives - Danh động từ và động từ nguyên mẫu",
    category: "gerund-infinitive",
    level: "B1",
    difficulty: "hard",
    content: {
      explanationVi:
        "Khi hai động từ đứng liền nhau, động từ thứ hai ở dạng V-ing hay to V là do động từ thứ nhất quyết định, và phần lớn phải học theo từng động từ cụ thể. " +
        "Các động từ như enjoy, avoid, suggest, finish luôn đi với V-ing, trong khi decide, hope, plan, promise luôn đi với to V. " +
        "Một số động từ như stop, remember, try đi được với cả hai dạng nhưng nghĩa thay đổi hẳn, đây là điểm bẫy thường gặp ở trình độ B1.",
      formula: "enjoy/avoid/suggest/finish + V-ing | decide/hope/plan/promise + to V | stop + V-ing (bỏ thói quen) ≠ stop + to V (dừng lại để làm việc khác)",
      usageVi: [
        "Sau enjoy, avoid, mind, suggest, practise: I enjoy reading in the evening.",
        "Sau decide, want, hope, learn, agree: She decided to study abroad.",
        "Sau giới từ luôn là V-ing: He is good at drawing; Thank you for helping me.",
      ],
      examples: [
        { english: "I enjoy reading books in the evening.", vietnamese: "Tôi thích đọc sách vào buổi tối." },
        { english: "She decided to study abroad next year.", vietnamese: "Cô ấy đã quyết định đi du học vào năm tới." },
        { english: "He stopped smoking two years ago.", vietnamese: "Anh ấy đã bỏ hút thuốc cách đây hai năm." },
      ],
      mistakesVi: [
        "Dùng to V sau enjoy: 'I enjoy to read' → I enjoy reading.",
        "Dùng to V sau giới từ: 'She is interested in to learn' → interested in learning.",
        "Nhầm nghĩa của stop: 'He stopped to smoke' (dừng lại để hút thuốc) khác hẳn 'He stopped smoking' (bỏ thuốc).",
      ],
    },
    exercises: [
      {
        id: "015-mc1",
        type: "multiple_choice",
        question: "I enjoy ___ in the sea every summer.",
        options: ["to swim", "swim", "swimming", "swam"],
        answer: 2,
        explanationVi:
          "Sau enjoy bắt buộc dùng V-ing: swimming. Kiến thức cần nhớ: enjoy, avoid, finish, mind, suggest + V-ing.",
      },
      {
        id: "015-fb1",
        type: "fill_blank",
        question: "She promised ___ (help) me with the housework.",
        answer: "to help",
        explanationVi:
          "promise thuộc nhóm đi với to V: promised to help. Kiến thức cần nhớ: promise, decide, hope, plan, agree + to V.",
      },
      {
        id: "015-ec1",
        type: "error_correction",
        question: "Tìm và sửa lỗi sai trong câu sau.",
        sentence: "He is interested in to learn French.",
        answer: "learning",
        explanationVi:
          "Sau giới từ in, động từ phải ở dạng V-ing: interested in learning. Kiến thức cần nhớ: sau MỌI giới từ (in, at, of, for…) đều dùng V-ing.",
      },
      {
        id: "015-st1",
        type: "sentence_transformation",
        question: "Viết lại câu sau dùng động từ nguyên mẫu có 'to': He hopes that he will pass the exam.",
        hint: "hopes to",
        answer: "He hopes to pass the exam.",
        explanationVi:
          "Khi hai mệnh đề cùng chủ ngữ, có thể rút gọn bằng hope + to V: hopes to pass. Kiến thức cần nhớ: cấu trúc rút gọn này chỉ dùng khi chủ ngữ hai vế giống nhau.",
      },
      {
        id: "015-so1",
        type: "sentence_ordering",
        question: "Sắp xếp các từ thành câu có nghĩa.",
        words: ["They", "decided", "to", "move", "to", "a", "bigger", "house"],
        answer: "They decided to move to a bigger house",
        explanationVi:
          "decided + to move là cặp cấu trúc đúng; cụm 'to a bigger house' ở cuối chỉ nơi chốn. Kiến thức cần nhớ: phân biệt hai chữ 'to' — to của nguyên mẫu và to của giới từ.",
      },
      {
        id: "015-wf1",
        type: "word_formation",
        question: "___ (smoke) is bad for your health.",
        answer: "Smoking",
        explanationVi:
          "Vị trí chủ ngữ đầu câu cần danh động từ: Smoking. Kiến thức cần nhớ: V-ing làm chủ ngữ được coi là số ít (is, không phải are).",
      },
    ],
  },
];
