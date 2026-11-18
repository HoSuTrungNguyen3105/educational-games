// Đề thi thử số 1 — English B1 (VSTEP bậc 3). Xem src/englishB1/README.md §4.8.
export const EXAM_001 = {
  id: "exam-001",
  code: "B1-001",
  name: "Đề thi thử số 1",
  type: "basic",
  level: "B1",
  difficulty: "easy",
  durationMin: 60,
  description:
    "Đề thi thử số 1 mức cơ bản với các tình huống quen thuộc trong đời sống hằng ngày. Phù hợp cho người học làm quen với cấu trúc đề và cách chấm điểm tự động.",
  sections: [
    {
      id: "listening",
      skill: "listening",
      title: "Listening",
      durationMin: 30,
      transcript: [
        "A: Good afternoon. I'd like to book a room for tonight, please.",
        "B: We have a single room available for ninety pounds a night.",
        "A: Actually, I need a double room for two nights.",
        "B: In that case, that will be two hundred pounds altogether.",
        "A: Excuse me, I'd like to borrow this book. Is it still available?",
        "B: Yes, but you must bring it back by Friday next week.",
        "A: Friday? That's the day after tomorrow.",
        "B: Yes, but you can renew it online if you need more time.",
        "A: How do I get to the city museum from here?",
        "B: Take the number 12 bus and get off at the market square.",
        "A: Is it far from the bus stop?",
        "B: No, it's only a two-minute walk behind the old church.",
        "A: Hello, I'd like to make an appointment with Dr. Smith.",
        "B: He's fully booked on Monday, but he's free on Thursday at four o'clock.",
        "A: Thursday afternoon suits me perfectly.",
        "B: Good. Please arrive ten minutes early to fill in a form.",
        "A: How much is a ticket for Saturday's concert?",
        "B: They're thirty pounds each, but students get a twenty-percent discount.",
        "A: I'm a student, so I'll take one, please.",
        "B: That'll be twenty-four pounds, then.",
        "Speaker: Welcome to the information point of the Green Town festival.",
        "Speaker: The festival takes place this Saturday and Sunday in Riverside Park.",
        "Speaker: There will be live music, a food market, and activities for children.",
        "Speaker: Entry is free, but you need a wristband for the evening concerts.",
        "Speaker: Wristbands can be collected at the main gate from ten in the morning until four in the afternoon.",
        "Speaker: Please bring a water bottle, because there are very few shops inside the park.",
        "Speaker: If it rains, the food market will move into the community hall next to the gate.",
        "Speaker: Good morning. Here is the news about the Central Library.",
        "Speaker: From next month, the library will stay open until eight o'clock on weekdays.",
        "Speaker: Saturday hours stay the same, from nine to five.",
        "Speaker: The reading room on the first floor is now open to everyone, not only to members.",
        "Speaker: However, you still need a library card if you want to borrow books.",
        "Speaker: Members can borrow up to eight books at a time and keep them for three weeks.",
        "Speaker: Children under twelve must be accompanied by an adult.",
        "Speaker: Finally, the cafe on the ground floor will close earlier, at six o'clock.",
      ],
      questions: [
        {
          id: 1,
          type: "multiple_choice",
          question: "Part 1. Conversation 1. What does the customer want to book?",
          options: [
            "A single room for one night",
            "A double room for one night",
            "A double room for two nights",
            "A single room for two nights",
          ],
          answer: 2,
          transcriptRef: 2,
          explanationVi:
            "transcriptRef = 2, người nói A xác nhận: 'Actually, I need a double room for two nights' → đáp án C. A và D sai vì loại phòng không đúng; B sai vì thiếu số đêm (khách đổi từ 1 đêm lên 2 đêm ở dòng 2).",
        },
        {
          id: 2,
          type: "multiple_choice",
          question: "Part 1. Conversation 2. When must the book be returned?",
          options: [
            "By Friday next week",
            "By Friday this week",
            "By Wednesday this week",
            "By Sunday next week",
          ],
          answer: 0,
          transcriptRef: 5,
          explanationVi:
            "transcriptRef = 5: 'you must bring it back by Friday next week' → đáp án A. B và C sai vì nhầm tuần (this week); D không được nhắc tới — dòng 6 chỉ nói thứ Sáu là ngày kia, không phải hạn cuối.",
        },
        {
          id: 3,
          type: "multiple_choice",
          question: "Part 1. Conversation 3. How will the visitor get to the city museum?",
          options: [
            "By taxi",
            "By the number 12 bus",
            "On foot for about ten minutes",
            "By the number 21 bus",
          ],
          answer: 1,
          transcriptRef: 9,
          explanationVi:
            "transcriptRef = 9: 'Take the number 12 bus and get off at the market square' → đáp án B. C sai vì chỉ đi bộ 2 phút từ trạm buýt đến bảo tàng (dòng 11); A và D hoàn toàn không được nhắc trong hội thoại.",
        },
        {
          id: 4,
          type: "multiple_choice",
          question: "Part 1. Conversation 4. When is the appointment with Dr. Smith?",
          options: [
            "Thursday at four o'clock",
            "Thursday at two o'clock",
            "Friday at four o'clock",
            "Monday at four o'clock",
          ],
          answer: 0,
          transcriptRef: 13,
          explanationVi:
            "transcriptRef = 13: bác sĩ 'free on Thursday at four o'clock' → đáp án A. D sai vì thứ Hai đã kín lịch (fully booked); B và C sai ở giờ hoặc ngày, không khớp mốc giờ nào trong đoạn.",
        },
        {
          id: 5,
          type: "multiple_choice",
          question: "Part 1. Conversation 5. How much will the student pay for the concert ticket?",
          options: ["£30", "£36", "£24", "£27"],
          answer: 2,
          transcriptRef: 19,
          explanationVi:
            "Vé £30 và sinh viên được giảm 20% (dòng 17): 30 − 6 = £24, dòng 19 xác nhận 'That'll be twenty-four pounds' → đáp án C. A là giá gốc chưa giảm; B là tăng 20%; D là giảm 10%.",
        },
        {
          id: 6,
          type: "multiple_choice",
          question: "Part 2. Talk 1. What is the speaker mainly doing?",
          options: [
            "Reviewing a local restaurant",
            "Giving information about a festival",
            "Selling concert tickets",
            "Reporting the weather forecast",
          ],
          answer: 1,
          transcriptRef: 20,
          explanationVi:
            "transcriptRef = 20–22 mở đầu bằng 'information point' và liệt kê hoạt động của lễ hội → người nói đang cung cấp thông tin (B). C sai vì vé vào cửa miễn phí (dòng 23); A và D không liên quan nội dung đoạn.",
        },
        {
          id: 7,
          type: "multiple_choice",
          question: "Part 2. Talk 1. What does the speaker ask listeners to bring?",
          options: ["A wristband", "A shopping bag", "A water bottle", "A raincoat"],
          answer: 2,
          transcriptRef: 25,
          explanationVi:
            "transcriptRef = 25: 'Please bring a water bottle, because there are very few shops inside the park' → đáp án C. A sai vì vòng tay (wristband) phải tự đến cổng lấy (dòng 24), không phải mang theo; B và D không được nhắc tới.",
        },
        {
          id: 8,
          type: "multiple_choice",
          question: "Part 2. Talk 2. What is the library's new closing time on weekdays?",
          options: ["Eight o'clock", "Six o'clock", "Five o'clock", "Nine o'clock"],
          answer: 0,
          transcriptRef: 28,
          explanationVi:
            "transcriptRef = 28: 'the library will stay open until eight o'clock on weekdays' → đáp án A. B là giờ đóng cửa của quán cafe (dòng 34); C là giờ đóng cửa thứ Bảy (dòng 29); D là giờ mở cửa thứ Bảy.",
        },
        {
          id: 9,
          type: "multiple_choice",
          question: "Part 2. Talk 2. What do you need in order to borrow books?",
          options: ["An adult", "A wristband", "A reading-room pass", "A library card"],
          answer: 3,
          transcriptRef: 31,
          explanationVi:
            "transcriptRef = 31: 'you still need a library card if you want to borrow books' → đáp án D. B chỉ áp dụng cho trẻ dưới 12 tuổi khi đến thư viện (dòng 33); A và C không được nhắc; phòng đọc thứ nhất thì mở cho tất cả nên không cần thẻ để vào đọc.",
        },
        {
          id: 10,
          type: "multiple_choice",
          question: "Part 2. Talk 2. Who can use the first-floor reading room now?",
          options: ["Only library members", "Everyone", "Children under twelve", "Teachers only"],
          answer: 1,
          transcriptRef: 30,
          explanationVi:
            "transcriptRef = 30: phòng đọc 'now open to everyone, not only to members' → đáp án B. A trái ngược với 'not only to members'; C bị giới hạn sai (trẻ em vẫn cần người lớn đi kèm nhưng không bị cấm); D không được nhắc tới.",
        },
      ],
    },
    {
      id: "reading",
      skill: "reading",
      title: "Reading",
      durationMin: 30,
      paragraphs: [
        "Many parents worry that teenagers who never enter the kitchen will struggle when they leave home. However, schools that offer cooking classes report that their students eat more vegetables and feel more confident. A recent survey of two hundred students found that those who cooked at least twice a week were also better at planning their weekly spending. Experts say that cooking is not only a practical skill but also a way for families to spend time together without screens.",
        "Every summer, cities across Europe fill their streets with cyclists, but getting people to cycle in winter remains a challenge. The northern city of Aarhus solved part of the problem by building covered bike lanes that are cleaned of ice every morning. Since the lanes opened, the number of winter cyclists has risen by thirty percent. Shop owners in the centre say that customers arrive more often and stay longer, because parking a bicycle is easier than finding a space for a car. The city now plans to extend the network to the suburbs.",
        "Students who stay up late often believe that they can catch up on sleep at the weekend. Researchers disagree. In an experiment with eighty teenagers, those who kept a regular bedtime scored higher in morning tests than those who slept late on Saturday and Sunday. The researchers explain that the brain needs a steady rhythm, not a large amount of sleep after a long week. They recommend keeping the same waking time every day, even during holidays, and avoiding bright screens for an hour before bed.",
        "When a group of residents in Manchester found an empty lot behind their flats, they asked the council for permission to turn it into a garden. Today the half-hectare plot produces tomatoes, herbs, and apples for about forty families. The garden is run by volunteers, and new members are shown how to use the tools before they work alone. Older residents say that the garden has given them a reason to go outside every day, while children enjoy collecting eggs from the small hen house.",
      ],
      questions: [
        {
          id: 11,
          type: "multiple_choice",
          question: "According to the survey, students who cooked at least twice a week were better at something. What was it?",
          options: [
            "Planning their weekly spending",
            "Growing vegetables at school",
            "Reading recipes aloud",
            "Writing school reports",
          ],
          answer: 0,
          paragraphRef: 0,
          locationVi:
            "Đoạn 1, câu 'A recent survey ... were also better at planning their weekly spending.'",
          explanationVi:
            "Câu khảo sát nêu rõ nhóm nấu ăn ≥2 lần/tuần 'were also better at planning their weekly spending' → A đúng. B, C, D là các hoạt động hoàn toàn không xuất hiện trong đoạn 1.",
        },
        {
          id: 12,
          type: "multiple_choice",
          question: "What do schools with cooking classes report about their students?",
          options: [
            "They sleep better at night.",
            "They spend more time outdoors.",
            "They eat more vegetables and feel more confident.",
            "They get higher marks in science.",
          ],
          answer: 2,
          paragraphRef: 0,
          locationVi:
            "Đoạn 1, câu 'However, schools that offer cooking classes report that their students eat more vegetables and feel more confident.'",
          explanationVi:
            "Đoạn 1 nói đúng là 'eat more vegetables and feel more confident' → C đúng. A, B, D không phải điều trường học báo cáo trong đoạn; chúng chỉ là những kết quả plausible nhưng không có bằng chứng.",
        },
        {
          id: 13,
          type: "true_false_not_given",
          question: "Statement: The survey mentioned in the text included students from five different countries.",
          options: ["True", "False", "Not Given"],
          answer: 2,
          paragraphRef: 0,
          locationVi: "Đoạn 1, câu 'A recent survey of two hundred students ...'",
          explanationVi:
            "Đoạn chỉ nói khảo sát gồm hai trăm học sinh, hoàn toàn không đề cập số quốc gia hay địa điểm → Not Given. Không đủ thông tin để kết luận đúng hay sai.",
        },
        {
          id: 14,
          type: "gap_filling",
          question:
            "Complete the sentence using NO MORE THAN TWO WORDS from the passage. According to experts, cooking gives families a chance to spend time together without ___.",
          answer: "screens",
          paragraphRef: 0,
          locationVi: "Đoạn 1, câu cuối '... a way for families to spend time together without screens.'",
          explanationVi:
            "Câu cuối đoạn 1 kết thúc bằng 'without screens' → điền 'screens'. Các từ khác như 'money' hay 'teachers' không nằm trong câu gốc nên sai.",
        },
        {
          id: 15,
          type: "multiple_choice",
          question: "What is the main idea of the first paragraph?",
          options: [
            "Parents should cook for their children every day.",
            "Ready meals are cheaper than home cooking.",
            "Schools should teach more science.",
            "Cooking classes bring practical and social benefits to students and families.",
          ],
          answer: 3,
          paragraphRef: 0,
          locationVi: "Đoạn 1 (toàn đoạn), đặc biệt câu 2 và câu cuối.",
          explanationVi:
            "Đoạn nêu nhiều lợi ích của lớp nấu ăn (ăn nhiều rau, tự tin, quản lý chi tiêu, gắn kết gia đình) → D đúng. A, B, C chỉ là quá trình suy luận thêm hoặc chủ đề không được nói tới trong đoạn.",
        },
        {
          id: 16,
          type: "multiple_choice",
          question: "How did the city of Aarhus reduce the problem of winter cycling?",
          options: [
            "By giving free bicycles to residents.",
            "By building covered bike lanes cleaned of ice every morning.",
            "By banning cars from the centre.",
            "By making bus travel cheaper.",
          ],
          answer: 1,
          paragraphRef: 1,
          locationVi:
            "Đoạn 2, câu 'The northern city of Aarhus solved part of the problem by building covered bike lanes that are cleaned of ice every morning.'",
          explanationVi:
            "Câu thứ 2 của đoạn 2 nêu đúng giải pháp 'covered bike lanes ... cleaned of ice every morning' → B đúng. A, C, D là các biện pháp không hề được nhắc đến.",
        },
        {
          id: 17,
          type: "multiple_choice",
          question: "According to shop owners, what has happened since the lanes opened?",
          options: [
            "Customers arrive less often and leave earlier.",
            "Customers prefer to shop online in winter.",
            "Customers arrive more often and stay longer.",
            "Customers complain about the noise of cyclists.",
          ],
          answer: 2,
          paragraphRef: 1,
          locationVi:
            "Đoạn 2, câu 'Shop owners in the centre say that customers arrive more often and stay longer ...'",
          explanationVi:
            "Câu về chủ cửa hàng nói khách 'arrive more often and stay longer' → C đúng. A trái ngược với nội dung đoạn; B và D không được nêu trong đoạn.",
        },
        {
          id: 18,
          type: "true_false_not_given",
          question: "Statement: The number of winter cyclists in Aarhus has risen by about thirty percent.",
          options: ["True", "False", "Not Given"],
          answer: 0,
          paragraphRef: 1,
          locationVi: "Đoạn 2, câu 'Since the lanes opened, the number of winter cyclists has risen by thirty percent.'",
          explanationVi:
            "Câu thứ 3 của đoạn 2 nêu đúng 'risen by thirty percent' → True. Đoạn không có thông tin nào mâu thuẫn với con số này.",
        },
        {
          id: 19,
          type: "gap_filling",
          question:
            "Complete the sentence using NO MORE THAN TWO WORDS from the passage. The covered bike ___ are cleaned of ice every morning.",
          answer: "lanes",
          paragraphRef: 1,
          locationVi: "Đoạn 2, câu '... by building covered bike lanes that are cleaned of ice every morning.'",
          explanationVi:
            "Câu 'The covered bike ___ are cleaned' cần danh từ số nhiều → 'lanes' (từ vựng đúng trong đoạn 2). 'Lane' (số ít) sai ngữ pháp với 'are'; các từ khác không xuất hiện trong đoạn.",
        },
        {
          id: 20,
          type: "multiple_choice",
          question: "What does the writer say remains a challenge?",
          options: [
            "Getting people to cycle in winter.",
            "Filling the streets with cyclists in summer.",
            "Finding parking spaces for cars.",
            "Building shops in the city centre.",
          ],
          answer: 0,
          paragraphRef: 1,
          locationVi: "Đoạn 2, câu đầu '... but getting people to cycle in winter remains a challenge.'",
          explanationVi:
            "Câu mở đầu đoạn 2 nêu rõ 'getting people to cycle in winter remains a challenge' → A đúng. B là điều đang diễn ra tốt (không phải thách thức); C, D không được nhắc tới.",
        },
        {
          id: 21,
          type: "multiple_choice",
          question: "In the experiment, what happened to the teenagers who kept a regular bedtime?",
          options: [
            "They slept later on Saturday and Sunday.",
            "They scored higher in morning tests.",
            "They avoided bright screens before bed.",
            "They took the same tests in the afternoon.",
          ],
          answer: 1,
          paragraphRef: 2,
          locationVi:
            "Đoạn 3, câu 'In an experiment with eighty teenagers, those who kept a regular bedtime scored higher in morning tests ...'",
          explanationVi:
            "Nhóm giữ giờ ngủ đều 'scored higher in morning tests' → B đúng. A mô tả nhóm đối lập (ngủ cuối tuần); C là lời khuyên ở câu cuối, không phải kết quả thí nghiệm; D không được nhắc.",
        },
        {
          id: 22,
          type: "multiple_choice",
          question: "What do the researchers' results suggest?",
          options: [
            "The brain needs a large amount of sleep after a long week.",
            "Weekend sleep can replace weekday sleep.",
            "Morning tests are not a fair measure.",
            "A steady rhythm matters more than the total amount of sleep.",
          ],
          answer: 3,
          paragraphRef: 2,
          locationVi: "Đoạn 3, câu 'The researchers explain that the brain needs a steady rhythm, not a large amount of sleep after a long week.'",
          explanationVi:
            "Các nhà nghiên cứu khẳng định 'needs a steady rhythm, not a large amount of sleep' → D đúng. A và B trái ngược với quan điểm này; C không được thảo luận trong đoạn.",
        },
        {
          id: 23,
          type: "true_false_not_given",
          question: "Statement: Researchers suggest that students should sleep later during the holidays.",
          options: ["True", "False", "Not Given"],
          answer: 1,
          paragraphRef: 2,
          locationVi: "Đoạn 3, câu cuối 'They recommend keeping the same waking time every day, even during holidays ...'",
          explanationVi:
            "Lời khuyên là giữ giờ thức dậy như nhau 'even during holidays' → ngủ dậy muộn hơn vào kỳ nghỉ trái với khuyến nghị này → False.",
        },
        {
          id: 24,
          type: "gap_filling",
          question:
            "Complete the sentence using NO MORE THAN TWO WORDS from the passage. Researchers recommend keeping the same waking ___ every day, even during holidays.",
          answer: "time",
          paragraphRef: 2,
          locationVi: "Đoạn 3, câu cuối 'They recommend keeping the same waking time every day ...'",
          explanationVi:
            "Câu gốc là 'keeping the same waking time' → điền 'time'. 'Hour' hay 'schedule' không nằm trong câu gốc nên không phải đáp án theo yêu cầu 'from the passage'.",
        },
        {
          id: 25,
          type: "multiple_choice",
          question: "What do the researchers recommend?",
          options: [
            "Sleeping as much as possible at the weekend.",
            "Going to bed one hour earlier every night.",
            "Keeping a consistent waking time and avoiding screens before bed.",
            "Taking morning tests only on weekdays.",
          ],
          answer: 2,
          paragraphRef: 2,
          locationVi: "Đoạn 3, câu cuối 'They recommend keeping the same waking time ... and avoiding bright screens for an hour before bed.'",
          explanationVi:
            "Lời khuyên gồm hai việc: giờ thức dậy cố định + tránh màn hình sáng trước khi ngủ → C đúng. A ngược với kết luận của đoạn; B và D không được nêu.",
        },
        {
          id: 26,
          type: "multiple_choice",
          question: "How did the community garden project begin?",
          options: [
            "Residents asked the council for permission to use an empty lot.",
            "The council built a garden behind the flats.",
            "A local company donated the land.",
            "Children collected eggs and planted trees.",
          ],
          answer: 0,
          paragraphRef: 3,
          locationVi: "Đoạn 4, câu đầu 'When a group of residents ... asked the council for permission to turn it into a garden.'",
          explanationVi:
            "Câu mở đầu cho thấy người dân tự đề xuất và xin phép hội đồng → A đúng. B sai vì hội đồng không tự xây; C, D không được nhắc trong đoạn.",
        },
        {
          id: 27,
          type: "multiple_choice",
          question: "What do older residents say about the garden?",
          options: [
            "It gives them free vegetables all year.",
            "It gives them a reason to go outside every day.",
            "It is too much work for them.",
            "It has replaced their supermarket.",
          ],
          answer: 1,
          paragraphRef: 3,
          locationVi: "Đoạn 4, câu 'Older residents say that the garden has given them a reason to go outside every day ...'",
          explanationVi:
            "Câu về người cao tuổi nói garden 'gave them a reason to go outside every day' → B đúng. A, D phóng to sai (đoạn không nói thay thế siêu thị hay miễn phí quanh năm); C trái với tinh thần tích cực của đoạn.",
        },
        {
          id: 28,
          type: "true_false_not_given",
          question: "Statement: New members are not allowed to use the tools alone at first.",
          options: ["True", "False", "Not Given"],
          answer: 0,
          paragraphRef: 3,
          locationVi: "Đoạn 4, câu '... new members are shown how to use the tools before they work alone.'",
          explanationVi:
            "Câu này nói thành viên mới được hướng dẫn dùng dụng cụ 'before they work alone' → trước đó họ không làm việc một mình → Statement True.",
        },
        {
          id: 29,
          type: "gap_filling",
          question:
            "Complete the sentence using NO MORE THAN TWO WORDS from the passage. The garden is run by a group of ___ who give their time freely.",
          answer: "volunteers",
          paragraphRef: 3,
          locationVi: "Đoạn 4, câu 'The garden is run by volunteers ...'",
          explanationVi:
            "Câu gốc là 'The garden is run by volunteers'; cụm 'a group of ___' yêu cầu danh từ số nhiều → 'volunteers'. 'Workers' hay 'residents' không phải từ dùng trong câu gốc.",
        },
        {
          id: 30,
          type: "multiple_choice",
          question: "What do children enjoy collecting from the small hen house?",
          options: ["Herbs.", "Apples.", "Tomatoes.", "Eggs."],
          answer: 3,
          paragraphRef: 3,
          locationVi: "Đoạn 4, câu cuối '... children enjoy collecting eggs from the small hen house.'",
          explanationVi:
            "Câu cuối đoạn 4 nêu trẻ em hái 'eggs' từ chuồng gà nhỏ → D đúng. A, B, C là sản phẩm của khu vườn nhưng không phải thứ trẻ em nhặt từ chuồng gà.",
        },
      ],
    },
    {
      id: "writing",
      skill: "writing",
      title: "Writing",
      promptVi:
        "Viết một đoạn văn ngắn (80–120 từ) nêu quan điểm của em về việc giới trẻ nên tự nấu ăn ở nhà. Đưa ra ít nhất hai lý do và một ví dụ cụ thể.",
      requirementsVi: [
        "Đúng số từ: 80–120 từ",
        "Nêu rõ quan điểm ở câu đầu tiên",
        "Đưa ít nhất hai lý do để ủng hộ quan điểm",
        "Kèm ít nhất một ví dụ cụ thể từ cuộc sống",
        "Dùng từ nối (ví dụ: first, second, however, because, for example)",
      ],
      minWords: 80,
      maxWords: 120,
      sampleAnswer:
        "In my opinion, young people should learn to cook simple meals at home. First, cooking is a life skill: students who leave for university or work will not always be able to buy ready meals. Second, cooking helps families spend time together. In my family, my brother and I cook one dinner a week, and we talk about our day while we prepare the food. Of course, cooking takes time, but the dishes are usually healthier and cheaper than takeaway food. For this reason, I believe that schools could also offer short cooking classes.",
    },
    {
      id: "speaking",
      skill: "speaking",
      title: "Speaking",
      promptVi:
        "Nói trong 2 phút về một kỹ năng mà em đã học ngoài trường học. Hãy giải thích: em đã học kỹ năng đó như thế nào, em thường dùng nó ở đâu, và vì sao nó hữu ích.",
      timeLimitSec: 120,
      sampleAnswer:
        "Two years ago, I learned how to fix a flat bicycle tyre, and it has become one of the most useful skills I have. My father showed me the first time, and then I practised alone. The process is simple: you remove the wheel, find the hole, dry it, and glue a small patch over it. I use this skill almost every week because I cycle to school. Last month, my friend had a flat tyre near the city market, and I repaired it in ten minutes. Because of that, we did not have to push the bike home. I think practical skills like this save time and money, and they also make you more confident.",
    },
  ],
};
