// Chuyên đề ngữ pháp B1 — nhóm THÌ (Tenses). Xem README §4.2 (schema bài) và §4.7 (schema câu hỏi).
// Mỗi bài có đúng 6 dạng bài tập (2 câu/dạng = 12 câu): multiple_choice, fill_blank,
// error_correction, sentence_transformation, sentence_ordering, word_formation.
// Câu hỏi dùng "___" làm chỗ trống; exercise.id mang mã bài để dễ truy vết khi chấm.

export const GRAMMAR_TENSES = [
  {
    id: "B1_GRAMMAR_001",
    title: "Present Simple - Thì hiện tại đơn",
    category: "tenses",
    level: "B1",
    difficulty: "easy",
    content: {
      explanationVi:
        "Thì hiện tại đơn dùng để diễn tả thói quen, sự thật và lịch trình cố định. " +
        "Chủ ngữ là he/she/it (số ít, thứ ba) thì động từ chính phải thêm -s hoặc -es. " +
        "Thì này không dùng cho hành động đang xảy ra ngay lúc nói — việc đó thuộc thì hiện tại tiếp diễn. " +
        "Trong câu nghi vấn và câu phủ định, dùng do/does rồi trả động từ về dạng nguyên mẫu.",
      formula: "S + V(s/es) | S + do/does + V(bare)",
      usageVi: [
        "Diễn tả thói quen, việc làm đều đặn: every day, usually, often, on Sundays…",
        "Diễn tả sự thật, quy luật tự nhiên: The sun rises in the east.",
        "Diễn tả lịch trình, thời gian biểu cố định: máy bay cất cánh, lớp học bắt đầu…",
      ],
      examples: [
        { english: "My brother plays football every Saturday afternoon.", vietnamese: "Anh trai tôi đá bóng mỗi chiều thứ Bảy." },
        { english: "Do your classmates take the bus to school?", vietnamese: "Các bạn cùng lớp bạn có đi học bằng xe buýt không?" },
        { english: "The morning train to Da Nang leaves at 7.15.", vietnamese: "Tàu sáng đi Đà Nẵng khởi hành lúc 7 giờ 15." },
      ],
      mistakesVi: [
        "Quên thêm -s cho he/she/it: 'She go to school by bike' → She goes.",
        "Dùng hiện tại đơn với từ chỉ thời gian hiện tại (now, at the moment): 'I study English now' → I am studying.",
        "Trong câu phủ định đặt 'not' sau động từ chính: 'She not likes coffee' → She doesn't like coffee.",
      ],
    },
    exercises: [
      {
        id: "001-mc1",
        type: "multiple_choice",
        question: "My brother ___ football every Saturday afternoon.",
        options: ["play", "plays", "is playing", "played"],
        answer: 1,
        explanationVi:
          "Chủ ngữ my brother là số ít, thứ ba và có mốc thời gian lặp (every Saturday) → thì hiện tại đơn, thêm -s: plays. Kiến thức cần nhớ: he/she/it + V(s/es).",
      },
      {
        id: "001-mc2",
        type: "multiple_choice",
        question: "___ your classmates take the bus to school?",
        options: ["Do", "Does", "Are", "Is"],
        answer: 0,
        explanationVi:
          "your classmates là danh từ số nhiều nên dùng Do; Does chỉ dùng cho he/she/it. Kiến thức cần nhớ: câu hỏi hiện tại đơn = Do/Does + S + V(nguyên mẫu).",
      },
      {
        id: "001-fb1",
        type: "fill_blank",
        question: "The morning train to Da Nang ___ (leave) at 7.15 every day.",
        answer: "leaves",
        explanationVi:
          "Đây là lịch trình cố định nên dùng hiện tại đơn; chủ ngữ số ít (the train) nên động từ thêm -s: leaves. Kiến thức cần nhớ: giờ giấc, chuyến tàu/buýt cố định → present simple.",
      },
      {
        id: "001-fb2",
        type: "fill_blank",
        question: "Nam usually ___ (go) to the library on Sundays.",
        answer: "goes",
        explanationVi:
          "usually + on Sundays chỉ thói quen lặp → hiện tại đơn; Nam = he → goes (go + es). Kiến thức cần nhớ: go → goes, have → has, do → does ở chủ ngữ số ít.",
      },
      {
        id: "001-ec1",
        type: "error_correction",
        question: "Tìm và sửa lỗi sai trong câu sau.",
        sentence: "She don't like coffee before bed.",
        answer: "doesn't",
        explanationVi:
          "Chủ ngữ she là số ít nên助助 phải là doesn't chứ không phải don't. Kiến thức cần nhớ: don't → I/you/we/they; doesn't → he/she/it (và động từ về nguyên mẫu: doesn't like).",
      },
      {
        id: "001-ec2",
        type: "error_correction",
        question: "Tìm và sửa lỗi sai trong câu sau.",
        sentence: "He go to work by motorbike every day.",
        answer: "goes",
        explanationVi:
          "every day → hiện tại đơn; chủ ngữ he (số ít, thứ ba) nên động từ phải là goes. Kiến thức cần nhớ: chỉ thêm -s/-es ởchủ ngữ he/she/it, không thêm ở I/you/we/they.",
      },
      {
        id: "001-st1",
        type: "sentence_transformation",
        question: "Viết lại câu sau dùng từ gợi ý trong ngoặc: She eats junk food.",
        hint: "never",
        answer: "She never eats junk food.",
        explanationVi:
          "Trạng từ tần suất (never, always, usually) đứng trước động từ thường nhưng sau động từ to be. Kiến thức cần nhớ: She never eats… (không phải She eats never…).",
      },
      {
        id: "001-st2",
        type: "sentence_transformation",
        question: "Đặt câu hỏi với 'Where' cho từ gạch chân: They live in Can Tho.",
        hint: "Where",
        answer: "Where do they live in Can Tho?",
        explanationVi:
          "they là số nhiều nên dùng Do; động từ live giữ nguyên dạng. Kiến thức cần nhớ: Where + do/does + S + V(nguyên mẫu) + …?",
      },
      {
        id: "001-so1",
        type: "sentence_ordering",
        question: "Sắp xếp các từ thành câu có nghĩa.",
        words: ["The", "bus", "leaves", "at", "six", "every", "morning"],
        answer: "The bus leaves at six every morning",
        explanationVi:
          "Thứ tự đúng: chủ ngữ (The bus) + động từ (leaves) + mốc thời gian (at six every morning). Kiến thức cần nhớ: thời gian cụm đứng sau cùng, giới từ at dùng với giờ.",
      },
      {
        id: "001-so2",
        type: "sentence_ordering",
        question: "Sắp xếp các từ thành câu phủ định có nghĩa.",
        words: ["Tom", "usually", "does", "not", "eat", "breakfast", "at", "home"],
        answer: "Tom usually does not eat breakfast at home",
        explanationVi:
          "Câu phủ định hiện tại đơn với chủ ngữ số ít: does not + V(nguyên mẫu); trạng từ usually đứng trước does. Kiến thức cần nhớ: trợ động từ đứng ngay sau chủ ngữ, động từ chính không thêm -s.",
      },
      {
        id: "001-wf1",
        type: "word_formation",
        question: "My sister wants to be a ___ (dance) when she grows up.",
        answer: "dancer",
        explanationVi:
          "Từ danh từ chỉ người nghề nghiệp được tạo từ động từ + -er: dance → dancer. Kiến thức cần nhớ: dance ends with -e nên chỉ thêm -r (không phải danceer).",
      },
      {
        id: "001-wf2",
        type: "word_formation",
        question: "He answered the question ___ (correct).",
        answer: "correctly",
        explanationVi:
          "Chỉ cách làm việc nên dùng trạng từ: correct (tính từ) → correctly (trạng từ, thêm -ly). Kiến thức cần nhớ: adjective + -ly → adverb (careful → carefully, easy → easily).",
      },
    ],
  },
  {
    id: "B1_GRAMMAR_002",
    title: "Present Continuous - Thì hiện tại tiếp diễn",
    category: "tenses",
    level: "B1",
    difficulty: "easy",
    content: {
      explanationVi:
        "Thì hiện tại tiếp diễn dùng để diễn tả hành động đang xảy ra tại thời điểm nói. " +
        "Công thức luôn cần trợ động từ to be (am/is/are) cộng với dạng V-ing của động từ. " +
        "Thì này thường đi kèm các từ chỉ thời gian hiện tại: now, at the moment, currently, Look!, Listen!. " +
        "Một số động từ trạng thái như know, like, want, believe thường không dùng ở dạng tiếp diễn.",
      formula: "S + am/is/are + V-ing | S + am/is/are + not + V-ing | Am/Is/Are + S + V-ing?",
      usageVi: [
        "Hành động xảy ra ngay lúc nói: Look! The baby is crying.",
        "Hành động diễn ra trong khoảng thời gian hiện tại, chưa chắc xảy ra đúng lúc đó: I'm reading a great novel these days.",
        "Kế hoạch đã sắp đặt cho tương lai gần: I'm meeting Nam tomorrow afternoon.",
      ],
      examples: [
        { english: "Be quiet! The baby is sleeping in the next room.", vietnamese: "Im lặng đi! Em bé đang ngủ ở phòng bên." },
        { english: "Water boils at 100 degrees Celsius.", vietnamese: "Nước sôi ở 100 độ C." },
        { english: "Look! The children are playing in the yard.", vietnamese: "Nhìn kìa! Bọn trẻ đang chơi trong sân." },
      ],
      mistakesVi: [
        "Dùng tiếp diễn với động từ trạng thái: 'I am knowing the answer' → I know the answer.",
        "Quên to be: 'He playing football now' → He is playing football now.",
        "Dùng tiếp diễn với thói quen: 'I am usually going to school by bus' → I usually go…",
      ],
    },
    exercises: [
      {
        id: "002-mc1",
        type: "multiple_choice",
        question: "Listen! Someone ___ at the door.",
        options: ["knocks", "is knocking", "knocked", "has knocked"],
        answer: 1,
        explanationVi:
          "Listen! báo hiệu hành động đang xảy ra ngay lúc nói → hiện tại tiếp diễn: is knocking. Kiến thức cần nhớ: Look!/Listen! là dấu hiệu nhận biết của present continuous.",
      },
      {
        id: "002-mc2",
        type: "multiple_choice",
        question: "Water ___ at 100 degrees Celsius.",
        options: ["boils", "is boiling", "boiled", "has boiled"],
        answer: 0,
        explanationVi:
          "Đây là sự thật khoa học, quy luật tự nhiên nên dùng hiện tại đơn (boils), không dùng tiếp diễn dù câu có vẻ 'đang xảy ra'. Kiến thức cần nhớ: sự thật vĩnh cửu → present simple.",
      },
      {
        id: "002-fb1",
        type: "fill_blank",
        question: "Be quiet! The baby ___ (sleep) in the next room.",
        answer: "is sleeping",
        explanationVi:
          "Be quiet! cho thấy hành động đang xảy ra → to be (the baby = is) + V-ing: is sleeping. Kiến thức cần nhớ: chủ ngữ số ít dùng is, số nhiều dùng are.",
      },
      {
        id: "002-fb2",
        type: "fill_blank",
        question: "I ___ (not / watch) TV at the moment - I'm doing my homework.",
        answer: "am not watching",
        explanationVi:
          "at the moment → hiện tại tiếp diễn; chủ ngữ I đi với am → phủ định: am not watching. Kiến thức cần nhớ: phủ định đặt not ngay sau to be.",
      },
      {
        id: "002-ec1",
        type: "error_correction",
        question: "Tìm và sửa lỗi sai trong câu sau.",
        sentence: "My brother is study for the exam right now.",
        answer: "studying",
        explanationVi:
          "right now → hiện tại tiếp diễn nên sau 'is' phải là V-ing: studying. Kiến thức cần nhớ: sau to be ở thì tiếp diễn luôn là dạng -ing.",
      },
      {
        id: "002-ec2",
        type: "error_correction",
        question: "Tìm và sửa lỗi sai trong câu sau.",
        sentence: "Don't shout - the twins is sleeping.",
        answer: "are",
        explanationVi:
          "the twins là chủ ngữ số nhiều nên助助 phải là are. Kiến thức cần nhớ: twins/parents/friends (số nhiều) + are + V-ing.",
      },
      {
        id: "002-st1",
        type: "sentence_transformation",
        question: "Viết lại câu phủ định sau: They are waiting for the bus.",
        hint: "not",
        answer: "They are not waiting for the bus.",
        explanationVi:
          "Phủ định của hiện tại tiếp diễn: đặt not ngay sau to be (are not / aren't). Kiến thức cần nhớ: not nằm giữa to be và V-ing, không đặt sau động từ chính.",
      },
      {
        id: "002-st2",
        type: "sentence_transformation",
        question: "Đặt câu hỏi với 'Where' cho hành động sau: He is working in the garden.",
        hint: "Where",
        answer: "Where is he working?",
        explanationVi:
          "Đảo 'is' lên trước chủ ngữ he, giữ nguyên V-ing: Where is he working? Kiến thức cần nhớ: Where + to be + S + V-ing?",
      },
      {
        id: "002-so1",
        type: "sentence_ordering",
        question: "Sắp xếp các từ thành câu có nghĩa.",
        words: ["The", "students", "are", "discussing", "the", "project", "right", "now"],
        answer: "The students are discussing the project right now",
        explanationVi:
          "Thứ tự: chủ ngữ + to be + V-ing + tân ngữ + trạng từ thời gian. Kiến thức cần nhớ: right now là dấu hiệu của hiện tại tiếp diễn và đứng cuối câu.",
      },
      {
        id: "002-so2",
        type: "sentence_ordering",
        question: "Sắp xếp các từ thành câu nghi vấn có nghĩa.",
        words: ["What", "are", "you", "doing", "this", "weekend"],
        answer: "What are you doing this weekend",
        explanationVi:
          "Câu hỏi hiện tại tiếp diễn:Câu hỏi hiện tại tiếp diễn: từ nghi vấn + trợ động từ + chủ ngữ + V-ing. Kiến thức cần nhớ:助助 (are) đứng ngay sau từ nghi vấn What, trước chủ ngữ you.",
      },
      {
        id: "002-wf1",
        type: "word_formation",
        question: "The kids are very ___ (excite) about the trip.",
        answer: "excited",
        explanationVi:
          "Chủ ngữ là người cảm thấy hào hứng → tính từ dạng -ed: excited. Kiến thức cần nhớ: người/sinh vật dùng -ed (I am excited), vật/sự việc dùng -ing (The trip is exciting).",
      },
      {
        id: "002-wf2",
        type: "word_formation",
        question: "Listen! It ___ (rain) heavily outside.",
        answer: "raining",
        explanationVi:
          "Listen! + đang xảy ra → hiện tại tiếp diễn; từ rain thêm -ing: raining (it is raining). Kiến thức cần nhớ: động từ có 'e' câm cuối thì bỏ e trước khi thêm -ing (write → writing).",
      },
    ],
  },
  {
    id: "B1_GRAMMAR_003",
    title: "Present Perfect - Thì hiện tại hoàn thành",
    category: "tenses",
    level: "B1",
    difficulty: "medium",
    content: {
      explanationVi:
        "Thì hiện tại hoàn thành nối quá khứ với hiện tại: việc đã xảy ra nhưng kết quả hoặc trải nghiệm vẫn liên quan đến bây giờ. " +
        "Công thức dùng have/has cộng với quá phân từ (V3/ed) của động từ. " +
        "Thì này thường đi với các từ: already, yet, just, ever, never, since, for, so far, twice. " +
        "Không dùng thì này với mốc thời gian quá khứ đã kết thúc như yesterday, last week, in 2019.",
      formula: "S + have/has + V3/ed | S + haven't/hasn't + V3 | Have/Has + S + V3?",
      usageVi: [
        "Kết quả hiện tại của việc quá khứ: I've lost my key (→ giờ tôi không mở được cửa).",
        "Trải nghiệm trong quá khứ, không nêu thời gian cụ thể: ever, never, twice, many times…",
        "Hành động bắt đầu trong quá khứ và còn kéo dài đến nay với since/for.",
      ],
      examples: [
        { english: "We have already finished our project.", vietnamese: "Chúng tôi đã hoàn thành dự án rồi." },
        { english: "She has worked in Da Nang since 2019.", vietnamese: "Cô ấy đã làm việc ở Đà Nẵng từ năm 2019." },
        { english: "Have you ever been to Hue?", vietnamese: "Bạn đã bao giờ đi Huế chưa?" },
      ],
      mistakesVi: [
        "Dùng với thời gian quá khứ cụ thể: 'I have seen him yesterday' → I saw him yesterday.",
        "Nhầm have/has theo chủ ngữ hoặc dùng V-ing sai: 'She has went' → She has gone.",
        "Nhầm since với for: since + mốc bắt đầu (since 2019), for + khoảng thời gian (for three years).",
      ],
    },
    exercises: [
      {
        id: "003-mc1",
        type: "multiple_choice",
        question: "I ___ this book twice, and I want to read it again.",
        options: ["have read", "read", "am reading", "was reading"],
        answer: 0,
        explanationVi:
          "twice chỉ số lần trải nghiệm, không nêu thời gian quá khứ cụ thể → hiện tại hoàn thành: have read. Kiến thức cần nhớ: ever/never/twice/many times → present perfect.",
      },
      {
        id: "003-mc2",
        type: "multiple_choice",
        question: "She has lived in Hue ___ 2018.",
        options: ["for", "since", "in", "from"],
        answer: 1,
        explanationVi:
          "2018 là mốc bắt đầu của khoảng thời gian còn tiếp tục → since. Kiến thức cần nhớ: since + ngày/giờ bắt đầu, for + độ dài thời gian (for two years).",
      },
      {
        id: "003-fb1",
        type: "fill_blank",
        question: "I ___ (lose) my wallet, so I can't pay for the meal now.",
        answer: "have lost",
        explanationVi:
          "Việc làm mất ở quá khứ gây ra hậu quả ngay bây giờ (can't pay) → hiện tại hoàn thành: have lost. Kiến thức cần nhớ: kết quả hiện tại → present perfect, không cần nêu thời gian.",
      },
      {
        id: "003-fb2",
        type: "fill_blank",
        question: "I have ___ (see) that film three times already.",
        answer: "seen",
        explanationVi:
          "Sau 'have' phải là quá phân từ V3: see → seen. Kiến thức cần nhớ: see → saw → seen; sau have/has luôn là dạng V3.",
      },
      {
        id: "003-ec1",
        type: "error_correction",
        question: "Tìm và sửa lỗi sai trong câu sau.",
        sentence: "I have seen him yesterday.",
        answer: "saw",
        explanationVi:
          "yesterday là mốc thời gian quá khứ đã kết thúc → bắt buộc quá khứ đơn: saw (không dùng present perfect). Kiến thức cần nhớ: last week/ago/yesterday/in 2019 → past simple.",
      },
      {
        id: "003-ec2",
        type: "error_correction",
        question: "Tìm và sửa lỗi sai trong câu sau.",
        sentence: "She has went to the market already.",
        answer: "gone",
        explanationVi:
          "Sau has phải là quá phân từ V3: go → went → gone. Kiến thức cần nhớ: has/have + V3, không bao giờ + động từ quá khứ đơn.",
      },
      {
        id: "003-st1",
        type: "sentence_transformation",
        question: "Viết lại câu dùng 'since 2020': She bought this laptop in 2020.",
        hint: "since 2020",
        answer: "She has had this laptop since 2020.",
        explanationVi:
          "Mua là việc đã hoàn thành trong quá khứ nhưng laptop vẫn còn đến nay → dùng hiện tại hoàn thành với 'have' (sở hữu): has had. Kiến thức cần nhớ: với động từ sở hữu, hiện tại hoàn thành = have + danh từ.",
      },
      {
        id: "003-st2",
        type: "sentence_transformation",
        question: "Viết lại câu phủ định sau: They have finished the report.",
        hint: "not",
        answer: "They have not finished the report.",
        explanationVi:
          "Phủ định hiện tại hoàn thành: đặt not sau have/has (haven't/hasn't), giữ nguyên V3. Kiến thức cần nhớ: not nằm giữa have/has và V3.",
      },
      {
        id: "003-so1",
        type: "sentence_ordering",
        question: "Sắp xếp các từ thành câu có nghĩa.",
        words: ["She", "has", "just", "graduated", "from", "university"],
        answer: "She has just graduated from university",
        explanationVi:
          "Thứ tự: chủ ngữ + have/has + trạng từ (just) + V3. Kiến thức cần nhớ: just trong hiện tại hoàn thành đứng giữa have/has và V3.",
      },
      {
        id: "003-so2",
        type: "sentence_ordering",
        question: "Sắp xếp các từ thành câu nghi vấn có nghĩa.",
        words: ["Have", "you", "ever", "been", "to", "Japan"],
        answer: "Have you ever been to Japan",
        explanationVi:
          "Câu hỏi trải nghiệm: Have + S + ever + V3? Kiến thức cần nhớ: been là V3 của be, dùng với 'to + địa danh'.",
      },
      {
        id: "003-wf1",
        type: "word_formation",
        question: "This is the most ___ (experience) teacher I have ever met.",
        answer: "experienced",
        explanationVi:
          "Chỉ người có nhiều kinh nghiệm → tính từ dạng -ed: experienced. Kiến thức cần nhớ: danh từ + -ed → tính từ chỉ đặc điểm con người (experience → experienced).",
      },
      {
        id: "003-wf2",
        type: "word_formation",
        question: "I have never heard a more ___ (beauty) song.",
        answer: "beautiful",
        explanationVi:
          "Sau 'a more …' cần tính từ: beauty (danh từ) → beautiful (tính từ). Kiến thức cần nhớ: beauty → beautiful (y đổi thành i, thêm ful).",
      },
    ],
  },
];
