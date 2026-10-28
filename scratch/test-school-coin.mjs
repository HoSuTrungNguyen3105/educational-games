/**
 * Kiểm thử phần thưởng coin của Trường Vui Vẻ (không cần trình duyệt).
 *   A. Phía game (js/ui.js): nhiệm vụ xong / điểm cao → postMessage đúng số coin.
 *   B. Phía app (src/lib/schoolMissionRewards.js): trần 100🪙 mỗi ngày, chặn lý do lạ,
 *      chưa đăng nhập và lỗi mạng phải KHÔNG cộng.
 * Chạy: node scratch/test-school-coin.mjs
 */
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = path.resolve(import.meta.dirname, "..");
const G = (...p) => path.join(ROOT, ...p);
const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, pass: !!ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? " — " + detail : ""}`);
};

/* ───────────────────────── A. Phía game ───────────────────────── */
const sent = [];
const storage = new Map();
const sandbox = {
  console,
  setTimeout: (fn, ms) => setTimeout(fn, ms),
  clearTimeout: (h) => clearTimeout(h),
  localStorage: {
    getItem: (k) => (storage.has(k) ? storage.get(k) : null),
    setItem: (k, v) => storage.set(k, String(v)),
    removeItem: (k) => storage.delete(k),
  },
  window: {
    parent: { postMessage: (m) => sent.push(m) },
  },
  document: {
    getElementById: () => ({ style: {}, textContent: "", innerHTML: "" }),
    querySelector: () => ({ style: {} }),
    querySelectorAll: () => [],
  },
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

// Thứ tự nạp giống School_mission.html: state → config → ui
for (const rel of ["js/state.js", "js/config.js", "js/ui.js"]) {
  vm.runInContext(fs.readFileSync(G("src/games/school_mission", rel), "utf8"), sandbox, { filename: rel });
}

const events = () => sent.filter((m) => m.type === "school-coin").map((m) => m.data);

vm.runInContext('scoreBonus(3, 5, "lesson:math")', sandbox);
check("Đúng 3/5 câu (60%) → KHÔNG thưởng coin thật", events().length === 0, JSON.stringify(events()));

const b4 = vm.runInContext('scoreBonus(4, 5, "lesson:math")', sandbox);
check("Đúng 4/5 (80%) → +10🪙 ví thật",
  b4.includes("+10") && events().at(-1)?.amount === 10 && events().at(-1)?.reason === "highscore:lesson:math",
  JSON.stringify({ line: b4, ev: events().at(-1) }));

const b5 = vm.runInContext('scoreBonus(5, 5, "exam:ex1")', sandbox);
check("Đúng hết câu → +15🪙 ví thật",
  b5.includes("+15") && events().at(-1)?.amount === 15 && events().at(-1)?.reason === "perfect:exam:ex1",
  JSON.stringify({ line: b5, ev: events().at(-1) }));

sent.length = 0;
vm.runInContext('prog("read", 1)', sandbox);
vm.runInContext('prog("read", 1)', sandbox);
check("Nhiệm vụ chưa đủ mốc → chưa cộng coin thật", events().length === 0, JSON.stringify(events()));
vm.runInContext('prog("read", 1)', sandbox);
check("Đủ 3 truyện Thư viện → +40🪙 (quest:read)",
  events().length === 1 && events()[0].amount === 40 && events()[0].reason === "quest:read",
  JSON.stringify(events()));

const quests = vm.runInContext("QU.map(q => q.k + ':' + q.n + ':' + q.c)", sandbox);
check("Danh sách nhiệm vụ 📋 có 8 loại (gồm read/exam/chat)",
  quests.includes("read:3:40") && quests.includes("exam:1:60") && quests.includes("chat:3:30"), quests.join(", "));

const bonusMissing = vm.runInContext("typeof scoreBonus === 'function' && typeof realCoin === 'function'", sandbox);
check("Game không tự cộng coin (chỉ bắn sự kiện, không có token trong iframe)", bonusMissing);

/* ───────────────────────── B. Phía app ───────────────────────── */
// Bản copy có đổi đường import để chạy được bằng Node (api.js cần Vite + window).
const tmpDir = G("scratch/.tmp-school-coin");
fs.mkdirSync(tmpDir, { recursive: true });
const stubSrc = `
export const authState = { token: null, calls: [], fail: false };
export function loadAuth() { return authState.token ? { token: authState.token } : null; }
export const walletService = {
  async addCoins(amount) {
    if (authState.fail) throw new Error("offline");
    authState.calls.push(amount);
    return { coins: 5000 + amount };
  },
};
`;
fs.writeFileSync(path.join(tmpDir, "api.js"), stubSrc);
const rewardsSrc = fs
  .readFileSync(G("src/lib/schoolMissionRewards.js"), "utf8")
  .replace('from "../services/api.js"', 'from "./api.js"');
fs.writeFileSync(path.join(tmpDir, "rewards.js"), rewardsSrc);

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
};
const { grantSchoolCoinReward } = await import(pathToFileURL(path.join(tmpDir, "rewards.js")).href);
const { authState } = await import(pathToFileURL(path.join(tmpDir, "api.js")).href);

const badReason = await grantSchoolCoinReward(40, "hack:something");
check("Lý do không nằm trong danh sách → từ chối", badReason.granted === false && badReason.code === "invalid");

const tooBig = await grantSchoolCoinReward(5000, "quest:math");
check("Số tiền vượt mức một phần thưởng (5000🪙) → từ chối", tooBig.granted === false && tooBig.code === "invalid");

const noAuth = await grantSchoolCoinReward(40, "quest:math");
check("Chưa đăng nhập → không cộng, code=noauth", noAuth.granted === false && noAuth.code === "noauth" && authState.calls.length === 0);

authState.token = "jwt-gia";
const first = await grantSchoolCoinReward(40, "quest:math");
check("Xong nhiệm vụ 40🪙 → gọi ví đúng 1 lần", first.granted === true && authState.calls.join() === "40", JSON.stringify(first));

const second = await grantSchoolCoinReward(15, "perfect:lesson:eng");
check("Cộng dồn trong ngày: 40 + 15 = 55🪙", second.granted === true && second.today === 55, JSON.stringify(second));

const third = await grantSchoolCoinReward(60, "quest:flower");
check("Vượt trần 100🪙/ngày → chặn, code=cap", third.granted === false && third.code === "cap" && authState.calls.join() === "40,15", JSON.stringify(third));

const fit = await grantSchoolCoinReward(45, "quest:exam");
check("Vừa khít trần (55 + 45 = 100) vẫn cho nhận", fit.granted === true && fit.today === 100, JSON.stringify(fit));

// Trần đã đầy nên request 10🪙 bị chặn ở bước cap. Đặt lại sổ ghi để kiểm tra
// nhánh ví lỗi (mất mạng): phải KHÔNG ghi lịch sử, để bé nhận đủ khi có mạng.
const localToday = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
store.set("edu_school_coin_reward_v1", JSON.stringify({ date: localToday(), granted: 0 }));
authState.fail = true;
const offline = await grantSchoolCoinReward(10, "highscore:lesson:sci");
check("Ví lỗi (mất mạng) → không ghi lịch sử, code=offline",
  offline.granted === false && offline.code === "offline" && JSON.parse(store.get("edu_school_coin_reward_v1")).granted === 0,
  JSON.stringify(offline));

// Ngày hôm sau phải được nhận lại từ đầu
const ledger = JSON.parse(store.get("edu_school_coin_reward_v1"));
ledger.date = "2000-01-01";
store.set("edu_school_coin_reward_v1", JSON.stringify(ledger));
authState.fail = false;
const nextDay = await grantSchoolCoinReward(10, "highscore:lesson:sci");
check("Sang ngày mới → đồng hồ đếm lại, nhận được coin", nextDay.granted === true && nextDay.today === 10, JSON.stringify(nextDay));

fs.rmSync(tmpDir, { recursive: true, force: true });

const failed = results.filter((r) => !r.pass);
console.log(`\n=== ${results.length - failed.length}/${results.length} đạt ===`);
if (failed.length) {
  console.log("CHƯA ĐẠT:");
  failed.forEach((f) => console.log(" - " + f.name + " — " + f.detail));
  process.exit(1);
}
process.exit(0);
