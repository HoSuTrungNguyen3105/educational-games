import { useMemo, useState } from "react";
import {
  CircleHelp, Gamepad2, Heading1, Image as ImageIcon, LayoutList,
  PenLine, Plus, Search, StickyNote, Type,
} from "lucide-react";
import { uid } from "../../../services/api.js";
import { thumbnailForGame } from "../../../lib/gameThumbnail.js";
import { matchesQuery } from "../../../lib/searchText.js";
import { ImageLibraryGrid } from "./ImagePicker.jsx";

// EditorLibrary — thanh công cụ dọc + thư viện theo tab bên trái editor
// (§5.2/§5.3 đặc tả). CHỈ có các tab có chức năng thật: Trang, Nội dung,
// Câu hỏi (2 dạng có runtime chấm thật), Trò chơi (game online sẵn có),
// Thư viện ảnh (images API). Không có tab AI Copilot/hiệu ứng vì các
// tính năng đó thuộc đợt sau — không dựng tab trang trí.

const TABS = [
  { id: "pages", label: "Trang", icon: LayoutList },
  { id: "content", label: "Nội dung", icon: Type },
  { id: "question", label: "Câu hỏi", icon: CircleHelp },
  { id: "games", label: "Trò chơi", icon: Gamepad2 },
  { id: "images", label: "Ảnh", icon: ImageIcon },
];

function AddTile({ icon: Icon, title, desc, onClick }) {
  return (
    <button type="button" className="studio-add-tile" onClick={onClick}>
      <Icon />
      <span>{title}{desc && <small>{desc}</small>}</span>
    </button>
  );
}

export default function EditorLibrary({ ed, games, gamesLoading, gamesError, onAddImage, onPickImageUrl }) {
  const [tab, setTab] = useState("content");
  const [gameQuery, setGameQuery] = useState("");

  const filteredGames = useMemo(
    () => (games || []).filter((g) => matchesQuery(gameQuery, g.name, g.subject, g.description)),
    [games, gameQuery]
  );

  return (
    <div className="flex shrink-0 border-r border-[#E7D9BE] bg-[#FFFBF2] min-h-0">
      {/* Rail dọc (§5.2) */}
      <div className="w-[62px] shrink-0 flex flex-col items-stretch gap-1 p-1.5 border-r border-[#E7D9BE]/70">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.id} type="button" onClick={() => setTab(t.id)}
              className={`studio-rail-btn ${tab === t.id ? "is-active" : ""}`}>
              <Icon />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Panel theo tab (§5.3) */}
      <div className="w-[248px] shrink-0 overflow-y-auto p-3 min-h-0">
        {tab === "pages" && (
          <div>
            <button type="button" className="studio-add-tile" onClick={ed.addPage}>
              <Plus />
              <span>Thêm trang mới</span>
            </button>
            <div className="mt-3 space-y-1.5">
              {ed.pages.map((p, i) => (
                <button key={p.id} type="button" onClick={() => ed.selectPage(p.id)}
                  className="w-full text-left px-3 py-2.5 rounded-[10px] border transition"
                  style={{
                    borderColor: ed.currentPage?.id === p.id ? "#2F6FED" : "#E7D9BE",
                    background: ed.currentPage?.id === p.id ? "#F4F8FF" : "#fff",
                  }}>
                  <span className="block text-[13.5px] font-semibold text-ink truncate">
                    {i + 1}. {p.title || `Trang ${i + 1}`}
                  </span>
                  <span className="block text-[12px] text-[#8A7C63]">{p.elements.length} phần tử</span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-[#8A7C63]">
              Thêm/nhân bản/xoá/đổi tên/sắp xếp trang ở dải trang phía dưới editor.
            </p>
          </div>
        )}

        {tab === "content" && (
          <div className="space-y-2">
            <AddTile icon={Heading1} title="Tiêu đề" desc="Chữ lớn đầu trang" onClick={() => ed.addElement("title")} />
            <AddTile icon={Type} title="Đoạn văn" desc="Nội dung kiến thức" onClick={() => ed.addElement("text")} />
            <AddTile icon={StickyNote} title="Ghi chú" desc="Khung ghi chú nổi bật" onClick={() => ed.addElement("note")} />
            <AddTile icon={ImageIcon} title="Hình ảnh" desc="Chọn từ thư viện ảnh" onClick={onAddImage} />
          </div>
        )}

        {tab === "question" && (
          <div className="space-y-2">
            <AddTile icon={CircleHelp} title="Trắc nghiệm 1 đáp án" desc="Chọn 1 phương án đúng — chấm tự động"
              onClick={() => ed.addElement("question", {
                qtype: "single",
                options: [{ id: uid("opt"), content: "" }, { id: uid("opt"), content: "" }],
                correctAnswer: "",
              })} />
            <AddTile icon={PenLine} title="Điền từ" desc="Học sinh gõ đáp án — chấm theo chuỗi, không phân biệt hoa thường"
              onClick={() => ed.addElement("question", { qtype: "fill", options: [], correctAnswer: "" })} />
            <p className="text-[12px] leading-relaxed text-[#8A7C63] pt-1">
              Chỉ gồm 2 dạng câu hỏi hệ thống chấm được thật. Các dạng khác (nhiều đáp án, nối cặp, kéo thả…) sẽ bổ sung khi có runtime chấm.
            </p>
          </div>
        )}

        {tab === "games" && (
          <div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8A7C63]" />
              <input value={gameQuery} onChange={(e) => setGameQuery(e.target.value)}
                placeholder="Tìm game…" className="studio-field" style={{ paddingLeft: 32 }} />
            </div>
            <div className="mt-2.5 space-y-1.5">
              {gamesLoading && <p className="text-[13px] text-[#8A7C63] py-4 text-center">Đang tải danh sách game…</p>}
              {gamesError && <p className="text-[13px] text-[#D64545] py-2">{gamesError}</p>}
              {!gamesLoading && filteredGames.length === 0 && (
                <p className="text-[13px] text-[#8A7C63] py-4 text-center">Không có game nào khớp.</p>
              )}
              {filteredGames.map((g) => {
                const thumb = thumbnailForGame({ id: g._id, name: g.name, thumbnail: g.thumbnail });
                return (
                  <div key={g._id} className="flex items-center gap-2.5 p-2 rounded-[10px] border border-[#E7D9BE] bg-white">
                    <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 grid place-items-center" style={{ background: "#EFE6D2" }}>
                      {thumb
                        ? <img src={thumb} alt="" className="w-full h-full object-cover" />
                        : <Gamepad2 className="w-5 h-5 text-[#8A7C63]" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-ink truncate">{g.name}</p>
                      <p className="text-[11.5px] text-[#8A7C63] truncate">{g.subject || "—"}</p>
                    </div>
                    <button type="button" onClick={() => ed.addElement("game", { gameId: g._id })}
                      className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[12px] font-semibold text-white"
                      style={{ background: "#1B998B" }}>
                      <Plus className="w-3.5 h-3.5" /> Thêm
                    </button>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-[#8A7C63]">
              Game được gắn bằng tham chiếu — học sinh bấm vào phần tử game để mở game ở trang chơi riêng.
            </p>
          </div>
        )}

        {tab === "images" && (
          <ImageLibraryGrid onPick={onPickImageUrl} />
        )}
      </div>
    </div>
  );
}
