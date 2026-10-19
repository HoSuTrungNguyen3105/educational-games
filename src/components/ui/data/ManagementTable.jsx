import { ErrorState } from "../feedback/ErrorState.jsx";
import { Loader } from "../feedback/Loader.jsx";
import { GhostButton } from "../buttons/GhostButton.jsx";
import { PrimaryButton } from "../buttons/PrimaryButton.jsx";

export function ManagementTable({ title, count, data, error, onRetry, emptyLabel, headers, renderRow, onRemoveAll, removeAllLabel, onCreate, createLabel, onImport, importLabel }) {  return (
    <div>
      <div className="flex items-end justify-between mb-3">
        <h2 className="font-display text-lg text-ink">{title}{count !== undefined ? ` (${count})` : ""}</h2>
        <div className="flex items-center gap-3">
          {onRemoveAll && <button onClick={onRemoveAll} className="text-xs text-ticket/70 hover:text-ticket">{removeAllLabel || "Xóa tất cả"}</button>}
          {onImport && <GhostButton onClick={onImport} className="text-xs px-3 py-1.5">{importLabel || "📥 Import"}</GhostButton>}
          {onCreate && <PrimaryButton onClick={onCreate} className="text-xs px-3 py-1.5">{createLabel || "+ Thêm mới"}</PrimaryButton>}
        </div>
      </div>
      {error && !data && <ErrorState subtitle={error} onRetry={onRetry} />}
      {!error && !data && <Loader label="Đang tải..." />}
      {!error && data && (
        <div className="note-card overflow-x-auto">
          {data.length === 0 ? (
            <p className="p-6 text-sm text-[#8A7C63] text-center">{emptyLabel || "Chưa có dữ liệu."}</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-[#8A7C63] font-mono text-xs uppercase border-b border-ink/10">
                  {headers.map((h, i) => <th key={i} className="px-5 py-3">{h}</th>)}
                </tr>
              </thead>
              <tbody>{data.map(renderRow)}</tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
