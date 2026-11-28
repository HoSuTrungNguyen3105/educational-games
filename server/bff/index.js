import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "./config.js";
import { connectSessionStore, closeSessionStore, cleanupExpiredSessions } from "./sessionStore.js";
import authRoutes from "./routes/auth.js";
import proxyRoutes from "./routes/proxy.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Trust proxy for correct IP behind reverse proxy
app.set("trust proxy", 1);

// CORS - allow frontend origin with credentials
app.use(cors({
  origin: config.frontendOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", config.csrfHeaderName],
}));

// Parse JSON and cookies
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (duration > 1000 || res.statusCode >= 400) {
      console.log(`[BFF] ${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
    }
  });
  next();
});

// Build route prefix with base path
const basePrefix = config.basePath || "";

// Helper to register routes with both base path and root path
function registerRoutes(prefix) {
  const p = prefix || "";
  
  // Health check
  app.get(`${p}/health`, (req, res) => {
    res.json({ status: "ok", service: "bff", timestamp: new Date().toISOString() });
  });
  
  // Health check under bff prefix (for Vite proxy)
  app.get(`${p}/bff/health`, (req, res) => {
    res.json({ status: "ok", service: "bff", timestamp: new Date().toISOString() });
  });
  
  // Auth routes (no proxy, handled by BFF)
  app.use(`${p}/bff/auth`, authRoutes);
  
  // Proxy all other /api/* requests to backend (under /bff for backward compat)
  app.use(`${p}/bff`, proxyRoutes);
  
  // Also proxy /api/* directly (without bff in URL)
  app.use(`${p}/api`, proxyRoutes);
}

// Register with base path (for reverse proxy)
if (basePrefix) {
  registerRoutes(basePrefix);
}

// Also register at root (for direct access / dev)
registerRoutes("");

// ── Serve frontend build (dist ở gốc repo) ────────────────────────────
// Mục đích của BFF là MỘT domain duy nhất cho cả frontend + API: cookie
// session thành first-party nên điện thoại/Safari không chặn như cookie
// bên thứ ba. Muốn vậy BFF phải tự phục vụ luôn bản build frontend.
// Render build cả frontend cho service này (xem buildCommand trong
// render.yaml) nên dist nằm ở ../../dist so với file này. Máy local
// chưa build thì không có dist → bỏ qua, dev vẫn chạy qua Vite như cũ.
const distDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../dist");
if (fs.existsSync(path.join(distDir, "index.html"))) {
  app.use(basePrefix || "/", express.static(distDir));
  if (basePrefix) {
    app.get("/", (req, res) => res.redirect(`${basePrefix}/`));
    // SPA fallback: path không thuộc BFF/API thì trả index.html
    app.get(`${basePrefix}/*`, (req, res, next) => {
      if (req.path.startsWith(`${basePrefix}/bff`) || req.path.startsWith(`${basePrefix}/api`)) return next();
      res.sendFile(path.join(distDir, "index.html"));
    });
  }
  console.log(`[BFF] Serving frontend from ${distDir} at ${basePrefix || "/"}`);
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ status: false, code: 404, msg: "Not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("[BFF] Error:", err);
  res.status(500).json({ status: false, code: 500, msg: "Internal server error" });
});

// Start server
async function start() {
  try {
    await connectSessionStore();
    
    // Periodic cleanup of expired sessions
    setInterval(cleanupExpiredSessions, 60 * 60 * 1000); // Every hour
    
    const server = app.listen(config.port, () => {
      console.log(`[BFF] Server running on port ${config.port}`);
      console.log(`[BFF] Base path: ${config.basePath || "(root)"}`);
      console.log(`[BFF] Frontend origins: ${config.frontendOrigins.join(", ")}`);
      console.log(`[BFF] Backend URL: ${config.backendUrl}`);
    });
    
    // Graceful shutdown
    const shutdown = async (signal) => {
      console.log(`[BFF] ${signal} received, shutting down...`);
      server.close(async () => {
        await closeSessionStore();
        process.exit(0);
      });
      
      // Force close after 10s
      setTimeout(() => {
        console.error("[BFF] Force shutdown");
        process.exit(1);
      }, 10000);
    };
    
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (e) {
    console.error("[BFF] Failed to start:", e);
    process.exit(1);
  }
}

start();

export default app;