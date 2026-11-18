// Chuyên đề ngữ pháp B1 — MỆNH ĐỀ QUAN HỆ (Relative Clauses). Xem README §4.2 và §4.7.

export const GRAMMAR_RELATIVE = [
  {
    id: "B1_GRAMMAR_013",
    title: "Relative Clauses - Mệnh đề quan hệ",
    category: "relative",
    level: "B1",
    difficulty: "medium",
    content: {
      explanationVi:
        "Mệnh đề quan hệ bổ nghĩa cho danh từ đứng ngay trước nó, giúp nối hai câu ngắn thành một câu đầy đủ thông tin. " +
        "Đại từ quan hệ được chọn theo danh từ mà nó thay thế: who cho người, which cho vật, that cho cả người và vật, whose chỉ sự sở hữu, where cho nơi chốn và when cho thời gian. " +
        "Khi đại từ quan hệ làm tân ngữ trong mệnh đề, ta có thể lược bỏ nó: The book (that) I bought is new.",
      formula: "N (người) + who/that | N (vật) + which/that | N + whose + N | place + where | time + when",
      usageVi: [
        "Bổ nghĩa cho người: The woman who lives next door is a doctor.",
        "Bổ nghĩa cho vật và sự việc: This is the film which won the award.",
        "Sở hữu bằng whose: The boy whose bike was stolen is my classmate.",
      ],
      examples: [
        { english: "The woman who lives next door is a doctor.", vietnamese: "Người phụ nữ sống ở nhà bên cạnh là một bác sĩ." },
        { english: "This is the book that I bought yesterday.", vietnamese: "Đây là cuốn sách mà tôi đã mua hôm qua." },
        { english: "The man whose car was stolen called the police.", vietnamese: "Người đàn ông bị mất trộm xe đã gọi cảnh sát." },
      ],
      mistakesVi: [
        "Dùng which cho người: 'The man which helped me' → The man who helped me.",
        "Thừa đại từ nhân xưng trong mệnh đề quan hệ: 'The book that I bought it' → bỏ 'it'.",
        "Dùng what thay cho that/which: 'the things what he said' → the things that he said.",
      ],
    },
    exercises: [
      {
        id: "013-mc1",
        type: "multiple_choice",
        question: "The man ___ lives next door is a teacher.",
        options: ["which", "who", "whose", "where"],
        answer: 1,
        explanationVi:
          "Danh từ đứng trước là người (The man) và đại từ làm chủ ngữ → who. Kiến thức cần nhớ: which chỉ dùng cho vật, whose chỉ sở hữu, where chỉ nơi chốn.",
      },
      {
        id: "013-fb1",
        type: "fill_blank",
        question: "The girl ___ bag was stolen is crying. (điền đại từ quan hệ chỉ sở hữu)",
        answer: "whose",
        explanationVi:
          "Sau chỗ trống là danh từ bag thuộc về the girl → quan hệ sở hữu: whose. Kiến thức cần nhớ: whose + danh từ = 'mà … của người/vật đó'.",
      },
      {
        id: "013-ec1",
        type: "error_correction",
        question: "Tìm và sửa lỗi sai trong câu sau.",
        sentence: "The woman which teaches us English is from Canada.",
        answer: "who",
        explanationVi:
          "The woman là người nên đại từ quan hệ phải là who, không phải which. Kiến thức cần nhớ: người → who/that; vật → which/that.",
      },
      {
        id: "013-st1",
        type: "sentence_transformation",
        question: "Nối hai câu sau bằng đại từ quan hệ: I met a girl. She can speak five languages.",
        hint: "who",
        answer: "I met a girl who can speak five languages.",
        explanationVi:
          "Danh từ chung là a girl (người) và she là chủ ngữ của câu thứ hai → thay bằng who. Kiến thức cần nhớ: mệnh đề quan hệ đứng ngay sau danh từ nó bổ nghĩa.",
      },
      {
        id: "013-so1",
        type: "sentence_ordering",
        question: "Sắp xếp các từ thành câu có nghĩa.",
        words: ["The", "student", "who", "won", "the", "prize", "is", "my", "friend"],
        answer: "The student who won the prize is my friend",
        explanationVi:
          "Mệnh đề quan hệ 'who won the prize' chèn ngay sau chủ ngữ The student, sau đó mới đến động từ chính is. Kiến thức cần nhớ: đừng tách danh từ khỏi mệnh đề quan hệ của nó.",
      },
      {
        id: "013-wf1",
        type: "word_formation",
        question: "A ___ (library) is a person who works in a library.",
        answer: "librarian",
        explanationVi:
          "Câu định nghĩa 'a person who works in a library' cần danh từ chỉ người: library → librarian. Kiến thức cần nhớ: danh từ nơi chốn/ngành + -ian/-arian tạo danh từ nghề nghiệp.",
      },
    ],
  },
];
