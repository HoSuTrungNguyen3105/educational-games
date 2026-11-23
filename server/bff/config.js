import dotenv from "dotenv";

dotenv.config();

/**
 * BFF Configuration
 * 
 * BFF runs on same origin as frontend (via reverse proxy)
 * Frontend -> BFF (same origin, HttpOnly cookies)
 * BFF -> Backend API (server-to-server with shared secret)
 */

function parseOrigins(envValue, defaults = []) {
  return (envValue || defaults.join(","))
    .split(",")
    .map((s) => s.trim().replace(/\/+$/, ""))
    .filter(Boolean);
}

/**
 * Normalize base path - ensure it starts with / and doesn't end with /
 * Empty string = no base path
 */
function normalizeBasePath(path) {
  if (!path) return "";
  const normalized = path.trim().replace(/\/+$/, "");
  return normalized.startsWith("/") ? normalized : "/" + normalized;
}

const basePath = normalizeBasePath(process.env.BFF_BASE_PATH);

export const config = {
  // BFF Server
  port: Number(process.env.BFF_PORT) || 3001,
  nodeEnv: process.env.NODE_ENV || "development",
  
  // Base path for reverse proxy deployments (e.g., "/educational-games")
  // Empty string = no base path (root deployment)
  basePath,
  
  // Frontend origin (for CORS and cookie domain)
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  frontendOrigins: parseOrigins(process.env.FRONTEND_ORIGINS, [
    "http://localhost:5173",
    "http://localhost:4173",
    "https://hosutrungnguyen3105.github.io",
    "https://ho-nguyen.github.io",
  ]),
  
  // Backend API
  backendUrl: (process.env.BACKEND_URL || "http://localhost:5000/api").replace(/\/+$/, ""),
  backendInternalToken: process.env.BFF_BACKEND_TOKEN || "bff-internal-secret-change-me",
  
  // Session/Cookie
  sessionCookieName: process.env.BFF_SESSION_COOKIE || "bff_session",
  sessionCookiePath: basePath || "/",
  sessionCookieSameSite: (process.env.BFF_COOKIE_SAMESITE || "lax").toLowerCase(),
  sessionCookieSecure: process.env.BFF_COOKIE_SECURE === "true" || process.env.NODE_ENV === "production",
  sessionCookieMaxAge: Number(process.env.BFF_SESSION_MAX_AGE) || 30 * 24 * 60 * 60 * 1000, // 30 days
  
  // CSRF
  csrfCookieName: process.env.BFF_CSRF_COOKIE || "bff_csrf",
  csrfHeaderName: "x-csrf-token",
  
  // MongoDB (reuse existing connection)
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017",
  dbName: process.env.MONGODB_DB || "educational_games",
  
  // Session collection name
  sessionCollection: "bff_sessions",
  
  // Token refresh threshold (ms) - refresh when access token expires within this time
  refreshThresholdMs: 2 * 60 * 1000, // 2 minutes
  
  // Rate limiting
  rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
  rateLimitMax: 100, // requests per window
};