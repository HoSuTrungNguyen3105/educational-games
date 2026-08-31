import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017",
  dbName: process.env.MONGODB_DB || "educational_games",
  jwtSecret: process.env.JWT_SECRET || "edu-games-dev-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  // Danh sách origin cho phép kết nối Socket.IO (phân tách bằng dấu phẩy).
  // Mặc định bật CORS mọi origin — hạn chế bằng SOCKET_CORS_ORIGINS khi deploy.
  socketCorsOrigins: (process.env.SOCKET_CORS_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),

  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
};
