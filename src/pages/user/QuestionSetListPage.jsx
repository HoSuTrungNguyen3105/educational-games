import { useEffect, useMemo, useState } from "react";
import { Layers, Play, Search } from "lucide-react";
import { ErrorState, Loader, PrimaryButton } from "../../components/ui";
import { questionBankService } from "../../services/api.js";
import { subjKey, subjLabel } from "../../lib/questionBankMeta.js";
import { navigate } from "../../lib/router.js";

// Danh sách BỘ ĐỀ LUYỆN TẬP phía học sinh — route /question-sets.
// Mỗi bộ đề (combo đóng gói từ ngân hàng câu hỏi) hiện thành MỘT thẻ: tên,
// môn, lớp, tổng số câu — thay vì liệt kê từng câu rời. Bấm vào thẻ là làm
// cả bộ ở /question-sets/:setId. Bộ trống (0 câu) hiện trung thực là trống
// và không bấm làm bài được.
export default function QuestionSetListPage({ userAuth, onBack }) {
  const [sets, setSets] = useState(null);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");

  useEffect(() => {
    if (!userAuth?.user) return undefined;
    let alive = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSets(null);
    setError("");
    (async () => {
      try {
        const res = await questionBankService.listSets();
        if (!alive) return;
        setSets(Array.isArray(res) ? res : []);
      } catch (e) {
        if (alive) setError(e?.message || "Không tải được danh sách bộ đề");
      }
    })();
    return () => { alive = false; };
  }, [userAuth, reloadKey]);

  const subjects = useMemo(() => {
    const keys = [...new Set((sets || []).map((s) => subjKey(s)).filter(Boolean))];
    return keys.sort((a, b) => subjLabel(a).localeCompare(subjLabel(b)));
  }, [sets]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (sets || []).filter((s) => {
      if (subject && subjKey(s) !== subject) return false;
      if (grade && String(s.grade ?? "") !== grade) return false;
      if (q && !`${s.name} ${subjLabel(subjKey(s))}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [sets, query, subject, grade]);

  if (!userAuth?.user) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="text-center anim-pop">
          <div className="mb-4 flex justify-center text-violet-600"><Layers className="w-14 h-14" /></div>
          <h2 className="font-display text-xl text-ink mb-2">Chưa đăng nhập</h2>
          <p className="text-sm text-[#8A7C63] mb-4">Bạn cần đăng nhập để xem bộ đề luyện tập</p>
          <PrimaryButton onClick={onBack}>← Về trang chủ</PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 px-4 sm:px-6 py-6 sm:py-10 w-full">
      <button onClick={onBack} className="text-sm text-[#8A7C63] hover:text-ink transition inline-flex items-center gap-1 mb-6">
        ← Về trang chủ
      </button>

      <div className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl text-ink flex items-center gap-2">
          <Layers className="w-7 h-7 text-violet-600" /> Bộ đề luyện tập
        </h1>
        <p className="text-sm text-[#8A7C63] mt-1">
          {sets === null ? "Đang tải..." : "Mỗi bộ là một combo nhiều câu hỏi — chọn một bộ và làm hết cả bộ nhé!"}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <label className="flex items-center gap-2 rounded-full border border-[#E7D9BE] bg-white px-3.5 py-2 flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 text-[#8A7C63] shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm bộ đề..."
            className="flex-1 outline-none text-sm bg-transparent text-ink placeholder:text-[#B4A888]"
          />
        </label>
        <select value={subject} onChange={(e) => setSubject(e.target.value)}
          className="rounded-full border border-[#E7D9BE] bg-white px-3.5 py-2 text-sm text-ink outline-none">
          <option value="">Tất cả môn học</option>
          {subjects.map((k) => <option key={k} value={k}>{subjLabel(k)}</option>)}
        </select>
        <select value={grade} onChange={(e) => setGrade(e.target.value)}
          className="rounded-full border border-[#E7D9BE] bg-white px-3.5 py-2 text-sm text-ink outline-none">
          <option value="">Tất cả các lớp</option>
          {[1, 2, 3, 4, 5].map((g) => <option key={g} value={String(g)}>Lớp {g}</option>)}
        </select>
      </div>

      {error ? (
        <ErrorState title="Không tải được bộ đề" subtitle={error} onRetry={() => setReloadKey((k) => k + 1)} />
      ) : sets === null ? (
        <div className="py-16 flex justify-center"><Loader label="Đang tải bộ đề..." /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-14">
          <div className="mb-3 flex justify-center text-[#C9B98F]"><Layers className="w-12 h-12" /></div>
          <p className="text-sm text-[#8A7C63]">
            {sets.length === 0 ? "Chưa có bộ đề nào. Thầy cô sẽ đóng gói bộ đề cho em sớm thôi!" : "Không có bộ đề nào khớp bộ lọc."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => {
            const empty = !s.questionCount;
            return (
              <article key={s.id} className="bg-white rounded-3xl border border-[#EFE6D2] shadow-sm p-5 flex flex-col gap-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 text-[11px] font-semibold">{subjLabel(subjKey(s))}</span>
                  <span className="px-2.5 py-1 rounded-full bg-[#F7F1E1] text-[#7A5B12] text-[11px] font-semibold">{s.grade ? `Lớp ${s.grade}` : "Mọi lớp"}</span>
                  <span className="flex-1" />
                  {empty
                    ? <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-[11px] font-semibold">Bộ trống</span>
                    : <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-[11px] font-bold">{s.questionCount} câu</span>}
                </div>
                <h2 className="font-display text-lg text-ink leading-snug">{s.name}</h2>
                {s.description && <p className="text-sm text-[#8A7C63] leading-snug">{s.description}</p>}
                <div className="mt-auto pt-1">
                  <PrimaryButton disabled={empty} onClick={() => navigate(`/question-sets/${s.id}`)}
                    className="inline-flex items-center gap-1.5">
                    <Play className="w-4 h-4" /> {empty ? "Chưa có câu hỏi" : "Làm cả bộ"}
                  </PrimaryButton>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
