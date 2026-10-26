import bellRaw from "../../../assets/img/icons/bell.svg?raw";
import bingRaw from "../../../assets/img/icons/notification-bing.svg?raw";
import arrowLeftRaw from "../../../assets/img/icons/arrow-left.svg?raw";
import closesRaw from "../../../assets/img/icons/closes.svg?raw";
import checkRaw from "../../../assets/img/icons/check.svg?raw";
import checkCircleRaw from "../../../assets/img/icons/check-icon.svg?raw";
import plusRaw from "../../../assets/img/icons/plus.svg?raw";
import usersRaw from "../../../assets/img/icons/users1.svg?raw";
import userRaw from "../../../assets/img/icons/user-icon.svg?raw";
import deleteRaw from "../../../assets/img/icons/delete.svg?raw";
import editRaw from "../../../assets/img/icons/edit-5.svg?raw";
import uploadRaw from "../../../assets/img/icons/upload.svg?raw";
import downloadRaw from "../../../assets/img/icons/download.svg?raw";
import playRaw from "../../../assets/img/icons/play-01.svg?raw";
import castRaw from "../../../assets/img/icons/airplay.svg?raw";
import calendarRaw from "../../../assets/img/icons/calendars.svg?raw";
import mailRaw from "../../../assets/img/icons/mail.svg?raw";
import logoutRaw from "../../../assets/img/icons/log-out.svg?raw";
import settingsRaw from "../../../assets/img/icons/settings.svg?raw";
import chartRaw from "../../../assets/img/icons/bar1.svg?raw";
import powerRaw from "../../../assets/img/icons/power.svg?raw";
import dropdownRaw from "../../../assets/img/icons/dropdown.svg?raw";
import smileRaw from "../../../assets/img/icons/emoji-smile.svg?raw";
import pdfRaw from "../../../assets/img/icons/pdf.svg?raw";

/**
 * Icon.jsx — bộ icon SVG của dự án, lấy từ `src/assets/img/icons`.
 *
 * Các file trong thư mục đó đều mang màu cố định (stroke="#67748E",
 * fill="#7367F0"…), nên dùng trực tiếp (kể cả qua <img>) sẽ không theo được
 * class `text-gold`, `text-ink/40`, `hover:text-gold` mà UI đang dùng. Vì vậy mỗi
 * icon được chuyển về `currentColor` ngay khi module nạp: kích thước + màu vẫn do
 * className quyết định y hệt lucide-react, và có thể đổi 1:1 không đụng layout.
 *
 * `dangerouslySetInnerHTML` ở đây là an toàn: nội dung SVG là chuỗi tĩnh import
 * từ file trong repo bằng `?raw`, không có dữ liệu người dùng nào đi vào.
 *
 * Quy ước tô màu:
 *  - Icon chỉ có màu trắng (closes, play-01, bar) → trắng thành currentColor,
 *    nếu không sẽ vô hình trên nền sáng.
 *  - Icon nhiều màu (check-icon: nền xanh + nét trắng) → chỉ tô phần có màu,
 *    giữ nguyên phần trắng để nét trắng vẫn nằm trên khối đang đổi màu.
 */

const WHITE = new Set(["white", "#fff", "#ffffff"]);

/** Tách viewBox + phần thân của SVG, bỏ thẻ <svg> gốc (width/height hard-code). */
function parseIcon(raw) {
  const viewBox = raw.match(/viewBox="([^"]+)"/)[1];
  const body = raw.replace(/^[\s\S]*?<svg\b[^>]*>/, "").replace(/<\/svg>[\s\S]*$/, "");
  const shades = new Set(
    [...body.matchAll(/(?:fill|stroke)="(?!none|url\()([^"]+)"/g)].map(m => m[1].toLowerCase())
  );
  const knockout = shades.size > 1; // có màu khác trắng => phần trắng là nét đè
  const inner = body.replace(
    /\b(fill|stroke)="([^"]+)"/g,
    (match, attr, value) => {
      const v = value.toLowerCase();
      if (v === "none" || v.startsWith("url(")) return match;
      if (knockout && WHITE.has(v)) return match;
      return `${attr}="currentColor"`;
    }
  );
  return { viewBox, inner };
}

/**
 * Tạo component icon từ một file SVG.
 * Dùng dạng component (không phải <AppIcon name=…/>) để thay được lucide 1:1,
 * kể cả khi icon được khai báo trong mảng cấu hình menu (`icon: IconUsers`).
 *
 * `size` mô phỏng lucide: khi truyền thì bỏ class kích thước mặc định để
 * width/height thắng thế (CSS class sẽ ghi đè thuộc tính nếu còn `w-4 h-4`).
 */
function defineIcon(raw) {
  const { viewBox, inner } = parseIcon(raw);
  return function ProjectIcon({ className, size, ...rest }) {
    const sized = size != null;
    return (
      <svg
        viewBox={viewBox}
        className={sized ? className : (className ?? "w-4 h-4")}
        width={sized ? size : undefined}
        height={sized ? size : undefined}
        fill="none"
        aria-hidden="true"
        focusable="false"
        dangerouslySetInnerHTML={{ __html: inner }}
        {...rest}
      />
    );
  };
}

export const IconBell = defineIcon(bellRaw);
export const IconNotification = defineIcon(bingRaw);
export const IconBack = defineIcon(arrowLeftRaw);          // arrow-left.svg
export const IconClose = defineIcon(closesRaw);            // closes.svg
export const IconCheck = defineIcon(checkRaw);
export const IconCheckCircle = defineIcon(checkCircleRaw); // check-icon.svg
export const IconAdd = defineIcon(plusRaw);
export const IconUsers = defineIcon(usersRaw);             // users1.svg
export const IconUser = defineIcon(userRaw);               // user-icon.svg
export const IconTrash = defineIcon(deleteRaw);            // delete.svg
export const IconEdit = defineIcon(editRaw);               // edit-5.svg
export const IconUpload = defineIcon(uploadRaw);
export const IconDownload = defineIcon(downloadRaw);
export const IconPlay = defineIcon(playRaw);               // play-01.svg
export const IconCast = defineIcon(castRaw);               // airplay.svg — "Phát trực tiếp"
export const IconCalendar = defineIcon(calendarRaw);       // calendars.svg
export const IconMail = defineIcon(mailRaw);
export const IconLogout = defineIcon(logoutRaw);           // log-out.svg
export const IconSettings = defineIcon(settingsRaw);
export const IconChart = defineIcon(chartRaw);             // bar1.svg
export const IconPower = defineIcon(powerRaw);
export const IconChevronDown = defineIcon(dropdownRaw);    // dropdown.svg
export const IconSmile = defineIcon(smileRaw);             // emoji-smile.svg
export const IconFile = defineIcon(pdfRaw);                // pdf.svg — hình trang tài liệu
