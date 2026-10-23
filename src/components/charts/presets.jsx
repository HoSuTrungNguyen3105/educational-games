import { useMemo } from "react";
import { lineChart, barChart, pieChart, Interpolation } from "chartist";
import ChartistChart from "./ChartistChart.jsx";
import { seriesColor, sparseLabels, compactNumber } from "./palette.js";

/**
 * Bộ biểu đồ sẵn dùng cho dashboard giáo viên: nhận dữ liệu thô (labels +
 * series), tự lo phần Chartist — tỉ lệ trục, nhãn rút gọn theo bề rộng màn
 * hình, tooltip, màu theo palette chung của trang.
 *
 * Mỗi biểu đồ chỉ vẽ lại khi `signature` (dữ liệu thật) đổi, không phải mỗi
 * lần React render.
 */

const shorten = (text, max = 16) => {
  const s = String(text);
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
};

const percentOf = (part, total) => (total > 0 ? Math.round((part / total) * 1000) / 10 : 0);

/**
 * Bản đồ tooltip theo đúng thứ tự Chartist vẽ node.
 * `null`/`undefined` = điểm dữ liệu trống → không gắn nhãn, tooltip im lặng
 * thay vì báo "0" (thí dụ môn chưa có phiếu kết quả nào).
 */
const buildTips = (labels, series, format) => series.map((s, si) => labels.map((label, i) => {
  const value = s.values[i];
  if (value === null || value === undefined) return null;
  return { label, value: format(value, i), color: s.color || seriesColor(si) };
}));

/** Bao nhiêu ngày mới hiện 1 nhãn — tính lúc vẽ, theo bề rộng thật của khung. */
const labelStep = (count, width) => Math.max(1, Math.ceil(count / (width < 480 ? 4 : width < 768 ? 6 : count > 31 ? 10 : 8)));

/** Biểu đồ đường / vùng: xu hướng theo ngày (lượt chơi, học sinh hoạt động). */
export function TrendChart({
  labels, series, height = 240,
  format = compactNumber, tickFormat = compactNumber,
  area = true, yMax, empty, ariaLabel,
}) {
  const signature = useMemo(
    () => JSON.stringify([labels, series.map((s) => [s.name, s.values]), height, area, yMax]),
    [labels, series, height, area, yMax],
  );

  const tips = useMemo(() => buildTips(labels, series, format), [labels, series, format]);
  const hasData = series.some((s) => s.values.some((v) => v));

  const top = yMax ?? Math.max(1, ...series.flatMap((s) => s.values));

  return (
    <ChartistChart
      signature={hasData ? signature : "__empty__"}
      tips={tips}
      height={height}
      ariaLabel={ariaLabel || series.map((s) => `${s.name}: ${s.values.join(", ")}`).join("; ")}
      empty={empty}
      seriesNames={series.map((s) => s.name)}
      create={(box) => {
        const shown = sparseLabels(labels, labelStep(labels.length, box.clientWidth || 640));
        return lineChart(box, { labels, series: series.map((s) => ({ name: s.name, data: s.values })) }, {
          fullWidth: true,
          chartPadding: { top: 14, right: 12, bottom: 2, left: 4 },
          showArea: area,
          showLine: true,
          showPoint: true,
          lineSmooth: Interpolation.cardinal({ tension: 0.32, fill: area }),
          low: 0,
          high: top,
          axisX: { showGrid: false, labelInterpolationFnc: (v, i) => shown[i] },
          axisY: { onlyInteger: true, offset: 34, labelInterpolationFnc: (v) => tickFormat(v) },
        });
      }}
    />
  );
}

/** Cột: so sánh theo nhóm — ghép (stack), sánh đôi (grouped) hoặc nằm ngang. */
export function BarsChart({
  labels, series, height = 220,
  format = compactNumber, tickFormat = compactNumber,
  stack = false, horizontal = false, empty, ariaLabel,
}) {
  const signature = useMemo(
    () => JSON.stringify([labels, series, height, stack, horizontal]),
    [labels, series, height, stack, horizontal],
  );

  const tips = useMemo(() => buildTips(labels, series, format), [labels, series, format]);
  const hasData = series.some((s) => s.values.some((v) => v));

  const max = Math.max(1, ...labels.map((_, i) => (stack
    ? series.reduce((sum, s) => sum + (s.values[i] || 0), 0)
    : Math.max(...series.map((s) => s.values[i] || 0)))));

  return (
    <ChartistChart
      signature={hasData ? signature : "__empty__"}
      tips={tips}
      height={height}
      ariaLabel={ariaLabel || series.map((s) => `${s.name}: ${s.values.join(", ")}`).join("; ")}
      empty={empty}
      seriesNames={series.map((s) => s.name)}
      create={(box) => {
        const shown = sparseLabels(labels, labelStep(labels.length, box.clientWidth || 640));
        return barChart(box, { labels, series: series.map((s) => s.values) }, {
          fullWidth: true,
          horizontalBars: horizontal,
          stackBars: stack,
          seriesBarDistance: stack ? 18 : 8,
          distributeWhitespace: !stack && labels.length > 1,
          low: 0,
          high: max,
          chartPadding: horizontal
            ? { top: 6, right: 18, bottom: 0, left: 0 }
            : { top: 12, right: 8, bottom: 0, left: 0 },
          axisX: horizontal
            ? { onlyInteger: true, showGrid: true, offset: 22, labelInterpolationFnc: (v) => tickFormat(v) }
            : { showGrid: false, labelInterpolationFnc: (v, i) => shown[i] },
          axisY: horizontal
            ? { showGrid: false, offset: 96, labelInterpolationFnc: (v) => shorten(v) }
            : { onlyInteger: true, offset: 32, labelInterpolationFnc: (v) => tickFormat(v) },
        });
      }}
    />
  );
}

/** Donut: tỉ lệ giữa các nhóm (trạng thái trò chơi, phân môn). */
export function DonutChart({
  slices, height = 200, format = compactNumber,
  centerValue, centerLabel, thickness = 26, empty, ariaLabel,
}) {
  const signature = useMemo(() => JSON.stringify([slices, height, thickness]), [slices, height, thickness]);
  const total = slices.reduce((sum, s) => sum + s.value, 0);

  // Chartist tách mỗi lát thành một .ct-series riêng → tips[si][0].
  const tips = useMemo(() => slices.map((s, i) => ([{
    label: s.name,
    value: `${format(s.value)} · ${percentOf(s.value, total)}%`,
    color: s.color || seriesColor(i),
  }])), [slices, format, total]);

  return (
    <ChartistChart
      signature={total > 0 ? signature : "__empty__"}
      tips={tips}
      height={height}
      ariaLabel={ariaLabel || slices.map((s) => `${s.name} ${s.value}`).join("; ")}
      empty={empty}
      seriesNames={slices.map((s) => s.name)}
      center={(centerValue !== undefined || centerLabel) && (
        <div>
          <b>{centerValue ?? total}</b>
          <span>{centerLabel || "Tổng"}</span>
        </div>
      )}
      create={(box) => pieChart(box, { labels: slices.map((s) => s.name), series: slices.map((s) => s.value) }, {
        donut: true,
        donutWidth: thickness,
        startAngle: 90,
        total,
        showLabel: false,
        fullWidth: true,
        chartPadding: 8,
      })}
    />
  );
}

/** Chú thích màu — đặt ngoài biểu đồ để tự xuống dòng trên mobile. */
export function ChartLegend({ items }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="gq-legend">
      {items.map((item, i) => (
        <span className="gq-legend__item" key={item.label}>
          <i className="gq-legend__dot" style={{ background: item.color || seriesColor(i) }} />
          {item.label}
          {item.value !== undefined && <b className="gq-legend__num ml-1">{item.value}</b>}
        </span>
      ))}
    </div>
  );
}
