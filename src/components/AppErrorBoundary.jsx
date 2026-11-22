import { Component } from "react";
import {
  isChunkLoadError,
  attemptChunkRecovery,
  clearChunkReloadMark,
} from "../lib/chunkRecovery.js";

/**
 * Error boundary DÙNG CHUNG ở tầng app/route — lưới đỡ cuối cùng để app
 * KHÔNG BAO GIỜ trắng trang:
 *  - Lỗi nạp chunk lazy (bản cũ gặp chunk mới 404, mạng chập): tự tải
 *    lại trang đúng 1 lần qua chunkRecovery; trong lúc chờ tải lại hiện
 *    màn hình "Đang tải lại bản mới…". Tải lại vẫn lỗi → màn hình lỗi.
 *  - Mọi lỗi còn lại: hiện màn hình lỗi thân thiện + nút "Tải lại
 *    trang", KHÔNG tự reload (tránh vòng lặp che lỗi thật).
 * Đổi route (prop resetKey đổi) thì boundary tự reset — lỗi ở một trang
 * không khoá cứng cả phiên làm việc.
 *
 * Gắn ở hai điểm: quanh nội dung route trong App.jsx (có resetKey theo
 * route) và ngoài cùng ở main.jsx (đỡ cả lỗi lúc App render lần đầu).
 */
export default class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, recovering: false };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    if (isChunkLoadError(error)) {
      // Tự tải lại 1 lần: attemptChunkRecovery trả true là trang đang
      // được tải lại — hiện màn hình chờ thay vì màn hình lỗi.
      if (attemptChunkRecovery()) {
        this.setState({ recovering: true });
      }
    }
    // Lỗi runtime thường: chỉ ghi nhận, màn hình lỗi render ở dưới.
  }

  componentDidUpdate(prevProps) {
    if (
      this.state.error &&
      prevProps.resetKey !== undefined &&
      prevProps.resetKey !== this.props.resetKey
    ) {
      this.setState({ error: null, recovering: false });
    }
  }

  handleManualReload = () => {
    // Bấm tay thì luôn được tải lại: xoá dấu chống lặp để nếu chunk vẫn
    // lỗi sau lần này, cơ chế tự khôi phục còn nguyên 1 lượt.
    clearChunkReloadMark();
    window.location.reload();
  };

  render() {
    const { error, recovering } = this.state;
    if (!error) return this.props.children;

    if (recovering) {
      return (
        <div className="min-h-screen bg-paper flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-xl">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
            <h1 className="text-lg font-bold text-slate-800">
              Đang tải lại bản mới…
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              EduPlay vừa có bản cập nhật nên một phần của trang chưa tải
              được. Đang tự tải lại để lấy bản mới nhất, chờ một chút nhé!
            </p>
          </div>
        </div>
      );
    }

    const chunkError = isChunkLoadError(error);
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-xl">
          <div className="text-4xl" aria-hidden="true">
            🛠️
          </div>
          <h1 className="mt-3 text-lg font-bold text-slate-800">
            Ối, trang gặp lỗi rồi!
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            {chunkError
              ? "Một phần của trang chưa tải được — có thể do mạng chập chờn hoặc EduPlay vừa cập nhật bản mới. Hãy bấm nút bên dưới để tải lại trang nhé."
              : "Đã có lỗi xảy ra khi hiển thị trang này. Hãy thử tải lại trang; nếu vẫn lỗi, thử lại sau ít phút nhé."}
          </p>
          <button
            type="button"
            onClick={this.handleManualReload}
            className="mt-5 w-full rounded-2xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            Tải lại trang
          </button>
          <a
            href="#/"
            className="mt-3 block text-sm font-medium text-slate-500 underline-offset-2 hover:underline"
          >
            Về trang chủ
          </a>
        </div>
      </div>
    );
  }
}
