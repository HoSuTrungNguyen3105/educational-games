// utils/escapeRegex.js — escape ký tự regex đặc biệt, dùng chung cho các
// service từng có bản sao local (gameService, conversationService,
// permissionService). Regex giữ nguyên; body không ép kiểu String() — mọi
// call site đều truyền string sẵn nên hành vi giống hệt bản local cũ.

/** Escape ký tự đặc biệt của RegExp: `a.b` → `a\.b`. */
export function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
