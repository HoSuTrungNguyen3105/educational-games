import { Loader } from "./ui.jsx";

export default function PageLoading({ label = "Đang tải trang..." }) {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center">
      <Loader label={label} />
    </div>
  );
}
