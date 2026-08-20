import { createServer } from "node:http";
import app from "./app.js";
import { config } from "./config.js";
import { initSocket } from "./socket.js";
import { initDatabase, close } from "./db.js";

async function main() {
  const httpServer = createServer(app);
  initSocket(httpServer);

  // Listen TRƯỚC khi init DB: /api/health phản hồi ngay trong lúc khởi động,
  // tránh request bị treo hàng chục giây khi instance Render vừa cold-start.
  httpServer.listen(config.port, () => {
    console.log(`[server] API chạy tại http://localhost:${config.port}/api`);
    console.log(`[server] Socket.IO sẵn sàng tại ws://localhost:${config.port}`);
  });

  initDatabase()
    .then((info) => console.log(`[server] Collections: ${info.created.length} tạo mới, seed ${info.seeded.length} nhóm`))
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