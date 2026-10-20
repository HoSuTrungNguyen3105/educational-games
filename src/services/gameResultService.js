/**
 * gameResultService.js - Service quản lý kết quả game
 *
 * Chức năng:
 * - Gửi kết quả game lên backend
 * - Lưu kết quả offline khi mất mạng
 * - Đồng bộ kết quả khi có mạng trở lại
 * - Xử lý idempotency để tránh ghi nhận trùng
 */

import { apiFetch } from './api.js';

const OFFLINE_RESULTS_KEY = 'edu_game_offline_results';
const MAX_PENDING_RESULTS = 50;

export const gameResultService = {
  /**
   * Gửi kết quả game lên backend
   * @param {Object} result - Kết quả game
   * @param {string} result.attemptId - ID duy nhất của lượt chơi
   * @param {string} result.templateId - ID của game
   * @param {number} result.gameVersion - Phiên bản game khi chơi
   * @param {number} result.score - Điểm số
   * @param {Object} result.details - Chi tiết thêm
   * @returns {Promise<Object|null>}
   */
  async submit(result) {
    try {
      const response = await apiFetch('/game-attempts', {
        method: 'POST',
        body: result,
      });

      // Nếu gửi thành công, thử đồng bộ các kết quả đang chờ
      this._syncPendingResults();

      return response;
    } catch (error) {
      // Lỗi mạng hoặc server error -> lưu offline
      if (!error.status || error.status >= 500) {
        this._saveOfflineResult(result);
        console.warn('[gameResultService] Lỗi mạng, đã lưu kết quả offline:', result.attemptId);
      }
      throw error;
    }
  },

  /**
   * Lưu kết quả offline
   * @param {Object} result - Kết quả game
   * @private
   */
  _saveOfflineResult(result) {
    try {
      const queue = this._getPendingResults();

      // Giới hạn số lượng kết quả chờ
      if (queue.length >= MAX_PENDING_RESULTS) {
        queue.shift(); // Xóa kết quả cũ nhất
      }

      queue.push({
        ...result,
        syncStatus: 'pending',
        queuedAt: new Date().toISOString(),
        retryCount: 0,
      });

      localStorage.setItem(OFFLINE_RESULTS_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('[gameResultService] Không thể lưu kết quả offline:', error);
    }
  },

  /**
   * Lấy danh sách kết quả đang chờ đồng bộ
   * @returns {Array}
   * @private
   */
  _getPendingResults() {
    try {
      return JSON.parse(localStorage.getItem(OFFLINE_RESULTS_KEY) || '[]');
    } catch {
      return [];
    }
  },

  /**
   * Đồng bộ các kết quả đang chờ
   * @returns {Promise<{ success: number, failed: number }>}
   */
  async syncPendingResults() {
    return this._syncPendingResults();
  },

  /**
   * Thực hiện đồng bộ các kết quả đang chờ
   * @private
   */
  async _syncPendingResults() {
    const queue = this._getPendingResults();
    if (queue.length === 0) {
      return { success: 0, failed: 0 };
    }

    const remaining = [];
    let successCount = 0;
    let failedCount = 0;

    for (const item of queue) {
      try {
        await apiFetch('/game-attempts', {
          method: 'POST',
          body: {
            attemptId: item.attemptId,
            templateId: item.templateId,
            gameVersion: item.gameVersion,
            score: item.score,
            details: item.details || {},
          },
        });

        // Gửi thành công -> không giữ lại
        successCount++;
      } catch (error) {
        // Lỗi mạng -> giữ lại để retry sau
        if (!error.status || error.status >= 500) {
          item.retryCount = (item.retryCount || 0) + 1;

          // Giới hạn số lần retry (tối đa 10 lần)
          if (item.retryCount < 10) {
            remaining.push(item);
          } else {
            console.warn(`[gameResultService] Bỏ kết quả sau 10 lần retry: ${item.attemptId}`);
            failedCount++;
          }
        } else {
          // Lỗi 4xx (attemptId hết hạn, score không hợp lệ) -> bỏ luôn
          console.warn(`[gameResultService] Bỏ kết quả do lỗi client: ${item.attemptId}`, error.message);
          failedCount++;
        }
      }
    }

    // Lưu lại các kết quả còn lại
    localStorage.setItem(OFFLINE_RESULTS_KEY, JSON.stringify(remaining));

    return { success: successCount, failed: failedCount };
  },

  /**
   * Lấy số lượng kết quả đang chờ đồng bộ
   * @returns {number}
   */
  getPendingCount() {
    return this._getPendingResults().length;
  },

  /**
   * Xóa tất cả kết quả đang chờ
   */
  clearPendingResults() {
    localStorage.removeItem(OFFLINE_RESULTS_KEY);
  },

  /**
   * Xóa một kết quả cụ thể đang chờ
   * @param {string} attemptId - ID của lượt chơi
   */
  removePendingResult(attemptId) {
    const queue = this._getPendingResults();
    const filtered = queue.filter(item => item.attemptId !== attemptId);
    localStorage.setItem(OFFLINE_RESULTS_KEY, JSON.stringify(filtered));
  },
};

// Tự động đồng bộ khi có mạng trở lại
window.addEventListener('online', () => {
  gameResultService.syncPendingResults();
});
