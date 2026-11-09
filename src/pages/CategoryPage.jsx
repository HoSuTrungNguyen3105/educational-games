import { useEffect, useMemo, useState } from "react";
import {
  BookOpen, Brain, Calculator, CarFront, CaseSensitive, ChevronLeft,
  FlaskConical, Globe, GraduationCap, Hash, HeartHandshake, Landmark,
  Languages, Laptop, Leaf, Lightbulb, Map as MapIcon, Music, Palette, PawPrint,
  PencilLine, Plus, Puzzle, RefreshCw, Rocket, Ruler, Search, Shapes,
  Sparkles, Star, UtensilsCrossed, X,
} from "lucide-react";
import { gameService } from "../services/api.js";
import { setupService } from "../services/setupService.js";
import { lessonService } from "../services/lessonService.js";
import { useTemplates } from "../lib/hooks.js";
import { navigate } from "../lib/router.js";
import { gameThumbnail } from "../lib/gameThumbnail.js";
import { hashString, metaForSubject, subjectLabel, tintFor, topicBaseName } from "../lib/subjectMeta.js";
import GqGameCard from "../components/GqGameCard.jsx";
import { EmptyState, ErrorState, Loader } from "../components/ui";
import "./home-gq.css";
import "./category-gq.css";

/* ════════════════════════════════════════════════════════════════════
   TRANG DANH MỤC BÀI HỌC & TRÒ CHƠI — route /categories (2026-11-09).
   Thay cho việc khám phá theo môn bằng thanh tab cuộn ngang trên trang
   chủ (đã bỏ): cột trái chọn MÔN → lưới CHỦ ĐỀ bên phải → mở chủ đề xem
   danh sách TRÒ CHƠI thuộc chủ đề đó, bấm game chơi ngay (onSelectGame
   dùng chung luồng với trang chủ).

   NGUỒN DỮ LIỆU (toàn bộ là dữ liệu THẬT, không bịa):
   - Môn học: API /subjects (setupService — chính danh sách admin quản
     lý ở dashboard Môn học), hợp nhất với các môn thật đang có trên
     game đã xuất bản (đề phòng game gắn môn chưa có trong danh sách).
   - Chủ đề: trường `topic` trên từng game. Hai biến thể solo / đối
     kháng của cùng một game chỉ khác nhau ở hậu tố "· Đối kháng"
     trong topic (khớp 1-1 với playMode "classroom") → gộp về một chủ
     đề, số lượng đếm cả hai biến thể. Game chưa điền topic rơi vào
     nhóm "Chưa phân chủ đề" — nhãn mô tả đúng tình trạng dữ liệu.
   - Bài học: bài đã xuất bản có `subject` nhưng KHÔNG có `topic` nên
     chỉ nối được ở tầng môn: banner đếm số bài học thật của môn đang
     chọn, bấm vào sang trang /lessons. Không trộn bài học vào thẻ
     chủ đề để khỏi gán chủ đề giả cho bài học.
   - Độ tuổi: game/template KHÔNG có trường tuổi (pill tuổi trên thẻ
     game là nhãn gợi ý cố định theo môn) → không làm bộ lọc tuổi.
   ════════════════════════════════════════════════════════════════════ */

const ALL_SUBJECTS = "Tất cả";
const NO_TOPIC_LABEL = "Chưa phân chủ đề";

const slugify = (s = "") =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d");

/* Icon cho thẻ chủ đề: khớp từ khoá trong tên chủ đề; không khớp thì
   lấy icon của môn; môn lạ nữa thì bốc từ bộ icon thân thiện theo băm
   tên (ổn định giữa các lần render). Icon chỉ là minh hoạ trang trí. */
const TOPIC_ICON_RULES = [
  { keys: ["bang nhan", "phep nhan", "nhan chia"], icon: X },
  { keys: ["so hoc", "dem so", "con so", "tim so", "find the number"], icon: Hash },
  { keys: ["hinh hoc", "hinh dang", "xep hinh", "block", "puzzle"], icon: Shapes },
  { keys: ["phep tinh", "phep cong", "phep tru", "cong tru", "tinh nham", "maths racing"], icon: Plus },
  { keys: ["do luong", "do dai", "can nang"], icon: Ruler },
  { keys: ["giai toan", "tu duy", "logic"], icon: Brain },
  { keys: ["luyen tap"], icon: PencilLine },
  { keys: ["on tap"], icon: RefreshCw },
  { keys: ["tu vung", "vocabulary", "family"], icon: Languages },
  { keys: ["bang chu cai", "chu cai"], icon: CaseSensitive },
  { keys: ["giao thong"], icon: CarFront },
  { keys: ["trieu dai"], icon: Landmark },
  { keys: ["vung mien", "ban do"], icon: MapIcon }, // MapIcon = lucide "Map" (alias để khỏi đè global Map)
  { keys: ["vu tru", "khong gian", "hanh tinh"], icon: Rocket },
  { keys: ["dong vat"], icon: PawPrint },
  { keys: ["moi truong", "thien nhien", "cay"], icon: Leaf },
  { keys: ["an gi", "am thuc", "mon an", "nau an"], icon: UtensilsCrossed },
  { keys: ["trung thu", "le hoi", "tet"], icon: Sparkles },
  { keys: ["kien thuc chung", "tong hop"], icon: Lightbulb },
];

const SUBJECT_ICONS = [
  { keys: ["toan", "math"], icon: Calculator },
  { keys: ["tieng viet", "ngu van"], icon: BookOpen },
  { keys: ["tieng anh", "english"], icon: Languages },
  { keys: ["khoa hoc", "science"], icon: FlaskConical },
  { keys: ["lich su"], icon: Landmark },
  { keys: ["dia ly", "dia li"], icon: Globe },
  { keys: ["tin hoc", "lap trinh"], icon: Laptop },
  { keys: ["ky nang song"], icon: HeartHandshake },
  { keys: ["nghe thuat", "my thuat"], icon: Palette },
  { keys: ["am nhac"], icon: Music },
  { keys: ["tong hop"], icon: Shapes },
];
const FALLBACK_ICONS = [Shapes, Puzzle, Star, Rocket, Palette, Music, GraduationCap];

function topicIcon(topicName, subject) {
  const t = slugify(topicName);
  const hit = TOPIC_ICON_RULES.find((r) => r.keys.some((k) => t.includes(k)));
  if (hit) return hit.icon;
  const s = slugify(subject);
  const bySubject = SUBJECT_ICONS.find((r) => r.keys.some((k) => s.includes(k)));
  if (bySubject) return bySubject.icon;
  return FALLBACK_ICONS[hashString(topicName || subject) % FALLBACK_ICONS.length];
}

/** Gom game đã xuất bản thành cây môn → chủ đề. */
function buildCatalog(games, apiSubjects) {
  const bySubject = new Map(); // subject -> Map(topicKey -> topic)
  for (const g of games || []) {
    const subject = subjectLabel(g.subject);
    if (!bySubject.has(subject)) bySubject.set(subject, new Map());
    const topics = bySubject.get(subject);
    const base = topicBaseName(g.topic);
    const key = base ? base.toLowerCase() : "__none__";
    if (!topics.has(key)) {
      topics.set(key, {
        key: `${subject}::${key}`,
        subject,
        name: base || NO_TOPIC_LABEL,
        hasTopic: !!base,
        games: [],
      });
    }
    topics.get(key).games.push(g);
  }

  // Thứ tự môn: "Tất cả" ghim đầu; tiếp theo thứ tự API /subjects;
  // môn chỉ có trên game (chưa có trong danh sách API) xếp cuối theo
  // số game giảm dần. Môn có trong API nhưng chưa có game vẫn hiện
  // (kèm trạng thái rỗng trung thực khi chọn).
  const apiNames = (apiSubjects || []).map((s) => (typeof s === "string" ? s : s?.name)).filter(Boolean);
  const gameSubjects = [...bySubject.entries()]
    .sort((a, b) => b[1].size - a[1].size || [...b[1].values()].reduce((n, t) => n + t.games.length, 0) - [...a[1].values()].reduce((n, t) => n + t.games.length, 0));
  const ordered = [];
  for (const name of apiNames) if (!ordered.includes(name)) ordered.push(name);
  for (const [name] of gameSubjects) if (!ordered.includes(name)) ordered.push(name);

  const sortTopics = (topics) =>
    [...topics.values()].sort((a, b) => b.games.length - a.games.length || a.name.localeCompare(b.name, "vi"));

  return { bySubject, subjects: ordered, sortTopics };
}

export default function CategoryPage({ onSelectGame, userAuth }) {
  const [games, setGames] = useState(null);
  const [apiSubjects, setApiSubjects] = useState([]);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [subject, setSubject] = useState(ALL_SUBJECTS);
  const [query, setQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState(null); // topic object | null
  const [lessonsBySubject, setLessonsBySubject] = useState(null); // Map | null
  const templates = useTemplates();

  useEffect(() => {
    let alive = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGames(null);
    setError(null);
    (async () => {
      try {
        const [list, subjects] = await Promise.all([
          gameService.list({ status: "published" }),
          setupService.listSubjects(),
        ]);
        if (!alive) return;
        setGames(Array.isArray(list) ? list : []);
        setApiSubjects(Array.isArray(subjects) ? subjects : []);
      } catch (e) {
        if (alive) setError(e?.message || "Không tải được danh mục");
      }
    })();
    return () => { alive = false; };
  }, [reloadKey]);

  // Bài học đã xuất bản (chỉ khi đã đăng nhập — API yêu cầu đăng nhập).
  // Lỗi/khách thì im lặng không hiện banner, không chặn trang.
  useEffect(() => {
    // Chưa đăng nhập: giữ lessonsBySubject = null (banner ẩn), không gọi API.
    if (!userAuth?.user) return undefined;
    let alive = true;
    (async () => {
      try {
        const res = await lessonService.listPublished({ perPage: 100 });
        if (!alive) return;
        const items = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        const map = new Map();
        for (const l of items) {
          const s = subjectLabel(l.subject);
          map.set(s, (map.get(s) || 0) + 1);
        }
        setLessonsBySubject(map);
      } catch { if (alive) setLessonsBySubject(null); }
    })();
    return () => { alive = false; };
  }, [userAuth?.user]);

  const catalog = useMemo(() => buildCatalog(games || [], apiSubjects), [games, apiSubjects]);

  const railSubjects = useMemo(() => [ALL_SUBJECTS, ...catalog.subjects], [catalog]);

  const topicsForView = useMemo(() => {
    if (!games) return [];
    let topics;
    if (subject === ALL_SUBJECTS) {
      topics = [...catalog.bySubject.values()].flatMap((m) => catalog.sortTopics(m));
      topics.sort((a, b) => b.games.length - a.games.length || a.name.localeCompare(b.name, "vi"));
    } else {
      topics = catalog.bySubject.has(subject) ? catalog.sortTopics(catalog.bySubject.get(subject)) : [];
    }
    const q = query.trim().toLowerCase();
    if (!q) return topics;
    return topics.filter((t) =>
      t.name.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      t.games.some((g) => (g.name || "").toLowerCase().includes(q))
    );
  }, [games, catalog, subject, query]);

  const gamesForTopic = useMemo(() => {
    if (!activeTopic) return [];
    const q = query.trim().toLowerCase();
    const list = [...activeTopic.games].sort((a, b) => (a.name || "").localeCompare(b.name || "", "vi"));
    return q ? list.filter((g) => (g.name || "").toLowerCase().includes(q)) : list;
  }, [activeTopic, query]);

  const lessonCount = useMemo(() => {
    if (!lessonsBySubject) return 0;
    if (subject === ALL_SUBJECTS) return [...lessonsBySubject.values()].reduce((n, c) => n + c, 0);
    return lessonsBySubject.get(subject) || 0;
  }, [lessonsBySubject, subject]);

  const pickSubject = (name) => {
    setSubject(name);
    setActiveTopic(null);
  };

  const templateOf = (game) =>
    templates.find((x) => x._id === (typeof game.templateId === "string" ? game.templateId : game.templateId?.$oid));

  return (
    <div className="gq-home cat-page">
      <div className="cat-wrap">
        <header className="cat-head">
          <h1 className="cat-title">Khám phá danh mục 📚</h1>
          <p className="cat-sub">Chọn môn học mà bé yêu thích nhé!</p>
        </header>

        <label className="cat-search">
          <Search className="w-5 h-5" aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={activeTopic ? "Tìm trò chơi trong chủ đề..." : "Tìm môn học, chủ đề..."}
            aria-label="Tìm kiếm trong danh mục"
          />
          {query && (
            <button type="button" className="cat-search__x" onClick={() => setQuery("")} aria-label="Xoá tìm kiếm">
              <X className="w-4 h-4" />
            </button>
          )}
        </label>

        {error ? (
          <ErrorState title="Không tải được danh mục" subtitle={error} onRetry={() => setReloadKey((k) => k + 1)} />
        ) : games === null ? (
          <Loader label="Đang tải danh mục..." />
        ) : activeTopic ? (
          /* ─────────── MÀN CON: TRÒ CHƠI CỦA MỘT CHỦ ĐỀ ─────────── */
          <section aria-label={`Trò chơi chủ đề ${activeTopic.name}`}>
            <button type="button" className="cat-back" onClick={() => setActiveTopic(null)}>
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
              <span>Chủ đề</span>
            </button>
            <h2 className="cat-topic-title">{activeTopic.name}</h2>
            <p className="cat-topic-sub">
              {activeTopic.subject} · {activeTopic.games.length} trò chơi
            </p>
            {gamesForTopic.length === 0 ? (
              <EmptyState
                icon={<Search className="w-10 h-10 text-gray-400" />}
                title="Không tìm thấy trò chơi nào"
                subtitle="Thử từ khoá khác nhé!"
              />
            ) : (
              <div className="gq-grid cat-games">
                {gamesForTopic.map((game, i) => {
                  const t = templateOf(game);
                  const meta = metaForSubject(subjectLabel(game.subject));
                  return (
                    <GqGameCard
                      key={game._id || game.id || i}
                      name={game.name}
                      icon={t?.icon}
                      thumb={t?.thumbnail || gameThumbnail(t?.slug || t?.id || t?._id, game.name)}
                      tint={tintFor(game.name || String(i))}
                      badge={meta.kind === "learn" ? "Học" : "Chơi"}
                      age={meta.age}
                      play={() => onSelectGame(game)}
                    />
                  );
                })}
              </div>
            )}
          </section>
        ) : (
          /* ─────────── MÀN CHÍNH: MÔN (trái) + CHỦ ĐỀ (phải) ─────────── */
          <div className="cat-layout">
            <nav className="cat-rail" aria-label="Môn học">
              {railSubjects.map((name) => (
                <button
                  key={name}
                  type="button"
                  className={`cat-rail__item${subject === name ? " cat-rail__item--on" : ""}`}
                  onClick={() => pickSubject(name)}
                  aria-current={subject === name ? "true" : undefined}
                >
                  {name}
                </button>
              ))}
            </nav>

            <section className="cat-main" aria-label="Chủ đề">
              <h2 className="cat-main__title">{subject}</h2>

              {lessonCount > 0 && (
                <button type="button" className="cat-lessons" onClick={() => navigate("/lessons")}>
                  <span className="cat-lessons__ico" aria-hidden="true"><BookOpen className="w-5 h-5" /></span>
                  <span className="cat-lessons__txt">
                    Có {lessonCount} bài học {subject === ALL_SUBJECTS ? "đã xuất bản" : `môn ${subject}`}
                  </span>
                  <span className="cat-lessons__go">Xem bài học →</span>
                </button>
              )}

              {topicsForView.length === 0 ? (
                <EmptyState
                  icon={<BookOpen className="w-10 h-10 text-gray-400" />}
                  title={query ? "Không tìm thấy chủ đề nào" : "Chưa có trò chơi nào"}
                  subtitle={query ? "Thử từ khoá khác hoặc chọn môn khác nhé!" : "Thầy cô thêm game vào nhé!"}
                />
              ) : (
                <div className="cat-grid">
                  {topicsForView.map((t) => {
                    const Icon = topicIcon(t.name, t.subject);
                    return (
                      <button
                        key={t.key}
                        type="button"
                        className="cat-topic"
                        onClick={() => setActiveTopic(t)}
                        aria-label={`Xem trò chơi chủ đề ${t.name}`}
                      >
                        <span className="cat-topic__ring" style={{ backgroundColor: tintFor(`${t.subject}-${t.name}`) }} aria-hidden="true">
                          <Icon className="w-7 h-7" />
                        </span>
                        <span className="cat-topic__name">{t.name}</span>
                        <span className="cat-topic__count">
                          {t.games.length} trò chơi{subject === ALL_SUBJECTS ? ` · ${t.subject}` : ""}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
