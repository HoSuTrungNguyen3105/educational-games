import{o as e}from"./rolldown-runtime-C0FnF6B9.js";import{n as t,t as n}from"./jsx-runtime-CKeovgl0.js";import{M as r,_ as i,l as a,p as o}from"./api-gdU94oSS.js";import{t as s}from"./userAuth.store-CXNfd-M1.js";import{i as c,l,n as ee,r as u,s as d,yn as f}from"./index-DEQy-sCF.js";var p=`/**\r
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
            const bonus = scoreBonus(ok, N, "lesson:" + type);
            modal(\`
                <h2>\${d.title}</h2>
                <div class="q">Đúng \${ok}/\${N} câu 🎯</div>
                <p>+\${c} 🪙 &nbsp; +\${x} XP</p>
                \${bonus ? \`<p style="color:#0a7d3c;font-weight:800">\${bonus}</p>\` : ""}
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
            prog("read");
            const bonus = scoreBonus(ok, N, "read");
            modal(\`
                <h2>📚 Đọc sách vui vẻ</h2>
                <div class="q">Đúng \${ok}/\${N} câu 🎯</div>
                <p>+\${c} 🪙 &nbsp; +\${x} XP — Đọc sách mỗi ngày nhé!</p>
                \${bonus ? \`<p style="color:#0a7d3c;font-weight:800">\${bonus}</p>\` : ""}
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

        // Điểm cao (≥80%) → coin thật vào ví; cộng luôn tiến độ nhiệm vụ thi cử.
        const bonus = scoreBonus(ok, qs.length, "exam:" + e.id);
        if (pc >= 80) prog("exam");

        r.best = Math.max(r.best, pc);
        r.pass = r.pass || pass;
        S.exam[e.id] = r;
        save();
        reportExam(e, pc, pass, ok, qs, startedAt);

        modal(\`
            <h2>\${e.title}</h2>
            <div class="q">\${ok}/\${qs.length} câu • \${pc}% \${pass ? "🎉 ĐẠT" : "😢 Chưa đạt"}</div>
            <p>\${msg || (pass ? "" : "Cần đạt " + pp + "% — cố lên!")}</p>
            \${bonus ? \`<p style="color:#0a7d3c;font-weight:800">\${bonus}</p>\` : ""}
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
}`,_=`// ===== CHARACTERS: hàm vẽ cơ bản và vẽ nhân vật =====
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
`,te=`// ===== CONFIG: địa điểm sân trường, các lớp học, bàn ghế, NPC, cửa hàng, nhiệm vụ ngày =====
const P=[
{id:"shop",n:"🛍️ Cửa hàng",x:1950,y:140,w:260,h:220,c:"#f08fb0",r:"#c4437a",b:1},
{id:"can",n:"🍔 Căng tin",x:160,y:880,w:320,h:260,c:"#f5d76e",r:"#d4a017",b:1},
{id:"garden",n:"🌸 Vườn trường",x:580,y:860,w:460,h:360,c:"#9be07a",lv:1},
{id:"pet",n:"🐾 Vườn thú cưng",x:1360,y:860,w:500,h:360,c:"#ffe082",lv:1}];
const RM={math:{n:"Lớp Toán",f:"#eed9a8",b:"Hôm nay: Phép nhân ×",t:"Cô Hoa",c:"#ff6b9d",e:"🧮"},eng:{n:"Lớp Tiếng Anh",f:"#cfe6f7",b:"Good morning, class!",t:"Thầy Nam",c:"#4a90e2",e:"🔤"},sci:{n:"Phòng Khoa học",f:"#d6f0d9",b:"H₂O  •  CO₂  •  O₂",t:"Cô Lan",c:"#2fb583",e:"🧪"},van:{n:"Lớp Ngữ văn",f:"#f3d9e6",b:"Từ đồng nghĩa - trái nghĩa",t:"Thầy Minh",c:"#a55eea",e:"📖"},lib:{n:"Thư viện",f:"#f7ecd2",b:"📚 Đọc sách mỗi ngày!",t:"Chú Thủ thư",c:"#e67e22",e:"📚"}};
const KS=["math","eng","sci","van"],DX={math:300,eng:650,sci:1000,van:1350,lib:520};
const KS2=["lib"]; // các phòng ở tầng 2
// 10 bàn học (2 hàng × 5 bàn) — cả 10 chỗ đều có bạn ngồi
const desks=[];for(let j=0;j<2;j++)for(let i=0;i<5;i++)desks.push([110+i*170,320+j*100]);
const cols=["#ff6b9d","#6bcbff","#b28dff","#7be0a0","#ffd23f","#ff8a5b","#4ecdc4","#e84393","#f368e0","#00d2d3","#ff9f43","#54a0ff","#10ac84","#a55eea"];
const nm=["Mít","Bơ","Na","Su","Kem","Bin","Mun","Tôm","Đậu","Cà","Ớt","Xoài","Bí","Mía"];
const hs=["🎓","🎀","🧢","🌸","","👑","","🎓","🎀","🧢","","🌸","👑",""];
const studs=desks.map((d,i)=>({x:d[0]+45,y:d[1]+14,c:cols[i%cols.length],n:nm[i],on:i!=2&&i!=5&&i!=8}));
// 14 bạn học sinh chạy khắp sân + hành lang
const npcs=nm.map((n,i)=>({
 n,sc:i<8?"out":i<12?"hall":"out",
 b:i<8?[200,600,2000,650]:[150,215,1400,170],
 x:300+Math.random()*1800,y:i<8?620+Math.random()*450:260+Math.random()*100,
 tx:0,ty:0,c:cols[i],h:hs[i],say:0,t:Math.random()*5,mv:0
}));
const hatShop=[["",0],["🎓",30],["🎀",40],["🧢",30],["🌸",50],["👑",120]],colShop=[["#ff9f43",0],["#54a0ff",20],["#ee5a6f",20],["#10ac84",20],["#a55eea",20],["#2d3436",35]];
const QU=[{k:"math",t:"Đúng 5 bài Toán",n:5,c:40,g:1},{k:"eng",t:"Học 5 từ Tiếng Anh",n:5,c:40,g:1},{k:"sci",t:"Đúng 5 câu Khoa học",n:5,c:50,g:2},{k:"van",t:"Đúng 5 câu Ngữ văn",n:5,c:50,g:2},{k:"flower",t:"Thu hoạch 6 cây trồng",n:6,c:60,g:2},{k:"read",t:"Đọc 3 truyện Thư viện",n:3,c:40,g:1},{k:"exam",t:"Thi đạt ≥80%",n:1,c:60,g:2},{k:"chat",t:"Nói chuyện 3 bạn",n:3,c:30,g:1}];
`,v=`// ===== CORE: canvas, hàm tiện ích $ và sh (xáo trộn), tự co giãn màn hình =====
const cv=document.getElementById("c"),g=cv.getContext("2d");
const $=id=>document.getElementById(id);
let W=0,H=0,dpr=1;
function rs(){dpr=Math.min(2,devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr}
addEventListener("resize",rs);rs();
const sh=a=>a.map(x=>x).sort(()=>Math.random()-.5);
`,y=`// ===== DATA: nạp + kiểm tra dữ liệu câu hỏi/bài thi (mặc định từ data/questions.js, hoặc bản bạn sửa trong game) =====
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
`,b=`// ===== GARDEN: Vườn trường — đồng bộ toàn bộ logic từ GardenPage.jsx =====
// Bao gồm: Trồng cây, Tưới nước, Bón phân, Thu hoạch (cộng coin vào gq_coin_wallet_v1),
// Cửa hàng hạt giống, Kho đồ vật phẩm, và Giải toán nhận nước.

(function () {
  /* ============================================================
     CẤU HÌNH CÂY TRỒNG & VẬT PHẨM (Khớp 100% GardenPage.jsx)
  ============================================================ */
  const PLANT_CONFIG = {
    sunflower: {
      name: "Hoa hướng dương",
      kind: "bloom",
      stageCount: 3,
      growthTime: 5 * 60 * 1000, // 5 phút
      harvestCoin: 20,
      seedPrice: 5,
      rarity: "common",
      icon: "🌻",
      desc: "Hoa rực rỡ dưới nắng ấm",
      stages: ["🌱", "🌿", "🌻"]
    },
    apple: {
      name: "Cây táo",
      kind: "fruitTree",
      stageCount: 4,
      growthTime: 30 * 60 * 1000, // 30 phút
      harvestCoin: 50,
      seedPrice: 15,
      rarity: "common",
      icon: "🍎",
      desc: "Quả táo ngọt mọng nước",
      stages: ["🌱", "🌿", "🌳", "🍎"]
    },
    cherry: {
      name: "Cây anh đào",
      kind: "bloom",
      stageCount: 3,
      growthTime: 2 * 60 * 60 * 1000, // 2 giờ
      harvestCoin: 120,
      seedPrice: 40,
      rarity: "rare",
      icon: "🌸",
      desc: "Cánh hoa hồng phấn dịu dàng",
      stages: ["🌱", "🌿", "🌸"]
    },
    oak: {
      name: "Cây cổ thụ",
      kind: "fruitTree",
      stageCount: 3,
      growthTime: 12 * 60 * 60 * 1000, // 12 giờ
      harvestCoin: 500,
      seedPrice: 150,
      rarity: "epic",
      icon: "🌳",
      desc: "Cổ thụ che bóng mát sân trường",
      stages: ["🌱", "🌿", "🌳"]
    },
    magic: {
      name: "Cây thần kỳ",
      kind: "aura",
      stageCount: 4,
      growthTime: 24 * 60 * 60 * 1000, // 24 giờ
      harvestCoin: 1000,
      seedPrice: 400,
      rarity: "legendary",
      icon: "✨",
      desc: "Cây phép thuật phát sáng lung linh",
      stages: ["🌱", "🌿", "🔮", "✨"]
    }
  };

  const RARITY_BADGE = {
    common: { bg: "#EEF0EC", text: "#556050", label: "Thường" },
    rare: { bg: "#E4EEFA", text: "#2A6496", label: "Hiếm" },
    epic: { bg: "#F0E6FA", text: "#7A3DA8", label: "Sử thi" },
    legendary: { bg: "#FCEFD6", text: "#B87010", label: "Huyền thoại" }
  };

  const ITEM_CONFIG = {
    basic_fertilizer: { name: "Phân bón thường", type: "consumable", price: 20, boost: 15, desc: "Thúc cây lớn nhanh +15%", icon: "🌱" },
    premium_fertilizer: { name: "Phân bón cao cấp", type: "consumable", price: 55, boost: 40, desc: "Thúc cây lớn nhanh +40%", icon: "🌟" },
    miracle_fertilizer: { name: "Phân bón thần kỳ", type: "consumable", price: 150, boost: 100, desc: "Cây chín ngay lập tức!", icon: "✨" },
    golden_can: { name: "Bình tưới vàng", type: "upgrade", price: 300, boost: 20, desc: "Tưới nước tăng +20% vĩnh viễn", icon: "🪙" }
  };

  const MATH_QUESTIONS = [
    { q: "12 + 8 = ?", o: ["18", "20", "22", "19"], a: 1 },
    { q: "15 - 7 = ?", o: ["9", "8", "7", "6"], a: 1 },
    { q: "6 × 7 = ?", o: ["42", "48", "36", "44"], a: 0 },
    { q: "56 ÷ 8 = ?", o: ["6", "8", "7", "9"], a: 2 },
    { q: "25 + 37 = ?", o: ["60", "62", "58", "64"], a: 1 },
    { q: "81 ÷ 9 = ?", o: ["8", "9", "7", "10"], a: 1 },
    { q: "14 × 3 = ?", o: ["40", "42", "38", "44"], a: 1 },
    { q: "100 - 45 = ?", o: ["50", "55", "60", "45"], a: 1 },
    { q: "9 × 9 = ?", o: ["81", "72", "90", "89"], a: 0 },
    { q: "72 ÷ 6 = ?", o: ["11", "13", "12", "14"], a: 2 }
  ];

  const WATER_MAX = 50;
  const WATER_REGEN_MS = 5 * 60 * 1000;
  const TOTAL_SLOTS = 6;

  /* ============================================================
     LƯU TRỮ VÀ TÍNH TOÁN TIẾN ĐỘ THỜI GIAN THỰC
  ============================================================ */
  function loadGardenSlots() {
    try {
      const raw = localStorage.getItem("school_garden_slots_v1");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length === TOTAL_SLOTS) return parsed;
      }
    } catch (e) {}
    const init = [];
    for (let i = 0; i < TOTAL_SLOTS; i++) {
      init.push({ index: i, plant: null });
    }
    return init;
  }

  function saveGardenSlots(slots) {
    try {
      localStorage.setItem("school_garden_slots_v1", JSON.stringify(slots));
    } catch (e) {}
  }

  function loadGardenInventory() {
    try {
      const raw = localStorage.getItem("school_garden_inv_v1");
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { basic_fertilizer: 1, premium_fertilizer: 0, miracle_fertilizer: 0, golden_can: 0 };
  }

  function saveGardenInventory(inv) {
    try {
      localStorage.setItem("school_garden_inv_v1", JSON.stringify(inv));
    } catch (e) {}
  }

  function loadWaterDrops() {
    try {
      const r = localStorage.getItem("school_garden_water_v1");
      return r !== null ? Math.min(WATER_MAX, Math.max(0, Number(r) || 0)) : 10;
    } catch (e) {
      return 10;
    }
  }

  function saveWaterDrops(n) {
    try {
      localStorage.setItem("school_garden_water_v1", String(Math.min(WATER_MAX, Math.max(0, n))));
    } catch (e) {}
  }

  function checkWaterRegen() {
    try {
      const last = Number(localStorage.getItem("school_garden_last_water_regen")) || Date.now();
      const now = Date.now();
      const elapsed = now - last;
      if (elapsed >= WATER_REGEN_MS) {
        const added = Math.floor(elapsed / WATER_REGEN_MS);
        if (added > 0) {
          const current = loadWaterDrops();
          const next = Math.min(WATER_MAX, current + added);
          saveWaterDrops(next);
          localStorage.setItem("school_garden_last_water_regen", String(now - (elapsed % WATER_REGEN_MS)));
        }
      }
    } catch (e) {}
  }

  function formatTime(ms) {
    if (ms <= 0) return "Sẵn sàng!";
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    const h = Math.floor(m / 60);
    if (h > 0) return \`\${h}h \${m % 60}m\`;
    return \`\${m}p \${s < 10 ? "0" : ""}\${s}s\`;
  }

  function getPlantStatus(slot) {
    if (!slot || !slot.plant) return { progress: 0, remainingMs: 0, isReady: false, stageIdx: 0, cfg: null };
    const cfg = PLANT_CONFIG[slot.plant.plantType];
    if (!cfg) return { progress: slot.plant.progress || 0, remainingMs: 0, isReady: true, stageIdx: 0, cfg: null };

    if (slot.plant.isReady || (slot.plant.progress || 0) >= 100) {
      return { progress: 100, remainingMs: 0, isReady: true, stageIdx: cfg.stageCount - 1, cfg };
    }

    const baseProgress = slot.plant.progress || 0;
    const elapsed = Date.now() - (slot.plant.updatedAt || slot.plant.plantedAt || Date.now());
    const growth = (elapsed / cfg.growthTime) * 100;
    const progress = Math.min(100, baseProgress + growth);
    const isReady = progress >= 100;
    const remainingMs = Math.max(0, cfg.growthTime * (1 - progress / 100));

    // Tính stage icon
    const stageIdx = Math.min(cfg.stageCount - 1, Math.floor((progress / 100) * cfg.stageCount));
    return { progress, remainingMs, isReady, stageIdx, cfg };
  }

  /* ============================================================
     STYLE CSS CHO VƯỜN TRƯỜNG
  ============================================================ */
  function injectGardenStyle() {
    if (document.getElementById("garden-custom-css")) return;
    const style = document.createElement("style");
    style.id = "garden-custom-css";
    style.textContent = \`
      .gdn-wrap {
        display: flex;
        flex-direction: column;
        gap: 12px;
        text-align: left;
        max-width: 580px;
        margin: 0 auto;
        color: #2c3e50;
      }
      .gdn-hud {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
        border: 2px solid #81c784;
        border-radius: 16px;
        padding: 8px 14px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.06);
      }
      .gdn-hud-stats {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
      }
      .gdn-badge {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        background: #fff;
        border: 1.5px solid #a5d6a7;
        padding: 4px 10px;
        border-radius: 12px;
        font-weight: 800;
        font-size: 13.5px;
        color: #2e7d32;
      }
      .gdn-btn-sm {
        background: #4caf50;
        color: #fff;
        border: none;
        border-radius: 10px;
        padding: 4px 8px;
        font-weight: 700;
        font-size: 11.5px;
        cursor: pointer;
        box-shadow: 0 2px 0 #2e7d32;
        transition: transform .1s;
      }
      .gdn-btn-sm:active {
        transform: translateY(2px);
        box-shadow: none;
      }
      .gdn-actions {
        display: flex;
        gap: 8px;
      }
      .gdn-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 10px;
      }
      .gdn-plot {
        background: #fffdf5;
        border: 2px solid #bcaaa4;
        border-radius: 16px;
        padding: 10px;
        text-align: center;
        position: relative;
        box-shadow: 0 4px 0 #a1887f;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 140px;
        transition: transform .15s, border-color .15s;
      }
      .gdn-plot.empty {
        background: #fbf7ee;
        border-style: dashed;
        cursor: pointer;
      }
      .gdn-plot.empty:hover {
        background: #f1f8e9;
        border-color: #4caf50;
        transform: translateY(-2px);
      }
      .gdn-plot.ready {
        border-color: #ffd54f;
        background: linear-gradient(180deg, #fffde7, #fff9c4);
        box-shadow: 0 4px 0 #fbc02d, 0 0 14px rgba(255, 213, 79, 0.4);
        animation: gdnPulse 1.8s infinite;
      }
      @keyframes gdnPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
      }
      .gdn-plant-icon {
        font-size: 38px;
        line-height: 1;
        margin: 4px 0;
        user-select: none;
      }
      .gdn-plant-name {
        font-weight: 800;
        font-size: 13px;
        color: #37474f;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .gdn-pbar {
        height: 6px;
        background: #e0e0e0;
        border-radius: 4px;
        overflow: hidden;
        margin: 6px 0 4px;
      }
      .gdn-pbar-fill {
        height: 100%;
        background: linear-gradient(90deg, #81c784, #4caf50);
        transition: width .3s;
      }
      .gdn-pbar-ready {
        background: linear-gradient(90deg, #ffca28, #ffa000);
      }
      .gdn-time {
        font-size: 11px;
        font-weight: 700;
        color: #78909c;
      }
      .gdn-btn-row {
        display: flex;
        gap: 5px;
        margin-top: 6px;
      }
      .gdn-btn-action {
        flex: 1;
        border: none;
        border-radius: 10px;
        padding: 5px 4px;
        font-size: 11px;
        font-weight: 800;
        cursor: pointer;
        transition: transform .1s;
      }
      .gdn-btn-water {
        background: #42a5f5;
        color: #fff;
        box-shadow: 0 2px 0 #1e88e5;
      }
      .gdn-btn-fert {
        background: #66bb6a;
        color: #fff;
        box-shadow: 0 2px 0 #43a047;
      }
      .gdn-btn-harvest {
        background: #ffa726;
        color: #fff;
        box-shadow: 0 2px 0 #fb8c00;
        width: 100%;
        font-size: 12.5px;
        padding: 7px;
      }
      .gdn-btn-remove {
        background: #ef5350;
        color: #fff;
        box-shadow: 0 2px 0 #e53935;
        width: 24px;
        padding: 0;
        flex: none;
      }
      .gdn-btn-action:active {
        transform: translateY(2px);
        box-shadow: none;
      }
      .gdn-modal-sub {
        background: #fff;
        border: 2px solid #81c784;
        border-radius: 18px;
        padding: 14px;
        margin-top: 8px;
      }
      .gdn-item-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #f9fbe7;
        border: 1.5px solid #dce775;
        border-radius: 12px;
        padding: 8px 10px;
        margin-bottom: 8px;
        gap: 10px;
      }
      .gdn-tag {
        font-size: 10px;
        border-radius: 4px;
        padding: 1px 5px;
        font-weight: 700;
      }
    \`;
    document.head.appendChild(style);
  }

  /* ============================================================
     QUẢN LÝ TRẠNG THÁI GIAO DIỆN VƯỜN TRƯỜNG
  ============================================================ */
  let activeView = "main"; // "main" | "shop" | "inv" | "quiz"
  let gardenSlots = loadGardenSlots();
  let gardenInv = loadGardenInventory();
  let selectedSlotIndex = null;
  let gardenTimer = null;
  let currentQuiz = null;

  function refreshData() {
    checkWaterRegen();
    gardenSlots = loadGardenSlots();
    gardenInv = loadGardenInventory();
  }

  // Cập nhật hiển thị số coin trên giao diện nếu modal vườn đang mở
  window.updateGardenWalletHUD = function () {
    const el = document.getElementById("gdn-coin-val");
    if (el) el.textContent = S.coins.toLocaleString();
  };

  /* ============================================================
     HÀNH ĐỘNG: TRỒNG, TƯỚI, BÓN PHÂN, THU HOẠCH, NHỔ BỎ
  ============================================================ */
  function doPlantSeed(slotIdx, plantType) {
    const cfg = PLANT_CONFIG[plantType];
    if (!cfg) return;

    if (S.coins < cfg.seedPrice) {
      toast("🪙 Không đủ coin để mua hạt giống!");
      return;
    }

    // Trừ coin ví
    S.coins -= cfg.seedPrice;
    save(); // Lưu vào gq_coin_wallet_v1

    const now = Date.now();
    gardenSlots[slotIdx].plant = {
      plantType,
      progress: 0,
      plantedAt: now,
      updatedAt: now,
      isReady: false
    };
    saveGardenSlots(gardenSlots);

    toast(\`🌱 Đã gieo \${cfg.name}! (-\${cfg.seedPrice} 🪙)\`);
    activeView = "main";
    renderGardenModal();
  }

  function doWaterPlant(slotIdx) {
    const water = loadWaterDrops();
    if (water <= 0) {
      toast("💧 Hết nước! Hãy giải đố toán học để nhận nước nhé!");
      activeView = "quiz";
      renderGardenModal();
      return;
    }

    const slot = gardenSlots[slotIdx];
    if (!slot || !slot.plant) return;

    const st = getPlantStatus(slot);
    if (st.isReady) {
      toast("🎉 Cây đã chín! Hãy thu hoạch đi nào!");
      return;
    }

    // Tiêu 1 giọt nước
    saveWaterDrops(water - 1);

    // Tính lượng boost: nếu có bình tưới vàng => +20%, bình thường => +10%
    const boost = (gardenInv.golden_can || 0) > 0 ? 20 : 10;
    const nextProgress = Math.min(100, st.progress + boost);

    slot.plant.progress = nextProgress;
    slot.plant.updatedAt = Date.now();
    slot.plant.isReady = nextProgress >= 100;
    saveGardenSlots(gardenSlots);

    pop(\`+\${boost}% 💧\`);
    toast(\`💧 Đã tưới nước! (+\${boost}% lớn nhanh)\`);
    renderGardenModal();
  }

  function doFertilizerPlant(slotIdx, itemId) {
    const item = ITEM_CONFIG[itemId];
    if (!item) return;

    const count = gardenInv[itemId] || 0;
    if (count <= 0) {
      toast("🎒 Hết phân bón này rồi! Vào kho đồ mua thêm nhé!");
      return;
    }

    const slot = gardenSlots[slotIdx];
    if (!slot || !slot.plant) return;

    const st = getPlantStatus(slot);
    if (st.isReady) {
      toast("🎉 Cây đã chín rồi!");
      return;
    }

    gardenInv[itemId] = count - 1;
    saveGardenInventory(gardenInv);

    const boost = item.boost;
    const nextProgress = Math.min(100, st.progress + boost);
    slot.plant.progress = nextProgress;
    slot.plant.updatedAt = Date.now();
    slot.plant.isReady = nextProgress >= 100;
    saveGardenSlots(gardenSlots);

    pop(\`+\${boost}% 🌱\`);
    toast(\`✨ Bón \${item.name}! Cây tăng +\${boost}%!\`);
    renderGardenModal();
  }

  function doHarvestPlant(slotIdx) {
    const slot = gardenSlots[slotIdx];
    if (!slot || !slot.plant) return;

    const st = getPlantStatus(slot);
    if (!st.isReady) {
      toast("⏳ Cây chưa chín, hãy tưới nước thêm nhé!");
      return;
    }

    const reward = st.cfg ? st.cfg.harvestCoin : 20;

    // Cộng coin vào ví
    S.coins += reward;
    S.xp += 15;
    save(); // Lưu ngay vào gq_coin_wallet_v1

    // Làm sạch ô đất
    slot.plant = null;
    saveGardenSlots(gardenSlots);

    pop(\`+\${reward}🪙 +15XP\`);
    toast(\`🎉 Thu hoạch \${st.cfg.name}! Nhận +\${reward} 🪙 và +15 XP!\`);
    renderGardenModal();
  }

  function doRemovePlant(slotIdx) {
    if (!confirm("Bạn có chắc muốn nhổ bỏ cây này để lấy lại đất trồng không?")) return;
    const slot = gardenSlots[slotIdx];
    if (slot) {
      slot.plant = null;
      saveGardenSlots(gardenSlots);
      toast("Đã dọn sạch ô đất!");
      renderGardenModal();
    }
  }

  function doBuyItem(itemId) {
    const item = ITEM_CONFIG[itemId];
    if (!item) return;

    if (item.type === "upgrade" && (gardenInv[itemId] || 0) > 0) {
      toast("Bạn đã sở hữu nâng cấp này rồi!");
      return;
    }

    if (S.coins < item.price) {
      toast("🪙 Không đủ coin để mua vật phẩm này!");
      return;
    }

    S.coins -= item.price;
    save();

    gardenInv[itemId] = (gardenInv[itemId] || 0) + 1;
    saveGardenInventory(gardenInv);

    toast(\`✅ Đã mua \${item.name}! (-\${item.price} 🪙)\`);
    renderGardenModal();
  }

  function pickRandomQuiz() {
    currentQuiz = MATH_QUESTIONS[Math.floor(Math.random() * MATH_QUESTIONS.length)];
  }

  function answerQuiz(idx) {
    if (!currentQuiz) return;
    if (idx === currentQuiz.a) {
      const current = loadWaterDrops();
      saveWaterDrops(current + 1);
      pop("+1 💧");
      toast("✅ Chính xác! Bạn nhận được +1 giọt nước 💧!");
      pickRandomQuiz();
      renderGardenModal();
    } else {
      toast("❌ Chưa đúng rồi! Thử lại câu khác nhé!");
      pickRandomQuiz();
      renderGardenModal();
    }
  }

  /* ============================================================
     RENDER GIAO DIỆN MODAL VƯỜN TRƯỜNG
  ============================================================ */
  function renderGardenModal() {
    injectGardenStyle();
    refreshData();

    const water = loadWaterDrops();
    const plantedCount = gardenSlots.filter(s => s.plant).length;

    let html = \`
      <div class="gdn-wrap">
        <!-- HEADER HUD -->
        <div class="gdn-hud">
          <div class="gdn-hud-stats">
            <span style="font-size:22px;">🌸</span>
            <div>
              <div style="font-weight:900;font-size:16px;color:#1b5e20;">VƯỜN TRƯỜNG VUI VẺ</div>
              <div style="font-size:11.5px;color:#455a64;">Trồng cây, thu hoạch & nhận coin tài khoản!</div>
            </div>
          </div>
          <div class="gdn-actions">
            <button class="gdn-btn-sm" style="background:#f57c00;" onclick="window.petGarden()">🐾 Thú cưng</button>
            <button class="gdn-btn-sm" style="background:#546e7a;" onclick="window.closeGardenModal()">✕ Đóng</button>
          </div>
        </div>

        <!-- THANH CHỈ SỐ -->
        <div style="display:flex;justify-content:space-between;align-items:center;background:#fff;padding:8px 12px;border-radius:14px;border:1.5px solid #cfd8dc;">
          <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
            <span class="gdn-badge">🪙 <b id="gdn-coin-val">\${S.coins.toLocaleString()}</b> Coin</span>
            <span class="gdn-badge">💧 <b>\${water}</b>/\${WATER_MAX}</span>
            <button class="gdn-btn-sm" style="background:#29b6f6;" onclick="window.setGardenView('quiz')">➕ Nhận nước</button>
            <span class="gdn-badge" style="color:#5d4037;">🌱 <b>\${plantedCount}</b>/\${TOTAL_SLOTS} ô</span>
          </div>
          <div style="display:flex;gap:6px;">
            <button class="gdn-btn-sm" style="background:#8bc34a;" onclick="window.setGardenView('shop')">🌾 Mua hạt</button>
            <button class="gdn-btn-sm" style="background:#ab47bc;" onclick="window.setGardenView('inv')">🎒 Kho đồ</button>
          </div>
        </div>
    \`;

    // VIEW: CỬA HÀNG HẠT GIỐNG
    if (activeView === "shop") {
      html += \`
        <div class="gdn-modal-sub">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <b style="font-size:15px;color:#2e7d32;">🌾 CỬA HÀNG HẠT GIỐNG</b>
            <button class="gdn-btn-sm" style="background:#78909c;" onclick="window.setGardenView('main')">← Về vườn</button>
          </div>
          <p style="font-size:12px;color:#607d8b;margin:0 0 10px;">Chọn hạt giống để gieo vào \${selectedSlotIndex !== null ? \`ô đất số \${selectedSlotIndex + 1}\` : "ô đất trống"}:</p>
          <div style="display:flex;flex-direction:column;gap:8px;">
      \`;

      Object.entries(PLANT_CONFIG).forEach(([type, c]) => {
        const canAfford = S.coins >= c.seedPrice;
        const badge = RARITY_BADGE[c.rarity] || RARITY_BADGE.common;
        html += \`
          <div class="gdn-item-card" style="opacity:\${canAfford ? '1' : '0.6'};">
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="font-size:28px;">\${c.icon}</span>
              <div>
                <div style="font-weight:800;font-size:13.5px;">\${c.name} <span class="gdn-tag" style="background:\${badge.bg};color:\${badge.text}">\${badge.label}</span></div>
                <div style="font-size:11px;color:#546e7a;">⏰ \${formatTime(c.growthTime)} · Thu hoạch: <b>+\${c.harvestCoin} 🪙</b></div>
              </div>
            </div>
            <button class="gdn-btn-sm" style="background:\${canAfford ? '#43a047' : '#9e9e9e'};padding:6px 12px;font-size:12px;"
              \${canAfford ? \`onclick="window.plantSeedTarget('\${type}')"\` : 'disabled'}>
              🌾 \${c.seedPrice} 🪙
            </button>
          </div>
        \`;
      });

      html += \`</div></div>\`;
    }
    // VIEW: KHO ĐỒ / BÓN PHÂN
    else if (activeView === "inv") {
      html += \`
        <div class="gdn-modal-sub">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <b style="font-size:15px;color:#6a1b9a;">🎒 KHO ĐỒ & PHÂN BÓN</b>
            <button class="gdn-btn-sm" style="background:#78909c;" onclick="window.setGardenView('main')">← Về vườn</button>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;">
      \`;

      Object.entries(ITEM_CONFIG).forEach(([itemId, item]) => {
        const count = gardenInv[itemId] || 0;
        const isUpgrade = item.type === "upgrade";
        const canBuy = !isUpgrade && S.coins >= item.price;
        const canBuyUpgrade = isUpgrade && count === 0 && S.coins >= item.price;

        html += \`
          <div class="gdn-item-card">
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="font-size:26px;">\${item.icon}</span>
              <div>
                <div style="font-weight:800;font-size:13.5px;">\${item.name} \${!isUpgrade ? \`<span style="color:#2e7d32;">(x\${count})</span>\` : ""}</div>
                <div style="font-size:11px;color:#546e7a;">\${item.desc}</div>
              </div>
            </div>
            <div>
              \${isUpgrade
                ? count > 0
                  ? \`<span class="gdn-tag" style="background:#c8e6c9;color:#2e7d32;font-size:12px;">Đã sở hữu ✅</span>\`
                  : \`<button class="gdn-btn-sm" style="background:#e91e63;" \${canBuyUpgrade ? \`onclick="window.buyGardenItem('\${itemId}')"\` : "disabled"}>Mua \${item.price} 🪙</button>\`
                : \`<button class="gdn-btn-sm" style="background:#8e24aa;" \${canBuy ? \`onclick="window.buyGardenItem('\${itemId}')"\` : "disabled"}>Mua \${item.price} 🪙</button>\`
              }
            </div>
          </div>
        \`;
      });

      html += \`</div></div>\`;
    }
    // VIEW: GIẢI TOÁN NHẬN NƯỚC (QUIZ)
    else if (activeView === "quiz") {
      if (!currentQuiz) pickRandomQuiz();
      html += \`
        <div class="gdn-modal-sub" style="text-align:center;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <b style="font-size:15px;color:#0288d1;">💧 GIẢI TOÁN NHẬN NƯỚC TƯỚI CÂY</b>
            <button class="gdn-btn-sm" style="background:#78909c;" onclick="window.setGardenView('main')">← Về vườn</button>
          </div>
          <p style="font-size:12px;color:#546e7a;margin:0 0 10px;">Trả lời đúng nhận ngay +1 giọt nước 💧 tưới cây!</p>
          <div style="background:#e1f5fe;border:2px solid #81d4fa;border-radius:14px;padding:14px;margin-bottom:12px;">
            <span style="font-size:24px;font-weight:900;color:#01579b;">\${currentQuiz.q}</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
      \`;

      currentQuiz.o.forEach((opt, idx) => {
        html += \`
          <button class="gdn-btn-sm" style="background:#0288d1;font-size:16px;padding:10px;border-radius:12px;" onclick="window.answerWaterQuiz(\${idx})">
            \${opt}
          </button>
        \`;
      });

      html += \`</div></div>\`;
    }
    // VIEW: LƯỚI Ô ĐẤT VƯỜN TRƯỜNG CHÍNH
    else {
      html += \`<div class="gdn-grid">\`;

      gardenSlots.forEach(slot => {
        const st = getPlantStatus(slot);

        if (!slot.plant) {
          // Ô ĐẤT TRỐNG
          html += \`
            <div class="gdn-plot empty" onclick="window.openSeedShopForPlot(\${slot.index})">
              <span style="font-size:11px;font-weight:700;color:#8d6e63;">Ô số \${slot.index + 1}</span>
              <div class="gdn-plant-icon" style="opacity:0.4;">🌱</div>
              <div style="font-size:12.5px;font-weight:800;color:#5d4037;">Đất trống</div>
              <button class="gdn-btn-sm" style="background:#689f38;margin-top:6px;">🌾 Gieo hạt</button>
            </div>
          \`;
        } else if (st.isReady) {
          // CÂY ĐÃ CHÍN SẴN SÀNG THU HOẠCH
          html += \`
            <div class="gdn-plot ready">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span style="font-size:10px;font-weight:800;color:#f57f17;">Ô \${slot.index + 1}</span>
                <span class="gdn-tag" style="background:#fff9c4;color:#f57f17;">Chín rộ! ✨</span>
              </div>
              <div class="gdn-plant-icon">\${st.cfg.icon}</div>
              <div class="gdn-plant-name">\${st.cfg.name}</div>
              <div class="gdn-pbar">
                <div class="gdn-pbar-fill gdn-pbar-ready" style="width:100%;"></div>
              </div>
              <button class="gdn-btn-action gdn-btn-harvest" onclick="window.harvestGardenPlot(\${slot.index})">
                🎉 Thu hoạch (+\${st.cfg.harvestCoin}🪙)
              </button>
            </div>
          \`;
        } else {
          // CÂY ĐANG LỚN
          const stageIcon = st.cfg.stages[st.stageIdx] || "🌿";
          const hasFert = (gardenInv.basic_fertilizer || 0) > 0 || (gardenInv.premium_fertilizer || 0) > 0 || (gardenInv.miracle_fertilizer || 0) > 0;

          html += \`
            <div class="gdn-plot">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span style="font-size:10px;font-weight:700;color:#78909c;">Ô \${slot.index + 1}</span>
                <button class="gdn-btn-action gdn-btn-remove" title="Nhổ bỏ" onclick="window.removeGardenPlot(\${slot.index})">🗑️</button>
              </div>
              <div class="gdn-plant-icon">\${stageIcon}</div>
              <div class="gdn-plant-name">\${st.cfg.name}</div>
              <div class="gdn-pbar">
                <div class="gdn-pbar-fill" style="width:\${Math.round(st.progress)}%;"></div>
              </div>
              <div class="gdn-time">⏳ \${formatTime(st.remainingMs)} (\${Math.round(st.progress)}%)</div>
              <div class="gdn-btn-row">
                <button class="gdn-btn-action gdn-btn-water" onclick="window.waterGardenPlot(\${slot.index})">
                  💧 Tưới
                </button>
                <button class="gdn-btn-action gdn-btn-fert" onclick="window.openFertilizerSelect(\${slot.index})">
                  \${hasFert ? "🌱 Bón" : "🛒 Mua"}
                </button>
              </div>
            </div>
          \`;
        }
      });

      html += \`</div>\`;
    }

    html += \`</div>\`;

    // Đưa vào #box và mở #modal
    modal(html);
  }

  /* ============================================================
     CỬA SỔ CHỌN PHÂN BÓN CHO Ô ĐẤT
  ============================================================ */
  function openFertilizerSelect(slotIdx) {
    const ferts = ["basic_fertilizer", "premium_fertilizer", "miracle_fertilizer"];
    const owned = ferts.filter(id => (gardenInv[id] || 0) > 0);

    if (owned.length === 0) {
      activeView = "inv";
      renderGardenModal();
      toast("🎒 Bạn chưa có phân bón! Hãy mua ở kho đồ nhé!");
      return;
    }

    let menu = \`
      <div style="text-align:center;padding:6px;">
        <h3 style="margin:0 0 10px;color:#2e7d32;">🌱 Chọn phân bón cho ô số \${slotIdx + 1}</h3>
        <div style="display:flex;flex-direction:column;gap:8px;">
    \`;

    owned.forEach(id => {
      const item = ITEM_CONFIG[id];
      const count = gardenInv[id] || 0;
      menu += \`
        <button class="gdn-btn-sm" style="background:#43a047;padding:10px;font-size:13px;display:flex;justify-content:space-between;align-items:center;"
          onclick="window.applyFertilizerToSlot(\${slotIdx}, '\${id}')">
          <span>\${item.icon} \${item.name} (\${item.desc})</span>
          <b>x\${count}</b>
        </button>
      \`;
    });

    menu += \`
        </div>
        <button class="gdn-btn-sm" style="background:#78909c;margin-top:12px;width:100%;" onclick="window.renderGardenModal()">← Quay lại</button>
      </div>
    \`;

    modal(menu);
  }

  /* ============================================================
     GẮN CÁC HÀM XỬ LÝ TOÀN CỤC CHO SỰ KIỆN HTML
  ============================================================ */
  window.setGardenView = function (v) {
    activeView = v;
    renderGardenModal();
  };

  window.openSeedShopForPlot = function (slotIdx) {
    selectedSlotIndex = slotIdx;
    activeView = "shop";
    renderGardenModal();
  };

  window.plantSeedTarget = function (plantType) {
    if (selectedSlotIndex === null) {
      const emptySlot = gardenSlots.find(s => !s.plant);
      if (emptySlot) selectedSlotIndex = emptySlot.index;
      else {
        toast("Vườn đã hết ô đất trống!");
        return;
      }
    }
    doPlantSeed(selectedSlotIndex, plantType);
  };

  window.waterGardenPlot = function (slotIdx) {
    doWaterPlant(slotIdx);
  };

  window.harvestGardenPlot = function (slotIdx) {
    doHarvestPlant(slotIdx);
  };

  window.removeGardenPlot = function (slotIdx) {
    doRemovePlant(slotIdx);
  };

  window.openFertilizerSelect = openFertilizerSelect;

  window.applyFertilizerToSlot = function (slotIdx, itemId) {
    doFertilizerPlant(slotIdx, itemId);
  };

  window.buyGardenItem = function (itemId) {
    doBuyItem(itemId);
  };

  window.answerWaterQuiz = function (idx) {
    answerQuiz(idx);
  };

  window.renderGardenModal = renderGardenModal;

  window.closeGardenModal = function () {
    if (gardenTimer) {
      clearInterval(gardenTimer);
      gardenTimer = null;
    }
    activeView = "main";
    selectedSlotIndex = null;
    close_();
  };

  /* ============================================================
     HÀM garden() CHÍNH: GHI ĐÈ HÀM garden() CỦA activities.js
     KHI BÉ BƯỚC VÀO KHU VỰC VƯỜN TRƯỜNG
  ============================================================ */
  window.garden = function () {
    // Mở vườn trường
    activeView = "main";
    selectedSlotIndex = null;
    renderGardenModal();

    // Chạy timer tự động cập nhật thời gian đếm ngược trực tiếp mỗi 1 giây
    if (gardenTimer) clearInterval(gardenTimer);
    gardenTimer = setInterval(() => {
      if (open_ && activeView === "main") {
        renderGardenModal();
      }
    }, 1000);
  };

  /* ============================================================
     HỆ THỐNG VƯỜN THÚ CƯNG (PET CARE & NURTURE)
     Đồng bộ trực tiếp với GardenPage.jsx, HomeScreen và PetPage.jsx
  ============================================================ */
  const PET_DEFAULT = {
    species: "dog",
    name: "Bồng",
    color: "cream",
    level: 1,
    exp: 0,
    expNeeded: 200,
    mood: "happy",
    bonded: 10,
    totalCorrect: 0,
    totalWrong: 0
  };

  const PET_MOODS = {
    happy: { label: "Đang vui", emoji: "💛" },
    excited: { label: "Rất hào hứng", emoji: "🎉" },
    hungry: { label: "Đói rồi", emoji: "🍽️" },
    sleepy: { label: "Muốn ngủ", emoji: "😴" },
    sad: { label: "Buồn", emoji: "💙" }
  };

  const PET_TIPS = [
    "Cùng nhau khám phá thế giới tri thức nhé! 🐾",
    "Trả lời đúng đi, tôi hâm mộ bạn lắm! ✨",
    "Mỗi câu hỏi đúng là một bông hoa mới nở trong vườn~ 🌸",
    "Bạn học chăm chỉ quá đi, tớ rất vui! 🌟",
    "Nghỉ ngơi xíu cùng tớ rồi học tiếp nha! 🐾"
  ];

  function getPetStorageKey() {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("edu_pet_v2.u")) return k;
    }
    return "edu_pet_v2";
  }

  function loadPetData() {
    try {
      const key = getPetStorageKey();
      const raw = localStorage.getItem(key) || localStorage.getItem("edu_pet_v2");
      if (raw) {
        const p = JSON.parse(raw);
        return Object.assign({}, PET_DEFAULT, p);
      }
    } catch (e) {}
    return Object.assign({}, PET_DEFAULT);
  }

  function savePetData(pet) {
    try {
      const key = getPetStorageKey();
      localStorage.setItem(key, JSON.stringify(pet));
      localStorage.setItem("edu_pet_v2", JSON.stringify(pet));
    } catch (e) {}
  }

  function checkPetLevelUp(pet) {
    let leveled = false;
    while (pet.exp >= (pet.expNeeded || 200) && pet.level < 99) {
      pet.exp -= pet.expNeeded;
      pet.level += 1;
      pet.expNeeded = Math.round(200 * Math.pow(1.18, pet.level - 1));
      pet.mood = "excited";
      leveled = true;
    }
    if (leveled) {
      const reward = pet.level * 30;
      S.coins += reward;
      save();
      pop(\`🎉 CẤP \${pet.level}! +\${reward}🪙\`);
      toast(\`🎉 \${pet.name} đã lên CẤP \${pet.level}! Thưởng +\${reward} 🪙 vào ví!\`);
    }
    return leveled;
  }

  function renderPetModal() {
    injectGardenStyle();
    const pet = loadPetData();
    const moodInfo = PET_MOODS[pet.mood] || PET_MOODS.happy;
    const petTip = PET_TIPS[Math.floor(Math.random() * PET_TIPS.length)];
    const expPercent = Math.min(100, Math.round(((pet.exp || 0) / (pet.expNeeded || 200)) * 100));

    const speciesEmoji = {
      dog: "🐶", cat: "🐱", bird: "🐦", fish: "🐟", monkey: "🐵"
    }[pet.species] || "🐶";

    let html = \`
      <div class="gdn-wrap">
        <!-- HEADER HUD -->
        <div class="gdn-hud" style="background:linear-gradient(135deg, #fff3e0, #ffe082);border-color:#ffb300;">
          <div class="gdn-hud-stats">
            <span style="font-size:24px;">🐾</span>
            <div>
              <div style="font-weight:900;font-size:16px;color:#e65100;">VƯỜN THÚ CƯNG CỦA BÉ</div>
              <div style="font-size:11.5px;color:#6d4c41;">Chăm sóc, vui chơi & cùng bạn thú cưng lớn lên!</div>
            </div>
          </div>
          <div class="gdn-actions">
            <button class="gdn-btn-sm" style="background:#43a047;" onclick="window.garden()">🌸 Vườn hoa</button>
            <button class="gdn-btn-sm" style="background:#546e7a;" onclick="close_()">✕ Đóng</button>
          </div>
        </div>

        <!-- THẺ THÔNG TIN THÚ CƯNG -->
        <div style="background:#fff;border:2px solid #ffcc80;border-radius:18px;padding:16px;box-shadow:0 6px 16px rgba(0,0,0,0.06);text-align:center;">
          <!-- HÌNH THÚ CƯNG & BONG BÓNG THOẠI -->
          <div style="display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:12px;">
            <div style="width:84px;height:84px;border-radius:50%;background:#fff8e1;border:3px solid #ffb300;display:flex;align-items:center;justify-content:center;font-size:46px;box-shadow:0 4px 10px rgba(255,179,0,0.25);animation:gdnPulse 2s infinite;">
              \${speciesEmoji}
            </div>
            <div style="background:#f5f5f5;border:1.5px solid #e0e0e0;border-radius:14px;padding:10px 14px;text-align:left;position:relative;max-width:240px;">
              <div style="font-size:10px;font-weight:800;color:#ff8f00;margin-bottom:2px;">💬 \${pet.name} nhắn nhủ:</div>
              <div style="font-size:12px;color:#37474f;line-height:1.35;font-weight:600;">"\${petTip}"</div>
            </div>
          </div>

          <!-- TÊN, CẤP, TÂM TÍNH -->
          <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:4px;">
            <span style="font-weight:900;font-size:18px;color:#bf360c;">\${pet.name}</span>
            <button class="gdn-btn-sm" style="background:#ffb74d;padding:2px 8px;font-size:11px;" onclick="window.renamePetPrompt()">✏️ Đổi tên</button>
            <span class="gdn-tag" style="background:#fff3e0;color:#e65100;border:1px solid #ffb74d;font-size:11px;">
              \${moodInfo.label} \${moodInfo.emoji}
            </span>
          </div>

          <div style="font-size:12px;color:#78909c;font-weight:700;margin-bottom:10px;">
            Cấp độ <b>\${pet.level}</b> · Thân thiết: <b>❤️ \${pet.bonded}%</b> · Ví: <b>🪙 \${S.coins.toLocaleString()}</b>
          </div>

          <!-- THANH KINH NGHIỆM EXP -->
          <div style="background:#f5f5f5;border-radius:12px;padding:8px 12px;border:1px solid #eee;margin-bottom:12px;">
            <div style="display:flex;justify-content:space-between;font-size:11px;font-weight:700;color:#546e7a;margin-bottom:4px;">
              <span>Kinh nghiệm (EXP)</span>
              <span>\${pet.exp} / \${pet.expNeeded} EXP (\${expPercent}%)</span>
            </div>
            <div class="gdn-pbar" style="height:8px;margin:0;">
              <div class="gdn-pbar-fill" style="width:\${expPercent}%;background:linear-gradient(90deg, #ffb300, #ff8f00);"></div>
            </div>
          </div>

          <!-- 4 HÀNH ĐỘNG CHĂM SÓC -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <button class="gdn-btn-action" style="background:#ff7043;color:#fff;padding:12px 10px;font-size:13px;border-radius:14px;box-shadow:0 3px 0 #d84315;"
              onclick="window.petActionFeed()">
              <div style="font-size:22px;margin-bottom:2px;">🍖</div>
              <b>Cho ăn ngon</b>
              <div style="font-size:10px;opacity:0.9;">-5 🪙 · +20 EXP</div>
            </button>

            <button class="gdn-btn-action" style="background:#42a5f5;color:#fff;padding:12px 10px;font-size:13px;border-radius:14px;box-shadow:0 3px 0 #1565c0;"
              onclick="window.petActionPlay()">
              <div style="font-size:22px;margin-bottom:2px;">🎾</div>
              <b>Chơi đùa</b>
              <div style="font-size:10px;opacity:0.9;">-10 ⚡ · +25 EXP · +5% ❤️</div>
            </button>

            <button class="gdn-btn-action" style="background:#26a69a;color:#fff;padding:12px 10px;font-size:13px;border-radius:14px;box-shadow:0 3px 0 #00695c;"
              onclick="window.petActionWash()">
              <div style="font-size:22px;margin-bottom:2px;">🛁</div>
              <b>Tắm rửa & Vuốt</b>
              <div style="font-size:10px;opacity:0.9;">Miễn phí · +15 EXP</div>
            </button>

            <button class="gdn-btn-action" style="background:#ab47bc;color:#fff;padding:12px 10px;font-size:13px;border-radius:14px;box-shadow:0 3px 0 #6a1b9a;"
              onclick="window.petActionRest()">
              <div style="font-size:22px;margin-bottom:2px;">💤</div>
              <b>Nghỉ ngơi</b>
              <div style="font-size:10px;opacity:0.9;">⚡ Hồi phục +25 năng lượng</div>
            </button>
          </div>
        </div>
      </div>
    \`;

    modal(html);
  }

  window.petActionFeed = function () {
    if (S.coins < 5) {
      toast("🪙 Cần ít nhất 5 coin để mua thức ăn cho bé!");
      return;
    }
    S.coins -= 5;
    save();

    const pet = loadPetData();
    pet.exp = (pet.exp || 0) + 20;
    pet.mood = "excited";
    pet.bonded = Math.min(100, (pet.bonded || 10) + 3);
    checkPetLevelUp(pet);
    savePetData(pet);

    pop("+20 EXP 🍖");
    toast(\`🍖 Đã cho \${pet.name} ăn ngon lành! (-5 🪙, +20 EXP)\`);
    renderPetModal();
  };

  window.petActionPlay = function () {
    if (S.en < 10) {
      toast("⚡ Bạn đã hết năng lượng! Hãy nghỉ ngơi hoặc ăn uống tại Căng tin!");
      return;
    }
    S.en -= 10;

    const pet = loadPetData();
    pet.exp = (pet.exp || 0) + 25;
    pet.bonded = Math.min(100, (pet.bonded || 10) + 5);
    pet.mood = "happy";
    checkPetLevelUp(pet);
    savePetData(pet);

    pop("+25 EXP 🎾");
    toast(\`🎾 Bạn đã cùng \${pet.name} chơi bóng thật vui vẻ! (+25 EXP, Thân thiết +5%)\`);
    renderPetModal();
  };

  window.petActionWash = function () {
    const pet = loadPetData();
    pet.exp = (pet.exp || 0) + 15;
    pet.mood = "excited";
    checkPetLevelUp(pet);
    savePetData(pet);

    pop("+15 EXP 🛁");
    toast(\`🛁 \${pet.name} đã được tắm rửa sạch sẽ, thơm tho! (+15 EXP)\`);
    renderPetModal();
  };

  window.petActionRest = function () {
    S.en = Math.min(100, S.en + 25);
    const pet = loadPetData();
    pet.mood = "happy";
    savePetData(pet);

    pop("+25 ⚡");
    toast(\`💤 Cả bạn và \${pet.name} đã ngủ một giấc thật ngon! (⚡ +25 Năng lượng)\`);
    renderPetModal();
  };

  window.renamePetPrompt = function () {
    const pet = loadPetData();
    const newName = prompt(\`Nhập tên mới cho \${pet.name}:\`, pet.name);
    if (newName && newName.trim() && newName.trim() !== pet.name) {
      pet.name = newName.trim();
      savePetData(pet);
      toast(\`Đã đổi tên thú cưng thành "\${pet.name}"!\`);
      renderPetModal();
    }
  };

  window.petGarden = function () {
    if (gardenTimer) {
      clearInterval(gardenTimer);
      gardenTimer = null;
    }
    renderPetModal();
  };

  console.log("✔ Đã nạp thành công hệ thống Vườn trường và Vườn thú cưng vào School Mission!");
})();
`,x=`// ===== INPUT: bàn phím WASD + joystick cảm ứng =====
const keys={};addEventListener("keydown",e=>{if(e.target.tagName=="TEXTAREA")return;keys[e.key.toLowerCase()]=1});addEventListener("keyup",e=>keys[e.key.toLowerCase()]=0);
let jx=0,jy=0,jid=null;const joy=$("joy"),kn=$("knob");
function jm(e){const r=joy.getBoundingClientRect(),dx=e.clientX-(r.left+60),dy=e.clientY-(r.top+60),d=Math.hypot(dx,dy)||1,m=Math.min(d,45);jx=dx/d*m/45;jy=dy/d*m/45;kn.style.transform=\`translate(\${jx*45}px,\${jy*45}px)\`}
joy.addEventListener("pointerdown",e=>{jid=e.pointerId;joy.setPointerCapture(jid);jm(e)});joy.addEventListener("pointermove",e=>{if(e.pointerId==jid)jm(e)});
const je=()=>{jid=null;jx=jy=0;kn.style.transform=""};joy.addEventListener("pointerup",je);joy.addEventListener("pointercancel",je);
`,S=`// ===== MAIN: khởi động và vòng lặp game =====
$("cfg").onclick=cfg;$("sched").onclick=showSchedule;loadData();
$("quit").onclick=function(){try{if(window.parent!==window)window.parent.postMessage({type:"quit"},"*");else history.back()}catch(e){}};
if($("btn-garden"))$("btn-garden").onclick=function(){if(window.garden)window.garden()};
if($("btn-pet"))$("btn-pet").onclick=function(){if(window.petGarden)window.petGarden()};
initSchoolSync();
// lớp 3D; thất bại (thiếu ba.js, máy chặn WebGL) thì chơi bằng vẽ 2D
try{W3=startW3()}catch(e){W3=null;console.warn("Không bật được 3D, chuyển sang vẽ 2D:",e)}
function loop(n){const dt=Math.min(.05,(n-last)/1000);last=n;upd(dt);draw(dt);requestAnimationFrame(loop)}
requestAnimationFrame(loop);setInterval(save,5000);setInterval(tickSchedule,1000);tickSchedule();
toast(CFG.demoMode?"🧪 DEMO TKB bật — tiết sắp bắt đầu!":"📅 Xem Thời khóa biểu · học đúng giờ thật nhé!");
`,C=`// ===== QUESTIONS: tạo câu hỏi từ dữ liệu (toán ngẫu nhiên / từ vựng / quiz) =====
function shq(q){const o=sh(q.options.map((t,i)=>[t,i==q.answer]));return{q:q.q,o:o.map(x=>String(x[0])),a:o.findIndex(x=>x[1]),x:q.explain||""}}
function mk(type){const s=DATA.subjects[type];
 if(s.mode=="math"){const m=3+S.lv*3,a=1+Math.floor(Math.random()*m),b=1+Math.floor(Math.random()*m),o=["+","-","×"][Math.floor(Math.random()*(S.lv>1?3:2))];
  let r=o=="+"?a+b:o=="-"?a-b:a*b;let st=new Set([r]);while(st.size<4)st.add(r+Math.floor(Math.random()*9)-4);
  const op=sh([...st]);return{q:\`\${a} \${o} \${b} = ?\`,o:op.map(String),a:op.indexOf(r),x:""}}
 if(s.mode=="vocab"){const V=s.vocab,w=V[Math.floor(Math.random()*V.length)];const ws=sh(V.filter(x=>x!=w)).slice(0,3).map(x=>x[1]);const op=sh([w[1],...ws]);return{q:\`"\${w[0]}" nghĩa là gì?\`,o:op,a:op.indexOf(w[1]),x:""}}
 return shq(s.questions[Math.floor(Math.random()*s.questions.length)])}
`,w=`// ===== RENDER: camera, sắp xếp lớp vẽ, hiệu ứng viền tối, chuyển cảnh =====
function draw(dt) {
    // Thế giới 3D (js/world3d.js) — nếu ba.js/WebGL không dùng được thì W3 = null
    // và phần dưới đây vẽ lại toàn bộ game bằng 2D như bản cũ.
    if (W3) { W3.frame(dt); W3.overlay(); return; }

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
    
    // Thêm nhân vật chính (Bạn) vào danh sách vẽ — tạo hình của game: màu áo +
    // mũ bé mua trong Cửa hàng, tên lấy từ tài khoản đang đăng nhập.
    L.push({
        y: me.y,
        f: () => chr(me.x, me.y, S.col, S.hat, playerName, me.t, null, me.mv)
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
}`,T=`// ===== SCENES: vẽ sân trường, tòa nhà, hành lang, lớp học =====

// 1. KHỞI TẠO CÁC MẢNG TRANG TRÍ (Cỏ, hoa dại, cây cối cho sân trường rộng 2400x1400)
const tufts = [], flw = [], trees = [];

// Tạo 450 bụi cỏ ngẫu nhiên
for (let i = 0; i < 450; i++) {
    tufts.push([Math.random() * 2400, Math.random() * 1400, Math.random()]);
}

// Tạo 200 bông hoa dại ngẫu nhiên
for (let i = 0; i < 200; i++) {
    flw.push([
        Math.random() * 2400, 
        Math.random() * 1400, 
        ["#fff", "#ffd23f", "#ff8fb1", "#b28dff", "#74b9ff"][i % 5]
    ]);
}

// Tạo 75 cây xanh bóng mát
for (let i = 0; i < 75; i++) {
    const x = Math.random() * 2400, y = 60 + Math.random() * 1340;
    if (
        !P.some(p => x > p.x - 70 && x < p.x + p.w + 70 && y > p.y - 70 && y < p.y + p.h + 90) &&
        !(y > 600 && y < 820) && 
        !(x > 1050 && x < 1350) && 
        !(x > 750 && x < 1650 && y < 450) && 
        !(x > 200 && x < 500 && y > 220 && y < 450)
    ) {
        trees.push([x, y, 0.85 + Math.random() * 0.55]);
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
    const x = 820, y = 90;
    
    g.fillStyle = "rgba(0,0,0,.22)";
    g.beginPath();
    g.ellipse(1200, 358, 420, 20, 0, 0, 7);
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
                const wx = s ? 1300 + i * 62 : x + 40 + i * 62, wy = y + 140 + r * 110;
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
    rg(1110, y - 10, 180, 365, 8, "#c25b49");
    g.fillStyle = "rgba(0,0,0,.09)";
    for (let i = 0; i < 34; i++) {
        g.fillRect(1110, y - 4 + i * 10, 180, 2);
    }

    // Mái tháp
    g.fillStyle = "#6b3a2a";
    g.beginPath();
    g.moveTo(1096, y + 8);
    g.lineTo(1200, y - 62);
    g.lineTo(1304, y + 8);
    g.fill();
    
    g.fillStyle = "rgba(255,255,255,.15)";
    g.beginPath();
    g.moveTo(1096, y + 8);
    g.lineTo(1200, y - 62);
    g.lineTo(1200, y + 8);
    g.fill();

    // Đồng hồ
    g.fillStyle = "#fff";
    g.beginPath();
    g.arc(1200, y + 34, 24, 0, 7);
    g.fill();
    g.strokeStyle = "#6b3a2a";
    g.lineWidth = 4;
    g.stroke();
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(1200, y + 34);
    g.lineTo(1200, y + 20);
    g.moveTo(1200, y + 34);
    g.lineTo(1210, y + 38);
    g.stroke();

    // Biển hiệu
    rr(1126, y + 76, 148, 30, 8, "#2c3e66");
    tx("TRƯỜNG VUI VẺ", 1200, y + 97, 16, "#ffd23f");
    
    // Cửa ra vào
    rr(1150, y + 150, 100, 60, 6, "#f1e7d3");
    rr(1156, y + 156, 88, 48, 4, "#9fd8ff");
    rr(1142, y + 262, 116, 93, 8, "#f1e7d3");
    rr(1152, y + 270, 45, 85, 4, "#7a4a2a");
    rr(1203, y + 270, 45, 85, 4, "#7a4a2a");
    
    g.fillStyle = "#ffd23f";
    g.beginPath();
    g.arc(1190, y + 318, 3, 0, 7);
    g.arc(1210, y + 318, 3, 0, 7);
    g.fill();

    // Bậc thềm
    rr(1130, y + 355, 140, 10, 3, "#cfcfd6");
    rr(1120, y + 362, 160, 8, 3, "#bbb");

    // Cột cờ
    g.fillStyle = "#999";
    g.fillRect(860, y + 20, 3, 100);
    rr(863, y + 22, 34, 22, 3, "#e74c3c");
    g.fillRect(1536, y + 20, 3, 100);
    rr(1539, y + 22, 34, 22, 3, "#3b82c4");
}

// 3. HÀM VẼ CÁC CẢNH
function drawOut() {
    const w = 2400, h = 1400;
    
    // Nền cỏ tươi tắn với gradient cao cấp
    const bg = g.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, "#98e482");
    bg.addColorStop(1, "#66bf54");
    g.fillStyle = bg;
    g.fillRect(0, 0, w, h);

    // Cỏ và hoa dại
    tufts.forEach(([x, y, r]) => {
        g.fillStyle = r > 0.5 ? "#5fb44e" : "#a8efa0";
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
        g.arc(x, y, 3.5, 0, 7);
        g.fill();
    });

    // Đường đi rộng rãi kết nối các khu vực
    g.fillStyle = "#b0b6c2";
    g.fillRect(0, 644, w, 142);
    g.fillRect(1124, 0, 152, h);
    
    g.fillStyle = "#dce0e6";
    g.fillRect(0, 650, w, 130);
    g.fillRect(1130, 0, 140, h);
    
    // Vạch kẻ sang đường cho người đi bộ
    g.fillStyle = "rgba(255,255,255,.9)";
    for (let x = 0; x < w; x += 90) g.fillRect(x, 710, 46, 10);
    
    g.fillStyle = "#f5f5f5";
    g.fillRect(0, 646, w, 6);
    g.fillRect(0, 774, w, 6);
    g.fillStyle = "#c9a77c";
    g.fillRect(800, 350, 800, 16);

    // Hồ sen sinh thái lớn
    const pg = g.createRadialGradient(360, 360, 15, 360, 360, 140);
    pg.addColorStop(0, "#a5e7ff");
    pg.addColorStop(1, "#42a5f5");
    
    g.fillStyle = "#e0d6b5";
    g.beginPath();
    g.ellipse(360, 360, 148, 86, 0, 0, 7);
    g.fill();
    
    g.fillStyle = pg;
    g.beginPath();
    g.ellipse(360, 360, 132, 72, 0, 0, 7);
    g.fill();
    
    g.strokeStyle = "rgba(255,255,255,.7)";
    g.lineWidth = 2.5;
    const rp = (tt * 20) % 40;
    g.beginPath();
    g.ellipse(360, 360, 24 + rp, 12 + rp / 2, 0, 0, 7);
    g.stroke();
    
    g.font = "26px serif";
    g.fillText("🦆", 330 + Math.sin(tt) * 35, 365); // Vịt bơi
    g.fillText("🪷", 280, 345);
    g.fillText("🪷", 420, 375);

    // Cột cờ trung tâm sân trường cao lớn
    g.fillStyle = "#cfd8dc";
    g.beginPath();
    g.ellipse(1200, 570, 32, 12, 0, 0, 7);
    g.fill();
    g.fillStyle = "#90a4ae";
    g.fillRect(1198, 480, 4, 90);
    rr(1202, 484, 42, 26, 3, "#d32f2f");
    g.fillStyle = "#ffeb3b";
    g.font = "14px serif";
    g.fillText("⭐", 1216, 502);

    // Đài phun nước lớn góc phải sân trường
    {
        const fx = 2120, fy = 650;
        const fgrad = g.createRadialGradient(fx, fy, 10, fx, fy, 80);
        fgrad.addColorStop(0, "#81d4fa");
        fgrad.addColorStop(1, "#0288d1");
        
        g.fillStyle = "#cfd8dc";
        g.beginPath();
        g.ellipse(fx, fy, 84, 46, 0, 0, 7);
        g.fill();
        
        g.fillStyle = fgrad;
        g.beginPath();
        g.ellipse(fx, fy, 72, 38, 0, 0, 7);
        g.fill();
        
        g.fillStyle = "#fff";
        g.beginPath();
        g.ellipse(fx, fy, 16, 8, 0, 0, 7);
        g.fill();
        
        g.font = "26px serif";
        g.fillText("⛲", fx - 13, fy + 8);
    }

    // Ghế đá sân trường dưới bóng râm
    [[750, 610], [1500, 610], [920, 830], [1280, 830]].forEach(([bx, by]) => {
        rr(bx - 26, by, 52, 14, 4, "#b0bec5");
        rr(bx - 22, by + 12, 8, 6, 2, "#78909c");
        rr(bx + 14, by + 12, 8, 6, 2, "#78909c");
    });

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
            // Trang trí Vườn thú cưng
            if ((p.id == "gym" || p.id == "pet") && !lock) {
                g.font = "40px serif";
                g.fillText("🐶", p.x + 80, p.y + 170);
                g.fillText("🐱", p.x + 290, p.y + 130);
                g.fillText("🐾", p.x + 190, p.y + 240);
                g.fillText("🦴", p.x + 200, p.y + 100);
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
}`,E=`// ===== SCHEDULE: thời khóa biểu, đồng hồ, báo chuông, vào lớp đúng giờ =====
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
`,D=`// ===== SETTINGS: bảng ⚙️ Dữ liệu — sửa JSON câu hỏi ngay trong game =====
function cfg(){if(open_)return;
 modal(\`<h2>⚙️ Dữ liệu câu hỏi & bài thi</h2><p style="font-size:13px;margin:4px 0">Sửa JSON bên dưới rồi bấm <b>Áp dụng</b>. Dữ liệu được lưu trên trình duyệt của bạn. Muốn sửa vĩnh viễn: chép JSON này dán đè vào file <code>data/questions.js</code>.</p><textarea id="ta" spellcheck="false"></textarea><div id="er"></div><button class="btn" id="ap">✅ Áp dụng</button> <button class="btn" id="cp" style="background:#bfe6ff;box-shadow:0 3px 0 #8ab">📋 Sao chép</button> <button class="btn" id="rs" style="background:#ffd0d0;box-shadow:0 3px 0 #c99">↩️ Mặc định</button> <button class="btn" id="cl" style="background:#ddd;box-shadow:0 3px 0 #aaa">Đóng</button>\`);
 $("ta").value=JSON.stringify(DATA,null,1);
 $("ap").onclick=()=>{try{const x=JSON.parse($("ta").value),er=vd(x);if(er){$("er").textContent="❌ "+er;return}DATA=x;try{localStorage.setItem("tvv_data",JSON.stringify(x))}catch(e){}close_();toast("✅ Đã cập nhật câu hỏi & bài thi!")}catch(e){$("er").textContent="❌ JSON lỗi: "+e.message}};
 $("cp").onclick=()=>{try{navigator.clipboard.writeText($("ta").value).then(()=>toast("📋 Đã sao chép JSON"),()=>{$("ta").select()})}catch(e){$("ta").select()}};
 $("rs").onclick=()=>{try{localStorage.removeItem("tvv_data")}catch(e){}loadData();close_();toast("↩️ Đã khôi phục dữ liệu mặc định")};
 $("cl").onclick=close_}
`,O=`// ===== STATE: tiến trình người chơi (lưu localStorage), cảnh hiện tại, nhân vật =====
// Đồng bộ ví coin tài khoản (key gq_coin_wallet_v1 trong localStorage)
function getProfileWallet() {
  try {
    const raw = JSON.parse(localStorage.getItem("gq_coin_wallet_v1") || "null");
    if (raw && typeof raw.coins === "number") {
      return {
        coins: Math.max(0, Math.round(raw.coins)),
        pending: Number(raw.pending) || 0,
        updatedAt: Number(raw.updatedAt) || Date.now()
      };
    }
  } catch (e) {}
  return null;
}

function syncProfileWallet(newCoins) {
  try {
    const target = Math.max(0, Math.round(Number(newCoins) || 0));
    const raw = JSON.parse(localStorage.getItem("gq_coin_wallet_v1") || "{}");
    const current = typeof raw.coins === "number" ? Math.max(0, Math.round(raw.coins)) : target;
    const diff = target - current;
    raw.coins = target;
    raw.pending = (Number(raw.pending) || 0) + diff;
    raw.updatedAt = Date.now();
    localStorage.setItem("gq_coin_wallet_v1", JSON.stringify(raw));
    if (window.parent && window.parent !== window && diff !== 0) {
      try {
        window.parent.postMessage({ type: "gq:walletDelta", data: { amount: diff } }, "*");
        window.parent.postMessage({ type: "gq:wallet", coins: target, delta: diff }, "*");
      } catch (e) {}
    }
  } catch (e) {}
}

let S = { coins: 100, gems: 0, xp: 0, lv: 1, en: 100, hat: "", col: "#ff9f43", own: ["", "#ff9f43"], q: {} };
try {
  const s = localStorage.getItem("tvv");
  if (s) S = Object.assign(S, JSON.parse(s));
} catch (e) {}

// Ưu tiên số coin từ ví tài khoản profile gq_coin_wallet_v1
const pWallet = getProfileWallet();
if (pWallet !== null) {
  S.coins = pWallet.coins;
} else {
  syncProfileWallet(S.coins);
}

S.exam = S.exam || {};
function save() {
  S._updated = Date.now();
  syncProfileWallet(S.coins);
  try { localStorage.setItem("tvv", JSON.stringify(S)); } catch (e) {}
  try { if (typeof scheduleSchoolSync === "function") scheduleSchoolSync(); } catch (e) {}
}

// Lắng nghe thay đổi ví coin từ bên ngoài (Profile / Home / Wallet API)
window.addEventListener("storage", function (e) {
  if (e.key === "gq_coin_wallet_v1") {
    const pw = getProfileWallet();
    if (pw && pw.coins !== S.coins) {
      S.coins = pw.coins;
      const coinEl = document.getElementById("coin");
      if (coinEl) coinEl.textContent = "🪙 " + S.coins;
      if (typeof updateGardenWalletHUD === "function") updateGardenWalletHUD();
    }
  }
});
window.addEventListener("message", function (e) {
  const msg = e && e.data;
  if (!msg || typeof msg !== "object") return;
  if (msg.type === "gq:wallet" && typeof msg.coins === "number") {
    S.coins = Math.max(0, Math.round(msg.coins));
    const coinEl = document.getElementById("coin");
    if (coinEl) coinEl.textContent = "🪙 " + S.coins;
    if (typeof updateGardenWalletHUD === "function") updateGardenWalletHUD();
  }
});
const D={out:[2400,1400],hall:[1700,420],hall2:[1700,420],room:[1000,600]};
let sc="out",rk="math",fade=0,open_=false,tt=0,ft=[],flowers=[],ftime=0;
const me={x:1200,y:720,mv:0,t:0};
// Tên dán trên đầu nhân vật của bé — do app gửi vào (window.__SCHOOL_INIT__.playerName)
var playerName="Bạn";
`,k=`// ===== SYNC: nhận avatar + tiến độ từ app, gửi tiến độ lên API =====
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

    playerName = init.playerName || "Bạn";

    var remote = init.savedState;
    var mergedRemote = applySavedSchoolState(remote);

    window.addEventListener("message", function (event) {
        var msg = event && event.data;
        if (!msg || typeof msg !== "object") return;

        if (msg.type === "school-name" && msg.data) {
            playerName = msg.data.playerName || "Bạn";
        }

        // Trang cha báo lại kết quả cộng coin thật (src/lib/schoolMissionRewards.js)
        if (msg.type === "school-coin-result" && msg.data) {
            var r = msg.data;
            if (r.granted) toast("💰 Đã cộng " + r.amount + " 🪙 vào ví của bạn!");
            else if (r.code === "cap") toast("💰 Hết lượt thưởng hôm nay (trần " + r.cap + " 🪙/ngày) — mai chơi tiếp nhé!");
            else if (r.code === "noauth") toast("💰 Đăng nhập để nhận coin thật nhé!");
            else toast("💰 Chưa cộng được coin — cần kết nối mạng!");
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
`,A=`// ===== UI: thông báo, popup +xu, cộng thưởng, tiến độ nhiệm vụ, hộp thoại =====
function toast(t){const e=$("toast");e.textContent=t;e.style.display="block";clearTimeout(toast.h);toast.h=setTimeout(()=>e.style.display="none",2200)}
function pop(s){ft.push({x:me.x,y:me.y-90,s,t:1.4})}
function gain(c,x){S.coins+=c;S.xp+=x;pop("+"+c+"🪙 +"+x+"XP");const need=S.lv*50;if(S.xp>=need){S.xp-=need;S.lv++;S.gems+=2;toast("🎉 Lên cấp "+S.lv+"! "+(S.lv==2?"Mở Vườn trường 🌸":S.lv==3?"Mở Sân thể thao 🏃":"+2 💎"))}save()}
function prog(k,n=1){const q=QU.find(x=>x.k==k);S.q[k]=(S.q[k]||0)+n;if(S.q[k]>=q.n){S.q[k]=0;S.coins+=q.c;S.gems+=q.g;realCoin(q.c,"quest:"+k);setTimeout(()=>toast("✅ Xong nhiệm vụ! +"+q.c+"🪙 +"+q.g+"💎"),600)}save()}

/* ── Phần thưởng đổi ra coin THẬT trong ví của tài khoản ──
   Game không tự cộng coin thật (không có token trong iframe) mà bắn sự kiện
   cho trang cha: src/pages/SchoolMissionPage.jsx kiểm tra trần mỗi ngày rồi gọi
   /auth/me/wallet. Kết quả gửi ngược lại qua "school-coin-result" (js/sync.js). */
function realCoin(n,reason){
    n=Math.round(Number(n)||0);
    if(!(n>0)||window.parent===window)return;
    try{window.parent.postMessage({type:"school-coin",data:{amount:n,reason}}, "*")}catch(e){}
}

/* Chỉ điểm cao mới thưởng: đúng ≥80% của một lần học → 10🪙, đúng hết → 15🪙.
   Trả về dòng chữ để hiển thị trong bảng kết quả (rỗng khi chưa tới mốc). */
function scoreBonus(ok,total,tag){
    if(!(total>0))return "";
    if(ok>=total)return realCoin(15,"perfect:"+tag),"+15 🪙 ví thật — đúng hết câu!";
    if(ok>=Math.ceil(total*0.8))return realCoin(10,"highscore:"+tag),"+10 🪙 ví thật — làm bài tốt!";
    return "";
}
function modal(h){$("box").innerHTML=h;$("modal").style.display="flex";open_=true}
function close_(){$("modal").style.display="none";open_=false}
`,j=`// ===== WORLD: chuyển cảnh, vùng tương tác tự động, va chạm, chat, cập nhật mỗi khung hình =====

/* PEND  : tiết đang chờ bé ngồi vào bàn để học/thi (do js/schedule.js đặt)
   zin   : latch các vùng — phải rời vùng rồi mới kích hoạt lại
   climb : trạng thái leo cầu thang */
let PEND=null,_pendCd=0,_doneKeys={},zin={},climb=null;

function go(s,x,y,r){sc=s;me.x=x;me.y=y;if(r)rk=r;fade=1;zin={};npcClose();if(s=="room")toast("Chào mừng đến "+RM[rk].n+"!");if(W3)W3.enter()}

/* Vùng TỰ KÍCH HOẠT: đi vào vùng là chạy ngay — KHÔNG có nút bấm.
   Vào cửa trường/cửa lớp/cầu thang hay bước vào nhà đều tự mở. */
function ZN(){
 if(sc=="out"){
  const z=[{id:"school",x:1120,y:356,w:160,h:110,f:()=>go("hall",140,300)}];
  P.forEach(p=>{if(p.lv&&S.lv<p.lv)return;
   const f={shop,can:canteen,garden,pet:typeof petGarden==="function"?petGarden:garden,gym:typeof petGarden==="function"?petGarden:garden}[p.id];
   z.push(p.b?{id:p.id,x:p.x,y:p.y+p.h-10,w:p.w,h:60,f}:{id:p.id,x:p.x,y:p.y,w:p.w,h:p.h,f})});
  return z;
 }
 if(sc=="hall")return[
  {id:"out",x:0,y:195,w:70,h:210,f:()=>go("out",1200,560)},
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
 return(x>820&&x<1580&&y>90&&y<352)||P.some(p=>p.b?x>p.x+5&&x<p.x+p.w-5&&y>p.y+60&&y<p.y+p.h-10:(p.lv&&S.lv<p.lv&&x>p.x&&x<p.x+p.w&&y>p.y&&y<p.y+p.h))}

let last=performance.now();
function upd(dt){tt+=dt;if(fade>0)fade=Math.max(0,fade-dt*2.5);
 if(_pendCd>0)_pendCd-=dt;

 /* Leo cầu thang: khoá điều khiển, di chuyển lên đến khi hết bậc thì đổi cảnh */
 if(climb){climb.t+=dt;me.y-=150*dt;me.mv=1;me.t+=dt*12;me.dx=0;me.dy=-1;
  if(climb.t>=1.05){const d=climb.dir;climb=null;if(d>0)go("hall2",120,320);else go("hall",DX.math,300)}
  tickSchedule();return}

 const[WW,WH]=D[sc];
 if(!open_&&fade<.6){let dx=jx+((keys.d||keys.arrowright)?1:0)-((keys.a||keys.arrowleft)?1:0),dy=jy+((keys.s||keys.arrowdown)?1:0)-((keys.w||keys.arrowup)?1:0);const m=Math.hypot(dx,dy);if(m>1){dx/=m;dy/=m}
  /* 3D: cần câu/phiếm tính theo màn hình, phải xoay theo hướng máy quay để
     "đẩy lên" luôn là đi ra phía trước nhân vật. */
  if(W3){const a=W3.yaw(),c=Math.cos(a),s=Math.sin(a),rx=dx*c+dy*s,ry=-dx*s+dy*c;dx=rx;dy=ry}
  me.dx=dx;me.dy=dy;
  const sp=190*dt,nx=me.x+dx*sp,ny=me.y+dy*sp;if(!blocked(nx,me.y))me.x=Math.max(25,Math.min(WW-25,nx));if(!blocked(me.x,ny))me.y=Math.max(40,Math.min(WH-15,ny));me.mv=Math.min(1,m);if(m>.1)me.t+=dt*12}else {me.mv=0;me.dx=me.dy=0}
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
 chatN=n;chatT=0;chatCd[n.n]=25;n.say=0;prog("chat");
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
`,M=`// ===== WORLD3D: thế giới 3D + camera sau vai (three.js r128, giống Leo Tháp Mây) =====
/* Logic game vẫn chạy trên hệ toạ độ 2D cũ, chỉ thay lớp vẽ:
 *     X3 = (x2 - WW/2) / W3PX,  Z3 = (y2 - WH/2) / W3PX
 * nên blocked(), ZN(), thời khoá biểu, quiz, nhiệm vụ… không phải sửa.
 *
 * startW3() trả null khi không tải được three.js (mạng về chậm / máy chặn WebGL)
 * → js/render.js quay về lối vẽ 2D cũ, game vẫn chơi được. */

var W3 = null;
const W3PX = 45; // 45 pixel bản đồ = 1 mét
/* Mở School_mission.html?...&debug để kiểm tra tọa độ máy quay / nhân vật */
const DEBUG3D = typeof location !== "undefined" && /debug/.test(location.search || "");

function startW3() {
    if (!window.THREE) return null;
    const stage = $("gl");
    if (!stage) return null;
    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    } catch (e) {
        return null; // trình duyệt chặn WebGL
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
    stage.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(58, 1, .1, 200);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xb9ccff, .95));
    const sun = new THREE.DirectionalLight(0xfff1d6, .7);
    sun.position.set(-12, 22, 14);
    scene.add(sun);

    const props = new THREE.Group(); scene.add(props);  // nhà, bàn ghế, cây…
    const marks = new THREE.Group(); scene.add(marks);  // biển tên vùng
    const kids = new THREE.Group(); scene.add(kids);    // nhân vật
    const flowerG = new THREE.Group(); scene.add(flowerG);

    /* ── tài nguyên dùng chung (không dispose khi đổi cảnh) ── */
    const boxG = new THREE.BoxGeometry(1, 1, 1);
    const sphG = new THREE.SphereGeometry(1, 12, 8);
    const cylG = new THREE.CylinderGeometry(1, 1, 1, 10);
    const coneG = new THREE.ConeGeometry(1, 1, 4);
    const shared = [boxG, sphG, cylG, coneG];
    const matCache = {};
    const matOf = (hex) => matCache[hex] || (matCache[hex] = new THREE.MeshLambertMaterial({ color: hex }));
    const hexOf = (css) => parseInt(String(css || "").replace("#", ""), 16) || 0xff9f43;

    /* ── bản đồ 2D (px) → sân 3D (mét) ── */
    let WW = D.out[0], WH = D.out[1];
    const xOf = (x) => (x - WW / 2) / W3PX;
    const zOf = (y) => (y - WH / 2) / W3PX;
    const uX = (x, S) => (x / WW) * S;
    const uY = (y, S) => (1 - y / WH) * S; // ảnh lật ngược nên trục đứng đảo lại

    function cube(w, h, d, hex, x, y, z, par) {
        const m = new THREE.Mesh(boxG, matOf(hex));
        m.scale.set(w, h, d); m.position.set(x, y, z);
        (par || props).add(m); return m;
    }
    function ball(r, hex, x, y, z, par) {
        const m = new THREE.Mesh(sphG, matOf(hex));
        m.scale.setScalar(r); m.position.set(x, y, z);
        (par || props).add(m); return m;
    }
    function tex(w, h, paint) {
        const c = document.createElement("canvas");
        c.width = w; c.height = h;
        paint(c.getContext("2d"), w, h);
        return new THREE.CanvasTexture(c);
    }
    /* Biển chữ: sprite luôn quay về phía máy quay */
    function sign(text, hex, fontSize, w, h, size) {
        const t = tex(w, h, (cx) => {
            cx.font = "bold " + fontSize + "px system-ui";
            cx.textAlign = "center"; cx.textBaseline = "middle";
            cx.lineWidth = 7; cx.strokeStyle = "rgba(20,30,60,.65)";
            cx.strokeText(text, w / 2, h / 2);
            cx.fillStyle = hex; cx.fillText(text, w / 2, h / 2);
        });
        const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false }));
        sp.scale.set(size * (w / h), size, 1);
        return sp;
    }
    function emojiSprite(text, size) {
        const t = tex(128, 128, (cx) => {
            cx.font = "96px serif"; cx.textAlign = "center"; cx.textBaseline = "middle";
            cx.fillText(text, 64, 70);
        });
        const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false }));
        sp.scale.set(size, size, 1);
        return sp;
    }
    /* Nền đất vẽ bằng canvas texture — lấy thẳng dữ liệu trang trí 2D (tufts/flw) */
    function ground(paint) {
        const S = 768;
        const t = tex(S, S, (cx) => paint(cx, S));
        const pg = new THREE.PlaneGeometry(WW / W3PX, WH / W3PX);
        const m = new THREE.Mesh(pg, new THREE.MeshLambertMaterial({ map: t }));
        m.rotation.x = -Math.PI / 2;
        props.add(m);
        return m;
    }
    /* Tô một hình chữ nhật của bản đồ 2D lên canvas nền */
    function wrect(cx, x, y, w, h, hex, S) {
        cx.fillStyle = hex;
        cx.fillRect(uX(x, S), uY(y + h, S), w / WW * S, h / WH * S);
    }

    /* Dọn sạch một nhóm khi đổi cảnh: geometry/vật liệu riêng của cảnh vừa rồi
       được giải phóng, chỉ giữ lại hình khối + vật liệu màu dùng chung. */
    function clearGroup(gr) {
        gr.traverse((o) => {
            if (o.isInstancedMesh) o.dispose();
            const m = o.material;
            if (m) {
                if (m.map) m.map.dispose();
                if (m.isSpriteMaterial || m.isMeshBasicMaterial || m.map) m.dispose();
            }
            if (o.geometry && shared.indexOf(o.geometry) < 0) o.geometry.dispose();
        });
        gr.clear();
    }

    /* ══════ CÂY ══════ */
    function buildTrees() {
        const n = trees.length || 1;
        const trunk = new THREE.InstancedMesh(cylG, matOf(0x8b5a2b), n);
        const leafA = new THREE.InstancedMesh(sphG, matOf(0x38b155), n);
        const leafB = new THREE.InstancedMesh(sphG, matOf(0x4cc866), n);
        const m = new THREE.Matrix4();
        trees.forEach((t, i) => {
            const x = xOf(t[0]), z = zOf(t[1]), s = t[2];
            m.makeScale(.17 * s, 1.25 * s, .17 * s).setPosition(x, .62 * s, z); trunk.setMatrixAt(i, m);
            m.makeScale(1.15 * s, 1 * s, 1.15 * s).setPosition(x, 1.8 * s, z); leafA.setMatrixAt(i, m);
            m.makeScale(.7 * s, .62 * s, .7 * s).setPosition(x - .18 * s, 2.45 * s, z); leafB.setMatrixAt(i, m);
        });
        trunk.instanceMatrix.needsUpdate = true;
        leafA.instanceMatrix.needsUpdate = true;
        leafB.instanceMatrix.needsUpdate = true;
        props.add(trunk, leafA, leafB);
    }

    /* ══════ SÂN TRƯỜNG ══════ */
    function buildOut() {
        scene.background = new THREE.Color(0x9fd8ff);
        scene.fog = new THREE.Fog(0x9fd8ff, 32, 130);

        ground((cx, S) => {
            const gr = cx.createLinearGradient(0, 0, 0, S);
            gr.addColorStop(0, "#8fdc78"); gr.addColorStop(1, "#6cc15a");
            cx.fillStyle = gr; cx.fillRect(0, 0, S, S);
            tufts.forEach(([x, y, r]) => {
                cx.fillStyle = r > .5 ? "#5fb44e" : "#9be58a";
                cx.fillRect(uX(x, S), uY(y, S), 3, 7);
            });
            // hồ nước (vẽ vào nền: 2D cũng không chặn đi lên hồ)
            cx.fillStyle = "#d7c9a8";
            cx.beginPath(); cx.ellipse(uX(360, S), uY(360, S), 160 / WW * S, 95 / WH * S, 0, 0, 7); cx.fill();
            cx.fillStyle = "#6cc4ef";
            cx.beginPath(); cx.ellipse(uX(360, S), uY(360, S), 145 / WW * S, 80 / WH * S, 0, 0, 7); cx.fill();
            // đường ngang + đường dọc (sân mới 2400 x 1400: trục ngang y=650 h=140, trục dọc x=1130 w=140)
            wrect(cx, 0, 644, WW, 152, "#b7bcc6", S);
            wrect(cx, 0, 650, WW, 140, "#d9dde3", S);
            wrect(cx, 1124, 0, 152, WH, "#b7bcc6", S);
            wrect(cx, 1130, 0, 140, WH, "#d9dde3", S);
            for (let x = 0; x < WW; x += 80) wrect(cx, x, 716, 40, 8, "rgba(255,255,255,.85)", S);
            wrect(cx, 800, 350, 800, 16, "#c9a77c", S);
            flw.forEach(f => {
                cx.fillStyle = f[2];
                cx.beginPath(); cx.arc(uX(f[0], S), uY(f[1], S), 3.4, 0, 7); cx.fill();
            });
        });

        // Dãy nhà trường: 2 khối ngang + tháp giữa (2D cấm đi vào 820..1580 × 90..352, tâm 1200)
        const hi = 6.2, dTop = 90, dBot = 352;
        const deep = (dBot - dTop) / W3PX;
        const zc = zOf((dTop + dBot) / 2), zS = zOf(dBot);
        const wing = (x0, x1) => {
            const w = (x1 - x0) / W3PX, x = xOf((x0 + x1) / 2);
            cube(w, hi, deep, 0xf7e6c2, x, hi / 2, zc);
            cube(w + .5, .5, deep + .5, 0xd1495b, x, hi + .25, zc);
            for (let i = 0; i < Math.max(1, Math.floor(w / 1.7)); i++) {
                const wx = x - w / 2 + 1 + i * 1.7;
                cube(1, 1.1, .12, 0x8fd0f0, wx, 2.1, zS - .1);
                cube(1, 1.1, .12, 0x8fd0f0, wx, 4.2, zS - .1);
            }
        };
        wing(820, 1120); wing(1280, 1580);

        const tw = (1280 - 1120) / W3PX, tx = xOf(1200);
        cube(tw, 9.4, deep, 0xc25b49, tx, 4.7, zc);
        const towerRoof = new THREE.Mesh(coneG, matOf(0x6b3a2a));
        towerRoof.rotation.y = Math.PI / 4;
        const rad = Math.hypot(tw, deep) / 1.25;
        towerRoof.scale.set(rad, 2.6, rad); towerRoof.position.set(tx, 10.7, zc); props.add(towerRoof);
        ball(.8, 0xffffff, tx, 7.4, zS - .1);
        cube(1.5, .35, .2, 0x2c3e66, tx, 5.6, zS - .05);
        const banner = sign("TRƯỜNG TIỂU HỌC VUI VẺ", "#ffd23f", 46, 512, 112, 1.5);
        banner.position.set(tx, 5.6, zS - .25); banner.userData.y = 5.6; marks.add(banner);
        cube(3.2, .3, 1, 0xcfcfd6, tx, .15, zS + .5);          // bậc thềm
        // Cột cờ trung tâm sân
        const m = new THREE.Mesh(cylG, matOf(0xdddddd));
        m.scale.set(.08, 5.5, .08); m.position.set(xOf(1200), 2.75, zOf(570)); props.add(m);
        cube(2.0, 1.3, .06, 0xe74c3c, xOf(1200) + 1.0, 4.8, zOf(570));

        buildTrees();

        // Đài phun nước lớn bên phải sân
        const basin = new THREE.Mesh(cylG, matOf(0x4fa3d1));
        basin.scale.set(1.6, .6, 1.6); basin.position.set(xOf(2120), .3, zOf(650)); props.add(basin);
        const jet = new THREE.Mesh(cylG, matOf(0x00d2ff));
        jet.scale.set(.35, 1.6, .35); jet.position.set(xOf(2120), 1.2, zOf(650)); props.add(jet);

        // Nhà / sân trong sân trường (P trong js/config.js)
        P.forEach((p) => {
            const lock = p.lv && S.lv < p.lv;
            const cx0 = xOf(p.x + p.w / 2);
            if (p.b) {
                const w = p.w / W3PX, bodyTop = p.y + 55, bodyH = p.h - 65;
                const d = bodyH / W3PX, zc2 = zOf(bodyTop + bodyH / 2);
                cube(w, bodyH / W3PX, d, hexOf(p.c), cx0, bodyH / W3PX / 2, zc2);
                const roof = new THREE.Mesh(coneG, matOf(hexOf(p.r || p.c)));
                roof.rotation.y = Math.PI / 4;
                const hr = Math.hypot(w, d) / 1.3;
                roof.scale.set(hr, 1.7, hr); roof.position.set(cx0, bodyH / W3PX + .8, zc2);
                props.add(roof);
                cube(1.1, 2, .18, 0x7a4a2a, cx0, 1, zOf(p.y + p.h - 12));
            } else {
                const w = p.w / W3PX, d = p.h / W3PX, zc2 = zOf(p.y + p.h / 2);
                cube(w, .14, d, lock ? 0x8fa0a0 : hexOf(p.c), cx0, .07, zc2);
                cube(w, .5, .12, 0xffffff, cx0, .25, zOf(p.y));
                cube(w, .5, .12, 0xffffff, cx0, .25, zOf(p.y + p.h));
                cube(.12, .5, d, 0xffffff, xOf(p.x), .25, zc2);
                cube(.12, .5, d, 0xffffff, xOf(p.x + p.w), .25, zc2);
                if (lock) {
                    const lk = sign("🔒 Mở ở cấp " + p.lv, "#ffffff", 40, 512, 96, 1);
                    lk.position.set(cx0, 1.3, zc2); lk.userData.y = 1.3; marks.add(lk);
                } else if (p.id === "garden") {
                    ["🌷", "🌼", "🌻"].forEach((e, i) => {
                        for (let j = 0; j < 5; j++) {
                            const s = emojiSprite(e, .6);
                            s.position.set(xOf(p.x + 50 + j * 66), .5, zOf(p.y + 80 + i * 80));
                            props.add(s);
                        }
                    });
                } else if (p.id === "gym" || p.id === "pet") {
                    [["🐶", 80, 170], ["🐱", 290, 120], ["🐾", 190, 250]].forEach(([e, ox, oy]) => {
                        const s = emojiSprite(e, 1.1);
                        s.position.set(xOf(p.x + ox), .7, zOf(p.y + oy)); props.add(s);
                    });
                }
            }
        });
    }

    /* ══════ HÀNH LANG ══════ */
    function buildHall(level) {
        scene.background = new THREE.Color(0xe9f1fb);
        scene.fog = null;
        const yWall = 195, hi = 3.4;
        const doors = level === 1
            ? KS.map(k => ({ x: DX[k] + 25, w: 160, hex: hexOf(RM[k].c) }))
            : [{ x: DX.lib + 25, w: 160, hex: hexOf(RM.lib.c) }];

        ground((cx, S) => {
            const gr = cx.createLinearGradient(0, uY(420, S), 0, uY(170, S));
            gr.addColorStop(0, "#d9c7a4"); gr.addColorStop(1, "#ecdfc6");
            cx.fillStyle = gr; cx.fillRect(0, 0, S, S);
            cx.fillStyle = "rgba(0,0,0,.05)";
            for (let i = 0; i < 29; i++) for (let j = 0; j < 5; j++) {
                if ((i + j) % 2) cx.fillRect(uX(i * 60, S), uY(170 + (j + 1) * 60, S), 60 / WW * S, 60 / WH * S);
            }
            wrect(cx, 0, 166, WW, 8, "#8b6b4a", S);
        });

        // khối tường lớp học phía bắc (2D cấm đi vào y < 195)
        cube(WW / W3PX, hi, yWall / W3PX, 0xf3d9b8, 0, hi / 2, zOf(yWall / 2));
        cube(.3, hi, (WH - yWall) / W3PX, 0xe7d3ac, xOf(WW - 6), hi / 2, zOf((WH + yWall) / 2));
        // lan can thấp phía nam để máy quay không bị che
        cube(WW / W3PX, .85, .12, 0xcfe0f5, 0, .42, zOf(WH - 8));

        // cửa lớp dọc tường phía bắc
        let cur = 0;
        doors.forEach((d) => {
            const a = d.x - d.w / 2, b = d.x + d.w / 2;
            if (a > cur) cube((a - cur) / W3PX, hi, .34, 0xf6e7c8, xOf((cur + a) / 2), hi / 2, zOf(yWall));
            const px = xOf(d.x), pz = zOf(yWall), half = d.w / W3PX / 2;
            cube(d.w / W3PX, hi - 2.4, .34, 0xf6e7c8, px, hi - (hi - 2.4) / 2, pz);
            cube(.22, 2.4, .42, d.hex, px - half, 1.2, pz);
            cube(.22, 2.4, .42, d.hex, px + half, 1.2, pz);
            cube(d.w / W3PX * .8, .12, .5, d.hex, px, .06, pz + .35);
            cur = b;
        });
        if (cur < WW) cube((WW - cur) / W3PX, hi, .34, 0xf6e7c8, xOf((cur + WW) / 2), hi / 2, zOf(yWall));

        if (level === 2) {
            // tường tầng 2 có cửa sổ lớn nhìn ra sân
            [140, 340, 1290, 1490].forEach(wx => {
                const w = 130 / W3PX, x = xOf(wx + 65);
                cube(w + .2, 2, .2, 0xffffff, x, 2.1, zOf(yWall) - .02);
                cube(w, 1.6, .3, 0x9fd8ff, x, 2.1, zOf(yWall) - .12);
            });
        } else {
            KS.forEach((k) => {
                const px = xOf(DX[k] + 130), pz = zOf(yWall);
                for (let j = 0; j < 3; j++)
                    cube(1.2, 1.3, .1, [0xe17055, 0xfdcb6e, 0x74b9ff][(KS.indexOf(k) + j) % 3], px + j * .8, 2.1, pz - .06);
            });
        }

        // chậu cây cảnh dọc tường
        [170, 500, 820, 1180, 1500].forEach(x => {
            const s = emojiSprite("🪴", .8);
            s.position.set(xOf(x), .45, zOf(208)); props.add(s);
        });

        // cầu thang bộ cuối hành lang (vùng 1560..1700 của ZN())
        const sx = xOf(1630), sz = zOf(300);
        for (let i = 0; i < 9; i++)
            cube(3, .26, .6, i % 2 ? 0xd9c49a : 0xe8d5ae, sx, .13 + i * .26, sz + 2 - i * .55);
        cube(3.2, 2.6, .3, 0xb99a6b, sx, 1.3, sz + 2.6);

        // cửa ra sân phía tây
        cube(.3, 2.6, 3, 0x9fd8ff, xOf(12), 1.3, zOf(300));
    }

    /* ══════ LỚP HỌC ══════ */
    function buildRoom(r) {
        const info = RM[r];
        scene.background = new THREE.Color(hexOf(info.f));
        scene.fog = null;
        const yTop = 280, xL = 60, xR = 940, hi = 3.4;

        ground((cx, S) => {
            cx.fillStyle = info.f; cx.fillRect(0, 0, S, S);
            cx.fillStyle = "rgba(0,0,0,.06)";
            for (let i = 0; i < 20; i++) for (let j = 0; j < 12; j++) {
                if ((i + j) % 2) cx.fillRect(uX(i * 50, S), uY((j + 1) * 50, S), 50 / WW * S, 50 / WH * S);
            }
            wrect(cx, 0, 128, WW, 14, "#8b6b4a", S);
        });

        // bục giảng: dải cấm đi vào y < 280 làm bệ thấp + tường hậu
        const stageW = (xR - xL) / W3PX, stageZ = zOf(yTop / 2);
        cube(stageW, .34, yTop / W3PX, 0xe6d3ae, xOf((xL + xR) / 2), .17, stageZ);
        cube(stageW, hi, 36 / W3PX, 0xf6efdd, xOf((xL + xR) / 2), hi / 2, zOf(18));

        const bx = xOf(500), bz = zOf(52);
        const boardTex = tex(1024, 320, (cx, w, h) => {
            cx.fillStyle = "#7a5230"; cx.fillRect(0, 0, w, h);
            cx.fillStyle = "#2f5d4a"; cx.fillRect(20, 18, w - 40, h - 36);
            cx.fillStyle = "#fff8e6"; cx.font = "bold 56px system-ui";
            cx.textAlign = "center"; cx.textBaseline = "middle";
            cx.fillText(info.e + "  " + info.b, w / 2, h / 2);
        });
        const pg = new THREE.PlaneGeometry(8, 2.4);
        const board = new THREE.Mesh(pg, new THREE.MeshBasicMaterial({ map: boardTex }));
        board.position.set(bx, 2.1, bz + .1); props.add(board);
        cube(6, 2.8, .2, 0x7a5230, bx, 2.1, bz - .05);
        const clock = ball(.55, 0xffffff, xOf(110), 2.4, zOf(60) + .2);
        clock.scale.set(.55, .55, .2);
        [xOf(50), xOf(950)].forEach(x => { const s = emojiSprite(info.e, 1); s.position.set(x, 1.8, zOf(170)); props.add(s); });
        const win = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.6), new THREE.MeshBasicMaterial({ color: 0x9fd8ff }));
        win.position.set(xOf(885), 2.2, zOf(64) + .22); props.add(win);
        cube(2.7, 1.9, .12, 0xffffff, xOf(885), 2.2, zOf(64) + .12);

        cube(1.9, .95, 1.05, 0x9c6b3f, xOf(500), .82, zOf(250));       // bàn giáo viên
        const apple = emojiSprite("🍎", .4); apple.position.set(xOf(460), 1.5, zOf(250)); props.add(apple);
        cube(3.5, .3, 1.1, 0x7a4a2a, xOf(500), .15, zOf(577));          // bục dưới (như 2D)

        // tường bao tây/đông + lan can nam
        cube(.3, hi, (WH - yTop) / W3PX, 0xdfe6f0, xOf(xL), hi / 2, zOf((WH + yTop) / 2));
        cube(.3, hi, (WH - yTop) / W3PX, 0xdfe6f0, xOf(xR), hi / 2, zOf((WH + yTop) / 2));
        cube(stageW, .85, .12, 0xcfe0f5, xOf((xL + xR) / 2), .42, zOf(WH - 6));

        desks.forEach((d) => {
            const x = xOf(d[0] + 45), z = zOf(d[1] + 28);
            cube(2, .12, .85, 0xc68b4e, x, .74, z);
            [[-.85, -.3], [.85, -.3], [-.85, .3], [.85, .3]].forEach(([ox, oz]) =>
                cube(.12, .74, .12, 0x7a5230, x + ox, .37, z + oz));
            cube(.9, .1, .5, 0xffffff, x, .82, z - .1);                 // quyển vở
            cube(.55, .45, .55, 0xd9b382, x, .22, z + .8);               // ghế
        });

        if (r === "lib") {
            [70, 810].forEach(bx0 => {
                const x = xOf(bx0 + 60), z = zOf(220);
                cube(2.7, 3.1, .8, 0x8b5a2b, x, 1.55, z);
                for (let i = 0; i < 2; i++) for (let j = 0; j < 6; j++)
                    cube(.3, .9, .5, [0xe17055, 0xfdcb6e, 0x74b9ff, 0x55b36a, 0xe07aa8, 0x8f7ae0][(i + j) % 6],
                        x - 1.1 + j * .44, 1 + i * 1.2, z + .18);
            });
        }
    }

    /* ══════ biển vùng — cùng dữ liệu với ZN() ══════ */
    function zoneText(z) {
        if (z.id === "school") return "🏫 Vào trường";
        if (z.id === "out") return "🚪 Ra sân trường";
        if (z.id === "stairs") return "🪜 Lên tầng 2";
        if (z.id === "down") return "🪜 Xuống tầng 1";
        if (z.id.slice(0, 2) === "d_") return "🚪 " + RM[z.id.slice(2)].n;
        if (z.id === "teach") return rk === "lib" ? "📖 Đứng đây để đọc truyện" : "📚 Đứng đây để học";
        const p = P.find(x => x.id === z.id);
        return p ? (p.lv && S.lv < p.lv ? "🔒 Mở ở cấp " + p.lv : p.n) : "⭐ " + z.id;
    }
    function buildMarks() {
        ZN().forEach((z) => {
            const s = sign(zoneText(z), "#fff3c4", 36, 512, 92, .8);
            s.position.set(xOf(z.x + z.w / 2), 1.5, zOf(z.y + z.h / 2));
            s.userData.y = 1.5;
            marks.add(s);
        });
    }

    /* ══════ nhân vật ══════ */
    function limb(hex, w, h, d, x, y, z, par) {
        const p = new THREE.Group(); p.position.set(x, y, z); par.add(p);
        const b = new THREE.Mesh(boxG, matOf(hex));
        b.scale.set(w, h, d); b.position.set(0, -h / 2, 0); p.add(b);
        return p;
    }
    function makeKid(cssHex, hat, name) {
        const root = new THREE.Group();
        const body = new THREE.Group(); body.position.y = .62; root.add(body);
        const kid = { root, body, face: 0 };
        kid.legL = limb(0x3b4a7a, .17, .5, .19, -.11, .62, 0, root);
        kid.legR = limb(0x3b4a7a, .17, .5, .19, .11, .62, 0, root);
        cube(.2, .1, .3, 0xffffff, 0, -.5, -.05, kid.legL);
        cube(.2, .1, .3, 0xffffff, 0, -.5, -.05, kid.legR);
        cube(.54, .5, .34, cssHex, 0, .22, 0, body);
        kid.armL = limb(cssHex, .14, .42, .15, -.34, .44, 0, body);
        kid.armR = limb(cssHex, .14, .42, .15, .34, .44, 0, body);
        ball(.08, 0xffe0bd, 0, -.44, 0, kid.armL);
        ball(.08, 0xffe0bd, 0, -.44, 0, kid.armR);
        const head = new THREE.Group(); head.position.y = .7; body.add(head);
        ball(.22, 0xffe0bd, 0, 0, 0, head);
        ball(.23, 0x4a3426, 0, .09, .02, head);
        ball(.035, 0x222244, -.075, .01, -.2, head);
        ball(.035, 0x222244, .075, .01, -.2, head);
        if (hat) { const e = emojiSprite(hat, .5); e.position.set(0, .4, -.02); head.add(e); }
        if (name) {
            const n = sign(name, "#ffffff", 46, 256, 88, .62);
            n.position.set(0, 1.8, 0); root.add(n);
        }
        return kid;
    }
    function pose(kid, t, mv) {
        const a = Math.min(1, .2 + mv), s = Math.sin(t);
        kid.legL.rotation.x = s * a; kid.legR.rotation.x = -s * a;
        kid.armL.rotation.x = -s * a * .8; kid.armR.rotation.x = s * a * .8;
        kid.body.position.y = .62 + Math.abs(Math.cos(t)) * .04 * a;
    }
    function place(kid, x2, y2, face) {
        kid.root.position.set(xOf(x2), 0, zOf(y2));
        kid.root.rotation.y = face;
    }
    function putKid(o, maker) {
        if (!o._kid) o._kid = maker();
        if (!o._kid.added) { kids.add(o._kid.root); o._kid.added = true; }
        return o._kid;
    }
    function hideKid(o) {
        if (o && o._kid && o._kid.added) { kids.remove(o._kid.root); o._kid.added = false; }
    }

    let player = null, playerKey = "";
    const teacherObj = {};

    function syncKids(force) {
        const key = S.col + "|" + S.hat + "|" + playerName;
        if (!player || key !== playerKey) {
            if (player) kids.remove(player.root);
            player = makeKid(hexOf(S.col), S.hat, playerName);
            playerKey = key;
            kids.add(player.root);
        }
        if (!force) return;
        npcs.forEach(n => { n._kid = null; });
        studs.forEach(s => { s._kid = null; });
        teacherObj._kid = null;
    }

    function updateKids() {
        npcs.forEach((n) => {
            if (n.sc !== sc) return hideKid(n);
            const k = putKid(n, () => makeKid(hexOf(n.c), n.h, n.n));
            place(k, n.x, n.y, Math.atan2(-(n.tx - n.x), -(n.ty - n.y)));
            pose(k, tt * 9 + n.x * .1, n.mv);
        });
        if (sc === "room") {
            studs.forEach((s) => {
                if (!s.on) return hideKid(s);
                const k = putKid(s, () => makeKid(hexOf(s.c), "", s.n));
                place(k, s.x, s.y + 34, 0);                  // quay lên bảng
                k.legL.rotation.x = k.legR.rotation.x = 1.2; // ngồi
                k.armL.rotation.x = k.armR.rotation.x = .9;
            });
            const info = RM[rk];
            const t = putKid(teacherObj, () => makeKid(hexOf(info.c), "🎓", info.t));
            place(t, 500, 226, Math.PI);                     // giáo viên quay ra lớp
            t.root.position.y = .34;                         // đứng trên bục giảng
        } else {
            studs.forEach(hideKid);
            hideKid(teacherObj);
        }

        const vx = me.dx || 0, vy = me.dy || 0;
        const spd = Math.hypot(vx, vy);
        if (spd > .04) player.face = Math.atan2(-vx, -vy);
        place(player, me.x, me.y, player.face);
        pose(player, me.t * 1.4 + tt * 4, me.mv);

        // hoa nhiệm vụ 🌸 hiện ngoài sân
        if (sc === "out") {
            flowers.forEach((f) => {
                if (!f._s) { f._s = emojiSprite("🌸", .7); flowerG.add(f._s); }
                f._s.position.set(xOf(f.x), .55 + Math.sin(tt * 3 + f.x) * .08, zOf(f.y));
            });
            for (let i = flowerG.children.length - 1; i >= 0; i--) {
                const c = flowerG.children[i];
                if (flowers.some(f => f._s === c)) continue;
                if (c.material && c.material.map) c.material.map.dispose();
                flowerG.remove(c);
            }
        } else if (flowerG.children.length) {
            flowerG.children.forEach(c => { if (c.material && c.material.map) c.material.map.dispose(); });
            flowerG.clear();
        }
    }

    /* ══════ máy quay sau vai ══════ */
    let yaw = 0, yawT = 0, pit = .34, dist = 4.3, drag = 0, dragId = null, dragX = 0, settled = false;
    stage.addEventListener("pointerdown", (e) => {
        if (open_ || e.button) return;
        dragId = e.pointerId; dragX = e.clientX;
        try { stage.setPointerCapture(dragId); } catch (err) { }
    });
    stage.addEventListener("pointermove", (e) => {
        if (e.pointerId !== dragId) return;
        yawT -= (e.clientX - dragX) * .006; dragX = e.clientX; drag = 1.2;
    });
    const endDrag = (e) => { if (e.pointerId === dragId) dragId = null; };
    stage.addEventListener("pointerup", endDrag);
    stage.addEventListener("pointercancel", endDrag);

    function resize() {
        const w = Math.max(1, innerWidth), h = Math.max(1, innerHeight);
        renderer.setSize(w, h);
        camera.aspect = w / h; camera.fov = w < h ? 68 : 58;
        camera.updateProjectionMatrix();
    }
    addEventListener("resize", resize);
    resize();

    /* ══════ đổi cảnh ══════ */
    function enter() {
        WW = D[sc][0]; WH = D[sc][1];
        clearGroup(props); clearGroup(marks); clearGroup(flowerG); clearGroup(kids);
        if (sc === "out") buildOut();
        else if (sc === "hall") buildHall(1);
        else if (sc === "hall2") buildHall(2);
        else buildRoom(rk);
        buildMarks();
        player = null; playerKey = "";
        npcs.forEach(n => { n._kid = null; });
        studs.forEach(s => { s._kid = null; });
        teacherObj._kid = null;
        flowers.forEach(f => { f._s = null; });
        settled = false; yawT = yaw;
        syncKids(true);
    }

    const camTarget = new THREE.Vector3();
    const camWant = new THREE.Vector3();
    function frame(dt) {
        syncKids(false);   // bé đổi áo/mũ trong Cửa hàng là tạo hình đổi theo
        updateKids();

        const spd = Math.hypot(me.dx || 0, me.dy || 0);
        if (spd > .08 && !dragId) yawT = Math.atan2(-(me.dx || 0), -(me.dy || 0));
        drag = Math.max(0, drag - dt);
        const ease = drag || dragId ? 10 : (spd > .08 ? 3.2 : 1.1);
        yaw += Math.atan2(Math.sin(yawT - yaw), Math.cos(yawT - yaw)) * Math.min(1, dt * ease);

        const px = xOf(me.x), pz = zOf(me.y);
        camTarget.set(px, 1.25, pz);
        const cp = Math.cos(pit) * dist;
        camWant.set(px + Math.sin(yaw) * cp, 1.25 + Math.sin(pit) * dist, pz + Math.cos(yaw) * cp);
        if (!settled) { camera.position.copy(camWant); settled = true; }
        else camera.position.lerp(camWant, Math.min(1, dt * 8));
        camera.lookAt(camTarget);

        marks.children.forEach((m, i) => {
            m.position.y = (m.userData.y || 1.5) + Math.sin(tt * 2 + i) * .06;
        });
        renderer.render(scene, camera);
    }

    /* ══════ lớp vẽ 2D phủ trên: chữ +x, đồng hồ hái hoa, tối màn ══════ */
    const pv = new THREE.Vector3();
    function project(x2, y2, up) {
        pv.set(xOf(x2), up || 0, zOf(y2));
        pv.project(camera);
        if (pv.z > 1) return null;
        return { x: (pv.x + 1) / 2 * W, y: (1 - pv.y) / 2 * H };
    }
    function overlay() {
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
        g.clearRect(0, 0, W, H);
        ft.forEach((f) => {
            const p = project(f.x, f.y, 1.7);
            if (!p) return;
            g.globalAlpha = Math.min(1, f.t);
            tx(f.s, p.x, p.y - (1.4 - f.t) * 40, 18, "#ffd23f", "rgba(0,0,0,.7)");
            g.globalAlpha = 1;
        });
        if (ftime > 0) tx("⏱ " + Math.ceil(ftime) + "s  🌸 còn " + flowers.length, W / 2, 90, 20, "#fff", "rgba(0,0,0,.6)");
        const v = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .45, W / 2, H / 2, Math.max(W, H) * .75);
        v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,30,.3)");
        g.fillStyle = v; g.fillRect(0, 0, W, H);
        if (fade > 0) { g.fillStyle = "rgba(0,0,0," + fade + ")"; g.fillRect(0, 0, W, H); }
    }

    enter();
    if (DEBUG3D) window.__w3 = {
        scene, camera, props, marks, kids, renderer,
        get player() { return player; }, get yaw() { return yaw; }, get pit() { return pit; },
        get dist() { return dist; }, get world() { return [WW, WH]; }, xOf, zOf,
    };
    return { yaw: () => yaw, frame, overlay, enter, get ok() { return true; } };
}
`,N=`@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@600;700;800&display=swap');

*{box-sizing:border-box;-webkit-user-select:none;user-select:none;touch-action:none}
html,body{margin:0;height:100%;overflow:hidden;background:#f0f5ff;font-family:'Quicksand',system-ui,sans-serif}
canvas{display:block;width:100%;height:100%}

/* 3D canvas */
#gl{position:fixed;inset:0;z-index:0;background:#e0f7ff}
#c{position:fixed;inset:0;z-index:1;pointer-events:none}

/* Glass‑morphism HUD pills */
.pill{
  position:fixed;z-index:2;
  background:rgba(255,255,255,.12);
  backdrop-filter:blur(12px);
  border-radius:16px;
  padding:6px 14px;
  color:#222;
  font-weight:600;
  font-size:14px;
  box-shadow:0 8px 20px rgba(0,0,0,.12);
  transition:transform .2s;
}
.pill:hover{transform:scale(1.04);}

/* specific pills */
#lv{top:calc(8px + env(safe-area-inset-top,0px));left:8px;min-width:140px}
#cur{top:calc(8px + env(safe-area-inset-top,0px));right:8px;display:flex;gap:12px}
#qp{top:calc(52px + env(safe-area-inset-top,0px));right:8px;font-size:12px;font-weight:600;line-height:1.5;border-radius:12px;max-width:210px;background:rgba(255,255,255,.2);backdrop-filter:blur(8px)}
#en{
  top:calc(8px + env(safe-area-inset-top,0px));
  left:50%;transform:translateX(-50%);
  min-width:140px;
  background:rgba(255,255,255,.2);
  backdrop-filter:blur(8px);
}
#en #eni{display:block;height:100%;background:linear-gradient(90deg,#5be37d,#3aa76a);width:0;transition:width .3s}
#loc{top:calc(46px + env(safe-area-inset-top,0px));left:50%;transform:translateX(-50%);}

/* Buttons – keep same z‑index */
#cfg,#sched,#quit,#btn-garden,#btn-pet{
  position:fixed;z-index:2;
  top:calc(52px + env(safe-area-inset-top,0px));
  border:none;border-radius:20px;
  padding:6px 14px;
  background:rgba(30,40,70,.8);
  color:#fff;font-weight:700;font-size:13px;
  cursor:pointer;transition:background .2s,transform .2s;
}
#cfg{left:8px}
#sched{left:104px}
#quit{left:232px}
#btn-garden{left:350px}
#btn-pet{left:492px}
#cfg:hover,#sched:hover,#quit:hover,#btn-garden:hover,#btn-pet:hover{background:rgba(30,40,70,1);transform:translateY(-2px);}

/* Clock */
#clk{position:fixed;top:calc(86px + env(safe-area-inset-top,0px));left:8px;font-size:12px}

/* Joystick */
#joy{
  position:fixed;z-index:4;left:30px;bottom:calc(26px + env(safe-area-inset-bottom,0px));
  width:120px;height:120px;border-radius:50%;
  background:rgba(255,255,255,.25);backdrop-filter:blur(8px);
}
#knob{
  position:absolute;left:35px;top:35px;width:50px;height:50px;border-radius:50%;
  background:rgba(255,255,255,.9);
  box-shadow:0 4px 8px rgba(0,0,0,.2);
}

/* Toast & Modal */
#toast{
  position:fixed;z-index:7;top:30%;left:50%;transform:translateX(-50%);
  background:#fff;color:#223;padding:12px 24px;border-radius:20px;
  font-weight:700;box-shadow:0 4px 14px rgba(0,0,0,.2);
  display:none;
}
#modal{position:fixed;z-index:6;inset:0;background:#0007;display:none;align-items:center;justify-content:center;padding:10px;}
#box{
  background:#fffdf5;color:#223;border-radius:22px;padding:20px 24px;
  width:min(560px,100%);max-height:96%;overflow:auto;text-align:center;
  box-shadow:0 8px 20px rgba(0,0,0,.15);
}

/* NPC chat card */
#npcchat{
  position:fixed;left:50%;transform:translateX(-50%);
  bottom:calc(18px + env(safe-area-inset-bottom,0px));
  width:min(480px,92%);
  background:#fffdf5;color:#223;border-radius:18px;
  padding:10px 14px;display:none;align-items:flex-start;gap:10px;
  box-shadow:0 6px 18px rgba(0,0,0,.15);z-index:5;
}
#npcchat.on{display:flex}
#npcav{width:44px;height:44px;border-radius:50%;background:#ffe3c2;display:flex;align-items:center;justify-content:center;font-size:26px;flex:none;border:3px solid #ff7a59;}
.npcbody{flex:1;min-width:0}
#npcname{font-weight:800;font-size:13px;color:#c4502f}
#npcmsg{font-size:14px;line-height:1.45;margin:3px 0 6px}
#npcrep{display:flex;flex-wrap:wrap;gap:6px}
#npcrep button{border:none;border-radius:12px;padding:6px 12px;font-size:12.5px;font-weight:700;background:#e8f0ff;color:#223;box-shadow:0 2px 0 #b9c8ee;cursor:pointer;}
#npcrep button.end{background:#ffd23f;box-shadow:0 2px 0 #c9a200}

/* Bell */
#bell{position:fixed;top:calc(8px + env(safe-area-inset-top,0px));left:50%;transform:translateX(-50%) translateY(52px);background:#ff7a59;color:#fff;border-radius:16px;padding:6px 14px;font-weight:800;font-size:13px;display:none;z-index:3;box-shadow:0 4px 0 #c4502f;}

/* Tables */
.ttab{width:100%;border-collapse:collapse;font-size:13px;margin:8px 0;text-align:left}
.ttab th,.ttab td{padding:6px 8px;border-bottom:1px solid #eee}
.ttab tr.now{background:#fff3c4;font-weight:800}
.ttab tr.next{background:#e8f6ff}
.ttab .tag{display:inline-block;padding:2px 8px;border-radius:10px;background:#e8f0ff;font-size:11px}
.ttab .tag.exam{background:#ffe0d6}

/* Textarea */
textarea{width:100%;height:210px;font:11px/1.4 ui-monospace,Menlo,monospace;user-select:text;touch-action:auto;border-radius:10px;border:2px solid #ccd;padding:8px;text-align:left}
#er{color:#c0392b;font-weight:700;font-size:13px;min-height:18px}

/* Rotate notice */
#rot{position:fixed;inset:0;background:#223;color:#fff;display:none;align-items:center;justify-content:center;font-size:22px;text-align:center;padding:20px;z-index:9}
@media (orientation:portrait){#rot{display:flex}}
`,P=e(t(),1),F=`edu_school_coin_reward_v1`,I=100,L=60,R=/^(quest:|highscore:|perfect:)/;function z(){let e=new Date,t=e=>String(e).padStart(2,`0`);return`${e.getFullYear()}-${t(e.getMonth()+1)}-${t(e.getDate())}`}function B(){try{let e=JSON.parse(localStorage.getItem(F)||`null`);if(e&&e.date===z()&&Number.isFinite(e.granted))return e}catch{}return{date:z(),granted:0}}function V(e){try{localStorage.setItem(F,JSON.stringify(e))}catch{}}async function H(e,t=``){let n=Math.round(Number(e)),a=e=>({granted:!1,amount:n||0,code:e,cap:I,today:B().granted});if(!Number.isInteger(n)||n<=0||n>L||!R.test(String(t)))return a(`invalid`);if(!i()?.token)return a(`noauth`);let o=B();if(o.granted+n>I)return a(`cap`);try{await r.addCoins(n)}catch{return a(`offline`)}return o.granted+=n,V(o),{granted:!0,amount:n,code:`ok`,cap:I,today:o.granted}}var U=`<!DOCTYPE html>
<html lang="vi"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Trường Vui Vẻ</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
</head><body>
<div id="gl"></div>
<canvas id="c"></canvas>
<div class="pill" id="lv"><span id="lvt"></span><div id="bar"><i></i></div></div>
<div class="pill" id="cur"><span id="coin"></span><span id="gem"></span></div>
<div class="pill" id="qp"></div>
<div class="pill" id="en">⚡ Năng lượng<div id="bar2"><i id="eni"></i></div></div>
<div class="pill" id="loc"></div>
<button id="sched" type="button">📅 Thời khóa biểu</button>
<button id="btn-garden" type="button">🌸 Vườn trường</button>
<button id="btn-pet" type="button">🐾 Thú cưng</button>
<button id="cfg" type="button">⚙️ Cài đặt</button>
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
<script src="js/garden.js"><\/script>
<script src="js/settings.js"><\/script>
<script src="js/world.js"><\/script>
<script src="js/input.js"><\/script>
<script src="js/characters.js"><\/script>
<script src="js/sync.js"><\/script>
<script src="js/scenes.js"><\/script>
<!-- Thư viện 3D (như Leo Tháp Mây). Không tải được => js/world3d.js trả null
     và js/render.js tự chuyển về lối vẽ 2D cũ, game vẫn chơi được. -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"><\/script>
<script src="js/world3d.js"><\/script>
<script src="js/render.js"><\/script>
<script src="js/main.js"><\/script>
</body></html>
`,W={useRealTime:!0,simulateTime:null,demoMode:!1,earlyMinutes:5,graceMinutes:10,notifyBeforeMinutes:2,autoEnterClass:!0,allowFreePractice:!0,requireOnTimeForLesson:!0,schoolName:`Trường Vui Vẻ`,timetable:[{day:1,start:`07:30`,end:`08:15`,subject:`math`,type:`lesson`,title:`Toán`},{day:1,start:`08:20`,end:`09:05`,subject:`van`,type:`lesson`,title:`Ngữ văn`},{day:1,start:`09:15`,end:`10:00`,subject:`eng`,type:`lesson`,title:`Tiếng Anh`},{day:1,start:`10:10`,end:`10:55`,subject:`math`,type:`exam`,examId:`thi_toan_1`,title:`Kiểm tra Toán`},{day:2,start:`07:30`,end:`08:15`,subject:`eng`,type:`lesson`,title:`Tiếng Anh`},{day:2,start:`08:20`,end:`09:05`,subject:`math`,type:`lesson`,title:`Toán`},{day:2,start:`09:15`,end:`10:00`,subject:`van`,type:`lesson`,title:`Ngữ văn`},{day:2,start:`10:10`,end:`10:55`,subject:`eng`,type:`exam`,examId:`thi_anh_1`,title:`Bài thi Tiếng Anh`},{day:3,start:`07:30`,end:`08:15`,subject:`van`,type:`lesson`,title:`Ngữ văn`},{day:3,start:`08:20`,end:`09:05`,subject:`eng`,type:`lesson`,title:`Tiếng Anh`},{day:3,start:`09:15`,end:`10:00`,subject:`math`,type:`lesson`,title:`Toán`},{day:3,start:`10:10`,end:`10:55`,subject:`van`,type:`exam`,examId:`thi_van_1`,title:`Bài thi Ngữ văn`},{day:4,start:`07:30`,end:`08:15`,subject:`math`,type:`lesson`,title:`Toán`},{day:4,start:`08:20`,end:`09:05`,subject:`eng`,type:`lesson`,title:`Tiếng Anh`},{day:4,start:`09:15`,end:`10:00`,subject:`van`,type:`lesson`,title:`Ngữ văn`},{day:4,start:`10:10`,end:`10:55`,subject:`sci`,type:`lesson`,title:`Khoa học`},{day:5,start:`07:30`,end:`08:15`,subject:`eng`,type:`lesson`,title:`Tiếng Anh`},{day:5,start:`08:20`,end:`09:05`,subject:`van`,type:`lesson`,title:`Ngữ văn`},{day:5,start:`09:15`,end:`10:00`,subject:`math`,type:`lesson`,title:`Toán`},{day:5,start:`10:10`,end:`10:55`,subject:`math`,type:`exam`,examId:`thi_toan_2`,title:`Kiểm tra Toán giữa tuần`}]},G=n(),K=`school-mission`,q=[`js/core.js`,`data/questions.js`,`data/schedule.js`,`js/schedule.js`,`js/state.js`,`js/config.js`,`js/data.js`,`js/questions.js`,`js/ui.js`,`js/activities.js`,`js/garden.js`,`js/settings.js`,`js/world.js`,`js/input.js`,`js/characters.js`,`js/sync.js`,`js/scenes.js`,`js/world3d.js`,`js/render.js`,`js/main.js`],J=Object.assign({"../games/school_mission/config.js":p,"../games/school_mission/data/questions.js":m,"../games/school_mission/data/schedule.js":h,"../games/school_mission/js/activities.js":g,"../games/school_mission/js/characters.js":_,"../games/school_mission/js/config.js":te,"../games/school_mission/js/core.js":v,"../games/school_mission/js/data.js":y,"../games/school_mission/js/garden.js":b,"../games/school_mission/js/input.js":x,"../games/school_mission/js/main.js":S,"../games/school_mission/js/questions.js":C,"../games/school_mission/js/render.js":w,"../games/school_mission/js/scenes.js":T,"../games/school_mission/js/schedule.js":E,"../games/school_mission/js/settings.js":D,"../games/school_mission/js/state.js":O,"../games/school_mission/js/sync.js":k,"../games/school_mission/js/ui.js":A,"../games/school_mission/js/world.js":j,"../games/school_mission/js/world3d.js":M}),Y=Object.assign({"../games/school_mission/css/style.css":N});function X(e,t){let n=`/${t}/`;return Object.fromEntries(Object.entries(e).map(([e,t])=>{let r=e.replace(/\\/g,`/`),i=r.lastIndexOf(n);return[i>=0?r.slice(i+n.length):r.split(`/`).pop(),typeof t==`string`?t:t?.default||``]}))}var Z=X(J,`school_mission`),Q=X(Y,`school_mission`);function ne(e){return e.replace(/[.*+?^${}()|[\]\\]/g,`\\$&`)}function $(e){return JSON.stringify(e).replace(/</g,`\\u003c`).replace(/>/g,`\\u003e`).replace(/&/g,`\\u0026`).replace(/\u2028/g,`\\u2028`).replace(/\u2029/g,`\\u2029`)}function re(e,t){let n=null;return Promise.race([Promise.resolve(e).finally(()=>clearTimeout(n)),new Promise((e,r)=>{n=setTimeout(()=>r(Error(`timeout`)),t)})])}function ie(){let e=(0,P.useRef)(null),{user:t,token:n}=s(),[r,i]=(0,P.useState)(null),p=t?.name||t?.fullName||t?.username||`Bạn`;(0,P.useEffect)(()=>{let e=!1;return(async()=>{let t=typeof navigator>`u`||navigator.onLine!==!1,r=null;if(n&&t)try{r=(await re(o.getGame(K),2500))?.gameState||null}catch{}e||i({savedState:r,playerName:p})})(),()=>{e=!0}},[n,p]),(0,P.useEffect)(()=>{if(n)return c()},[n]),(0,P.useEffect)(()=>{let t=t=>{if(t.source!==e.current?.contentWindow)return;let r=t.data;if(!(!r||typeof r!=`object`)){if(r.type===`quit`)f(`/`);else if(r.type===`school-save`)n&&u(r.data);else if(r.type===`school-ready`)n&&ee();else if(r.type===`school-exam-result`)n&&r.data&&a.create({gameId:K,...r.data}).catch(()=>{});else if(r.type===`school-coin`)H(r.data?.amount,r.data?.reason).then(t=>{e.current?.contentWindow?.postMessage({type:`school-coin-result`,data:t},`*`)});else if(r.type===`gq:walletDelta`){let e=Number(r.data?.amount)||0;e!==0&&d(e)}else if(r.type===`gq:walletGet`){let t=l();e.current?.contentWindow?.postMessage({type:`gq:wallet`,coins:t.coins},`*`)}}};return window.addEventListener(`message`,t),()=>window.removeEventListener(`message`,t)},[n]);let m=(0,P.useMemo)(()=>{if(!r)return``;let e=U,t=Q[`css/style.css`]||``;t&&(e=e.replace(/<link[^>]*href=["']css\/style\.css["'][^>]*>/i,()=>`<style>\n${t}\n</style>`));let n=`<script>window.__SCHOOL_INIT__=${$(r)};<\/script>`;e=e.replace(/<script\s+src=["']js\/core\.js["']\s*><\/script>/i,e=>`${n}\n${e}`);for(let t of q){let n=Z[t];if(!n)continue;let r=t===`js/schedule.js`?`<script>window.__SCHOOL_CONFIG__=${$(W)};<\/script>\n`:``,i=RegExp(`<script\\s+src=["']${ne(t)}["']\\s*><\\/script>`,`i`);e=e.replace(i,()=>`${r}<script>\n${n}\n<\/script>`)}return e},[r]);return m?(0,G.jsxs)(`div`,{className:`fixed inset-0 bg-[#7ccf6b]`,children:[(0,G.jsx)(`button`,{type:`button`,onClick:()=>f(`/`),className:`absolute top-3 left-3 z-20 rounded-full bg-white/90 px-3 py-1.5 text-sm font-extrabold text-slate-700 shadow hover:bg-white`,"aria-label":`Về trang chủ`,children:`← Trang chủ`}),(0,G.jsx)(`iframe`,{ref:e,title:`Trường Vui Vẻ`,srcDoc:m,sandbox:`allow-scripts allow-same-origin`,className:`h-full w-full border-0`})]}):(0,G.jsx)(`div`,{className:`fixed inset-0 grid place-items-center bg-[#7ccf6b]`,children:(0,G.jsx)(`p`,{className:`rounded-full bg-white/90 px-5 py-2 text-sm font-extrabold text-slate-700 shadow`,children:`Đang tải Trường Vui Vẻ...`})})}export{ie as default};