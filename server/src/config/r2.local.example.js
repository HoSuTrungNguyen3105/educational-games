// config/r2.local.js — MẪU ĐIỀN KHOÁ, KHÔNG COMMIT (đã nằm trong .gitignore)
//
// Cách dùng:
//   1. console.r2.cloudflare.com → tạo bucket, ví dụ: game-templates
//   2. R2 → Manage R2 API Tokens → Create API Token → quyền "Object Read & Write"
//      (chọn Scoped token + bucket vừa tạo)
//   3. Trong bucket → Settings → bật "Public access" → lấy link https://pub-xxxx.r2.dev
//   4. Điền 5 dòng dưới đây, đổi tên file thành r2.local.js
//   5. Chạy: npm run check:storage
//
// Hoặc bỏ trống file này và điền biến R2_* vào server/.env — cách đó tiện hơn
// khi deploy lên Render (biến môi trường trên Render sẽ được dùng).

module.exports = {
  r2Config: {
    // Cloudflare → R2 → Account ID (bên phải màn hình Account overview)
    accountId: "",

    // Token vừa tạo
    accessKeyId: "",
    secretAccessKey: "",

    // Tên bucket, ví dụ: game-templates
    bucket: "",

    // Link public của bucket. Bắt buộc — iframe fetch thẳng URL này.
    // Dùng https://pub-xxxx.r2.dev hoặc custom domain https://cdn.tên-domain.com
    publicUrl: "",
  },
};
