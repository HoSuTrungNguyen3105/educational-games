import { useState } from "react";
import { ChevronLeft, ChevronRight, Copy, Plus, Trash2 } from "lucide-react";
import LessonCanvas from "../../../components/studio/LessonCanvas.jsx";

// PageStrip — dải trang phía dưới editor (§5.6 đặc tả): thumbnail render
// bằng CHÍNH LessonCanvas ở chế độ tĩnh nên hình thu nhỏ không bao giờ
// lệch với trang thật. Thao tác: chọn, thêm, nhân bản, xoá, đổi tên
// (gõ vào ô tên, chốt khi Enter/blur), sắp xếp bằng nút trái/phải.

function PageTitleInput({ value, onCommit }) {
  const [text, setText] = useState(value || "");
  const [focused, setFocused] = useState(false);
  const [prevValue, setPrevValue] = useState(value);
  if (prevValue !== value) {
    setPrevValue(value);
    if (!focused) setText(value || "");
  }
  const commit = () => {
    setFocused(false);
    if (text.trim() !== (value || "").trim()) onCommit(text);
  };
  return (
    <input
      value={text}
      onFocus={() => setFocused(true)}
      onChange={(e) => setText(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
      onClick={(e) => e.stopPropagation()}
      className="min-w-0 flex-1 bg-transparent text-[12px] font-semibold text-ink outline-none border-b border-transparent focus:border-[#2F6FED] px-0.5 py-0.5"
      title="Tên trang — Enter để lưu"
    />
  );
}

function MiniBtn({ title, onClick, disabled, danger, children }) {
  return (
    <button type="button" title={title} disabled={disabled}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="w-6 h-6 shrink-0 grid place-items-center rounded-md border border-[#E7D9BE] bg-white disabled:opacity-35 hover:bg-[#F4F8FF]"
      style={{ color: danger ? "#D64545" : "#1D2E4A" }}>
      {children}
    </button>
  );
}

export default function PageStrip({ ed, gameById }) {
  return (
    <div className="studio-pagestrip shrink-0 border-t border-[#E7D9BE] bg-[#FFFBF2]">
      <div className="studio-strip">
        {ed.pages.map((p, i) => (
          <div key={p.id} className="w-[168px] flex-none">
            <div
              className={`studio-strip-thumb ${ed.currentPage?.id === p.id ? "is-active" : ""}`}
              onClick={() => ed.selectPage(p.id)}
              title={p.title || `Trang ${i + 1}`}
            >
              <LessonCanvas page={p} gameById={gameById} mode="static" />
            </div>
            <div className="mt-1 flex items-center gap-1">
              <span className="text-[11px] font-bold text-[#8A7C63]">{i + 1}</span>
              <PageTitleInput value={p.title} onCommit={(t) => ed.renamePage(p.id, t)} />
            </div>
            <div className="mt-0.5 flex items-center gap-1">
              <MiniBtn title="Chuyển sang trái" disabled={i === 0} onClick={() => ed.movePage(p.id, -1)}>
                <ChevronLeft className="w-3.5 h-3.5" />
              </MiniBtn>
              <MiniBtn title="Chuyển sang phải" disabled={i === ed.pages.length - 1} onClick={() => ed.movePage(p.id, 1)}>
                <ChevronRight className="w-3.5 h-3.5" />
              </MiniBtn>
              <MiniBtn title="Nhân bản trang" onClick={() => ed.duplicatePage(p.id)}>
                <Copy className="w-3.5 h-3.5" />
              </MiniBtn>
              <MiniBtn title="Xoá trang" danger disabled={ed.pages.length <= 1} onClick={() => ed.removePage(p.id)}>
                <Trash2 className="w-3.5 h-3.5" />
              </MiniBtn>
            </div>
          </div>
        ))}
        <button type="button" onClick={ed.addPage}
          className="flex-none w-[104px] rounded-[10px] border-2 border-dashed border-[#C9BBA0] text-[#8A7C63] hover:border-[#2F6FED] hover:text-[#2F6FED] transition flex flex-col items-center justify-center gap-1 self-start"
          style={{ height: 94 }}>
          <Plus className="w-6 h-6" />
          <span className="text-[12px] font-semibold">Thêm trang</span>
        </button>
      </div>
    </div>
  );
}
