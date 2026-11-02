import { Compass, Home } from "lucide-react";
import { PrimaryButton } from "../components/ui";
import { navigate } from "../lib/router.js";

// Trang 404 — hiển thị khi hash không khớp bất kỳ route nào trong bảng route
// (src/lib/router.js trả name "not-found"). Trước đây route lạ rơi thẳng về
// trang chủ nên người dùng không biết link đã sai; trang này báo rõ và đưa
// về trang chủ bằng nút bấm. Các alias cũ (vd #/admin) vẫn được router xử lý
// trước khi tới đây nên không bị ảnh hưởng.
export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mb-5">
        <Compass className="w-10 h-10 text-purple-500" />
      </div>
      <p className="font-display text-5xl text-ink mb-2">404</p>
      <h1 className="font-display text-xl text-ink mb-2">Không tìm thấy trang này</h1>
      <p className="text-sm text-[#8A7C63] max-w-sm mb-6">
        Đường dẫn bạn mở không tồn tại hoặc đã được chuyển đi nơi khác.
        Hãy kiểm tra lại địa chỉ, hoặc quay về trang chủ để tiếp tục khám phá nhé!
      </p>
      <PrimaryButton onClick={() => navigate("/")}>
        <Home className="w-4 h-4 mr-1.5" /> Về trang chủ
      </PrimaryButton>
    </div>
  );
}
