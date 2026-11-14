import { useMemo, useState } from "react";
import {
  CircleHelp, Gamepad2, Heading1, Image as ImageIcon, LayoutList,
  PaintBucket, PenLine, Plus, Scale, Search, Sparkles, Sticker, StickyNote, Type,
} from "lucide-react";
import { uid } from "../../../services/api.js";
import { thumbnailForGame } from "../../../lib/gameThumbnail.js";
import { matchesQuery } from "../../../lib/searchText.js";
import { ImageLibraryGrid } from "./ImagePicker.jsx";
import StudioAiPanel from "./StudioAiPanel.jsx";
import { PAGE_BACKGROUNDS } from "../../../components/studio/pageBackgrounds.jsx";
import { DECOR_EMOJIS, PAGE_TEMPLATES } from "./pageTemplates.js";

// EditorLibrary — thanh công cụ dọc + thư viện theo tab bên trái editor
// (§5.2/§5.3 đặc tả). CHỈ có các tab có chức năng thật: Trang, Nội dung,
// Câu hỏi (các dạng có runtime chấm thật), Trò chơi (game online sẵn
// có), Thư viện ảnh (images API), và AI (đợt nâng cấp: sinh câu hỏi qua
// endpoint AI thật — khi AI chưa sẵn sàng phía server, panel hiện đúng
// trạng thái "đang được cấu hình" chứ không sinh dữ liệu giả).

const TABS = [
  { id: "pages", label: "Trang", icon: LayoutList },
  { id: "background", label: "Nền", icon: PaintBucket },
  { id: "decor", label: "Trang trí", icon: Sticker },
  { id: "content", label: "Nội dung", icon: Type },
  { id: "question", label: "Câu hỏi", icon: CircleHelp },
  { id: "games", label: "Trò chơi", icon: Gamepad2 },
  { id: "images", label: "Ảnh", icon: ImageIcon },
  { id: "ai", label: "AI", icon: Sparkles },
];

function AddTile({ icon: Icon, title, desc, onClick }) {
  return (
    <button type="button" className="studio-add-tile" onClick={onClick}>
      <Icon />
      <span>{title}{desc && <small>{desc}</small>}</span>
    </button>
  );
}

// Màu nền mẫu cho trang bài học (màu dịu, chữ đậm vẫn đọc rõ).
const PAGE_BG_PRESETS = ["#FFFFFF", "#FFF7E0", "#FDECEC", "#E8F5E9", "#E3F2FD", "#F3E8FF", "#FFF3E0", "#E0F2F1"];

export default function EditorLibrary({ ed, games, gamesLoading, gamesError, onAddImage, onPickImageUrl, onPickBackground, showToast }) {
  const [tab, setTab] = useState("content");
  const [gameQuery, setGameQuery] = useState("");

  const filteredGames = useMemo(
    () => (games || []).filter((g) => matchesQuery(gameQuery, g.name, g.subject, g.description)),
    [games, gameQuery]
  );

  const currentBg = ed.currentPage?.background || "white";

  const applyTemplate = (tpl) => {
    const hasContent = (ed.currentPage?.elements || []).length > 0;
    if (hasContent && !window.confirm(
      `Áp mẫu "${tpl.name}" sẽ thay toàn bộ nội dung trang hiện tại. Tiếp tục?`
    )) return;
    ed.applyPageTemplate(tpl.build());
    showToast?.(`Đã áp mẫu "${tpl.name}" — bấm Lưu để giữ lại`, "success");
  };

  return (
    <div className="studio-library flex shrink-0 border-r border-[#E7D9BE] bg-[#FFFBF2] min-h-0">
      {/* Rail dọc (§5.2) */}
      <div className="studio-library-rail w-[62px] shrink-0 flex flex-col items-stretch gap-1 p-1.5 border-r border-[#E7D9BE]/70 overflow-y-auto">
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
      <div className="studio-library-panel w-[248px] shrink-0 overflow-y-auto p-3 min-h-0">
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

            {/* Nền của TRANG đang chọn — trang mới thêm ra sẽ kế thừa nền này. */}
            {ed.currentPage && (
              <div className="mt-4 border-t border-[#E7D9BE]/80 pt-3">
                <span className="studio-field-label">Nền trang đang chọn</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {PAGE_BG_PRESETS.map((c) => (
                    <button key={c} type="button" title={`Nền ${c}`}
                      onClick={() => ed.setPageBackground(ed.currentPage.id, { type: "color", value: c })}
                      className="w-7 h-7 rounded-lg border transition"
                      style={{
                        background: c,
                        borderColor: ed.currentPage.background?.type === "color" && ed.currentPage.background?.value === c ? "#2F6FED" : "#E7D9BE",
                        boxShadow: ed.currentPage.background?.type === "color" && ed.currentPage.background?.value === c ? "0 0 0 2px #Bcd2fb" : undefined,
                      }} />
                  ))}
                  <input type="color" title="Màu tuỳ chọn"
                    value={ed.currentPage.background?.type === "color" ? ed.currentPage.background.value : "#FFFFFF"}
                    onChange={(e) => ed.setPageBackground(ed.currentPage.id, { type: "color", value: e.target.value })}
                    className="w-9 h-9 shrink-0 rounded-lg border border-[#E7D9BE] cursor-pointer bg-white" />
                </div>
                {onPickBackground && (
                  <button type="button" onClick={onPickBackground}
                    className="mt-2 w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-[10px] border border-[#E7D9BE] bg-white text-[12.5px] font-semibold text-ink hover:bg-[#F4F8FF]">
                    <ImageIcon className="w-4 h-4" /> Chọn ảnh làm nền
                  </button>
                )}
                {ed.currentPage.background?.type === "image" && ed.currentPage.background?.value && (
                  <img src={ed.currentPage.background.value} alt="" className="mt-2 w-full h-16 object-cover rounded-[10px] border border-[#E7D9BE]" />
                )}
                {ed.currentPage.background ? (
                  <button type="button"
                    onClick={() => ed.setPageBackground(ed.currentPage.id, null)}
                    className="mt-2 text-[12.5px] font-semibold text-[#D64545]">
                    Xoá nền (về trắng mặc định)
                  </button>
                ) : null}
                <p className="mt-2 text-[12px] leading-relaxed text-[#8A7C63]">
                  Nền áp cho trang đang chọn. Bấm “Thêm trang”, trang mới sẽ dùng ngay nền này.
                </p>
              </div>
            )}
          </div>
        )}

        {tab === "background" && (
          <div>
            <span className="studio-field-label">Nền của trang đang chọn</span>
            <div className="grid grid-cols-2 gap-2">
              {PAGE_BACKGROUNDS.map((b) => {
                const active = currentBg === b.id;
                return (
                  <button key={b.id} type="button" onClick={() => ed.patchPage({ background: b.id })}
                    className="text-left rounded-[10px] border p-1.5 transition"
                    style={{
                      borderColor: active ? "#2F6FED" : "#E7D9BE",
                      background: active ? "#F4F8FF" : "#fff",
                      boxShadow: active ? "0 0 0 2px rgba(47,111,237,0.15)" : "none",
                    }}>
                    <span className="block h-12 rounded-md border border-black/10"
                      style={b.preview} />
                    <span className="mt-1 block text-[12px] font-semibold text-ink">{b.label}</span>
                    <span className="block text-[10.5px] text-[#8A7C63] leading-tight">{b.hint}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-[11.5px] leading-relaxed text-[#8A7C63]">
              Nền áp riêng cho trang đang chọn. Nền được lưu cùng bài học nên học sinh
              mở bài sẽ thấy đúng như bản soạn.
            </p>

            <span className="studio-field-label" style={{ marginTop: 12 }}>Mẫu trang dựng sẵn</span>
            <div className="space-y-1.5">
              {PAGE_TEMPLATES.map((tpl) => (
                <button key={tpl.id} type="button" onClick={() => applyTemplate(tpl)}
                  className="w-full flex items-center gap-2.5 p-2 rounded-[10px] border border-[#E7D9BE] bg-white text-left hover:bg-[#FFF6E7] transition">
                  <span className="w-11 h-11 shrink-0 rounded-lg border border-black/10"
                    style={PAGE_BACKGROUNDS.find((b) => b.id === tpl.background)?.preview} />
                  <span className="min-w-0">
                    <span className="block text-[12.5px] font-semibold text-ink truncate">{tpl.name}</span>
                    <span className="block text-[11px] text-[#8A7C63] truncate">{tpl.desc}</span>
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11.5px] leading-relaxed text-[#8A7C63]">
              Mẫu thay nội dung trang hiện tại bằng bố cục dựng sẵn — vẫn sửa/kéo từng
              phần tử được, và hoàn tác bằng nút Undo.
            </p>
          </div>
        )}

        {tab === "decor" && (
          <div>
            <span className="studio-field-label">Bấm để thêm hình trang trí</span>
            <div className="grid grid-cols-4 gap-1.5">
              {DECOR_EMOJIS.map((d) => (
                <button key={d.emoji} type="button" title={d.label}
                  onClick={() => ed.addElement("decor", { emoji: d.emoji })}
                  className="aspect-square grid place-items-center rounded-[10px] border border-[#E7D9BE] bg-white text-[24px] hover:bg-[#FFF6E7] hover:border-[#D9C79E] transition">
                  {d.emoji}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11.5px] leading-relaxed text-[#8A7C63]">
              Hình trang trí đứng riêng trên trang: kéo để đổi chỗ, kéo góc để phóng to.
              Đổi emoji khác ở panel thuộc tính bên phải.
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
            <AddTile icon={Scale} title="Đúng / Sai" desc="Câu khẳng định — chọn Đúng hoặc Sai (preset của trắc nghiệm 1 đáp án)"
              onClick={() => {
                const optTrue = { id: uid("opt"), content: "Đúng" };
                const optFalse = { id: uid("opt"), content: "Sai" };
                ed.addElement("question", {
                  qtype: "single",
                  options: [optTrue, optFalse],
                  correctAnswer: optTrue.id,
                });
              }} />
            <p className="text-[12px] leading-relaxed text-[#8A7C63] pt-1">
              Chỉ gồm các dạng câu hỏi hệ thống chấm được thật. Các dạng khác (nhiều đáp án, nối cặp, kéo thả…) sẽ bổ sung khi có runtime chấm.
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

        {tab === "ai" && (
          <StudioAiPanel ed={ed} showToast={showToast} />
        )}
      </div>
    </div>
  );
}
