import { useState, useEffect, useRef, useCallback } from "react";
import { userService } from "../services/api.js";
import { socket } from "../socket/socket.js";
import { SOCKET_EVENTS } from "../socket/socket.events.js";

function generateGameCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export default function CoopInvitePanel({
  gameId,
  gameName,
  gameCode: initialGameCode,
  visible,
  mode,
  onModeSelected,
  onInviteAccepted,
  onGameJoined,
  onClose,
}) {
  const [screen, setScreen] = useState("mode");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [inviteStatus, setInviteStatus] = useState(null);
  const [invitedUser, setInvitedUser] = useState(null);
  const [gameCode, setGameCode] = useState(initialGameCode || "");
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [opponentInfo, setOpponentInfo] = useState(null);
  const searchTimeout = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (visible && screen === "mode") {
      setTimeout(() => {}, 100);
    }
  }, [visible, screen]);

  useEffect(() => {
    if (visible && screen === "search") {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [visible, screen]);

  useEffect(() => {
    if (!visible) {
      setScreen("mode");
      setSearchQuery("");
      setSearchResults([]);
      setInviteStatus(null);
      setInvitedUser(null);
      setJoinError("");
      setOpponentInfo(null);
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return;

    const onInviteAccepted = (data) => {
      setOpponentInfo(data);
      setInviteStatus("accepted");
      onInviteAccepted?.(data);
    };

    const onGameJoined = (data) => {
      if (data.ok) {
        setOpponentInfo({ acceptedByName: data.hostUserId, gameId: data.gameId });
        onGameJoined?.(data);
      } else {
        setJoinError(data.error || "Mã phòng không hợp lệ");
      }
    };

    socket.on(SOCKET_EVENTS.GAME_INVITE_ACCEPTED, onInviteAccepted);
    socket.on(SOCKET_EVENTS.GAME_JOINED, onGameJoined);

    return () => {
      socket.off(SOCKET_EVENTS.GAME_INVITE_ACCEPTED, onInviteAccepted);
      socket.off(SOCKET_EVENTS.GAME_JOINED, onGameJoined);
    };
  }, [visible, onInviteAccepted, onGameJoined]);

  const handleSearch = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const results = await userService.search(query);
      setSearchResults(results || []);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleSearchInput = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    clearTimeout(searchTimeout.current);
    if (val.length < 2) {
      setSearchResults([]);
      return;
    }
    searchTimeout.current = setTimeout(() => handleSearch(val), 300);
  };

  const handleInvite = (user) => {
    const code = gameCode || generateGameCode();
    if (!gameCode) setGameCode(code);

    setInvitedUser(user);
    setInviteStatus("waiting");

    socket.emit(SOCKET_EVENTS.GAME_INVITE_SEND, {
      toUserId: user.id,
      gameId,
      gameName,
      gameCode: code,
    });
  };

  const handleJoinByCode = () => {
    const code = joinCode.trim().toUpperCase();
    if (!code || code.length < 4) {
      setJoinError("Vui lòng nhập mã phòng hợp lệ");
      return;
    }
    setJoinError("");
    socket.emit(SOCKET_EVENTS.GAME_JOIN_BY_CODE, { code });
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center font-[Segoe_UI,sans-serif] text-white animate-[fadeIn_0.3s_ease]">
      <div className="bg-[#1e2a4a] rounded-[20px] p-8 max-w-[420px] w-[90%] text-center shadow-[0_20px_60px_rgba(0,0,0,0.5)] animate-[slideUp_0.3s_ease]">
        {screen === "mode" && (
          <>
            <h2 className="text-[1.5rem] font-bold mb-2">🎮 Chọn chế độ chơi</h2>
            <p className="text-[0.9rem] opacity-70 mb-5">{gameName}</p>
            <div className="flex gap-3 mb-5">
              <button
                onClick={() => { onModeSelected?.("solo"); }}
                className="flex-1 py-3.5 px-3 rounded-[14px] border-2 border-white/15 bg-white/5 text-white cursor-pointer transition-all hover:border-[#4ecdc4] hover:bg-[#4ecdc4]/10 hover:-translate-y-0.5"
              >
                <span className="text-2xl block mb-1.5">🤖</span>
                Chơi với máy
              </button>
              <button
                onClick={() => setScreen("search")}
                className="flex-1 py-3.5 px-3 rounded-[14px] border-2 border-white/15 bg-white/5 text-white cursor-pointer transition-all hover:border-[#4ecdc4] hover:bg-[#4ecdc4]/10 hover:-translate-y-0.5"
              >
                <span className="text-2xl block mb-1.5">👥</span>
                Chơi với người
              </button>
            </div>
            <button
              onClick={() => setScreen("join-code")}
              className="w-full py-2.5 rounded-[10px] border border-white/20 bg-transparent text-white/70 cursor-pointer text-[0.85rem] hover:text-white hover:border-white/40 transition"
            >
              🔑 Nhập mã phòng
            </button>
          </>
        )}

        {screen === "search" && (
          <>
            <h2 className="text-[1.5rem] font-bold mb-2">👥 Tìm người chơi</h2>
            <p className="text-[0.9rem] opacity-70 mb-4">Nhập tên để tìm và mời bạn cùng chơi</p>
            <input
              ref={inputRef}
              type="text"
              placeholder="Tìm kiếm người chơi..."
              value={searchQuery}
              onChange={handleSearchInput}
              className="w-full py-2.5 px-3.5 rounded-[10px] border border-white/20 bg-white/8 text-white text-[0.9rem] outline-none box-border focus:border-[#4ecdc4] mb-3"
            />
            <div className="max-h-[200px] overflow-y-auto text-left mb-3">
              {searching && (
                <div className="text-center py-3 opacity-50">
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-[#4ecdc4] rounded-full animate-spin mr-1.5" />
                  Đang tìm...
                </div>
              )}
              {!searching && searchResults.length === 0 && searchQuery.length >= 2 && (
                <div className="text-center py-3 opacity-50 text-[0.85rem]">Không tìm thấy</div>
              )}
              {searchResults.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center gap-2.5 py-2.5 px-3 rounded-[10px] cursor-pointer transition hover:bg-white/8 mb-1"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ff6b6b] to-[#4ecdc4] flex items-center justify-center font-bold text-[0.85rem] shrink-0">
                    {(u.name || u.username || "?")[0].toUpperCase()}
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="text-[0.9rem] font-semibold truncate">{u.name || u.username}</div>
                    <div className="text-[0.75rem] opacity-50">@{u.username || ""}</div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleInvite(u); }}
                    className="py-1.5 px-3.5 rounded-lg border-none bg-[#4ecdc4] text-[#1a1a2e] font-bold text-[0.8rem] cursor-pointer shrink-0 hover:brightness-110"
                  >
                    Mời chơi
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => { setScreen("mode"); setSearchQuery(""); setSearchResults([]); }}
              className="py-2 px-4 rounded-lg border border-white/20 bg-transparent text-white/70 cursor-pointer text-[0.85rem] hover:text-white hover:border-white/40 transition"
            >
              ← Quay lại
            </button>
          </>
        )}

        {screen === "join-code" && (
          <>
            <h2 className="text-[1.5rem] font-bold mb-2">🔑 Nhập mã phòng</h2>
            <p className="text-[0.9rem] opacity-70 mb-4">Nhập mã 6 ký tự từ bạn bè để vào phòng</p>
            <input
              type="text"
              maxLength={6}
              placeholder="MÃ PHÒNG"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleJoinByCode()}
              className="w-full py-3.5 rounded-[10px] border-2 border-white/15 font-mono text-[1.5rem] font-bold text-center tracking-[8px] uppercase bg-white/5 text-white outline-none box-border focus:border-[#4ecdc4]"
            />
            {joinError && <div className="text-[#e94560] text-[0.85rem] mt-2 min-h-[1.2em]">{joinError}</div>}
            <button
              onClick={handleJoinByCode}
              className="w-full mt-4 py-3 rounded-[10px] font-bold text-[0.95rem] border-2 border-[#f4b942] bg-[#f4b942] text-white cursor-pointer transition hover:brightness-110 active:scale-95"
            >
              Vào phòng
            </button>
            <button
              onClick={() => { setScreen("mode"); setJoinCode(""); setJoinError(""); }}
              className="w-full mt-2 py-2 rounded-[10px] font-semibold text-[0.85rem] bg-transparent text-white/60 border-2 border-white/15 cursor-pointer transition hover:text-white hover:border-white/30"
            >
              ← Quay lại
            </button>
          </>
        )}

        {inviteStatus === "waiting" && (
          <div className="mt-4 p-3 rounded-[10px] bg-white/5 border-l-[3px] border-[#f4b942] text-[0.85rem]">
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-[#4ecdc4] rounded-full animate-spin mr-1.5" />
            Đang chờ {invitedUser?.name || invitedUser?.username} chấp nhận...
            {gameCode && (
              <div className="mt-2">
                Mã phòng: <span className="font-mono font-bold tracking-wider">{gameCode}</span>
              </div>
            )}
            <button
              onClick={() => { setInviteStatus(null); setInvitedUser(null); setScreen("search"); }}
              className="mt-3 py-2 px-4 rounded-lg border border-white/20 bg-transparent text-white/70 cursor-pointer text-[0.85rem] hover:text-white hover:border-white/40 transition"
            >
              ← Hủy và tìm người khác
            </button>
          </div>
        )}

        {inviteStatus === "accepted" && (
          <div className="mt-4 p-3 rounded-[10px] bg-white/5 border-l-[3px] border-[#4ecdc4] text-[0.85rem]">
            🎮 {opponentInfo?.acceptedByName || "Bạn"} đã tham gia!
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 py-2 px-4 rounded-lg border border-white/20 bg-transparent text-white/50 cursor-pointer text-[0.85rem] hover:text-white hover:border-white/40 transition"
        >
          ✕ Đóng
        </button>
      </div>
    </div>
  );
}
