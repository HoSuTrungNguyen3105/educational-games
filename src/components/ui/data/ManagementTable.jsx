import { ErrorState } from "../feedback/ErrorState.jsx";
import { Loader } from "../feedback/Loader.jsx";
import { GhostButton } from "../buttons/GhostButton.jsx";
import { PrimaryButton } from "../buttons/PrimaryButton.jsx";
import { useViewMode, ViewToggle, cardGridClass, tableWrapClass } from "./ViewToggle.jsx";

export function ManagementTable({ title, count, data, error, onRetry, emptyLabel, headers, renderRow, renderCard, viewKey, onRemoveAll, removeAllLabel, onCreate, createLabel, onImport, importLabel }) {
  const [mode, setMode] = useViewMode(viewKey || title || "admin-table");
  const hasCards = typeof renderCard === "function";
  return (
    <div>
      <div className="flex items-end justify-between mb-3 gap-2">
        <h2 className="font-display text-lg text-ink">{title}{count !== undefined ? ` (${count})` : ""}</h2>
        <div className="flex items-center gap-2 sm:gap-3">
          {hasCards && <ViewToggle mode={mode} onChange={setMode} />}
          {onRemoveAll && <button onClick={onRemoveAll} className="text-xs text-ticket/70 hover:text-ticket">{removeAllLabel || "Xóa tất cả"}</button>}
          {onImport && <GhostButton onClick={onImport} className="text-xs px-3 py-1.5">{importLabel || "📥 Import"}</GhostButton>}
          {onCreate && <PrimaryButton onClick={onCreate} className="text-xs px-3 py-1.5">{createLabel || "+ Thêm mới"}</PrimaryButton>}
        </div>
      </div>
      {error && !data && <ErrorState subtitle={error} onRetry={onRetry} />}
      {!error && !data && <Loader label="Đang tải..." />}
      {!error && data && data.length === 0 && (
        <div className="note-card">
          <p className="p-6 text-sm text-[#8A7C63] text-center">{emptyLabel || "Chưa có dữ liệu."}</p>
        </div>
      )}
      {!error && data && data.length > 0 && (
        <>
          {hasCards && (
            <div className={cardGridClass(mode)}>
              {data.map((item, i) => (
                <div key={item?.id ?? item?._id ?? i} className="bg-paper2 border border-ink/10 rounded-xl px-3.5 py-3 hover:border-ink/25 transition">
                  {renderCard(item, i)}
                </div>
              ))}
            </div>
          )}
          <div className={`note-card ${hasCards ? tableWrapClass(mode) : ""}`}>
            <table className="w-full">
              <thead>
                <tr className="text-left text-[#8A7C63] font-mono text-xs uppercase border-b border-ink/10">
                  {headers.map((h, i) => <th key={i} className="px-5 py-3">{h}</th>)}
                </tr>
              </thead>
              <tbody>{data.map(renderRow)}</tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
