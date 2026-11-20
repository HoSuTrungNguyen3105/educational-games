import { useState } from "react";
import { FONT_OPTIONS } from "../../../lib/documents/textFormat.js";
import {
  ADMIN_PAGE_PRESET, PAGE_SIZES, normalizePageConfig,
} from "../../../lib/documents/pageConfig.js";

// PageSettings — mục "Cấu hình trang" trong tab Cài đặt, CHỈ cho tài
// liệu Word (Giai đoạn 1 §1). Form giữ trạng thái nháp riêng; chỉ khi
// giáo viên bấm một nút hành động thì cấu hình mới được ghi vào tài
// liệu (qua onApply về DocumentStudioEditor — ghi vào JSON `page` ở
// Normal hoặc khối <style id="docstudio-page"> ở Beautiful, đi qua
// đúng pipeline áp dụng + autosave như mọi thay đổi khác).
//
// Cấu hình trang được LƯU THEO TÀI LIỆU. Ngoài ra giáo viên có thể lưu
// một bản làm mặc định cá nhân (localStorage) để áp nhanh cho tài liệu
// khác. Tài liệu có theme (mẫu thư viện): font/cỡ/căn/giãn dòng theo
// theme của mẫu — cấu hình này chỉ quyết định khổ giấy và lề.

const ALIGN_OPTIONS = [
  { value: "left", label: "Căn trái" },
  { value: "center", label: "Căn giữa" },
  { value: "right", label: "Căn phải" },
  { value: "justify", label: "Căn đều hai bên" },
];
const LINE_HEIGHT_CHOICES = [1, 1.15, 1.3, 1.5, 2];
const SIDES = [
  { key: "top", label: "Lề trên (cm)" },
  { key: "right", label: "Lề phải (cm)" },
  { key: "bottom", label: "Lề dưới (cm)" },
  { key: "left", label: "Lề trái (cm)" },
];

const numOrEmpty = (v) => (v === undefined || v === null || v === "" ? "" : v);

// Cha render kèm key = JSON của cấu hình trang đã áp dụng: khi cấu
// hình của TÀI LIỆU đổi từ bên ngoài (nạp tài liệu khác, áp dụng mẫu,
// hoàn tác…), component remount và form khởi tạo lại từ value mới —
// không cần effect đồng bộ state.
export default function PageSettings({ value, hasTheme, savedDefault, onApply, onSaveDefault, onClear }) {
  const [form, setForm] = useState(() => value || {});

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const setMargin = (side, raw) => setForm((f) => ({
    ...f,
    margins: { ...(f.margins || {}), [side]: raw === "" ? undefined : Number(raw) },
  }));
  const build = () => normalizePageConfig(form);

  return (
    <div className="border-t border-ink/10 pt-3 mt-3">
      <span className="docstudio-label">Cấu hình trang (Word)</span>
      <p className="docstudio-flyout-hint mb-2">
        Khổ giấy, lề và chữ mặc định được lưu theo tài liệu — áp cho bản xem trước và file DOCX xuất ra.
        {hasTheme && " Mẫu này có theme riêng: font, cỡ chữ, căn lề và giãn dòng theo mẫu; cấu hình trang chỉ quyết định khổ giấy và lề."}
      </p>

      <label className="docstudio-label" htmlFor="ds-page-size">Khổ giấy</label>
      <select id="ds-page-size" className="docstudio-select" value={form.size || ""}
        onChange={(e) => set({ size: e.target.value || undefined })}>
        <option value="">Mặc định (A4)</option>
        {Object.entries(PAGE_SIZES).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
      </select>

      <label className="docstudio-label" htmlFor="ds-page-orient">Hướng giấy</label>
      <select id="ds-page-orient" className="docstudio-select" value={form.orientation || ""}
        onChange={(e) => set({ orientation: e.target.value || undefined })}>
        <option value="">Mặc định (Dọc)</option>
        <option value="portrait">Dọc</option>
        <option value="landscape">Ngang</option>
      </select>

      <div className="grid grid-cols-2 gap-2">
        {SIDES.map(({ key, label }) => (
          <div key={key}>
            <label className="docstudio-label" htmlFor={`ds-margin-${key}`}>{label}</label>
            <input id={`ds-margin-${key}`} className="docstudio-input" type="number"
              min="0" max="10" step="0.1"
              value={numOrEmpty(form.margins?.[key])}
              onChange={(e) => setMargin(key, e.target.value)} placeholder="2,54" />
          </div>
        ))}
      </div>

      <label className="docstudio-label" htmlFor="ds-page-font">Phông chữ mặc định</label>
      <select id="ds-page-font" className="docstudio-select" value={form.font || ""}
        onChange={(e) => set({ font: e.target.value || undefined })}>
        <option value="">Mặc định (Arial)</option>
        {FONT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
      </select>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="docstudio-label" htmlFor="ds-page-fontsize">Cỡ chữ (pt)</label>
          <input id="ds-page-fontsize" className="docstudio-input" type="number" min="1" max="200" step="0.5"
            value={numOrEmpty(form.fontSize)}
            onChange={(e) => set({ fontSize: e.target.value === "" ? undefined : Number(e.target.value) })}
            placeholder="12" />
        </div>
        <div>
          <label className="docstudio-label" htmlFor="ds-page-color">Màu chữ</label>
          <input id="ds-page-color" className="docstudio-input" type="color"
            value={/^#[0-9a-f]{6}$/i.test(form.color || "") ? form.color : "#000000"}
            onChange={(e) => set({ color: e.target.value })} />
        </div>
      </div>

      <label className="docstudio-label" htmlFor="ds-page-align">Căn lề mặc định</label>
      <select id="ds-page-align" className="docstudio-select" value={form.align || ""}
        onChange={(e) => set({ align: e.target.value || undefined })}>
        <option value="">Mặc định (Căn trái)</option>
        {ALIGN_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="docstudio-label" htmlFor="ds-page-lineheight">Giãn dòng</label>
          <select id="ds-page-lineheight" className="docstudio-select"
            value={form.lineHeight ?? ""}
            onChange={(e) => set({ lineHeight: e.target.value === "" ? undefined : Number(e.target.value) })}>
            <option value="">Mặc định</option>
            {LINE_HEIGHT_CHOICES.map((v) => <option key={v} value={v}>{String(v).replace(".", ",")}</option>)}
          </select>
        </div>
        <div>
          <label className="docstudio-label" htmlFor="ds-page-spacing">Sau đoạn (pt)</label>
          <input id="ds-page-spacing" className="docstudio-input" type="number" min="0" max="200" step="1"
            value={numOrEmpty(form.spacingAfter)}
            onChange={(e) => set({ spacingAfter: e.target.value === "" ? undefined : Number(e.target.value) })}
            placeholder="6" />
        </div>
      </div>

      <label className="docstudio-check">
        <input type="checkbox" checked={Boolean(form.pageNumber)}
          onChange={(e) => set({ pageNumber: e.target.checked })} />
        Đánh số trang ở chân trang (file DOCX)
      </label>
      <p className="docstudio-flyout-hint">
        Số trang thật chỉ có trong file DOCX (Word tự đánh số từng trang). Bản xem trước là một tờ giấy
        dài chưa chia trang nên chỉ hiện dòng chân “Số trang”.
      </p>

      <button type="button" className="docstudio-btn-primary" onClick={() => onApply(build())}>
        Áp dụng cấu hình trang
      </button>
      <button type="button" className="docstudio-btn-ghost"
        onClick={() => { setForm(ADMIN_PAGE_PRESET); onApply(normalizePageConfig(ADMIN_PAGE_PRESET)); }}>
        Đặt theo chuẩn hành chính
      </button>
      <button type="button" className="docstudio-btn-ghost" onClick={() => onSaveDefault(build())}>
        Lưu làm mặc định của tôi
      </button>
      <button type="button" className="docstudio-btn-ghost" disabled={!savedDefault}
        title={savedDefault ? "Ghi cấu hình mặc định đã lưu vào tài liệu đang mở" : "Chưa có cấu hình mặc định nào được lưu"}
        onClick={() => { if (savedDefault) { setForm(savedDefault); onApply(savedDefault); } }}>
        Áp dụng mặc định của tôi
      </button>
      {value && (
        <button type="button" className="docstudio-btn-ghost" onClick={onClear}>
          Xoá cấu hình trang (về mặc định cũ)
        </button>
      )}
    </div>
  );
}
