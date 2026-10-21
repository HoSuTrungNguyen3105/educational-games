/**
 * GameVersionProvider.jsx - Provider để quản lý kiểm tra phiên bản game tự động
 *
 * Chức năng:
 * - Kiểm tra phiên bản game định kỳ
 * - Lắng nghe socket event `game.version.updated` (server bắn khi publish)
 * - Cung cấp context cho các component con
 */

import { createContext, useContext, useEffect, useState } from 'react';
import { socket } from '../socket/socket.js';
import { SOCKET_EVENTS } from '../socket/socket.events.js';
import { gameVersionService } from '../services/gameVersionService.js';

const GameVersionContext = createContext(null);

export function GameVersionProvider({ children }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Kiểm tra định kỳ vẫn chạy dự phòng cho client không giữ socket
    gameVersionService.startPeriodicCheck();
    setIsInitialized(true);

    // Socket singleton do userAuth store connect/disconnect khi đăng nhập —
    // ở đây chỉ gắn listener; socket.on hoạt động cả khi chưa connected.
    const handleVersionUpdated = (data = {}) => {
      gameVersionService.handleWebSocketEvent({
        event: SOCKET_EVENTS.GAME_VERSION_UPDATED,
        ...data,
      });
    };
    socket.on(SOCKET_EVENTS.GAME_VERSION_UPDATED, handleVersionUpdated);

    return () => {
      socket.off(SOCKET_EVENTS.GAME_VERSION_UPDATED, handleVersionUpdated);
      gameVersionService.stopPeriodicCheck();
    };
  }, []);

  return (
    <GameVersionContext.Provider value={{ isInitialized }}>
      {children}
    </GameVersionContext.Provider>
  );
}

export function useGameVersionContext() {
  const context = useContext(GameVersionContext);
  if (!context) {
    throw new Error('useGameVersionContext must be used within GameVersionProvider');
  }
  return context;
}
