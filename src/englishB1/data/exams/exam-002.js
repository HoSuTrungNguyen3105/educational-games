// Đề thi thử số 2 — English B1 (VSTEP bậc 3). Xem src/englishB1/README.md §4.8.
export const EXAM_002 = {
  id: "exam-002",
  code: "B1-002",
  name: "Đề thi thử số 2",
  type: "intermediate",
  level: "B1",
  difficulty: "medium",
  durationMin: 60,
  description:
    "Đề thi thử số 2 mức trung bình với chủ đề đa dạng hơn và các bẫy đáp án tinh tế hơn. Thích hợp cho người học đã nắm vững nền tảng và muốn nâng cao tốc độ làm bài.",
  sections: [
    {
      id: "listening",
      skill: "listening",
      title: "Listening",
      durationMin: 30,
      transcript: [
        "A: I bought this kettle last week, and it stopped working yesterday.",
        "B: I'm sorry about that. Do you have your receipt with you?",
        "A: Yes, here it is. I'd rather have a refund, please.",
        "B: Of course. The money will go back to the card you paid with.",
        "A: I'd like to join the evening photography course. Is there still space?",
        "B: We have two places left on Tuesday, but the Thursday course is full.",
        "A: Tuesday is fine for me. How much does the course cost?",
        "B: It's eighty pounds for eight weeks, including the darkroom sessions.",
        "A: Hi Dan, the train from Bristol is forty minutes late.",
        "B: Really? Shall we meet at the cafe instead of the station?",
        "A: Good idea. I'll be there at half past six.",
        "B: Perfect. I'll book a table near the window.",
        "A: Excuse me, I think I left my umbrella on the chair by the door.",
        "B: Let me check. Yes, a blue umbrella with a wooden handle?",
        "A: That's it! Thank you so much.",
        "B: We found it just after you left. It's behind the counter.",
        "A: What time does breakfast start? We'd like an early start tomorrow.",
        "B: Breakfast is served from six thirty, but hot food is only available from seven.",
        "A: We'll come down at seven, then.",
        "B: Very good. Your table is in the garden room.",
        "Speaker: Good afternoon, everyone. I'm the manager of the Riverside Sports Centre.",
        "Speaker: From next week, the swimming pool will close at nine instead of ten on weekdays.",
        "Speaker: The gym and the two studios will keep their usual hours.",
        "Speaker: Members can book classes up to seven days in advance, using the app or the front desk.",
        "Speaker: Please note that the car park will be resurfaced during the first week of May.",
        "Speaker: Until the work is finished, we ask you to leave your car at the leisure centre on King Street.",
        "Speaker: Finally, our new family membership starts at twenty-five pounds a month.",
        "Speaker: Last year I spent four months working on a small farm in Wales.",
        "Speaker: I looked after the sheep, collected the eggs, and helped in the kitchen.",
        "Speaker: In exchange, I received free accommodation and all my meals.",
        "Speaker: The work started at seven every morning, so I went to bed early.",
        "Speaker: At first, the hard work made me tired, but after two weeks I felt stronger than ever.",
        "Speaker: The best part was the evening: the whole family cooked together and told stories.",
        "Speaker: I also improved my English, because the family spoke very little Vietnamese.",
        "Speaker: I would recommend this kind of experience to anyone who wants to learn how to live simply.",
      ],
      questions: [
        {
          id: 1,
          type: "multiple_choice",
          question: "Part 1. Conversation 1. What does the customer want?",
          options: ["A refund", "A repair", "A replacement kettle", "A discount voucher"],
          answer: 0,
          transcriptRef: 2,
          explanationVi:
            "transcriptRef = 2: 'I'd rather have a refund, please' → đáp án A. B sai vì khách không yêu cầu sửa (máy hỏng sau một tuần); C sai vì khách không đổi sản phẩm; D không được nhắc.",
        },
        {
          id: 2,
          type: "multiple_choice",
          question: "Part 1. Conversation 2. How many places are left on the Tuesday photography course?",
          options: ["One", "Three", "Two", "Four"],
          answer: 2,
          transcriptRef: 5,
          explanationVi:
            "transcriptRef = 5: 'We have two places left on Tuesday' → đáp án C. Khóa thứ Năm đã kín (full) nên không còn chỗ; A và D không khớp con số nào trong hội thoại.",
        },
        {
          id: 3,
          type: "multiple_choice",
          question: "Part 1. Conversation 3. Where will the two friends meet?",
          options: ["At the station", "At the cafe", "At home", "At the office"],
          answer: 1,
          transcriptRef: 9,
          explanationVi:
            "transcriptRef = 9: 'Shall we meet at the cafe instead of the station?' → đáp án B. A là nơi ban đầu họ định gặp nhưng đã bị thay thế ('instead of'); C, D không được nhắc.",
        },
        {
          id: 4,
          type: "multiple_choice",
          question: "Part 1. Conversation 4. What colour is the lost umbrella?",
          options: ["White", "Black", "Green", "Blue"],
          answer: 3,
          transcriptRef: 13,
          explanationVi:
            "transcriptRef = 13: 'a blue umbrella with a wooden handle' → đáp án D. A, B, C đều là màu khác, không khớp mô tả của nhân viên.",
        },
        {
          id: 5,
          type: "multiple_choice",
          question: "Part 1. Conversation 5. When can the guests have hot food?",
          options: ["Seven o'clock", "Six thirty", "Six o'clock", "Half past seven"],
          answer: 0,
          transcriptRef: 17,
          explanationVi:
            "transcriptRef = 17: 'Breakfast is served from six thirty, but hot food is only available from seven' → đáp án A. B là giờ bắt đầu có đồ ăn nhẹ chứ không có đồ nóng; C và D không được nhắc.",
        },
        {
          id: 6,
          type: "multiple_choice",
          question: "Part 2. Talk 1. What is changing at the swimming pool?",
          options: [
            "It will close one hour later on weekdays.",
            "It will open earlier on weekdays.",
            "It will close one hour earlier on weekdays.",
            "It will close at the weekend.",
          ],
          answer: 2,
          transcriptRef: 21,
          explanationVi:
            "transcriptRef = 21: 'the swimming pool will close at nine instead of ten on weekdays' → đóng lúc 9h thay vì 10h = sớm hơn 1 giờ → C đúng. A trái ngược; B nói về giờ mở cửa (không đổi); D không được nhắc.",
        },
        {
          id: 7,
          type: "multiple_choice",
          question: "Part 2. Talk 1. Where should members park while the car park is resurfaced?",
          options: [
            "At the sports centre itself",
            "At the leisure centre on King Street",
            "On the newly resurfaced car park",
            "In the garden room",
          ],
          answer: 1,
          transcriptRef: 25,
          explanationVi:
            "transcriptRef = 25: 'leave your car at the leisure centre on King Street' → đáp án B. A là chỗ đang bị thi công nên không đỗ được; D là phòng ăn sáng của khách sạn trong hội thoại trước, hoàn toàn lạc đề.",
        },
        {
          id: 8,
          type: "multiple_choice",
          question: "Part 2. Talk 2. What did the speaker receive in exchange for her work?",
          options: ["A small salary", "Free transport", "English lessons", "Free accommodation and all meals"],
          answer: 3,
          transcriptRef: 29,
          explanationVi:
            "transcriptRef = 29: 'In exchange, I received free accommodation and all my meals' → đáp án D. A sai vì không có lương; B, C không được nhắc — cô học tiếng Anh nhờ trò chuyện với gia đình chứ không qua khóa học.",
        },
        {
          id: 9,
          type: "multiple_choice",
          question: "Part 2. Talk 2. Why did the speaker go to bed early?",
          options: [
            "Because work started at seven in the morning.",
            "Because there was no electricity on the farm.",
            "Because she was ill.",
            "Because the family slept at eight every night.",
          ],
          answer: 0,
          transcriptRef: 30,
          explanationVi:
            "transcriptRef = 30: 'The work started at seven every morning, so I went to bed early' → đáp án A. B, C, D là các lý do không tồn tại trong đoạn; 'so' chỉ ra quan hệ nhân quả đúng.",
        },
        {
          id: 10,
          type: "multiple_choice",
          question: "Part 2. Talk 2. What was the best part of the experience for the speaker?",
          options: [
            "Working with the sheep in the morning",
            "Cooking and telling stories with the family in the evening",
            "Receiving free accommodation",
            "Learning to drive a tractor",
          ],
          answer: 1,
          transcriptRef: 32,
          explanationVi:
            "transcriptRef = 32: 'The best part was the evening: the whole family cooked together and told stories' → đáp án B. A là công việc buổi sáng; C chỉ là điều kiện trao đổi; D không được nhắc tới.",
        },
      ],
    },
    {
      id: "reading",
      skill: "reading",
      title: "Reading",
      durationMin: 30,
      paragraphs: [
        "Learning a musical instrument is more than a pleasant hobby. Researchers who studied children over five years found that those who practised an instrument regularly remembered spoken instructions better than those who did not. Playing also teaches patience, because progress is slow and visible only after months of practice. However, not every family can afford private lessons. Some schools have responded by offering group lessons at lunchtime, and several charities now lend musical instruments to pupils free of charge for a whole term.",
        "A team of psychologists asked two groups of people to think of new uses for ordinary objects. One group sat in a chair, while the other walked at their own pace on a quiet path. On average, the walkers produced twice as many ideas, and their ideas were judged as more original by independent readers. Interestingly, the benefit continued for a short time after the walk had ended. The researchers warn, however, that busy roads and crowded pavements remove the advantage, because the brain has to focus on traffic instead of the task.",
        "In 2015, the seaside town of Amberford charged ten pence for every plastic bag in its shops. Within a year, the number of bags found on the local beach had fallen by seventy percent. Cafe owners reported that fewer customers asked for take-away cups, and the market traders began selling cloth bags printed with the town's logo. The scheme was so successful that the council used the money raised to employ two extra street cleaners. Visitors now often mention the clean harbour in online reviews.",
        "For many years, students were advised to type their lecture notes on a laptop. A recent experiment suggests that handwriting may be better for learning. Students who wrote by hand produced fewer words, but they understood the ideas behind those words more deeply, because they had to choose what to write while the lecture was still going on. Typists, by contrast, often tried to copy every sentence. The researchers do not argue that computers are harmful; they simply recommend that students review their typed notes by rewriting the key points in a notebook.",
      ],
      questions: [
        {
          id: 11,
          type: "multiple_choice",
          question: "What did researchers find about children who practised an instrument regularly?",
          options: [
            "They made more friends at school.",
            "They played faster than other children.",
            "They remembered spoken instructions better.",
            "They needed less sleep at night.",
          ],
          answer: 2,
          paragraphRef: 0,
          locationVi:
            "Đoạn 1, câu 'Researchers who studied children over five years found that those who practised an instrument regularly remembered spoken instructions better ...'",
          explanationVi:
            "Câu thứ 2 của đoạn 1 nêu đúng kết quả 'remembered spoken instructions better' → C đúng. A, B, D không xuất hiện trong đoạn.",
        },
        {
          id: 12,
          type: "multiple_choice",
          question: "Why does playing an instrument teach patience, according to the passage?",
          options: [
            "Because progress is slow and visible only after months of practice.",
            "Because lessons are usually very expensive.",
            "Because the teachers are strict.",
            "Because practice must be done in a group.",
          ],
          answer: 0,
          paragraphRef: 0,
          locationVi: "Đoạn 1, câu 'Playing also teaches patience, because progress is slow and visible only after months of practice.'",
          explanationVi:
            "Câu 'because' giải thích nguyên nhân trực tiếp: tiến bộ chậm, chỉ thấy sau nhiều tháng tập → A đúng. B, C, D là các lý do không được nêu trong đoạn.",
        },
        {
          id: 13,
          type: "true_false_not_given",
          question: "Statement: Some families cannot afford private music lessons.",
          options: ["True", "False", "Not Given"],
          answer: 0,
          paragraphRef: 0,
          locationVi: "Đoạn 1, câu 'However, not every family can afford private lessons.'",
          explanationVi:
            "'Not every family can afford' nghĩa là có những gia đình không đủ tiền → Statement True. Đoạn không hề nói mọi gia đình đều có thể chi trả.",
        },
        {
          id: 14,
          type: "gap_filling",
          question:
            "Complete the sentence using NO MORE THAN TWO WORDS from the passage. Several charities now lend musical ___ to pupils free of charge for a whole term.",
          answer: "instruments",
          paragraphRef: 0,
          locationVi: "Đoạn 1, câu cuối '... several charities now lend musical instruments to pupils free of charge ...'",
          explanationVi:
            "Câu cuối đoạn 1 dùng đúng 'lend musical instruments to pupils' → điền 'instruments' (số nhiều theo 'musical ___ to pupils'). 'Guitars' hay 'books' không nằm trong câu gốc.",
        },
        {
          id: 15,
          type: "multiple_choice",
          question: "What is the main idea of the first paragraph?",
          options: [
            "Children should stop taking private lessons.",
            "Schools only teach music at lunchtime.",
            "Researchers have proved that music is just a hobby.",
            "Playing an instrument helps learning and character, but cost is a problem for some families.",
          ],
          answer: 3,
          paragraphRef: 0,
          locationVi: "Đoạn 1 (toàn đoạn): 3 câu đầu nói về lợi ích, 2 câu cuối nói về rào cản chi phí.",
          explanationVi:
            "Đoạn nêu lợi ích (trí nhớ, kiên nhẫn) rồi chuyển bằng 'However' sang rào cản chi phí → D đúng. A, B, C trái với tinh thần hoặc đưa ra tuyên bố không có trong đoạn.",
        },
        {
          id: 16,
          type: "multiple_choice",
          question: "What happened when one group of people walked while doing the task?",
          options: [
            "They forgot the original task.",
            "They produced twice as many ideas.",
            "They walked faster than usual.",
            "They preferred sitting down after the walk.",
          ],
          answer: 1,
          paragraphRef: 1,
          locationVi: "Đoạn 2, câu 'On average, the walkers produced twice as many ideas ...'",
          explanationVi:
            "Câu thứ 3 của đoạn 2 nêu 'walkers produced twice as many ideas' → B đúng. A, C, D không được đoạn văn nhắc tới.",
        },
        {
          id: 17,
          type: "multiple_choice",
          question: "What did the independent readers think of the ideas?",
          options: [
            "The walkers' ideas were too short.",
            "The seated group produced better ideas.",
            "All the ideas were equally original.",
            "The walkers' ideas were more original.",
          ],
          answer: 3,
          paragraphRef: 1,
          locationVi: "Đoạn 2, câu '... their ideas were judged as more original by independent readers.'",
          explanationVi:
            "Các độc giả độc lập đánh giá ý tưởng của nhóm đi bộ 'more original' → D đúng. B trái ngược với kết quả; A, C không được nêu.",
        },
        {
          id: 18,
          type: "true_false_not_given",
          question: "Statement: The creative benefit disappeared immediately after the walk ended.",
          options: ["True", "False", "Not Given"],
          answer: 1,
          paragraphRef: 1,
          locationVi: "Đoạn 2, câu 'Interestingly, the benefit continued for a short time after the walk had ended.'",
          explanationVi:
            "Đoạn nói lợi ích 'continued for a short time after the walk' → mâu thuẫn với 'disappeared immediately' → Statement False.",
        },
        {
          id: 19,
          type: "gap_filling",
          question:
            "Complete the sentence using NO MORE THAN TWO WORDS from the passage. Busy roads remove the advantage because the brain must focus on ___ instead of the task.",
          answer: "traffic",
          paragraphRef: 1,
          locationVi: "Đoạn 2, câu cuối '... the brain has to focus on traffic instead of the task.'",
          explanationVi:
            "Câu cuối đoạn 2 dùng đúng 'focus on traffic instead of the task' → điền 'traffic'. 'Roads' sai vì chủ ngữ đã là 'the brain'; các từ khác không có trong câu gốc.",
        },
        {
          id: 20,
          type: "multiple_choice",
          question: "What warning do the researchers give in the last sentence?",
          options: [
            "Crowded, busy environments reduce the benefit of walking.",
            "Walking is dangerous for the brain.",
            "Psychologists prefer crowded pavements.",
            "Traffic always improves creativity.",
          ],
          answer: 0,
          paragraphRef: 1,
          locationVi: "Đoạn 2, câu cuối '... busy roads and crowded pavements remove the advantage ...'",
          explanationVi:
            "Các nhà nghiên cứu cảnh báo đường ồn ào và vỉa hè đông đúc 'remove the advantage' → A đúng. D trái ngược; B và C diễn giải sai mục đích của cảnh báo.",
        },
        {
          id: 21,
          type: "multiple_choice",
          question: "How much did the town of Amberford charge for one plastic bag?",
          options: ["Ten pounds", "Seventy pence", "Ten pence", "One pence"],
          answer: 2,
          paragraphRef: 2,
          locationVi: "Đoạn 3, câu 'In 2015, the seaside town of Amberford charged ten pence for every plastic bag ...'",
          explanationVi:
            "Đoạn 3 nêu rõ 'ten pence for every plastic bag' → C đúng. B là con số phần trăm giảm rác thải; A sai về đơn vị (pound thay vì pence); D không được nhắc.",
        },
        {
          id: 22,
          type: "multiple_choice",
          question: "What happened to the number of plastic bags on the local beach?",
          options: [
            "It fell by seventy percent.",
            "It rose by seventy percent.",
            "It stayed exactly the same.",
            "It was reduced by ten pence.",
          ],
          answer: 0,
          paragraphRef: 2,
          locationVi: "Đoạn 3, câu 'Within a year, the number of bags found on the local beach had fallen by seventy percent.'",
          explanationVi:
            "Câu thứ 2 của đoạn 3 dùng 'had fallen by seventy percent' → A đúng. B sai vì đảo nghĩa (fall ≠ rise); C trái với số liệu; D trộn lẫn đơn vị tiền với số lượng rác.",
        },
        {
          id: 23,
          type: "multiple_choice",
          question: "What did the market traders begin selling after the scheme started?",
          options: [
            "Plastic bottles with the town's logo.",
            "Take-away cups at a lower price.",
            "Ten-pence harbour tickets.",
            "Cloth bags printed with the town's logo.",
          ],
          answer: 3,
          paragraphRef: 2,
          locationVi: "Đoạn 3, câu '... the market traders began selling cloth bags printed with the town's logo.'",
          explanationVi:
            "Câu thứ 3 của đoạn 3 nêu thương nhân chợ bắt đầu bán 'cloth bags printed with the town's logo' → D đúng. A sai vì loại túi (vải, không phải nhựa); B, C không được nhắc.",
        },
        {
          id: 24,
          type: "gap_filling",
          question:
            "Complete the sentence using NO MORE THAN TWO WORDS from the passage. Within a year, the number of plastic bags on the beach had ___ by seventy percent.",
          answer: "fallen",
          paragraphRef: 2,
          locationVi: "Đoạn 3, câu '... the number of bags found on the local beach had fallen by seventy percent.'",
          explanationVi:
            "Câu gốc dùng 'had fallen by seventy percent' → điền 'fallen' (past participle sau 'had'). 'Fell' sai hình thức; 'reduced' không nằm trong câu gốc nên không đạt yêu cầu 'from the passage'.",
        },
        {
          id: 25,
          type: "true_false_not_given",
          question: "Statement: The council spent the money from the scheme on two extra street cleaners.",
          options: ["True", "False", "Not Given"],
          answer: 0,
          paragraphRef: 2,
          locationVi: "Đoạn 3, câu '... the council used the money raised to employ two extra street cleaners.'",
          explanationVi:
            "Nội dung câu này trùng khớp chính xác với câu trong đoạn 3 → Statement True. Không có thông tin nào mâu thuẫn.",
        },
        {
          id: 26,
          type: "multiple_choice",
          question: "What did students who wrote by hand do differently?",
          options: [
            "They copied every sentence quickly.",
            "They selected the most important points while listening.",
            "They wrote twice as many words as the typists.",
            "They finished the lecture before the teacher.",
          ],
          answer: 1,
          paragraphRef: 3,
          locationVi:
            "Đoạn 4, câu '... they had to choose what to write while the lecture was still going on.'",
          explanationVi:
            "Nhóm viết tay phải 'choose what to write' trong lúc nghe → họ chọn ý chính → B đúng. A mô tả nhóm gõ máy ('copy every sentence'); C sai vì nhóm viết tay viết 'fewer words'; D không được nhắc.",
        },
        {
          id: 27,
          type: "multiple_choice",
          question: "What do the researchers recommend?",
          options: [
            "Stopping the use of laptops in class.",
            "Typing only during the first half of a lecture.",
            "Reviewing typed notes by rewriting the key points.",
            "Writing every sentence by hand.",
          ],
          answer: 2,
          paragraphRef: 3,
          locationVi: "Đoạn 4, câu cuối '... they simply recommend that students review their typed notes by rewriting the key points in a notebook.'",
          explanationVi:
            "Lời khuyên cuối đoạn là 'review typed notes by rewriting the key points' → C đúng. A, D quá cực đoan (nghiên cứu 'không argument computers are harmful'); B không được nêu.",
        },
        {
          id: 28,
          type: "true_false_not_given",
          question: "Statement: The research team plans to repeat the experiment next year.",
          options: ["True", "False", "Not Given"],
          answer: 2,
          paragraphRef: 3,
          locationVi: "Đoạn 4 (toàn đoạn) — không có câu nào đề cập tới kế hoạch lặp lại thí nghiệm.",
          explanationVi:
            "Đoạn 4 chỉ mô tả kết quả và lời khuyên, không nói gì về kế hoạch làm lại thí nghiệm trong năm tới → Not Given (không đủ thông tin để kết luận).",
        },
        {
          id: 29,
          type: "gap_filling",
          question:
            "Complete the sentence using NO MORE THAN TWO WORDS from the passage. Typists often tried to copy every ___ during the lecture.",
          answer: "sentence",
          paragraphRef: 3,
          locationVi: "Đoạn 4, câu 'Typists, by contrast, often tried to copy every sentence.'",
          explanationVi:
            "Câu gốc là 'tried to copy every sentence' → điền 'sentence'. 'Word' hay 'idea' không nằm trong câu gốc nên sai yêu cầu 'from the passage'.",
        },
        {
          id: 30,
          type: "multiple_choice",
          question: "What is the main idea of the fourth paragraph?",
          options: [
            "Handwriting may deepen understanding, and typed notes should be reviewed by rewriting key points.",
            "Laptops should be banned from all lectures.",
            "Typing is always better than writing by hand.",
            "Students should write every word by hand.",
          ],
          answer: 0,
          paragraphRef: 3,
          locationVi: "Đoạn 4 (toàn đoạn): kết quả thí nghiệm ở giữa và lời khuyên ở câu cuối.",
          explanationVi:
            "Đoạn nêu viết tay giúp hiểu sâu hơn rồi kết thúc bằng lời khuyên gõ lại ý chính → A đúng. B, D quá cực đoan và trái với 'do not argue that computers are harmful'; C phủ nhận kết quả thí nghiệm.",
        },
      ],
    },
    {
      id: "writing",
      skill: "writing",
      title: "Writing",
      promptVi:
        "Viết một email ngắn (80–120 từ) cho người bạn nước ngoài tên Jack, mời cậu ấy đến thăm quê em vào dịp lễ gần nhất. Nêu ít nhất hai lý do nên đến và gợi ý hai hoạt động các em có thể làm cùng nhau.",
      requirementsVi: [
        "Đúng số từ: 80–120 từ",
        "Định dạng email: lời chào, nội dung, lời kết",
        "Nêu ít nhất hai lý do nên đến thăm",
        "Gợi ý ít nhất hai hoạt động cụ thể",
        "Kết thúc bằng một câu hỏi hoặc lời mời phản hồi",
      ],
      minWords: 80,
      maxWords: 120,
      sampleAnswer:
        "Dear Jack, How are you? I hope you are doing well. I am writing to invite you to visit my hometown during the national holiday next month. There are two good reasons to come: the weather is cool at this time of year, and the food festival in the old street lasts for a whole week. We could visit the night market together and try the local dishes, or we could rent bicycles and ride along the river. Please let me know if you can come, and I will book a room for you. Best wishes, Linh",
    },
    {
      id: "speaking",
      skill: "speaking",
      title: "Speaking",
      promptVi:
        "Nói trong 2 phút về một địa điểm du lịch em rất muốn đến. Hãy nêu: địa điểm đó là đâu, em biết về nó như thế nào, em muốn làm gì ở đó, và vì sao em muốn đến.",
      timeLimitSec: 120,
      sampleAnswer:
        "The place I would really like to visit is the town of Hoi An in central Vietnam. I first saw it in a film two years ago, and I have wanted to go there ever since. What attracts me most is the old part of the town, where the houses are painted yellow and lanterns hang over every street. If I went there, I would walk along the river at night, take a boat under the lanterns, and learn to cook two or three local dishes in a short class. I would also like to take many photos of the narrow streets. I believe Hoi An is special because it is quiet and traditional, not crowded like a big city.",
    },
  ],
};
