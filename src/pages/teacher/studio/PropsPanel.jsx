import { useState } from "react";
import {
  AlignCenter, AlignLeft, AlignRight, ArrowDown, ArrowUp, Copy, ImagePlus, Plus, Trash2,
} from "lucide-react";
import { uid } from "../../../services/api.js";
import { clampGeo } from "../../../hooks/useLessonEditor.js";
import { thumbnailForGame } from "../../../lib/gameThumbnail.js";

// PropsPanel — panel thuộc tính bên phải (§5.5 đặc tả).
//   • Chưa chọn phần tử → thông tin bài học (tiêu đề/môn/lớp/mô tả/mục tiêu).
//   • Đã chọn → thuộc tính theo loại phần tử + khối hình học dùng chung.
// Gõ chữ dùng cơ chế transient của useLessonEditor (sửa liên tục, chốt
// một mốc history khi rời ô nhập) để undo không bị spam từng ký tự.

const TYPE_LABELS = {
  title: "Tiêu đề", text: "Đoạn văn", note: "Ghi chú",
  image: "Hình ảnh", question: "Câu hỏi", game: "Trò chơi",
};

/** Ô nhập số: hiện text cục bộ, sửa transient, chốt khi blur/Enter.
 *  Đồng bộ giá trị ngoài vào ô bằng pattern chỉnh-state-trong-render
 *  (giống usePagedList), chỉ khi ô không có focus. */
function NumField({ label, value, onValue }) {
  const [text, setText] = useState(() => String(value ?? ""));
  const [focused, setFocused] = useState(false);
  const [prevValue, setPrevValue] = useState(value);
  if (prevValue !== value) {
    setPrevValue(value);
    if (!focused) setText(String(value ?? ""));
  }
  return (
    <label className="block min-w-0">
      <span className="studio-field-label" style={{ margin: "0 0 3px" }}>{label}</span>
      <input type="number" className="studio-field" value={text}
        onFocus={() => setFocused(true)}
        onBlur={() => { setFocused(false); onValue(text === "" ? null : Number(text), true); }}
        onChange={(e) => {
          setText(e.target.value);
          const n = Number(e.target.value);
          if (e.target.value !== "" && Number.isFinite(n)) onValue(n, false);
        }}
        onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }} />
    </label>
  );
}

function GeometryFields({ ed, el }) {
  const setGeo = (key) => (v, commit) => {
    if (v !== null && Number.isFinite(v)) {
      if (key === "z") ed.patchElement(el.id, { z: Math.max(0, Math.round(v)) }, true);
      else ed.patchElement(el.id, clampGeo({ x: el.x, y: el.y, w: el.w, h: el.h, [key]: v }, el), true);
    }
    if (commit) ed.endTransient();
  };
  return (
    <div>
      <span className="studio-field-label">Vị trí & kích thước (canvas 1280×720)</span>
      <div className="grid grid-cols-2 gap-2">
        <NumField label="X" value={el.x} onValue={setGeo("x")} />
        <NumField label="Y" value={el.y} onValue={setGeo("y")} />
        <NumField label="Rộng" value={el.w} onValue={setGeo("w")} />
        <NumField label="Cao" value={el.h} onValue={setGeo("h")} />
        <NumField label="Lớp (z)" value={el.z ?? 0} onValue={setGeo("z")} />
      </div>
    </div>
  );
}

function TextFields({ ed, el, rows = 4 }) {
  const p = el.props;
  const setProps = (patch, transient = false) => ed.patchElementProps(el.id, patch, transient);
  return (
    <div>
      <span className="studio-field-label">Nội dung</span>
      <textarea className="studio-field" rows={rows} value={p.text || ""}
        onChange={(e) => setProps({ text: e.target.value }, true)}
        onBlur={() => ed.endTransient()} />
      <div className="grid grid-cols-2 gap-2">
        <NumField label="Cỡ chữ (8–120)" value={p.fontSize ?? ""}
          onValue={(v, commit) => {
            if (v !== null && Number.isFinite(v)) setProps({ fontSize: Math.min(120, Math.max(8, Math.round(v))) }, true);
            if (commit) ed.endTransient();
          }} />
        <label className="block min-w-0">
          <span className="studio-field-label" style={{ margin: "0 0 3px" }}>Màu chữ</span>
          <span className="flex items-center gap-1.5">
            <input type="color" value={p.color || "#1D2E4A"} className="w-9 h-9 shrink-0 rounded-lg border border-[#E7D9BE] cursor-pointer bg-white"
              onChange={(e) => setProps({ color: e.target.value }, true)}
              onBlur={() => ed.endTransient()} />
            <input className="studio-field" value={p.color || ""} placeholder="#1D2E4A"
              onChange={(e) => setProps({ color: e.target.value }, true)}
              onBlur={() => ed.endTransient()} />
          </span>
        </label>
      </div>
      <span className="studio-field-label">Căn lề</span>
      <div className="flex gap-1.5">
        {[{ v: "left", Icon: AlignLeft }, { v: "center", Icon: AlignCenter }, { v: "right", Icon: AlignRight }].map(({ v, Icon }) => (
          <button key={v} type="button" onClick={() => setProps({ align: v })}
            className="flex-1 py-2 rounded-[10px] border grid place-items-center transition"
            style={{
              borderColor: (p.align || "left") === v ? "#2F6FED" : "#E7D9BE",
              background: (p.align || "left") === v ? "#F4F8FF" : "#fff",
              color: "#1D2E4A",
            }}>
            <Icon className="w-4 h-4" />
          </button>
        ))}
      </div>
    </div>
  );
}

function ImageFields({ ed, el, onPickImage }) {
  const p = el.props;
  const setProps = (patch, transient = false) => ed.patchElementProps(el.id, patch, transient);
  return (
    <div>
      {p.imageUrl && (
        <img src={p.imageUrl} alt={p.alt || ""} className="w-full h-32 object-cover rounded-[10px] border border-[#E7D9BE]" />
      )}
      <button type="button" onClick={() => onPickImage(el.id)}
        className="mt-2 w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-[10px] font-semibold text-[13.5px] text-white"
        style={{ background: "#1B998B" }}>
        <ImagePlus className="w-4 h-4" /> Chọn ảnh từ thư viện
      </button>
      <span className="studio-field-label">URL ảnh</span>
      <input className="studio-field" value={p.imageUrl || ""} placeholder="https://…"
        onChange={(e) => setProps({ imageUrl: e.target.value }, true)}
        onBlur={() => ed.endTransient()} />
      <span className="studio-field-label">Chú thích ảnh (alt)</span>
      <input className="studio-field" value={p.alt || ""}
        onChange={(e) => setProps({ alt: e.target.value }, true)}
        onBlur={() => ed.endTransient()} />
    </div>
  );
}

function QuestionFields({ ed, el }) {
  const p = el.props;
  const setProps = (patch, transient = false) => ed.patchElementProps(el.id, patch, transient);
  const options = Array.isArray(p.options) ? p.options : [];

  const switchType = (qtype) => {
    if (qtype === p.qtype) return;
    if (qtype === "fill") setProps({ qtype, options: [], correctAnswer: "" });
    else setProps({
      qtype,
      options: options.length ? options : [{ id: uid("opt"), content: "" }, { id: uid("opt"), content: "" }],
      correctAnswer: "",
    });
  };

  const patchOption = (optId, content) =>
    setProps({ options: options.map((o) => (o.id === optId ? { ...o, content } : o)) }, true);
  const removeOption = (optId) =>
    setProps({
      options: options.filter((o) => o.id !== optId),
      ...(p.correctAnswer === optId ? { correctAnswer: "" } : {}),
    });

  return (
    <div>
      <span className="studio-field-label">Loại câu hỏi</span>
      <div className="flex gap-1.5">
        {[{ v: "single", label: "Trắc nghiệm 1 đáp án" }, { v: "fill", label: "Điền từ" }].map(({ v, label }) => (
          <button key={v} type="button" onClick={() => switchType(v)}
            className="flex-1 px-2 py-2 rounded-[10px] border text-[12.5px] font-semibold transition"
            style={{
              borderColor: p.qtype === v ? "#2F6FED" : "#E7D9BE",
              background: p.qtype === v ? "#F4F8FF" : "#fff",
              color: "#1D2E4A",
            }}>
            {label}
          </button>
        ))}
      </div>

      <span className="studio-field-label">Nội dung câu hỏi</span>
      <textarea className="studio-field" rows={3} value={p.prompt || ""} placeholder="VD: 3 × 4 = ?"
        onChange={(e) => setProps({ prompt: e.target.value }, true)}
        onBlur={() => ed.endTransient()} />

      {p.qtype === "single" ? (
        <div>
          <span className="studio-field-label">Đáp án — chọn nút tròn ở đáp án đúng</span>
          <div className="space-y-1.5">
            {options.map((opt, i) => (
              <div key={opt.id} className="flex items-center gap-1.5">
                <input type="radio" name={`correct-${el.id}`} className="w-4 h-4 shrink-0 accent-[#1B998B]"
                  checked={p.correctAnswer === opt.id && !!p.correctAnswer}
                  onChange={() => setProps({ correctAnswer: opt.id })} />
                <input className="studio-field" value={opt.content} placeholder={`Đáp án ${i + 1}`}
                  onChange={(e) => patchOption(opt.id, e.target.value)}
                  onBlur={() => ed.endTransient()} />
                <button type="button" title="Xoá đáp án" onClick={() => removeOption(opt.id)}
                  className="shrink-0 w-8 h-8 grid place-items-center rounded-lg text-[#D64545] hover:bg-[#FDECEC]">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button type="button" disabled={options.length >= 10}
            onClick={() => setProps({ options: [...options, { id: uid("opt"), content: "" }] })}
            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E7D9BE] bg-white text-[12.5px] font-semibold text-ink disabled:opacity-40">
            <Plus className="w-3.5 h-3.5" /> Thêm đáp án
          </button>
          {!p.correctAnswer && <p className="mt-2 text-[12px] text-[#B45309]">Chưa chọn đáp án đúng — sẽ không xuất bản được.</p>}
        </div>
      ) : (
        <div>
          <span className="studio-field-label">Đáp án đúng (chuỗi)</span>
          <input className="studio-field" value={p.correctAnswer || ""} placeholder="VD: 12"
            onChange={(e) => setProps({ correctAnswer: e.target.value }, true)}
            onBlur={() => ed.endTransient()} />
          <p className="mt-1.5 text-[12px] text-[#8A7C63]">Chấm không phân biệt hoa thường, tự cắt khoảng trắng thừa.</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <NumField label="Điểm" value={p.points ?? ""}
          onValue={(v, commit) => {
            if (v !== null && Number.isFinite(v)) setProps({ points: Math.max(0, Math.round(v)) }, true);
            if (commit) ed.endTransient();
          }} />
      </div>
      <span className="studio-field-label">Giải thích đáp án (hiện sau khi trả lời)</span>
      <textarea className="studio-field" rows={2} value={p.explanation || ""}
        onChange={(e) => setProps({ explanation: e.target.value }, true)}
        onBlur={() => ed.endTransient()} />
      <span className="studio-field-label">Phản hồi khi đúng / khi sai</span>
      <input className="studio-field" value={p.feedbackCorrect || ""} placeholder="Khi đúng — VD: Giỏi lắm!"
        onChange={(e) => setProps({ feedbackCorrect: e.target.value }, true)}
        onBlur={() => ed.endTransient()} />
      <input className="studio-field mt-1.5" value={p.feedbackWrong || ""} placeholder="Khi sai — VD: Gần đúng rồi, thử lại nhé"
        onChange={(e) => setProps({ feedbackWrong: e.target.value }, true)}
        onBlur={() => ed.endTransient()} />
    </div>
  );
}

function GameFields({ ed, el, games, gameById }) {
  const p = el.props;
  const game = p.gameId ? gameById[p.gameId] : null;
  const thumb = game ? thumbnailForGame({ id: game._id, name: game.name, thumbnail: game.thumbnail }) : null;
  return (
    <div>
      {game ? (
        <div className="flex items-center gap-2.5 p-2 rounded-[10px] border border-[#E7D9BE] bg-white">
          <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0" style={{ background: "#EFE6D2" }}>
            {thumb && <img src={thumb} alt="" className="w-full h-full object-cover" />}
          </div>
          <div className="min-w-0">
            <p className="text-[13.5px] font-semibold text-ink truncate">{game.name}</p>
            <p className="text-[12px] text-[#8A7C63] truncate">{game.subject || "—"}</p>
          </div>
        </div>
      ) : (
        <p className="text-[13px] text-[#B45309]">
          {p.gameId
            ? "Game đã chọn không còn tồn tại — chọn game khác, nếu không sẽ không xuất bản được."
            : "Chưa chọn game."}
        </p>
      )}
      <span className="studio-field-label">Đổi game</span>
      <select className="studio-field" value={p.gameId || ""}
        onChange={(e) => ed.patchElementProps(el.id, { gameId: e.target.value })}>
        <option value="">— Chọn game —</option>
        {(games || []).map((g) => (
          <option key={g._id} value={g._id}>{g.name}{g.subject ? ` (${g.subject})` : ""}</option>
        ))}
      </select>
      <p className="mt-2 text-[12px] leading-relaxed text-[#8A7C63]">
        Phần tử chỉ giữ tham chiếu tới game trong thư viện. Khi học sinh bấm vào, game mở ở trang chơi riêng — điểm game chưa cộng vào bài học (sẽ làm ở đợt tích hợp runtime).
      </p>
    </div>
  );
}

function LessonMetaFields({ ed, subjects }) {
  const doc = ed.doc;
  const totalElements = ed.pages.reduce((n, p) => n + p.elements.length, 0);
  return (
    <div>
      <span className="studio-field-label">Tiêu đề bài học</span>
      <input className="studio-field" value={doc.title}
        onChange={(e) => ed.setMeta({ title: e.target.value }, true)}
        onBlur={() => ed.endTransient()} placeholder="VD: Bảng nhân 4 — Toán lớp 3" />
      <span className="studio-field-label">Môn học</span>
      <input className="studio-field" value={doc.subject} list="studio-subject-list"
        onChange={(e) => ed.setMeta({ subject: e.target.value }, true)}
        onBlur={() => ed.endTransient()} placeholder="VD: Toán" />
      <datalist id="studio-subject-list">
        {(subjects || []).map((s) => {
          const label = s.name || s.label || s.id;
          return label ? <option key={s.id || label} value={label} /> : null;
        })}
      </datalist>
      <span className="studio-field-label">Lớp</span>
      <select className="studio-field" value={doc.grade ?? ""}
        onChange={(e) => ed.setMeta({ grade: e.target.value === "" ? null : Number(e.target.value) })}>
        <option value="">Chưa phân lớp</option>
        {[1, 2, 3, 4, 5].map((g) => <option key={g} value={g}>Lớp {g}</option>)}
      </select>
      <span className="studio-field-label">Mô tả</span>
      <textarea className="studio-field" rows={3} value={doc.description}
        onChange={(e) => ed.setMeta({ description: e.target.value }, true)}
        onBlur={() => ed.endTransient()} />
      <span className="studio-field-label">Mục tiêu học tập</span>
      <textarea className="studio-field" rows={3} value={doc.objectives}
        onChange={(e) => ed.setMeta({ objectives: e.target.value }, true)}
        onBlur={() => ed.endTransient()} placeholder="Mỗi mục tiêu một dòng…" />
      <div className="mt-4 rounded-[10px] border border-[#E7D9BE] bg-white p-3 text-[12.5px] leading-relaxed text-[#5B4A12]">
        <p>Trạng thái: <b>{ed.status === "published" ? "Đã xuất bản" : "Bản nháp"}</b></p>
        <p>{ed.pages.length} trang · {totalElements} phần tử · Canvas 1280×720</p>
        {ed.status === "published" && (
          <p className="mt-1 text-[#B45309]">Bài đang xuất bản: nội dung lưu mới sẽ áp dụng ngay cho học sinh.</p>
        )}
      </div>
    </div>
  );
}

export default function PropsPanel({ ed, games, gameById, subjects, onPickImage }) {
  const el = ed.selectedElement;
  return (
    <aside className="w-[292px] shrink-0 border-l border-[#E7D9BE] bg-[#FFFBF2] overflow-y-auto min-h-0">
      <div className="p-3.5">
        {el ? (
          <>
            <div className="flex items-center gap-1.5">
              <h3 className="flex-1 font-display font-bold text-ink text-[15px]">{TYPE_LABELS[el.type] || el.type}</h3>
              <button type="button" title="Đưa xuống lớp dưới" onClick={() => ed.moveElementLayer(el.id, -1)}
                className="w-8 h-8 grid place-items-center rounded-lg border border-[#E7D9BE] bg-white text-ink hover:bg-[#F4F8FF]">
                <ArrowDown className="w-4 h-4" />
              </button>
              <button type="button" title="Đưa lên lớp trên" onClick={() => ed.moveElementLayer(el.id, 1)}
                className="w-8 h-8 grid place-items-center rounded-lg border border-[#E7D9BE] bg-white text-ink hover:bg-[#F4F8FF]">
                <ArrowUp className="w-4 h-4" />
              </button>
              <button type="button" title="Nhân bản phần tử" onClick={() => ed.duplicateElement(el.id)}
                className="w-8 h-8 grid place-items-center rounded-lg border border-[#E7D9BE] bg-white text-ink hover:bg-[#F4F8FF]">
                <Copy className="w-4 h-4" />
              </button>
              <button type="button" title="Xoá phần tử" onClick={() => ed.removeElement(el.id)}
                className="w-8 h-8 grid place-items-center rounded-lg border border-[#E7D9BE] bg-white text-[#D64545] hover:bg-[#FDECEC]">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-1">
              {(el.type === "title" || el.type === "text" || el.type === "note") && <TextFields ed={ed} el={el} rows={el.type === "title" ? 2 : 5} />}
              {el.type === "image" && <ImageFields ed={ed} el={el} onPickImage={onPickImage} />}
              {el.type === "question" && <QuestionFields ed={ed} el={el} />}
              {el.type === "game" && <GameFields ed={ed} el={el} games={games} gameById={gameById} />}
            </div>
            <div className="mt-2 border-t border-[#E7D9BE]/80 pt-1">
              <GeometryFields ed={ed} el={el} />
            </div>
          </>
        ) : (
          <>
            <h3 className="font-display font-bold text-ink text-[15px]">Thông tin bài học</h3>
            <p className="text-[12px] text-[#8A7C63] mt-0.5 mb-1">Chọn một phần tử trên canvas để sửa thuộc tính của nó.</p>
            <LessonMetaFields ed={ed} subjects={subjects} />
          </>
        )}
      </div>
    </aside>
  );
}
