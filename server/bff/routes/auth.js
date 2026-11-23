import { Router } from "express";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { config } from "../config.js";
import { connectSessionStore, createSession, getSession, updateSessionTokens, revokeSession, revokeAllUserSessions } from "../sessionStore.js";
import { sendSuccess, sendError } from "../utils/response.js";

const router = Router();

/**
 * Encryption for refresh token storage
 */
const ENCRYPTION_KEY = config.backendInternalToken.slice(0, 32).padEnd(32, "0");
const IV_LENGTH = 16;

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

function decrypt(text) {
  const [ivHex, encrypted] = text.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

/**
 * Generate CSRF token
 */
function generateCsrfToken() {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Set session cookie (HttpOnly, Secure, SameSite=Lax)
 */
function setSessionCookie(res, sessionId) {
  res.cookie(config.sessionCookieName, sessionId, {
    httpOnly: true,
    secure: config.sessionCookieSecure,
    sameSite: config.sessionCookieSameSite,
    path: config.sessionCookiePath,
    maxAge: config.sessionCookieMaxAge,
  });
}

/**
 * Set CSRF cookie (HttpOnly for double-submit cookie pattern)
 */
function setCsrfCookie(res, csrfToken) {
  res.cookie(config.csrfCookieName, csrfToken, {
    httpOnly: true,
    secure: config.sessionCookieSecure,
    sameSite: config.sessionCookieSameSite,
    path: config.sessionCookiePath,
    maxAge: config.sessionCookieMaxAge,
  });
}

/**
 * Clear session and CSRF cookies
 */
function clearCookies(res) {
  res.clearCookie(config.sessionCookieName, {
    httpOnly: true,
    secure: config.sessionCookieSecure,
    sameSite: config.sessionCookieSameSite,
    path: config.sessionCookiePath,
  });
  res.clearCookie(config.csrfCookieName, {
    httpOnly: true,
    secure: config.sessionCookieSecure,
    sameSite: config.sessionCookieSameSite,
    path: config.sessionCookiePath,
  });
}

/**
 * Call backend API with internal token
 */
async function callBackend(path, options = {}) {
  const url = `${config.backendUrl}${path}`;
  const headers = {
    "Content-Type": "application/json",
    "x-bff-internal-token": config.backendInternalToken,
    ...options.headers,
  };
  
  if (options.body) {
    headers["Content-Length"] = Buffer.byteLength(JSON.stringify(options.body));
  }
  
  const response = await fetch(url, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  
  let data = null;
  try {
    data = await response.json();
  } catch {
    // Non-JSON response
  }
  
  return { status: response.status, data, headers: response.headers };
}

/**
 * POST /bff/auth/login
 * Login via backend, create BFF session with HttpOnly cookies
 */
router.post("/login", async (req, res) => {
  try {
    const { username, password, identifier } = req.body || {};
    const id = identifier || username;
    
    if (!id || !password) {
      return sendError(res, "Vui lòng nhập tên đăng nhập/email và mật khẩu", 400);
    }
    
    // Call backend login
    const { status, data } = await callBackend("/auth/login", {
      method: "POST",
      body: { username: id, password },
    });
    
    if (status !== 200 || !data?.token || !data?.user) {
      return sendError(res, data?.msg || "Sai tên đăng nhập hoặc mật khẩu", status || 401);
    }
    
    // Backend returns access token + refresh token in body (for backward compat)
    // We store both in session, only send session cookie to frontend
    const accessToken = data.token;
    const refreshToken = data.refreshToken; // Backend returns this in body
    const user = data.user;
    
    if (!refreshToken) {
      return sendError(res, "Không nhận được refresh token từ backend", 500);
    }
    
    // Encrypt refresh token for storage
    const encryptedRefreshToken = encrypt(refreshToken);
    
    // Create BFF session
    const { sessionId } = await createSession(user, accessToken, encryptedRefreshToken, {
      ua: req.headers["user-agent"],
      ip: req.ip,
    });
    
    // Set HttpOnly cookies
    setSessionCookie(res, sessionId);
    const csrfToken = generateCsrfToken();
    setCsrfCookie(res, csrfToken);
    
    // Return user info (NO tokens in response)
    sendSuccess(res, {
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        pet: user.pet,
      },
      csrfToken, // Also return CSRF token in body for SPA to use in header
    });
  } catch (e) {
    console.error("[BFF] Login error:", e);
    sendError(res, "Đăng nhập thất bại", 500);
  }
});

/**
 * POST /bff/auth/register
 * Register via backend, create BFF session
 */
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, name, generatedPassword, ageCode, gender } = req.body || {};
    
    if (!username || !password || !name) {
      return sendError(res, "Vui lòng nhập đầy đủ thông tin", 400);
    }
    if (password.length < 6) {
      return sendError(res, "Mật khẩu phải có ít nhất 6 ký tự", 400);
    }
    
    const { status, data } = await callBackend("/auth/register", {
      method: "POST",
      body: { username, email, password, name, generatedPassword, ageCode, gender },
    });
    
    if (status !== 201 || !data?.token || !data?.user) {
      return sendError(res, data?.msg || "Đăng ký thất bại", status || 400);
    }
    
    const accessToken = data.token;
    const refreshToken = data.refreshToken;
    const user = data.user;
    
    if (!refreshToken) {
      return sendError(res, "Không nhận được refresh token từ backend", 500);
    }
    
    const encryptedRefreshToken = encrypt(refreshToken);
    
    const { sessionId } = await createSession(user, accessToken, encryptedRefreshToken, {
      ua: req.headers["user-agent"],
      ip: req.ip,
    });
    
    setSessionCookie(res, sessionId);
    const csrfToken = generateCsrfToken();
    setCsrfCookie(res, csrfToken);
    
    sendSuccess(res, {
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        pet: user.pet,
      },
      csrfToken,
    }, "register.success", 201);
  } catch (e) {
    console.error("[BFF] Register error:", e);
    sendError(res, "Đăng ký thất bại", 500);
  }
});

/**
 * POST /bff/auth/logout
 * Logout: revoke backend refresh token, clear BFF session
 */
router.post("/logout", async (req, res) => {
  try {
    const sessionId = req.cookies?.[config.sessionCookieName];
    let session = null;
    
    if (sessionId) {
      session = await getSession(sessionId);
    }
    
    // Call backend logout to revoke refresh token family
    if (session?.refreshToken) {
      let refreshToken;
      try {
        refreshToken = decrypt(session.refreshToken);
      } catch (e) {
        console.warn("[BFF] Failed to decrypt refresh token for logout:", e);
      }
      
      if (refreshToken) {
        try {
          await callBackend("/auth/logout", {
            method: "POST",
            headers: {
              "x-refresh-token": refreshToken,
            },
          });
        } catch (e) {
          console.warn("[BFF] Backend logout failed:", e.message);
        }
      }
    }
    
    // Revoke BFF session
    if (sessionId) {
      await revokeSession(sessionId);
    }
    
    clearCookies(res);
    sendSuccess(res, { loggedOut: true });
  } catch (e) {
    console.error("[BFF] Logout error:", e);
    // Still clear cookies even if backend fails
    clearCookies(res);
    sendSuccess(res, { loggedOut: true });
  }
});

/**
 * POST /bff/auth/refresh
 * Refresh access token using session's refresh token
 */
router.post("/refresh", async (req, res) => {
  try {
    const sessionId = req.cookies?.[config.sessionCookieName];
    if (!sessionId) {
      return sendError(res, "Không có phiên đăng nhập", 401);
    }
    
    const session = await getSession(sessionId);
    if (!session || session.revoked) {
      clearCookies(res);
      return sendError(res, "Phiên đã hết hạn hoặc bị thu hồi", 401);
    }
    
    // Decrypt refresh token
    let refreshToken;
    try {
      refreshToken = decrypt(session.refreshToken);
    } catch (e) {
      console.error("[BFF] Failed to decrypt refresh token:", e);
      await revokeSession(sessionId);
      clearCookies(res);
      return sendError(res, "Phiên đăng nhập không hợp lệ", 401);
    }
    
    // Check if access token still usable (with threshold)
    let accessToken = session.accessToken;
    let shouldRefresh = false;
    
    try {
      const payload = jwt.decode(accessToken);
      if (payload?.exp) {
        const expiresAt = payload.exp * 1000;
        const now = Date.now();
        if (expiresAt - now < config.refreshThresholdMs) {
          shouldRefresh = true;
        }
      } else {
        shouldRefresh = true; // No exp claim, refresh to be safe
      }
    } catch {
      shouldRefresh = true;
    }
    
    if (!shouldRefresh) {
      // Token still valid, return current user info
      return sendSuccess(res, { user: sessionUser(session) });
    }
    
    // Need to refresh - call backend with refresh token
    const { status, data } = await callBackend("/auth/refresh", {
      method: "POST",
      headers: {
        "x-refresh-token": refreshToken,
      },
    });
    
    if (status !== 200 || !data?.token) {
      // Refresh failed - revoke session
      await revokeSession(sessionId);
      clearCookies(res);
      return sendError(res, data?.msg || "Phiên đăng nhập đã hết hạn", 401);
    }
    
    const newAccessToken = data.token;
    const newRefreshToken = data.refreshToken || refreshToken; // Backend rotates
    
    // Encrypt new refresh token
    const encryptedNewRefreshToken = encrypt(newRefreshToken);
    
    // Update session with new tokens
    await updateSessionTokens(sessionId, newAccessToken, encryptedNewRefreshToken);
    
    // Return user info (no tokens)
    const updatedSession = await getSession(sessionId);
    sendSuccess(res, { user: sessionUser(updatedSession) });
  } catch (e) {
    console.error("[BFF] Refresh error:", e);
    sendError(res, "Làm mới phiên thất bại", 500);
  }
});

/**
 * GET /bff/auth/me
 * Get current user from session
 */
router.get("/me", async (req, res) => {
  try {
    const sessionId = req.cookies?.[config.sessionCookieName];
    if (!sessionId) {
      return sendError(res, "Chưa đăng nhập", 401);
    }
    
    const session = await getSession(sessionId);
    if (!session || session.revoked) {
      clearCookies(res);
      return sendError(res, "Phiên đã hết hạn", 401);
    }
    
    // Check if access token needs refresh
    let accessToken = session.accessToken;
    try {
      const payload = jwt.decode(accessToken);
      if (payload?.exp) {
        const expiresAt = payload.exp * 1000;
        if (expiresAt - Date.now() < config.refreshThresholdMs) {
          // Proactively refresh in background (fire and forget)
          refreshInBackground(sessionId).catch(console.error);
        }
      }
    } catch {
      // Ignore decode errors
    }
    
    sendSuccess(res, { user: sessionUser(session) });
  } catch (e) {
    console.error("[BFF] Me error:", e);
    sendError(res, "Lỗi lấy thông tin người dùng", 500);
  }
});

/**
 * Background token refresh
 */
async function refreshInBackground(sessionId) {
  try {
    const session = await getSession(sessionId);
    if (!session || session.revoked) return;
    
    let refreshToken;
    try {
      refreshToken = decrypt(session.refreshToken);
    } catch (e) {
      console.error("[BFF] Failed to decrypt refresh token for background refresh:", e);
      return;
    }
    
    const { status, data } = await callBackend("/auth/refresh", {
      method: "POST",
      headers: {
        "x-refresh-token": refreshToken,
      },
    });
    
    if (status === 200 && data?.token) {
      const newRefreshToken = data.refreshToken || refreshToken;
      const encryptedNewRefreshToken = encrypt(newRefreshToken);
      await updateSessionTokens(sessionId, data.token, encryptedNewRefreshToken);
    }
  } catch (e) {
    // Ignore background refresh errors
  }
}

/**
 * Convert session to user object
 */
function sessionUser(session) {
  return {
    id: session.userId,
    username: session.username,
    name: session.name,
    role: session.role,
    email: session.email,
  };
}

/**
 * POST /bff/auth/game-token
 * Get a short-lived access token for game iframes
 * The game iframe uses this token to authenticate with the backend API
 */
router.post("/game-token", async (req, res) => {
  try {
    const sessionId = req.cookies?.[config.sessionCookieName];
    if (!sessionId) {
      return sendError(res, "Chưa đăng nhập", 401);
    }
    
    const session = await getSession(sessionId);
    if (!session || session.revoked) {
      clearCookies(res);
      return sendError(res, "Phiên đã hết hạn", 401);
    }
    
    // Return the access token for game iframe to use
    // This is a short-lived token that the game can use for API calls
    sendSuccess(res, { 
      token: session.accessToken,
      userId: session.userId,
    });
  } catch (e) {
    console.error("[BFF] Game token error:", e);
    sendError(res, "Lỗi lấy token game", 500);
  }
});

export default router;