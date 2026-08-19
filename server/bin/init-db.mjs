import { initDatabase, close } from "../src/db.js";

try {
  const result = await initDatabase();
  console.log("\n=== KHỞI TẠO CSDL THÀNH CÔNG ===");
  console.log(`Database: ${result.dbName}`);
  console.log(`Collections đã tạo: ${result.created.join(", ") || "(đã tồn tại)"}`);
  console.log(`Đã seed dữ liệu: ${result.seeded.join(", ") || "(rỗng)"}`);
  console.log(`Indexes: ${result.indexes.length}`);
  process.exit(0);
} catch (e) {
  console.error("LỖI KHỞI TẠO CSDL:", e.message);
  process.exit(1);
} finally {
  await close();
}
