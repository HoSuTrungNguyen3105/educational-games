// Danh mục thành tựu đổi bằng SAO. Server là nguồn thật: giá và quyền sở hữu
// luôn được kiểm lại ở đây, bản copy phía frontend (src/data/redeemStore.js)
// chỉ để hiển thị.
export const REDEEM_ACHIEVEMENTS = [
  { id: "star-rookie",     icon: "🌟", title: "Ngôi sao triển vọng", desc: "Thành tựu đầu tiên đổi bằng sao",                stars: 3 },
  { id: "star-scholar",    icon: "🎓", title: "Học giả nhí",         desc: "Khẳng định bạn chăm chỉ mỗi ngày",              stars: 10 },
  { id: "star-explorer",   icon: "🧭", title: "Nhà thám hiểm tri thức", desc: "Đổi sao lấy huy hiệu của người ham học",     stars: 25 },
  { id: "star-sage",       icon: "🔮", title: "Bậc thầy hiền triết", desc: "Dành cho ai tích lũy được thật nhiều sao",       stars: 50 },
  { id: "star-champion",   icon: "🏆", title: "Nhà vô địch EduPlay", desc: "Huy hiệu dành cho người dẫn đầu",                stars: 100 },
  { id: "star-legend",     icon: "👑", title: "Huyền thoại Sao Việt", desc: "Thành tựu cao nhất, chỉ vài người sở hữu",       stars: 200 },
];

export function findRedeemAchievement(id) {
  return REDEEM_ACHIEVEMENTS.find((a) => a.id === id) || null;
}
