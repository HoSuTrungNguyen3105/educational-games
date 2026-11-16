/**
 * checkinService.js — "Điểm danh mỗi ngày" của học sinh: điểm danh nhận xu
 * + chuỗi ngày liên tiếp (streak).
 *
 * KHÁC HẲN attendanceService (điểm danh ĐI HỌC của lớp, theo ngày học, do
 * giáo viên/học sinh tự chấm công) — hai hệ độc lập, không dùng chung dữ
 * liệu; ở đây chỉ mượn lại helper ngày giờ Việt Nam `todayDate()` của nó.
 *
 * Trạng thái lưu ngay trên document user:
 *   dailyCheckin: { lastDate: "YYYY-MM-DD" (giờ Asia/Ho_Chi_Minh),
 *                   streak, longestStreak, totalCheckins }
 * Chỉ cần lastDate + streak là dựng lại được trạng thái 7 ngày gần nhất
 * (chuỗi là một quãng ngày liền mạch kết thúc ở lastDate).
 *
 * Cộng xu qua addCoins() của authService — đúng đường dailyTaskService
 * dùng khi học sinh nhận thưởng nhiệm vụ ngày, không tự chế cơ chế riêng.
 */
import { getCollection } from "../db.js";
import { addCoins } from "./authService.js";
import { todayDate } from "./attendanceService.js";

const USERS_COL = "users";

export const CHECKIN_BASE_REWARD = 20;
export const CHECKIN_STEP_REWARD = 10;
export const CHECKIN_STEP_CAP = 7;
export const CHECKIN_WEEK_REWARD = 200;

/**
 * Thưởng của ngày điểm danh đạt chuỗi `streak`:
 * 20 + 10×min(streak−1, 7); riêng streak chia hết cho 7 (mốc tuần) → 200.
 */
export function rewardForStreak(streak) {
  const s = Number(streak) || 0;
  if (s > 0 && s % 7 === 0) return CHECKIN_WEEK_REWARD;
  return CHECKIN_BASE_REWARD + CHECKIN_STEP_REWARD * Math.min(Math.max(s - 1, 0), CHECKIN_STEP_CAP);
}

/**
 * Cộng/trừ ngày trên chuỗi "YYYY-MM-DD". Số học UTC trên CHUỖI ngày nên
 * không phụ thuộc múi giờ của server.
 */
export function shiftDate(dateStr, days) {
  const [y, m, d] = String(dateStr).split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d) + days * 86400_000);
  const mm = String(t.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(t.getUTCDate()).padStart(2, "0");
  return `${t.getUTCFullYear()}-${mm}-${dd}`;
}

function normalizeState(user) {
  const dc = user?.dailyCheckin || {};
  return {
    lastDate: typeof dc.lastDate === "string" ? dc.lastDate : null,
    streak: Number(dc.streak) || 0,
    longestStreak: Number(dc.longestStreak) || 0,
    totalCheckins: Number(dc.totalCheckins) || 0,
  };
}

/** Chuỗi còn "sống" khi ngày điểm danh cuối là hôm nay hoặc hôm qua. */
function effectiveStreak(state, today) {
  if (!state.lastDate || state.streak <= 0) return 0;
  if (state.lastDate === today || state.lastDate === shiftDate(today, -1)) return state.streak;
  return 0;
}

/** 7 ngày gần nhất (cũ → hôm nay) kèm cờ đã điểm danh hay chưa. */
function buildWeek(state, today) {
  const runStart = state.lastDate && state.streak > 0
    ? shiftDate(state.lastDate, -(state.streak - 1))
    : null;
  const week = [];
  for (let i = 6; i >= 0; i--) {
    const date = shiftDate(today, -i);
    // So sánh chuỗi "YYYY-MM-DD" theo thứ tự từ điển = thứ tự thời gian.
    const checkedIn = !!runStart && date >= runStart && date <= state.lastDate;
    week.push({ date, checkedIn, isToday: i === 0 });
  }
  return week;
}

function toStatus(state, today) {
  const checkedInToday = state.lastDate === today;
  const streak = effectiveStreak(state, today);
  const nextStreak = state.lastDate === shiftDate(today, -1) ? state.streak + 1 : 1;
  return {
    checkedInToday,
    streak,
    longestStreak: Math.max(state.longestStreak, state.streak),
    totalCheckins: state.totalCheckins,
    rewardToday: checkedInToday ? 0 : rewardForStreak(nextStreak),
    week: buildWeek(state, today),
  };
}

async function findUser(userId) {
  const user = await getCollection(USERS_COL).findOne({ id: userId });
  if (!user) throw new Error("Không tìm thấy người dùng");
  return user;
}

/** GET /api/users/me/check-in — trạng thái điểm danh của chính người dùng. */
export async function getCheckinStatus(userId) {
  const user = await findUser(userId);
  return toStatus(normalizeState(user), todayDate());
}

/**
 * POST /api/users/me/check-in — điểm danh hôm nay.
 * Đã điểm danh rồi → trả trạng thái hiện tại, reward 0, KHÔNG cộng trùng.
 * Chưa → tính streak mới, chiếm ngày bằng update CÓ ĐIỀU KIỆN (lastDate
 * chưa phải hôm nay) rồi mới cộng xu, nên hai request đồng thời không thể
 * cùng nhận thưởng.
 */
export async function performCheckin(userId) {
  const users = getCollection(USERS_COL);
  const user = await findUser(userId);
  const today = todayDate();
  const state = normalizeState(user);

  if (state.lastDate === today) {
    return {
      ...toStatus(state, today),
      alreadyCheckedIn: true,
      reward: 0,
      coins: user.coins || 0,
    };
  }

  const newStreak = state.lastDate === shiftDate(today, -1) ? state.streak + 1 : 1;
  const reward = rewardForStreak(newStreak);
  const next = {
    lastDate: today,
    streak: newStreak,
    longestStreak: Math.max(state.longestStreak, newStreak),
    totalCheckins: state.totalCheckins + 1,
  };

  const claim = await users.updateOne(
    { id: userId, "dailyCheckin.lastDate": { $ne: today } },
    { $set: { dailyCheckin: next } }
  );
  if (!claim.matchedCount) {
    // Request song song vừa điểm danh trước một nhịp — trả trạng thái mới
    // nhất, không cộng xu lần nữa.
    const fresh = await findUser(userId);
    return {
      ...toStatus(normalizeState(fresh), today),
      alreadyCheckedIn: true,
      reward: 0,
      coins: fresh.coins || 0,
    };
  }

  const coins = await addCoins(userId, reward);
  return {
    ...toStatus(next, today),
    alreadyCheckedIn: false,
    reward,
    coins,
  };
}
