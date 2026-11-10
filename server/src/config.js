import dotenv from "dotenv";

dotenv.config();

/**
 * URL project Supabase — phải là gốc project (https://<ref>.supabase.co).
 * Nhiều người dán luôn URL REST (".../rest/v1/") từ trang Connect/API →
 * Storage SDK sẽ sinh đường dẫn sai và báo "Invalid path specified in request URL".
 * Chuẩn hoá: cắt các hậu tố endpoint thừa, bỏ slash cuối.
 */
function supabaseProjectUrl() {
  return (process.env.SUPABASE_URL || "")
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/(?:rest|storage|realtime|auth|functions)\/v1\/?$/i, "")
    .replace(/\/+$/, "");
}

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
      "https://hosutrungnguyen3105.github.io",
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
  socketCorsOrigins: (process.env.SOCKET_CORS_ORIGINS || "https://hosutrungnguyen3105.github.io,https://ho-nguyen.github.io,http://localhost:5173,http://localhost:4173")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),

  // ── Supabase Storage (HTML + thumbnail template) ────────────────────────
  // Secret key CHỈ nằm ở backend (.env), không bao giờ đưa sang React/GitHub.
  supabase: {
    url: supabaseProjectUrl(),
    key: process.env.SUPABASE_SECRET_KEY || "",
    bucket: process.env.SUPABASE_BUCKET || "edu-game-templates",
  },
  // Ảnh thumbnail gửi lên dạng data-URL base64 — chặn quá cỡ trước khi decode.
  thumbnailMaxMb: Number(process.env.THUMBNAIL_MAX_MB) || 2,

  // ── File HTML game (server/uploads/html) ─────────────────────────────────
  // Domain công khai của API, dùng ghép URL tuyệt đối cho file HTML.
  // KHÔNG hardcode — đặt BASE_URL khi deploy (vd https://edu-api.onrender.com).
  // Thiếu BASE_URL → htmlUrl trả về dạng đường dẫn tương đối /uploads/html/…
  // và frontend tự ghép gốc API (xem src/lib/hooks.js loadTemplateHtml).
  baseUrl: (process.env.BASE_URL || "").replace(/\/+$/, ""),
  // Giới hạn dung lượng 1 file HTML game (MB). express.json đã chặn 10mb ở tầng HTTP.
  htmlMaxMb: Number(process.env.HTML_MAX_MB) || 4,

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

  // ── Ollama trực tiếp (bỏ qua AI Service Java) ────────────────────────────
  // Backend gọi thẳng một endpoint tương thích Ollama `/api/chat` — điển hình là
  // Ollama Cloud (https://ollama.com) cho production: AI chạy 24/7, không cần máy
  // Windows/tunnel. Luật chọn nhà cung cấp nằm ở aiBackendService.aiProviderKind():
  // có OLLAMA_KEY + OLLAMA_BASE_URL không phải localhost → đi đường này; ngược lại
  // giữ nguyên đường AI Service ở trên (dev local không đổi hành vi).
  //
  // Tên biến và giá trị mặc định KHỚP với AI Service Java (application.yml) để hai
  // đường dùng chung một bộ env: OLLAMA_BASE_URL / OLLAMA_KEY / OLLAMA_MODEL /
  // OLLAMA_THINK / OLLAMA_TEMPERATURE.
  ollama: {
    // Nhà cung cấp suy luận ĐANG CHỌN cho các đường trực tiếp: "" = để luật cũ
    // tự quyết theo bộ OLLAMA_* (mặc định, hành vi không đổi); "groq" = ép đi
    // đường Groq (chuẩn OpenAI) qua aiGroqGateway/aiDirectService. Đặt
    // AI_PROVIDER=groq trên Render sau khi đã có GROQ_API_KEY.
    provider: (process.env.AI_PROVIDER || "").trim().toLowerCase(),
    // Rỗng = chưa đặt (KHÁC localhost mặc định của Java — Node cần phân biệt
    // "chưa cấu hình" với "cố ý trỏ localhost" khi chọn nhà cung cấp).
    baseUrl: (process.env.OLLAMA_BASE_URL || "").replace(/\/+$/, ""),
    // API key của endpoint Ollama từ xa. Rỗng = không gắn header Authorization.
    // TUYỆT ĐỐI không log giá trị này.
    apiKey: process.env["OLLAMA_KEY"] || "",
    // Model sẽ gọi. Trên Ollama Cloud phải là model CÓ trên cloud (ví dụ
    // gpt-oss:20b) — cloud không có các model local kiểu qwen3:4b.
    model: process.env.OLLAMA_MODEL || "",
    // Chế độ thinking: "false" (mặc định, như Java) = gửi think:false để model
    // trả lời thẳng; "true" = cho phép suy nghĩ; "omit" = không gửi field này.
    think: process.env.OLLAMA_THINK ?? "false",
    temperature: Number(process.env.OLLAMA_TEMPERATURE) || 0.4,
  },

  // ── Groq (chuẩn OpenAI, miễn phí 24/7) ───────────────────────────────────
  // Nhà cung cấp suy luận qua API tương thích OpenAI của Groq
  // (https://api.groq.com/openai/v1/chat/completions, Bearer GROQ_API_KEY).
  // Chỉ kích hoạt khi AI_PROVIDER=groq (xem aiBackendService.aiProviderKindFrom);
  // KHÔNG đặt biến này thì hành vi giữ nguyên như cũ. Key TUYỆT ĐỐI không log.
  groq: {
    baseUrl: (process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1").replace(/\/+$/, ""),
    apiKey: process.env.GROQ_API_KEY || "",
    // Mặc định openai/gpt-oss-20b: cùng họ model với đường Ollama Cloud cũ,
    // trên Groq có Structured Outputs bảo đảm schema (tốt cho sinh câu hỏi
    // JSON) và giới hạn free tier công khai 30 RPM / 1.000 req/ngày /
    // 200K token/ngày mỗi model. Đây là model KHỞI ĐỘNG: admin có thể chọn
    // model khác ngay trong trang Cài đặt (system_config `ai.model`, xem
    // aiModelConfig.js) — lựa chọn đó thắng GROQ_MODEL mà không cần deploy.
    model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
    temperature: Number(process.env.GROQ_TEMPERATURE) || 0.4,
  },
};
