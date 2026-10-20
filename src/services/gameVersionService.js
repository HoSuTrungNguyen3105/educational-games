/**
 * gameVersionService.js - Service quản lý phiên bản game
 *
 * Chức năng:
 * - Kiểm tra phiên bản game
 * - Lắng nghe thông báo cập nhật (WebSocket)
 * - Tải data mới khi có phiên bản mới
 */

import { gameDataService } from './gameDataService.js';

class GameVersionService {
  constructor() {
    this.listeners = new Map(); // templateId -> Set of callbacks
    this.checkedVersions = new Map(); // templateId -> { version, checkedAt }
    this.checkInterval = null;
  }

  /**
   * Đăng ký listener cho sự kiện cập nhật version của game
   * @param {string} templateId - ID của game
   * @param {Function} callback - Callback khi có version mới
   * @returns {Function} - Unsubscribe function
   */
  subscribe(templateId, callback) {
    if (!this.listeners.has(templateId)) {
      this.listeners.set(templateId, new Set());
    }
    this.listeners.get(templateId).add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(templateId);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.listeners.delete(templateId);
        }
      }
    };
  }

  /**
   * Thông báo cho tất cả listeners của một game
   * @param {string} templateId - ID của game
   * @param {Object} versionInfo - { version, publishedAt }
   */
  notify(templateId, versionInfo) {
    const callbacks = this.listeners.get(templateId);
    if (callbacks) {
      callbacks.forEach(cb => cb(versionInfo));
    }
  }

  /**
   * Kiểm tra xem có phiên bản mới không
   * @param {string} templateId - ID của game
   * @param {number} currentVersion - Phiên bản hiện tại
   * @returns {Promise<boolean>} - true nếu có phiên bản mới
   */
  async checkForUpdate(templateId, currentVersion) {
    try {
      const versionInfo = await gameDataService.getVersion(templateId);
      if (!versionInfo) return false;

      const latestVersion = versionInfo.version;
      const hasUpdate = latestVersion > currentVersion;

      // Cache kết quả kiểm tra
      this.checkedVersions.set(templateId, {
        version: latestVersion,
        checkedAt: Date.now(),
      });

      if (hasUpdate) {
        this.notify(templateId, versionInfo);
      }

      return hasUpdate;
    } catch (error) {
      console.error(`[gameVersionService] Lỗi kiểm tra phiên bản ${templateId}:`, error);
      return false;
    }
  }

  /**
   * Xử lý sự kiện WebSocket khi nhận thông báo cập nhật
   * @param {Object} event - Sự kiện từ WebSocket
   */
  handleWebSocketEvent(event) {
    if (event.event === 'game.version.updated' && event.templateId && event.version) {
      this.notify(event.templateId, {
        version: event.version,
        publishedAt: event.publishedAt || new Date().toISOString(),
      });
    }
  }

  /**
   * Bắt đầu kiểm tra định kỳ (mỗi 5 phút)
   */
  startPeriodicCheck() {
    if (this.checkInterval) return;

    this.checkInterval = setInterval(async () => {
      for (const [templateId, callbacks] of this.listeners.entries()) {
        if (callbacks.size > 0) {
          const cached = this.checkedVersions.get(templateId);
          const currentVersion = cached?.version || 0;
          await this.checkForUpdate(templateId, currentVersion);
        }
      }
    }, 5 * 60 * 1000); // 5 phút
  }

  /**
   * Dừng kiểm tra định kỳ
   */
  stopPeriodicCheck() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Xóa cache phiên bản đã kiểm tra
   * @param {string} templateId - ID của game (optional)
   */
  clearCache(templateId) {
    if (templateId) {
      this.checkedVersions.delete(templateId);
    } else {
      this.checkedVersions.clear();
    }
  }
}

// Export singleton instance
export const gameVersionService = new GameVersionService();
