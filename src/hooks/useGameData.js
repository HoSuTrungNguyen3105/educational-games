/**
 * useGameData.js - React hook để quản lý dữ liệu game
 *
 * Chức năng:
 * - Tải dữ liệu game từ cache hoặc API
 * - Quản lý trạng thái loading/error
 * - Hỗ trợ cả game offline và online
 * - Tự động cache data game offline
 */

import { useState, useEffect, useCallback } from 'react';
import { gameDataService } from '../services/gameDataService.js';
import { gameCache } from '../lib/gameCache.js';

export function useGameData(templateId, options = {}) {
  const { playMode = 'offline', forceRefresh = false } = options;

  const [data, setData] = useState(null);
  const [version, setVersion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState(null); // 'cache' | 'api'

  const loadData = useCallback(async () => {
    if (!templateId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Nếu là game offline, thử lấy từ cache trước
      if (playMode === 'offline' && !forceRefresh) {
        const cachedRecord = await gameCache.getRecord(templateId);

        if (cachedRecord) {
          console.log(`[useGameData] Sử dụng cache cho ${templateId}`);
          setData(cachedRecord.data);
          setVersion(cachedRecord.version);
          setSource('cache');
          setLoading(false);

          // Kiểm tra xem có phiên bản mới không (background)
          gameDataService.getVersion(templateId).then(versionInfo => {
            if (versionInfo && versionInfo.version > cachedRecord.version) {
              console.log(`[useGameData] Có phiên bản mới cho ${templateId}: ${versionInfo.version}`);
              // Không tự động cập nhật giữa chừng, chỉ thông báo
            }
          }).catch(() => {
            // Bỏ qua lỗi khi kiểm tra version
          });

          return;
        }
      }

      // Nếu không có cache hoặc force refresh, tải từ API
      console.log(`[useGameData] Tải từ API cho ${templateId}`);
      const gameData = await gameDataService.getData(templateId);

      if (!gameData) {
        throw new Error('Không tìm thấy dữ liệu game');
      }

      // Lấy phiên bản hiện tại
      const versionInfo = await gameDataService.getVersion(templateId);

      setData(gameData);
      setVersion(versionInfo?.version || 1);
      setSource('api');

      // Nếu là game offline, cache lại data
      if (playMode === 'offline') {
        await gameCache.save(templateId, gameData, versionInfo?.version || 1);
      }

      setLoading(false);
    } catch (err) {
      console.error(`[useGameData] Lỗi tải dữ liệu game ${templateId}:`, err);
      setError(err.message);

      // Nếu đang offline và có cache, thử dùng cache như fallback
      if (playMode === 'offline' && !navigator.onLine) {
        const cachedData = await gameCache.get(templateId);
        if (cachedData) {
          console.log(`[useGameData] Fallback sang cache cho ${templateId}`);
          setData(cachedData);
          setSource('cache');
          setError(null);
        }
      }

      setLoading(false);
    }
  }, [templateId, playMode, forceRefresh]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Hàm cập nhật data khi có phiên bản mới
  const updateData = useCallback(async () => {
    if (!templateId) return;

    try {
      const gameData = await gameDataService.getData(templateId);
      const versionInfo = await gameDataService.getVersion(templateId);

      if (gameData) {
        setData(gameData);
        setVersion(versionInfo?.version || 1);

        if (playMode === 'offline') {
          await gameCache.save(templateId, gameData, versionInfo?.version || 1);
        }
      }
    } catch (err) {
      console.error(`[useGameData] Lỗi cập nhật dữ liệu game ${templateId}:`, err);
    }
  }, [templateId, playMode]);

  // Hàm xóa cache
  const clearCache = useCallback(async () => {
    if (!templateId) return;
    await gameCache.delete(templateId);
    console.log(`[useGameData] Đã xóa cache cho ${templateId}`);
  }, [templateId]);

  return {
    data,
    version,
    loading,
    error,
    source,
    hasUpdate: false, // Sẽ được quản lý bởi useGameVersion
    reload: loadData,
    updateData,
    clearCache,
  };
}
