// scratch/check-supabase-mime.mjs — cwd = server/
import { connect, getCollection, close } from "../server/src/db.js";
import { config } from "../server/src/config.js";
import { createClient } from "../server/node_modules/@supabase/supabase-js/dist/index.mjs";

await connect();
const c = createClient(config.supabase.url, config.supabase.key, { auth: { persistSession: false } });
const docs = await getCollection("templates").find({ htmlUrl: { $regex: "supabase" } }).toArray();
const { data: objs } = await c.storage.from(config.supabase.bucket).list("templates", { limit: 1000 });
const byName = new Map((objs || []).map((x) => [x.name, x]));
const bad = [];
for (const d of docs) {
  const name = String(d.htmlUrl).split("/").pop();
  const o = byName.get(name);
  const mime = o?.metadata?.mimeType;
  if (!o || (mime && !mime.startsWith("text/html"))) bad.push({ name: d.name, mime: mime ?? "KHÔNG OBJECT", url: d.htmlUrl });
}
console.log(`htmlUrl trên Supabase: ${docs.length} · sai/thiếu MIME text/html: ${bad.length}`);
for (const b of bad.slice(0, 50)) console.log("  -", b.name, "|", b.mime);
await close();
process.exit(0);
