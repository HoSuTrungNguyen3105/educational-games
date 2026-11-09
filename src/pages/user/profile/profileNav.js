// Danh mục điều hướng trong trang Hồ sơ. `id` là id của thẻ section
// tương ứng bên cột nội dung.
import { GraduationCap, Gamepad2, LayoutDashboard, Palette, Settings, Smartphone } from "lucide-react";

// Mobile: danh sách hàng chạm, `jumpTo` trong ProfileScreen cuộn tới section.
export const NAV = [
  { id: "sec-outfit", label: "Avatar & thú cưng", Icon: Palette },
  { id: "sec-class", label: "Lớp học", Icon: GraduationCap },
  { id: "sec-games", label: "Trò chơi", Icon: Gamepad2 },
  { id: "sec-settings", label: "Cài đặt của bé", Icon: Settings },
  { id: "sec-app", label: "Ứng dụng & thông báo", Icon: Smartphone },
];

// Desktop: menu chọn mục nào thì vùng nội dung chỉ hiện section của mục
// đó (kiểu tab như trang account mẫu) — có thêm mục "Tổng quan" đứng đầu,
// chứa hai thẻ Thông tin cá nhân + Ví của bé (vốn nằm ở sidebar khi trang
// còn là một trang cuộn dài).
export const DESKTOP_NAV = [
  { id: "sec-overview", label: "Tổng quan", Icon: LayoutDashboard },
  ...NAV,
];
