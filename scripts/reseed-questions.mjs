const API_BASE = "https://educational-games-lp4z.onrender.com/api";

async function login() {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "admin", password: "admin123" }),
  });
  const j = await res.json();
  if (!j.status) throw new Error("Login failed: " + JSON.stringify(j));
  return j.data.token;
}

const THREE_QUESTIONS = [
  {
    id: "question-e2g5lj3",
    content: "1 + 1 bằng bao nhiêu?",
    inputMode: "choice",
    options: [
      { id: "answer-fu0s45m", content: "1" },
      { id: "answer-yu5hhwk", content: "2" },
      { id: "answer-3iq1kfy", content: "3" },
      { id: "answer-c9vd3pr", content: "4" },
    ],
    timeLimit: 20,
    points: 100,
    correctAnswer: "answer-yu5hhwk",
  },
  {
    id: "question-w4zn589",
    content: "Thủ đô của Việt Nam là gì?",
    inputMode: "choice",
    options: [
      { id: "answer-y2o84w8", content: "Hà Nội" },
      { id: "answer-wyyckvd", content: "Huế" },
      { id: "answer-l5u46qs", content: "Đà Nẵng" },
      { id: "answer-jsrmah0", content: "TP.HCM" },
    ],
    timeLimit: 30,
    points: 100,
    correctAnswer: "answer-y2o84w8",
  },
  {
    id: "question-ywuq32z",
    content: "Hành tinh nào được gọi là Hành tinh Đỏ?",
    inputMode: "choice",
    options: [
      { id: "answer-0m0qtub", content: "Trái Đất" },
      { id: "answer-3am7g3x", content: "Sao Kim" },
      { id: "answer-t49yk0p", content: "Sao Hỏa" },
      { id: "answer-0wtbtyz", content: "Sao Mộc" },
    ],
    timeLimit: 30,
    points: 100,
    correctAnswer: "answer-t49yk0p",
  },
];

async function main() {
  const token = await login();
  console.log("[login] ok token", token.slice(0, 20) + "...");
  const H = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  // 1. List games to find target (Happy wheel)
  const gamesRes = await fetch(`${API_BASE}/games`, { headers: H });
  const gamesJson = await gamesRes.json();
  const games = gamesJson.data || [];
  console.log("[games] total", games.length, games.map(g => `${g.name}(${g._id}:${g.code})`).join(", "));

  // Find Happy wheel or fallback to first game
  let target = games.find(g => g.code === "BEFXZ3I") || games.find(g => g.name?.toLowerCase().includes("happy")) || games[0];
  if (!target) throw new Error("No games found");
  console.log("[target] ", target.name, target._id);

  // 2. Reset all questions (DELETE /api/questions)
  console.log("[reset] DELETE /api/questions");
  const delRes = await fetch(`${API_BASE}/questions`, { method: "DELETE", headers: H });
  const delJson = await delRes.json();
  console.log("[reset questions] ", JSON.stringify(delJson));

  // 3. Seed 3 questions into target game via PUT /api/questions/game/:gameId
  console.log(`[seed] PUT /api/questions/game/${target._id} with 3 questions`);
  const putRes = await fetch(`${API_BASE}/questions/game/${target._id}`, {
    method: "PUT",
    headers: H,
    body: JSON.stringify(THREE_QUESTIONS),
  });
  const putJson = await putRes.json();
  console.log("[seed game questions] ", JSON.stringify(putJson).slice(0, 800));

  // 4. Reset question banks
  console.log("[reset] DELETE /api/question-banks");
  const delBankRes = await fetch(`${API_BASE}/question-banks`, { method: "DELETE", headers: H });
  const delBankJson = await delBankRes.json().catch(() => ({}));
  console.log("[reset banks] ", JSON.stringify(delBankJson));

  // 5. Seed question banks via POST each
  for (const q of THREE_QUESTIONS) {
    const bankPayload = {
      id: q.id.replace("question-", "qbank-"),
      content: q.content,
      options: q.options,
      correctAnswer: q.correctAnswer,
      timeLimit: q.timeLimit,
      points: q.points,
      subject: q.content.includes("1 + 1") ? "Toán" : q.content.includes("Thủ đô") ? "Địa lý" : "Khoa học",
      category: "Tổng hợp",
      difficulty: "medium",
      tags: [],
    };
    console.log(`[seed bank] POST ${bankPayload.id}`);
    const r = await fetch(`${API_BASE}/question-banks`, {
      method: "POST",
      headers: H,
      body: JSON.stringify(bankPayload),
    });
    const j = await r.json();
    console.log("[bank result]", JSON.stringify(j).slice(0, 400));
  }

  // 6. Verify
  const verifyQ = await fetch(`${API_BASE}/questions`, { headers: H });
  const vqJson = await verifyQ.json();
  console.log("[verify questions total]", vqJson.data?.length, "pagination", vqJson.pagination);

  const verifyBank = await fetch(`${API_BASE}/question-banks`, { headers: H });
  const vbJson = await verifyBank.json();
  console.log("[verify banks total]", vbJson.data?.length);

  const verifyGameQ = await fetch(`${API_BASE}/questions/game/${target._id}`, { headers: H });
  const vgJson = await verifyGameQ.json();
  console.log("[verify game questions]", JSON.stringify(vgJson).slice(0, 800));
}

main().catch(e => { console.error(e); process.exit(1); });
