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

/**
 * Tải một ảnh http(s)/data: về bộ nhớ. Trả { arrayBuffer, base64,
 * dataUrl, width, height, mimeType, imageType } — mỗi exporter lấy phần
 * mình cần (docx cần arrayBuffer + kích thước; pptxgenjs cần dataUrl).
 * Ném lỗi khi tải/giải mã thất bại — exporter tự bắt và ghi cảnh báo.
 */
export async function loadImage(src) {
  const res = await fetch(src);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const blob = await res.blob();
  const bitmap = await createImageBitmap(blob);
  const arrayBuffer = await blob.arrayBuffer();
  const mimeType = blob.type || "image/jpeg";
  const imageType = mimeType.includes("png") ? "png"
    : mimeType.includes("gif") ? "gif"
      : mimeType.includes("bmp") ? "bmp" : "jpg";
  const base64 = arrayBufferToBase64(arrayBuffer);
  return {
    arrayBuffer,
    base64,
    dataUrl: `image/${imageType};base64,${base64}`,
    width: bitmap.width,
    height: bitmap.height,
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
