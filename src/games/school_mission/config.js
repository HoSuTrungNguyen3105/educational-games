/**
 * Cấu hình Trường Vui Vẻ — thời khóa biểu, bài thi, giờ học thực.
 *
 * day: 1=Thứ 2 … 7=Chủ nhật (theo getDay() JS: CN=0 → đổi thành 7)
 * start/end: "HH:MM" theo đồng hồ máy (thời gian thực)
 * subject: math | eng | van | sci
 * type: "lesson" (học bài) | "exam" (làm bài thi)
 * examId: khớp id trong khối exams của School_mission.html (khi type=exam)
 *
 * demoMode: bật để thử nhanh — lịch hôm nay được dời sát giờ hiện tại.
 * simulateTime: null | "HH:MM" — giả lập giờ (null = dùng giờ máy thật).
 */
export const SCHOOL_MISSION_CONFIG = {
  /** Dùng đồng hồ máy thật */
  useRealTime: true,

  /**
   * Giả lập giờ để test (ví dụ "08:00"). Để null khi chơi thật.
   * Có thể đổi trong game qua localStorage key "tvv_sim_time".
   */
  simulateTime: null,

  /**
   * demoMode = true: tự tạo lịch thử trong vài phút tới
   * (không dùng timetable cố định bên dưới).
   * Trong game: nút "Bật DEMO thử lịch" hoặc localStorage tvv_demo=1.
   * Để test nhanh ngoài giờ học, tạm bật true rồi tắt lại.
   */
  demoMode: false,

  /** Cho phép vào lớp sớm hơn giờ bắt đầu (phút) */
  earlyMinutes: 5,

  /** Cho phép vào muộn sau giờ bắt đầu trong khoảng này (phút) */
  graceMinutes: 10,

  /** Báo trước khi tiết bắt đầu (phút) */
  notifyBeforeMinutes: 2,

  /** Tự mở lớp + bắt đầu học/thi khi tới giờ */
  autoEnterClass: true,

  /** Ngoài giờ học vẫn được luyện tự do trong lớp */
  allowFreePractice: true,

  /** Ngoài khung giờ tiết hiện tại: chặn "Học bài" / "Bài thi theo TKB" nếu false */
  requireOnTimeForLesson: true,

  schoolName: "Trường Vui Vẻ",

  /** Thời khóa biểu tuần (Thứ 2–6) */
  timetable: [
    // ── Thứ 2 ──
    { day: 1, start: "07:30", end: "08:15", subject: "math", type: "lesson", title: "Toán" },
    { day: 1, start: "08:20", end: "09:05", subject: "van", type: "lesson", title: "Ngữ văn" },
    { day: 1, start: "09:15", end: "10:00", subject: "eng", type: "lesson", title: "Tiếng Anh" },
    { day: 1, start: "10:10", end: "10:55", subject: "math", type: "exam", examId: "thi_toan_1", title: "Kiểm tra Toán" },

    // ── Thứ 3 ──
    { day: 2, start: "07:30", end: "08:15", subject: "eng", type: "lesson", title: "Tiếng Anh" },
    { day: 2, start: "08:20", end: "09:05", subject: "math", type: "lesson", title: "Toán" },
    { day: 2, start: "09:15", end: "10:00", subject: "van", type: "lesson", title: "Ngữ văn" },
    { day: 2, start: "10:10", end: "10:55", subject: "eng", type: "exam", examId: "thi_anh_1", title: "Bài thi Tiếng Anh" },

    // ── Thứ 4 ──
    { day: 3, start: "07:30", end: "08:15", subject: "van", type: "lesson", title: "Ngữ văn" },
    { day: 3, start: "08:20", end: "09:05", subject: "eng", type: "lesson", title: "Tiếng Anh" },
    { day: 3, start: "09:15", end: "10:00", subject: "math", type: "lesson", title: "Toán" },
    { day: 3, start: "10:10", end: "10:55", subject: "van", type: "exam", examId: "thi_van_1", title: "Bài thi Ngữ văn" },

    // ── Thứ 5 ──
    { day: 4, start: "07:30", end: "08:15", subject: "math", type: "lesson", title: "Toán" },
    { day: 4, start: "08:20", end: "09:05", subject: "eng", type: "lesson", title: "Tiếng Anh" },
    { day: 4, start: "09:15", end: "10:00", subject: "van", type: "lesson", title: "Ngữ văn" },
    { day: 4, start: "10:10", end: "10:55", subject: "sci", type: "lesson", title: "Khoa học" },

    // ── Thứ 6 ──
    { day: 5, start: "07:30", end: "08:15", subject: "eng", type: "lesson", title: "Tiếng Anh" },
    { day: 5, start: "08:20", end: "09:05", subject: "van", type: "lesson", title: "Ngữ văn" },
    { day: 5, start: "09:15", end: "10:00", subject: "math", type: "lesson", title: "Toán" },
    { day: 5, start: "10:10", end: "10:55", subject: "math", type: "exam", examId: "thi_toan_2", title: "Kiểm tra Toán giữa tuần" },
  ],
};
