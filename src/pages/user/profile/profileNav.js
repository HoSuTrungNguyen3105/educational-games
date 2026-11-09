// Danh mục điều hướng trong trang Hồ sơ — dùng chung cho sidebar desktop
// và danh sách chức năng mobile. `id` là id của thẻ section tương ứng bên
// cột nội dung, `jumpTo` trong ProfileScreen cuộn tới đó.
import { GraduationCap, Gamepad2, Palette, Settings, Smartphone } from "lucide-react";

export const NAV = [
  { id: "sec-outfit", label: "Avatar & thú cưng", Icon: Palette },
  { id: "sec-class", label: "Lớp học", Icon: GraduationCap },
  { id: "sec-games", label: "Trò chơi", Icon: Gamepad2 },
  { id: "sec-settings", label: "Cài đặt của bé", Icon: Settings },
  { id: "sec-app", label: "Ứng dụng & thông báo", Icon: Smartphone },
];
