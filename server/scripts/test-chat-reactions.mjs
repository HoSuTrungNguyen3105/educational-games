// Test tích hợp: CẢM XÚC (reactions) + STICKER cho tin nhắn DM.
// Chạy service THẬT của repo trên Mongo in-memory (mẫu như các đợt vá chat):
//   node server/scripts/test-chat-reactions.mjs
// Cần mongodb-memory-server (cài --no-save ở máy dev, không phải dep runtime).
// Biến môi trường TEST_MONGO_DBPATH: thư mục dữ liệu mongod tạm (mặc định
// cạnh script) — /tmp của một số máy là tmpfs nhỏ, mongod sẽ báo hết đĩa.
import { MongoMemoryServer } from "mongodb-memory-server";
import { mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, ".test-mongo-data");
mkdirSync(dbPath, { recursive: true });
const mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
process.env.MONGODB_URI = mongod.getUri();
process.env.MONGODB_DB = "emoji_chat_test";

const db = await import("../src/db.js");
await db.connect();
const { getCollection } = db;
const chatService = await import("../src/services/chatService.js");
const reactionService = await import("../src/services/reactionService.js");

const A = "user-a";
const B = "user-b";
const C = "user-c"; // người ngoài cuộc trò chuyện
const CONV = chatService.getDmConversationId(A, B);

await getCollection("users").insertMany([
  { id: A, username: "tesths0411", name: "Học Sinh Một", role: "student" },
  { id: B, username: "tesths2_0411", name: "Học Sinh Hai", role: "student" },
  { id: C, username: "outsider", name: "Người Ngoài", role: "student" },
]);

let failed = 0;
const check = (name, actual, expected) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok ? "" : `  → nhận ${JSON.stringify(actual)}, mong đợi ${JSON.stringify(expected)}`}`);
  if (!ok) failed++;
};
const checkThrows = async (name, fn, msgPart) => {
  try {
    await fn();
    console.log(`FAIL  ${name}  → không ném lỗi`);
    failed++;
  } catch (e) {
    const ok = !msgPart || String(e.message).includes(msgPart);
    console.log(`${ok ? "PASS" : "FAIL"}  ${name}  → lỗi: ${e.message}`);
    if (!ok) failed++;
  }
};

// ── 1. Gửi tin thường → có kind/reactions mặc định ──
const m1 = await chatService.sendMessage({
  conversationId: CONV, senderId: A, playerName: "Học Sinh Một", content: "Chào bạn!",
});
check("tin thường: kind = text", m1.kind, "text");
check("tin thường: sticker = null", m1.sticker, null);
check("tin thường: reactions rỗng", m1.reactions, []);

// ── 2. B thả reaction → gắn vào tin ──
let r = await reactionService.toggleReaction({ conversationId: CONV, messageId: m1.id, userId: B, icon: "emoj-icon-02" });
check("B thả tim: reactions", r.reactions, [{ userId: B, icon: "emoj-icon-02" }]);
check("B thả tim: myIcon", r.myIcon, "emoj-icon-02");

// ── 3. A thả cùng icon → cộng dồn 2 người ──
r = await reactionService.toggleReaction({ conversationId: CONV, messageId: m1.id, userId: A, icon: "emoj-icon-02" });
check("A thả tim: 2 reaction", r.reactions.length, 2);

// ── 4. B thả lại đúng icon đó → gỡ ──
r = await reactionService.toggleReaction({ conversationId: CONV, messageId: m1.id, userId: B, icon: "emoj-icon-02" });
check("B thả lại tim: bị gỡ, còn A", r.reactions, [{ userId: A, icon: "emoj-icon-02" }]);
check("B thả lại tim: myIcon = null", r.myIcon, null);

// ── 5. B thả icon khác rồi đổi icon → thay thế, tối đa 1 reaction/người ──
await reactionService.toggleReaction({ conversationId: CONV, messageId: m1.id, userId: B, icon: "emoj-icon-03" });
r = await reactionService.toggleReaction({ conversationId: CONV, messageId: m1.id, userId: B, icon: "emoj-icon-01" });
check("B đổi icon: chỉ 1 entry của B, icon mới", r.reactions.filter((x) => x.userId === B), [{ userId: B, icon: "emoj-icon-01" }]);

// ── 6. Gửi sticker qua luồng gửi tin hiện có ──
const m2 = await chatService.sendMessage({
  conversationId: CONV, senderId: B, playerName: "Học Sinh Hai", kind: "sticker", sticker: "emoj-icon-03",
});
check("sticker: kind = sticker", m2.kind, "sticker");
check("sticker: sticker = emoj-icon-03", m2.sticker, "emoj-icon-03");
check("sticker: content là nhãn mô tả", m2.content, reactionService.STICKER_CONTENT);
check("sticker: reactions rỗng", m2.reactions, []);
// Sticker cũng thả cảm xúc được
r = await reactionService.toggleReaction({ conversationId: CONV, messageId: m2.id, userId: A, icon: "emoj-icon-01" });
check("react lên sticker: ok", r.reactions, [{ userId: A, icon: "emoj-icon-01" }]);

// ── 7. Icon ngoài tập cho phép → bị từ chối cả hai đường ──
await checkThrows("gửi sticker icon lạ: từ chối",
  () => chatService.sendMessage({ conversationId: CONV, senderId: A, playerName: "Một", kind: "sticker", sticker: "emoj-icon-99" }),
  "không hợp lệ");
await checkThrows("thả reaction icon lạ: từ chối",
  () => reactionService.toggleReaction({ conversationId: CONV, messageId: m1.id, userId: A, icon: "like" }),
  "không hợp lệ");

// ── 8. Người ngoài cuộc trò chuyện react → bị từ chối ──
await checkThrows("người ngoài react: từ chối",
  () => reactionService.toggleReaction({ conversationId: CONV, messageId: m1.id, userId: C, icon: "emoj-icon-01" }),
  "không tham gia");

// ── 9. Tin nhắn không tồn tại → lỗi rõ ràng ──
await checkThrows("react tin không tồn tại: lỗi",
  () => reactionService.toggleReaction({ conversationId: CONV, messageId: "msg-khong-co", userId: A, icon: "emoj-icon-01" }),
  "Không tìm thấy");

// ── 10. Tin cũ (không có kind/reactions) vẫn react được ──
await getCollection("messages").insertOne({
  id: "msg-legacy", conversationId: CONV, senderId: A, playerName: "Học Sinh Một",
  type: "text", content: "tin cũ trước bản cập nhật", createdAt: new Date().toISOString(),
});
r = await reactionService.toggleReaction({ conversationId: CONV, messageId: "msg-legacy", userId: B, icon: "emoj-icon-05" });
check("tin cũ: react tạo mảng reactions", r.reactions, [{ userId: B, icon: "emoj-icon-05" }]);

// ── 11. Đã chặn nhau → không gửi sticker, không react được ──
await getCollection("userBlocks").insertOne({
  id: "blk-test", blockerId: A, blockedId: B, createdAt: new Date().toISOString(),
});
await checkThrows("đã chặn: gửi sticker bị từ chối",
  () => chatService.sendMessage({ conversationId: CONV, senderId: B, playerName: "Hai", kind: "sticker", sticker: "emoj-icon-01" }),
  "Không thể gửi");
await checkThrows("đã chặn: react bị từ chối",
  () => reactionService.toggleReaction({ conversationId: CONV, messageId: m1.id, userId: B, icon: "emoj-icon-04" }),
  "Không thể tương tác");
await getCollection("userBlocks").deleteOne({ id: "blk-test" });

await db.disconnect?.().catch(() => {});
await mongod.stop();
rmSync(dbPath, { recursive: true, force: true });
console.log(failed === 0 ? "\nTẤT CẢ PASS" : `\n${failed} ca FAIL`);
process.exit(failed === 0 ? 0 : 1);
