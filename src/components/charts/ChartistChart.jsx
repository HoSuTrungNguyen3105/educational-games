import { useEffect, useRef, useState } from "react";
import "chartist/styles.css";
import "./charts.css";

/**
 * ChartistChart — nhân React bọc một biểu đồ Chartist.
 *
 * Chartist 2 vẽ thẳng vào DOM node chứ không phải component React, nên lớp này:
 *   · dựng biểu đồ khi `signature` đổi (dữ liệu/thông số), huỷ cái cũ trước khi
 *     vẽ cái mới để không còn SVG cũ chồng lên
 *   · vẽ lại khi chiều rộng màn hình đổi, vì Chartist tính tọa độ theo pixel của
 *     đúng lúc vẽ
 *   · làm tooltip nổi: Chartist không gắn số liệu vào node SVG, nên sau khi vẽ
 *     ta ghi nhãn vào data-* của từng node rồi đọc lại khi rê chuột
 *
 * `tips[seriesIndex][nodeIndex] = { label, value, color }` là bản đồ khớp thứ tự
 * series và thứ tự điểm mà Chartist vẽ ra.
 */

const NODE_SELECTOR = ".ct-point, .ct-bar, .ct-slice-donut, .ct-slice-pie";

export default function ChartistChart({ create, tips, signature, height = 240, ariaLabel, empty, seriesNames = [], center }) {
  const boxRef = useRef(null);
  const chartRef = useRef(null);
  /** Số liệu mới nhất, để hàm vẽ lại (kể cả khi ResizeObserver gọi) không đọc phải bản cũ. */
  const latest = useRef({ create, tips, seriesNames });
  const [tip, setTip] = useState(null);

  useEffect(() => {
    latest.current = { create, tips, seriesNames };

    const labelNodes = () => {
      const box = boxRef.current;
      const list = latest.current.tips;
      if (!box || !list) return;
      box.querySelectorAll(".ct-series").forEach((group, si) => {
        group.querySelectorAll(NODE_SELECTOR).forEach((node, ei) => {
          const t = list[si]?.[ei];
          if (!t) return;
          node.dataset.tipLabel = t.label;
          node.dataset.tipValue = t.value;
          node.dataset.tipColor = t.color || "";
          node.dataset.tipSeries = latest.current.seriesNames[si] || "";
        });
      });
    };

    /** Chartist dựng SVG trong macrotask kế tiếp (setTimeout 0 của riêng nó). */
    const draw = () => {
      const box = boxRef.current;
      if (!box) return;
      chartRef.current?.destroy();
      chartRef.current = latest.current.create(box) ?? null;
      setTimeout(labelNodes, 0);
    };

    if (!boxRef.current) return undefined;
    setTip(null);
    draw();

    let ro;
    if (typeof ResizeObserver !== "undefined") {
      let lastWidth = boxRef.current.clientWidth;
      let frame = 0;
      ro = new ResizeObserver(() => {
        const width = boxRef.current?.clientWidth || 0;
        if (!width || Math.abs(width - lastWidth) < 8) return;
        lastWidth = width;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(draw);
      });
      ro.observe(boxRef.current);
    }

    return () => {
      ro?.disconnect();
      chartRef.current?.destroy();
      chartRef.current = null;
    };
    // Vẽ lại chỉ khi dữ liệu đổi (signature) — `create` là hàm nội tuyến, cho vào
    // deps thì biểu đồ dựng lại mỗi lần React render.
  }, [signature]); // eslint-disable-line react-hooks/exhaustive-deps

  const onMove = (event) => {
    const node = event.target?.closest?.(NODE_SELECTOR);
    if (!node || !node.dataset.tipLabel) {
      if (tip) setTip(null);
      return;
    }
    const next = {
      x: event.clientX,
      y: event.clientY,
      label: node.dataset.tipLabel,
      value: node.dataset.tipValue,
      series: node.dataset.tipSeries,
      color: node.dataset.tipColor,
    };
    if (tip && tip.label === next.label && tip.value === next.value && tip.series === next.series) return;
    setTip(next);
  };

  const isEmpty = signature === "__empty__";

  return (
    <div className="gq-chart">
      {isEmpty ? (
        <div className="gq-chart__empty" style={{ minHeight: height }}>
          {empty || "Chưa có số liệu cho biểu đồ này"}
        </div>
      ) : (
        <>
          <div ref={boxRef} style={{ height }} role="img" aria-label={ariaLabel} onMouseMove={onMove} onMouseLeave={() => setTip(null)} />
          {center && <div className="gq-chart__center" style={{ height }}>{center}</div>}
        </>
      )}
      <div className={`gq-chart__tip${tip ? " is-on" : ""}`} style={tip ? { left: tip.x, top: tip.y } : undefined}>
        {tip && (
          <>
            {tip.color && <i style={{ background: tip.color }} />}
            {tip.series && <span className="opacity-70 mr-1">{tip.series}</span>}
            {tip.label}: <b>{tip.value}</b>
          </>
        )}
      </div>
    </div>
  );
}
