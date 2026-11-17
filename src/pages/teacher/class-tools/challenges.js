/**
 * challenges.js — Ngân hàng Thử thách Sư phạm của tab Nề nếp.
 *
 * 35 thẻ viết MỚI hoàn toàn cho học sinh TIỂU HỌC (lớp 1–5): 5 môn × 7
 * thẻ, mỗi môn trộn 3 mức Dễ / Vừa / Khó. Thẻ là "thử thách sư phạm" —
 * việc học sinh làm ngay tại lớp sau bài học (giảng lại cho bạn, tìm ví
 * dụ thật, đóng vai, đặt câu hỏi ngược…) chứ không phải câu hỏi kiểm tra.
 * Chỉ lấy cảm hứng ĐỊNH DẠNG từ ảnh mẫu ("MÔN • MỨC + một câu thử
 * thách"), nội dung tự viết cho lứa tuổi tiểu học.
 *
 * subject: "toan" | "tieng-viet" | "tieng-anh" | "khoa-hoc" | "dao-duc"
 * level:   "easy" (Dễ) | "medium" (Vừa) | "hard" (Khó)
 */

export const CHALLENGE_SUBJECTS = [
  { id: "toan", label: "Toán" },
  { id: "tieng-viet", label: "Tiếng Việt" },
  { id: "tieng-anh", label: "Tiếng Anh" },
  { id: "khoa-hoc", label: "Khoa học" },
  { id: "dao-duc", label: "Đạo đức / HĐTN" },
];

export const CHALLENGE_LEVELS = [
  { id: "easy", label: "Dễ" },
  { id: "medium", label: "Vừa" },
  { id: "hard", label: "Khó" },
];

export const CHALLENGE_SUBJECT_LABEL = Object.fromEntries(CHALLENGE_SUBJECTS.map((s) => [s.id, s.label]));
export const CHALLENGE_LEVEL_LABEL = Object.fromEntries(CHALLENGE_LEVELS.map((l) => [l.id, l.label]));

export const CHALLENGES = [
  // ── Toán ────────────────────────────────────────────────────────────
  { id: "toan-1", subject: "toan", level: "easy", text: "Hãy nêu một ví dụ ngay trong lớp học có dùng đến phép tính em vừa học — ví dụ đếm bút chì, chia kẹo hay đo chiều dài bàn học." },
  { id: "toan-2", subject: "toan", level: "easy", text: "Đóng vai cô giáo, thầy giáo: giảng lại cho bạn bên cạnh cách làm một bài tính em vừa làm, bằng lời của chính em." },
  { id: "toan-3", subject: "toan", level: "easy", text: "Tìm trong phòng học 3 đồ vật có hình dạng giống hình em vừa học và kể tên từng đồ vật cho cả lớp nghe." },
  { id: "toan-4", subject: "toan", level: "medium", text: "Hãy nêu một cách giải khác cho bài toán vừa làm. Theo em, cách nào nhanh hơn? Vì sao?" },
  { id: "toan-5", subject: "toan", level: "medium", text: "Tự nghĩ một bài toán giống bài vừa học nhưng thay số khác, rồi đố bạn bên cạnh giải bài toán của em." },
  { id: "toan-6", subject: "toan", level: "hard", text: "Nếu thay đổi một con số trong bài toán vừa học, đáp án sẽ thay đổi như thế nào? Hãy thử tính và giải thích cho cả lớp." },
  { id: "toan-7", subject: "toan", level: "hard", text: "Hãy nghĩ ngược lại: cho sẵn đáp án, em hãy bịa một bài toán có đáp án đúng như vậy và đọc cho cả lớp kiểm tra." },

  // ── Tiếng Việt ──────────────────────────────────────────────────────
  { id: "tv-1", subject: "tieng-viet", level: "easy", text: "Kể lại câu chuyện hoặc đoạn văn vừa đọc bằng đúng 3 câu ngắn gọn, theo lời của em." },
  { id: "tv-2", subject: "tieng-viet", level: "easy", text: "Tìm trong bài đọc 3 từ em thích nhất, rồi chọn một từ để đặt một câu thật hay." },
  { id: "tv-3", subject: "tieng-viet", level: "easy", text: "Chọn đoạn em thích nhất trong bài và đọc lại thật biểu cảm cho cả lớp nghe." },
  { id: "tv-4", subject: "tieng-viet", level: "medium", text: "Nếu được gặp nhân vật trong bài đọc, em sẽ hỏi bạn ấy điều gì? Vì sao em muốn hỏi điều đó?" },
  { id: "tv-5", subject: "tieng-viet", level: "medium", text: "Vẽ một bức tranh hoặc sơ đồ đơn giản tóm tắt nội dung chính của bài đọc, rồi giới thiệu tranh của em." },
  { id: "tv-6", subject: "tieng-viet", level: "hard", text: "Hãy nghĩ một kết thúc khác cho câu chuyện và kể cho cả lớp nghe. Kết thúc của em thú vị hơn ở chỗ nào?" },
  { id: "tv-7", subject: "tieng-viet", level: "hard", text: "Đóng vai nhân vật trong bài và tự giới thiệu: em là ai, em đã làm những gì, và em cảm thấy thế nào." },

  // ── Tiếng Anh ───────────────────────────────────────────────────────
  { id: "ta-1", subject: "tieng-anh", level: "easy", text: "Giới thiệu bản thân bằng 2 câu tiếng Anh đơn giản: tên em và một sở thích của em." },
  { id: "ta-2", subject: "tieng-anh", level: "easy", text: "Chỉ vào 3 đồ vật trong lớp và nói tên tiếng Anh của chúng thật to, rõ ràng." },
  { id: "ta-3", subject: "tieng-anh", level: "easy", text: "Cùng bạn bên cạnh hát hoặc đọc lại một câu trong bài hát (chant) vừa học." },
  { id: "ta-4", subject: "tieng-anh", level: "medium", text: "Đóng vai cùng một bạn: hai em hỏi – đáp với nhau 3 câu bằng mẫu câu vừa học." },
  { id: "ta-5", subject: "tieng-anh", level: "medium", text: "Nhìn bức tranh trong sách, nói 2 câu tiếng Anh miêu tả những gì em thấy trong tranh." },
  { id: "ta-6", subject: "tieng-anh", level: "hard", text: "Dùng 3 từ mới vừa học để kể một câu chuyện ngắn 3 câu bằng tiếng Anh." },
  { id: "ta-7", subject: "tieng-anh", level: "hard", text: "Đóng vai cô giáo, thầy giáo: dạy lại cho cả lớp một từ mới — đọc mẫu, rồi cho một ví dụ bằng tiếng Anh." },

  // ── Khoa học (Tự nhiên & Xã hội) ────────────────────────────────────
  { id: "kh-1", subject: "khoa-hoc", level: "easy", text: "Kể tên 3 con vật hoặc cây cối em nhìn thấy trên đường đi học và nói chúng sống ở đâu." },
  { id: "kh-2", subject: "khoa-hoc", level: "easy", text: "Quan sát một cây ở sân trường (hoặc trong tranh) và nêu 2 điểm khác nhau giữa cây đó với một cây khác em biết." },
  { id: "kh-3", subject: "khoa-hoc", level: "easy", text: "Nêu một việc em làm hằng ngày để giữ cơ thể sạch sẽ, khỏe mạnh, và giải thích vì sao việc đó quan trọng." },
  { id: "kh-4", subject: "khoa-hoc", level: "medium", text: "Dự đoán: nếu để một cốc nước ngoài nắng suốt buổi sáng, điều gì sẽ xảy ra? Em sẽ kiểm tra dự đoán của mình bằng cách nào?" },
  { id: "kh-5", subject: "khoa-hoc", level: "medium", text: "Chọn 6 đồ vật trong lớp, chia chúng thành hai nhóm và giải thích em dựa vào đâu để chia như vậy." },
  { id: "kh-6", subject: "khoa-hoc", level: "hard", text: "Nếu loài ong biến mất, điều gì có thể xảy ra với cây cối và con người? Hãy giải thích theo suy nghĩ của em." },
  { id: "kh-7", subject: "khoa-hoc", level: "hard", text: "Thiết kế một thí nghiệm đơn giản để trả lời câu hỏi: “Cây có cần ánh sáng để lớn lên không?” Em sẽ làm từng bước như thế nào?" },

  // ── Đạo đức / Hoạt động trải nghiệm ─────────────────────────────────
  { id: "dd-1", subject: "dao-duc", level: "easy", text: "Kể một việc tốt em đã làm trong tuần này và nói cảm giác của em khi làm việc đó." },
  { id: "dd-2", subject: "dao-duc", level: "easy", text: "Đóng vai với bạn bên cạnh một tình huống em cần nói lời cảm ơn hoặc lời xin lỗi cho đúng lúc, đúng cách." },
  { id: "dd-3", subject: "dao-duc", level: "easy", text: "Nêu 2 việc ở nhà em đã tự làm được mà không cần bố mẹ nhắc nhở." },
  { id: "dd-4", subject: "dao-duc", level: "medium", text: "Một bạn trong lớp bị ngã ở sân trường. Em sẽ làm gì? Hãy đóng vai lại tình huống đó cùng một bạn khác." },
  { id: "dd-5", subject: "dao-duc", level: "medium", text: "Cả nhóm cùng nghĩ 3 quy định giúp lớp học sạch đẹp, rồi chọn một quy định quan trọng nhất và giải thích vì sao." },
  { id: "dd-6", subject: "dao-duc", level: "hard", text: "Hai bạn cùng muốn chơi một món đồ chơi. Em hãy nêu 2 cách giải quyết để cả hai bạn đều vui." },
  { id: "dd-7", subject: "dao-duc", level: "hard", text: "Nếu em là lớp trưởng trong một ngày, em sẽ làm những gì để lớp mình vui hơn và đoàn kết hơn?" },
];
