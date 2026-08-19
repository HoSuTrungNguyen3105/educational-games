import { createServer } from "node:http";
import app from "./app.js";
import { config } from "./config.js";
import { initSocket } from "./socket.js";
import { initDatabase, close } from "./db.js";

async function main() {
  try {
    const info = await initDatabase();
    console.log(`[server] Collections: ${info.created.length} tạo mới, seed ${info.seeded.length} nhóm`);
  } catch (e) {
    console.error("[server] Không thể khởi tạo database:", e.message);
    process.exit(1);
  }

  const httpServer = createServer(app);
  initSocket(httpServer);

  httpServer.listen(config.port, () => {
    console.log(`[server] API chạy tại http://localhost:${config.port}/api`);
    console.log(`[server] Socket.IO sẵn sàng tại ws://localhost:${config.port}`);
  });
}

main();

process.on("SIGINT", async () => {
  await close();
  process.exit(0);
});