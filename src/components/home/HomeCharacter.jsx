/**
 * HomeCharacter.jsx — nhân vật của chính học sinh trong khu vực chào
 * (hero) của trang chủ.
 *
 * Vẽ bằng CharacterStage với body + phụ kiện lấy từ bộ đồ đã lưu của bé
 * (resolveOutfit — cùng nguồn với trang Hồ sơ: hồ sơ server + cache máy,
 * chưa từng chọn thì là bộ đồ mặc định theo giới tính). Vào trang thì
 * vẫy chào (wave) rồi về idle; bấm vào nhân vật thì vẫy lại; nhận
 * `celebrateKey` từ trang chủ để nhảy ăn mừng khi bé điểm danh xong.
 *
 * Chỉ hiện khi đã đăng nhập — khách giữ nguyên hero như cũ. Trên mobile
 * (≤820px) hero desktop ẩn theo layout ảnh mẫu riêng nên khối này cũng
 * không hiện; nhân vật vẫn sống động trong màn tuỳ chỉnh ở mọi thiết bị.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import CharacterStage from "../character/CharacterStage.jsx";
import { resolveOutfit, outfitName } from "../../lib/dressUpAvatar.js";

export default function HomeCharacter({ userAuth, celebrateKey = 0 }) {
  const user = userAuth?.user || null;

  const outfit = useMemo(
    () => (user ? resolveOutfit(user.avatar, user.pet).avatar.value : null),
    [user]
  );

  const [mood, setMood] = useState("wave");
  const idleTimer = useRef(null);
  useEffect(() => {
    if (!user) return undefined;
    idleTimer.current = setTimeout(() => setMood("idle"), 2000);
    return () => clearTimeout(idleTimer.current);
  }, [user]);

  if (!user || !outfit) return null;
  const name = outfitName("avatar", outfit) || "Nhân vật của bé";

  const waveAgain = () => {
    setMood("wave");
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setMood("idle"), 1600);
  };

  return (
    <div
      className="gq-hero__char"
      role="button"
      tabIndex={0}
      aria-label={`${name} — bấm để vẫy chào`}
      title={`${name} — bấm để vẫy chào`}
      onClick={waveAgain}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          waveAgain();
        }
      }}
    >
      <CharacterStage
        bodyId={outfit.body}
        accessories={outfit}
        mood={mood}
        celebrateKey={celebrateKey}
        label={name}
      />
    </div>
  );
}
