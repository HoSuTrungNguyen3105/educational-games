// exportUtils.js — Helper DÙNG CHUNG cho các bộ xuất file của Teacher
// Document Studio (wordExporter.js → .docx, pptxExporter.js → .pptx):
// tên file an toàn, tải ảnh từ URL về bộ nhớ, tải file xuống trình duyệt.
// Tách ra để hai exporter không copy-paste lẫn nhau (yêu cầu đợt 2).

/** Tên file an toàn từ tên tài liệu: "Tên" + "." + ext. */
export function exportFileName(name, ext) {
  const base = String(name || "tai-lieu").trim()
    .replace(/[\\/:*?"<>|]+/g, "-").replace(/\s+/g, " ").slice(0, 80) || "tai-lieu";
  return `${base}.${ext}`;
}

/** ArrayBuffer → base64 theo từng đoạn (tránh tràn stack với ảnh lớn). */
export function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
  }
  return btoa(binary);
}

/** Đọc kích thước ảnh từ Blob bằng thẻ Image (dự phòng khi createImageBitmap lỗi). */
async function imageSize(blob) {
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    if (img.decode) await img.decode();
    else await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => reject(new Error("Không đọc được ảnh"));
    });
    return { width: img.naturalWidth || 1, height: img.naturalHeight || 1 };
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * SVG không được mọi phiên bản Word/PowerPoint hỗ trợ đồng nhất. Chuyển SVG
 * sang PNG bằng canvas trước khi nhúng để file xuất ra mở được ở mọi nơi.
 * Ảnh minh họa của thư viện mẫu đều là SVG nội bộ nên không bị lỗi CORS.
 */
async function rasterizeSvg(blob, maxWidth = 1600) {
  const text = await blob.text();
  const svgBlob = new Blob([text], { type: "image/svg+xml" });
  const url = URL.createObjectURL(svgBlob);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    if (img.decode) await img.decode();
    else await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => reject(new Error("Không đọc được SVG"));
    });

    const width = img.naturalWidth || 1200;
    const height = img.naturalHeight || 675;
    const scale = Math.min(1, maxWidth / width);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const png = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!png) throw new Error("Không chuyển được SVG sang PNG");
    return png;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Tải một ảnh http(s)/data: về bộ nhớ. Trả { arrayBuffer, base64,
 * dataUrl, width, height, mimeType, imageType } — mỗi exporter lấy phần
 * mình cần (docx cần arrayBuffer + kích thước; pptxgenjs cần dataUrl).
 * Ném lỗi khi tải/giải mã thất bại — exporter tự bắt và ghi cảnh báo.
 */
export async function loadImage(src) {
  const res = await fetch(src);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  let blob = await res.blob();
  const isSvg = blob.type.includes("svg") || /\.svg(?:[?#]|$)/i.test(String(src))
    || String(src).startsWith("data:image/svg+xml");
  if (isSvg) blob = await rasterizeSvg(blob);

  let size;
  try {
    const bitmap = await createImageBitmap(blob);
    size = { width: bitmap.width, height: bitmap.height };
  } catch {
    size = await imageSize(blob);
  }

  const arrayBuffer = await blob.arrayBuffer();
  const mimeType = blob.type || "image/png";
  const imageType = mimeType.includes("png") ? "png"
    : mimeType.includes("gif") ? "gif"
      : mimeType.includes("bmp") ? "bmp" : "jpg";
  const base64 = arrayBufferToBase64(arrayBuffer);
  return {
    arrayBuffer,
    base64,
    dataUrl: `data:${mimeType};base64,${base64}`,
    width: size.width,
    height: size.height,
    mimeType,
    imageType,
  };
}

/** Kích thước đặt ảnh: giữ tỷ lệ, không vượt quá hộp (maxW × maxH). */
export function fitSize(width, height, maxW, maxH) {
  if (!width || !height) return { width: maxW, height: maxH };
  const scale = Math.min(1, maxW / width, maxH / height);
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}

/** Tải Blob xuống máy người dùng bằng thẻ <a download> tạm thời. */
export function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
