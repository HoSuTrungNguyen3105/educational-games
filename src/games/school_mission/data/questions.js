// ===== DỮ LIỆU CÂU HỎI & BÀI THI — CHỈ CẦN SỬA FILE NÀY =====
// mode: "math" (toán ngẫu nhiên) | "vocab" (cặp từ [tiếng Anh, nghĩa]) | "quiz" (câu hỏi tự soạn)
// answer = số thứ tự đáp án đúng trong options (bắt đầu từ 0). explain là tùy chọn.
// exams[]: subject là math/eng/sci/van, passPercent, time (giây/câu, 0 = không giới hạn), reward.
const QUESTION_DATA = {
 "settings": {
  "questionsPerLesson": 3,
  "coinsPerCorrect": 8,
  "xpPerCorrect": 6,
  "energyPerLesson": 10,
  "energyPerExam": 15
 },
 "subjects": {
  "math": { "title": "🧮 Giờ Toán", "mode": "math" },
  "eng": {
   "title": "🔤 Tiếng Anh",
   "mode": "vocab",
   "vocab": [["apple","quả táo"],["book","quyển sách"],["teacher","giáo viên"],["school","trường học"],["friend","bạn bè"],["water","nước"],["cat","con mèo"],["happy","vui vẻ"],["red","màu đỏ"],["door","cửa ra vào"],["window","cửa sổ"],["pencil","bút chì"],["bird","con chim"],["sun","mặt trời"]]
  },
  "sci": {
   "title": "🧪 Khoa học vui",
   "mode": "quiz",
   "questions": [
    {"q":"Hành tinh nào gần Mặt Trời nhất?","options":["Sao Thủy","Sao Kim","Trái Đất","Sao Hỏa"],"answer":0},
    {"q":"Nước sôi ở bao nhiêu độ C?","options":["50","100","150","80"],"answer":1,"explain":"Ở điều kiện bình thường, nước sôi ở 100°C."},
    {"q":"Cây hấp thụ khí gì để quang hợp?","options":["Oxy","Nitơ","CO2","Heli"],"answer":2},
    {"q":"Con vật nào là động vật có vú?","options":["Cá heo","Cá mập","Cá sấu","Cá vàng"],"answer":0},
    {"q":"Trái Đất quay quanh gì?","options":["Mặt Trăng","Mặt Trời","Sao Hỏa","Sao Thổ"],"answer":1},
    {"q":"Nam châm hút kim loại nào?","options":["Nhôm","Đồng","Sắt","Vàng"],"answer":2},
    {"q":"Mặt Trời mọc ở hướng nào?","options":["Tây","Bắc","Nam","Đông"],"answer":3},
    {"q":"Nước đá là nước ở thể nào?","options":["Lỏng","Rắn","Khí","Plasma"],"answer":1}
   ]
  },
  "van": {
   "title": "📖 Ngữ văn",
   "mode": "quiz",
   "questions": [
    {"q":"Từ trái nghĩa với \"cao\" là gì?","options":["thấp","to","xa","dài"],"answer":0},
    {"q":"Từ nào là danh từ?","options":["chạy","bàn","đẹp","nhanh"],"answer":1},
    {"q":"Từ đồng nghĩa với \"chăm chỉ\"?","options":["lười biếng","cần cù","vội vàng","buồn bã"],"answer":1},
    {"q":"Thủ đô của Việt Nam là?","options":["Huế","Đà Nẵng","Hà Nội","Cần Thơ"],"answer":2},
    {"q":"Từ trái nghĩa với \"vui\" là?","options":["buồn","mừng","cười","nhảy"],"answer":0},
    {"q":"Từ nào là động từ?","options":["xanh","nhảy","nhỏ","tròn"],"answer":1}
   ]
  }
 },
 "exams": [
  {
   "id": "thi_toan_1", "subject": "math", "title": "Kiểm tra Toán 15 phút",
   "passPercent": 60, "time": 25,
   "reward": {"coins": 60, "gems": 2, "xp": 40},
   "questions": [
    {"q":"12 + 15 = ?","options":["25","27","29","26"],"answer":1},
    {"q":"9 × 6 = ?","options":["54","56","45","63"],"answer":0},
    {"q":"100 - 37 = ?","options":["73","63","67","53"],"answer":1},
    {"q":"8 × 7 = ?","options":["54","56","64","49"],"answer":1},
    {"q":"Số nào lớn nhất?","options":["305","350","530","503"],"answer":2},
    {"q":"48 ÷ 6 = ?","options":["6","7","8","9"],"answer":2},
    {"q":"1/2 của 20 là?","options":["5","10","15","8"],"answer":1},
    {"q":"25 + 25 + 25 = ?","options":["50","75","100","60"],"answer":1}
   ]
  },
  {
   "id": "thi_toan_2", "subject": "math", "title": "Kiểm tra Toán giữa tuần",
   "passPercent": 70, "time": 30,
   "reward": {"coins": 80, "gems": 3, "xp": 55},
   "questions": [
    {"q":"15 × 4 = ?","options":["45","60","55","64"],"answer":1},
    {"q":"90 - 28 = ?","options":["72","62","68","52"],"answer":1},
    {"q":"Số liền sau 199 là?","options":["198","200","190","201"],"answer":1},
    {"q":"7 × 8 = ?","options":["54","56","64","49"],"answer":1},
    {"q":"Một hình vuông có mấy cạnh?","options":["3","4","5","6"],"answer":1},
    {"q":"36 ÷ 4 = ?","options":["8","9","6","7"],"answer":1},
    {"q":"12 + 8 × 2 = ?","options":["40","28","32","20"],"answer":1,"explain":"Nhân trước: 8×2=16, rồi 12+16=28."}
   ]
  },
  {
   "id": "thi_anh_1", "subject": "eng", "title": "Bài thi Tiếng Anh",
   "passPercent": 60, "time": 25,
   "reward": {"coins": 60, "gems": 2, "xp": 40},
   "questions": [
    {"q":"\"book\" nghĩa là gì?","options":["quyển sách","cái bàn","con mèo","cửa sổ"],"answer":0},
    {"q":"\"window\" nghĩa là gì?","options":["cửa ra vào","cửa sổ","bút chì","trường học"],"answer":1},
    {"q":"\"happy\" nghĩa là gì?","options":["buồn","giận","vui vẻ","mệt"],"answer":2},
    {"q":"\"teacher\" nghĩa là gì?","options":["học sinh","bạn bè","bác sĩ","giáo viên"],"answer":3},
    {"q":"She ___ a student.","options":["is","are","am","be"],"answer":0,"explain":"Với she/he/it ta dùng \"is\"."},
    {"q":"\"school\" nghĩa là?","options":["bệnh viện","trường học","chợ","công viên"],"answer":1},
    {"q":"I ___ an apple.","options":["eat","eats","eating","ate"],"answer":0},
    {"q":"\"friend\" nghĩa là?","options":["bạn bè","gia đình","thầy giáo","hàng xóm"],"answer":0}
   ]
  },
  {
   "id": "thi_van_1", "subject": "van", "title": "Bài thi Ngữ văn",
   "passPercent": 60, "time": 25,
   "reward": {"coins": 70, "gems": 3, "xp": 50},
   "questions": [
    {"q":"Từ trái nghĩa với \"sáng\" là?","options":["tối","trắng","xa","nhẹ"],"answer":0},
    {"q":"Câu \"Mẹ nấu cơm.\" có động từ nào?","options":["Mẹ","nấu","cơm","không có"],"answer":1},
    {"q":"Từ nào là tính từ?","options":["đẹp","ăn","bàn","chạy"],"answer":0},
    {"q":"Cuối câu hỏi ta dùng dấu gì?","options":["Dấu chấm","Dấu phẩy","Dấu chấm hỏi","Dấu chấm than"],"answer":2},
    {"q":"Từ đồng nghĩa với \"to lớn\"?","options":["nhỏ bé","khổng lồ","thấp","gầy"],"answer":1},
    {"q":"Từ trái nghĩa với \"nhanh\"?","options":["chậm","mau","vội","gấp"],"answer":0},
    {"q":"Câu nào là câu kể?","options":["Em đi học.","Em đi học à?","Đi học đi!","Ôi đẹp quá!"],"answer":0},
    {"q":"Từ nào là danh từ?","options":["học","nhanh","trường","vui"],"answer":2}
   ]
  },
  {
   "id": "thi_khtn_1", "subject": "sci", "title": "Bài thi Khoa học",
   "passPercent": 60, "time": 25,
   "reward": {"coins": 70, "gems": 3, "xp": 50},
   "questions": [
    {"q":"Con người cần khí gì để thở?","options":["Oxy","CO2","Nitơ","Heli"],"answer":0},
    {"q":"Mặt Trăng là gì của Trái Đất?","options":["Hành tinh","Vệ tinh","Ngôi sao","Sao chổi"],"answer":1},
    {"q":"Bộ phận nào của cây hút nước?","options":["Lá","Hoa","Rễ","Quả"],"answer":2},
    {"q":"Nước đóng băng ở bao nhiêu độ C?","options":["0","10","-10","100"],"answer":0},
    {"q":"Ánh sáng so với âm thanh thì?","options":["Chậm hơn","Nhanh hơn","Bằng nhau","Tùy ngày"],"answer":1}
   ]
  }
 ]
};
