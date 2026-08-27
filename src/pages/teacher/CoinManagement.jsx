import { useCallback, useEffect, useState } from 'react'
import { adminGameProgressService, userService } from '../../services/api.js'
import { getLevelProgress, getLevelTitle, getLevelEmoji } from '../../lib/utils.js'
import { getRoleLabel } from '../../config/roles.js'
import { ManagementHeader, ManagementTable, Modal, GhostButton, PrimaryButton } from '../../components/ui.jsx'

/* eslint-disable react-hooks/set-state-in-effect */

const GAME_NAMES = {
  "TOAN101": "Ôn tập Toán lớp 3",
  "VUTRU22": "Khám phá vũ trụ",
  "TONGHOP9": "Ôn tập kiến thức tổng hợp",
  "FAMILY07": "Từ vựng tiếng Anh: Gia đình",
  "TRUNGTHU5": "Trung Thu Vui Vẻ",
  "DIALY88": "Địa lý Việt Nam",
  "CHUCAI3": "Bảng chữ cái tiếng Việt",
  "QUAYSO4": "Vòng quay kiến thức lớp 4",
  "ATGT202": "Luật giao thông an toàn",
  "DONGVAT6": "Động vật hoang dã",
  "LICHSU19": "Đua thuyền: Lịch sử Việt Nam",
  "MOITRUONG4": "Phân loại rác thải",
  "PHIEUL9": "Đại Phiêu Lưu Toán Học",
  "HAMNGUC3": "Hầm Ngục Kiến Thức",
  "NINJA77": "Ninja Vượt Ải Từ Vựng",
};

function getGameName(gameId) { return GAME_NAMES[gameId] || gameId; }
function getGameIcon(gameId) {
  const icons = {
    "TOAN101": "\u{1F9EE}", "VUTRU22": "\u{1F30C}", "TONGHOP9": "\u{1F4DA}",
    "FAMILY07": "\u{1F468}\u{200D}\u{1F469}\u{200D}\u{1F467}\u{200D}\u{1F466}",
    "TRUNGTHU5": "\u{1F391}", "DIALY88": "\u{1F30D}", "CHUCAI3": "\u{1F4DD}",
    "QUAYSO4": "\u{1F3B0}", "ATGT202": "\u{1F6A6}", "DONGVAT6": "\u{1F43E}",
    "LICHSU19": "\u{1F6F6}", "MOITRUONG4": "\u{267B}\uFE0F", "PHIEUL9": "\u{1F9EE}",
    "HAMNGUC3": "\u{1F3F0}", "NINJA77": "\u{1F977}",
  };
  return icons[gameId] || "\u{1F3AE}";
}

export default function CoinManagement({ showToast }) {
  const [progress, setProgress] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [filterUser, setFilterUser] = useState("");
  const [filterGame, setFilterGame] = useState("");
  const [tab, setTab] = useState("users");

  const load = useCallback(() => {
    setProgress(null); setError(null);
    Promise.all([adminGameProgressService.listAll(), userService.list()])
      .then(([p, u]) => { setProgress(p); setUsers(u); })
      .catch(e => setError(e.message || "Lỗi tải dữ liệu"));
  }, []);
  useEffect(() => { load(); }, [load]);

  const userMap = {};
  users.forEach(u => { userMap[u.id] = u.name || u.username; });

  const filtered = (progress || []).filter(p => {
    if (filterUser && p.userId !== filterUser) return false;
    if (filterGame && p.gameId !== filterGame) return false;
    return true;
  });

  const allGameIds = [...new Set((progress || []).map(p => p.gameId))];
  const allUserIds = [...new Set((progress || []).map(p => p.userId))];
  const totalGlobalCoins = users.reduce((s, u) => s + (u.coins || 0), 0);
  const totalPlays = filtered.reduce((s, p) => s + (p.gamesPlayed || 0), 0);

  const openEdit = (item) => {
    setEditItem(item);
    setEditForm({
      level: item.level || 1,
      experience: item.experience || 0,
      progress: item.progress || 0,
      gamesPlayed: item.gamesPlayed || 0,
      questsCompleted: item.questsCompleted || 0,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminGameProgressService.updateProgress(editItem._id, editForm);
      showToast("Đã cập nhật tiến trình", "success");
      setEditItem(null);
      load();
    } catch (e) {
      showToast(e.message || "Lỗi cập nhật", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!confirm(`Xóa tiến trình của "${userMap[item.userId] || item.userId}" trong game "${getGameName(item.gameId)}"?`)) return;
    try {
      await adminGameProgressService.removeProgress(item._id);
      showToast("Đã xóa", "success");
      load();
    } catch (e) {
      showToast(e.message || "Lỗi xóa", "error");
    }
  };

  const userHeaders = ["Người dùng", "Vai trò", "💰 Coin", "Hạng"];
  const renderUserRow = (u) => {
    const lv = getLevelProgress(u.coins || 0);
    return (
      <tr key={u.id} className="border-t border-ink/5 hover:bg-ink/[0.02] transition">
        <td className="py-2.5 px-3 text-sm font-body text-ink">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-xs text-white font-bold shrink-0">
              {(u.name || "?").charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold truncate max-w-[180px]">{u.name || u.username}</p>
              <p className="text-[10px] text-[#8A7C63] font-mono truncate max-w-[180px]">@{u.username}</p>
            </div>
          </div>
        </td>
        <td className="py-2.5 px-3 text-sm font-mono text-ink">{getRoleLabel(u.role)}</td>
        <td className="py-2.5 px-3 text-sm font-mono font-bold text-gold">{(u.coins || 0).toLocaleString()}</td>
        <td className="py-2.5 px-3">
          <div className="flex items-center gap-1.5">
            <span>{getLevelEmoji(lv.level)}</span>
            <span className="text-sm font-semibold text-ink">Lv.{lv.level}</span>
            <span className="text-[10px] font-mono text-[#8A7C63]">{getLevelTitle(lv.level)}</span>
          </div>
        </td>
      </tr>
    );
  };

  const progressHeaders = ["Người dùng", "Game", "Level", "XP", "Lượt chơi", "Nhiệm vụ", "Thao tác"];
  const renderProgressRow = (item) => (
    <tr key={item._id} className="border-t border-ink/5 hover:bg-ink/[0.02] transition">
      <td className="py-2.5 px-3 text-sm font-body text-ink">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-xs text-white font-bold shrink-0">
            {(userMap[item.userId] || "?").charAt(0).toUpperCase()}
          </div>
          <p className="font-semibold truncate max-w-[140px]">{userMap[item.userId] || item.userId}</p>
        </div>
      </td>
      <td className="py-2.5 px-3 text-sm font-body text-ink">
        <span className="inline-flex items-center gap-1">
          <span>{getGameIcon(item.gameId)}</span>
          <span className="truncate max-w-[120px]">{getGameName(item.gameId)}</span>
        </span>
      </td>
      <td className="py-2.5 px-3 text-sm font-mono text-ink">{item.level || 1}</td>
      <td className="py-2.5 px-3 text-sm font-mono text-ink">{(item.experience || 0).toLocaleString()}</td>
      <td className="py-2.5 px-3 text-sm font-mono text-[#8A7C63]">{item.gamesPlayed || 0}</td>
      <td className="py-2.5 px-3 text-sm font-mono text-[#8A7C63]">{item.questsCompleted || 0}</td>
      <td className="py-2.5 px-3">
        <div className="flex items-center gap-1.5">
          <button onClick={() => openEdit(item)} className="text-xs font-semibold text-ticket hover:underline">Sửa</button>
          <button onClick={() => handleDelete(item)} className="text-xs font-semibold text-red-400 hover:underline">Xóa</button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-5">
      <ManagementHeader subtitle="Quản trị" title="💰 Coin & Tiến trình người chơi" />

      <div className="flex gap-2">
        <button onClick={() => setTab("users")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${tab === "users" ? "bg-gold/20 text-gold" : "text-[#8A7C63] hover:bg-ink/5"}`}>
          {"\u{1F465}"} Coin & Hạng
        </button>
        <button onClick={() => setTab("progress")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${tab === "progress" ? "bg-gold/20 text-gold" : "text-[#8A7C63] hover:bg-ink/5"}`}>
          {"\u{1F4CA}"} Tiến trình game
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Người dùng", value: users.length, icon: "\u{1F465}" },
          { label: "Tổng Coin", value: totalGlobalCoins.toLocaleString(), icon: "\u{1F4B0}" },
          { label: "Bản ghi tiến trình", value: filtered.length, icon: "\u{1F4CB}" },
          { label: "Tổng lượt chơi", value: totalPlays.toLocaleString(), icon: "\u{1F3AE}" },
        ].map(s => (
          <div key={s.label} className="note-card p-4">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="font-display text-xl text-ink">{s.value}</div>
            <div className="text-[10px] text-[#8A7C63] font-mono uppercase">{s.label}</div>
          </div>
        ))}
      </div>

      {tab === "users" && (
        <ManagementTable
          title="Coin & Hạng theo người dùng"
          count={users.length}
          data={users}
          error={error}
          onRetry={load}
          emptyLabel="Chưa có người dùng nào"
          headers={userHeaders}
          renderRow={renderUserRow}
        />
      )}

      {tab === "progress" && (
        <>
          <div className="flex flex-wrap gap-3">
            <select value={filterUser} onChange={e => setFilterUser(e.target.value)}
              className="note-card px-3 py-2 text-sm font-body text-ink border-ink/10 focus:border-ticket">
              <option value="">Tất cả người dùng</option>
              {allUserIds.map(uid => (
                <option key={uid} value={uid}>{userMap[uid] || uid}</option>
              ))}
            </select>
            <select value={filterGame} onChange={e => setFilterGame(e.target.value)}
              className="note-card px-3 py-2 text-sm font-body text-ink border-ink/10 focus:border-ticket">
              <option value="">Tất cả game</option>
              {allGameIds.map(gid => (
                <option key={gid} value={gid}>{getGameIcon(gid)} {getGameName(gid)}</option>
              ))}
            </select>
            {(filterUser || filterGame) && (
              <button onClick={() => { setFilterUser(""); setFilterGame(""); }}
                className="text-xs text-ticket font-semibold hover:underline self-center">Xóa bộ lọc</button>
            )}
          </div>
          <ManagementTable
            title="Tiến trình theo game"
            count={filtered.length}
            data={filtered}
            error={error}
            onRetry={load}
            emptyLabel="Chưa có dữ liệu tiến trình nào"
            headers={progressHeaders}
            renderRow={renderProgressRow}
          />
        </>
      )}

      {editItem && (
        <Modal onClose={() => !saving && setEditItem(null)}>
          <div className="space-y-4">
            <h3 className="font-display text-xl text-ink">Sửa tiến trình</h3>
            <p className="text-sm text-[#8A7C63]">
              {userMap[editItem.userId] || editItem.userId} — {getGameIcon(editItem.gameId)} {getGameName(editItem.gameId)}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: "level", label: "Level" },
                { key: "experience", label: "Experience" },
                { key: "progress", label: "Progress %" },
                { key: "gamesPlayed", label: "Lượt chơi" },
                { key: "questsCompleted", label: "Nhiệm vụ" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-mono text-[#8A7C63] uppercase block mb-1">{f.label}</label>
                  <input type="number" value={editForm[f.key] ?? 0}
                    onChange={e => setEditForm(prev => ({ ...prev, [f.key]: Number(e.target.value) }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-ink/15 bg-paper text-ink text-sm font-body focus:outline-none focus:border-ticket" />
                </div>
              ))}
            </div>
            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <GhostButton onClick={() => setEditItem(null)} disabled={saving}>Hủy</GhostButton>
              <PrimaryButton onClick={handleSave} disabled={saving}>
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </PrimaryButton>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
