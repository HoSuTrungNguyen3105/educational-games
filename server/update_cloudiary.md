Cách phù hợp nhất với hệ thống của anh khi cập nhật ảnh ở items

Backend hiện tại anh đang có:



function uploadToCloudinary(fileBuffer, folder = "avatar-items") {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image", format: "png" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
}

Nếu muốn thay ảnh nhưng giữ nguyên URL/public ID, sửa thành:



function replaceCloudinaryImage(fileBuffer, publicId) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        resource_type: "image",
        format: "png",
        overwrite: true,
        invalidate: true
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
}

Ví dụ Public ID của ảnh:



avatar-items/vcy0ywf82c91naunxipq

thì upload ảnh mới với:



replaceCloudinaryImage(
  fileBuffer,
  "avatar-items/vcy0ywf82c91naunxipq"
);

Cloudinary sẽ ghi đè ảnh cũ bằng ảnh mới. invalidate: true giúp xóa bản cache cũ trên CDN; việc cập nhật cache có thể mất từ vài giây đến vài phút. 