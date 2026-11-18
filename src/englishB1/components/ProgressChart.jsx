import { BarsChart, TrendChart } from "../../components/charts";

/**
 * ProgressChart — biểu đồ điểm/tiến độ theo thời gian (ProgressPage, dashboard).
 *
 * Nhận `points` dạng [{ label: "12/11", value: 80 }] rồi chuyển sang
 * labels + series cho preset biểu đồ (`ChartistChart` bọc sẵn): type "line"
 * (đường smooth + area) hoặc "bar" (cột). Không tự fetch — chỉ hiển thị.
 *
 * @param {object} props
 * @param {{label: string, value: number}[]} [props.points] Dữ liệu hiển thị (rỗng → hiện `emptyLabel`).
 * @param {"line"|"bar"} [props.type] Kiểu biểu đồ, mặc định "line".
 * @param {number} [props.height]     Chiều cao biểu đồ (px), mặc định 220.
 * @param {string} [props.ariaLabel]  Nhãn mô tả cho screen reader.
 * @param {string} [props.emptyLabel] Thông báo khi chưa có dữ liệu.
 */
export function ProgressChart({ points = [], type = "line", height = 220, ariaLabel, emptyLabel }) {
  const labels = points.map((p) => p.label);
  const values = points.map((p) => p.value);
  const series = [{ name: "Điểm", values }];
  const empty = emptyLabel ?? "Chưa có dữ liệu";
  const label = ariaLabel || `Giá trị theo thời gian: ${labels.join(", ")}`;

  if (type === "bar") {
    return <BarsChart labels={labels} series={series} height={height} ariaLabel={label} empty={empty} />;
  }

  return <TrendChart labels={labels} series={series} height={height} ariaLabel={label} empty={empty} />;
}
