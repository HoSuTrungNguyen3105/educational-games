// Chuyên đề ngữ pháp B1 — CÂU TƯỜNG THUẬT (Reported Speech). Xem README §4.2 và §4.7.

export const GRAMMAR_REPORTED_SPEECH = [
  {
    id: "B1_GRAMMAR_012",
    title: "Reported Speech - Câu tường thuật",
    category: "reported-speech",
    level: "B1",
    difficulty: "medium",
    content: {
      explanationVi:
        "Câu tường thuật dùng để kể lại lời người khác nói mà không trích dẫn nguyên văn. " +
        "Khi động từ tường thuật ở quá khứ (said, asked, told), động từ trong lời kể phải lùi một thì: hiện tại đơn thành quá khứ đơn, hiện tại tiếp diễn thành quá khứ tiếp diễn, will thành would. " +
        "Câu hỏi gián tiếp không còn đảo ngữ và không dùng trợ động từ do/does; câu mệnh lệnh được kể bằng tell/ask + tân ngữ + to V.",
      formula: "S + said (that) + mệnh đề lùi thì | S + asked + if/wh- + mệnh đề khẳng định | S + told + O + (not) to V",
      usageVi: [
        "Kể câu nói: 'I am tired.' → He said that he was tired.",
        "Kể câu hỏi: yes/no dùng if/whether, câu hỏi wh- giữ nguyên từ để hỏi nhưng không đảo ngữ.",
        "Kể mệnh lệnh, yêu cầu: 'Open the door.' → She told me to open the door.",
      ],
      examples: [
        { english: "He said that he was tired.", vietnamese: "Anh ấy nói rằng anh ấy mệt." },
        { english: "She asked me where I lived.", vietnamese: "Cô ấy hỏi tôi sống ở đâu." },
        { english: "The teacher told us to open our books.", vietnamese: "Giáo viên bảo chúng tôi mở sách ra." },
      ],
      mistakesVi: [
        "Giữ đảo ngữ trong câu hỏi gián tiếp: 'She asked where was I' → She asked where I was.",
        "Dùng say với tân ngữ trực tiếp: 'He said me' → He told me (hoặc He said that…).",
        "Quên lùi thì: 'He said he is busy' khi tường thuật lời nói quá khứ → He said he was busy.",
      ],
    },
    exercises: [
      {
        id: "012-mc1",
        type: "multiple_choice",
        question: "'I am busy today,' he said. → He said that he ___ busy that day.",
        options: ["is", "was", "am", "be"],
        answer: 1,
        explanationVi:
          "Động từ tường thuật said ở quá khứ nên am phải lùi thành was, đồng thời today đổi thành that day. Kiến thức cần nhớ: lùi thì khi động từ giới thiệu ở quá khứ.",
      },
      {
        id: "012-fb1",
        type: "fill_blank",
        question: "She asked me where I ___ (live).",
        answer: "lived",
        explanationVi:
          "Câu hỏi trực tiếp 'Where do you live?' khi tường thuật: bỏ do, động từ live lùi thành lived, và không đảo ngữ. Kiến thức cần nhớ: câu hỏi gián tiếp có trật tự của câu khẳng định.",
      },
      {
        id: "012-ec1",
        type: "error_correction",
        question: "Tìm và sửa lỗi sai trong câu sau.",
        sentence: "He said me that he was ill.",
        answer: "told",
        explanationVi:
          "Khi có tân ngữ người nghe (me), phải dùng tell: He told me that…; say chỉ đi với 'to + người' hoặc không có tân ngữ. Kiến thức cần nhớ: say something, tell somebody something.",
      },
      {
        id: "012-st1",
        type: "sentence_transformation",
        question: "Chuyển câu sau sang tường thuật: 'Open your books,' the teacher said to us.",
        hint: "told us to",
        answer: "The teacher told us to open our books.",
        explanationVi:
          "Câu mệnh lệnh được kể bằng told + tân ngữ + to V; your đổi thành our theo người nghe. Kiến thức cần nhớ: tell/ask + O + to V cho mệnh lệnh và yêu cầu.",
      },
      {
        id: "012-so1",
        type: "sentence_ordering",
        question: "Sắp xếp các từ thành câu có nghĩa.",
        words: ["She", "asked", "me", "if", "I", "liked", "music"],
        answer: "She asked me if I liked music",
        explanationVi:
          "Câu hỏi yes/no gián tiếp bắt đầu bằng if, sau đó là mệnh đề khẳng định bình thường (I liked). Kiến thức cần nhớ: asked + O + if + S + V(lùi thì).",
      },
      {
        id: "012-wf1",
        type: "word_formation",
        question: "He gave me some useful ___ (advise) for the interview.",
        answer: "advice",
        explanationVi:
          "Sau 'some useful' cần danh từ: advise là động từ, danh từ tương ứng là advice (không đếm được). Kiến thức cần nhớ: advise (v) ≠ advice (n) — khác cả cách viết lẫn phát âm.",
      },
    ],
  },
];
