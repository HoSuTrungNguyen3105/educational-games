// scratch/upload-template-thumbs.mjs — chạy từ thư mục server/:
//   node scratch/upload-template-thumbs.mjs
//
// Upload 19 ảnh thumbnail của template game lên Cloudinary (folder edu-game)
// rồi ghi link vào templates.thumbnail trong MongoDB — cùng nơi mà
// /api/images?folder=edu-game và /api/templates phục vụ.
// KHÔNG in bất kỳ biến môi trường/key nào; chỉ in tên file + URL công khai.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { connect, getCollection, close } from "../src/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// slug template → tên file ảnh trong public/ (trừ ảnh game offline)
const SLUG_TO_FILE = {
  "snail-race": "snail-race.png",
  "whack-a-mole": "whack-a-mole.png",
  "space-ship": "space-ship.png",
  "sailing-boat": "sailing-boat.png",
  "moon-lantern": "moon-lantern.png",
  "memory-match": "memory-match.png",
  "lucky-wheel": "lucky-wheel.png",
  "treasure-map": "treasure-map.png",
  "dart-throw": "dart-throw.png",
  "word-scramble": "word-scramble.png",
  "balloon-pop": "balloon-pop.png",
  "sorting-game": "sorting-game.png",
  "hero-adventure": "hero-adventure.png",
  "dungeon-quest": "dungeon-quest.png",
  "ninja-dash": "ninja-dash.png",
  "find-number": "find-the-number-solo.png",
  "merge-blast": "merge-and-blast-solo.png",
  "tic-tac-toe": "tic-tac-toe.png",
  "maths-racing": "maths-racing.png",
};

const PUBLIC_DIR = path.resolve(__dirname, "../../public");

const FOLDER = "edu-game";

async function uploadOne(fileName) {
  const filePath = path.join(PUBLIC_DIR, fileName);
  if (!fs.existsSync(filePath)) throw new Error(`Thiếu file ${fileName}`);
  const result = await cloudinary.uploader.upload(filePath, {
    folder: FOLDER,
    resource_type: "image",
  });
  return { url: result.secure_url, publicId: result.public_id };
}

async function main() {
  const results = [];

  for (const [slug, fileName] of Object.entries(SLUG_TO_FILE)) {
    try {
      const { url, publicId } = await uploadOne(fileName);
      results.push({ slug, fileName, url, publicId });
      console.log(`UPLOAD OK  ${fileName} → ${url}`);
    } catch (e) {
      console.log(`UPLOAD FAIL ${fileName}: ${e.message}`);
    }
  }

  // Ghi link vào templates.thumbnail (khớp theo slug)
  await connect();
  const coll = getCollection("templates");
  let updated = 0;
  const now = new Date().toISOString();
  for (const r of results) {
    const upd = await coll.updateOne(
      { slug: r.slug },
      { $set: { thumbnail: r.url, updatedAt: now } }
    );
    if (upd.matchedCount === 0) {
      console.log(`DB MISS   ${r.slug} — không thấy template trong Mongo`);
    } else {
      updated++;
      console.log(`DB OK     ${r.slug} → thumbnail đã trỏ Cloudinary`);
    }
  }
  await close();

  console.log(`\nTổng: upload ${results.length}/${Object.keys(SLUG_TO_FILE).length} ảnh, cập nhật ${updated} template.`);
}

main().catch((e) => {
  console.error("Lỗi:", e.message);
  process.exit(1);
});
