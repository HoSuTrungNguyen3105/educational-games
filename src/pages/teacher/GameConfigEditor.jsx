import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Copy, Download, Eye, EyeOff, Play, RefreshCw, RotateCcw, Save, Upload } from "lucide-react";
import { API_BASE, gameService, templateService } from "../../services/api.js";
import { ManagementHeader, Loader, EmptyState } from "../../components/ui.jsx";
import {
  SCHEMA_VERSION,
  buildConfigPayload,
  defaultValuesFor,
  getGameDef,
  listGameDefs,
  normalizeValues,
  readGameConfig,
  resolveGameKey,
  validateValues,
} from "../../games/gameConfigSchema.js";
import { injectGameConfig } from "../../games/injectGameConfig.js";

const EMPTY_EDITOR = { gameId: null, key: null, values: {}, dirty: false };

const draftKey = (id) => `eg_draft_cfg_${id}`;

function readDraft(id) {
  try {
    const raw = localStorage.getItem(draftKey(id));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeDraft(id, data) {
  try { localStorage.setItem(draftKey(id), JSON.stringify(data)); } catch { /* ignore */ }
}

function clearDraft(id) {
  try { localStorage.removeItem(draftKey(id)); } catch { /* ignore */ }
}

function editorForGame(game) {
  if (!game) return EMPTY_EDITOR;
  const saved = readGameConfig(game.config);
  const draft = readDraft(game._id);
  const fromDraft = draft && getGameDef(draft.key) && draft.values ? draft : null;
  const key = fromDraft ? draft.key : (resolveGameKey({ game }) || saved.key || null);
  return {
    gameId: game._id,
    key,
    values: key ? normalizeValues(key, fromDraft ? fromDraft.values : saved.values) : {},
    dirty: !!fromDraft,
  };
}

const clone = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));

function formatSetting(def, value) {
  if (typeof value === "number") {
    if (def.format === "multiply") return `×${value.toFixed(1)}`;
    if (def.format === "seconds") return `${value}s`;
  }
  return String(value ?? "");
}

const inputCls = "w-full note-card px-2.5 py-1.5 text-sm border-ink/10 focus:border-ticket outline-none";

function SettingRow({ def, value, onChange }) {
  const num = typeof value === "number" ? value : def.default;
  return (
    <div className="py-2.5 border-t border-ink/10 first:border-t-0">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-display text-sm text-ink">{def.label}</span>
        <span className="font-mono text-sm font-bold text-ticket">{formatSetting(def, num)}</span>
      </div>
      {def.help && <p className="text-[11px] text-[#8A7C63] mb-1">{def.help}</p>}
      <input
        type="range"
        className="w-full accent-[#E4572E]"
        min={def.min}
        max={def.max}
        step={def.step || 1}
        value={num}
        aria-label={def.label}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
}

function RowsBlock({ list, rows, defaults, min, onChange }) {
  const arr = Array.isArray(rows) ? rows : [];
  const short = typeof min === "number" && arr.length < min;

  return (
    <div>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h4 className="font-display text-sm text-ink">{list.title}</h4>
          {list.help && <p className="text-[11px] text-[#8A7C63]">{list.help}</p>}
        </div>
        <span className={`shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full ${short ? "bg-ticket/15 text-ticket" : "bg-teal/15 text-teal"}`}>
          {arr.length} mục{short ? ` · cần ≥ ${min}` : ""}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        {arr.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            {(list.fields || [{ key: null }]).map((f, fi) => {
              const value = list.itemType === "string" ? item : item?.[f.key];
              const cls = f.type === "color"
                ? "w-11 h-9 p-0.5 rounded-lg border border-ink/15 bg-white cursor-pointer shrink-0"
                : `${inputCls} ${f.cls === "em" ? "w-14 text-center text-lg shrink-0" : ""} ${f.cls === "ltr" ? "w-14 text-center font-bold uppercase shrink-0" : ""}`;
              return (
                <input
                  key={f.key || fi}
                  className={cls}
                  type={f.type || "text"}
                  value={value ?? ""}
                  placeholder={f.placeholder || ""}
                  aria-label={f.placeholder || f.key || "giá trị"}
                  onChange={(e) => {
                    const next = arr.slice();
                    if (list.itemType === "string") next[i] = e.target.value;
                    else next[i] = { ...next[i], [f.key]: e.target.value };
                    onChange(next);
                  }}
                />
              );
            })}
            <button
              type="button"
              className="w-8 h-8 shrink-0 rounded-lg bg-paper text-ink/50 hover:text-ticket"
              title="Nhân bản dòng này"
              onClick={() => onChange([...arr.slice(0, i + 1), clone(item), ...arr.slice(i + 1)])}
            >
              ⧉
            </button>
            <button
              type="button"
              className="w-8 h-8 shrink-0 rounded-lg bg-ticket/10 text-ticket font-bold"
              title="Xoá dòng này"
              onClick={() => onChange(arr.filter((_, idx) => idx !== i))}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mt-2.5">
        <button
          type="button"
          className="text-xs font-bold px-3 py-1.5 rounded-lg bg-ink text-paper hover:bg-ink2"
          onClick={() => onChange([...arr, list.itemType === "string" ? (list.newItem ?? "") : clone(list.newItem || {})])}
        >
          ＋ Thêm
        </button>
        <button
          type="button"
          className="text-xs font-bold px-3 py-1.5 rounded-lg bg-paper text-ink/70 hover:text-ticket"
          onClick={() => onChange(clone(Array.isArray(defaults) ? defaults : []))}
        >
          ↺ Về mẫu
        </button>
      </div>
    </div>
  );
}

function ListEditor({ list, value, onChange }) {
  if (list.kind === "grouped") {
    const grouped = value && typeof value === "object" && !Array.isArray(value) ? value : {};
    return (
      <div className="note-card p-3.5">
        <div className="mb-3">
          <h4 className="font-display text-sm text-ink">{list.title}</h4>
          {list.help && <p className="text-[11px] text-[#8A7C63]">{list.help}</p>}
        </div>
        <div className="flex flex-col gap-3">
          {(list.groups || []).map((g) => (
            <details key={g.key} className="note-card p-3" open={!!g.open}>
              <summary className="cursor-pointer font-display text-sm text-ink">{g.title}</summary>
              <div className="mt-2.5">
                <RowsBlock
                  list={list}
                  rows={grouped[g.key]}
                  defaults={list.rows?.[g.key] || []}
                  min={g.min ?? list.min}
                  onChange={(rows) => onChange({ ...grouped, [g.key]: rows })}
                />
              </div>
            </details>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="note-card p-3.5">
      <RowsBlock
        list={list}
        rows={value}
        defaults={list.rows || []}
        min={list.min}
        onChange={onChange}
      />
    </div>
  );
}

export default function GameConfigEditor({ showToast }) {
  const [games, setGames] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: null });
  const [editor, setEditor] = useState(EMPTY_EDITOR);
  const [saving, setSaving] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const [previewHtml, setPreviewHtml] = useState(null);
  const [previewBusy, setPreviewBusy] = useState(false);
  const previewRef = useRef(null);
  const fileRef = useRef(null);

  const defs = useMemo(() => listGameDefs(), []);
  const def = getGameDef(editor.key);
  const { gameId: editorGameId, key: editorKey, values: editorValues } = editor;
  const game = useMemo(() => games.find((g) => g._id === editor.gameId) || null, [games, editor.gameId]);
  const issues = useMemo(() => (editor.key ? validateValues(editor.key, editor.values) : []), [editor.key, editor.values]);
  const errorCount = issues.filter((i) => i.level === "error").length;
  const payload = useMemo(() => (editor.key ? buildConfigPayload(editor.key, editor.values) : null), [editor.key, editor.values]);

  const loadGames = useCallback(async () => {
    try {
      const list = await gameService.list({});
      const items = Array.isArray(list) ? list : [];
      setGames(items);
      setEditor((prev) => {
        const stillThere = prev.gameId && items.some((g) => g._id === prev.gameId);
        if (stillThere) return prev;
        return items[0] ? editorForGame(items[0]) : EMPTY_EDITOR;
      });
      setStatus((prev) => ({ ...prev, error: null }));
    } catch (e) {
      setStatus((prev) => ({ ...prev, error: e.message || "Không tải được danh sách trò chơi" }));
    } finally {
      setStatus((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => { loadGames(); }, [loadGames]);

  useEffect(() => {
    if (!editorGameId || !editorKey) return;
    const t = setTimeout(() => writeDraft(editorGameId, { key: editorKey, values: editorValues, at: Date.now() }), 400);
    return () => clearTimeout(t);
  }, [editorGameId, editorKey, editorValues]);

  const changeValue = useCallback((fieldKey, v) => {
    setEditor((prev) => ({ ...prev, values: { ...prev.values, [fieldKey]: v }, dirty: true }));
  }, []);

  const assignKey = useCallback((nextKey) => {
    setEditor((prev) => (
      nextKey
        ? { ...prev, key: nextKey, values: defaultValuesFor(nextKey), dirty: true }
        : { ...prev, key: null, values: {}, dirty: false }
    ));
  }, []);

  const resetValues = useCallback(() => {
    if (!editor.key) return;
    if (!window.confirm(`Đặt toàn bộ cấu hình “${def?.name || editor.key}” về mặc định?`)) return;
    setEditor((prev) => ({ ...prev, values: defaultValuesFor(prev.key), dirty: true }));
  }, [editor.key, def]);

  const save = useCallback(async () => {
    if (!game || !editor.key) return;
    if (errorCount) {
      showToast(`Còn ${errorCount} mục chưa hợp lệ — xem mục “Kiểm tra dữ liệu”`, "error");
      return;
    }
    setSaving(true);
    try {
      await gameService.setConfig(game._id, buildConfigPayload(editor.key, editor.values));
      clearDraft(game._id);
      setEditor((prev) => ({ ...prev, dirty: false }));
      showToast("Đã lưu cấu hình lên máy chủ", "success");
      loadGames();
    } catch (e) {
      showToast(e.message || "Lỗi lưu cấu hình", "error");
    } finally {
      setSaving(false);
    }
  }, [game, editor.key, editor.values, errorCount, showToast, loadGames]);

  const copyJson = useCallback(async () => {
    if (!payload) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      showToast("Đã sao chép JSON cấu hình", "success");
    } catch {
      showToast("Không sao chép được — hãy xem và tải file JSON", "error");
    }
  }, [payload, showToast]);

  const downloadJson = useCallback(() => {
    if (!payload || !game) return;
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `config-${editor.key}-${game.code || game._id}.json`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 500);
  }, [payload, game, editor.key]);

  const importJson = useCallback((text) => {
    try {
      const saved = readGameConfig(JSON.parse(text));
      const nextKey = saved.key || editor.key;
      if (!nextKey || !getGameDef(nextKey)) {
        showToast("File chưa có khoá game hợp lệ", "error");
        return;
      }
      setEditor((prev) => ({ ...prev, key: nextKey, values: normalizeValues(nextKey, saved.values), dirty: true }));
      showToast("Đã nhập cấu hình — nhớ bấm Lưu", "success");
    } catch {
      showToast("File JSON không hợp lệ", "error");
    }
  }, [editor.key, showToast]);

  const openPreview = useCallback(async () => {
    if (!editor.key) return;
    setPreviewBusy(true);
    try {
      let html = "";
      if (game?.templateId) {
        try {
          const tpl = await templateService.get(game.templateId);
          html = tpl?.htmlTemplate || "";
        } catch { /* ignore */ }
      }
      if (!html && def?.file) {
        try {
          const res = await fetch(`${import.meta.env.BASE_URL}${def.file}`);
          if (res.ok) html = await res.text();
        } catch { /* ignore */ }
      }
      if (!html) {
        showToast("Không tìm thấy mã nguồn game để xem thử", "error");
        return;
      }
      setPreviewHtml(injectGameConfig(html, { key: editor.key, config: { key: editor.key, values: editor.values } }));
    } finally {
      setPreviewBusy(false);
    }
  }, [game, def, editor.key, editor.values, showToast]);

  const postPreviewInit = useCallback(() => {
    const win = previewRef.current?.contentWindow;
    if (!win) return;
    win.postMessage({
      type: "init",
      data: {
        gameId: editor.gameId,
        playerName: "Giáo viên",
        players: ["Giáo viên"],
        questions: [],
        apiBase: API_BASE,
        playMode: "solo",
        gameKey: editor.key,
        gameConfig: payload,
      },
    }, "*");
  }, [editor.gameId, editor.key, payload]);

  useEffect(() => {
    const onMessage = (e) => {
      if (e.source !== previewRef.current?.contentWindow) return;
      const type = e.data?.type;
      if (type === "ready" || type === "bridge-ready") postPreviewInit();
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [postPreviewInit]);

  if (status.loading) {
    return <div className="p-12 flex items-center justify-center"><Loader label="Đang tải danh sách trò chơi..." /></div>;
  }

  if (status.error) {
    return (
      <div className="p-6 flex flex-col gap-3">
        <ManagementHeader title="Cấu hình game" subtitle="Dữ liệu riêng cho từng trò chơi" />
        <EmptyState
          icon="⚠️"
          title={status.error}
          action={<button type="button" className="text-sm font-bold text-ticket" onClick={loadGames}>Thử lại</button>}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <ManagementHeader title="Cấu hình game" subtitle={`Mỗi trò chơi có chuỗi JSON riêng (schema v${SCHEMA_VERSION}) — sửa game này không ảnh hưởng game khác.`} />

      <div className="note-card p-3 flex flex-wrap items-center gap-2">
        <label className="text-xs font-bold text-ink/60" htmlFor="cfg-game">Trò chơi</label>
        <select
          id="cfg-game"
          className={`${inputCls} flex-1 min-w-[220px]`}
          value={editor.gameId || ""}
          onChange={(e) => {
            const g = games.find((x) => x._id === e.target.value);
            if (g) { setPreviewHtml(null); setEditor(editorForGame(g)); }
          }}
        >
          {games.length === 0 && <option value="">Chưa có trò chơi nào</option>}
          {games.map((g) => (
            <option key={g._id} value={g._id}>
              {g.name}{g.code ? ` (${g.code})` : ""}{g.config?.values ? " · đã có cấu hình" : ""}
            </option>
          ))}
        </select>

        <label className="text-xs font-bold text-ink/60" htmlFor="cfg-key">Loại game</label>
        <select
          id="cfg-key"
          className={`${inputCls} min-w-[170px]`}
          value={editor.key || ""}
          onChange={(e) => assignKey(e.target.value)}
        >
          <option value="">— Chưa gán —</option>
          {defs.map((d) => <option key={d.key} value={d.key}>{d.icon} {d.name}</option>)}
        </select>

        <button
          type="button"
          disabled={!game || !editor.key || saving || !editor.dirty}
          onClick={save}
          className="inline-flex items-center gap-1.5 text-sm font-bold px-3.5 py-2 rounded-xl bg-teal text-white disabled:opacity-35"
        >
          <Save size={15} /> {saving ? "Đang lưu..." : "Lưu"}
        </button>
        <button
          type="button"
          disabled={!editor.key}
          onClick={resetValues}
          className="inline-flex items-center gap-1.5 text-sm font-bold px-3 py-2 rounded-xl bg-paper text-ink/70 disabled:opacity-35"
        >
          <RotateCcw size={15} /> Mặc định
        </button>
        <button
          type="button"
          disabled={previewBusy}
          onClick={() => (previewHtml ? setPreviewHtml(null) : openPreview())}
          className="inline-flex items-center gap-1.5 text-sm font-bold px-3 py-2 rounded-xl bg-ink text-paper disabled:opacity-35"
        >
          {previewHtml ? <EyeOff size={15} /> : <Eye size={15} />} {previewBusy ? "Đang tải..." : previewHtml ? "Ẩn xem thử" : "Xem thử"}
        </button>
        <button
          type="button"
          onClick={loadGames}
          className="w-9 h-9 rounded-xl bg-paper text-ink/70 inline-flex items-center justify-center"
          title="Tải lại danh sách"
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {!game && <EmptyState icon="🎮" title="Chưa có trò chơi nào" subtitle="Tạo trò chơi ở mục “Trò chơi” trước khi chỉnh cấu hình." />}

      {game && !def && (
        <div className="note-card p-4 text-sm text-ink/70">
          Game này chưa gán loại cấu hình. Chọn “Loại game” ở thanh trên để tạo chuỗi JSON riêng cho game.
        </div>
      )}

      {game && def && (
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_400px] gap-3 items-start">
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl p-4 text-white" style={{ background: "linear-gradient(135deg,#6C3BF5,#8B5CF6)" }}>
              <div className="flex items-center gap-3">
                <span className="text-4xl leading-none">{def.icon}</span>
                <div>
                  <h2 className="font-display text-lg leading-tight">{def.name}</h2>
                  <p className="text-xs opacity-90">{def.desc}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] opacity-90 font-mono">
                <span>game: {game.name}</span>
                <span>mã: {game.code || "—"}</span>
                <span>template: {game.templateId || "—"}</span>
                <span>{editor.dirty ? "có thay đổi chưa lưu" : "đã đồng bộ"}</span>
              </div>
            </div>

            {(def.settings || []).length > 0 && (
              <div className="note-card p-3.5">
                <h3 className="font-display text-sm text-ink mb-1">Luật chơi</h3>
                {(def.settings || []).map((s) => (
                  <SettingRow key={s.key} def={s} value={editor.values[s.key]} onChange={(v) => changeValue(s.key, v)} />
                ))}
              </div>
            )}

            {(def.lists || []).map((list) => (
              <ListEditor
                key={list.key}
                list={list}
                value={editor.values[list.key]}
                onChange={(v) => changeValue(list.key, v)}
              />
            ))}

            {issues.length > 0 && (
              <div className="note-card p-3.5">
                <h3 className="font-display text-sm text-ink mb-2">Kiểm tra dữ liệu</h3>
                <ul className="flex flex-col gap-1 text-xs">
                  {issues.slice(0, 40).map((i, idx) => (
                    <li key={idx} className={i.level === "error" ? "text-ticket" : "text-[#B8791A]"}>
                      {i.level === "error" ? "✕" : "!"} {i.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {previewHtml && (
              <div className="note-card overflow-hidden">
                <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-ink/10">
                  <span className="font-display text-sm text-ink inline-flex items-center gap-1.5">
                    <Play size={14} /> Xem thử
                  </span>
                  <button type="button" onClick={postPreviewInit} className="text-[11px] font-bold text-ink/60 hover:text-ticket">
                    Khởi động lại
                  </button>
                </div>
                <iframe
                  ref={previewRef}
                  title="Xem thử game"
                  srcDoc={previewHtml}
                  sandbox="allow-scripts"
                  onLoad={postPreviewInit}
                  className="w-full h-[460px] border-0 bg-paper"
                />
              </div>
            )}

            <div className="note-card p-3">
              <div className="flex items-center justify-between gap-2 mb-2">
                <button
                  type="button"
                  className="font-display text-sm text-ink inline-flex items-center gap-1.5"
                  onClick={() => setShowJson((v) => !v)}
                >
                  {showJson ? <EyeOff size={14} /> : <Eye size={14} />} JSON của game
                </button>
                <div className="flex gap-1.5">
                  <button type="button" onClick={copyJson} className="w-8 h-8 rounded-lg bg-paper text-ink/60 inline-flex items-center justify-center" title="Sao chép">
                    <Copy size={14} />
                  </button>
                  <button type="button" onClick={downloadJson} className="w-8 h-8 rounded-lg bg-paper text-ink/60 inline-flex items-center justify-center" title="Tải file">
                    <Download size={14} />
                  </button>
                  <button type="button" onClick={() => fileRef.current?.click()} className="w-8 h-8 rounded-lg bg-paper text-ink/60 inline-flex items-center justify-center" title="Nhập từ file">
                    <Upload size={14} />
                  </button>
                </div>
              </div>
              {showJson && (
                <textarea
                  readOnly
                  value={payload ? JSON.stringify(payload, null, 2) : ""}
                  className="w-full h-64 font-mono text-[11px] note-card p-2.5 border-ink/10 outline-none resize-y"
                />
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept=".json,.txt,.js"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const reader = new FileReader();
                reader.onload = () => importJson(String(reader.result || ""));
                reader.readAsText(f);
                e.target.value = "";
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}