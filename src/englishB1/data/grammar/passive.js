// Chuyên đề ngữ pháp B1 — CÂU BỊ ĐỘNG (Passive Voice). Xem README §4.2 và §4.7.

export const GRAMMAR_PASSIVE = [
  {
    id: "B1_GRAMMAR_010",
    title: "Passive Voice - Câu bị động",
    category: "passive",
    level: "B1",
    difficulty: "medium",
    content: {
      explanationVi:
        "Câu bị động dùng khi ta muốn nhấn mạnh hành động hoặc đối tượng chịu tác động, thay vì người thực hiện hành động. " +
        "Tân ngữ của câu chủ động trở thành chủ ngữ của câu bị động, và động từ luôn có dạng to be + quá phân từ (V3). " +
        "Thì của câu bị động nằm ở động từ to be: hiện tại dùng am/is/are, quá khứ dùng was/were, tương lai dùng will be.",
      formula: "S + be (theo thì) + V3/ed (+ by + người thực hiện nếu cần)",
      usageVi: [
        "Không biết hoặc không cần nêu người thực hiện: My bike was stolen yesterday.",
        "Người thực hiện hiển nhiên hoặc không quan trọng: The room is cleaned every day.",
        "Văn phong trang trọng, khoa học, tin tức: The results were published last week.",
      ],
      examples: [
        { english: "The bridge was built in 1998.", vietnamese: "Cây cầu được xây vào năm 1998." },
        { english: "English is spoken in many countries.", vietnamese: "Tiếng Anh được nói ở nhiều quốc gia." },
        { english: "The room is cleaned every day.", vietnamese: "Căn phòng được dọn dẹp mỗi ngày." },
      ],
      mistakesVi: [
        "Thiếu động từ to be: 'The letter written yesterday' → The letter was written yesterday.",
        "Dùng V2 thay cho V3 sau be: 'The house was build in 1990' → was built.",
        "Lạm dụng 'by + người thực hiện' khi người thực hiện hiển nhiên: 'The thief was arrested by the police' — câu này đúng nhưng nhiều trường hợp nên bỏ by… cho gọn.",
      ],
    },
    exercises: [
      {
        id: "010-mc1",
        type: "multiple_choice",
        question: "The new library ___ last year.",
        options: ["built", "was built", "is build", "builds"],
        answer: 1,
        explanationVi:
          "Chủ ngữ là vật chịu tác động và mốc last year ở quá khứ → bị động quá khứ: was built. Kiến thức cần nhớ: bị động = be (đúng thì) + V3.",
      },
      {
        id: "010-fb1",
        type: "fill_blank",
        question: "Rice ___ (grow) in the Mekong Delta.",
        answer: "is grown",
        explanationVi:
          "Sự thật ở hiện tại, chủ ngữ Rice không đếm được (số ít) → is grown. Kiến thức cần nhớ: grow → grew → grown (V3 bất quy tắc).",
      },
      {
        id: "010-ec1",
        type: "error_correction",
        question: "Tìm và sửa lỗi sai trong câu sau.",
        sentence: "The windows was cleaned yesterday.",
        answer: "were",
        explanationVi:
          "Chủ ngữ The windows là số nhiều nên to be quá khứ phải là were. Kiến thức cần nhớ: to be trong câu bị động phải hợp số với chủ ngữ mới.",
      },
      {
        id: "010-st1",
        type: "sentence_transformation",
        question: "Chuyển câu sau sang bị động: They built this school in 2010.",
        hint: "was built",
        answer: "This school was built in 2010.",
        explanationVi:
          "Tân ngữ 'this school' lên làm chủ ngữ; built ở quá khứ đơn nên be là was + V3 built. Kiến thức cần nhớ: giữ nguyên mốc thời gian 2010 và thì quá khứ khi chuyển câu.",
      },
      {
        id: "010-so1",
        type: "sentence_ordering",
        question: "Sắp xếp các từ thành câu có nghĩa.",
        words: ["English", "is", "spoken", "in", "many", "countries"],
        answer: "English is spoken in many countries",
        explanationVi:
          "Thứ tự bị động hiện tại: chủ ngữ + is + V3 (spoken) + cụm giới từ. Kiến thức cần nhớ: speak → spoke → spoken.",
      },
      {
        id: "010-wf1",
        type: "word_formation",
        question: "The report was written by a famous ___ (journal).",
        answer: "journalist",
        explanationVi:
          "Sau mạo từ 'a' và tính từ 'famous' cần danh từ chỉ người: journal (tạp chí) → journalist (nhà báo). Kiến thức cần nhớ: danh từ + -ist → người làm nghề (journal → journalist, science → scientist).",
      },
    ],
  },
];
