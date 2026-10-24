// pages/user/PetWardrobePage.jsx
//
// TIỆM THAY ĐỒ THÚ CƯNG — chọn loài + áo / kính / mũ / nơ cho bé.
//
// Trang này chỉ bọc `DressUpCustomizer kind="pet"` — đúng modal mà trang Profile
// mở — để "Kho trang phục" và Profile dùng chung MỘT bộ chọn. Trước đây nó là
// grid theo 7 ô của `userPets` với id trang phục hệ cũ (`hat_crown_01`,
// `scarf_red_01`…), mà hệ đó không trùng id nào với bộ đồ DressUp trong hồ sơ:
// mặc xong không màn hình nào hiện vì chỗ vẽ đã đổi sang đọc `pet.look`.
//
// Lưu: DressUpCustomizer tự ghi cache máy `eg-outfit-pet-v1` rồi gọi onSave →
// wear() → PUT /api/auth/me { pet } (cùng đường trang Profile vẫn đi). Xong là
// home, HUD game, bảng xếp hạng và Profile hiện đúng con thú vừa chọn.

import { useCallback, useEffect, useState } from "react";
import { navigate } from "../../lib/router.js";
import { Loader } from "../../components/ui";
import DressUpCustomizer from "../../components/avatar/DressUpCustomizer.jsx";
import { usePet, loadPet, wear } from "../../services/petService.js";

export default function PetWardrobePage() {
  const pet = usePet();
  const [ready, setReady] = useState(false);

  // Chờ store nạp xong mới mở bộ chọn: `initial` chỉ đọc một lần lúc mount, mở
  // sớm thì bản cache cũ bị giữ lại và lưu đè lên diện mạo thật trên server.
  useEffect(() => { loadPet().finally(() => setReady(true)); }, []);

  const handleSave = useCallback(async (kind, value) => {
    const res = await wear(value);
    if (!res.ok) throw new Error(res.error || "Không lưu được");
  }, []);

  if (!ready) {
    return (
      <div className="grid min-h-full place-items-center bg-paper">
        <Loader label="Đang mở tiệm thay đồ..." />
      </div>
    );
  }

  return (
    <DressUpCustomizer
      kind="pet"
      initial={pet.look}
      onSave={handleSave}
      onClose={() => navigate("/pet")}
    />
  );
}
