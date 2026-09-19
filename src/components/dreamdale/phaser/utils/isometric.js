// isometric.js
// Các hàm tiện ích để làm việc với hệ tọa độ Isometric

export const TILE_WIDTH = 64;
export const TILE_HEIGHT = 32;

/**
 * Chuyển đổi tọa độ Grid (2D) sang Screen (Isometric 2D)
 * @param {number} gridX - Tọa độ X trên lưới
 * @param {number} gridY - Tọa độ Y trên lưới
 * @returns {{x: number, y: number}} Tọa độ trên màn hình pixel
 */
export function gridToScreen(gridX, gridY) {
    const screenX = (gridX - gridY) * (TILE_WIDTH / 2);
    const screenY = (gridX + gridY) * (TILE_HEIGHT / 2);
    return { x: screenX, y: screenY };
}

/**
 * Chuyển đổi tọa độ Screen (Isometric 2D) sang Grid (2D)
 * @param {number} screenX - Tọa độ X trên màn hình
 * @param {number} screenY - Tọa độ Y trên màn hình
 * @returns {{x: number, y: number}} Tọa độ lưới (chưa làm tròn)
 */
export function screenToGrid(screenX, screenY) {
    const gridX = (screenX / (TILE_WIDTH / 2) + screenY / (TILE_HEIGHT / 2)) / 2;
    const gridY = (screenY / (TILE_HEIGHT / 2) - screenX / (TILE_WIDTH / 2)) / 2;
    return { x: gridX, y: gridY };
}

/**
 * Lấy thứ tự z-index/depth để các object đè lên nhau đúng cách trong không gian 2.5D
 * Y càng lớn trên màn hình thì càng ở gần (đè lên object có Y nhỏ hơn).
 * @param {number} screenY 
 * @returns {number}
 */
export function calculateDepth(screenY) {
    return Math.floor(screenY);
}
