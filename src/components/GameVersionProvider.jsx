/**
 * GameVersionProvider.jsx - Provider để quản lý kiểm tra phiên bản game tự động
 *
 * Chức năng:
 * - Kiểm tra phiên bản game định kỳ
 * - Lắng nghe WebSocket events
 * - Cung cấp context cho các component con
 */

import { createContext, useContext, useEffect, useState } from 'react';
import { gameVersionService } from '../services/gameVersionService.js';

const GameVersionContext = createContext(null);

export function GameVersionProvider({ children }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Khởi tạo gameVersionService
    gameVersionService.startPeriodicCheck();
    setIsInitialized(true);

    // Xử lý WebSocket events (nếu có socket integration)
    const handleWebSocketMessage = (event) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        gameVersionService.handleWebSocketEvent(data);
      } catch (error) {
        // Bỏ qua nếu không phải JSON hoặc không đúng format
      }
    };

    // Nếu có WebSocket, lắng nghe events
    // Cần tích hợp với socket.js hiện tại của project
    if (window.socket) {
      window.socket.on('game.version.updated', (data) => {
        gameVersionService.handleWebSocketEvent({
          event: 'game.version.updated',
          ...data,
        });
      });
    }

    return () => {
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
