// Test tích hợp: PHÂN TRANG phía server cho trang Ngân hàng câu hỏi —
//   GET /question-banks (đã có respondWithRange; đợt này listAll lọc
//     subject/grade/search/bad theo ĐÚNG semantics trang: subjKey quy
//     nhãn→key + rỗng→custom, lớp null tính là lớp 1, bad = luật qIssues)
//   GET /question-banks/sets (đợt này THÊM respondWithRange)
// Nguyên tắc như các đợt range trước: lọc chạy TRƯỚC khi cắt from/to nên
// pagination.total là tổng ĐÃ lọc; không gửi from/to → shape cũ nguyên
// vẹn cho các caller khác (questionPool, trang học sinh /question-sets).
// Chạy app Express THẬT trên Mongo in-memory (mẫu test-pagination-filters):
//   node server/scripts/test-question-bank-pagination.mjs
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
let mongod = null;
if (process.env.TEST_MONGODB_URI) {
  process.env.MONGODB_URI = process.env.TEST_MONGODB_URI;
  process.env.MONGODB_DB = process.env.TEST_MONGODB_DB || `qbank_pagination_test_${process.pid}`;
} else {
  const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, `.test-qbank-pagination-mongo-data-${process.pid}`);
  mkdirSync(dbPath, { recursive: true });
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
  process.env.MONGODB_URI = mongod.getUri();
  process.env.MONGODB_DB = "qbank_pagination_test";
}

const db = await import("../src/db.js");
await db.initDatabase();
const { default: app } = await import("../src/app.js");
const { signToken } = await import("../src/services/authService.js");
const { getCollection } = db;
const { ObjectId } = await import("mongodb");

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const tokAdmin = signToken({ id: "user-qb-admin", username: "qbadmin", role: "admin", name: "QB Admin" });
const tokTeacher = signToken({ id: "user-qb-teacher", username: "qbteacher", role: "teacher", name: "QB Teacher" });

let failed = 0;
const check = (name, actual, expected) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok ? "" : `  → nhận ${JSON.stringify(actual)}, mong đợi ${JSON.stringify(expected)}`}`);
  if (!ok) failed++;
};
const checkTrue = (name, cond, extra = "") => {
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}${cond ? "" : `  → ${extra}`}`);
  if (!cond) failed++;
};

const req = async (p, token) => {
  const res = await fetch(`${base}${p}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return { status: res.status, body: await res.json().catch(() => null) };
};

// ── Seed question_banks: 26 câu ──────────────────────────────────────
// updatedAt tăng dần theo thứ tự seed để thứ tự sort (mới nhất trước)
// xác định: câu seed cuối là câu đầu trang 1.
const ts = (i) => new Date(Date.UTC(2026, 0, 1, 0, i)).toISOString();
let seq = 0;
const mkQ = (over = {}) => {
  seq += 1;
  const n = seq;
  const opts = ["A", "B", "C", "D"].map((c) => ({ id: `ans-qb-${n}-${c}`, content: `Đáp án ${c} câu ${n}` }));
  return {
    _id: new ObjectId(),
    id: `qbank-qb-${n}`,
    content: `Câu hỏi mẫu số ${n}`,
    options: opts,
    correctAnswer: opts[0].id,
    subject: "viet",
    category: "",
    difficulty: "medium",
    grade: 3,
    icon: "",
    explanation: "",
    lang: "vi-VN",
    timeLimit: 15,
    points: 100,
    createdAt: ts(n),
    updatedAt: ts(n),
    ...over,
  };
};
const bankDocs = [
  // 12 câu subject key "viet": 6 lớp 3, 3 lớp 1, 3 chưa phân lớp (null → tính lớp 1)
  ...Array.from({ length: 6 }, () => mkQ({ grade: 3 })),
  ...Array.from({ length: 3 }, () => mkQ({ grade: 1 })),
  ...Array.from({ length: 3 }, () => mkQ({ grade: null })),
  // 3 câu subject lưu bằng NHÃN "Tiếng Việt" — subjKey phải quy về "viet"
  ...Array.from({ length: 3 }, () => mkQ({ subject: "Tiếng Việt", grade: 3 })),
  // 5 câu eng lớp 2; câu đầu có đáp án chứa "apple" để test search theo đáp án
  mkQ({
    subject: "eng", grade: 2, content: "Which fruit is red?",
    options: [
      { id: "ans-qb-apple", content: "apple" },
      { id: "ans-qb-banana", content: "banana" },
      { id: "ans-qb-grape", content: "grape" },
      { id: "ans-qb-pear", content: "pear" },
    ],
    correctAnswer: "ans-qb-apple",
  }),
  ...Array.from({ length: 4 }, () => mkQ({ subject: "eng", grade: 2 })),
  // 2 câu subject rỗng → custom, lớp 5
  ...Array.from({ length: 2 }, () => mkQ({ subject: "", grade: 5 })),
  // 1 câu môn tự do
  mkQ({ subject: "kham-pha", grade: 4 }),
  // 1 câu nội dung đặc biệt để test search theo nội dung
  mkQ({ content: "Tính phép trừ 45 - 27 bằng bao nhiêu?", grade: 3 }),
  // 2 câu LỖI: đáp án trùng nhau (viet lớp 3) + đáp án đúng không tồn tại (eng lớp 2)
  mkQ({
    content: "Câu lỗi đáp án trùng",
    options: [
      { id: "ans-qb-dup-1", content: "trùng" },
      { id: "ans-qb-dup-2", content: "Trùng" },
      { id: "ans-qb-dup-3", content: "khác" },
    ],
    correctAnswer: "ans-qb-dup-1",
  }),
  mkQ({
    subject: "eng", grade: 2, content: "Câu lỗi đáp án đúng không tồn tại",
    options: [
      { id: "ans-qb-bad-1", content: "một" },
      { id: "ans-qb-bad-2", content: "hai" },
    ],
    correctAnswer: "ans-khong-ton-tai",
  }),
];
await getCollection("question_banks").insertMany(bankDocs);
const TOTAL_Q = bankDocs.length; // 26

// ── Seed question_sets: 12 bộ (9 viet + 3 eng) ───────────────────────
const setDocs = Array.from({ length: 12 }, (_, i) => ({
  _id: new ObjectId(),
  id: `qset-qb-${i + 1}`,
  name: `Bộ đề mẫu ${i + 1}`,
  subject: i < 9 ? "viet" : "eng",
  grade: 3,
  description: "",
  questionIds: [bankDocs[0].id, bankDocs[1].id],
  ownerId: "user-qb-admin",
  createdAt: ts(100 + i),
  updatedAt: ts(100 + i),
}));
await getCollection("question_sets").insertMany(setDocs);

// ── GET /question-banks: shape cũ khi không có from/to ──────────────
{
  const r = await req("/api/question-banks");
  check("bank không params: status 200", r.status, 200);
  check("bank không params: trả đủ 26 câu (shape cũ)", r.body?.data?.length, TOTAL_Q);
}

// ── GET /question-banks: cắt đoạn + total ────────────────────────────
{
  const r1 = await req("/api/question-banks?from=1&to=10");
  check("bank from=1&to=10: 10 câu", r1.body?.data?.length, 10);
  check("bank from=1&to=10: pagination.total = 26", r1.body?.pagination?.total, TOTAL_Q);
  check("bank from=1&to=10: pagination.from/to", [r1.body?.pagination?.from, r1.body?.pagination?.to], [1, 10]);
  check("bank trang 1: câu mới nhất (seed cuối) đứng đầu", r1.body?.data?.[0]?.id, bankDocs[TOTAL_Q - 1].id);
  const r2 = await req("/api/question-banks?from=21&to=30");
  check("bank from=21&to=30: 6 câu cuối", r2.body?.data?.length, 6);
  check("bank from=21&to=30: total vẫn 26", r2.body?.pagination?.total, TOTAL_Q);
}

// ── Lọc subject theo subjKey: key + nhãn + rỗng ─────────────────────
{
  const viet = await req("/api/question-banks?subject=viet&from=1&to=100");
  check("subject=viet: 17 câu (12 key + 3 nhãn + 1 phép trừ + 1 câu lỗi viet)", viet.body?.pagination?.total, 17);
  checkTrue("subject=viet: mọi câu quy về viet", (viet.body?.data || []).every((d) => ["viet", "Tiếng Việt"].includes(d.subject)));
  const custom = await req("/api/question-banks?subject=custom&from=1&to=100");
  check("subject=custom: 2 câu subject rỗng", custom.body?.pagination?.total, 2);
  const free = await req("/api/question-banks?subject=kham-pha&from=1&to=100");
  check("subject=kham-pha (môn tự do): 1 câu", free.body?.pagination?.total, 1);
}

// ── Lọc grade: null tính là lớp 1 ────────────────────────────────────
{
  const g1 = await req("/api/question-banks?grade=1&from=1&to=100");
  check("grade=1: 6 câu (3 lớp 1 + 3 chưa phân lớp)", g1.body?.pagination?.total, 6);
  const g3 = await req("/api/question-banks?grade=3&from=1&to=100");
  check("grade=3: 11 câu (6 key + 3 nhãn + 1 phép trừ + 1 câu lỗi)", g3.body?.pagination?.total, 11);
}

// ── Search: nội dung + đáp án (không kèm subject như bản cũ phía client) ──
{
  const byContent = await req(`/api/question-banks?search=${encodeURIComponent("phép trừ")}&from=1&to=10`);
  check("search 'phép trừ': 1 câu", byContent.body?.pagination?.total, 1);
  const byOption = await req("/api/question-banks?search=apple&from=1&to=10");
  check("search 'apple' (trong đáp án): 1 câu", byOption.body?.pagination?.total, 1);
}

// ── Lọc bad=1: đúng luật qIssues ─────────────────────────────────────
{
  const bad = await req("/api/question-banks?bad=1&from=1&to=10");
  check("bad=1: đúng 2 câu lỗi", bad.body?.pagination?.total, 2);
  const badViet = await req("/api/question-banks?bad=1&subject=viet&from=1&to=10");
  check("bad=1 + subject=viet: 1 câu", badViet.body?.pagination?.total, 1);
}

// ── Kết hợp lọc + cắt đoạn: total là tổng ĐÃ lọc ─────────────────────
{
  const p1 = await req("/api/question-banks?subject=viet&from=1&to=10");
  check("subject=viet trang 1: 10 câu, total 17", [p1.body?.data?.length, p1.body?.pagination?.total], [10, 17]);
  const p2 = await req("/api/question-banks?subject=viet&from=11&to=20");
  check("subject=viet trang 2: 7 câu, total 17", [p2.body?.data?.length, p2.body?.pagination?.total], [7, 17]);
}

// ── GET /question-banks/sets: shape cũ + phân trang mới ─────────────
{
  const all = await req("/api/question-banks/sets", tokAdmin);
  check("sets không params: status 200", all.status, 200);
  check("sets không params: đủ 12 bộ (shape cũ)", all.body?.data?.length, 12);
  const p1 = await req("/api/question-banks/sets?from=1&to=10", tokAdmin);
  check("sets from=1&to=10: 10 bộ, total 12", [p1.body?.data?.length, p1.body?.pagination?.total], [10, 12]);
  const p2 = await req("/api/question-banks/sets?from=11&to=20", tokTeacher);
  check("sets from=11&to=20 (teacher): 2 bộ, total 12", [p2.body?.data?.length, p2.body?.pagination?.total], [2, 12]);
  const eng = await req("/api/question-banks/sets?subject=eng&from=1&to=10", tokAdmin);
  check("sets subject=eng + range: 3 bộ, total 3", [eng.body?.data?.length, eng.body?.pagination?.total], [3, 3]);
  checkTrue("sets list kèm questionCount", (p1.body?.data || []).every((s) => typeof s.questionCount === "number"));
}

console.log(failed ? `\n${failed} FAIL` : "\nALL PASS");
server.close();
if (mongod) await mongod.stop();
process.exit(failed ? 1 : 0);
