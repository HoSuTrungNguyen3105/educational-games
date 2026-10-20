/**
 * gameDataService.js - Service quản lý dữ liệu game từ backend
 *
 * Chức năng:
 * - Lấy danh sách game từ backend
 * - Lấy thông tin chi tiết game theo templateId
 * - Tải JSON data của game
 * - Lấy phiên bản mới nhất của game
 */

import { apiFetch } from './api.js';

export const gameDataService = {
  /**
   * Lấy danh sách tất cả game
   * @param {Object} filters - Bộ lọc tùy chọn
   * @returns {Promise<Array>}
   */
  async list(filters = {}) {
    const params = new URLSearchParams();
    if (filters.type) params.set('type', filters.type);
    if (filters.playMode) params.set('playMode', filters.playMode);
    if (filters.status) params.set('status', filters.status);
    const qs = params.toString();
    return apiFetch(`/games${qs ? `?${qs}` : ''}`) || [];
  },

  /**
   * Lấy thông tin game theo templateId
   * @param {string} templateId - ID của game template
   * @returns {Promise<Object|null>}
   */
  async get(templateId) {
    try {
      return await apiFetch(`/games/${encodeURIComponent(templateId)}`);
    } catch (error) {
      console.error(`[gameDataService] Không lấy được game ${templateId}:`, error);
      return null;
    }
  },

  /**
   * Lấy data JSON của game (câu hỏi, cấu hình, etc.)
   * @param {string} templateId - ID của game template
   * @returns {Promise<Object|null>}
   */
  async getData(templateId) {
    try {
      return await apiFetch(`/games/${encodeURIComponent(templateId)}/data`);
    } catch (error) {
      console.error(`[gameDataService] Không lấy được data game ${templateId}:`, error);
      return null;
    }
  },

  /**
   * Kiểm tra phiên bản mới nhất của game
   * @param {string} templateId - ID của game template
   * @returns {Promise<Object|null>} - { version: number, publishedAt: string }
   */
  async getVersion(templateId) {
    try {
      return await apiFetch(`/games/${encodeURIComponent(templateId)}/version`);
    } catch (error) {
      console.error(`[gameDataService] Không lấy được phiên bản game ${templateId}:`, error);
      return null;
    }
  },

  /**
   * Lấy game theo code (dùng cho chia sẻ game)
   * @param {string} code - Mã code của game
   * @returns {Promise<Object|null>}
   */
  async getByCode(code) {
    try {
      return await apiFetch(`/games/code/${encodeURIComponent(code.trim())}`);
    } catch (error) {
      console.error(`[gameDataService] Không lấy được game với code ${code}:`, error);
      return null;
    }
  },
};
