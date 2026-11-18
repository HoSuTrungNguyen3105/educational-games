// Writing — 16 đề luyện viết B1 theo spec §8.1 (7 dạng) + rubric §8.3.
// Mỗi đề: prompt tiếng Việt, yêu cầu, số từ, dàn ý, gợi ý từ vựng,
// bài mẫu tiếng Anh thật (đúng dạng, nằm trong khoảng minWords–maxWords),
// ghi chú vì sao bài mẫu tốt, và bộ 5 tiêu chí tự chấm.

const TYPE_LABELS = {
  email: "email",
  informal_letter: "thư không chính thức (informal letter)",
  formal_letter: "thư chính thức (formal letter)",
  opinion_paragraph: "đoạn nghị luận (opinion paragraph)",
  short_essay: "bài văn ngắn (short essay)",
  advice: "bài đưa lời khuyên (giving advice)",
  experience: "bài kể lại trải nghiệm (describing experiences)",
};

/** Bộ 5 tiêu chí spec §8.3 — mỗi tiêu chí có hint để người học tự chấm. */
function buildChecklist(type, minWords, maxWords) {
  const form = TYPE_LABELS[type] || type;
  return [
    {
      id: "task",
      labelVi: "Task Achievement",
      hintVi: `Bài có đúng dạng ${form} không? Đã trả lời đủ mọi ý trong đề bài và nằm trong khoảng ${minWords}–${maxWords} từ chưa?`,
    },
    {
      id: "organization",
      labelVi: "Organization",
      hintVi:
        "Bài có đủ 3 phần (mở đầu – thân – kết) theo structureVi chưa? Mỗi ý có câu chủ đề và được liên kết bằng từ nối (First of all, However, In conclusion…) chưa?",
    },
    {
      id: "vocabulary",
      labelVi: "Vocabulary",
      hintVi:
        "Có dùng được từ vựng gợi ý (vocabularyHints) và từ vựng đúng chủ đề không? Có lặp lại cùng một từ đơn giản quá nhiều lần, hoặc dùng từ sai nghĩa/ sai ngữ cảnh không?",
    },
    {
      id: "grammar",
      labelVi: "Grammar",
      hintVi:
        "Thì động từ, chủ ngữ – vị ngữ, danh từ số, mạo từ, mệnh đề quan hệ đã đúng chưa? Có câu nào bị lẫn lộn thì, hoặc câu dài thiếu chữ nối (run-on sentence) không?",
    },
    {
      id: "spelling",
      labelVi: "Spelling and Punctuation",
      hintVi:
        "Chính tả, chữ hoa (I, tên riêng, đầu câu), dấu chấm / phẩy / chấm hỏi và khoảng trắng giữa hai câu đã đúng chưa?",
    },
  ];
}

export const WRITING_TOPICS = [
  {
    id: "B1_WRITE_001",
    type: "email",
    title: "Asking Your Manager for a Day Off",
    topic: "work",
    level: "B1",
    promptVi:
      "Bạn là nhân viên của một công ty du lịch. Bạn cần xin nghỉ ngày thứ Sáu tuần này để đưa mẹ đi khám bệnh ở bệnh viện (mẹ bạn không thể đi một mình). Hãy viết email gửi cho quản lý trực tiếp, Ms. Lan, khoảng 90–130 từ.",
    requirementsVi: [
      "Đúng định dạng email: lời chào (Dear Ms. Lan), câu mở đầu nêu mục đích, lời kết và chữ ký.",
      "Nêu rõ lý do nghỉ, ngày nghỉ cụ thể và cách bạn bàn giao công việc cho đồng nghiệp.",
      "Giọng điệu lịch sự, thân thiện với quản lý trực tiếp; kèm câu cảm ơn hoặc nhờ phê duyệt.",
    ],
    minWords: 90,
    maxWords: 130,
    structureVi: [
      "Mở đầu: nêu ngay mục đích viết email (xin nghỉ ngày nào, lý do).",
      "Thân bài: giải thích hoàn cảnh + phương án bàn giao và cam kết kiểm tra email.",
      "Kết: cảm ơn, mong được phê duyệt, lời chào kết (Best regards).",
    ],
    vocabularyHints: [
      { word: "take a day off", meaningVi: "xin nghỉ một ngày" },
      { word: "medical appointment", meaningVi: "cuộc hẹn khám bệnh" },
      { word: "hand over", meaningVi: "bàn giao công việc" },
      { word: "catch up on", meaningVi: "bù / làm nốt công việc còn lại" },
      { word: "approve", meaningVi: "duyệt, đồng ý cho phép" },
      { word: "in case", meaningVi: "trong trường hợp" },
    ],
    sampleAnswer:
      "Dear Ms. Lan,\n\nI am writing to ask for a day off this Friday, 14 March, because I need to take my mother to the hospital for a medical appointment. She cannot go alone, and the clinic has no other free slot this week.\n\nI have already finished most of my tasks. I will hand over the Tan Binh customer file to Mr. Phuc on Thursday evening, and I will check my email after the appointment in case anything urgent comes up.\n\nI would be grateful if you could approve my request. Please let me know if you need any further information.\n\nBest regards,\nMai Anh",
    sampleNotesVi: [
      "Câu đầu tiên nêu ngay mục đích (I am writing to ask for…) nên người đọc không phải tìm lý do — đúng tiêu chí Task Achievement.",
      "Email có đủ ba phần: mở đầu (lí do), thân (bàn giao công việc), kết (nhờ phê duyệt) và lời chào kết đúng chuẩn của một email công sở.",
      "Dùng cụm từ nối lý do – kết quả rất tự nhiên: because, and, in case; câu bị động nhẹ (is approved) không xuất hiện nên lỗi grammar khó mắc.",
      "Chi tiết cụ thể (ngày 14/3, tên ông Phuc, tên tệp) khiến đề bài được đáp ứng trọn vẹn thay vì trả lời chung chung.",
    ],
    checklist: buildChecklist("email", 90, 130),
  },
  {
    id: "B1_WRITE_002",
    type: "email",
    title: "Complaining About a Faulty Online Order",
    topic: "shopping",
    level: "B1",
    promptVi:
      "Bạn vừa nhận đơn hàng mua trực tuyến trên trang TechHouse (một chiếc tai nghe không dây, mã đơn TH-4821) nhưng tai nghe bị lỗi: tai phải không có tiếng. Hãy viết email khiếu nại tới bộ phận chăm sóc khách hàng, khoảng 90–140 từ.",
    requirementsVi: [
      "Cung cấp thông tin đơn hàng (mã đơn, ngày mua) và mô tả rõ sự cố.",
      "Nêu yêu cầu xử lý cụ thể: đổi trả hoặc hoàn tiền, kèm hạn phản hồi mong muốn.",
      "Giọng điệu lịch sự nhưng kiên quyết, không dùng câu xúc phạm hay cáu gắt.",
    ],
    minWords: 90,
    maxWords: 140,
    structureVi: [
      "Mở đầu: giới thiệu đơn hàng và lý do liên hệ (sản phẩm bị lỗi).",
      "Thân bài: mô tả lỗi, nêu cách bạn đã thử khắc phục và yêu cầu đổi/hoàn tiền.",
      "Kết: mong nhận phản hồi trong thời hạn, lời lịch sự kết thúc.",
    ],
    vocabularyHints: [
      { word: "place an order", meaningVi: "đặt hàng" },
      { word: "faulty", meaningVi: "bị lỗi, hư hỏng" },
      { word: "refund", meaningVi: "hoàn tiền" },
      { word: "replacement", meaningVi: "sản phẩm thay thế" },
      { word: "invoice", meaningVi: "hóa đơn" },
      { word: "resolve", meaningVi: "giải quyết" },
    ],
    sampleAnswer:
      "Dear Customer Service Team,\n\nI am writing about order number TH-4821, which I placed on your website on 2 March. The wireless headphones I bought arrived yesterday, but the right earphone produces no sound at all, so the product is unusable.\n\nI have already tried resetting the headphones and testing them with another phone, yet the problem remains. I would like a full refund or a replacement sent to my address within seven days. A copy of my invoice is attached to this email.\n\nI hope you can resolve this problem quickly. I look forward to your reply.\n\nYours sincerely,\nThanh Hung",
    sampleNotesVi: [
      "Đề bài đòi hỏi thông tin đơn hàng → bài mẫu đưa mã đơn, ngày mua, mô tả lỗi rất cụ thể, được điểm Task Achievement cao.",
      "Thân bài có thứ tự logic: mô tả lỗi → cách đã thử → yêu cầu cụ thể (refund/replacement trong 7 ngày) → đính kèm hóa đơn.",
      "Từ vựng đúng chủ đề mua sắm: faulty, refund, replacement, invoice, resolve — thay vì lặp lại bad / broken.",
      "Giọng điệu vẫn giữ lịch sự (I would like, I hope, I look forward to) dù là khiếu nàn — đúng chuẩn của một email phàn nàn.",
    ],
    checklist: buildChecklist("email", 90, 140),
  },
  {
    id: "B1_WRITE_003",
    type: "email",
    title: "Asking a Language Centre About a Course",
    topic: "education",
    level: "B1",
    promptVi:
      "Bạn muốn học khóa tiếng Anh buổi tối cho người đi làm tại trung tâm English Hub để đạt B1 trước khi ứng tuyển vào công việc mới. Hãy viết email cho cô phụ trách Ms. Hoa để hỏi thông tin và đăng ký, khoảng 90–140 từ.",
    requirementsVi: [
      "Giới thiệu ngắn về bản thân và mục đích liên hệ ngay ở đoạn đầu.",
      "Đặt ít nhất 3 câu hỏi cụ thể về khóa học (lịch học, học phí, chứng chỉ / bài kiểm tra đầu vào).",
      "Kết email bằng lời cảm ơn và mong nhận phản hồi kèm thời hạn.",
    ],
    minWords: 90,
    maxWords: 140,
    structureVi: [
      "Mở đầu: mục đích viết email + trình độ tiếng Anh hiện tại của bạn.",
      "Thân bài: các câu hỏi cụ thể về lịch học, học phí, chứng chỉ, cách đăng ký.",
      "Kết: cảm ơn, mong nhận thư trả lời trước một thời điểm nhất định.",
    ],
    vocabularyHints: [
      { word: "enroll in", meaningVi: "đăng ký học" },
      { word: "schedule", meaningVi: "thời khóa biểu" },
      { word: "tuition fee", meaningVi: "học phí" },
      { word: "placement test", meaningVi: "bài kiểm tra xếp lớp" },
      { word: "certificate", meaningVi: "chứng chỉ" },
      { word: "I look forward to", meaningVi: "tôi mong chờ (phản hồi)" },
    ],
    sampleAnswer:
      "Dear Ms. Hoa,\n\nI am currently working as a sales assistant, and I would like to improve my English to B1 level before I apply for a new job next year. I am writing to ask about your evening course for adults.\n\nCould you please tell me the schedule of the classes, the total tuition fee, and whether you offer a certificate at the end of the course? I would also like to know if I need to take a placement test before enrolling. I am free on Tuesday and Thursday evenings.\n\nThank you for your help. I would appreciate a reply before the end of this month.\n\nYours sincerely,\nQuang Nghi",
    sampleNotesVi: [
      "Mở đầu nêu rõ bối cảnh (đi làm, muốn đạt B1) giúp người nhận email trả lời đúng nhu cầu — đạt yêu cầu Task Achievement.",
      "Ba câu hỏi đều bắt đầu bằng Could you please / I would like to know nên nghe rất lịch sự, đúng giọng email hỏi thông tin.",
      "Có chi tiết bổ sung hữu ích (rảnh tối thứ Ba, thứ Sáu) và thời hạn phản hồi, khiến bài cụ thể hơn là một câu hỏi chung chung.",
      "Từ vựng đúng chủ đề giáo dục: enroll, placement test, tuition fee, certificate; liên kết bằng and, before, if rất tự nhiên.",
    ],
    checklist: buildChecklist("email", 90, 140),
  },
  {
    id: "B1_WRITE_004",
    type: "informal_letter",
    title: "Telling a Friend About Your New Life in Da Nang",
    topic: "daily life",
    level: "B1",
    promptVi:
      "Bạn vừa chuyển từ Hà Nội vào Đà Nẵng sống và làm việc cho một công ty thiết kế nhỏ. Viết thư (không chính thức) cho người bạn thân nhất là Tom, kể về nơi ở, công việc, thói quen hàng ngày và mời Tom vào thăm, khoảng 100–150 từ.",
    requirementsVi: [
      "Đúng dạng thư bạn bè: lời chào thân mật (Dear Tom), giọng điệu tự nhiên, kết thư kèm lời mời và câu hỏi đáp lại.",
      "Kể ít nhất 3 chi tiết về cuộc sống mới: nơi ở, công việc, thói quen hằng ngày.",
      "Có lời mời cụ thể với thời gian và hoạt động sẽ làm cùng nhau.",
    ],
    minWords: 100,
    maxWords: 150,
    structureVi: [
      "Mở đầu: chào hỏi, hỏi thăm bạn và báo tin lớn (đã chuyển vào Đà Nẵng).",
      "Thân bài: kể 3 chi tiết về căn hộ, công việc, thói quen mới + so sánh nhẹ với Hà Nội.",
      "Kết: lời mời bạn thăm với thời gian cụ thể, câu hỏi thăm lại, chào kết thân mật.",
    ],
    vocabularyHints: [
      { word: "move to", meaningVi: "chuyển đến" },
      { word: "flat", meaningVi: "căn hộ" },
      { word: "commute", meaningVi: "đi lại (từ nhà tới nơi làm)" },
      { word: "be friendly", meaningVi: "thân thiện" },
      { word: "Why don't you…?", meaningVi: "sao bạn không…? (gợi ý)" },
      { word: "Write back soon!", meaningVi: "Viết thư lại nhé!" },
    ],
    sampleAnswer:
      "Dear Tom,\n\nHow are you? I hope everything is going well with you in Ha Noi. I am writing because I have some big news: last month I moved to Da Nang to work for a small design company near the beach.\n\nMy new flat is small but bright, and I can ride my bike to work in only ten minutes, so I no longer spend two hours commuting every day. Every morning I run on the beach before breakfast, which is something I could never do in Ha Noi. The people here are friendly and the food is incredibly cheap.\n\nI would love you to visit me. Why don't you come in December? We can stay at my place and visit Hoi An together.\n\nWrite back soon!\n\nLove,\nMai",
    sampleNotesVi: [
      "Giọng điệu thư bạn bè rất thật: mở đầu bằng câu hỏi thăm How are you?, kết bằng Write back soon! và Love, đúng dạng informal letter.",
      "Ba chi tiết đời sống được nêu rõ (căn hộ, đi làm 10 phút, chạy bộ trên biển) — đúng yêu cầu đề bài và có so sánh với Hà Nội.",
      "Câu liên kết tương đối (which is something I could never do…) nâng chất đoạn văn lên mức B1 mà vẫn dễ hiểu.",
      "Lời mời cụ thể (tháng 12, ở nhà tôi, đi Hội An) + câu hỏi mời bạn trả lời — thể hiện giao tiếp hai chiều như một bức thư thật.",
    ],
    checklist: buildChecklist("informal_letter", 100, 150),
  },
  {
    id: "B1_WRITE_005",
    type: "informal_letter",
    title: "Inviting a Pen Friend to the Mid-Autumn Festival",
    topic: "culture",
    level: "B1",
    promptVi:
      "Bạn có pen pal người Pháp tên Claire chưa từng đến Việt Nam. Viết thư kể về Tết Trung Thu (ý nghĩa, các hoạt động nổi bật) và mời Claire sang tham dự lễ hội vào tháng 10 năm sau, khoảng 100–150 từ.",
    requirementsVi: [
      "Giọng điệu thân mật của thư bạn bè, có nhắc lại thư trước của bạn và ít nhất 1 câu hỏi cho người nhận.",
      "Kể ít nhất 3 chi tiết/hoạt động của lễ hội (đèn lồng, múa lân, bánh nướng, rước đèn…).",
      "Lời mời rõ ràng: thời gian, địa điểm và những việc hai người sẽ làm cùng nhau.",
    ],
    minWords: 100,
    maxWords: 150,
    structureVi: [
      "Mở đầu: chào, cảm ơn thư trước, giới thiệu chủ đề bức thư (Tết Trung Thu).",
      "Thân bài: ý nghĩa + 3 hoạt động tiêu biểu của lễ hội, ví dụ ở địa phương bạn.",
      "Kết: lời mời cụ thể (tháng 10, Hội An), câu hỏi giao tiếp, chào kết.",
    ],
    vocabularyHints: [
      { word: "the Mid-Autumn Festival", meaningVi: "Tết Trung Thu" },
      { word: "lantern", meaningVi: "đèn lồng" },
      { word: "lion dance", meaningVi: "múa lân" },
      { word: "mooncake", meaningVi: "bánh nướng / bánh nếp nhân" },
      { word: "take place", meaningVi: "diễn ra" },
      { word: "Would you like to…?", meaningVi: "Bạn có muốn… không?" },
    ],
    sampleAnswer:
      "Dear Claire,\n\nHow have you been? Thank you for your last letter about the little village where you grew up. I would like to tell you about my favourite festival here in Vietnam: the Mid-Autumn Festival, which takes place on the fifteenth day of the eighth lunar month, usually in September or October.\n\nChildren carry colourful lanterns through the streets and watch lion dances with their grandparents. Families sit together, eat mooncakes, and tell old stories under the full moon. In my town, there is a big parade in the main square every year.\n\nI am going to Hoi An this October for the festival. Would you like to come with me? I am sure you would love it.\n\nBest wishes,\nLinh",
    sampleNotesVi: [
      "Bài mở đầu bằng cách nhắc thư trước của bạn — thói quen điển hình của thư không chính thức, rất đúng dạng.",
      "Ba hoạt động cụ thể (rước đèn, múa lân, ăn bánh nướng dưới trăng) trả lời trọn yêu cầu về chi tiết lễ hội.",
      "Có câu hỏi giao tiếp (Would you like to come with me?) giữ nhịp hội thoại hai chiều, khác với thư trang trọng.",
      "Từ vựng văn hóa chính xác: Mid-Autumn Festival, lantern, lion dance, mooncake, take place; câu tương đối (which takes place…) chuẩn B1.",
    ],
    checklist: buildChecklist("informal_letter", 100, 150),
  },
  {
    id: "B1_WRITE_006",
    type: "formal_letter",
    title: "Reporting a Broken Bus Stop",
    topic: "transportation",
    level: "B1",
    promptVi:
      "Trạm xe buýt trước nhà bạn ở đường Nguyễn Trãi bị hỏng đèn chiếu sáng hơn 2 tháng và 2/3 băng ghế bị gãy, khiến hành khách chờ chuyến cuối lúc 21h30 phải đứng trong bóng tối. Viết thư chính thức (địa chỉ người gửi và người nhận, ngày, dòng Subject, Dear Sir or Madam, Yours faithfully) gửi Sở Giao thông thành phố, khoảng 100–150 từ.",
    requirementsVi: [
      "Đúng cấu trúc thư trang trọng: địa chỉ người gửi và người nhận, ngày, dòng Subject, lời chào Dear Sir/Madam, kết Yours faithfully.",
      "Mô tả vấn đề cụ thể về địa điểm, thời gian và ảnh hưởng đến hành khách.",
      "Đưa đề xuất xử lý và câu hỏi về thời gian dự kiến sửa chữa; giọng điệu trung lập, lịch sự.",
    ],
    minWords: 100,
    maxWords: 150,
    structureVi: [
      "Mở đầu: nêu mục đích thư (báo cáo sự cố) + địa điểm xảy ra.",
      "Thân bài: mô tả sự cố, thời gian, tác động đến hành khách, ví dụ cụ thể.",
      "Kết: đề xuất sửa chữa, hỏi thời gian dự kiến, lời cảm ơn trang trọng.",
    ],
    vocabularyHints: [
      { word: "bus stop", meaningVi: "trạm xe buýt" },
      { word: "report a problem", meaningVi: "báo cáo vấn đề" },
      { word: "as a result", meaningVi: "hậu quả là" },
      { word: "passenger", meaningVi: "hành khách" },
      { word: "repair", meaningVi: "sửa chữa" },
      { word: "Yours faithfully", meaningVi: "trân trọng (kết thư khi không biết tên người nhận)" },
    ],
    sampleAnswer:
      "Nguyen Van An\n24 Nguyen Trai Street, Da Nang City\n\n10 March 2026\n\nThe Director\nDa Nang Transport Department\nDa Nang City\n\nSubject: Poor condition of the bus stop on Nguyen Trai Street\n\nDear Sir or Madam,\n\nI am writing to report a serious problem at the bus stop opposite my building. The shelter's light has been broken for over two months, and two of the three benches have collapsed. As a result, passengers who wait for the last bus at about 9.30 p.m. have to stand in the dark, and several people have slipped when it rains.\n\nI would be grateful if you could repair the lighting and replace the damaged benches as soon as possible. Could you also tell me when the work is likely to be finished?\n\nThank you for your time and attention to this matter.\n\nYours faithfully,\nNguyen Van An",
    sampleNotesVi: [
      "Đủ cấu trúc thư chính thức: người gửi, người nhận, ngày, dòng Subject, Dear Sir/Madam và Yours faithfully (dùng khi không biết tên người nhận) — đúng nhất định của formal letter.",
      "Thân bài có bằng chứng cụ thể (hỏng hơn 2 tháng, 2/3 băng ghế, chuyến 21h30) thay vì chung chung, nên Task Achievement cao.",
      "Liên kết bằng As a result, and, when cho thấy quan hệ nhân – quả rõ ràng, Organization chặt chẽ.",
      "Giọng trung lập, không cảm xúc cá nhân: I would be grateful if…, Could you also tell me… — chuẩn văn phong hành chính.",
    ],
    checklist: buildChecklist("formal_letter", 100, 150),
  },
  {
    id: "B1_WRITE_007",
    type: "formal_letter",
    title: "Asking a University About Admission and Scholarships",
    topic: "education",
    level: "B1",
    promptVi:
      "Bạn dự định theo học ngành Kinh tế tại một đại quốc tế vào tháng 9 năm sau. Viết thư chính thức gửi bộ phận tuyển sinh hỏi về điều kiện đầu vào, học phí trong một năm, học bổng, chỗ ở cho sinh viên năm nhất và hạn nộp hồ sơ, khoảng 110–150 từ.",
    requirementsVi: [
      "Đúng định dạng thư trang trọng (địa chỉ, ngày, Dear Sir or Madam, Yours faithfully).",
      "Đặt ít nhất 3 câu hỏi cụ thể về tuyển sinh, học phí, học bổng và chỗ ở.",
      "Nêu ngắn lí do bạn quan tâm đến ngành học, kèm điểm số / chứng chỉ hiện có và thời hạn mong nhận phản hồi.",
    ],
    minWords: 110,
    maxWords: 150,
    structureVi: [
      "Mở đầu: giới thiệu mục đích thư và ngành/ khóa học bạn quan tâm.",
      "Thân bài: nêu nền tảng học tập của bạn + các câu hỏi cụ thể về điều kiện, chi phí, học bổng.",
      "Kết: thời hạn mong nhận thư trả lời, lời cảm ơn trang trọng.",
    ],
    vocabularyHints: [
      { word: "entry requirements", meaningVi: "điều kiện đầu vào" },
      { word: "tuition fee", meaningVi: "học phí" },
      { word: "scholarship", meaningVi: "học bổng" },
      { word: "application deadline", meaningVi: "hạn nộp hồ sơ" },
      { word: "accommodation", meaningVi: "chỗ ở" },
      { word: "I would be grateful if…", meaningVi: "Tôi sẽ biết ơn nếu…" },
    ],
    sampleAnswer:
      "Tran Bao Long\n18 Le Loi Street, District 1, Ho Chi Minh City\n\n5 April 2026\n\nThe Admissions Office\nInternational University\n\nDear Sir or Madam,\n\nI am writing to ask for information about the Bachelor's degree in Economics at your university, which I would like to start next September.\n\nCould you please tell me the entry requirements for international students, the tuition fee for one academic year, and the deadlines for scholarship applications? I would also be grateful if you could send me details of the accommodation available for first-year students. I finished upper secondary school last year with an average score of 8.2, and I already have an IELTS result of 6.5.\n\nI would appreciate a reply before 15 May, because I need to send my application in June.\n\nYours faithfully,\nTran Bao Long",
    sampleNotesVi: [
      "Bài hỏi đúng 4 thông tin (điều kiện, học phí, học bổng, chỗ ở) — vượt yêu cầu tối thiểu 3 câu hỏi của đề, Task Achievement rõ.",
      "Kết hợp tự giới thiệu năng lực (điểm 8.2, IELTS 6.5) giúp người nhận biết hồ sơ phù hợp, rất thực tế cho thư tuyển sinh.",
      "Câu hỏi đều mở đầu bằng Could you please / I would also be grateful if — văn phong trang trọng, nhất quán suốt bức thư.",
      "Cấu trúc ba phần rõ ràng, có dòng Subject-less nhưng đủ địa chỉ, ngày, lời chào và kết Yours faithfully đúng chuẩn.",
    ],
    checklist: buildChecklist("formal_letter", 110, 150),
  },
  {
    id: "B1_WRITE_008",
    type: "opinion_paragraph",
    title: "Should Students Use Phones in Class?",
    topic: "technology",
    level: "B1",
    promptVi:
      "Đề bài: “Học sinh nên được phép dùng điện thoại thông minh trong giờ học.” Bạn đồng ý hay phản đối? Viết một đoạn nghị luận khoảng 90–130 từ nêu quan điểm rõ ràng kèm ít nhất 2 lí do và 1 ví dụ minh họa.",
    requirementsVi: [
      "Nêu quan điểm dứt khoát ngay ở câu chủ đề (chấp thuận hoặc phản đối hoàn toàn).",
      "Có ít nhất 2 lí do phát triển và 1 ví dụ cụ thể minh họa cho lí do đó.",
      "Dùng từ nối và từ nối tương phản (First of all, Secondly, However, For example, In conclusion).",
    ],
    minWords: 90,
    maxWords: 130,
    structureVi: [
      "Mở đầu (câu chủ đề): nêu rõ bạn đồng ý hay phản đối.",
      "Thân bài: 2 lí do + ví dụ, mỗi ý một hoặc hai câu, có từ nối dẫn dắt.",
      "Kết: nhắc lại quan điểm bằng câu tổng kết (In conclusion…).",
    ],
    vocabularyHints: [
      { word: "in my opinion", meaningVi: "theo ý kiến của tôi" },
      { word: "distraction", meaningVi: "điều gây xao nhãng" },
      { word: "concentrate", meaningVi: "tập trung" },
      { word: "on the other hand", meaningVi: "mặt khác" },
      { word: "for instance", meaningVi: "ví dụ" },
      { word: "in conclusion", meaningVi: "kết luận lại" },
    ],
    sampleAnswer:
      "In my opinion, students should not be allowed to use smartphones during lessons. First of all, phones are a serious distraction: when a message arrives, pupils immediately stop listening and start checking their screens, so they miss important explanations. Secondly, teachers cannot control what students search for online, which may lead them to irrelevant or unsafe content. Some people argue that phones are useful for learning, but the school library already has computers for that purpose. For instance, my class used to check social media every break, and our test results fell noticeably. In conclusion, banning phones in class helps students concentrate and gives them more time to talk to their friends face to face.",
    sampleNotesVi: [
      "Câu chủ đề nêu quan điểm không nước đôi (should not be allowed) → đạt yêu cầu Task Achievement về lập trường rõ ràng.",
      "Có đủ 2 lí do (gây xao nhãng, kiểm soát nội dung), 1 ví dụ cá nhân (kết quả kiểm tra giảm) và cả ý phản biện được phản bác lại.",
      "Từ nối đa dạng và đúng chỗ: First of all, Secondly, but, For instance, In conclusion —Organization theo đúng dàn ý 3 phần.",
      "Từ vựng học thuật vừa sức B1: distraction, concentrate, irrelevant, face to face, thay vì lặp lại từ đơn.",
    ],
    checklist: buildChecklist("opinion_paragraph", 90, 130),
  },
  {
    id: "B1_WRITE_009",
    type: "opinion_paragraph",
    title: "Who Should Reduce Plastic Waste?",
    topic: "environment",
    level: "B1",
    promptVi:
      "Nhiều người cho rằng “Giảm rác thải nhựa là trách nhiệm chính của chính phủ, không phải của người dân.” Bạn đồng ý hay phản đối? Viết đoạn nghị luận 90–130 từ: nêu quan điểm, ít nhất 2 lí do và 1 ví dụ thực tế.",
    requirementsVi: [
      "Câu chủ đề nêu quan điểm rõ ràng về người chịu trách nhiệm (chính phủ / người dân / cả hai).",
      "Phát triển ít nhất 2 lí do và đưa 1 ví dụ thực tế ở địa phương bạn.",
      "Có ít nhất một câu nêu ý kiến trái chiều và cách bạn phản bác lại.",
    ],
    minWords: 90,
    maxWords: 130,
    structureVi: [
      "Mở đầu: nêu quan điểm về trách nhiệm giảm rác thải nhựa.",
      "Thân bài: 2 lí do (quyền lực ban hành quy định, khả năng đầu tư hạ tầng) + ví dụ + ý phản bác.",
      "Kết: tổng kết lại quan điểm trong một câu.",
    ],
    vocabularyHints: [
      { word: "take responsibility", meaningVi: "chịu trách nhiệm" },
      { word: "single-use plastic", meaningVi: "nhựa dùng một lần" },
      { word: "recyclable", meaningVi: "có thể tái chế" },
      { word: "to begin with", meaningVi: "đầu tiên" },
      { word: "voluntarily", meaningVi: "tự nguyện" },
      { word: "pollution", meaningVi: "ô nhiễm" },
    ],
    sampleAnswer:
      "In my view, governments should take the main responsibility for reducing plastic waste, although ordinary people also have a part to play. To begin with, only governments can ban single-use plastic bags and force factories to use recyclable packaging, because companies will not change voluntarily if it costs them more money. In addition, authorities can invest in recycling systems that individuals cannot build on their own. Some people claim that citizens should simply use fewer plastic items, but most shoppers follow the law rather than good intentions. For example, since my city started charging for plastic bags, the number of bags in the market has dropped sharply. In short, strong rules from the government are the fastest way to reduce pollution.",
    sampleNotesVi: [
      "Quan điểm rõ (chính phủ chịu trách nhiệm chính) nhưng vẫn công nhận vai trò người dân → lập trường cân bằng mà không mơ hồ.",
      "Bài có đủ cấu trúc lập luận: 2 lí do, 1 ý phản bác (Some people claim that…) và ví dụ thực tế (thành phố thu phí túi ni lông).",
      "Từ nối phong phú: To begin with, In addition, because, rather than, For example, In short — Organization rất mạch lạc.",
      "Từ vựng môi trường chuẩn: single-use plastic, recyclable, voluntarily, pollution, ban — đúng chủ đề và mức B1.",
    ],
    checklist: buildChecklist("opinion_paragraph", 90, 130),
  },
  {
    id: "B1_WRITE_010",
    type: "opinion_paragraph",
    title: "Working from Home vs Working in the Office",
    topic: "work",
    level: "B1",
    promptVi:
      "Sau đại dịch, nhiều công ty cho phép nhân viên làm việc tại nhà. Bạn có nghĩ làm việc tại nhà tốt hơn làm việc tại văn phòng cho các công việc văn phòng không? Viết đoạn nghị luận khoảng 90–130 từ với quan điểm, 2 lí do và phương án bạn đề xuất.",
    requirementsVi: [
      "Nêu quan điểm cá nhân rõ ràng ngay câu đầu.",
      "Có ít nhất 2 lí do (thời gian đi lại, tự sắp xếp lịch / sự cô lập, thiếu cộng tác) và 1 dẫn chứng.",
      "Kết đoạn bằng một đề xuất khả thi (ví dụ: mô hình kết hợp).",
    ],
    minWords: 90,
    maxWords: 130,
    structureVi: [
      "Mở đầu: quan điểm về làm việc tại nhà.",
      "Thân bài: 2 lợi điểm/challenges, có từ nối tương phản (However, What is more).",
      "Kết: đề xuất của bạn (mô hình lai) và lý do.",
    ],
    vocabularyHints: [
      { word: "commute", meaningVi: "đi lại hàng ngày tới nơi làm" },
      { word: "flexible", meaningVi: "linh hoạt" },
      { word: "productivity", meaningVi: "năng suất" },
      { word: "feel lonely", meaningVi: "cảm thấy cô đơn" },
      { word: "a mixed model", meaningVi: "mô hình kết hợp" },
      { word: "on the one hand… on the other hand", meaningVi: "một mặt… mặt khác" },
    ],
    sampleAnswer:
      "In my opinion, working from home is more effective than working in an office for most desk jobs. The main advantage is that employees save the time and money they would otherwise spend on travelling; many office workers lose almost two hours a day commuting in big cities. What is more, people can organise their own schedule and take short breaks when they feel tired, which often improves the quality of their work. However, some employees feel lonely at home and miss the support of their colleagues. Therefore, companies should offer a mixed model: three days at home and two days in the office. This arrangement keeps productivity high while still allowing real teamwork.",
    sampleNotesVi: [
      "Quan điểm nêu ngay câu đầu và được giữ nhất quán đến câu cuối — Task Achievement rõ ràng, không lan man.",
      "Lập luận hai mặt (lợi ích + However, khó khăn) rồi đưa đề xuất kết hợp → Organization rất hợp lý cho đoạn nghị luận.",
      "Câu liên kết từ (which often improves…, while still allowing…) là dấu hiệu grammar cấp B1.",
      "Từ vựng công việc: commute, flexible, productivity, mixed model, teamwork — được dùng đúng ngữ cảnh.",
    ],
    checklist: buildChecklist("opinion_paragraph", 90, 130),
  },
  {
    id: "B1_WRITE_011",
    type: "short_essay",
    title: "Why a Healthy Lifestyle Matters for Young People",
    topic: "health",
    level: "B1",
    promptVi:
      "Viết bài văn ngắn (short essay) 100–140 từ với đề: “Vì sao lối sống lành mạnh quan trọng với người trẻ?”. Bài cần nêu ít nhất 2 lí do kèm ví dụ cụ thể và kết luận đưa ra lời khuyên.",
    requirementsVi: [
      "Đủ 3 phần: mở đầu giới thiệu vấn đề, thân bài ít nhất 2 lí do + ví dụ, kết luận nêu khuyến nghị.",
      "Mỗi lí do phát triển ít nhất 2 câu và có ví dụ hoặc số liệu đơn giản minh họa.",
      "Dùng từ nối xếp hạng (Firstly, Secondly) và từ nối kết luận (In conclusion).",
    ],
    minWords: 100,
    maxWords: 140,
    structureVi: [
      "Mở đầu: khẳng định tầm quan trọng của lối sống lành mạnh với người trẻ.",
      "Thân bài: lí do 1 (vận động → năng lượng, ngủ ngon) và lí do 2 (ăn uống → phòng bệnh), mỗi ý kèm ví dụ.",
      "Kết: tổng kết + lời khuyên khả thi cho học sinh.",
    ],
    vocabularyHints: [
      { word: "regular exercise", meaningVi: "tập luyện đều đặn" },
      { word: "a healthy diet", meaningVi: "chế độ ăn lành mạnh" },
      { word: "reduce stress", meaningVi: "giảm căng thẳng" },
      { word: "be likely to", meaningVi: "có xu hướng, có khả năng" },
      { word: "in conclusion", meaningVi: "tóm lại" },
      { word: "fast food", meaningVi: "thức ăn nhanh" },
    ],
    sampleAnswer:
      "A healthy lifestyle is especially important for young people because it affects both their studies and their future. Firstly, regular exercise gives students the energy they need to sit through long lessons. Just thirty minutes of cycling or swimming four times a week is enough to improve sleep and reduce stress. Secondly, good food builds a strong body; teenagers who eat fruit and vegetables every day are less likely to catch common illnesses than those who live on fast food and soft drinks. Of course, healthy habits are not difficult to start. Students can replace one snack with an apple and walk to school instead of taking a motorbike. In conclusion, small daily choices in exercise and diet help young people study better and feel happier.",
    sampleNotesVi: [
      "Bài đi đúng dàn ý 3 phần: mở đầu khẳng định, 2 lí do kèm ví dụ, kết luận có lời khuyên — Organization đạt tối đa.",
      "Lí do đều được chứng minh bằng chi tiết khả thi (30 phút bơi/lập kênh 4 lần/tuần, thay snack bằng táo) thay vì nói suông.",
      "Từ nối xếp hạng Firstly / Secondly / In conclusion và cấu trúc so sánh (less likely… than…) rất đúng chuẩn B1.",
      "Từ vựng chủ đề sức khỏe phong phú: regular exercise, a healthy diet, reduce stress, fast food, illness.",
    ],
    checklist: buildChecklist("short_essay", 100, 140),
  },
  {
    id: "B1_WRITE_012",
    type: "short_essay",
    title: "The Benefits and Challenges of International Travel",
    topic: "travel",
    level: "B1",
    promptVi:
      "Viết bài văn ngắn khoảng 100–150 từ về lợi ích của việc du lịch nước ngoài và một thách thức của loại hình này, kèm kết luận nêu quan điểm cá nhân của bạn.",
    requirementsVi: [
      "Mở đầu nêu chủ đề và ghi rõ bài sẽ bàn về cả lợi ích lẫn thách thức.",
      "Thân bài nêu ít nhất 2 lợi ích và 1 thách thức, mỗi ý có ví dụ hoặc giải thích.",
      "Kết luận nêu rõ bạn đánh giá lợi ích hay nhược điểm lớn hơn.",
    ],
    minWords: 100,
    maxWords: 150,
    structureVi: [
      "Mở đầu: du lịch nước ngoài là cách học hỏi — nêu cấu trúc bài (lợi ích + thách thức).",
      "Thân bài: 2 lợi ích (văn hóa, kỹ năng độc lập) + 1 thách thức (chi phí, ý thức du khách).",
      "Kết: khẳng định lợi ích lớn hơn và kêu gọi đi du lịch.",
    ],
    vocabularyHints: [
      { word: "on the one hand… on the other hand", meaningVi: "mặt khác / ngược lại" },
      { word: "broaden one's mind", meaningVi: "mở mang tầm nhìn" },
      { word: "independence", meaningVi: "sự độc lập" },
      { word: "challenge", meaningVi: "thách thức" },
      { word: "local customs", meaningVi: "phong tục địa phương" },
      { word: "far greater than", meaningVi: "lớn hơn nhiều so với" },
    ],
    sampleAnswer:
      "Travelling to a new country is one of the best ways to learn about the world, although it also brings a few challenges. On the one hand, when we travel, we see how people in other cultures live, work and celebrate. We try new food, listen to a different language, and return home with a much broader mind. In addition, travelling teaches independence, because we have to book tickets, plan routes and solve problems without our parents. On the other hand, international trips can be expensive and tiring, and some tourists do not respect local customs. In conclusion, the benefits of travelling are far greater than the disadvantages, so everyone should try to visit at least one foreign country in their lifetime.",
    sampleNotesVi: [
      "Bài có đủ dàn ý Introduction – Body (2 lợi ích, 1 thách thức) – Conclusion, quan điểm kết luận rõ ràng → Task Achievement tốt.",
      "Cấu trúc tương phản On the one hand / On the other hand được dùng chính xác, giúp Organization mạch lạc.",
      "Danh sách động từ nối (live, work and celebrate; book, plan and solve) tạo nhịp văn tự nhiên, không đơn điệu.",
      "Từ vựng đạt chuẩn essay: broaden one's mind, independence, local customs, far greater than — đúng ngữ cảnh.",
    ],
    checklist: buildChecklist("short_essay", 100, 150),
  },
  {
    id: "B1_WRITE_013",
    type: "advice",
    title: "Advice for a Friend Who Is Always Tired",
    topic: "health",
    level: "B1",
    promptVi:
      "Bạn thân của bạn là Minh phàn nàn rằng dạo này cậu ấy thường xuyên thức khuya ôn bài, mệt mỏi vào ban ngày và không còn thời gian tập thể dục. Viết thư đưa lời khuyên, khoảng 100–140 từ.",
    requirementsVi: [
      "Mở đầu bày tỏ sự đồng cảm với hoàn cảnh của bạn, không phán xét.",
      "Đưa ít nhất 3 lời khuyên cụ thể, khả thi, mỗi lời khuyên kèm lý do hoặc lợi ích.",
      "Kết thư bằng câu động viên; dùng cấu trúc should / could / Why don't you…? để đưa lời khuyên.",
    ],
    minWords: 100,
    maxWords: 140,
    structureVi: [
      "Mở đầu: đồng cảm và nêu vấn đề của bạn (thiếu ngủ, mệt mỏi).",
      "Thân bài: 3 lời khuyên (ngủ đủ, vận động, sắp xếp thời gian) kèm lợi ích của mỗi lời khuyên.",
      "Kết: động viên, khẳng định sức khỏe quan trọng hơn học thêm một giờ.",
    ],
    vocabularyHints: [
      { word: "stay up late", meaningVi: "thức khuya" },
      { word: "instead of", meaningVi: "thay vì" },
      { word: "at the last minute", meaningVi: "ngay phút chót" },
      { word: "feel better", meaningVi: "cảm thấy khỏe hơn" },
      { word: "Why don't you…?", meaningVi: "Sao bạn không…?" },
      { word: "Remember that…", meaningVi: "Hãy nhớ rằng…" },
    ],
    sampleAnswer:
      "Dear Minh,\n\nI was sorry to hear that you have been feeling tired and stressed lately. Here are a few suggestions that may help you. First of all, you should stop studying after midnight, because your brain needs at least seven hours of sleep to remember what you have learned. Secondly, why don't you cycle to school every morning? It is a simple way to exercise without booking any classes. Thirdly, try to plan your week on Sunday evening and put the most difficult tasks first, so you will not have to rush at the last minute.\n\nRemember that your health is more important than one extra hour of revision. I am sure you will feel much better soon.\n\nBest wishes,\nLan",
    sampleNotesVi: [
      "Mở đầu bằng sự đồng cảm (I was sorry to hear…) thay vì lên tiếng trách móc — đúng tinh thần của một bài đưa lời khuyên.",
      "Ba lời khuyên đều cụ thể và kèm lý do (ngủ 7 giờ để nhớ bài, đạp xe thay vì đăng ký lớp, lên lịch Chủ nhật) → Task Achievement cao.",
      "Dùng đa dạng cấu trúc Advice: First of all… you should, Why don't you…?, Thirdly, Remember that… — rất tốt cho phần Grammar.",
      "Có câu kết động viên và khẳng định nguyên tắc, khiến bài có cấu trúc Mở – Thân – Kết trọn vẹn.",
    ],
    checklist: buildChecklist("advice", 100, 140),
  },
  {
    id: "B1_WRITE_014",
    type: "advice",
    title: "Helping a Shy Friend Prepare a Presentation",
    topic: "communication",
    level: "B1",
    promptVi:
      "Người bạn của bạn, Lan, sắp phải thuyết trình trước khoảng 200 người nhưng rất nhút nhát và lo lắng. Viết email đưa lời khuyên (khoảng 100–140 từ) giúp Lan tự tin hơn và chuẩn bị tốt.",
    requirementsVi: [
      "Mở đầu trấn an, khích lệ bạn trước khi đưa lời khuyên.",
      "Đưa ít nhất 3 lời khuyên cụ thể về chuẩn bị, luyện tập và xử lý tình huống trên sân khấu.",
      "Dùng cấu trúc đưa lời khuyên (should, could, Why don't you, If I were you) và kết thúc bằng lời chúc may mắn.",
    ],
    minWords: 100,
    maxWords: 140,
    structureVi: [
      "Mở đầu: trấn an (hầu hết ai cũng lo) và nêu mục đích bức email.",
      "Thân bài: 3 lời khuyên — luyện trước gương/ghi hình, đến sớm kiểm tra thiết bị, mở đầu bằng câu hỏi cho khán giả.",
      "Kết: nhắc lại tinh thần khích lệ và chúc may mắn.",
    ],
    vocabularyHints: [
      { word: "nervous", meaningVi: "hơi lo lắng, hồi hộp" },
      { word: "practise in front of a mirror", meaningVi: "luyện tập trước gương" },
      { word: "audience", meaningVi: "khán giả" },
      { word: "Take a deep breath", meaningVi: "hít thở sâu" },
      { word: "Good luck!", meaningVi: "Chúc may mắn!" },
      { word: "as soon as possible", meaningVi: "càng sớm càng tốt" },
    ],
    sampleAnswer:
      "Dear Lan,\n\nDon't worry about your presentation next week; almost everyone feels nervous before speaking in public. Here is my advice. First, you should practise the speech in front of a mirror until you know every part, and then record yourself so that you can hear your own mistakes. Secondly, arrive early on the day and check the slides and the projector before the audience comes in; this small habit makes most problems disappear. Thirdly, open your talk with a question for the listeners, because they will answer instead of watching you, and you will have a few seconds to breathe. Finally, remember that the audience wants you to succeed. Take a deep breath, smile and enjoy it.\n\nGood luck,\nMai",
    sampleNotesVi: [
      "Mở đầu khích lệ đúng cách (almost everyone feels nervous) giúp bài có thái độ phù hợp với dạng giving advice.",
      "Ba lời khuyên rất khả thi và cụ thể: luyện trước gương + ghi âm, đến sớm kiểm tra máy chiếu, mở đầu bằng câu hỏi — đều có lý do giải thích.",
      "Đủ cấu trúc liên kết: First, Secondly, Thirdly, Finally, because, so — Organization rõ ràng, dễ theo dõi.",
      "Từ vựng giao tiếp/phát biểu chuẩn: nervous, audience, practise, Take a deep breath, presentation.",
    ],
    checklist: buildChecklist("advice", 100, 140),
  },
  {
    id: "B1_WRITE_015",
    type: "experience",
    title: "A Concert I Will Never Forget",
    topic: "entertainment",
    level: "B1",
    promptVi:
      "Hãy kể về một buổi hòa nhạc / đêm biểu diễn bạn đã tham dự và nhớ mãi (khoảng 100–150 từ): khi nào, ở đâu, đi với ai, điều gì khiến bạn ấn tượng nhất và cảm xúc của bạn sau đó.",
    requirementsVi: [
      "Kể theo trình tự thời gian, dùng thì quá khứ và từ nối thời gian (First, Then, After that, At the end).",
      "Có ít nhất 3 chi tiết cụ thể: địa điểm, thời gian, hoạt động và cảm xúc của bạn.",
      "Câu kết nêu lại kỷ niệm đó vì sao đáng nhớ với bạn.",
    ],
    minWords: 100,
    maxWords: 150,
    structureVi: [
      "Mở đầu: giới thiệu sự kiện (hòa nhạc mùa hè, địa điểm, đi cùng ai).",
      "Thân bài: diễn biến theo thứ tự thời gian + chi tiết ấn tượng và cảm xúc.",
      "Kết: nêu lý do kỷ niệm này nhớ mãi.",
    ],
    vocabularyHints: [
      { word: "music festival", meaningVi: "lễ hội âm nhạc" },
      { word: "cheer", meaningVi: "hò reo, cổ vũ" },
      { word: "at the end", meaningVi: "cuối cùng" },
      { word: "fireworks", meaningVi: "pháo hoa" },
      { word: "burst of colour", meaningVi: "vụt bừng sắc màu" },
      { word: "hoarse", meaningVi: "khản giọng" },
    ],
    sampleAnswer:
      "Last summer I went to a music festival in Da Nang with two of my closest friends, and it is still the best night of my life. The concert began at eight in the evening, but we arrived at six to find a place near the stage. When the lights suddenly went out, thousands of people cheered, and then the band appeared in a huge burst of colour. I had never heard so many voices singing together before. My friends and I jumped, clapped and sang every word of our favourite song. At the end, fireworks filled the sky above the sea. I went home with a hoarse voice but a very happy heart, and I bought a ticket for the next festival the same week.",
    sampleNotesVi: [
      "Diễn biến kể theo đúng trật tự thời gian (at eight… but we arrived at six… When the lights… At the end) → Organization mạch lạc cho dạng experience.",
      "Chi tiết cụ thể và có cảm xúc (vụt tắt ánh sáng, pháo hoa trên biển, khản giọng) khiến bài khônggeneric, Task Achievement cao.",
      "Dùng thì quá khứ chính xác throughout: began, arrived, went out, cheered, appeared, bought; kèm câu past perfect ở lại mức B1 (I had never heard…).",
      "Từ vựng giải trí phong phú: festival, cheer, fireworks, burst of colour, hoarse — tránh lặp lại good / fun.",
    ],
    checklist: buildChecklist("experience", 100, 150),
  },
  {
    id: "B1_WRITE_016",
    type: "experience",
    title: "A Family Gathering I Will Never Forget",
    topic: "family",
    level: "B1",
    promptVi:
      "Kể về một sự kiện gia đình bạn nhớ mãi (ví dụ: bữa cơm sum họp dịp Tết, đám cưới anh chị, chuyến du lịch của cả nhà) trong khoảng 100–150 từ: điều gì đã xảy ra, có những ai, và vì sao bạn nhớ khoảnh khắc đó.",
    requirementsVi: [
      "Kể theo trình tự thời gian, dùng thì quá khứ và ít nhất 2 từ nối (After that, When, At midnight…).",
      "Nêu rõ bối cảnh (thời gian, địa điểm, thành viên tham gia) và ít nhất 3 chi tiết cụ thể về sự kiện.",
      "Câu kết nêu cảm xúc và bài học / lý do bạn nhớ mãi.",
    ],
    minWords: 100,
    maxWords: 150,
    structureVi: [
      "Mở đầu: giới thiệu sự kiện (bữa cơm Tết ở quê bà, cách đây 3 năm) và thành viên tham gia.",
      "Thân bài: các hoạt động theo thời gian (nấu ăn, ăn tối, trò chơi, pháo hoa) + chi tiết cảm xúc.",
      "Kết: lý do khoảnh khắc ấy đáng nhớ (giá trị của thời gian bên gia đình).",
    ],
    vocabularyHints: [
      { word: "family gathering", meaningVi: "buổi sum họp gia đình" },
      { word: "Lunar New Year", meaningVi: "Tết âm lịch" },
      { word: "traditional dishes", meaningVi: "món ăn truyền thống" },
      { word: "lucky money", meaningVi: "tiền lì xì" },
      { word: "at midnight", meaningVi: "lúc nửa đêm" },
      { word: "remind me that", meaningVi: "nhắc tôi rằng" },
    ],
    sampleAnswer:
      "The family gathering I will never forget is the Lunar New Year dinner at my grandmother's house three years ago. My grandparents live in a small village, so all twenty members of the family had to travel there, and this was the first time everyone had been together for five years. My aunt and my mother cooked for two whole days, and the table was full of traditional dishes such as spring rolls and boiled chicken. After dinner, we played cards, my uncle told funny stories about his childhood, and the children received envelopes with lucky money. At midnight, we stood in the garden and watched fireworks over the rice fields. That evening reminded me that nothing is more valuable than time with my family.",
    sampleNotesVi: [
      "Bài có bối cảnh đầy đủ (3 năm trước, làng quê, 20 thành viên, lần đầu đủ sau 5 năm) → đáp ứng trọn yêu cầu mô tả sự kiện.",
      "Diễn biến theo thời gian rõ ràng: nấu ăn → bữa tối → trò chơi → nửa đêm xem pháo hoa, chốt bằng bài học cá nhân.",
      "Grammar thử thách nhưng chính xác: past perfect (had been together), such as, reminded me that — phù hợp trình độ B1.",
      "Từ vựng gia đình/culture chính xác: gathering, Lunar New Year, traditional dishes, lucky money, rice fields.",
    ],
    checklist: buildChecklist("experience", 100, 150),
  },
];
