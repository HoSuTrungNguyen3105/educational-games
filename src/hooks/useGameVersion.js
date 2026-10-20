/**
 * useGameVersion.js - React hook để quản lý phiên bản game
 *
 * Chức năng:
 * - Kiểm tra phiên bản mới của game
 * - Subscribe các sự kiện cập nhật
 * - Thông báo khi có phiên bản mới
 */

import { useState, useEffect, useCallback } from 'react';
import { gameVersionService } from '../services/gameVersionService.js';
import { gameDataService } from '../services/gameDataService.js';

export function useGameVersion(templateId, currentVersion = 0) {
  const [latestVersion, setLatestVersion] = useState(currentVersion);
  const [hasUpdate, setHasUpdate] = useState(false);
  const [checking, setChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);

  // Kiểm tra phiên bản mới
  const checkForUpdate = useCallback(async () => {
    if (!templateId) return;

    setChecking(true);

    try {
      const versionInfo = await gameDataService.getVersion(templateId);

      if (versionInfo) {
        setLatestVersion(versionInfo.version);
        setHasUpdate(versionInfo.version > currentVersion);
        setLastChecked(new Date().toISOString());
      }
    } catch (err) {
      console.error(`[useGameVersion] Lỗi kiểm tra phiên bản ${templateId}:`, err);
    } finally {
      setChecking(false);
    }
  }, [templateId, currentVersion]);

  // Subscribe để nhận thông báo cập nhật real-time
  useEffect(() => {
    if (!templateId) return;

    const unsubscribe = gameVersionService.subscribe(templateId, (versionInfo) => {
      console.log(`[useGameVersion] Nhận thông báo cập nhật cho ${templateId}:`, versionInfo);
      setLatestVersion(versionInfo.version);
      setHasUpdate(versionInfo.version > currentVersion);
      setLastChecked(new Date().toISOString());
    });

    // Kiểm tra lần đầu khi mount
    checkForUpdate();

    return () => {
      unsubscribe();
    };
  }, [templateId, currentVersion, checkForUpdate]);

  // Cập nhật currentVersion khi thay đổi
  useEffect(() => {
    if (currentVersion > 0 && latestVersion > 0) {
      setHasUpdate(latestVersion > currentVersion);
    }
  }, [currentVersion, latestVersion]);

  // Hàm để đánh dấu đã cập nhật (sau khi user cập nhật thành công)
  const markAsUpdated = useCallback(() => {
    setHasUpdate(false);
    setLatestVersion(currentVersion);
  }, [currentVersion]);

  return {
    latestVersion,
    hasUpdate,
    checking,
    lastChecked,
    checkForUpdate,
    markAsUpdated,
  };
}
