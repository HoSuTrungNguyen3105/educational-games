// components/PetAvatar.jsx
//
// THINH LƯỜNG GIỮ LẠI từ bản cũ — không xoá.
//
// Lý do: `HomeScreen.jsx` và `GameHud.jsx` đang import từ đường dẫn này.
// Giữ file làm cầu nối, toàn bộ code thật nằm ở `components/pet/`:
//
//   PetAvatar → components/pet/PetAvatar.jsx  (avatar tròn + badge Lv)
//   PetSvg    → components/PetSvg.jsx        (bọc PetRenderer)
//   PetBubble → components/PetSvg.jsx        (bong bóng thoại)
//
// Thêm nơi nào cần hiện pet thì import `PetAvatar` hoặc `PetRenderer` từ
// `components/pet/` — đừng tạo thêm component vẽ pet thứ hai.

export { default as PetAvatar } from "./pet/PetAvatar.jsx";
export { default as PetSvg, PetBubble } from "./PetSvg.jsx";