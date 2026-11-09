// docstudio-auth.mjs — chạy với cwd = server/
// Phát token admin thử nghiệm (pattern của scratch/admin-settings-api-test.mjs)
// để mở khu dashboard kiểm thử UI Document Studio. KHÔNG phải tài khoản thật.
import { signToken } from "../server/src/services/authService.js";

const user = {
  id: "zz_docstudio_admin",
  username: "zz_docstudio",
  name: "GV Kiểm Thử",
  role: "admin",
  coins: 0, stars: 0, xp: 0,
};
const token = signToken(user);
console.log(JSON.stringify({ token, user }));