import{o as e}from"./rolldown-runtime-C0FnF6B9.js";import{n as t,t as n}from"./jsx-runtime-CKeovgl0.js";import{a as r,f as i,l as a}from"./api-DSJVcXNa.js";import{t as o}from"./userAuth.store-DMAS2KT3.js";import{l as s,u as c}from"./dressUpAvatar-P5Ai3489.js";import{_n as l,i as u,n as d,r as f}from"./index-C2EWqM9I.js";var p=`/**\r
 * Cấu hình Trường Vui Vẻ — thời khóa biểu, bài thi, giờ học thực.\r
 *\r
 * day: 1=Thứ 2 … 7=Chủ nhật (theo getDay() JS: CN=0 → đổi thành 7)\r
 * start/end: "HH:MM" theo đồng hồ máy (thời gian thực)\r
 * subject: math | eng | van | sci\r
 * type: "lesson" (học bài) | "exam" (làm bài thi)\r
 * examId: khớp id trong khối exams của School_mission.html (khi type=exam)\r
 *\r
 * demoMode: bật để thử nhanh — lịch hôm nay được dời sát giờ hiện tại.\r
 * simulateTime: null | "HH:MM" — giả lập giờ (null = dùng giờ máy thật).\r
 */\r
export const SCHOOL_MISSION_CONFIG = {\r
  /** Dùng đồng hồ máy thật */\r
  useRealTime: true,\r
\r
  /**\r
   * Giả lập giờ để test (ví dụ "08:00"). Để null khi chơi thật.\r
   * Có thể đổi trong game qua localStorage key "tvv_sim_time".\r
   */\r
  simulateTime: null,\r
\r
  /**\r
   * demoMode = true: tự tạo lịch thử trong vài phút tới\r
   * (không dùng timetable cố định bên dưới).\r
   * Trong game: nút "Bật DEMO thử lịch" hoặc localStorage tvv_demo=1.\r
   * Để test nhanh ngoài giờ học, tạm bật true rồi tắt lại.\r
   */\r
  demoMode: false,\r
\r
  /** Cho phép vào lớp sớm hơn giờ bắt đầu (phút) */\r
  earlyMinutes: 5,\r
\r
  /** Cho phép vào muộn sau giờ bắt đầu trong khoảng này (phút) */\r
  graceMinutes: 10,\r
\r
  /** Báo trước khi tiết bắt đầu (phút) */\r
  notifyBeforeMinutes: 2,\r
\r
  /** Tự mở lớp + bắt đầu học/thi khi tới giờ */\r
  autoEnterClass: true,\r
\r
  /** Ngoài giờ học vẫn được luyện tự do trong lớp */\r
  allowFreePractice: true,\r
\r
  /** Ngoài khung giờ tiết hiện tại: chặn "Học bài" / "Bài thi theo TKB" nếu false */\r
  requireOnTimeForLesson: true,\r
\r
  schoolName: "Trường Vui Vẻ",\r
\r
  /** Thời khóa biểu tuần (Thứ 2–6) */\r
  timetable: [\r
    // ── Thứ 2 ──\r
    { day: 1, start: "07:30", end: "08:15", subject: "math", type: "lesson", title: "Toán" },\r
    { day: 1, start: "08:20", end: "09:05", subject: "van", type: "lesson", title: "Ngữ văn" },\r
    { day: 1, start: "09:15", end: "10:00", subject: "eng", type: "lesson", title: "Tiếng Anh" },\r
    { day: 1, start: "10:10", end: "10:55", subject: "math", type: "exam", examId: "thi_toan_1", title: "Kiểm tra Toán" },\r
\r
    // ── Thứ 3 ──\r
    { day: 2, start: "07:30", end: "08:15", subject: "eng", type: "lesson", title: "Tiếng Anh" },\r
    { day: 2, start: "08:20", end: "09:05", subject: "math", type: "lesson", title: "Toán" },\r
    { day: 2, start: "09:15", end: "10:00", subject: "van", type: "lesson", title: "Ngữ văn" },\r
    { day: 2, start: "10:10", end: "10:55", subject: "eng", type: "exam", examId: "thi_anh_1", title: "Bài thi Tiếng Anh" },\r
\r
    // ── Thứ 4 ──\r
    { day: 3, start: "07:30", end: "08:15", subject: "van", type: "lesson", title: "Ngữ văn" },\r
    { day: 3, start: "08:20", end: "09:05", subject: "eng", type: "lesson", title: "Tiếng Anh" },\r
    { day: 3, start: "09:15", end: "10:00", subject: "math", type: "lesson", title: "Toán" },\r
    { day: 3, start: "10:10", end: "10:55", subject: "van", type: "exam", examId: "thi_van_1", title: "Bài thi Ngữ văn" },\r
\r
    // ── Thứ 5 ──\r
    { day: 4, start: "07:30", end: "08:15", subject: "math", type: "lesson", title: "Toán" },\r
    { day: 4, start: "08:20", end: "09:05", subject: "eng", type: "lesson", title: "Tiếng Anh" },\r
    { day: 4, start: "09:15", end: "10:00", subject: "van", type: "lesson", title: "Ngữ văn" },\r
    { day: 4, start: "10:10", end: "10:55", subject: "sci", type: "lesson", title: "Khoa học" },\r
\r
    // ── Thứ 6 ──\r
    { day: 5, start: "07:30", end: "08:15", subject: "eng", type: "lesson", title: "Tiếng Anh" },\r
    { day: 5, start: "08:20", end: "09:05", subject: "van", type: "lesson", title: "Ngữ văn" },\r
    { day: 5, start: "09:15", end: "10:00", subject: "math", type: "lesson", title: "Toán" },\r
    { day: 5, start: "10:10", end: "10:55", subject: "math", type: "exam", examId: "thi_toan_2", title: "Kiểm tra Toán giữa tuần" },\r
  ],\r
};\r
`,m=`// ===== DỮ LIỆU CÂU HỎI & BÀI THI — CHỈ CẦN SỬA FILE NÀY =====
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
    {"q":"Từ trái nghĩa với \\"cao\\" là gì?","options":["thấp","to","xa","dài"],"answer":0},
    {"q":"Từ nào là danh từ?","options":["chạy","bàn","đẹp","nhanh"],"answer":1},
    {"q":"Từ đồng nghĩa với \\"chăm chỉ\\"?","options":["lười biếng","cần cù","vội vàng","buồn bã"],"answer":1},
    {"q":"Thủ đô của Việt Nam là?","options":["Huế","Đà Nẵng","Hà Nội","Cần Thơ"],"answer":2},
    {"q":"Từ trái nghĩa với \\"vui\\" là?","options":["buồn","mừng","cười","nhảy"],"answer":0},
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
    {"q":"\\"book\\" nghĩa là gì?","options":["quyển sách","cái bàn","con mèo","cửa sổ"],"answer":0},
    {"q":"\\"window\\" nghĩa là gì?","options":["cửa ra vào","cửa sổ","bút chì","trường học"],"answer":1},
    {"q":"\\"happy\\" nghĩa là gì?","options":["buồn","giận","vui vẻ","mệt"],"answer":2},
    {"q":"\\"teacher\\" nghĩa là gì?","options":["học sinh","bạn bè","bác sĩ","giáo viên"],"answer":3},
    {"q":"She ___ a student.","options":["is","are","am","be"],"answer":0,"explain":"Với she/he/it ta dùng \\"is\\"."},
    {"q":"\\"school\\" nghĩa là?","options":["bệnh viện","trường học","chợ","công viên"],"answer":1},
    {"q":"I ___ an apple.","options":["eat","eats","eating","ate"],"answer":0},
    {"q":"\\"friend\\" nghĩa là?","options":["bạn bè","gia đình","thầy giáo","hàng xóm"],"answer":0}
   ]
  },
  {
   "id": "thi_van_1", "subject": "van", "title": "Bài thi Ngữ văn",
   "passPercent": 60, "time": 25,
   "reward": {"coins": 70, "gems": 3, "xp": 50},
   "questions": [
    {"q":"Từ trái nghĩa với \\"sáng\\" là?","options":["tối","trắng","xa","nhẹ"],"answer":0},
    {"q":"Câu \\"Mẹ nấu cơm.\\" có động từ nào?","options":["Mẹ","nấu","cơm","không có"],"answer":1},
    {"q":"Từ nào là tính từ?","options":["đẹp","ăn","bàn","chạy"],"answer":0},
    {"q":"Cuối câu hỏi ta dùng dấu gì?","options":["Dấu chấm","Dấu phẩy","Dấu chấm hỏi","Dấu chấm than"],"answer":2},
    {"q":"Từ đồng nghĩa với \\"to lớn\\"?","options":["nhỏ bé","khổng lồ","thấp","gầy"],"answer":1},
    {"q":"Từ trái nghĩa với \\"nhanh\\"?","options":["chậm","mau","vội","gấp"],"answer":0},
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
`,h=`// ===== THỜI KHÓA BIỂU & CẤU HÌNH GIỜ HỌC — sửa file này để đổi lịch =====
// day: 1=Thứ 2 ... 7=Chủ nhật | subject: math / eng / sci / van
// type: "lesson" (học bài) hoặc "exam" (thi, kèm examId lấy trong data/questions.js)
const TKB = [];
function addPeriod(days, start, end, subject, type, title, examId) {
  days.forEach(day => TKB.push(Object.assign({ day, start, end, subject, type, title }, examId ? { examId } : {})));
}
const WEEKDAYS = [1, 2, 3, 4, 5];
addPeriod(WEEKDAYS, "07:30", "08:15", "math", "lesson", "Toán");
addPeriod(WEEKDAYS, "08:20", "09:05", "van",  "lesson", "Ngữ văn");
addPeriod(WEEKDAYS, "09:25", "10:10", "eng",  "lesson", "Tiếng Anh");
addPeriod(WEEKDAYS, "10:15", "11:00", "sci",  "lesson", "Khoa học");
addPeriod([3], "14:00", "14:45", "math", "exam", "Thi Toán giữa tuần", "thi_toan_2");
addPeriod([5], "14:00", "14:45", "eng",  "exam", "Thi Tiếng Anh", "thi_anh_1");
addPeriod([5], "15:00", "15:45", "sci",  "exam", "Thi Khoa học", "thi_khtn_1");

window.__SCHOOL_CONFIG__ = {
  schoolName: "Trường Vui Vẻ",
  useRealTime: true,            // dùng giờ thật của máy
  simulateTime: null,           // thử nhanh: đặt "08:00" để giả lập giờ
  demoMode: false,              // true = tự tạo lịch demo bắt đầu sau ~1 phút
  earlyMinutes: 5,              // cho vào lớp sớm bao nhiêu phút
  graceMinutes: 10,             // cho vào muộn bao nhiêu phút sau khi hết tiết
  notifyBeforeMinutes: 2,       // báo trước giờ học
  autoEnterClass: true,         // đến giờ tự hiện hộp thoại "Vào học"
  allowFreePractice: true,      // true = ngoài giờ vẫn được luyện tập tự do
  requireOnTimeForLesson: true, // true + allowFreePractice=false => chỉ học đúng giờ
  timetable: TKB
};
`,g=`// ===== ACTIVITIES: bài học, bài thi, căng tin, cửa hàng, thể dục, thu hoa =====

function quiz(type, opts = {}) {
    const T = ST();
    if (!canStartLesson(type, opts)) return;
    
    if (S.en < T.energyPerLesson) {
        toast("⚡ Hết năng lượng! Ra Căng tin ăn nhé");
        return;
    }
    
    S.en -= T.energyPerLesson;
    let n = 0, ok = 0;
    const d = DATA.subjects[type], N = T.questionsPerLesson;

    function nx() {
        if (n >= N) {
            const c = ok * T.coinsPerCorrect, x = ok * T.xpPerCorrect;
            gain(c, x);
            modal(\`
                <h2>\${d.title}</h2>
                <div class="q">Đúng \${ok}/\${N} câu 🎯</div>
                <p>+\${c} 🪙 &nbsp; +\${x} XP</p>
                <button class="btn" id="a1">Học tiếp</button> 
                <button class="btn" id="a2" style="background:#ddd;box-shadow:0 3px 0 #aaa">Xong</button>
            \`);
            $("a1").onclick = () => { close_(); quiz(type, { force: true }) };
            $("a2").onclick = close_;
            return;
        }

        const q = mk(type);
        modal(\`
            <h2>\${d.title} (\${n + 1}/\${N})</h2>
            <div class="q">\${q.q}</div>
            <div class="opts">
                \${q.o.map((o, i) => \`<button class="opt" data-i="\${i}">\${o}</button>\`).join("")}
            </div>
        \`);

        document.querySelectorAll(".opt").forEach(b => b.onclick = () => {
            const i = +b.dataset.i;
            document.querySelectorAll(".opt").forEach(x => x.onclick = null);
            
            if (i == q.a) {
                b.classList.add("ok");
                ok++;
                prog(type);
            } else {
                b.classList.add("no");
                document.querySelectorAll(".opt")[q.a].classList.add("ok");
            }
            
            if (q.x) {
                $("box").insertAdjacentHTML("beforeend", \`<p>💡 \${q.x}</p>\`);
            }
            
            n++;
            setTimeout(nx, q.x ? 2200 : 900);
        });
    }
    nx();
}

/* Thư viện tầng 2: đứng gần Thủ thư là mở truyện đọc (2 câu văn) */
function readBook() {
    const T = ST();
    if (S.en < T.energyPerLesson) {
        toast("⚡ Hết năng lượng! Xuống Căng tin ăn nhé");
        return;
    }

    S.en -= T.energyPerLesson;
    let n = 0, ok = 0;
    const N = 2;

    function nx() {
        if (n >= N) {
            const c = ok * 3, x = ok * 4;
            gain(c, x);
            modal(\`
                <h2>📚 Đọc sách vui vẻ</h2>
                <div class="q">Đúng \${ok}/\${N} câu 🎯</div>
                <p>+\${c} 🪙 &nbsp; +\${x} XP — Đọc sách mỗi ngày nhé!</p>
                <button class="btn" id="b3" style="background:#ddd;box-shadow:0 3px 0 #aaa">Đóng</button>
            \`);
            $("b3").onclick = close_;
            return;
        }

        const q = mk("van");
        modal(\`
            <h2>📖 Đọc hiểu (\${n + 1}/\${N})</h2>
            <div class="q">\${q.q}</div>
            <div class="opts">
                \${q.o.map((o, i) => \`<button class="opt" data-i="\${i}">\${o}</button>\`).join("")}
            </div>
        \`);

        document.querySelectorAll(".opt").forEach(b => b.onclick = () => {
            const i = +b.dataset.i;
            document.querySelectorAll(".opt").forEach(x => x.onclick = null);

            if (i == q.a) { b.classList.add("ok"); ok++; }
            else { b.classList.add("no"); document.querySelectorAll(".opt")[q.a].classList.add("ok"); }

            if (q.x) $("box").insertAdjacentHTML("beforeend", \`<p>💡 \${q.x}</p>\`);

            n++;
            setTimeout(nx, q.x ? 2200 : 900);
        });
    }
    nx();
}

/* Gửi kết quả bài thi lên trang cha (trang cha gọi API /users/me/exam-results) */
function reportExam(e, pc, pass, ok, qs, startedAt) {
    try {
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({
                type: "school-exam-result",
                data: {
                    examId: e.id,
                    examTitle: e.title,
                    subject: e.subject,
                    score: pc,
                    passed: pass,
                    correct: ok,
                    total: qs.length,
                    durationSec: Math.max(1, Math.round((Date.now() - startedAt) / 1000)),
                    takenAt: new Date().toISOString(),
                },
            }, "*");
        }
    } catch (err) { /* iframe bị chặn — kết quả vẫn còn trong S.exam khi sync */ }
}

function runExam(e, opts = {}) {
    if (!canStartExam(e, opts)) return;
    const T = ST();

    if (S.en < T.energyPerExam) {
        toast("⚡ Cần " + T.energyPerExam + " năng lượng để thi!");
        return;
    }

    S.en -= T.energyPerExam;
    const qs = sh(e.questions).map(shq), pp = e.passPercent || 60;
    const startedAt = Date.now();
    let n = 0, ok = 0, tm;

    function end() {
        clearInterval(tm);
        const pc = Math.round(ok / qs.length * 100), pass = pc >= pp;
        const r = S.exam[e.id] || { best: 0, pass: false };
        let msg = "";

        if (pass && !r.pass) {
            const w = e.reward || {};
            S.gems += w.gems || 0;
            gain(w.coins || 0, w.xp || 0);
            msg = \`🎁 Thưởng lần đầu đạt: +\${w.coins || 0}🪙 +\${w.gems || 0}💎 +\${w.xp || 0}XP\`;
        }

        r.best = Math.max(r.best, pc);
        r.pass = r.pass || pass;
        S.exam[e.id] = r;
        save();
        reportExam(e, pc, pass, ok, qs, startedAt);

        modal(\`
            <h2>\${e.title}</h2>
            <div class="q">\${ok}/\${qs.length} câu • \${pc}% \${pass ? "🎉 ĐẠT" : "😢 Chưa đạt"}</div>
            <p>\${msg || (pass ? "" : "Cần đạt " + pp + "% — cố lên!")}</p>
            <button class="btn" id="b3" style="background:#ddd;box-shadow:0 3px 0 #aaa">Đóng</button>
        \`);

        $("b3").onclick = close_;
    }

    function nx() {
        clearInterval(tm);
        if (n >= qs.length) {
            end();
            return;
        }

        const q = qs[n];
        let t = e.time || 0, lock = 0;

        modal(\`
            <h2>📝 \${e.title} (\${n + 1}/\${qs.length})</h2>
            \${t ? \`<div id="tm" style="font-weight:800">⏱ \${t}s</div>\` : ""}
            <div class="q">\${q.q}</div>
            <div class="opts">
                \${q.o.map((o, i) => \`<button class="opt" data-i="\${i}">\${o}</button>\`).join("")}
            </div>
        \`);

        const fin = (b) => {
            if (lock) return;
            lock = 1;
            clearInterval(tm);
            document.querySelectorAll(".opt")[q.a].classList.add("ok");
            
            if (b) {
                if (+b.dataset.i == q.a) ok++;
                else b.classList.add("no");
            }
            
            if (q.x) {
                $("box").insertAdjacentHTML("beforeend", \`<p>💡 \${q.x}</p>\`);
            }
            
            n++;
            setTimeout(nx, q.x ? 2000 : 800);
        };

        document.querySelectorAll(".opt").forEach(b => b.onclick = () => fin(b));

        if (t) {
            tm = setInterval(() => {
                t--;
                const el = $("tm");
                if (el) el.textContent = "⏱ " + t + "s";
                if (t <= 0) fin(null);
            }, 1000);
        }
    }
    nx();
}

function canteen() {
    modal(\`
        <h2>🍔 Căng tin</h2>
        <p>Bạn có \${S.coins} 🪙 — ⚡ \${Math.floor(S.en)}/100</p>
        <button class="btn" id="b1">🥪 Bánh mì (10🪙) +30⚡</button><br>
        <button class="btn" id="b2">🍱 Cơm hộp (25🪙) +100⚡</button><br>
        <button class="btn" id="b3" style="background:#ddd;box-shadow:0 3px 0 #aaa">Đóng</button>
    \`);

    const buy = (c, e) => {
        if (S.coins < c) {
            toast("Không đủ xu!");
            return;
        }
        S.coins -= c;
        S.en = Math.min(100, S.en + e);
        save();
        canteen();
    };

    $("b1").onclick = () => buy(10, 30);
    $("b2").onclick = () => buy(25, 100);
    $("b3").onclick = close_;
}

function shop() {
    const it = (a, t) => a.map(([v, c]) => {
        const own = S.own.includes(v), eq = (t == "h" ? S.hat : S.col) == v;
        return \`
            <span class="item \${own ? "own" : ""} \${eq ? "eq" : ""}" data-t="\${t}" data-v="\${v}" data-c="\${c}">
                \${t == "h" ? (v || "❌") : \`<span style="display:inline-block;width:18px;height:18px;border-radius:50%;background:\${v};vertical-align:middle"></span>\`} 
                \${own ? "" : c + "🪙"}
            </span>
        \`;
    }).join("");

    modal(\`
        <h2>🛍️ Cửa hàng</h2>
        <p>🪙 \${S.coins}</p>
        <b>Phụ kiện</b><br>\${it(hatShop, "h")}<br>
        <b>Màu áo</b><br>\${it(colShop, "c")}<br>
        <button class="btn" id="b3">Đóng</button>
    \`);

    document.querySelectorAll(".item").forEach(e => e.onclick = () => {
        const v = e.dataset.v, c = +e.dataset.c;
        if (!S.own.includes(v)) {
            if (S.coins < c) {
                toast("Không đủ xu!");
                return;
            }
            S.coins -= c;
            S.own.push(v);
        }
        e.dataset.t == "h" ? S.hat = v : S.col = v;
        save();
        shop();
    });
    $("b3").onclick = close_;
}

function gym() {
    let t = 0, go_ = 0, tm;
    
    modal(\`
        <h2>🏃 Chạy bộ thể dục</h2>
        <p>Bấm thật nhanh trong 10 giây!</p>
        <div class="q" id="cnt">0</div>
        <button class="btn" id="run" style="font-size:24px;padding:18px 40px">CHẠY!</button>
    \`);

    $("run").onclick = () => {
        if (!go_) {
            go_ = 1;
            let l = 10;
            tm = setInterval(() => {
                l--;
                if (l <= 0) {
                    clearInterval(tm);
                    const c = Math.floor(t / 2), x = Math.floor(t / 3);
                    gain(c, x);
                    modal(\`
                        <h2>Hoàn thành! 🏅</h2>
                        <div class="q">\${t} bước</div>
                        <p>+\${c} 🪙 +\${x} XP</p>
                        <button class="btn" id="b3">Đóng</button>
                    \`);
                    $("b3").onclick = close_;
                }
            }, 1000);
        }
        t++;
        $("cnt").textContent = t;
    };
}

function garden() {
    if (flowers.length) {
        toast("Đang thu hoa rồi!");
        return;
    }
    if (S.en < 10) {
        toast("⚡ Hết năng lượng!");
        return;
    }
    
    S.en -= 10;
    const p = P[2];
    flowers = [];
    
    for (let i = 0; i < 8; i++) {
        flowers.push({
            x: p.x + 30 + Math.random() * (p.w - 60),
            y: p.y + 40 + Math.random() * (p.h - 70)
        });
    }
    ftime = 30;
    toast("🌸 Thu 8 bông hoa trong 30 giây!");
}`,_=`// ===== AVATAR: vẽ avatar thật của người chơi (lấy từ hồ sơ trong app) =====
// Avatar được trang cha gửi qua window.__SCHOOL_INIT__.avatarSvg (markup bên
// trong thẻ <svg>). Ở đây chỉ bọc lại bằng viewBox chuẩn rồi nạp thành Image để
// canvas vẽ được. Nếu chưa có (mở file trực tiếp / chưa đăng nhập) thì dùng bản
// đã lưu trên máy; cuối cùng mới rơi về nhân vật vẽ tay cũ.

var PLAYER_AVATAR_KEY = "tvv_avatar_v1";
var PLAYER_AVATAR_VIEWBOX = "0 0 512 700";
var playerAvatarImg = null;
var playerAvatarName = "Bạn";
var playerAvatarFailed = false;

function buildAvatarSvg(inner, viewBox) {
    if (!inner || typeof inner !== "string") return "";
    var vb = viewBox && typeof viewBox === "string" ? viewBox : PLAYER_AVATAR_VIEWBOX;
    var box = vb.split(/\\s+/);
    var vw = Number(box[2]) || 512;
    var vh = Number(box[3]) || 700;
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + vw + '" height="' + vh +
        '" viewBox="' + vb + '">' + inner + "</svg>";
}

function setPlayerAvatar(inner, viewBox) {
    var svg = buildAvatarSvg(inner, viewBox);
    if (!svg) return;

    PLAYER_AVATAR_VIEWBOX = viewBox || PLAYER_AVATAR_VIEWBOX;
    playerAvatarFailed = false;

    var img = new Image();
    img.onload = function () {
        playerAvatarImg = img;
    };
    img.onerror = function () {
        playerAvatarImg = null;
        playerAvatarFailed = true;
    };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);

    try {
        localStorage.setItem(PLAYER_AVATAR_KEY, JSON.stringify({
            inner: inner,
            viewBox: PLAYER_AVATAR_VIEWBOX
        }));
    } catch (e) { /* localStorage bị chặn — vẫn dùng ảnh trong phiên này */ }
}

function loadCachedPlayerAvatar() {
    try {
        var raw = localStorage.getItem(PLAYER_AVATAR_KEY);
        if (!raw) return;
        var saved = JSON.parse(raw);
        if (saved && saved.inner) setPlayerAvatar(saved.inner, saved.viewBox);
    } catch (e) { /* bỏ qua avatar hỏng */ }
}

function setPlayerName(name) {
    playerAvatarName = name || "Bạn";
}

function drawPlayer() {
    if (playerAvatarImg && !playerAvatarFailed) {
        var h = 62;
        var ratio = playerAvatarImg.width && playerAvatarImg.height
            ? playerAvatarImg.width / playerAvatarImg.height
            : 512 / 700;
        var w = h * ratio;
        var bob = Math.abs(Math.sin(me.t * 0.8)) * 2.2 * me.mv;

        g.fillStyle = "rgba(0,0,0,.25)";
        g.beginPath();
        g.ellipse(me.x, me.y, w * 0.38, 6, 0, 0, 7);
        g.fill();

        g.drawImage(playerAvatarImg, me.x - w / 2, me.y - h + 3 - bob, w, h);
        tx(playerAvatarName, me.x, me.y - h - 4 - bob, 12, "#fff", "rgba(0,0,0,.6)");
        return;
    }

    chr(me.x, me.y, S.col, S.hat, playerAvatarName, me.t, null, me.mv);
}
`,v=`// ===== CHARACTERS: hàm vẽ cơ bản và vẽ nhân vật =====
function rr(x,y,w,h,r,c){g.fillStyle=c;g.beginPath();g.roundRect(x,y,w,h,r);g.fill()}
function rg(x,y,w,h,r,c){rr(x,y,w,h,r,c);const l=g.createLinearGradient(0,y,0,y+h);l.addColorStop(0,"rgba(255,255,255,.18)");l.addColorStop(1,"rgba(0,0,0,.2)");rr(x,y,w,h,r,l)}
function tx(s,x,y,sz,c,st){g.font=\`bold \${sz}px system-ui\`;g.textAlign="center";if(st){g.strokeStyle=st;g.lineWidth=3;g.strokeText(s,x,y)}g.fillStyle=c;g.fillText(s,x,y)}
function chr(x,y,c,hat,name,t,say,mv){const sw=Math.sin(t)*mv,bn=Math.abs(Math.sin(t))*3*mv;
 g.fillStyle="rgba(0,0,0,.25)";g.beginPath();g.ellipse(x,y,17,6,0,0,7);g.fill();
 rg(x-9,y-12-Math.max(0,sw)*4,8,12,3,"#3b4a7a");rg(x+1,y-12-Math.max(0,-sw)*4,8,12,3,"#3b4a7a");
 rg(x-17,y-31-bn+sw*3,7,17,3,"#ffe0bd");rg(x+10,y-31-bn-sw*3,7,17,3,"#ffe0bd");
 rg(x-12,y-33-bn,24,26,9,c);g.fillStyle="rgba(255,255,255,.5)";g.fillRect(x-4,y-33-bn,8,5);
 g.fillStyle="#ffe0bd";g.strokeStyle="rgba(120,70,40,.5)";g.lineWidth=1.5;g.beginPath();g.arc(x,y-43-bn,16,0,7);g.fill();g.stroke();
 g.fillStyle="#4a3426";g.beginPath();g.arc(x,y-48-bn,16,Math.PI*1.02,Math.PI*1.98);g.lineTo(x+12,y-46-bn);g.quadraticCurveTo(x,y-54-bn,x-12,y-46-bn);g.fill();
 g.fillStyle="#222";g.beginPath();g.ellipse(x-6,y-42-bn,2.4,3.2,0,0,7);g.ellipse(x+6,y-42-bn,2.4,3.2,0,0,7);g.fill();g.fillStyle="#fff";g.beginPath();g.arc(x-5.3,y-43.3-bn,1,0,7);g.arc(x+6.7,y-43.3-bn,1,0,7);g.fill();
 g.fillStyle="rgba(255,100,120,.45)";g.beginPath();g.arc(x-10,y-37-bn,3.2,0,7);g.arc(x+10,y-37-bn,3.2,0,7);g.fill();
 g.strokeStyle="#c0504d";g.lineWidth=1.6;g.beginPath();g.arc(x,y-38-bn,3.5,.2,Math.PI-.2);g.stroke();
 if(hat){g.font="24px serif";g.textAlign="center";g.fillText(hat,x,y-56-bn)}
 tx(name,x,y-74-bn,12,"#fff","rgba(0,0,0,.6)");
 if(say){g.font="bold 12px system-ui";const w=g.measureText(say).width+18;rr(x-w/2,y-104-bn,w,24,12,"#fff");g.fillStyle="#fff";g.beginPath();g.moveTo(x-5,y-81-bn);g.lineTo(x+5,y-81-bn);g.lineTo(x,y-75-bn);g.fill();tx(say,x,y-87-bn,12,"#223")}}
// ---- trang trí sân ----
`,y=`// ===== CONFIG: địa điểm sân trường, các lớp học, bàn ghế, NPC, cửa hàng, nhiệm vụ ngày =====
const P=[
{id:"shop",n:"🛍️ Cửa hàng",x:1400,y:130,w:220,h:200,c:"#f08fb0",r:"#c4437a",b:1},
{id:"can",n:"🍔 Căng tin",x:120,y:700,w:260,h:200,c:"#f5d76e",r:"#d4a017",b:1},
{id:"garden",n:"🌸 Vườn trường",x:480,y:680,w:340,h:300,c:"#9be07a",lv:2},
{id:"gym",n:"🏃 Sân thể thao",x:1000,y:680,w:400,h:300,c:"#f4a261",lv:3}];
const RM={math:{n:"Lớp Toán",f:"#eed9a8",b:"Hôm nay: Phép nhân ×",t:"Cô Hoa",c:"#ff6b9d",e:"🧮"},eng:{n:"Lớp Tiếng Anh",f:"#cfe6f7",b:"Good morning, class!",t:"Thầy Nam",c:"#4a90e2",e:"🔤"},sci:{n:"Phòng Khoa học",f:"#d6f0d9",b:"H₂O  •  CO₂  •  O₂",t:"Cô Lan",c:"#2fb583",e:"🧪"},van:{n:"Lớp Ngữ văn",f:"#f3d9e6",b:"Từ đồng nghĩa - trái nghĩa",t:"Thầy Minh",c:"#a55eea",e:"📖"},lib:{n:"Thư viện",f:"#f7ecd2",b:"📚 Đọc sách mỗi ngày!",t:"Chú Thủ thư",c:"#e67e22",e:"📚"}};
const KS=["math","eng","sci","van"],DX={math:300,eng:650,sci:1000,van:1350,lib:520};
const KS2=["lib"]; // các phòng ở tầng 2
// 10 bàn học (2 hàng × 5 bàn) — cả 10 chỗ đều có bạn ngồi
const desks=[];for(let j=0;j<2;j++)for(let i=0;i<5;i++)desks.push([110+i*170,320+j*100]);
const cols=["#ff6b9d","#6bcbff","#b28dff","#7be0a0","#ffd23f","#ff8a5b","#4ecdc4","#e84393","#f368e0","#00d2d3","#ff9f43","#54a0ff","#10ac84","#a55eea"];
const nm=["Mít","Bơ","Na","Su","Kem","Bin","Mun","Tôm","Đậu","Cà","Ớt","Xoài","Bí","Mía"];
const hs=["🎓","🎀","🧢","🌸","","👑","","🎓","🎀","🧢","","🌸","👑",""];
const studs=desks.map((d,i)=>({x:d[0]+45,y:d[1]+14,c:cols[i%cols.length],n:nm[i],on:i!=2&&i!=5&&i!=8}));
// 14 bạn học sinh chạy khắp sân + hành lang; hành lang có nhiều bạn tán gương hơn
const npcs=nm.map((n,i)=>({
 n,sc:i<6?"out":i<11?"hall":"out",
 b:i<6?[300,480,1450,560]:[150,215,1400,170],
 x:300+Math.random()*1200,y:i<6?520+Math.random()*200:260+Math.random()*100,
 tx:0,ty:0,c:cols[i],h:hs[i],say:0,t:Math.random()*5,mv:0
}));
const hatShop=[["",0],["🎓",30],["🎀",40],["🧢",30],["🌸",50],["👑",120]],colShop=[["#ff9f43",0],["#54a0ff",20],["#ee5a6f",20],["#10ac84",20],["#a55eea",20],["#2d3436",35]];
const QU=[{k:"math",t:"Đúng 5 bài Toán",n:5,c:40,g:1},{k:"eng",t:"Học 5 từ Tiếng Anh",n:5,c:40,g:1},{k:"sci",t:"Đúng 5 câu Khoa học",n:5,c:50,g:2},{k:"van",t:"Đúng 5 câu Ngữ văn",n:5,c:50,g:2},{k:"flower",t:"Thu 8 hoa (Lv2)",n:8,c:60,g:2}];
`,b=`// ===== CORE: canvas, hàm tiện ích $ và sh (xáo trộn), tự co giãn màn hình =====
const cv=document.getElementById("c"),g=cv.getContext("2d");
const $=id=>document.getElementById(id);
let W=0,H=0,dpr=1;
function rs(){dpr=Math.min(2,devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr}
addEventListener("resize",rs);rs();
const sh=a=>a.map(x=>x).sort(()=>Math.random()-.5);
`,x=`// ===== DATA: nạp + kiểm tra dữ liệu câu hỏi/bài thi (mặc định từ data/questions.js, hoặc bản bạn sửa trong game) =====
let DATA=null;
const DEF_DATA=()=>JSON.parse(JSON.stringify(QUESTION_DATA)); // lấy từ data/questions.js
const ST=()=>Object.assign({questionsPerLesson:3,coinsPerCorrect:8,xpPerCorrect:6,energyPerLesson:10,energyPerExam:15},DATA.settings||{});
function vq(q,w){return(!q||typeof q.q!="string"||!Array.isArray(q.options)||q.options.length<2||!Number.isInteger(q.answer)||q.answer<0||q.answer>=q.options.length)?"Câu hỏi sai định dạng ở "+w+" (cần q, options[], answer là số thứ tự bắt đầu từ 0)":""}
function vd(d){if(!d||typeof d!="object"||!d.subjects)return "Thiếu mục subjects";
 for(const k of KS){const s=d.subjects[k];if(!s)return "Thiếu môn "+k;if(!["math","vocab","quiz"].includes(s.mode))return "Môn "+k+": mode phải là math, vocab hoặc quiz";
  if(s.mode=="vocab"&&!(s.vocab||[]).length)return "Môn "+k+" thiếu vocab";
  if(s.mode=="quiz"){if(!(s.questions||[]).length)return "Môn "+k+" thiếu questions";for(let i=0;i<s.questions.length;i++){const e=vq(s.questions[i],k+" #"+(i+1));if(e)return e}}}
 for(const e of d.exams||[]){if(!e.id||!KS.includes(e.subject)||!(e.questions||[]).length)return "Bài thi thiếu id / subject / questions";for(let i=0;i<e.questions.length;i++){const r=vq(e.questions[i],e.id+" #"+(i+1));if(r)return r}}
 return ""}
function loadData(){DATA=DEF_DATA();try{const c=localStorage.getItem("tvv_data");if(c){const x=JSON.parse(c);if(!vd(x))DATA=x}}catch(e){}}
`,S=`// ===== INPUT: bàn phím WASD + joystick cảm ứng =====
const keys={};addEventListener("keydown",e=>{if(e.target.tagName=="TEXTAREA")return;keys[e.key.toLowerCase()]=1});addEventListener("keyup",e=>keys[e.key.toLowerCase()]=0);
let jx=0,jy=0,jid=null;const joy=$("joy"),kn=$("knob");
function jm(e){const r=joy.getBoundingClientRect(),dx=e.clientX-(r.left+60),dy=e.clientY-(r.top+60),d=Math.hypot(dx,dy)||1,m=Math.min(d,45);jx=dx/d*m/45;jy=dy/d*m/45;kn.style.transform=\`translate(\${jx*45}px,\${jy*45}px)\`}
joy.addEventListener("pointerdown",e=>{jid=e.pointerId;joy.setPointerCapture(jid);jm(e)});joy.addEventListener("pointermove",e=>{if(e.pointerId==jid)jm(e)});
const je=()=>{jid=null;jx=jy=0;kn.style.transform=""};joy.addEventListener("pointerup",je);joy.addEventListener("pointercancel",je);
`,C=`// ===== MAIN: khởi động và vòng lặp game =====
$("cfg").onclick=cfg;$("sched").onclick=showSchedule;loadData();
$("quit").onclick=function(){try{if(window.parent!==window)window.parent.postMessage({type:"quit"},"*");else history.back()}catch(e){}};
initSchoolSync();
function loop(n){const dt=Math.min(.05,(n-last)/1000);last=n;upd(dt);draw();requestAnimationFrame(loop)}
requestAnimationFrame(loop);setInterval(save,5000);setInterval(tickSchedule,1000);tickSchedule();
toast(CFG.demoMode?"🧪 DEMO TKB bật — tiết sắp bắt đầu!":"📅 Xem Thời khóa biểu · học đúng giờ thật nhé!");
`,w=`// ===== QUESTIONS: tạo câu hỏi từ dữ liệu (toán ngẫu nhiên / từ vựng / quiz) =====
function shq(q){const o=sh(q.options.map((t,i)=>[t,i==q.answer]));return{q:q.q,o:o.map(x=>String(x[0])),a:o.findIndex(x=>x[1]),x:q.explain||""}}
function mk(type){const s=DATA.subjects[type];
 if(s.mode=="math"){const m=3+S.lv*3,a=1+Math.floor(Math.random()*m),b=1+Math.floor(Math.random()*m),o=["+","-","×"][Math.floor(Math.random()*(S.lv>1?3:2))];
  let r=o=="+"?a+b:o=="-"?a-b:a*b;let st=new Set([r]);while(st.size<4)st.add(r+Math.floor(Math.random()*9)-4);
  const op=sh([...st]);return{q:\`\${a} \${o} \${b} = ?\`,o:op.map(String),a:op.indexOf(r),x:""}}
 if(s.mode=="vocab"){const V=s.vocab,w=V[Math.floor(Math.random()*V.length)];const ws=sh(V.filter(x=>x!=w)).slice(0,3).map(x=>x[1]);const op=sh([w[1],...ws]);return{q:\`"\${w[0]}" nghĩa là gì?\`,o:op,a:op.indexOf(w[1]),x:""}}
 return shq(s.questions[Math.floor(Math.random()*s.questions.length)])}
`,T=`// ===== RENDER: camera, sắp xếp lớp vẽ, hiệu ứng viền tối, chuyển cảnh =====
function draw() {
    // 1. Cài đặt tỷ lệ và kích thước màn hình
    const z = Math.max(0.8, Math.min(1.4, H / 560));
    const [WW, WH] = D[sc]; // Lấy kích thước thế giới hiện tại (World Width, World Height)
    
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = "#1d2540"; // Màu nền tối
    g.fillRect(0, 0, W, H);

    // 2. Tính toán Camera (Giới hạn camera không vượt quá bản đồ)
    const vw = W / z, vh = H / z;
    const cl = (v, a, b) => Math.max(a, Math.min(b, v)); // Hàm kẹp giá trị
    
    const cx = vw >= WW ? -(vw - WW) / 2 : cl(me.x - vw / 2, 0, WW - vw);
    const cy = vh >= WH ? -(vh - WH) / 2 : cl(me.y - vh / 2, 0, WH - vh);

    // 3. Bắt đầu vẽ thế giới (Áp dụng Camera)
    g.save();
    g.scale(z, z);
    g.translate(-cx, -cy);

    // Vẽ cảnh nền (Ngoài trời, Hành lang, hoặc Trong phòng)
    if (sc == "out") drawOut();
    else if (sc == "hall") drawHall(1);
    else if (sc == "hall2") drawHall(2);
    else drawRoom();

    // --- BẮT ĐẦU VẼ HOA (Tính năng hái hoa) ---
    if (typeof flowers !== 'undefined' && flowers.length > 0) {
        g.font = "24px Arial";
        g.textAlign = "center";
        g.textBaseline = "middle";
        flowers.forEach(f => {
            g.fillText("🌸", f.x, f.y);
        });
    }
    // --- KẾT THÚC VẼ HOA ---

    // 4. Vẽ NPC và Nhân vật (Sắp xếp theo trục Y để tạo chiều sâu)
    const L = npcs.filter(n => n.sc == sc).map(n => ({
        y: n.y,
        f: () => chr(
            n.x, n.y, n.c, n.h, n.n, tt * 8 + n.x,
            n.say > 0 ? ["Chào!", "Rất vui được gặp bạn!", "Học thôi nào!"][Math.floor(n.x) % 3] : null,
            n.mv
        )
    }));
    
    // Thêm nhân vật chính (Bạn) vào danh sách vẽ
    L.push({
        y: me.y,
        f: () => drawPlayer()
    });
    
    // Sắp xếp từ trên xuống dưới và vẽ
    L.sort((a, b) => a.y - b.y).forEach(o => o.f());

    // 5. Vẽ hiệu ứng chữ bay (Text Effects)
    ft.forEach(f => {
        g.globalAlpha = Math.min(1, f.t);
        tx(f.s, f.x, f.y - (1.4 - f.t) * 40, 18, "#ffd23f", "rgba(0,0,0,.7)");
        g.globalAlpha = 1;
    });

    g.restore(); // Kết thúc vẽ thế giới

    // 6. Vẽ Giao diện (UI) đè lên trên thế giới
    // Đồng hồ đếm ngược tính năng hái hoa
    if (typeof ftime !== 'undefined' && ftime > 0) {
        const t = "⏱ " + Math.ceil(ftime) + "s  🌸 còn " + flowers.length;
        tx(t, W / 2, 90, 20, "#fff", "rgba(0,0,0,.6)");
    }

    // 7. Hiệu ứng viền tối (Vignette)
    const v = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.45, W / 2, H / 2, Math.max(W, H) * 0.75);
    v.addColorStop(0, "rgba(0,0,0,0)");
    v.addColorStop(1, "rgba(0,0,30,.32)");
    g.fillStyle = v;
    g.fillRect(0, 0, W, H);

    // 8. Hiệu ứng chuyển cảnh (Fade)
    if (fade > 0) {
        g.fillStyle = \`rgba(0,0,0,\${fade})\`;
        g.fillRect(0, 0, W, H);
    }
}`,E=`// ===== SCENES: vẽ sân trường, tòa nhà, hành lang, lớp học =====

// 1. KHỞI TẠO CÁC MẢNG TRANG TRÍ (Cỏ, hoa dại, cây cối)
const tufts = [], flw = [], trees = [];

// Tạo 260 bụi cỏ ngẫu nhiên
for (let i = 0; i < 260; i++) {
    tufts.push([Math.random() * 1800, Math.random() * 1100, Math.random()]);
}

// Tạo 110 bông hoa dại ngẫu nhiên
for (let i = 0; i < 110; i++) {
    flw.push([
        Math.random() * 1800, 
        Math.random() * 1100, 
        ["#fff", "#ffd23f", "#ff8fb1", "#b28dff"][i % 4]
    ]);
}

// Tạo 46 cái cây, tránh không cho mọc đè lên nhà, hồ bơi, hay đường đi
for (let i = 0; i < 46; i++) {
    const x = Math.random() * 1800, y = 60 + Math.random() * 1040;
    if (
        !P.some(p => x > p.x - 70 && x < p.x + p.w + 70 && y > p.y - 70 && y < p.y + p.h + 90) &&
        !(y > 470 && y < 650) && 
        !(x > 800 && x < 1000) && 
        !(x > 480 && x < 1320 && y < 420) && 
        !(x > 120 && x < 330 && y > 230 && y < 350)
    ) {
        trees.push([x, y, 0.8 + Math.random() * 0.5]);
    }
}

// 2. CÁC HÀM VẼ CHI TIẾT
function tree(x, y, s) {
    // Vẽ bóng đổ
    g.fillStyle = "rgba(0,0,0,.18)";
    g.beginPath();
    g.ellipse(x + 8 * s, y + 16, 28 * s, 10 * s, 0, 0, 7);
    g.fill();
    
    // Vẽ thân cây
    rg(x - 5 * s, y - 12 * s, 10 * s, 28 * s, 3, "#8b5a2b");

    // Vẽ các tán lá (sử dụng gradient để tạo khối)
    [[0, -30, 26, "#2e9e4a"], [-14, -20, 18, "#38b155"], [14, -20, 18, "#38b155"], [-4, -40, 16, "#4cc866"]]
    .forEach(([a, b, r, c]) => {
        const q = g.createRadialGradient(x + a * s - 5, y + b * s - 5, 2, x + a * s, y + b * s, r * s);
        q.addColorStop(0, "#7ee08d");
        q.addColorStop(1, c);
        g.fillStyle = q;
        g.beginPath();
        g.arc(x + a * s, y + b * s, r * s, 0, 7);
        g.fill();
    });
}

function house(p) {
    const { x, y, w, h } = p;
    
    // Bóng đổ của nhà
    g.fillStyle = "rgba(0,0,0,.2)";
    g.beginPath();
    g.ellipse(x + w / 2 + 14, y + h - 2, w / 2 + 24, 15, 0, 0, 7);
    g.fill();

    // Thân nhà
    rg(x, y + 55, w, h - 65, 10, p.c);
    
    // Mái nhà
    g.fillStyle = p.r;
    g.beginPath();
    g.moveTo(x - 16, y + 66);
    g.lineTo(x + w / 2, y - 6);
    g.lineTo(x + w + 16, y + 66);
    g.closePath();
    g.fill();
    
    // Mái nhà (phần đổ bóng)
    g.fillStyle = "rgba(255,255,255,.18)";
    g.beginPath();
    g.moveTo(x - 16, y + 66);
    g.lineTo(x + w / 2, y - 6);
    g.lineTo(x + w / 2, y + 66);
    g.fill();

    // Cửa sổ (2 bên)
    for (let i = 0; i < 2; i++) {
        const wx = x + 22 + i * (w - 92);
        rr(wx - 4, y + 92, 66, 56, 8, "#fff");
        
        const q = g.createLinearGradient(0, y + 96, 0, y + 144);
        q.addColorStop(0, "#bfe9ff");
        q.addColorStop(1, "#6fb9ef");
        rr(wx, y + 96, 58, 48, 5, q);
        
        g.fillStyle = "#fff";
        g.fillRect(wx + 27, y + 96, 4, 48);
        g.fillRect(wx, y + 118, 58, 4);
    }

    // Cửa chính
    rr(x + w / 2 - 24, y + h - 80, 48, 70, 8, "#7a4a2a");
    g.fillStyle = "#ffd23f";
    g.beginPath();
    g.arc(x + w / 2 + 14, y + h - 44, 3, 0, 7);
    g.fill();

    // Mái hiên
    for (let i = 0; i < 8; i++) {
        g.fillStyle = i % 2 ? "#fff" : p.r;
        g.fillRect(x + w / 2 - 40 + i * 10, y + h - 92, 10, 14);
    }
}

function school() {
    const x = 520, y = 90;
    
    g.fillStyle = "rgba(0,0,0,.22)";
    g.beginPath();
    g.ellipse(900, 358, 420, 20, 0, 0, 7);
    g.fill();

    // Tòa nhà chính
    rg(x, y + 120, 760, 235, 6, "#b5503f");
    g.fillStyle = "rgba(0,0,0,.09)";
    for (let i = 0; i < 24; i++) {
        g.fillRect(x, y + 126 + i * 10, 760, 2);
    }
    
    // Viền mái
    rr(x - 10, y + 110, 780, 16, 4, "#f1e7d3");
    rr(x - 10, y + 232, 780, 10, 3, "#f1e7d3");

    // Cửa sổ các phòng
    for (let s = 0; s < 2; s++) {
        for (let r = 0; r < 2; r++) {
            for (let i = 0; i < 4; i++) {
                const wx = s ? 1000 + i * 62 : x + 40 + i * 62, wy = y + 140 + r * 110;
                rr(wx - 3, wy - 3, 50, 66, 6, "#f1e7d3");
                
                const q = g.createLinearGradient(0, wy, 0, wy + 60);
                q.addColorStop(0, "#cfeeff");
                q.addColorStop(1, "#6fb0e6");
                rr(wx, wy, 44, 60, 4, q);
                
                g.fillStyle = "#f1e7d3";
                g.fillRect(wx + 20, wy, 4, 60);
                g.fillRect(wx, wy + 28, 44, 4);
            }
        }
    }

    // Tòa tháp giữa
    rg(810, y - 10, 180, 365, 8, "#c25b49");
    g.fillStyle = "rgba(0,0,0,.09)";
    for (let i = 0; i < 34; i++) {
        g.fillRect(810, y - 4 + i * 10, 180, 2);
    }

    // Mái tháp
    g.fillStyle = "#6b3a2a";
    g.beginPath();
    g.moveTo(796, y + 8);
    g.lineTo(900, y - 62);
    g.lineTo(1004, y + 8);
    g.fill();
    
    g.fillStyle = "rgba(255,255,255,.15)";
    g.beginPath();
    g.moveTo(796, y + 8);
    g.lineTo(900, y - 62);
    g.lineTo(900, y + 8);
    g.fill();

    // Đồng hồ
    g.fillStyle = "#fff";
    g.beginPath();
    g.arc(900, y + 34, 24, 0, 7);
    g.fill();
    g.strokeStyle = "#6b3a2a";
    g.lineWidth = 4;
    g.stroke();
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(900, y + 34);
    g.lineTo(900, y + 20);
    g.moveTo(900, y + 34);
    g.lineTo(910, y + 38);
    g.stroke();

    // Biển hiệu
    rr(826, y + 76, 148, 30, 8, "#2c3e66");
    tx("TRƯỜNG VUI VẺ", 900, y + 97, 16, "#ffd23f");
    
    // Cửa ra vào
    rr(850, y + 150, 100, 60, 6, "#f1e7d3");
    rr(856, y + 156, 88, 48, 4, "#9fd8ff");
    rr(842, y + 262, 116, 93, 8, "#f1e7d3");
    rr(852, y + 270, 45, 85, 4, "#7a4a2a");
    rr(903, y + 270, 45, 85, 4, "#7a4a2a");
    
    g.fillStyle = "#ffd23f";
    g.beginPath();
    g.arc(890, y + 318, 3, 0, 7);
    g.arc(910, y + 318, 3, 0, 7);
    g.fill();

    // Bậc thềm
    rr(830, y + 355, 140, 10, 3, "#cfcfd6");
    rr(820, y + 362, 160, 8, 3, "#bbb");

    // Cột cờ
    g.fillStyle = "#999";
    g.fillRect(560, y + 20, 3, 100);
    rr(563, y + 22, 34, 22, 3, "#e74c3c");
    g.fillRect(1236, y + 20, 3, 100);
    rr(1239, y + 22, 34, 22, 3, "#3b82c4");
}

// 3. HÀM VẼ CÁC CẢNH
function drawOut() {
    const w = 1800, h = 1100;
    
    // Nền cỏ
    const bg = g.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, "#8fdc78");
    bg.addColorStop(1, "#6cc15a");
    g.fillStyle = bg;
    g.fillRect(0, 0, w, h);

    // Cỏ và hoa dại
    tufts.forEach(([x, y, r]) => {
        g.fillStyle = r > 0.5 ? "#5fb44e" : "#9be58a";
        g.beginPath();
        g.moveTo(x, y);
        g.lineTo(x - 3, y - 8);
        g.lineTo(x + 1, y - 4);
        g.lineTo(x + 4, y - 9);
        g.lineTo(x + 5, y);
        g.fill();
    });
    
    flw.forEach(([x, y, c]) => {
        g.fillStyle = c;
        g.beginPath();
        g.arc(x, y, 3, 0, 7);
        g.fill();
    });

    // Đường đi
    g.fillStyle = "#b7bcc6";
    g.fillRect(0, 494, w, 132);
    g.fillRect(824, 0, 152, h);
    
    g.fillStyle = "#d9dde3";
    g.fillRect(0, 500, w, 120);
    g.fillRect(830, 0, 140, h);
    
    g.fillStyle = "rgba(255,255,255,.85)";
    for (let x = 0; x < w; x += 80) g.fillRect(x, 556, 40, 8);
    
    g.fillStyle = "#f2f2f2";
    g.fillRect(0, 496, w, 6);
    g.fillRect(0, 618, w, 6);
    g.fillStyle = "#c9a77c";
    g.fillRect(500, 350, 800, 16);

    // Hồ bơi (Hồ nước)
    const pg = g.createRadialGradient(230, 300, 10, 230, 300, 110);
    pg.addColorStop(0, "#9be1ff");
    pg.addColorStop(1, "#4fa8e0");
    
    g.fillStyle = "#d7c9a8";
    g.beginPath();
    g.ellipse(230, 300, 118, 66, 0, 0, 7);
    g.fill();
    
    g.fillStyle = pg;
    g.beginPath();
    g.ellipse(230, 300, 104, 54, 0, 0, 7);
    g.fill();
    
    g.strokeStyle = "rgba(255,255,255,.6)";
    g.lineWidth = 2;
    const rp = (tt * 20) % 40;
    g.beginPath();
    g.ellipse(230, 300, 20 + rp, 10 + rp / 2, 0, 0, 7);
    g.stroke();
    
    g.font = "22px serif";
    g.fillText("🦆", 200 + Math.sin(tt) * 30, 305); // Vịt bơi

    // Vẽ trường học
    school();

    // Vẽ các địa điểm (nhà, sân bóng, vườn...)
    P.forEach(p => {
        const lock = p.lv && S.lv < p.lv;
        if (p.b) {
            house(p);
        } else {
            rr(p.x, p.y, p.w, p.h, 22, lock ? "#8fa0a0" : p.c);
            rr(p.x + 6, p.y + 6, p.w - 12, p.h - 12, 18, lock ? "#9fb0b0" : "rgba(255,255,255,.18)");
            g.strokeStyle = "rgba(255,255,255,.7)";
            g.lineWidth = 4;
            g.setLineDash([14, 10]);
            g.strokeRect(p.x + 10, p.y + 10, p.w - 20, p.h - 20);
            g.setLineDash([]);
            
            g.font = "28px serif";
            // Trang trí vườn hoa
            if (p.id == "garden" && !lock) {
                for (let i = 0; i < 16; i++) {
                    g.fillText(["🌷", "🌼", "🌻", "🌱"][i % 4], p.x + 40 + (i * 57) % (p.w - 70), p.y + 70 + Math.floor(i / 5) * 80 + (i % 2) * 14);
                }
            }
            // Trang trí phòng Gym
            if (p.id == "gym" && !lock) {
                g.font = "44px serif";
                g.fillText("⚽", p.x + 80, p.y + 170);
                g.fillText("🏀", p.x + 290, p.y + 120);
                g.fillText("🥅", p.x + 190, p.y + 250);
            }
        }

        // Bảng tên
        const lab = lock ? \`🔒 Mở ở cấp \${p.lv}\` : p.n;
        g.font = "bold 16px system-ui";
        const lw = g.measureText(lab).width + 22;
        rr(p.x + p.w / 2 - lw / 2, p.y - 34, lw, 28, 14, "rgba(255,255,255,.92)");
        tx(lab, p.x + p.w / 2, p.y - 14, 16, "#223");
    });

    // Vẽ cây cối
    trees.forEach(([x, y, s]) => tree(x, y, s));

    // Vẽ Đài phun nước
    g.fillStyle = "#f5c542";
    const by = 480 + Math.sin(tt) * 6;
    rr(1600 + 0, by + 60, 0, 0, 0, "#000"); // (Dòng này dư thừa nhưng giữ nguyên theo code gốc)
    {
        const bx = 1620;
        const q = g.createRadialGradient(bx - 15, by - 15, 5, bx, by, 60);
        q.addColorStop(0, "#ffe27a");
        q.addColorStop(1, "#f09a1d");
        
        g.fillStyle = q;
        g.beginPath();
        g.ellipse(bx, by + 330, 48, 58, 0, 0, 7);
        g.fill();
        
        g.fillStyle = "#3b82c4";
        g.fillRect(bx - 48, by + 316, 96, 18);
        tx("VUI VẺ", bx, by + 330, 11, "#fff");
        
        rr(bx - 14, by + 386, 28, 20, 4, "#8b5a2b");
        g.strokeStyle = "#8b5a2b";
        g.lineWidth = 2;
        g.beginPath();
        g.moveTo(bx - 30, by + 378);
        g.lineTo(bx - 14, by + 388);
        g.moveTo(bx + 30, by + 378);
        g.lineTo(bx + 14, by + 388);
        g.stroke();
    }

    // VẼ HOA HÁI ĐƯỢC (Minigame)
    flowers.forEach(f => {
        g.font = "28px serif";
        // Hiệu ứng hoa lơ lửng
        g.fillText("🌸", f.x, f.y + Math.sin(tt * 4 + f.x) * 3); 
    });

    // Mây trôi
    for (let i = 0; i < 4; i++) {
        g.fillStyle = "rgba(0,0,0,.06)";
        g.beginPath();
        g.ellipse((tt * 14 + i * 520) % (w + 500) - 250, 200 + i * 260, 150, 60, 0, 0, 7);
        g.fill();
    }
}

function drawHall(f = 1) {
    const w = 1700;

    // Sàn nhà
    const fl = g.createLinearGradient(0, 170, 0, 420);
    fl.addColorStop(0, "#ecdfc6");
    fl.addColorStop(1, "#d9c7a4");
    g.fillStyle = fl;
    g.fillRect(0, 170, w, 250);

    g.fillStyle = "rgba(0,0,0,.05)";
    for (let i = 0; i < 29; i++) {
        for (let j = 0; j < 5; j++) {
            if ((i + j) % 2) g.fillRect(i * 60, 170 + j * 60, 60, 60);
        }
    }

    // Trần nhà
    const wl = g.createLinearGradient(0, 0, 0, 170);
    wl.addColorStop(0, "#fff6e0");
    wl.addColorStop(1, "#f0e2c2");
    g.fillStyle = wl;
    g.fillRect(0, 0, w, 170);

    rr(0, 112, w, 58, 0, "#7fb2e5");
    g.fillStyle = "rgba(255,255,255,.3)";
    g.fillRect(0, 112, w, 5);
    g.fillStyle = "#8b6b4a";
    g.fillRect(0, 166, w, 8);

    // Tầng 2: cửa sổ lớn nhìn ra sân trường
    if (f == 2) {
        [140, 340, 1290, 1490].forEach(wx => {
            rr(wx, 36, 130, 72, 8, "#fff");
            rr(wx + 8, 44, 114, 56, 5, "#9fd8ff");
            g.fillStyle = "#fff";
            g.fillRect(wx + 61, 44, 4, 56);
            g.fillRect(wx + 8, 69, 114, 4);
            g.font = "18px serif";
            g.fillText("☁️", wx + 28 + ((wx / 100 | 0) % 2) * 46, 66);
        });
    }

    // Các cửa lớp học
    (f == 1 ? KS : KS2).forEach((k, i) => {
        const dx = DX[k], r = RM[k];

        // Cửa
        for (let j = 0; j < 3; j++) {
            rg(dx + 110 + j * 30, 80, 26, 88, 4, ["#e17055", "#fdcb6e", "#74b9ff"][(i + j) % 3]);
        }

        // Bảng hiệu lớp
        rr(dx - 56, 34, 112, 136, 8, "#fff");
        rg(dx - 46, 44, 92, 126, 5, "#9a6236");
        rr(dx - 24, 58, 48, 40, 5, "#bfe6ff");

        g.fillStyle = "#ffd23f";
        g.beginPath();
        g.arc(dx + 32, 118, 4, 0, 7);
        g.fill();

        rr(dx - 66, 4, 132, 26, 8, "#2c3e66");
        tx(r.e + " " + r.n, dx, 23, 14, "#fff");
    });

    tx(f == 1 ? "Chào mừng đến Trường Vui Vẻ 🎒" : "Góc Thư Viện — Tầng 2 📚", 850, 62, 22, f == 1 ? "#c0504d" : "#8e5a1e");

    // Chậu cây cảnh
    g.font = "40px serif";
    [170, 500, 820, 1180, 1500].forEach(x => g.fillText("🪴", x, 170));

    // Cầu thang ở cuối hành lang
    g.fillStyle = "rgba(0,0,0,.1)";
    g.fillRect(1560, 170, 140, 250);
    for (let i = 0; i < 6; i++) {
        rg(1566 + i * 9, 176 + i * 26, 128 - i * 18, 24, 4, i % 2 ? "#b98a55" : "#a5763f");
    }
    tx(f == 1 ? "▲ Lên Tầng 2" : "▼ Xuống Tầng 1", 1630, 152, 12, "#fff");

    // Cửa ra sân (chỉ tầng 1)
    if (f == 1) {
        rr(0, 200, 22, 190, 4, "#9fd8ff");
        g.fillStyle = "#fff8";
        g.fillRect(4, 200, 5, 190);
        tx("Ra sân", 50, 180, 12, "#223");
    }

    // Ánh sáng chiếu vào
    for (let i = 0; i < 7; i++) {
        g.fillStyle = "rgba(255,240,170,.35)";
        g.beginPath();
        g.ellipse(100 + i * 250, 300, 90, 30, 0, 0, 7);
        g.fill();
    }
}

function drawRoom() {
    const r = RM[rk];
    g.fillStyle = r.f;
    g.fillRect(0, 0, 1000, 600);
    
    // Sàn nhà
    g.fillStyle = "rgba(0,0,0,.06)";
    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 12; j++) {
            if ((i + j) % 2) g.fillRect(i * 50, j * 50, 50, 50);
        }
    }

    // Tường
    const q = g.createLinearGradient(0, 0, 0, 140);
    q.addColorStop(0, "#fbf5e6");
    q.addColorStop(1, "#e4d8bf");
    g.fillStyle = q;
    g.fillRect(0, 0, 1000, 140);
    rr(0, 128, 1000, 14, 0, "#8b6b4a");

    // Bảng đen
    rr(236, 14, 528, 108, 10, "#7a5230");
    rr(248, 26, 504, 82, 6, "#2f5d4a");
    tx(r.b, 500, 78, 26, "#fff");
    rr(300, 112, 400, 8, 3, "#a97c50");

    // Đồng hồ treo tường
    g.fillStyle = "#fff";
    g.beginPath();
    g.arc(110, 64, 30, 0, 7);
    g.fill();
    g.strokeStyle = "#333";
    g.lineWidth = 4;
    g.stroke();
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(110, 64);
    g.lineTo(110, 46);
    g.moveTo(110, 64);
    g.lineTo(124, 70);
    g.stroke();

    // Cửa sổ
    rr(826, 20, 118, 92, 8, "#fff");
    rr(834, 28, 102, 76, 5, "#9fd8ff");
    g.fillStyle = "#fff";
    g.fillRect(883, 28, 4, 76);
    g.fillRect(834, 64, 102, 4);

    // Trang trí
    g.font = "46px serif";
    g.fillText(r.e, 50, 122);
    g.fillText(r.e, 950, 170);

    // Thảm
    const rug = g.createRadialGradient(500, 450, 20, 500, 450, 260);
    rug.addColorStop(0, "rgba(255,255,255,.35)");
    rug.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = rug;
    g.fillRect(200, 300, 600, 300);

    // Bục giảng
    rr(420, 555, 160, 45, 8, "#7a4a2a");
    rr(432, 562, 60, 38, 4, "#9a6236");
    rr(508, 562, 60, 38, 4, "#9a6236");

    // Học sinh
    studs.forEach(s => {
        if (s.on) chr(s.x, s.y, s.c, "", s.n, tt * 2 + s.x, null, 0);
    });

    // Bàn ghế học sinh
    desks.forEach(d => {
        g.fillStyle = "rgba(0,0,0,.18)";
        g.beginPath();
        g.ellipse(d[0] + 48, d[1] + 54, 52, 8, 0, 0, 7);
        g.fill();
        
        rg(d[0], d[1] + 10, 90, 36, 6, "#c68b4e");
        rr(d[0] + 8, d[1] + 46, 6, 10, 2, "#7a5230");
        rr(d[0] + 76, d[1] + 46, 6, 10, 2, "#7a5230");
        rr(d[0] + 30, d[1] + 16, 28, 16, 3, "#fff");
    });

    // Kệ sách (trang trí Thư viện tầng 2)
    if (rk == "lib") {
        [70, 810].forEach(bx => {
            rr(bx, 150, 120, 140, 6, "#8b5a2b");
            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < 6; j++) {
                    rr(bx + 10 + j * 17, 160 + i * 62, 13, 44, 2,
                        ["#e17055", "#fdcb6e", "#74b9ff", "#55b36a", "#e07aa8", "#8f7ae0"][(i + j) % 6]);
                }
                rr(bx + 6, 212 + i * 62, 108, 8, 2, "#6d4520");
            }
        });
    }

    // Táo để bàn
    rg(430, 236, 140, 32, 6, "#9c6b3f");
    g.font = "22px serif";
    g.fillText("🍎", 450, 262);

    // Giáo viên
    const near_ = Math.hypot(me.x - 500, me.y - 225) < 150;
    chr(500, 226, r.c, "🎓", r.t, tt * 2, near_ ? "Chào em!" : null, 0);
}`,D=`// ===== SCHEDULE: thời khóa biểu, đồng hồ, báo chuông, vào lớp đúng giờ =====
const DAY_NAME={1:"Thứ 2",2:"Thứ 3",3:"Thứ 4",4:"Thứ 5",5:"Thứ 6",6:"Thứ 7",7:"CN"};
const SUB_LABEL={math:"Toán",eng:"Tiếng Anh",van:"Ngữ văn",sci:"Khoa học"};
const CFG=Object.assign({
  useRealTime:true,simulateTime:null,demoMode:false,
  earlyMinutes:5,graceMinutes:10,notifyBeforeMinutes:2,
  autoEnterClass:true,allowFreePractice:true,requireOnTimeForLesson:true,
  schoolName:"Trường Vui Vẻ",timetable:[]
}, window.__SCHOOL_CONFIG__||{});
try{const st=localStorage.getItem("tvv_sim_time");if(st)CFG.simulateTime=st}catch(e){}
try{if(localStorage.getItem("tvv_demo")==="1")CFG.demoMode=true}catch(e){}
function pad2(n){return String(n).padStart(2,"0")}
function parseHM(s){const[h,m]=String(s).split(":").map(Number);return(h||0)*60+(m||0)}
function fmtHM(mins){const m=((mins%1440)+1440)%1440;return pad2(Math.floor(m/60))+":"+pad2(m%60)}
function nowDate(){
  if(CFG.simulateTime){const d=new Date(),[h,m]=String(CFG.simulateTime).split(":").map(Number);d.setHours(h||0,m||0,0,0);return d}
  return new Date();
}
function todayDow(d=nowDate()){const x=d.getDay();return x===0?7:x}
function nowMins(d=nowDate()){return d.getHours()*60+d.getMinutes()}
function buildDemoTimetable(){
  const base=nowMins(),day=todayDow();
  return[
    {day,start:fmtHM(base+1),end:fmtHM(base+8),subject:"math",type:"lesson",title:"Toán (demo)"},
    {day,start:fmtHM(base+9),end:fmtHM(base+16),subject:"van",type:"lesson",title:"Ngữ văn (demo)"},
    {day,start:fmtHM(base+17),end:fmtHM(base+24),subject:"eng",type:"exam",examId:"thi_anh_1",title:"Thi Tiếng Anh (demo)"},
    {day,start:fmtHM(base+25),end:fmtHM(base+32),subject:"math",type:"exam",examId:"thi_toan_1",title:"Thi Toán (demo)"}
  ];
}
// Lịch DEMO dựng 1 lần/buổi chơi (không dựng lại mỗi giây — nếu không key tiết
// sẽ đổi liên tục và game báo chuông + dẫn bé về lớp mỗi phút).
let _demoTable=null;
function activeTimetable(){
  if(!CFG.demoMode)return CFG.timetable||[];
  if(!_demoTable)_demoTable=buildDemoTimetable();
  return _demoTable;
}
function periodKey(p){return[p.day,p.start,p.end,p.subject,p.type,p.examId||""].join("|")}
function periodsForDay(day){return activeTimetable().filter(p=>(p.days||[p.day]).includes(day)).sort((a,b)=>parseHM(a.start)-parseHM(b.start))}
function findCurrentPeriod(){
  const day=todayDow(),now=nowMins(),early=CFG.earlyMinutes||0,grace=CFG.graceMinutes||0;
  return periodsForDay(day).find(p=>{
    const s=parseHM(p.start)-early,e=parseHM(p.end)+grace;
    return now>=s&&now<e;
  })||null;
}
function findNextPeriod(){
  const day=todayDow(),now=nowMins();
  const today=periodsForDay(day).find(p=>parseHM(p.start)>now);
  if(today)return today;
  for(let i=1;i<=7;i++){const d=((day-1+i)%7)+1;const list=periodsForDay(d);if(list.length)return Object.assign({},list[0],{_futureDay:d})}
  return null;
}
function periodInSession(p){
  if(!p)return false;
  const day=todayDow(),now=nowMins();
  if(!(p.days||[p.day]).includes(day))return false;
  return now>=parseHM(p.start)-(CFG.earlyMinutes||0)&&now<parseHM(p.end)+(CFG.graceMinutes||0);
}
let _lastPeriodKey="",_notifiedKeys={};
function canStartLesson(type,{force}={}){
  if(force||!CFG.requireOnTimeForLesson)return true;
  const cur=findCurrentPeriod();
  if(cur&&cur.subject===type&&cur.type==="lesson"&&periodInSession(cur))return true;
  if(CFG.allowFreePractice)return true;
  toast("⏰ Chưa đến giờ học "+(SUB_LABEL[type]||type)+" theo TKB!");
  return false;
}
function canStartExam(ex,{force}={}){
  if(force||!CFG.requireOnTimeForLesson)return true;
  const cur=findCurrentPeriod();
  if(cur&&cur.type==="exam"&&(cur.examId===ex.id||cur.subject===ex.subject)&&periodInSession(cur))return true;
  if(CFG.allowFreePractice)return true;
  toast("⏰ Bài thi này chưa đến giờ theo thời khóa biểu!");
  return false;
}
/* Tới giờ: đưa tiết hiện tại vào PEND rồi tự dẫn bé về lớp.
   Bé ngồi vào bàn (world.js seatAt) là học/thi bắt đầu luôn — không bấm gì cả. */
function startPeriodActivity(p,{force}={}){
  if(!p)return;
  PEND=p;
  if(sc!="room"||rk!=p.subject)go("room",500,545,p.subject);
  toast(p.type==="exam"?"📝 Ngồi vào bàn là bài thi bắt đầu!":"📖 Ngồi vào bàn là học luôn nhé!");
}
function tickSchedule(){
  const d=nowDate(),hm=pad2(d.getHours())+":"+pad2(d.getMinutes())+":"+pad2(d.getSeconds());
  const cur=findCurrentPeriod(),nxt=findNextPeriod();
  let line="🕒 "+hm+" · "+DAY_NAME[todayDow(d)];
  if(CFG.demoMode)line+=" · DEMO";
  if(CFG.simulateTime)line+=" · giả lập";
  if(cur)line+=" · 🔔 "+cur.title+" ("+cur.start+"–"+cur.end+")";
  else if(nxt)line+=" · tiếp: "+nxt.title+" "+nxt.start+(nxt._futureDay?" "+DAY_NAME[nxt._futureDay]:"");
  $("clk").textContent=line;
  const bel=$("bell");
  if(cur){bel.style.display="block";bel.textContent=(cur.type==="exam"?"📝 ":"📖 ")+"Đang giờ: "+cur.title+" · vào lớp "+(SUB_LABEL[cur.subject]||"")+"!"}
  else bel.style.display="none";
  const key=cur?periodKey(cur):"";
  if(key&&key!==_lastPeriodKey){
    _lastPeriodKey=key;
    if(!_notifiedKeys[key]){
      _notifiedKeys[key]=1;
      toast((cur.type==="exam"?"📝 Đến giờ thi: ":"🔔 Đến giờ học: ")+cur.title);
      if(CFG.autoEnterClass&&!open_&&!climb){
        PEND=cur;
        if(sc!="room"||rk!=cur.subject)go("room",500,545,cur.subject);
        toast("🪑 Ngồi vào bàn là bắt đầu ngay!");
      }
    }
  }
  if(!cur){_lastPeriodKey="";PEND=null}
  // Vào lớp giữa giờ: vẫn còn thời gian thì chờ bé ngồi vào bàn
  else if(!PEND&&!_doneKeys[key]&&!open_&&!climb&&sc=="room"&&rk==cur.subject&&periodInSession(cur))PEND=cur;
  // báo trước
  if(!cur&&nxt&&!nxt._futureDay){
    const left=parseHM(nxt.start)-nowMins();
    const nk="pre:"+periodKey(nxt);
    if(left>0&&left<=(CFG.notifyBeforeMinutes||2)&&!_notifiedKeys[nk]){
      _notifiedKeys[nk]=1;
      toast("⏳ Sắp đến giờ "+nxt.title+" ("+nxt.start+")");
    }
  }
}
function showSchedule(){
  if(open_)return;
  const day=todayDow(),list=periodsForDay(day),cur=findCurrentPeriod(),nxt=findNextPeriod();
  const rows=list.length?list.map(p=>{
    const cls=cur&&periodKey(cur)===periodKey(p)?"now":(nxt&&periodKey(nxt)===periodKey(p)?"next":"");
    return\`<tr class="\${cls}"><td>\${p.start}–\${p.end}</td><td>\${p.title}</td><td><span class="tag \${p.type==="exam"?"exam":""}">\${p.type==="exam"?"Thi":"Học"}</span></td></tr>\`;
  }).join(""):\`<tr><td colspan="3">Hôm nay không có tiết (xem các ngày khác bên dưới)</td></tr>\`;
  const week=[1,2,3,4,5].map(d=>{
    const ps=periodsForDay(d);
    return\`<p style="text-align:left;margin:6px 0 2px;font-weight:800">\${DAY_NAME[d]}\${d===day?" ← hôm nay":""}</p>\`+
      (ps.length?\`<table class="ttab"><tbody>\${ps.map(p=>\`<tr><td>\${p.start}</td><td>\${p.title}</td><td>\${p.type==="exam"?"📝":"📖"}</td></tr>\`).join("")}</tbody></table>\`:"<p style='font-size:12px;color:#666'>Nghỉ</p>");
  }).join("");
  modal(\`<h2>📅 Thời khóa biểu</h2>
<p style="font-size:13px">Giờ máy: <b>\${pad2(nowDate().getHours())}:\${pad2(nowDate().getMinutes())}</b> · \${DAY_NAME[day]}\${CFG.demoMode?" · <b>DEMO</b>":""}\${CFG.simulateTime?" · giả lập "+CFG.simulateTime:""}</p>
\${cur?\`<p style="background:#fff3c4;padding:8px;border-radius:12px;font-weight:800">🔔 Đang học: \${cur.title} (\${cur.start}–\${cur.end})</p><button class="btn" id="joinNow">Vào học ngay</button>\`:nxt?\`<p>Tiết tiếp: <b>\${nxt.title}</b> lúc \${nxt.start}\${nxt._futureDay?" ("+DAY_NAME[nxt._futureDay]+")":""}</p>\`:""}
<h3 style="margin:10px 0 4px;font-size:16px">Hôm nay</h3>
<table class="ttab"><thead><tr><th>Giờ</th><th>Môn</th><th>Loại</th></tr></thead><tbody>\${rows}</tbody></table>
<details style="text-align:left;margin-top:8px"><summary style="font-weight:800;cursor:pointer">Cả tuần</summary>\${week}</details>
<p style="font-size:11px;color:#666;margin-top:8px">Sửa lịch trong <code>data/schedule.js</code>. Bật demo: localStorage <code>tvv_demo=1</code>. Giả lập giờ: <code>tvv_sim_time="08:00"</code>.</p>
<button class="btn" id="togDemo" style="background:#bfe6ff;box-shadow:0 3px 0 #8ab">\${CFG.demoMode?"Tắt DEMO":"Bật DEMO thử lịch"}</button>
<button class="btn" id="b3" style="background:#ddd;box-shadow:0 3px 0 #aaa">Đóng</button>\`);
  if($("joinNow"))$("joinNow").onclick=()=>{close_();startPeriodActivity(cur,{force:true})};
  $("togDemo").onclick=()=>{
    CFG.demoMode=!CFG.demoMode;
    _demoTable=null;
    try{localStorage.setItem("tvv_demo",CFG.demoMode?"1":"0")}catch(e){}
    _notifiedKeys={};_lastPeriodKey="";
    close_();showSchedule();
    toast(CFG.demoMode?"🧪 DEMO: tiết sẽ bắt đầu sau ~1 phút":"Đã dùng thời khóa biểu thật");
  };
  $("b3").onclick=close_;
}
`,O=`// ===== SETTINGS: bảng ⚙️ Dữ liệu — sửa JSON câu hỏi ngay trong game =====
function cfg(){if(open_)return;
 modal(\`<h2>⚙️ Dữ liệu câu hỏi & bài thi</h2><p style="font-size:13px;margin:4px 0">Sửa JSON bên dưới rồi bấm <b>Áp dụng</b>. Dữ liệu được lưu trên trình duyệt của bạn. Muốn sửa vĩnh viễn: chép JSON này dán đè vào file <code>data/questions.js</code>.</p><textarea id="ta" spellcheck="false"></textarea><div id="er"></div><button class="btn" id="ap">✅ Áp dụng</button> <button class="btn" id="cp" style="background:#bfe6ff;box-shadow:0 3px 0 #8ab">📋 Sao chép</button> <button class="btn" id="rs" style="background:#ffd0d0;box-shadow:0 3px 0 #c99">↩️ Mặc định</button> <button class="btn" id="cl" style="background:#ddd;box-shadow:0 3px 0 #aaa">Đóng</button>\`);
 $("ta").value=JSON.stringify(DATA,null,1);
 $("ap").onclick=()=>{try{const x=JSON.parse($("ta").value),er=vd(x);if(er){$("er").textContent="❌ "+er;return}DATA=x;try{localStorage.setItem("tvv_data",JSON.stringify(x))}catch(e){}close_();toast("✅ Đã cập nhật câu hỏi & bài thi!")}catch(e){$("er").textContent="❌ JSON lỗi: "+e.message}};
 $("cp").onclick=()=>{try{navigator.clipboard.writeText($("ta").value).then(()=>toast("📋 Đã sao chép JSON"),()=>{$("ta").select()})}catch(e){$("ta").select()}};
 $("rs").onclick=()=>{try{localStorage.removeItem("tvv_data")}catch(e){}loadData();close_();toast("↩️ Đã khôi phục dữ liệu mặc định")};
 $("cl").onclick=close_}
`,k=`// ===== STATE: tiến trình người chơi (lưu localStorage), cảnh hiện tại, nhân vật =====
let S={coins:100,gems:0,xp:0,lv:1,en:100,hat:"",col:"#ff9f43",own:["","#ff9f43"],q:{}};
try{const s=localStorage.getItem("tvv");if(s)S=Object.assign(S,JSON.parse(s))}catch(e){}
S.exam=S.exam||{};function save(){S._updated=Date.now();try{localStorage.setItem("tvv",JSON.stringify(S))}catch(e){}try{if(typeof scheduleSchoolSync==="function")scheduleSchoolSync()}catch(e){}}
const D={out:[1800,1100],hall:[1700,420],hall2:[1700,420],room:[1000,600]};
let sc="out",rk="math",fade=0,open_=false,tt=0,ft=[],flowers=[],ftime=0;
const me={x:900,y:560,mv:0,t:0};
`,A=`// ===== SYNC: nhận avatar + tiến độ từ app, gửi tiến độ lên API =====
// Dữ liệu vẫn được lưu localStorage như cũ (chơi được khi mất mạng), nhưng mỗi
// lần state thay đổi sẽ gửi thêm một bản cho trang cha để đẩy lên API.
//
// Trang cha (src/pages/SchoolMissionPage.jsx) chịu trách nhiệm:
//   · giữ hàng đợi khi mất mạng,
//   · gửi lại khi có wifi,
//   · trả state mới nhất về qua window.__SCHOOL_INIT__.savedState.

var schoolSyncReady = false;
var schoolSyncTimer = null;
var schoolLastSent = "";

function scheduleSchoolSync(delay) {
    if (!schoolSyncReady) return;
    if (schoolSyncTimer) clearTimeout(schoolSyncTimer);
    schoolSyncTimer = setTimeout(sendSchoolSync, delay == null ? 700 : delay);
}

function schoolSyncPayload() {
    var need = S.lv * 50 || 50;
    return {
        level: S.lv,
        experience: S.xp,
        progress: Math.max(0, Math.min(1, S.xp / need)),
        gameName: "Trường Vui Vẻ",
        gameState: S
    };
}

// Năng lượng tự hồi và _updated đổi liên tục; bỏ qua khi so sánh để không gọi
// API mỗi 5 giây chỉ vì hai giá trị này.
function schoolSyncSignature(state) {
    var copy = {};
    Object.keys(state || {}).forEach(function (key) {
        if (key !== "_updated" && key !== "en") copy[key] = state[key];
    });
    return JSON.stringify(copy);
}

function sendSchoolSync(force) {
    schoolSyncTimer = null;
    if (!schoolSyncReady) return;
    if (window.parent === window) return;

    var payload = schoolSyncPayload();
    var signature = schoolSyncSignature(S);
    if (!force && signature === schoolLastSent) return;

    schoolLastSent = signature;
    try {
        window.parent.postMessage({ type: "school-save", data: payload }, "*");
    } catch (e) {
        schoolLastSent = "";
    }
}

function applySavedSchoolState(remote) {
    if (!remote || typeof remote !== "object") return false;

    var localAt = Number(S._updated) || 0;
    var remoteAt = Number(remote._updated) || 0;
    if (remoteAt <= localAt) return false;

    S = Object.assign({
        coins: 100, gems: 0, xp: 0, lv: 1, en: 100,
        hat: "", col: "#ff9f43", own: ["", "#ff9f43"], q: {}, exam: {}
    }, remote);
    S.exam = S.exam || {};
    try { localStorage.setItem("tvv", JSON.stringify(S)); } catch (e) { /* ignore */ }
    return true;
}

function initSchoolSync() {
    var init = window.__SCHOOL_INIT__ || {};

    setPlayerName(init.playerName);
    if (init.avatarSvg) setPlayerAvatar(init.avatarSvg, init.avatarViewBox);
    else loadCachedPlayerAvatar();

    var remote = init.savedState;
    var mergedRemote = applySavedSchoolState(remote);

    window.addEventListener("message", function (event) {
        var msg = event && event.data;
        if (!msg || typeof msg !== "object") return;

        if (msg.type === "school-avatar" && msg.data) {
            setPlayerName(msg.data.playerName);
            if (msg.data.avatarSvg) setPlayerAvatar(msg.data.avatarSvg, msg.data.avatarViewBox);
        }
    });

    // Đóng tab / chuyển trang: gửi ngay bản mới nhất, không đợi debounce.
    window.addEventListener("pagehide", function () { sendSchoolSync(true); });

    schoolSyncReady = true;

    var localAt = Number(S._updated) || 0;
    var remoteAt = remote && Number(remote._updated) || 0;
    if (!mergedRemote && (!remote || localAt > remoteAt)) {
        scheduleSchoolSync(1200);
    }

    if (window.parent !== window) {
        try {
            window.parent.postMessage({ type: "school-ready", data: { gameId: "school-mission" } }, "*");
        } catch (e) { /* ignore */ }
    }
}
`,j=`// ===== UI: thông báo, popup +xu, cộng thưởng, tiến độ nhiệm vụ, hộp thoại =====
function toast(t){const e=$("toast");e.textContent=t;e.style.display="block";clearTimeout(toast.h);toast.h=setTimeout(()=>e.style.display="none",2200)}
function pop(s){ft.push({x:me.x,y:me.y-90,s,t:1.4})}
function gain(c,x){S.coins+=c;S.xp+=x;pop("+"+c+"🪙 +"+x+"XP");const need=S.lv*50;if(S.xp>=need){S.xp-=need;S.lv++;S.gems+=2;toast("🎉 Lên cấp "+S.lv+"! "+(S.lv==2?"Mở Vườn trường 🌸":S.lv==3?"Mở Sân thể thao 🏃":"+2 💎"))}save()}
function prog(k,n=1){const q=QU.find(x=>x.k==k);S.q[k]=(S.q[k]||0)+n;if(S.q[k]>=q.n){S.q[k]=0;S.coins+=q.c;S.gems+=q.g;setTimeout(()=>toast("✅ Xong nhiệm vụ! +"+q.c+"🪙 +"+q.g+"💎"),600)}save()}
function modal(h){$("box").innerHTML=h;$("modal").style.display="flex";open_=true}
function close_(){$("modal").style.display="none";open_=false}
`,M=`// ===== WORLD: chuyển cảnh, vùng tương tác tự động, va chạm, chat, cập nhật mỗi khung hình =====

/* PEND  : tiết đang chờ bé ngồi vào bàn để học/thi (do js/schedule.js đặt)
   zin   : latch các vùng — phải rời vùng rồi mới kích hoạt lại
   climb : trạng thái leo cầu thang */
let PEND=null,_pendCd=0,_doneKeys={},zin={},climb=null;

function go(s,x,y,r){sc=s;me.x=x;me.y=y;if(r)rk=r;fade=1;zin={};npcClose();if(s=="room")toast("Chào mừng đến "+RM[rk].n+"!")}

/* Vùng TỰ KÍCH HOẠT: đi vào vùng là chạy ngay — KHÔNG có nút bấm.
   Vào cửa trường/cửa lớp/cầu thang hay bước vào nhà đều tự mở. */
function ZN(){
 if(sc=="out"){
  const z=[{id:"school",x:820,y:356,w:160,h:110,f:()=>go("hall",140,300)}];
  P.forEach(p=>{if(p.lv&&S.lv<p.lv)return;
   const f={shop,can:canteen,garden,gym}[p.id];
   z.push(p.b?{id:p.id,x:p.x,y:p.y+p.h-10,w:p.w,h:60,f}:{id:p.id,x:p.x,y:p.y,w:p.w,h:p.h,f})});
  return z;
 }
 if(sc=="hall")return[
  {id:"out",x:0,y:195,w:70,h:210,f:()=>go("out",900,560)},
  ...KS.map(k=>({id:"d_"+k,x:DX[k]-55,y:195,w:160,h:60,f:()=>go("room",500,505,k)})),
  {id:"stairs",x:1560,y:195,w:140,h:210,f:climbUp}];
 if(sc=="hall2")return[
  {id:"down",x:1560,y:195,w:140,h:210,f:climbDown},
  {id:"d_lib",x:DX.lib-55,y:195,w:160,h:60,f:()=>go("room",500,505,"lib")}];
 if(sc=="room")return rk=="lib"
  ?[{id:"teach",x:360,y:150,w:280,h:170,f:readBook}]
  :[{id:"teach",x:360,y:150,w:280,h:170,f:()=>quiz(rk)}];
 return[];
}

/* Ngồi vào bàn: đứng trong khoảng giữa hai hàng bàn, cạnh một bàn bất kỳ */
function seatAt(){return desks.find(d=>Math.abs(me.x-(d[0]+45))<58&&me.y>d[1]+50&&me.y<d[1]+108)||null}

/* ── CẦU THANG: khoá điều khiển, bé tự "bước" lên từng bậc rồi đổi tầng ── */
function climbUp(){if(climb)return;climb={dir:1,t:0};toast("🪜 Đi lên tầng 2…")}
function climbDown(){if(climb)return;climb={dir:-1,t:0};toast("🪜 Đi xuống tầng 1…")}

function blocked(x,y){
 if(sc=="hall"||sc=="hall2")return y<195;
 if(sc=="room")return x<60||x>940||y<280||desks.some(d=>x>d[0]-8&&x<d[0]+98&&y>d[1]+8&&y<d[1]+52);
 return(x>520&&x<1280&&y>90&&y<352)||P.some(p=>p.b?x>p.x+5&&x<p.x+p.w-5&&y>p.y+60&&y<p.y+p.h-10:(p.lv&&S.lv<p.lv&&x>p.x&&x<p.x+p.w&&y>p.y&&y<p.y+p.h))}

let last=performance.now();
function upd(dt){tt+=dt;if(fade>0)fade=Math.max(0,fade-dt*2.5);
 if(_pendCd>0)_pendCd-=dt;

 /* Leo cầu thang: khoá điều khiển, di chuyển lên đến khi hết bậc thì đổi cảnh */
 if(climb){climb.t+=dt;me.y-=150*dt;me.mv=1;me.t+=dt*12;
  if(climb.t>=1.05){const d=climb.dir;climb=null;if(d>0)go("hall2",120,320);else go("hall",DX.math,300)}
  tickSchedule();return}

 const[WW,WH]=D[sc];
 if(!open_&&fade<.6){let dx=jx+((keys.d||keys.arrowright)?1:0)-((keys.a||keys.arrowleft)?1:0),dy=jy+((keys.s||keys.arrowdown)?1:0)-((keys.w||keys.arrowup)?1:0);const m=Math.hypot(dx,dy);if(m>1){dx/=m;dy/=m}
  const sp=190*dt,nx=me.x+dx*sp,ny=me.y+dy*sp;if(!blocked(nx,me.y))me.x=Math.max(25,Math.min(WW-25,nx));if(!blocked(me.x,ny))me.y=Math.max(40,Math.min(WH-15,ny));me.mv=Math.min(1,m);if(m>.1)me.t+=dt*12}else me.mv=0;
 S.en=Math.min(100,S.en+dt/3);
 npcs.forEach(n=>{n.t-=dt;if(n.t<0){n.tx=n.b[0]+Math.random()*(n.b[2]-n.b[0]);n.ty=n.b[1]+Math.random()*(n.b[3]-n.b[1]);n.t=3+Math.random()*5}const d=Math.hypot(n.tx-n.x,n.ty-n.y);n.mv=d>6?1:0;if(d>6){n.x+=(n.tx-n.x)/d*60*dt;n.y+=(n.ty-n.y)/d*60*dt}if(n.say>0)n.say-=dt;else if(!chatN&&n.sc==sc&&Math.hypot(n.x-me.x,n.y-me.y)<110&&Math.random()<.01)n.say=2.5});
 ft=ft.filter(f=>(f.t-=dt)>0);
 if(ftime>0){ftime-=dt;if(sc=="out")flowers=flowers.filter(f=>{if(Math.hypot(f.x-me.x,f.y-me.y)<30){prog("flower");gain(4,3);return false}return true});if(!flowers.length){ftime=0;toast("🌸 Thu hoa xong! Giỏi lắm!")}else if(ftime<=0){flowers=[];toast("Hết giờ rồi!")}}

 /* Vùng tự kích hoạt: vừa đi vào vùng là chạy hành động ngay */
 if(!open_&&fade<.4){
  ZN().forEach(z=>{
   const hit=me.x>z.x-14&&me.x<z.x+z.w+14&&me.y>z.y-14&&me.y<z.y+z.h+14;
   if(hit&&!zin[z.id]){zin[z.id]=1;z.f()}else if(!hit)zin[z.id]=0;
  });
 }

 /* Tới giờ + ngồi vào bàn → học/thi bắt đầu luôn, không bấm gì cả */
 if(PEND&&!open_&&fade<=0&&_pendCd<=0&&sc=="room"&&rk==PEND.subject){
  const st=seatAt();
  if(st){
   _pendCd=2;
   if(PEND.type=="exam"){
    const ex=(DATA.exams||[]).find(e=>e.id==PEND.examId)||(DATA.exams||[]).find(e=>e.subject==PEND.subject);
    if(ex)runExam(ex,{force:true});else toast("Lớp này chưa có đề thi!");
   }else quiz(PEND.subject,{force:true});
   if(open_){_doneKeys[periodKey(PEND)]=1;PEND=null}
  }
 }

 updChat(dt);

 $("loc").textContent=sc=="out"?"🌳 Sân trường":sc=="hall2"?"🏫 Hành lang — Tầng 2":sc=="hall"?"🏫 Hành lang — Tầng 1":"📍 "+RM[rk].n;
 $("lvt").textContent="⭐ Cấp "+S.lv;document.querySelector("#bar i").style.width=(S.xp/(S.lv*50)*100)+"%";
 $("coin").textContent="🪙 "+S.coins;$("gem").textContent="💎 "+S.gems;document.querySelector("#bar2 i").style.width=S.en+"%";
 $("qp").innerHTML="<b>📋 Nhiệm vụ</b><br>"+QU.map(q=>\`• \${q.t}: \${S.q[q.k]||0}/\${q.n}\`).join("<br>");
 tickSchedule()}

/* ═══ TRÒ CHUYỆN VỚI HỌC SINH KHÁC ═══
   Đứng gần một bạn (~90px) khoảng 0.7s là hộp chat tự mở. Chọn câu trả lời,
   bạn ấy đáp lại theo ngữ cảnh thời khóa biểu. Đi xa là tự đóng; mỗi bạn
   nghỉ 25 giây mới chat tiếp để không bị làm phiền liên tục. */
let chatN=null,chatT=0,chatCd={};
const CHAT_REPLIES=[
 {t:"Chào bạn! 👋",r:()=>["Chào cậu! Rất vui được gặp cậu 😄","Hi hi, chào cậu nha. Học chăm nhé!","Lâu quá không gặp, nhớ cậu quá! 🤗"]},
 {t:"Hôm nay học gì vậy?",r:()=>{
   const cur=findCurrentPeriod(),nxt=findNextPeriod();
   if(cur)return["Giờ này đang học "+cur.title+" ("+cur.start+"–"+cur.end+") đó! Vào lớp nhanh lên 📚","Tiết "+cur.title+" đang diễn ra nè, ngồi vào bàn là học được liền!"];
   if(nxt&&nxt.type=="exam")return["Sắp thi "+(SUB_LABEL[nxt.subject]||nxt.subject)+" lúc "+nxt.start+" rồi, ôn bài đi thôi! 📝"];
   if(nxt)return["Tiết tới là "+nxt.title+" lúc "+nxt.start+" đó! ⏰","Chuẩn bị hết giờ ra chơi, tiết "+nxt.title+" sắp đến rồi!"];
   return["Hôm nay hết tiết rồi! Đi chơi thui 🎉","Không có tiết nào nữa, muỗi hết bài rồi 🤭"]}},
 {t:"Kể mình nghe điều hay đi!",r:()=>[
   "Ở tầng 2 có Thư viện, đọc sách được thưởng luôn đó! Cầu thang ở cuối hành lang nha 📚",
   "Căng tin có bánh mì siêu ngon, ăn xong đầy ắp năng lượng! 🥪",
   "Vườn trường có nhiều hoa xinh, thu đủ 8 bông là có quà đó! 🌸",
   "Sân thể thao mở ở cấp 3, chạy bộ vui cực luôn! ⚽",
   "Bật 📅 Thời khóa biểu là biết giờ học mỗi ngày luôn á!"]},
];
function chatTargets(){
 const a=npcs.filter(n=>n.sc==sc);
 if(sc=="room")studs.forEach(s=>{if(s.on)a.push({n:s.n,c:s.c,x:s.x,y:s.y})});
 return a;
}
function updChat(dt){
 for(const k in chatCd)if(chatCd[k]>0)chatCd[k]-=dt;
 if(open_||fade>0||climb){if(chatN)npcClose();return}
 let best=null,bd=1e9;
 chatTargets().forEach(n=>{const d=Math.hypot(n.x-me.x,n.y-me.y);if(d<bd){bd=d;best=n}});
 if(chatN){
  if(!best||best.n!=chatN.n||bd>170||chatT>30)npcClose();
  return;
 }
 if(best&&bd<95&&!(chatCd[best.n]>0)){chatT+=dt;if(chatT>.7)npcOpen(best)}else chatT=0;
}
function npcOpen(n){
 chatN=n;chatT=0;chatCd[n.n]=25;n.say=0;
 $("npcav").textContent=n.h||"🙂";
 $("npcname").textContent=n.n;
 $("npcmsg").textContent="Chào mình là "+n.n+"! Cậu muốn nói gì nào? 😊";
 $("npcrep").innerHTML=CHAT_REPLIES.map((r,i)=>\`<button data-i="\${i}">\${r.t}</button>\`).join("");
 [...$("npcrep").children].forEach((b,i)=>b.onclick=()=>{
  const rep=CHAT_REPLIES[i].r();
  $("npcmsg").textContent=rep[Math.floor(Math.random()*rep.length)];
  $("npcrep").innerHTML=\`<button id="bye">Kết thúc 💬</button>\`;
  $("bye").onclick=npcClose;
 });
 $("npcchat").style.display="flex";
}
function npcClose(){if(!chatN)return;chatN=null;const e=$("npcchat");if(e)e.style.display="none"}
`,N=`*{box-sizing:border-box;-webkit-user-select:none;user-select:none;touch-action:none}
html,body{margin:0;height:100%;overflow:hidden;background:#7ccf6b;font-family:system-ui,-apple-system,"Segoe UI",sans-serif}
canvas{display:block;width:100%;height:100%}
.pill{position:fixed;background:rgba(30,40,70,.8);color:#fff;border-radius:20px;padding:5px 12px;font-weight:700;font-size:14px}
#lv{top:calc(8px + env(safe-area-inset-top,0px));left:8px;min-width:150px}
#bar{height:7px;background:#fff3;border-radius:5px;margin-top:4px;overflow:hidden}#bar i{display:block;height:100%;background:#ffd23f;width:0}
#en i{background:#5be37d}
#cur{top:calc(8px + env(safe-area-inset-top,0px));right:8px;display:flex;gap:12px}
#qp{top:calc(52px + env(safe-area-inset-top,0px));right:8px;font-size:12px;font-weight:600;line-height:1.5;border-radius:14px;max-width:210px}
#npcchat{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(18px + env(safe-area-inset-bottom,0px));width:min(480px,92%);background:#fffdf5;color:#223;border-radius:18px;padding:10px 14px;display:none;align-items:flex-start;gap:10px;box-shadow:0 6px 18px #0005;z-index:5}
#npcchat.on{display:flex}
#npcav{width:44px;height:44px;border-radius:50%;background:#ffe3c2;display:flex;align-items:center;justify-content:center;font-size:26px;flex:none;border:3px solid #ff7a59}
.npcbody{flex:1;min-width:0}
#npcname{font-weight:800;font-size:13px;color:#c4502f}
#npcmsg{font-size:14px;line-height:1.45;margin:3px 0 6px}
#npcrep{display:flex;flex-wrap:wrap;gap:6px}
#npcrep button{border:0;border-radius:12px;padding:6px 12px;font-size:12.5px;font-weight:700;background:#e8f0ff;color:#223;box-shadow:0 2px 0 #b9c8ee}
#npcrep button.end{background:#ffd23f;box-shadow:0 2px 0 #c9a200}
#joy{position:fixed;left:30px;bottom:calc(26px + env(safe-area-inset-bottom,0px));width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,.35)}
#knob{position:absolute;left:35px;top:35px;width:50px;height:50px;border-radius:50%;background:rgba(255,255,255,.85)}
#toast{position:fixed;top:30%;left:50%;transform:translateX(-50%);background:#fff;color:#223;padding:10px 20px;border-radius:20px;font-weight:700;display:none;box-shadow:0 4px 14px #0004;text-align:center}
#modal{position:fixed;inset:0;background:#0007;display:none;align-items:center;justify-content:center;padding:10px}
#box{background:#fffdf5;color:#223;border-radius:22px;padding:16px 20px;width:min(560px,100%);max-height:96%;overflow:auto;text-align:center;touch-action:pan-y}
#box h2{margin:0 0 8px;font-size:20px}#box .q{font-size:22px;font-weight:800;margin:8px 0 12px}
.opts{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.opt,.btn{border:0;border-radius:14px;padding:11px 8px;font-size:16px;font-weight:700;background:#e8f0ff;color:#223;box-shadow:0 3px 0 #b9c8ee}
.opt.ok{background:#8be59b;box-shadow:0 3px 0 #4faa62}.opt.no{background:#ff9a9a;box-shadow:0 3px 0 #c55}
.btn{background:#ffd23f;box-shadow:0 3px 0 #c9a200;margin-top:10px}
.item{display:inline-block;margin:4px;padding:8px 12px;background:#e8f0ff;border-radius:12px;font-weight:700;font-size:14px}
.item.own{background:#c9f5d0}.item.eq{outline:3px solid #ff7a59}
#rot{position:fixed;inset:0;background:#223;color:#fff;display:none;align-items:center;justify-content:center;font-size:22px;text-align:center;padding:20px;z-index:9}
@media (orientation:portrait){#rot{display:flex}}
#cfg,#sched,#quit{position:fixed;top:calc(52px + env(safe-area-inset-top,0px));border:0;border-radius:20px;padding:6px 12px;background:rgba(30,40,70,.8);color:#fff;font-weight:700;font-size:13px}
#cfg{left:8px}#sched{left:104px}#quit{left:232px}
#clk{position:fixed;top:calc(86px + env(safe-area-inset-top,0px));left:8px;font-size:12px;z-index:2}
#bell{position:fixed;top:calc(8px + env(safe-area-inset-top,0px));left:50%;transform:translateX(-50%) translateY(52px);background:#ff7a59;color:#fff;border-radius:16px;padding:6px 14px;font-weight:800;font-size:13px;display:none;z-index:3;box-shadow:0 4px 0 #c4502f;max-width:90%;text-align:center}
.ttab{width:100%;border-collapse:collapse;font-size:13px;margin:8px 0;text-align:left}
.ttab th,.ttab td{padding:6px 8px;border-bottom:1px solid #eee}
.ttab tr.now{background:#fff3c4;font-weight:800}
.ttab tr.next{background:#e8f6ff}
.ttab .tag{display:inline-block;padding:2px 8px;border-radius:10px;background:#e8f0ff;font-size:11px}
.ttab .tag.exam{background:#ffe0d6}
textarea{width:100%;height:210px;font:11px/1.4 ui-monospace,Menlo,monospace;-webkit-user-select:text;user-select:text;touch-action:auto;border-radius:10px;border:2px solid #ccd;padding:8px;text-align:left}#er{color:#c0392b;font-weight:700;font-size:13px;min-height:18px}
`,P=e(t(),1),F=`<!DOCTYPE html>
<html lang="vi"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Trường Vui Vẻ</title>
<link rel="stylesheet" href="css/style.css">
</head><body>
<canvas id="c"></canvas>
<div class="pill" id="lv"><span id="lvt"></span><div id="bar"><i></i></div></div>
<div class="pill" id="cur"><span id="coin"></span><span id="gem"></span></div>
<div class="pill" id="qp"></div>
<div class="pill" id="en" style="top:calc(8px + env(safe-area-inset-top,0px));left:50%;transform:translateX(-50%);min-width:130px">⚡ Năng lượng<div id="bar2" style="height:7px;background:#fff3;border-radius:5px;margin-top:4px;overflow:hidden"><i style="display:block;height:100%;background:#5be37d;width:100%"></i></div></div>
<div class="pill" id="loc" style="top:calc(46px + env(safe-area-inset-top,0px));left:50%;transform:translateX(-50%);font-size:12px"></div>
<button id="cfg">⚙️ Dữ liệu</button>
<button id="sched" type="button">📅 Thời khóa biểu</button>
<button id="quit" type="button">← Thoát</button>
<div class="pill" id="clk">🕒 --:--</div>
<div id="bell"></div>
<div id="joy"><div id="knob"></div></div>
<div id="npcchat"><div id="npcav">🙂</div><div class="npcbody"><div id="npcname"></div><div id="npcmsg"></div><div id="npcrep"></div></div></div>
<div id="fd" style="position:fixed;inset:0;background:#000;opacity:0;pointer-events:none"></div><div id="toast"></div>
<div id="modal"><div id="box"></div></div>
<div id="rot">📱 Hãy xoay ngang điện thoại để chơi nhé!</div>

<!-- Thứ tự nạp file quan trọng: file sau dùng biến/hàm của file trước -->
<script src="js/core.js"><\/script>
<script src="data/questions.js"><\/script>
<script src="data/schedule.js"><\/script>
<script src="js/schedule.js"><\/script>
<script src="js/state.js"><\/script>
<script src="js/config.js"><\/script>
<script src="js/data.js"><\/script>
<script src="js/questions.js"><\/script>
<script src="js/ui.js"><\/script>
<script src="js/activities.js"><\/script>
<script src="js/settings.js"><\/script>
<script src="js/world.js"><\/script>
<script src="js/input.js"><\/script>
<script src="js/characters.js"><\/script>
<script src="js/avatar.js"><\/script>
<script src="js/sync.js"><\/script>
<script src="js/scenes.js"><\/script>
<script src="js/render.js"><\/script>
<script src="js/main.js"><\/script>
</body></html>
`,I={useRealTime:!0,simulateTime:null,demoMode:!1,earlyMinutes:5,graceMinutes:10,notifyBeforeMinutes:2,autoEnterClass:!0,allowFreePractice:!0,requireOnTimeForLesson:!0,schoolName:`Trường Vui Vẻ`,timetable:[{day:1,start:`07:30`,end:`08:15`,subject:`math`,type:`lesson`,title:`Toán`},{day:1,start:`08:20`,end:`09:05`,subject:`van`,type:`lesson`,title:`Ngữ văn`},{day:1,start:`09:15`,end:`10:00`,subject:`eng`,type:`lesson`,title:`Tiếng Anh`},{day:1,start:`10:10`,end:`10:55`,subject:`math`,type:`exam`,examId:`thi_toan_1`,title:`Kiểm tra Toán`},{day:2,start:`07:30`,end:`08:15`,subject:`eng`,type:`lesson`,title:`Tiếng Anh`},{day:2,start:`08:20`,end:`09:05`,subject:`math`,type:`lesson`,title:`Toán`},{day:2,start:`09:15`,end:`10:00`,subject:`van`,type:`lesson`,title:`Ngữ văn`},{day:2,start:`10:10`,end:`10:55`,subject:`eng`,type:`exam`,examId:`thi_anh_1`,title:`Bài thi Tiếng Anh`},{day:3,start:`07:30`,end:`08:15`,subject:`van`,type:`lesson`,title:`Ngữ văn`},{day:3,start:`08:20`,end:`09:05`,subject:`eng`,type:`lesson`,title:`Tiếng Anh`},{day:3,start:`09:15`,end:`10:00`,subject:`math`,type:`lesson`,title:`Toán`},{day:3,start:`10:10`,end:`10:55`,subject:`van`,type:`exam`,examId:`thi_van_1`,title:`Bài thi Ngữ văn`},{day:4,start:`07:30`,end:`08:15`,subject:`math`,type:`lesson`,title:`Toán`},{day:4,start:`08:20`,end:`09:05`,subject:`eng`,type:`lesson`,title:`Tiếng Anh`},{day:4,start:`09:15`,end:`10:00`,subject:`van`,type:`lesson`,title:`Ngữ văn`},{day:4,start:`10:10`,end:`10:55`,subject:`sci`,type:`lesson`,title:`Khoa học`},{day:5,start:`07:30`,end:`08:15`,subject:`eng`,type:`lesson`,title:`Tiếng Anh`},{day:5,start:`08:20`,end:`09:05`,subject:`van`,type:`lesson`,title:`Ngữ văn`},{day:5,start:`09:15`,end:`10:00`,subject:`math`,type:`lesson`,title:`Toán`},{day:5,start:`10:10`,end:`10:55`,subject:`math`,type:`exam`,examId:`thi_toan_2`,title:`Kiểm tra Toán giữa tuần`}]},L=n(),R=`school-mission`,z=`0 0 512 700`,B=[`js/core.js`,`data/questions.js`,`data/schedule.js`,`js/schedule.js`,`js/state.js`,`js/config.js`,`js/data.js`,`js/questions.js`,`js/ui.js`,`js/activities.js`,`js/settings.js`,`js/world.js`,`js/input.js`,`js/characters.js`,`js/avatar.js`,`js/sync.js`,`js/scenes.js`,`js/render.js`,`js/main.js`],V=Object.assign({"../games/school_mission/config.js":p,"../games/school_mission/data/questions.js":m,"../games/school_mission/data/schedule.js":h,"../games/school_mission/js/activities.js":g,"../games/school_mission/js/avatar.js":_,"../games/school_mission/js/characters.js":v,"../games/school_mission/js/config.js":y,"../games/school_mission/js/core.js":b,"../games/school_mission/js/data.js":x,"../games/school_mission/js/input.js":S,"../games/school_mission/js/main.js":C,"../games/school_mission/js/questions.js":w,"../games/school_mission/js/render.js":T,"../games/school_mission/js/scenes.js":E,"../games/school_mission/js/schedule.js":D,"../games/school_mission/js/settings.js":O,"../games/school_mission/js/state.js":k,"../games/school_mission/js/sync.js":A,"../games/school_mission/js/ui.js":j,"../games/school_mission/js/world.js":M}),H=Object.assign({"../games/school_mission/css/style.css":N});function U(e,t){let n=`/${t}/`;return Object.fromEntries(Object.entries(e).map(([e,t])=>{let r=e.replace(/\\/g,`/`),i=r.lastIndexOf(n);return[i>=0?r.slice(i+n.length):r.split(`/`).pop(),typeof t==`string`?t:t?.default||``]}))}var W=U(V,`school_mission`),G=U(H,`school_mission`);function K(e){return e.replace(/[.*+?^${}()|[\]\\]/g,`\\$&`)}function q(e){return JSON.stringify(e).replace(/</g,`\\u003c`).replace(/>/g,`\\u003e`).replace(/&/g,`\\u0026`).replace(/\u2028/g,`\\u2028`).replace(/\u2029/g,`\\u2029`)}function J(e,t){let n=null;return Promise.race([Promise.resolve(e).finally(()=>clearTimeout(n)),new Promise((e,r)=>{n=setTimeout(()=>r(Error(`timeout`)),t)})])}function Y(e){try{let t=c(e?.avatar,e?.pet),n=s(`avatar`,t.avatar.value);if(!n)return{avatarSvg:``,avatarViewBox:z};let r=n.match(/viewBox="([^"]+)"/i)?.[1]||z;return{avatarSvg:n.replace(/^<svg[^>]*>/i,``).replace(/<\/svg>\s*$/i,``),avatarViewBox:r}}catch{return{avatarSvg:``,avatarViewBox:z}}}function X(){let e=(0,P.useRef)(null),{user:t,token:n}=o(),[s,c]=(0,P.useState)(null),p=t?.name||t?.fullName||t?.username||`Bạn`;(0,P.useEffect)(()=>{let e=!1;return(async()=>{let t=typeof navigator>`u`||navigator.onLine!==!1,a=null,o=null;if(n&&t){let[e,t]=await Promise.allSettled([J(r.me(),2500),J(i.getGame(R),2500)]);e.status===`fulfilled`&&(a=e.value),t.status===`fulfilled`&&(o=t.value?.gameState||null)}e||c({...Y(a),savedState:o,playerName:p})})(),()=>{e=!0}},[n,p]),(0,P.useEffect)(()=>{if(n)return u()},[n]),(0,P.useEffect)(()=>{let t=t=>{if(t.source!==e.current?.contentWindow)return;let r=t.data;!r||typeof r!=`object`||(r.type===`quit`?l(`/`):r.type===`school-save`?n&&f(r.data):r.type===`school-ready`?n&&d():r.type===`school-exam-result`&&n&&r.data&&a.create({gameId:R,...r.data}).catch(()=>{}))};return window.addEventListener(`message`,t),()=>window.removeEventListener(`message`,t)},[n]);let m=(0,P.useMemo)(()=>{if(!s)return``;let e=F,t=G[`css/style.css`]||``;t&&(e=e.replace(/<link[^>]*href=["']css\/style\.css["'][^>]*>/i,()=>`<style>\n${t}\n</style>`));let n=`<script>window.__SCHOOL_INIT__=${q(s)};<\/script>`;e=e.replace(/<script\s+src=["']js\/core\.js["']\s*><\/script>/i,e=>`${n}\n${e}`);for(let t of B){let n=W[t];if(!n)continue;let r=t===`js/schedule.js`?`<script>window.__SCHOOL_CONFIG__=${q(I)};<\/script>\n`:``,i=RegExp(`<script\\s+src=["']${K(t)}["']\\s*><\\/script>`,`i`);e=e.replace(i,()=>`${r}<script>\n${n}\n<\/script>`)}return e},[s]);return m?(0,L.jsxs)(`div`,{className:`fixed inset-0 bg-[#7ccf6b]`,children:[(0,L.jsx)(`button`,{type:`button`,onClick:()=>l(`/`),className:`absolute top-3 left-3 z-20 rounded-full bg-white/90 px-3 py-1.5 text-sm font-extrabold text-slate-700 shadow hover:bg-white`,"aria-label":`Về trang chủ`,children:`← Trang chủ`}),(0,L.jsx)(`iframe`,{ref:e,title:`Trường Vui Vẻ`,srcDoc:m,sandbox:`allow-scripts allow-same-origin`,className:`h-full w-full border-0`})]}):(0,L.jsx)(`div`,{className:`fixed inset-0 grid place-items-center bg-[#7ccf6b]`,children:(0,L.jsx)(`p`,{className:`rounded-full bg-white/90 px-5 py-2 text-sm font-extrabold text-slate-700 shadow`,children:`Đang tải Trường Vui Vẻ...`})})}export{X as default};