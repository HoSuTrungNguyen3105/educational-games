import { useEffect, useState } from 'react'
import { navigate } from '../../lib/router.js'
import { templateService } from '../../services/api.js'
import { injectApiBridge, detectApiMarkers } from '../../lib/apiBridge.js'
import { processGameHtml } from '../../game-html/injectTaskBridge.js'
import { PrimaryButton, GhostButton, Field } from '../../components/ui.jsx'

const CATEGORY_OPTIONS = [
  { value: "quiz", label: "Trắc nghiệm" }, { value: "reflex", label: "Phản xạ" },
  { value: "science", label: "Khoa học" }, { value: "language", label: "Ngôn ngữ" },
  { value: "math", label: "Toán học" }, { value: "geography", label: "Địa lý" },
  { value: "history", label: "Lịch sử" }, { value: "puzzle", label: "Puzzle" },
  { value: "strategy", label: "Chiến thuật" }, { value: "arcade", label: "Arcade" },
  { value: "group", label: "Theo nhóm" }, { value: "seasonal", label: "Lễ hội" },
  { value: "memory", label: "Trí nhớ" }, { value: "logic", label: "Tư duy" },
  { value: "adventure", label: "Phiêu lưu" },
];

const EMPTY = { name: "", description: "", type: "play-to-learn", category: "quiz", icon: "🎲", ring: "#1D2E4A", htmlTemplate: "", thumbnail: "", status: "draft", playMode: "solo" };

export default function TemplateFormPage({ showToast, route }) {
  const templateId = route?.params?.templateId;
  const isEdit = !!templateId;

  const [form, setForm] = useState({ ...EMPTY });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("html");

  useEffect(() => {
    if (!isEdit) return;
    templateService.list().then(list => {
      const t = list.find(x => x._id === templateId);
      if (t) {
        setForm({ name: t.name || "", description: t.description || "", type: t.type || "play-to-learn", category: t.category || "quiz", icon: t.icon || "🎲", ring: t.ring || "#1D2E4A", htmlTemplate: t.htmlTemplate || "", thumbnail: t.thumbnail || "", status: t.status || "draft", playMode: t.playMode || "solo" });
      } else {
        setError("Không tìm thấy template");
      }
    }).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, [templateId, isEdit]);

  const onChange = (name, val) => { setForm(f => ({ ...f, [name]: val })); setError(null); };

  const submit = async () => {
    if (!form.name.trim()) { setError("Tên template không được để trống"); return; }
    setSaving(true); setError(null);
    try {
      const markers = detectApiMarkers(form.htmlTemplate);
      const payload = { ...form, htmlTemplate: processGameHtml(injectApiBridge(form.htmlTemplate)) };
      if (isEdit) {
        await templateService.update(templateId, payload);
        showToast(markers.length > 0 ? `Đã cập nhật (auto-inject: ${markers.join(", ")})` : "Đã cập nhật template");
      } else {
        await templateService.create(payload);
        showToast(markers.length > 0 ? `Đã tạo mới (auto-inject: ${markers.join(", ")})` : "Đã tạo template mới");
      }
      navigate("/admin/templates");
    } catch (err) {
      setError(err.message || "Không thể lưu template");
    } finally {
      setSaving(false);
    }
  };

  const processedHtml = form.htmlTemplate ? processGameHtml(injectApiBridge(form.htmlTemplate)) : "";

  const TABS = [
    { key: "info", label: "Thông tin" },
    { key: "html", label: "HTML" },
    { key: "preview", label: "Preview" },
  ];

  if (loading) return <div className="p-8 text-center text-ink/40">Đang tải...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-display text-xl text-ink">{isEdit ? "✏️ Sửa Template" : "➕ Thêm Template"}</h1>
        <GhostButton onClick={() => navigate("/admin/templates")}>← Quay lại</GhostButton>
      </div>

      <div className="flex gap-1 border-b border-ink/10 mb-4">
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-body transition-colors border-b-2 -mb-px ${activeTab === tab.key ? "border-ticket text-ticket font-semibold" : "border-transparent text-ink/50 hover:text-ink"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "info" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
          <Field label="Tên template">
            <input value={form.name} onChange={e => onChange("name", e.target.value)}
              className="w-full note-card px-3 py-1.5 mt-0.5 border-ink/10 focus:border-ticket text-sm" autoComplete="off" />
          </Field>
          <Field label="Loại">
            <select value={form.type} onChange={e => onChange("type", e.target.value)}
              className="w-full note-card px-3 py-1.5 mt-0.5 border-ink/10 focus:border-ticket bg-paper2 text-sm">
              <option value="play-to-learn">Play-to-Learn</option>
              <option value="play-to-win">Play-to-Win</option>
            </select>
          </Field>
          <Field label="Thể loại">
            <select value={form.category} onChange={e => onChange("category", e.target.value)}
              className="w-full note-card px-3 py-1.5 mt-0.5 border-ink/10 focus:border-ticket bg-paper2 text-sm">
              {CATEGORY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </Field>
          <Field label="Trạng thái">
            <select value={form.status} onChange={e => onChange("status", e.target.value)}
              className="w-full note-card px-3 py-1.5 mt-0.5 border-ink/10 focus:border-ticket bg-paper2 text-sm">
              <option value="draft">Bản nháp</option>
              <option value="published">Xuất bản</option>
              <option value="inactive">Vô hiệu</option>
            </select>
          </Field>
          <Field label="Chế độ chơi">
            <select value={form.playMode} onChange={e => onChange("playMode", e.target.value)}
              className="w-full note-card px-3 py-1.5 mt-0.5 border-ink/10 focus:border-ticket bg-paper2 text-sm">
              <option value="solo">Cá nhân (học sinh tự chơi)</option>
              <option value="classroom">Lớp học (giáo viên điều khiển)</option>
            </select>
          </Field>
          <Field label="Icon">
            <input value={form.icon} onChange={e => onChange("icon", e.target.value)}
              className="w-full note-card px-3 py-1.5 mt-0.5 border-ink/10 focus:border-ticket text-sm" autoComplete="off" />
          </Field>
          <Field label="Màu viền">
            <div className="flex items-center gap-1.5 mt-0.5">
              <input type="color" value={form.ring} onChange={e => onChange("ring", e.target.value)} className="w-7 h-7 rounded border border-ink/10 cursor-pointer flex-shrink-0" />
              <input value={form.ring} onChange={e => onChange("ring", e.target.value)} className="w-full note-card px-2.5 py-1.5 border-ink/10 focus:border-ticket text-sm" autoComplete="off" />
            </div>
          </Field>
          <Field label="Mô tả" className="sm:col-span-2 lg:col-span-3">
            <textarea value={form.description} onChange={e => onChange("description", e.target.value)}
              className="w-full note-card px-3 py-1.5 mt-0.5 border-ink/10 focus:border-ticket min-h-[80px] text-sm" />
          </Field>
          <Field label="Ảnh thumbnail" className="sm:col-span-2 lg:col-span-3">
            <input value={form.thumbnail} onChange={e => onChange("thumbnail", e.target.value)} placeholder="/uploads/templates/example.png"
              className="w-full note-card px-3 py-1.5 mt-0.5 border-ink/10 focus:border-ticket text-sm" autoComplete="off" />
          </Field>
        </div>
      )}

      {activeTab === "html" && (
        <div className="flex flex-col h-[calc(100vh-220px)]">
          <textarea value={form.htmlTemplate} onChange={e => onChange("htmlTemplate", e.target.value)}
            placeholder="Dán HTML template vào đây..."
            className="flex-1 w-full note-card px-4 py-3 text-xs font-mono resize-none placeholder:text-ink/30 border-ink/10 focus:border-ticket" />
          <p className="text-xs text-ink/40 mt-1">Sử dụng markers: <code>GAME_API_INJECT</code>, <code>GAME_PROGRESS_INJECT</code>, <code>GAME_TASK_INJECT</code> để tự inject bridge.</p>
        </div>
      )}

      {activeTab === "preview" && (
        <div className="border border-ink/10 rounded-lg overflow-hidden h-[calc(100vh-220px)]">
          {processedHtml ? (
            <iframe srcDoc={processedHtml} className="w-full h-full border-0" title="Preview" sandbox="allow-scripts allow-same-origin" />
          ) : (
            <div className="flex items-center justify-center h-full text-ink/30 text-sm">Chưa có HTML để preview</div>
          )}
        </div>
      )}

      {error && <p className="text-ticket text-sm mt-3">{error}</p>}

      <div className="mt-4 flex items-center gap-2 justify-end border-t border-ink/10 pt-3">
        <GhostButton onClick={() => navigate("/admin/templates")}>Hủy</GhostButton>
        <PrimaryButton onClick={submit} disabled={saving}>{saving ? "Đang lưu..." : isEdit ? "Cập nhật" : "Thêm mới"}</PrimaryButton>
      </div>
    </div>
  );
}
