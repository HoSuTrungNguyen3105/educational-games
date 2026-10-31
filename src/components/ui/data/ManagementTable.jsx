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
      <div className="edu-list-head">
        <h2 className="edu-list-title">{title}{count !== undefined ? ` (${count})` : ""}</h2>
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {hasCards && <ViewToggle mode={mode} onChange={setMode} />}
          {onRemoveAll && <button onClick={onRemoveAll} className="text-xs text-ticket/70 hover:text-ticket">{removeAllLabel || "Xóa tất cả"}</button>}
          {onImport && <GhostButton onClick={onImport}>{importLabel || "Import"}</GhostButton>}
          {onCreate && <PrimaryButton onClick={onCreate}>{createLabel || "+ Thêm mới"}</PrimaryButton>}
        </div>
      </div>
      {error && !data && <ErrorState subtitle={error} onRetry={onRetry} />}
      {!error && !data && <Loader label="Đang tải..." />}
      {!error && data && data.length === 0 && (
        <div className="note-card edu-empty">
          {emptyLabel || "Chưa có dữ liệu."}
        </div>
      )}
      {!error && data && data.length > 0 && (
        <>
          {hasCards && (
            <div className={cardGridClass(mode)}>
              {data.map((item, i) => (
                <div key={item?.id ?? item?._id ?? i} className="edu-row-card">
                  {renderCard(item, i)}
                </div>
              ))}
            </div>
          )}
          <div className={`${hasCards ? tableWrapClass(mode) : "edu-table-wrap"}`}>
            <table>
              <thead>
                <tr>
                  {headers.map((h, i) => <th key={i}>{h}</th>)}
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
