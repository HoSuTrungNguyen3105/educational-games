// Test nhóm cấu hình `appearance` (màu header/sidebar/body của dashboard)
// trong systemConfigService: group phải có trong DEFAULTS + LEAF_PATHS, và
// coerce chỉ nhận "" hoặc hex #RRGGBB — giá trị lạ (tên màu, rgb(), chuỗi
// CSS…) phải bị đưa về "" để frontend gắn thẳng vào CSS var an toàn.
// mergeConfig là hàm thuần nên test KHÔNG cần MongoDB.
//   node server/scripts/test-system-appearance.mjs
import {
  DEFAULTS, CONFIG_LEAF_PATHS, mergeConfig, getConfig,
} from "../src/services/systemConfigService.js";

let passed = 0;
let failed = 0;
function check(name, cond) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}`); }
}

const base = () => JSON.parse(JSON.stringify(DEFAULTS));

console.log("— DEFAULTS / whitelist —");
check("DEFAULTS có group appearance", !!DEFAULTS.appearance);
check("appearance đủ 3 khoá rỗng", DEFAULTS.appearance
  && DEFAULTS.appearance.headerColor === ""
  && DEFAULTS.appearance.sidebarColor === ""
  && DEFAULTS.appearance.bodyColor === "");
for (const p of ["appearance.headerColor", "appearance.sidebarColor", "appearance.bodyColor"]) {
  check(`LEAF_PATHS có ${p}`, CONFIG_LEAF_PATHS.includes(p));
}

console.log("— mergeConfig: giá trị hợp lệ —");
{
  const { next, changed } = mergeConfig(base(), { appearance: { headerColor: "#1D2327" } });
  check("hex chữ hoa giữ nguyên", next.appearance.headerColor === "#1D2327");
  check("changed ghi nhận appearance.headerColor", changed.includes("appearance.headerColor"));
}
{
  const { next } = mergeConfig(base(), { appearance: { sidebarColor: "#aabbcc" } });
  check("hex chữ thường giữ nguyên", next.appearance.sidebarColor === "#aabbcc");
}
{
  const { next, changed } = mergeConfig(base(), { "appearance.bodyColor": "#FFF6E7" });
  check("dạng phẳng 'appearance.bodyColor' ghi được", next.appearance.bodyColor === "#FFF6E7"
    && changed.includes("appearance.bodyColor"));
}
{
  const { next } = mergeConfig(base(), { appearance: { headerColor: "" } });
  check("chuỗi rỗng giữ nguyên (mặc định)", next.appearance.headerColor === "");
}

console.log("— mergeConfig: giá trị lạ → \"\" —");
for (const bad of ["red", "#12345", "#1234567", "#GGGGGG", "rgb(1,2,3)", "url(javascript:alert(1))", "#fff", 123, null, true]) {
  const { next } = mergeConfig(base(), { appearance: { headerColor: bad } });
  check(`loại ${JSON.stringify(bad)}`, next.appearance.headerColor === "");
}
{
  const { ignored } = mergeConfig(base(), { appearance: { footerColor: "#112233" } });
  check("khoá lạ trong appearance bị ignored", ignored.includes("appearance.footerColor"));
}

console.log("— getConfig (không DB → mặc định) —");
{
  const cfg = await getConfig({ fresh: true });
  check("getConfig trả group appearance mặc định", cfg.appearance
    && cfg.appearance.headerColor === ""
    && cfg.appearance.sidebarColor === ""
    && cfg.appearance.bodyColor === "");
}

console.log(`\n${failed === 0 ? "ALL PASS" : "FAIL"} — ${passed} đúng, ${failed} sai`);
process.exit(failed === 0 ? 0 : 1);
