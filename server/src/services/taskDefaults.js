// Bộ nhiệm vụ mặc định (hệ nhiệm vụ mới — collection `tasks`).
//
// Module LÁ: không import gì từ db/services khác để tránh vòng lặp import.
// Hai nơi dùng chung đúng một nguồn dữ liệu này:
//   - db.js: seed lúc khởi tạo, CHỈ khi collection tasks đang rỗng.
//   - taskEngineService.seedDefaultTasks(): endpoint admin nạp mẫu thủ công,
//     khớp theo `code` (tasks có unique index trên code) để chỉ nạp phần thiếu.
//
// Trước đây mảng này nằm inline trong db.js; trang quản trị muốn có nút
// "Nạp bộ nhiệm vụ mẫu" thì phải dùng lại đúng bộ này, không chép tay lần hai.

export function buildDefaultTasks(now = new Date().toISOString()) {
  return [
    { code: "PLAY_1", name: "Chơi 1 trận", description: "Hoàn thành 1 trận game bất kỳ", icon: "🎮", type: "GAME_PLAYED", target: 1, rewardXp: 0, rewardCoin: 10, scope: "DAILY", gameId: null, isActive: true, sortOrder: 1, createdAt: now, updatedAt: now },
    { code: "PLAY_3", name: "Chơi 3 trận", description: "Hoàn thành 3 trận game", icon: "🏆", type: "GAME_PLAYED", target: 3, rewardXp: 0, rewardCoin: 30, scope: "DAILY", gameId: null, isActive: true, sortOrder: 2, createdAt: now, updatedAt: now },
    { code: "PLAY_10", name: "Chơi 10 trận", description: "Hoàn thành 10 trận game", icon: "🎯", type: "GAME_PLAYED", target: 10, rewardXp: 0, rewardCoin: 50, scope: "WEEKLY", gameId: null, isActive: true, sortOrder: 3, createdAt: now, updatedAt: now },
    { code: "WIN_1", name: "Thắng 1 trận", description: "Thắng 1 trận game", icon: "🎉", type: "GAME_WON", target: 1, rewardXp: 0, rewardCoin: 40, scope: "DAILY", gameId: null, isActive: true, sortOrder: 4, createdAt: now, updatedAt: now },
    { code: "WIN_5", name: "Thắng 5 trận", description: "Thắng 5 trận game", icon: "🏅", type: "GAME_WON", target: 5, rewardXp: 0, rewardCoin: 80, scope: "WEEKLY", gameId: null, isActive: true, sortOrder: 5, createdAt: now, updatedAt: now },
    { code: "ANSWER_5", name: "Trả lời 5 câu", description: "Trả lời 5 câu hỏi bất kỳ", icon: "📝", type: "QUESTION_ANSWERED", target: 5, rewardXp: 0, rewardCoin: 15, scope: "DAILY", gameId: null, isActive: true, sortOrder: 6, createdAt: now, updatedAt: now },
    { code: "ANSWER_10", name: "Trả lời 10 câu", description: "Trả lời 10 câu hỏi", icon: "📖", type: "QUESTION_ANSWERED", target: 10, rewardXp: 0, rewardCoin: 30, scope: "DAILY", gameId: null, isActive: true, sortOrder: 7, createdAt: now, updatedAt: now },
    { code: "CORRECT_5", name: "Trả lời đúng 5 câu", description: "Trả lời đúng 5 câu hỏi", icon: "✅", type: "ANSWER_CORRECT", target: 5, rewardXp: 0, rewardCoin: 25, scope: "DAILY", gameId: null, isActive: true, sortOrder: 8, createdAt: now, updatedAt: now },
    { code: "CORRECT_10", name: "Trả lời đúng 10 câu", description: "Trả lời đúng 10 câu hỏi", icon: "🧠", type: "ANSWER_CORRECT", target: 10, rewardXp: 0, rewardCoin: 50, scope: "DAILY", gameId: null, isActive: true, sortOrder: 9, createdAt: now, updatedAt: now },
    { code: "XP_100", name: "Kiếm 100 XP", description: "Tích lũy 100 XP", icon: "⭐", type: "XP_EARNED", target: 100, rewardXp: 0, rewardCoin: 20, scope: "DAILY", gameId: null, isActive: true, sortOrder: 10, createdAt: now, updatedAt: now },
    { code: "XP_500", name: "Kiếm 500 XP", description: "Tích lũy 500 XP", icon: "🌟", type: "XP_EARNED", target: 500, rewardXp: 0, rewardCoin: 80, scope: "DAILY", gameId: null, isActive: true, sortOrder: 11, createdAt: now, updatedAt: now },
    { code: "LOGIN_1", name: "Đăng nhập hôm nay", description: "Đăng nhập vào hệ thống", icon: "👋", type: "LOGIN", target: 1, rewardXp: 0, rewardCoin: 5, scope: "DAILY", gameId: null, isActive: true, sortOrder: 12, createdAt: now, updatedAt: now },
    { code: "SPIN_WHEEL", name: "Quay vòng may mắn", description: "Được quay vòng may mắn hàng ngày", icon: "🎰", type: "SPIN", target: 3, rewardXp: 0, rewardCoin: 0, scope: "DAILY", gameId: null, isActive: true, sortOrder: 14, createdAt: now, updatedAt: now },
    { code: "PLAY_100_TOTAL", name: "Chơi 100 trận", description: "Hoàn thành 100 trận game", icon: "🏅", type: "GAME_PLAYED", target: 100, rewardXp: 0, rewardCoin: 200, scope: "TOTAL", gameId: null, isActive: true, sortOrder: 13, createdAt: now, updatedAt: now },
  ];
}
