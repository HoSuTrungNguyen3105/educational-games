/**
 * Nhãn hiển thị cho một game ở các màn quản trị.
 *
 * Dữ liệu game từ nhiều nguồn/đời bản khác nhau có thể thiếu `name`
 * (bản ghi cũ, phản hồi từ backend đời trước, cache cũ) — render thẳng
 * `game.name` khi đó sẽ in chữ "undefined" ra giao diện. Hàm này luôn
 * trả về một nhãn đọc được: name → title → code → nhãn suy từ id.
 */
export function gameLabel(game) {
  if (!game) return "—";
  const label = game.name || game.title || game.code;
  if (label && String(label).trim()) return String(label);
  const id = game._id || game.id;
  return id ? `Game ${String(id).slice(-6)}` : "Game không tên";
}
