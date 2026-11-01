// scratch/notify-gate-test.mjs
//
// §7: "Công tắc thông báo thật sự chặn luồng tương ứng" — kiểm tra trực tiếp
// service thật (không qua UI): tắt notifications.assignments rồi gọi đúng hàm
// mà route giao bài tập gọi → phải KHÔNG tạo bản ghi; bật lại → phải tạo.
// Trong lúc probe cũng tắt notifications.push để không bắn FCM thật.
//
// chạy:  node scratch/notify-gate-test.mjs   (cwd = server/)

import { connect, getCollection } from "../server/src/db.js";
import * as systemConfig from "../server/src/services/systemConfigService.js";
import { createNotification } from "../server/src/services/notificationService.js";

const TO = "zz_notify_probe";
let pass = 0, fail = 0;
const ok = (n, c, e = "") => {
  if (c) { pass++; console.log(`  PASS ${n}${e ? ` | ${e}` : ""}`); }
  else { fail++; console.log(`  FAIL ${n}${e ? ` | ${e}` : ""}`); }
};

const coll = async () => getCollection("notifications");
const count = async () => (await coll()).countDocuments({ toUserId: TO });
const purge = async () => (await coll()).deleteMany({ toUserId: TO });

await connect();
const before = await systemConfig.getConfig();
const probe = (type) => ({
  fromUserId: "zz_probe_teacher", fromName: "Probe", toUserId: TO,
  type, title: "Probe " + type, message: "bản ghi thử của notify-gate-test",
});

try {
  await purge();

  // Tắt cả hai cờ để probe không chạm FCM/socket.
  await systemConfig.updateConfig(
    { notifications: { assignments: false, deadlineReminders: false, push: false, realtime: false } },
    { id: "zz_probe", role: "admin", name: "Probe" },
  );
  ok("đọc lại thấy assignments=false", (await systemConfig.isOn("notifications.assignments")) === false);

  const n1 = await createNotification(probe("ASSIGNMENT"));
  ok("tắt cờ → createNotification trả null", n1 === null, `kết quả=${JSON.stringify(n1)}`);
  const n2 = await createNotification(probe("TEACHER_ASSIGNMENT"));
  ok("TEACHER_ASSIGNMENT cũng bị chặn", n2 === null);
  const n3 = await createNotification(probe("DEADLINE_REMINDER"));
  ok("DEADLINE_REMINDER cũng bị chặn", n3 === null);
  ok("không có bản ghi nào được ghi xuống DB", (await count()) === 0);

  // Bật lại riêng cờ bài tập.
  await systemConfig.updateConfig({ notifications: { assignments: true } }, { id: "zz_probe", role: "admin", name: "Probe" });
  const n4 = await createNotification(probe("ASSIGNMENT"));
  ok("bật cờ → tạo bản ghi bình thường", n4 && n4.id, `id=${n4?.id}`);
  const stored = await count();
  ok("bản ghi có thật trong DB", stored === 1, `count=${stored}`);
  const n5 = await createNotification(probe("DEADLINE_REMINDER"));
  ok("cờ nhắc hạn vẫn tắt → vẫn chặn", n5 === null);

  // Loại không có công tắc (SYSTEM) phải luôn đi qua — chứng tỏ không chặn lung tung.
  const n6 = await createNotification(probe("SYSTEM"));
  ok("SYSTEM (không có cờ) vẫn tạo được", n6 && n6.id, `id=${n6?.id}`);
} finally {
  await purge();
  await systemConfig.updateConfig({ notifications: before.notifications }, { id: "zz_probe", role: "admin", name: "Probe" });
  const restored = await systemConfig.getConfig();
  ok("đã khôi phục đúng cấu hình ban đầu",
    JSON.stringify(restored.notifications) === JSON.stringify(before.notifications),
    JSON.stringify(restored.notifications));
  ok("đã xoá sạch bản ghi probe", (await count()) === 0);
}

console.log(`\nKẾT QUẢ: ${pass} PASS / ${fail} FAIL`);
process.exit(fail ? 1 : 0);
