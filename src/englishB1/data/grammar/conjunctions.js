// Chuyên đề ngữ pháp B1 — LIÊN TỪ (Conjunctions). Xem README §4.2 và §4.7.

export const GRAMMAR_CONJUNCTIONS = [
  {
    id: "B1_GRAMMAR_018",
    title: "Conjunctions - Liên từ nối câu",
    category: "conjunctions",
    level: "B1",
    difficulty: "easy",
    content: {
      explanationVi:
        "Liên từ giúp nối các ý trong câu: and thêm ý, but chỉ sự đối lập, or đưa lựa chọn, because nêu nguyên nhân, so nêu kết quả, although nhượng bộ. " +
        "Lỗi phổ biến nhất của người học Việt Nam là dịch đôi liên từ theo tiếng Việt: một câu tiếng Anh chỉ dùng although HOẶC but, because HOẶC so, không dùng cả cặp cùng lúc. " +
        "Sau although, because, when, while luôn phải là một mệnh đề đầy đủ có chủ ngữ và động từ.",
      formula: "Although + mệnh đề, mệnh đề | Mệnh đề because + mệnh đề | Mệnh đề, so + mệnh đề | when/while/before/after + mệnh đề",
      usageVi: [
        "Đối lập và nhượng bộ: Although it rained, we still went out. (= …but…)",
        "Nguyên nhân – kết quả: She stayed at home because she was ill. / She was ill, so she stayed at home.",
        "Thời gian: Call me when you arrive. I read while I was waiting.",
      ],
      examples: [
        { english: "Although it rained heavily, we still went camping.", vietnamese: "Mặc dù trời mưa to, chúng tôi vẫn đi cắm trại." },
        { english: "She stayed at home because she was ill.", vietnamese: "Cô ấy ở nhà vì cô ấy bị ốm." },
        { english: "He studied very hard, so he passed the exam easily.", vietnamese: "Anh ấy học rất chăm, nên anh ấy đã đỗ kỳ thi một cách dễ dàng." },
      ],
      mistakesVi: [
        "Dùng cặp although … but trong cùng một câu: 'Although she was tired, but she worked' → bỏ 'but'.",
        "Dùng cặp because … so trong cùng một câu: chỉ giữ lại một liên từ.",
        "Thiếu mệnh đề sau although: 'Although tired, she…' — ở B1 hãy viết đủ: Although she was tired, she…",
      ],
    },
    exercises: [
      {
        id: "018-mc1",
        type: "multiple_choice",
        question: "___ he is rich, he lives very simply.",
        options: ["Although", "Because", "So", "And"],
        answer: 0,
        explanationVi:
          "Hai vế đối lập nhau (giàu nhưng sống giản dị) → liên từ nhượng bộ Although. Kiến thức cần nhớ: Although + mệnh đề đối lập, và không thêm but ở vế sau.",
      },
      {
        id: "018-fb1",
        type: "fill_blank",
        question: "We cancelled the trip ___ the weather was bad. (điền liên từ chỉ nguyên nhân)",
        answer: "because",
        explanationVi:
          "Vế sau nêu nguyên nhân (thời tiết xấu) → because. Kiến thức cần nhớ: because + mệnh đề nguyên nhân; because of + danh từ/cụm danh từ.",
      },
      {
        id: "018-ec1",
        type: "error_correction",
        question: "Tìm và sửa lỗi sai trong câu sau.",
        sentence: "She speaks English very well and she cannot write it at all.",
        answer: "but",
        explanationVi:
          "Hai vế trái ngược nhau (nói giỏi nhưng không viết được) nên liên từ phải là but, không phải and. Kiến thức cần nhớ: and nối ý cùng chiều, but nối ý ngược chiều.",
      },
      {
        id: "018-st1",
        type: "sentence_transformation",
        question: "Nối hai câu sau bằng 'so': I was very tired. I went to bed early.",
        hint: "so",
        answer: "I was very tired, so I went to bed early.",
        explanationVi:
          "Câu đầu là nguyên nhân, câu sau là kết quả → nối bằng so, có dấu phẩy trước so. Kiến thức cần nhớ: nguyên nhân + so + kết quả; ngược lại dùng because.",
      },
      {
        id: "018-so1",
        type: "sentence_ordering",
        question: "Sắp xếp các từ thành câu có nghĩa.",
        words: ["Although", "it", "was", "cold", "we", "went", "swimming"],
        answer: "Although it was cold we went swimming",
        explanationVi:
          "Mệnh đề nhượng bộ Although + chủ ngữ + động từ đứng trước, mệnh đề chính theo sau. Kiến thức cần nhớ: sau Although phải có đủ chủ ngữ + động từ.",
      },
      {
        id: "018-wf1",
        type: "word_formation",
        question: "He failed the exam because of his ___ (lazy).",
        answer: "laziness",
        explanationVi:
          "Sau because of và tính từ sở hữu 'his' cần danh từ: lazy (tính từ) → laziness (danh từ). Kiến thức cần nhớ: tính từ tận cùng -y → -iness (lazy → laziness, happy → happiness).",
      },
    ],
  },
];
