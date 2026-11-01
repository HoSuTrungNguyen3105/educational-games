import { createServer } from "node:http";
import app from "./app.js";
import { config } from "./config.js";
import { initSocket } from "./socket.js";
import { setGameInviteIO } from "./routes/gameInvites.js";
import { setChatIO } from "./routes/chat.js";
import { initDatabase, close } from "./db.js";
import { initPlantTypes } from "./services/plantTypeService.js";
import { checkDeadlineReminders, setNotificationIO } from "./services/notificationService.js";
import { setGameVersionIO } from "./services/gameVersionService.js";
import * as templateStorage from "./services/templateStorageService.js";
import * as setupService from "./services/setupService.js";

const DEADLINE_CHECK_INTERVAL = 60 * 60 * 1000; // 1 hour

async function main() {
  const httpServer = createServer(app);
  const io = initSocket(httpServer);
  setGameInviteIO(io);
  setNotificationIO(io);
  setGameVersionIO(io);
  setChatIO(io);

  // Listen TRƯỚC khi init DB: /api/health phản hồi ngay trong lúc khởi động,
  // tránh request bị treo hàng chục giây khi instance Render vừa cold-start.
  httpServer.listen(config.port, () => {
    console.log(`[server] API chạy tại http://localhost:${config.port}/api`);
    console.log(`[server] Socket.IO sẵn sàng tại ws://localhost:${config.port}`);

    // Provider mặc định là FILE trên đĩa (server/uploads/html) — R2/Firebase
    // chỉ được dùng khi cấu hình; HTML thô không bao giờ nằm trong Mongo.
    console.log(`[server] Lưu trữ HTML: ${templateStorage.providerLabel()}`);
  });

  initDatabase()
    .then(async () => {
      await initPlantTypes();

      // Migration idempotent: bản ghi cũ (htmlTemplate/icon) → htmlUrl trên
      // Supabase, bỏ icon; HTML thô trong Mongo → upload file, chỉ lưu URL.
      const mig = await setupService
        .migrateTemplatesToSupabase()
        .catch((e) => {
          console.warn("[server] Migration templates thất bại:", e.message);
          return null;
        });
      if (mig && (mig.uploaded || mig.fromDisk || mig.failed)) {
        console.log(`[server] Migration templates: ${mig.uploaded} upload HTML, ${mig.fromDisk} chuyển từ đĩa, ${mig.missing} mất file, ${mig.failed} lỗi (giữ nguyên dữ liệu)`);
      }

      // Run deadline reminder check immediately, then every hour
      checkDeadlineReminders().catch(e => console.error("[server] Deadline reminder error:", e.message));
      setInterval(() => {
        checkDeadlineReminders().catch(e => console.error("[server] Deadline reminder error:", e.message));
      }, DEADLINE_CHECK_INTERVAL);
      console.log(`[server] Deadline reminder check chạy mỗi ${DEADLINE_CHECK_INTERVAL / 60000} phút`);
    })
    .catch((e) => {
      console.error("[server] Không thể khởi tạo database:", e.message);
      process.exit(1);
    });
}

main();

process.on("SIGINT", async () => {
  await close();
  process.exit(0);
});

// Render gửi SIGTERM khi deploy/restart — đóng DB gọn gàng để lần khởi động sau sạch
process.on("SIGTERM", async () => {
  await close();
  process.exit(0);
});