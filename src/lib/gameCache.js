/**
 * gameCache.js - IndexedDB cache cho dữ liệu game offline
 *
 * Chức năng:
 * - Lưu JSON data game vào IndexedDB
 * - Đọc data game từ cache
 * - Kiểm tra và cập nhật cache khi có phiên bản mới
 * - Quản lý dung lượng cache
 */

const DB_NAME = 'EduGameCache';
const DB_VERSION = 1;
const STORE_NAME = 'gameData';
const MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB

class GameCache {
  constructor() {
    this.db = null;
    this.initPromise = null;
  }

  /**
   * Khởi tạo IndexedDB
   * @returns {Promise<IDBDatabase>}
   */
  async init() {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('[gameCache] Không thể mở IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Tạo object store cho game data
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'templateId' });

          // Tạo index cho version
          store.createIndex('version', 'version', { unique: false });

          // Tạo index cho thời gian tải
          store.createIndex('cachedAt', 'cachedAt', { unique: false });
        }
      };
    });

    return this.initPromise;
  }

  /**
   * Lưu data game vào cache
   * @param {string} templateId - ID của game
   * @param {Object} data - Data game (JSON)
   * @param {number} version - Phiên bản của game
   * @returns {Promise<void>}
   */
  async save(templateId, data, version = 1) {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const record = {
        templateId,
        data,
        version,
        cachedAt: new Date().toISOString(),
        size: JSON.stringify(data).length,
      };

      const request = store.put(record);

      request.onsuccess = () => {
        console.log(`[gameCache] Đã cache game ${templateId} (version ${version})`);
        resolve();
      };

      request.onerror = () => {
        console.error(`[gameCache] Lỗi cache game ${templateId}:`, request.error);
        reject(request.error);
      };

      transaction.oncomplete = () => {
        // Kiểm tra và dọn dẹp cache nếu quá dung lượng
        this._cleanupIfNeeded();
      };
    });
  }

  /**
   * Lấy data game từ cache
   * @param {string} templateId - ID của game
   * @returns {Promise<Object|null>}
   */
  async get(templateId) {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(templateId);

      request.onsuccess = () => {
        const record = request.result;
        if (record) {
          console.log(`[gameCache] Đã lấy game ${templateId} từ cache (version ${record.version})`);
          resolve(record.data);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => {
        console.error(`[gameCache] Lỗi lấy game ${templateId} từ cache:`, request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Lấy cả record cache (kèm version, cachedAt)
   * @param {string} templateId - ID của game
   * @returns {Promise<Object|null>}
   */
  async getRecord(templateId) {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(templateId);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => {
        console.error(`[gameCache] Lỗi lấy record ${templateId}:`, request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Kiểm tra xem game có trong cache không
   * @param {string} templateId - ID của game
   * @returns {Promise<boolean>}
   */
  async has(templateId) {
    const record = await this.getRecord(templateId);
    return record !== null;
  }

  /**
   * Xóa game khỏi cache
   * @param {string} templateId - ID của game
   * @returns {Promise<void>}
   */
  async delete(templateId) {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(templateId);

      request.onsuccess = () => {
        console.log(`[gameCache] Đã xóa game ${templateId} khỏi cache`);
        resolve();
      };

      request.onerror = () => {
        console.error(`[gameCache] Lỗi xóa game ${templateId}:`, request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Xóa tất cả cache
   * @returns {Promise<void>}
   */
  async clear() {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => {
        console.log('[gameCache] Đã xóa toàn bộ cache');
        resolve();
      };

      request.onerror = () => {
        console.error('[gameCache] Lỗi xóa cache:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Lấy danh sách tất cả game trong cache
   * @returns {Promise<Array>}
   */
  async list() {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result || []);
      };

      request.onerror = () => {
        console.error('[gameCache] Lỗi list cache:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Lấy tổng dung lượng cache
   * @returns {Promise<number>} - Dung lượng tính bằng bytes
   */
  async getSize() {
    const records = await this.list();
    return records.reduce((total, record) => total + (record.size || 0), 0);
  }

  /**
   * Dọn dẹp cache nếu quá dung lượng tối đa
   * @private
   */
  async _cleanupIfNeeded() {
    const size = await this.getSize();

    if (size > MAX_CACHE_SIZE) {
      console.log(`[gameCache] Cache quá lớn (${(size / 1024 / 1024).toFixed(2)}MB), đang dọn dẹp...`);

      const records = await this.list();

      // Sắp xếp theo thời gian cache (cũ nhất trước)
      records.sort((a, b) => new Date(a.cachedAt) - new Date(b.cachedAt));

      // Xóa dần cho đến khi dưới 80% dung lượng tối đa
      const targetSize = MAX_CACHE_SIZE * 0.8;
      let currentSize = size;

      for (const record of records) {
        if (currentSize <= targetSize) break;

        await this.delete(record.templateId);
        currentSize -= record.size || 0;
      }

      console.log(`[gameCache] Đã dọn dẹp cache, còn ${(currentSize / 1024 / 1024).toFixed(2)}MB`);
    }
  }

  /**
   * Xóa các game cũ (không dùng trong 30 ngày)
   * @returns {Promise<number>} - Số game đã xóa
   */
  async cleanupOldGames() {
    const records = await this.list();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    let deletedCount = 0;

    for (const record of records) {
      const cachedAt = new Date(record.cachedAt);
      if (cachedAt < thirtyDaysAgo) {
        await this.delete(record.templateId);
        deletedCount++;
      }
    }

    if (deletedCount > 0) {
      console.log(`[gameCache] Đã xóa ${deletedCount} game cũ`);
    }

    return deletedCount;
  }
}

// Export singleton instance
export const gameCache = new GameCache();
