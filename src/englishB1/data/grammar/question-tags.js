// Chuyên đề ngữ pháp B1 — CÂU HỎI ĐUÔI (Question Tags). Xem README §4.2 và §4.7.

export const GRAMMAR_QUESTION_TAGS = [
  {
    id: "B1_GRAMMAR_020",
    title: "Question Tags - Câu hỏi đuôi",
    category: "question-tags",
    level: "B1",
    difficulty: "medium",
    content: {
      explanationVi:
        "Câu hỏi đuôi là phần hỏi ngắn ở cuối câu dùng để xác nhận thông tin hoặc rủ người nghe đồng ý với mình. " +
        "Nguyên tắc cốt lõi là đối dấu: câu chính khẳng định thì đuôi phủ định, câu chính phủ định thì đuôi khẳng định. " +
        "Trợ động từ trong phần đuôi phải lặp lại đúng trợ động từ của câu chính (be, do/does/did, have, can, will…), và chủ ngữ trong đuôi luôn là đại từ nhân xưng.",
      formula: "S + V khẳng định, trợ động từ phủ định + đại từ? | S + V phủ định, trợ động từ khẳng định + đại từ? | I am…, aren't I? | Let's…, shall we?",
      usageVi: [
        "Xác nhận thông tin: You are a student, aren't you?",
        "Câu chính không có trợ động từ thì mượn do/does/did: She plays the piano, doesn't she?",
        "Trường hợp đặc biệt: Let's go, shall we? — Open the door, will you?",
      ],
      examples: [
        { english: "You are a student, aren't you?", vietnamese: "Bạn là học sinh, phải không?" },
        { english: "She doesn't like coffee, does she?", vietnamese: "Cô ấy không thích cà phê, phải không?" },
        { english: "Let's go to the cinema, shall we?", vietnamese: "Chúng ta đi xem phim đi, nhé?" },
      ],
      mistakesVi: [
        "Đuôi cùng dấu với câu chính: 'You are tired, are you?' → aren't you?",
        "Sai trợ động từ: 'He plays football, isn't he?' → doesn't he? (câu chính dùng do/does ngầm).",
        "Giữ nguyên danh từ làm chủ ngữ đuôi: 'Lan is happy, isn't Lan?' → isn't she?",
      ],
    },
    exercises: [
      {
        id: "020-mc1",
        type: "multiple_choice",
        question: "Your sister can swim, ___?",
        options: ["can she", "can't she", "does she", "isn't she"],
        answer: 1,
        explanationVi:
          "Câu chính có modal can và ở dạng khẳng định → đuôi là can't she. Kiến thức cần nhớ: đuôi lặp đúng trợ động từ của câu chính và đổi dấu.",
      },
      {
        id: "020-fb1",
        type: "fill_blank",
        question: "They haven't finished the work, ___ they? (điền trợ động từ của phần đuôi)",
        answer: "have",
        explanationVi:
          "Câu chính phủ định (haven't) → đuôi khẳng định và lặp trợ động từ have: have they. Kiến thức cần nhớ: phủ định → đuôi khẳng định, không thêm not.",
      },
      {
        id: "020-ec1",
        type: "error_correction",
        question: "Tìm và sửa lỗi sai trong câu sau.",
        sentence: "He plays football every Sunday, isn't he?",
        answer: "doesn't",
        explanationVi:
          "Câu chính dùng động từ thường plays (hiện tại đơn) nên phần đuôi phải mượn does: doesn't he. Kiến thức cần nhớ: chỉ khi câu chính có động từ be mới dùng be trong đuôi.",
      },
      {
        id: "020-st1",
        type: "sentence_transformation",
        question: "Thêm câu hỏi đuôi vào câu sau: Let's visit the museum this weekend.",
        hint: "shall we",
        answer: "Let's visit the museum this weekend, shall we?",
        explanationVi:
          "Câu rủ rê bắt đầu bằng Let's luôn có đuôi cố định shall we. Kiến thức cần nhớ: Let's → shall we; mệnh lệnh thường → will you.",
      },
      {
        id: "020-so1",
        type: "sentence_ordering",
        question: "Sắp xếp các từ thành câu có nghĩa.",
        words: ["She", "is", "collecting", "stamps", "isn't", "she"],
        answer: "She is collecting stamps isn't she",
        explanationVi:
          "Câu chính dùng is (khẳng định) → đuôi phủ định isn't she đứng cuối câu. Kiến thức cần nhớ: phần đuôi luôn nằm sau toàn bộ câu chính.",
      },
      {
        id: "020-wf1",
        type: "word_formation",
        question: "It is a ___ (beauty) day, isn't it?",
        answer: "beautiful",
        explanationVi:
          "Trước danh từ day cần tính từ: beauty (danh từ) → beautiful (tính từ). Kiến thức cần nhớ: beauty → beautiful (đổi y thành i rồi thêm -ful).",
      },
    ],
  },
];
