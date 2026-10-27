import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017",
  dbName: process.env.MONGODB_DB || "educational_games",
  jwtSecret: process.env.JWT_SECRET || "edu-games-dev-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

  // ── Refresh token ────────────────────────────────────────────────────────
  // Access token: giới hạn ngắn (mặc định giữ "7d" = JWT_EXPIRES_IN cũ để KHÔNG
  // làm hỏng các phiên đang chạy; muốn ngắn lại thì đặt JWT_EXPIRES_IN=15m —
  // cơ chế silent refresh phía client đã sẵn, xem src/lib/authToken.js).
  // Refresh token: sống dài hơn, chỉ nằm trong cookie HttpOnly + bản hash trong DB.
  refreshSecret: process.env.REFRESH_SECRET || process.env.JWT_SECRET || "edu-games-dev-secret-change-me",
  refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "30d",
  refreshCookieName: process.env.REFRESH_COOKIE_NAME || "edu_refresh",
  // Cookie chỉ đường dẫn này để trình duyệt không gửi nó cho mọi endpoint /api.
  refreshCookiePath: "/api/auth",
  // `none` = frontend và API khác site (github.io ↔ onrender.com) ⇒ bắt buộc Secure.
  refreshCookieSameSite: (process.env.REFRESH_COOKIE_SAMESITE || "").toLowerCase(),
  refreshCookieSecure: process.env.REFRESH_COOKIE_SECURE || "",

  // Origin được phép gọi /api/auth/refresh (so khớp tuyệt đối scheme+host+port).
  // Thiếu cấu hình ⇒ chỉ dev localhost, KHÔNG mở toang. Domain production thật
  // phải khai báo: REFRESH_ALLOWED_ORIGINS=https://domain-cua-ban.com
  refreshAllowedOrigins: (
    process.env.REFRESH_ALLOWED_ORIGINS ||
    [
      "http://localhost:5173",
      "http://localhost:4173",
      "https://ho-nguyen.github.io",
    ].join(",")
  )
    .split(",")
    .map((s) => s.trim().replace(/\/+$/, ""))
    .filter(Boolean),
  // Client không phải trình duyệt (curl, test script) thường không gửi Origin.
  // Mặc định TỪ CHỐI; chỉ bật khi backend cần cho machine client.
  refreshAllowNoOrigin: process.env.REFRESH_ALLOW_NO_ORIGIN === "true",

  // ── Socket.IO ────────────────────────────────────────────────────────────
  // Danh sách origin cho phép kết nối Socket.IO (phân tách bằng dấu phẩy).
  // Mặc định bật CORS mọi origin — hạn chế bằng SOCKET_CORS_ORIGINS khi deploy.
  socketCorsOrigins: (process.env.SOCKET_CORS_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),

  // ── AI Service (Java, mặc định :8081) ────────────────────────────────────
  // Kiến trúc: Frontend → Backend chính (chỗ này) → AI Service. Frontend KHÔNG
  // bao giờ gọi thẳng AI Service.
  //
  // LƯU Ý QUAN TRỌNG khi deploy: `localhost` trong container KHÔNG phải máy
  // chạy Backend chính. Phải trỏ AI_BACKEND_URL vào hostname/URL thật của AI
  // Service, và đặt AI Service trong mạng nội bộ nếu có thể.
  aiBackend: {
    url: (process.env.AI_BACKEND_URL || "http://localhost:8081").replace(/\/+$/, ""),
    // Shared secret gửi qua header X-Ai-Internal-Token. PHẢI khớp với
    // EDU_AI_INTERNAL_TOKEN của AI Service. Rỗng = không xác thực được, các
    // chức năng AI sẽ trả lỗi 503 kèm hướng dẫn cấu hình.
    token: process.env.AI_BACKEND_TOKEN || "",
    // Model local sinh nội dung chậm nên timeout mặc định phải rộng.
    timeoutMs: Number(process.env.AI_BACKEND_TIMEOUT_MS) || 120_000,
    // Bật/tắt toàn bộ tính năng AI (hữu ích khi deploy môi trường không có AI Service).
    enabled: process.env.AI_BACKEND_ENABLED !== "false",
  },
};
