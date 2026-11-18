// Chuyên đề ngữ pháp B1 — nhóm THÌ QUÁ KHỨ & TƯƠNG LAI (Past & Future Tenses).
// Xem README §4.2 (schema bài) và §4.7 (schema câu hỏi).
// Mỗi bài có đủ 6 dạng bài tập: multiple_choice, fill_blank, error_correction,
// sentence_transformation, sentence_ordering, word_formation.

export const GRAMMAR_PAST_FUTURE = [
  {
    id: "B1_GRAMMAR_004",
    title: "Past Simple - Thì quá khứ đơn",
    category: "tenses",
    level: "B1",
    difficulty: "easy",
    content: {
      explanationVi:
        "Thì quá khứ đơn dùng cho hành động đã xảy ra và kết thúc hoàn toàn trong quá khứ, thường kèm mốc thời gian rõ ràng như yesterday, last week, ago hoặc một năm cụ thể. " +
        "Động từ có quy tắc thêm -ed, còn động từ bất quy tắc phải học thuộc dạng quá khứ (V2) riêng. " +
        "Trong câu phủ định và nghi vấn, trợ động từ did đã mang dấu quá khứ nên động từ chính luôn trở về dạng nguyên mẫu.",
      formula: "S + V2/ed | S + did not (didn't) + V(bare) | Did + S + V(bare)?",
      usageVi: [
        "Hành động đã kết thúc tại một thời điểm xác định: We moved to Hanoi in 2019.",
        "Chuỗi hành động liên tiếp trong quá khứ (kể chuyện): He came in, sat down and opened the book.",
        "Thói quen hoặc trạng thái trong quá khứ nay không còn: I played chess a lot as a child.",
      ],
      examples: [
        { english: "We visited Da Lat last summer.", vietnamese: "Chúng tôi đã đi thăm Đà Lạt mùa hè năm ngoái." },
        { english: "She didn't watch the match last night.", vietnamese: "Cô ấy đã không xem trận đấu tối qua." },
        { english: "Did you enjoy the school trip yesterday?", vietnamese: "Bạn có thích chuyến đi dã ngoại của trường hôm qua không?" },
      ],
      mistakesVi: [
        "Dùng did kèm động từ quá khứ: 'Did you went?' → Did you go?",
        "Chia sai động từ bất quy tắc: 'I buyed a ticket' → I bought a ticket.",
        "Dùng hiện tại hoàn thành với mốc quá khứ đã kết thúc: 'I have met him yesterday' → I met him yesterday.",
      ],
    },
    exercises: [
      {
        id: "004-mc1",
        type: "multiple_choice",
        question: "We ___ to Da Lat last summer.",
        options: ["go", "goes", "went", "have gone"],
        answer: 2,
        explanationVi:
          "last summer là mốc quá khứ đã kết thúc → quá khứ đơn; go là động từ bất quy tắc: go → went. Kiến thức cần nhớ: yesterday/last…/…ago luôn đi với past simple.",
      },
      {
        id: "004-fb1",
        type: "fill_blank",
        question: "She ___ (buy) a new bike two days ago.",
        answer: "bought",
        explanationVi:
          "two days ago → quá khứ đơn; buy là động từ bất quy tắc: buy → bought. Kiến thức cần nhớ: nhóm bất quy tắc thường gặp buy–bought, see–saw, take–took, give–gave.",
      },
      {
        id: "004-ec1",
        type: "error_correction",
        question: "Tìm và sửa lỗi sai trong câu sau.",
        sentence: "Did you went to the party last night?",
        answer: "go",
        explanationVi:
          "Sau trợ động từ Did, động từ chính phải về nguyên mẫu: go (không phải went) vì did đã mang dấu quá khứ. Kiến thức cần nhớ: Did + S + V(bare)?",
      },
      {
        id: "004-st1",
        type: "sentence_transformation",
        question: "Viết lại câu sau ở dạng phủ định: He finished his homework.",
        hint: "didn't",
        answer: "He didn't finish his homework.",
        explanationVi:
          "Phủ định quá khứ đơn: didn't + động từ nguyên mẫu (finish, không phải finished). Kiến thức cần nhớ: trợ động từ didn't gánh phần quá khứ, động từ chính không chia nữa.",
      },
      {
        id: "004-so1",
        type: "sentence_ordering",
        question: "Sắp xếp các từ thành câu có nghĩa.",
        words: ["They", "played", "chess", "at", "home", "last", "night"],
        answer: "They played chess at home last night",
        explanationVi:
          "Thứ tự: chủ ngữ + động từ quá khứ + tân ngữ + nơi chốn + thời gian. Kiến thức cần nhớ: cụm thời gian last night thường đứng cuối câu.",
      },
      {
        id: "004-wf1",
        type: "word_formation",
        question: "My grandfather told us an ___ (interest) story about his childhood.",
        answer: "interesting",
        explanationVi:
          "Câu chuyện gây hứng thú cho người nghe → tính từ dạng -ing: interesting. Kiến thức cần nhớ: vật/sự việc dùng -ing (interesting), người cảm thấy dùng -ed (interested).",
      },
    ],
  },
  {
    id: "B1_GRAMMAR_005",
    title: "Past Continuous - Thì quá khứ tiếp diễn",
    category: "tenses",
    level: "B1",
    difficulty: "medium",
    content: {
      explanationVi:
        "Thì quá khứ tiếp diễn diễn tả hành động đang diễn ra tại một thời điểm cụ thể trong quá khứ hoặc đang kéo dài thì bị một hành động ngắn khác cắt ngang. " +
        "Hành động dài đang diễn ra dùng quá khứ tiếp diễn, còn hành động ngắn cắt ngang dùng quá khứ đơn. " +
        "Hai hành động cùng kéo dài song song trong quá khứ cũng đều dùng quá khứ tiếp diễn, thường nối bằng while.",
      formula: "S + was/were + V-ing | While + S + was/were + V-ing, S + V2",
      usageVi: [
        "Hành động đang diễn ra tại một mốc giờ quá khứ: At 9 p.m. last night, I was studying.",
        "Hành động dài bị cắt ngang: While I was walking home, it started to rain.",
        "Hai hành động song song: While I was cooking, he was washing the dishes.",
      ],
      examples: [
        { english: "At 9 p.m. last night, I was doing my homework.", vietnamese: "Lúc 9 giờ tối qua, tôi đang làm bài tập về nhà." },
        { english: "The phone rang while she was cooking dinner.", vietnamese: "Điện thoại reo trong khi cô ấy đang nấu bữa tối." },
        { english: "It was raining when we left the cinema.", vietnamese: "Trời đang mưa khi chúng tôi rời rạp chiếu phim." },
      ],
      mistakesVi: [
        "Nhầm was/were theo chủ ngữ: 'They was playing' → They were playing.",
        "Dùng quá khứ tiếp diễn cho hành động ngắn cắt ngang: 'While I was cooking, the phone was ringing' → the phone rang.",
        "Dùng quá khứ tiếp diễn cho thói quen quá khứ: 'I was going to school by bus every day' → I went / I used to go.",
      ],
    },
    exercises: [
      {
        id: "005-mc1",
        type: "multiple_choice",
        question: "At 8 o'clock last night, we ___ dinner.",
        options: ["have", "are having", "were having", "had"],
        answer: 2,
        explanationVi:
          "Mốc thời gian 8 o'clock last night nằm trong quá khứ và hành động đang diễn ra lúc đó → quá khứ tiếp diễn: were having. Kiến thức cần nhớ: we/you/they + were + V-ing.",
      },
      {
        id: "005-fb1",
        type: "fill_blank",
        question: "It ___ (snow) when we left the house this morning.",
        answer: "was snowing",
        explanationVi:
          "Tuyết là hành động nền đang diễn ra khi hành động ngắn (left) xảy ra → quá khứ tiếp diễn: was snowing. Kiến thức cần nhớ: hành động dài dùng was/were + V-ing, hành động cắt ngang dùng quá khứ đơn.",
      },
      {
        id: "005-ec1",
        type: "error_correction",
        question: "Tìm và sửa lỗi sai trong câu sau.",
        sentence: "They was playing football at 5 p.m. yesterday.",
        answer: "were",
        explanationVi:
          "Chủ ngữ They là số nhiều nên to be ở quá khứ phải là were. Kiến thức cần nhớ: I/he/she/it + was; we/you/they + were.",
      },
      {
        id: "005-st1",
        type: "sentence_transformation",
        question: "Viết lại câu sau ở thì quá khứ tiếp diễn: She cooked dinner at 7 p.m. last night.",
        hint: "was cooking",
        answer: "She was cooking dinner at 7 p.m. last night.",
        explanationVi:
          "Đưa hành động về dạng đang diễn ra tại mốc 7 p.m.: she + was + cooking. Kiến thức cần nhớ: quá khứ tiếp diễn nhấn mạnh quá trình, không nhấn mạnh việc hoàn tất.",
      },
      {
        id: "005-so1",
        type: "sentence_ordering",
        question: "Sắp xếp các từ thành câu có nghĩa.",
        words: ["While", "I", "was", "walking", "home", "it", "started", "to", "rain"],
        answer: "While I was walking home it started to rain",
        explanationVi:
          "Mệnh đề While + quá khứ tiếp diễn (hành động dài) đứng trước, mệnh đề chính quá khứ đơn (hành động cắt ngang) đứng sau. Kiến thức cần nhớ: While + was/were + V-ing, S + V2.",
      },
      {
        id: "005-wf1",
        type: "word_formation",
        question: "The children were making a lot of ___ (noisy) in the yard.",
        answer: "noise",
        explanationVi:
          "Sau 'a lot of' cần danh từ: noisy (tính từ) → noise (danh từ). Kiến thức cần nhớ: make a lot of noise là cụm cố định nghĩa là gây ồn ào.",
      },
    ],
  },
  {
    id: "B1_GRAMMAR_006",
    title: "Past Perfect - Thì quá khứ hoàn thành",
    category: "tenses",
    level: "B1",
    difficulty: "hard",
    content: {
      explanationVi:
        "Thì quá khứ hoàn thành dùng để nói một hành động đã hoàn tất TRƯỚC một hành động hoặc thời điểm khác trong quá khứ. " +
        "Khi kể hai việc quá khứ, việc xảy ra trước dùng quá khứ hoàn thành, việc xảy ra sau dùng quá khứ đơn để người nghe thấy rõ thứ tự. " +
        "Thì này là kiến thức mở rộng ở B1: chỉ dùng khi thật sự cần làm rõ thứ tự trước–sau, không dùng cho mọi hành động quá khứ.",
      formula: "S + had + V3/ed | Before/After + S + had + V3, S + V2",
      usageVi: [
        "Việc hoàn tất trước một việc quá khứ khác: The film had started before we arrived.",
        "Đi với by the time, before, after, when: By the time he got home, everyone had eaten.",
        "Trong câu tường thuật, quá khứ đơn của lời nói trực tiếp lùi thành quá khứ hoàn thành: 'I saw it' → He said he had seen it.",
      ],
      examples: [
        { english: "When I arrived at the cinema, the film had already started.", vietnamese: "Khi tôi đến rạp, bộ phim đã bắt đầu rồi." },
        { english: "She had finished her homework before her mother came home.", vietnamese: "Cô ấy đã làm xong bài tập trước khi mẹ về nhà." },
        { english: "I had never seen snow before I visited Sa Pa.", vietnamese: "Tôi chưa từng thấy tuyết trước khi đến thăm Sa Pa." },
      ],
      mistakesVi: [
        "Lạm dụng quá khứ hoàn thành cho mọi việc quá khứ: kể một việc đơn lẻ thì chỉ cần quá khứ đơn.",
        "Dùng had + V2: 'He had went home' → He had gone home (phải là V3).",
        "Nhầm với hiện tại hoàn thành: mốc neo là quá khứ thì dùng had, mốc neo là hiện tại mới dùng have/has.",
      ],
    },
    exercises: [
      {
        id: "006-mc1",
        type: "multiple_choice",
        question: "When we got to the station, the train ___.",
        options: ["already leaves", "has already left", "had already left", "leaves"],
        answer: 2,
        explanationVi:
          "Việc tàu rời đi xảy ra TRƯỚC việc chúng tôi đến ga (cả hai đều ở quá khứ) → quá khứ hoàn thành: had already left. Kiến thức cần nhớ: việc trước dùng had + V3, việc sau dùng quá khứ đơn.",
      },
      {
        id: "006-fb1",
        type: "fill_blank",
        question: "She ___ (finish) her essay before the teacher collected it.",
        answer: "had finished",
        explanationVi:
          "Hoàn thành bài luận xảy ra trước khi giáo viên thu bài → had finished. Kiến thức cần nhớ: Before + quá khứ đơn ở vế sau thì vế trước thường là quá khứ hoàn thành.",
      },
      {
        id: "006-ec1",
        type: "error_correction",
        question: "Tìm và sửa lỗi sai trong câu sau.",
        sentence: "He had went home before the rain started.",
        answer: "gone",
        explanationVi:
          "Sau had phải là quá phân từ V3: go → went → gone. Kiến thức cần nhớ: had + V3, không bao giờ had + V2.",
      },
      {
        id: "006-st1",
        type: "sentence_transformation",
        question: "Viết lại câu sau ở dạng phủ định: They had seen the film before.",
        hint: "not",
        answer: "They had not seen the film before.",
        explanationVi:
          "Phủ định quá khứ hoàn thành: đặt not ngay sau had (had not / hadn't), giữ nguyên V3. Kiến thức cần nhớ: cấu trúc phủ định giống hiện tại hoàn thành, chỉ thay have/has bằng had.",
      },
      {
        id: "006-so1",
        type: "sentence_ordering",
        question: "Sắp xếp các từ thành câu có nghĩa.",
        words: ["I", "had", "never", "tried", "sushi", "before", "that", "day"],
        answer: "I had never tried sushi before that day",
        explanationVi:
          "Thứ tự: chủ ngữ + had + never + V3 (tried). Kiến thức cần nhớ: never trong câu hoàn thành đứng giữa had và V3.",
      },
      {
        id: "006-wf1",
        type: "word_formation",
        question: "By the time we arrived, the ___ (decide) had already been made.",
        answer: "decision",
        explanationVi:
          "Sau mạo từ 'the' cần danh từ: decide (động từ) → decision (danh từ). Kiến thức cần nhớ: -cide → -cision (decide → decision).",
      },
    ],
  },
  {
    id: "B1_GRAMMAR_007",
    title: "Future Simple - Thì tương lai đơn",
    category: "tenses",
    level: "B1",
    difficulty: "easy",
    content: {
      explanationVi:
        "Thì tương lai đơn với will dùng cho quyết định đưa ra ngay tại thời điểm nói, lời hứa, lời đề nghị giúp đỡ và dự đoán dựa trên ý kiến cá nhân. " +
        "Sau will, động từ luôn ở dạng nguyên mẫu không chia, dù chủ ngữ là gì. " +
        "Với kế hoạch đã quyết định và sắp xếp từ trước, người bản ngữ thường ưu tiên be going to hoặc hiện tại tiếp diễn hơn will.",
      formula: "S + will + V(bare) | S + will not (won't) + V(bare) | Will + S + V(bare)?",
      usageVi: [
        "Quyết định tức thời lúc nói: 'The phone is ringing.' — 'I'll get it.'",
        "Lời hứa, đề nghị, yêu cầu: I will help you; Will you open the window, please?",
        "Dự đoán theo ý kiến (I think, probably, I'm sure): I think our team will win.",
      ],
      examples: [
        { english: "I think our team will win the match tomorrow.", vietnamese: "Tôi nghĩ đội của chúng ta sẽ thắng trận đấu ngày mai." },
        { english: "Don't worry, I will help you with those heavy boxes.", vietnamese: "Đừng lo, tôi sẽ giúp bạn với mấy cái thùng nặng đó." },
        { english: "It will probably rain this weekend, so take an umbrella.", vietnamese: "Cuối tuần này có thể sẽ mưa, nên hãy mang theo ô." },
      ],
      mistakesVi: [
        "Thêm 'to' sau will: 'I will to help you' → I will help you.",
        "Chia động từ sau will: 'She will comes' → She will come.",
        "Dùng will cho lịch trình cố định của phương tiện (tàu, máy bay) — trường hợp đó dùng hiện tại đơn: The train leaves at 7.15.",
      ],
    },
    exercises: [
      {
        id: "007-mc1",
        type: "multiple_choice",
        question: "— This box is too heavy. — Don't worry, I ___ you carry it.",
        options: ["help", "will help", "am helped", "helped"],
        answer: 1,
        explanationVi:
          "Đây là lời đề nghị giúp đỡ đưa ra ngay lúc nói → will help. Kiến thức cần nhớ: quyết định tức thời và lời hứa dùng will + V(nguyên mẫu).",
      },
      {
        id: "007-fb1",
        type: "fill_blank",
        question: "I think it ___ (rain) tomorrow.",
        answer: "will rain",
        explanationVi:
          "Dự đoán kèm 'I think' → will rain. Kiến thức cần nhớ: I think / I hope / probably + will là dấu hiệu của tương lai đơn.",
      },
      {
        id: "007-ec1",
        type: "error_correction",
        question: "Tìm và sửa lỗi sai trong câu sau.",
        sentence: "He will comes home late tonight.",
        answer: "come",
        explanationVi:
          "Sau will, động từ phải ở nguyên mẫu không thêm -s: come. Kiến thức cần nhớ: will + V(bare) cho mọi chủ ngữ.",
      },
      {
        id: "007-st1",
        type: "sentence_transformation",
        question: "Viết lại câu sau dùng 'will': I promise to return your book tomorrow.",
        hint: "will",
        answer: "I will return your book tomorrow.",
        explanationVi:
          "Lời hứa là một trong những cách dùng chính của will: promise to return → will return. Kiến thức cần nhớ: I promise I will… là cấu trúc hứa hẹn tự nhiên.",
      },
      {
        id: "007-so1",
        type: "sentence_ordering",
        question: "Sắp xếp các từ thành câu có nghĩa.",
        words: ["Our", "team", "will", "win", "the", "match", "tomorrow"],
        answer: "Our team will win the match tomorrow",
        explanationVi:
          "Thứ tự: chủ ngữ + will + động từ nguyên mẫu + tân ngữ + thời gian. Kiến thức cần nhớ: will đứng ngay sau chủ ngữ, trước động từ chính.",
      },
      {
        id: "007-wf1",
        type: "word_formation",
        question: "The weather forecast is not always ___ (rely).",
        answer: "reliable",
        explanationVi:
          "Sau động từ 'is' và trạng từ 'always' cần tính từ: rely (động từ) → reliable (tính từ). Kiến thức cần nhớ: động từ tận cùng -y → -iable (rely → reliable).",
      },
    ],
  },
  {
    id: "B1_GRAMMAR_008",
    title: "Be Going To - Tương lai gần",
    category: "tenses",
    level: "B1",
    difficulty: "easy",
    content: {
      explanationVi:
        "Cấu trúc be going to dùng cho dự định, kế hoạch đã quyết định trước thời điểm nói và cho dự đoán dựa trên dấu hiệu đang thấy ở hiện tại. " +
        "Khác với will (quyết định tức thời), be going to cho thấy người nói đã suy nghĩ và chuẩn bị trước. " +
        "Công thức luôn cần to be (am/is/are) đi kèm, và động từ chính sau going to ở dạng nguyên mẫu.",
      formula: "S + am/is/are + going to + V(bare)",
      usageVi: [
        "Kế hoạch, dự định đã quyết trước: We're going to visit Hue next month (đã mua vé).",
        "Dự đoán có bằng chứng hiện tại: Look at the clouds! It's going to rain.",
        "Ý định nghề nghiệp, học tập lâu dài: He is going to study medicine.",
      ],
      examples: [
        { english: "Look at those black clouds! It is going to rain.", vietnamese: "Nhìn những đám mây đen kia kìa! Trời sắp mưa rồi." },
        { english: "We are going to visit our grandparents this weekend.", vietnamese: "Cuối tuần này chúng tôi sẽ đi thăm ông bà." },
        { english: "He is going to study medicine after he finishes school.", vietnamese: "Anh ấy dự định học ngành y sau khi tốt nghiệp." },
      ],
      mistakesVi: [
        "Quên to be: 'I going to travel' → I am going to travel.",
        "Dùng V-ing sau going to: 'going to swimming' → going to swim.",
        "Dùng be going to cho quyết định vừa nảy ra ngay lúc nói (nên dùng will): chuông cửa reo → 'I'll get it.'",
      ],
    },
    exercises: [
      {
        id: "008-mc1",
        type: "multiple_choice",
        question: "Look at the dark clouds! It ___ rain.",
        options: ["is going to", "will helps", "goes to", "rained"],
        answer: 0,
        explanationVi:
          "Có bằng chứng ở hiện tại (mây đen) cho dự đoán sắp xảy ra → is going to rain. Kiến thức cần nhớ: dự đoán dựa trên dấu hiệu nhìn thấy được → be going to.",
      },
      {
        id: "008-fb1",
        type: "fill_blank",
        question: "We ___ (travel) to Hue next month. We have already bought the tickets.",
        answer: "are going to travel",
        explanationVi:
          "Việc đã lên kế hoạch và mua vé rồi → are going to travel. Kiến thức cần nhớ: kế hoạch đã quyết trước thời điểm nói dùng be going to, không dùng will.",
      },
      {
        id: "008-ec1",
        type: "error_correction",
        question: "Tìm và sửa lỗi sai trong câu sau.",
        sentence: "I am going to swimming tomorrow morning.",
        answer: "swim",
        explanationVi:
          "Sau going to phải là động từ nguyên mẫu: swim. Kiến thức cần nhớ: be going to + V(bare), không phải V-ing.",
      },
      {
        id: "008-st1",
        type: "sentence_transformation",
        question: "Viết lại câu sau dùng 'be going to': They plan to build a new library.",
        hint: "going to",
        answer: "They are going to build a new library.",
        explanationVi:
          "plan to do something (dự định) chuyển thành are going to build. Kiến thức cần nhớ: They + are going to + V(nguyên mẫu).",
      },
      {
        id: "008-so1",
        type: "sentence_ordering",
        question: "Sắp xếp các từ thành câu có nghĩa.",
        words: ["He", "is", "going", "to", "learn", "Japanese", "next", "year"],
        answer: "He is going to learn Japanese next year",
        explanationVi:
          "Thứ tự: chủ ngữ + to be + going to + động từ nguyên mẫu + tân ngữ + thời gian. Kiến thức cần nhớ: to be phải hợp với chủ ngữ (he → is).",
      },
      {
        id: "008-wf1",
        type: "word_formation",
        question: "She is going to take part in the singing ___ (compete) next week.",
        answer: "competition",
        explanationVi:
          "Sau mạo từ 'the' và tính từ 'singing' cần danh từ: compete (động từ) → competition (danh từ). Kiến thức cần nhớ: -ete → -etition (compete → competition).",
      },
    ],
  },
];
