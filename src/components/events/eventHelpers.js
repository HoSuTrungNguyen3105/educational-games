// components/events/eventHelpers.js
//
// Helper + hook dùng chung cho giao diện Sự kiện theo mùa phía học sinh
// (tách khỏi EventViews.jsx để file component chỉ export component).
// Mọi số liệu do server tính từ lịch sử ván chơi thật — ở đây chỉ có
// hàm trình bày (nhãn thưởng, đếm ngược) và hook nạp danh mục cây.

import { useEffect, useState } from "react";
import { gardenService } from "../../services/api.js";

/** Map id → plantType từ danh mục cây thật (cho nhãn thưởng hạt giống). */
export function usePlantTypes() {
  const [map, setMap] = useState({});
  useEffect(() => {
    let cancelled = false;
    gardenService
      .getPlantTypes()
      .then((list) => {
        if (cancelled || !Array.isArray(list)) return;
        const m = {};
        for (const p of list) m[p.id] = p;
        setMap(m);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);
  return map;
}

export function rewardLabel(reward, plantTypes = {}) {
  if (!reward) return "";
  if (reward.kind === "seed") {
    const pt = plantTypes[reward.plantTypeId];
    return pt ? `Hạt giống ${pt.icon || "🌱"} ${pt.name}` : "Hạt giống cây quý";
  }
  return `Huy hiệu ${reward.icon || "🏅"} ${reward.name || ""}`.trim();
}

/** "Còn 2 ngày 3 giờ" / "Còn 5 giờ 12 phút" / "Đã kết thúc". */
export function timeLeftText(endsAt, nowMs = Date.now()) {
  const ms = new Date(endsAt).getTime() - nowMs;
  if (Number.isNaN(ms)) return "";
  if (ms <= 0) return "Đã kết thúc";
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const mins = Math.floor((ms % 3600000) / 60000);
  if (days > 0) return `Còn ${days} ngày ${hours} giờ`;
  if (hours > 0) return `Còn ${hours} giờ ${mins} phút`;
  return `Còn ${Math.max(1, mins)} phút`;
}
