import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { navigate } from "../lib/router.js";
import { Loader } from "../components/ui";

// Trang Sổ ghi chú — route #/ghi-chu, toàn màn hình (không bọc RouteShell).
// Nội dung là file HTML tĩnh `public/soghichu.html` do Nguyên tự đẩy lên repo:
// trang này FETCH nội dung HTML rồi render qua `srcDoc` trong iframe tràn
// màn hình — bám đúng cơ chế BirthdayPage, KHÔNG trỏ iframe thẳng vào URL
// file (src=) để tránh trường hợp server phục vụ file .html với Content-Type
// không phải text/html → trình duyệt hiện mã nguồn thay vì render.
// Ghi chú được file HTML lưu bằng localStorage bên trong iframe; iframe
// srcDoc dùng chung origin với app nên ghi chú giữ nguyên giữa các lần mở,
// không cần tài khoản hay API. Thanh trên cùng là của app (nút về trang chủ),
// phần còn lại là giao diện riêng của sổ ghi chú.
const NOTES_URL = `${import.meta.env.BASE_URL || "/"}soghichu.html`;

export default function NotesPage() {
  const [html, setHtml] = useState("");
  const [failed, setFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setFailed(false);
    fetch(NOTES_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((text) => {
        if (active) setHtml(text || "");
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  return (
    <div className="fixed inset-0 flex flex-col bg-paper">
      <div className="flex shrink-0 items-center gap-3 border-b-2 border-ink/10 bg-paper2 px-3 py-2">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 rounded-full border-2 border-ink bg-white px-3 py-1.5 text-sm font-extrabold text-ink shadow hover:bg-paper2"
          aria-label="Về trang chủ"
        >
          <ArrowLeft className="h-4 w-4" /> Trang chủ
        </button>
        <p className="font-display text-base font-bold text-ink">📒 Sổ ghi chú</p>
      </div>

      <div className="relative flex-1">
        {failed ? (
          <div className="absolute inset-0 grid place-items-center px-5">
            <div className="text-center max-w-md">
              <p className="font-display text-lg font-bold text-ink">Chưa mở được sổ ghi chú</p>
              <p className="mt-1 text-sm text-ink/60">
                File ghi chú chưa tải về được (mạng chập chờn hoặc bản mới đang cập nhật). Hãy thử lại nhé.
              </p>
              <button
                type="button"
                onClick={() => setReloadKey((k) => k + 1)}
                className="mt-4 rounded-full border-2 border-ink bg-paper2 px-4 py-2 text-sm font-extrabold text-ink shadow-sm hover:bg-white"
              >
                Thử lại
              </button>
            </div>
          </div>
        ) : html ? (
          <iframe
            title="Sổ ghi chú"
            srcDoc={html}
            sandbox="allow-scripts allow-same-origin allow-modals"
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <Loader label="Đang mở sổ ghi chú..." />
          </div>
        )}
      </div>
    </div>
  );
}
