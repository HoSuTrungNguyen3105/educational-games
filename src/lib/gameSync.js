/**
 * gameSync.js - Quản lý đồng bộ kết quả game offline
 *
 * Chức năng:
 * - Đồng bộ kết quả game khi có mạng
 * - Quản lý trạng thái đồng bộ
 * - Retry logic khi đồng bộ thất bại
 * - Tích hợp với online/offline events
 */

import { gameResultService } from '../services/gameResultService.js';

class GameSync {
  constructor() {
    this.isSyncing = false;
    this.syncInterval = null;
    this.retryDelay = 5000; // 5 giây
    this.maxRetryDelay = 60000; // 1 phút
    this.currentRetryDelay = this.retryDelay;
  }

  /**
   * Bắt đầu đồng bộ tự động
   * @param {number} intervalMs - Khoảng thời gian kiểm tra (ms)
   */
  startAutoSync(intervalMs = 30000) {
    if (this.syncInterval) {
      this.stopAutoSync();
    }

    console.log('[gameSync] Bắt đầu đồng bộ tự động mỗi', intervalMs, 'ms');

    this.syncInterval = setInterval(() => {
      this.sync();
    }, intervalMs);

    // Đồng bộ ngay lập tức khi bắt đầu
    this.sync();
  }

  /**
   * Dừng đồng bộ tự động
   */
  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('[gameSync] Đã dừng đồng bộ tự động');
    }
  }

  /**
   * Thực hiện đồng bộ các kết quả đang chờ
   * @returns {Promise<Object>} - { success: number, failed: number, total: number }
   */
  async sync() {
    if (this.isSyncing) {
      console.log('[gameSync] Đang đồng bộ, bỏ qua lần này');
      return { success: 0, failed: 0, total: 0 };
    }

    this.isSyncing = true;

    try {
      const pendingCount = gameResultService.getPendingCount();

      if (pendingCount === 0) {
        console.log('[gameSync] Không có kết quả đang chờ đồng bộ');
        this.currentRetryDelay = this.retryDelay; // Reset retry delay
        return { success: 0, failed: 0, total: 0 };
      }

      console.log(`[gameSync] Đang đồng bộ ${pendingCount} kết quả...`);

      const result = await gameResultService.syncPendingResults();

      console.log(`[gameSync] Đồng bộ hoàn thành: ${result.success} thành công, ${result.failed} thất bại`);

      // Nếu có thất bại, tăng retry delay cho lần sau
      if (result.failed > 0) {
        this.currentRetryDelay = Math.min(
          this.currentRetryDelay * 2,
          this.maxRetryDelay
        );
        console.log(`[gameSync] Tăng retry delay lên ${this.currentRetryDelay}ms`);
      } else {
        this.currentRetryDelay = this.retryDelay;
      }

      return {
        success: result.success,
        failed: result.failed,
        total: pendingCount,
      };
    } catch (error) {
      console.error('[gameSync] Lỗi đồng bộ:', error);
      return { success: 0, failed: 0, total: 0 };
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Lấy trạng thái đồng bộ hiện tại
   * @returns {Object}
   */
  getStatus() {
    return {
      isSyncing: this.isSyncing,
      pendingCount: gameResultService.getPendingCount(),
      currentRetryDelay: this.currentRetryDelay,
    };
  }

  /**
   * Đồng bộ ngay lập tức (force sync)
   * @returns {Promise<Object>}
   */
  async forceSync() {
    console.log('[gameSync] Force sync');
    return this.sync();
  }

  /**
   * Xóa tất cả kết quả đang chờ đồng bộ
   */
  clearPending() {
    gameResultService.clearPendingResults();
    console.log('[gameSync] Đã xóa tất cả kết quả đang chờ');
  }
}

// Export singleton instance
export const gameSync = new GameSync();

// Tự động bắt đầu đồng bộ khi có mạng
window.addEventListener('online', () => {
  console.log('[gameSync] Có mạng trở lại, bắt đầu đồng bộ');
  gameSync.sync();
});

// Tự động bắt đầu đồng bộ khi trang tải xong
if (typeof window !== 'undefined') {
  // Đợi một chút để tránh xung đột với các khởi tạo khác
  setTimeout(() => {
    gameSync.startAutoSync(30000); // Mỗi 30 giây
  }, 1000);
}
