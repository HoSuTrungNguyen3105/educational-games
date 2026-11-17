/**
 * groupUtils.js — thuật toán chia nhóm + gán vai trò cho tab Chia nhóm,
 * viết dạng hàm THUẦN (không React, không import) để kiểm chứng bằng
 * script node độc lập (mô phỏng hàng chục lượt chia, xem scripts kiểm
 * chứng trong báo cáo đợt 2).
 *
 * Nguyên tắc chia nhóm (theo ảnh mẫu 3 + bản phân tích):
 *  - Chỉ chia học sinh ĐANG THAM GIA (không bị excluded).
 *  - Học sinh có ghim (pinned) giữ đúng nhóm ghim — ghim thắng mọi cân bằng.
 *  - Sĩ số các nhóm chênh nhau tối đa 1 (khi không có ghim phá vỡ).
 *  - Giới tính cân bằng: nam / nữ / chưa rõ được tách thành từng hàng,
 *    xáo trộn trong hàng rồi rải vào nhóm đang ít người nhất (tham lam),
 *    hoà thì ưu tiên nhóm đang ít giới tính đó nhất → mỗi giới tính cũng
 *    chênh nhau tối đa ~1 giữa các nhóm.
 */

/** Xáo trộn Fisher–Yates đầy đủ, dùng rng truyền vào (mặc định Math.random). */
export function shuffleWith(items, rng = Math.random) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const genderKey = (g) => (g === "male" ? "male" : g === "female" ? "female" : "none");

/**
 * Chia học sinh vào `groupCount` nhóm.
 *
 * @param students    [{ id, gender }] theo thứ tự danh sách lớp
 * @param groupCount  số nhóm (≥1)
 * @param pinned      { studentId: groupIndex } — ghim cứng, thắng cân bằng
 * @param excludedIds mảng/Set id KHÔNG tham gia (không xuất hiện ở kết quả)
 * @returns { studentId: groupIndex } cho mọi học sinh tham gia
 */
export function distributeGroups({ students, groupCount, pinned = {}, excludedIds = [], rng = Math.random }) {
  const G = Math.max(1, Math.floor(Number(groupCount)) || 1);
  const excluded = excludedIds instanceof Set ? excludedIds : new Set(excludedIds);
  const groups = Array.from({ length: G }, () => []);
  const assignments = {};

  const participating = (Array.isArray(students) ? students : []).filter((s) => s && !excluded.has(s.id));

  // 1) Ghim trước — ghim thắng, kể cả làm sĩ số lệch.
  const free = [];
  for (const s of participating) {
    const p = pinned?.[s.id];
    if (Number.isInteger(p) && p >= 0 && p < G) {
      groups[p].push(s);
      assignments[s.id] = p;
    } else {
      free.push(s);
    }
  }

  // Đếm giới tính hiện có trong mỗi nhóm (gồm cả phần đã ghim).
  const genderCount = groups.map((members) => {
    const counts = { male: 0, female: 0, none: 0 };
    members.forEach((s) => { counts[genderKey(s.gender)] += 1; });
    return counts;
  });

  // 2) Tách học sinh tự do theo giới tính, xáo trộn từng hàng, rải tham lam:
  //    chọn nhóm có (sĩ số, số lượng giới tính đang rải) nhỏ nhất; hoà nhau
  //    thì bốc ngẫu nhiên trong các nhóm hoà để các lượt chia không giống hệt.
  for (const gk of ["male", "female", "none"]) {
    const bucket = shuffleWith(free.filter((s) => genderKey(s.gender) === gk), rng);
    for (const s of bucket) {
      let bestScore = Infinity;
      let candidates = [];
      groups.forEach((members, gi) => {
        const score = members.length * 10000 + genderCount[gi][gk];
        if (score < bestScore) {
          bestScore = score;
          candidates = [gi];
        } else if (score === bestScore) {
          candidates.push(gi);
        }
      });
      const gi = candidates[Math.floor(rng() * candidates.length)];
      groups[gi].push(s);
      assignments[s.id] = gi;
      genderCount[gi][gk] += 1;
    }
  }

  return assignments;
}

/** Thứ tự vai trò khi giao ngẫu nhiên (đúng thứ tự trong ảnh mẫu). */
export const ROLE_ORDER = ["leader", "secretary", "reporter", "timer", "logistics", "critic"];

/**
 * Giao vai trò ngẫu nhiên: trong mỗi nhóm, lấy các vai trò CHƯA có ai trong
 * nhóm giữ, xáo trộn thành viên CHƯA có vai trò, gán lần lượt theo thứ tự
 * ROLE_ORDER (nhóm ít người thì chỉ gán đủ số vai trò đầu danh sách).
 * Không ghi đè vai trò đã giao tay trước đó.
 *
 * @param membersByGroup mảng theo groupIndex → [studentId]
 * @param currentRoles   { studentId: roleId }
 * @returns bản sao roles mới
 */
export function assignRolesRandomly({ membersByGroup, currentRoles = {}, roleOrder = ROLE_ORDER, rng = Math.random }) {
  const roles = { ...currentRoles };
  for (const members of Array.isArray(membersByGroup) ? membersByGroup : []) {
    const heldInGroup = new Set(members.map((id) => roles[id]).filter(Boolean));
    const availableRoles = roleOrder.filter((r) => !heldInGroup.has(r));
    const candidates = shuffleWith(members.filter((id) => !roles[id]), rng);
    availableRoles.forEach((roleId, i) => {
      if (candidates[i]) roles[candidates[i]] = roleId;
    });
  }
  return roles;
}
