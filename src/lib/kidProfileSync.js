/**
 * kidProfileSync.js — đẩy lớp + giới tính của bé lên server mỗi khi bé (hoặc
 * phụ huynh) đổi trong Cài đặt / màn chào.
 *
 * API không nhận tuổi thật: client đổi lớp sang MÃ tuổi (`ageCode`, xem
 * `src/lib/ageCodes.js`) rồi gửi. Server trả về mã nào thì client mã đó ra
 * tuổi, nên hồ sơ trên server không lộ thông tin độ tuổi.
 *
 * Khách chưa đăng nhập: không gửi gì cả, cài đặt chỉ nằm ở localStorage.
 */

import { userService } from "../services/api.js";
import { useUserAuthStore } from "../stores/userAuth.store.js";
import { getKidSettings, onKidSettingsChange } from "./kidSettings.js";
import { ageCodeForGrade } from "./ageCodes.js";

/** Hồ sơ gửi đi — so sánh với nhau bằng JSON để khỏi gửi lặp. */
function profileOf(settings) {
  return { ageCode: ageCodeForGrade(settings.grade), gender: settings.gender || null };
}

const same = (a, b) => a.ageCode === b.ageCode && a.gender === b.gender;

let sending = null;

async function pushProfile() {
  const state = useUserAuthStore.getState();
  const user = state?.user;
  if (!user?.id) return;

  const payload = profileOf(getKidSettings());
  // Hồ sơ trên tài khoản đã đúng thì không gọi API (đây cũng là lần "vọng"
  // ngược lại sau khi syncKidFromAccount điền cài đặt).
  if (same(payload, profileOf(user))) return;
  if (sending && same(payload, sending)) return;

  sending = payload;
  try {
    await userService.updateProfile(payload);
    state.patchUser?.(payload);
  } catch {
    /* mất mạng — lần đổi sau sẽ thử lại */
  } finally {
    if (sending === payload) sending = null;
  }
}

let started = false;

/**
 * Gọi một lần ở `App.jsx`.
 *
 * Chỉ đẩy lên server khi bé/PHỤ HUYNH THỰC SỰ đổi (màn chào, thanh tuổi, chip
 * giới tính). Không "backfill" lúc mở app hay sau khi đăng nhập:
 * `gq_kid_settings_v1` luôn tồn tại sẵn với Lớp 2 + giới tính trống, nên nếu
 * tự gửi thì mọi tài khoản cũ (kể cả giáo viên, quản trị) đều bị ghi đè hồ sơ
 * bằng mã tuổi mặc định — dữ liệu rác mà không ai chọn.
 * Tài khoản mới thì sao? `handleOnboardingComplete` đã gửi kèm ageCode + gender
 * ngay trong POST /auth/register.
 */
export function startKidProfileSync() {
  if (started || typeof window === "undefined") return;
  started = true;
  onKidSettingsChange(() => { pushProfile(); });
}
