/**
 * authToken — Compatibility layer for BFF authentication.
 * 
 * With BFF (Backend for Frontend), tokens are managed server-side via HttpOnly cookies.
 * This module provides the same API as before but delegates to the new auth system
 * in src/services/api.js which communicates with the BFF.
 * 
 * Key changes from pre-BFF:
 * - No localStorage storage of tokens
 * - No access token in memory
 * - No refresh token handling (BFF does this automatically)
 * - Auth state = current user from BFF /auth/me endpoint
 */

import {
  getCurrentUser as _getCurrentUser,
  setCurrentUser as _setCurrentUser,
  clearCurrentUser as _clearCurrentUser,
  subscribeAuth as _subscribeAuth,
  checkAuth,
  login as _login,
  register as _register,
  logout as _logout,
  refreshAuth,
} from "../services/api.js";

const AUTH_KEY = "edu_games_auth";

/** @type {{user: object|null} | null} */
let memory = null;
const listeners = new Set();

function emit() {
  for (const cb of listeners) {
    try { cb(memory); } catch { /* ignore */ }
  }
}

/**
 * Subscribe to auth changes from the new system
 */
_subscribeAuth((user) => {
  memory = user ? { token: "bff-managed", user, refreshToken: "bff-managed" } : null;
  emit();
});

/**
 * Kiểm tra localStorage để maintain backward compatibility
 * (các module cũ vẫn đọc key này để biết user nào đang đăng nhập)
 */
function readStorage() {
  try {
    const raw = JSON.parse(window.localStorage.getItem(AUTH_KEY) || "null");
    return raw && typeof raw === "object" ? raw : null;
  } catch {
    return null;
  }
}

function writeStorage(auth) {
  try {
    if (auth) window.localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
    else window.localStorage.removeItem(AUTH_KEY);
  } catch { /* Safari private mode */ }
}

/**
 * Đồng bộ từ localStorage (cho backward compatibility)
 * Trả về user hiện tại từ BFF
 */
export async function getAuth() {
  if (memory?.user) return memory;
  
  // Try to get current user from BFF
  const user = await checkAuth();
  if (user) {
    memory = { token: "bff-managed", user, refreshToken: "bff-managed" };
    return memory;
  }
  
  // Fallback to localStorage for backward compat
  const stored = readStorage();
  if (stored?.user) {
    memory = { token: "bff-managed", user: stored.user, refreshToken: "bff-managed" };
    return memory;
  }
  
  return null;
}

export function getToken() {
  // With BFF, access token is in HttpOnly cookie, not accessible to JS
  // Return a placeholder for backward compat
  return memory?.token || "bff-managed";
}

export function getRefreshToken() {
  // With BFF, refresh token is in HttpOnly cookie, not accessible to JS
  return memory?.refreshToken || "bff-managed";
}

export function isExpired() {
  // With BFF, we don't have access to token expiry
  // The BFF handles refresh automatically
  return false;
}

export function isUsable() {
  return !!memory?.user;
}

export async function setAuth(auth, { persist = true } = {}) {
  if (!auth || !auth.user) {
    memory = null;
    if (persist) writeStorage(null);
    emit();
    return memory;
  }
  
  memory = {
    token: "bff-managed",
    user: auth.user,
    refreshToken: "bff-managed",
  };
  
  if (persist) {
    writeStorage({ user: auth.user });
  }
  
  emit();
  return memory;
}

export function setRefreshToken(raw) {
  // No-op with BFF - refresh token managed by BFF
  const current = getAuth();
  if (current) {
    setAuth({ ...current, refreshToken: "bff-managed" });
  }
}

export function clearAuth() {
  memory = null;
  writeStorage(null);
  emit();
}

/**
 * Đăng nhập qua BFF
 */
export async function login(username, password) {
  const result = await _login(username, password);
  if (result?.user) {
    await setAuth({ user: result.user });
  }
  return result;
}

/**
 * Đăng ký qua BFF
 */
export async function register(data) {
  const result = await _register(data);
  if (result?.user) {
    await setAuth({ user: result.user });
  }
  return result;
}

/**
 * Đăng xuất qua BFF
 */
export async function logout() {
  await _logout();
  clearAuth();
}

export function subscribeAuth(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

// Backward compatibility exports
export const loadAuth = getAuth;
export const saveAuth = setAuth;
export const clearAuth = clearAuth;