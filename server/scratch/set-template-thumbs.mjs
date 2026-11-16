// scratch/set-template-thumbs.mjs — chạy từ thư mục server/:
//   node scratch/set-template-thumbs.mjs
// Ghi link ảnh Cloudinary (folder edu-game, đã upload bằng upload-template-thumbs.mjs)
// vào templates.thumbnail theo đúng tên template. Chỉ sửa 19 template có ảnh mới,
// các template khác giữ nguyên.

import { connect, getCollection, close } from "../src/db.js";

const NAME_TO_URL = {
  "Đường Đua Ốc Sên": "https://res.cloudinary.com/rngywa06/image/upload/v1794834403/edu-game/swut4c1ywt6qslpmxbov.png",
  "Đập Chuột Nhanh Tay": "https://res.cloudinary.com/rngywa06/image/upload/v1794834405/edu-game/fiwsdivt7mhzravcacqj.png",
  "Phi Thuyền Vũ Trụ": "https://res.cloudinary.com/rngywa06/image/upload/v1794834407/edu-game/atk4onpo1ll2akgujrge.png",
  "Thuyền Buồm Ra Khơi": "https://res.cloudinary.com/rngywa06/image/upload/v1794834408/edu-game/scnro6qi6sznh9kjkbmy.png",
  "Rước Đèn Trung Thu": "https://res.cloudinary.com/rngywa06/image/upload/v1794834409/edu-game/mfxsq2xv20jbijpa93gj.png",
  "Lật Thẻ Trí Nhớ": "https://res.cloudinary.com/rngywa06/image/upload/v1794834410/edu-game/jxtr49ecnqzq4wre5kpt.png",
  "Vòng Quay May Mắn": "https://res.cloudinary.com/rngywa06/image/upload/v1794834411/edu-game/jwwtchrm0i9lpgnfss3m.png",
  "Bản Đồ Kho Báu": "https://res.cloudinary.com/rngywa06/image/upload/v1794834412/edu-game/cqdmwksdyi1bl0cgtueb.png",
  "Ném Phi Tiêu Trúng Đích": "https://res.cloudinary.com/rngywa06/image/upload/v1794834413/edu-game/r7jwm9lacbjyk299tdlv.png",
  "Xếp Chữ Kỳ Diệu": "https://res.cloudinary.com/rngywa06/image/upload/v1794834414/edu-game/yokdkodjhv4fthwjfnzp.png",
  "Bóng Bay Tri Thức": "https://res.cloudinary.com/rngywa06/image/upload/v1794834414/edu-game/mhtxkfnihjc2dzahnb8n.png",
  "Phân Loại Đúng Chỗ": "https://res.cloudinary.com/rngywa06/image/upload/v1794834415/edu-game/wfcqa10yb5v3az7ekfeh.png",
  "Anh Hùng Phiêu Lưu": "https://res.cloudinary.com/rngywa06/image/upload/v1794834416/edu-game/gegmnxsl5rxca1zinmej.png",
  "Hầm Ngục Bí Ẩn": "https://res.cloudinary.com/rngywa06/image/upload/v1794834417/edu-game/sokvfsghdgjuxwzislak.png",
  "Ninja Vượt Chướng Ngại": "https://res.cloudinary.com/rngywa06/image/upload/v1794834418/edu-game/w8thkw8od0huh1jvxehq.png",
  "Tìm Con Số Bí Ẩn": "https://res.cloudinary.com/rngywa06/image/upload/v1794834419/edu-game/aco4wd8jeocvwpuwimn0.png",
  "Ghép Số Bùng Nổ": "https://res.cloudinary.com/rngywa06/image/upload/v1794834420/edu-game/gaz5taf8zllkv6p9ouel.png",
  "Cờ Caro 3 Ô": "https://res.cloudinary.com/rngywa06/image/upload/v1794834421/edu-game/unxrmqz1oqtyehtbmd8b.png",
  "Đua Xe Toán Học": "https://res.cloudinary.com/rngywa06/image/upload/v1794834422/edu-game/f8mz9wat7jl68z9ilux6.png",
};

async function main() {
  await connect();
  const coll = getCollection("templates");
  const now = new Date().toISOString();
  let ok = 0;
  for (const [name, url] of Object.entries(NAME_TO_URL)) {
    const upd = await coll.updateOne(
      { name },
      { $set: { thumbnail: url, updatedAt: now } }
    );
    if (upd.matchedCount === 0) {
      console.log(`MISS  ${name}`);
    } else {
      ok++;
      console.log(`OK    ${name}`);
    }
  }
  await close();
  console.log(`\nĐã cập nhật ${ok}/${Object.keys(NAME_TO_URL).length} template.`);
}

main().catch((e) => {
  console.error("Lỗi:", e.message);
  process.exit(1);
});
