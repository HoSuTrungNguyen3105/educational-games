// AudioPlayer.jsx — trình phát âm thanh cho bài Listening / câu hỏi có audio.
//
// TRUNG THỰC với dữ liệu (spec §6.4, §16):
//   · audioUrl khác null → phát file thật bằng <audio>.
//   · audioUrl = null    → KHÔNG bịa đường dẫn; hiện trạng thái
//     "Nội dung âm thanh chưa được cung cấp" và (nếu trình duyệt hỗ trợ)
//     đọc bằng GIỌNG ĐỌC MÁY (speechSynthesis) — ghi rõ là TTS, không phải
//     bản thu thật.
//
// "Đang phát" được lưu kèm khóa nội dung (`tts.key`) nên khi đổi câu, trạng
// thái tự về "dừng" mà không cần setState trong effect (luật react-hooks).
import { useEffect, useRef, useState } from "react";
import { Play, Pause, Square, Volume2, AudioLines, AlertTriangle } from "lucide-react";

const RATES = [
  { value: 0.75, label: "0,75×" },
  { value: 1, label: "1×" },
  { value: 1.25, label: "1,25×" },
  { value: 1.5, label: "1,5×" },
];

function supportsTTS() {
  return typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

/**
 * @param {object} props
 * @param {string} [props.text]        nội dung đọc (TTS) — câu hỏi/bản ghi
 * @param {string|null} [props.audioUrl] file audio thật (null = chưa có)
 * @param {"missing"|"ready"|string} [props.audioStatus]
 * @param {string} [props.label]       nhãn phụ (vd: "Câu 1 · Part 2")
 * @param {number} [props.rate]        tốc độ ban đầu
 * @param {(rate:number)=>void} [props.onRateChange]
 * @param {boolean} [props.autoHideStatus]  ẩn chip trạng thái (khi trang tự hiện)
 * @param {() => void} [props.onPlay]    gọi khi BẮT ĐẦU một lượt phát mới
 *        (trang thi dùng để đếm lượt nghe — phát lại sau tạm dừng không tính)
 * @param {() => void} [props.onEnded]   gọi khi một lượt phát kết thúc
 * @param {boolean} [props.playDisabled] cấm bắt đầu lượt phát mới (đã hết
 *        lượt nghe ở chế độ thi) — tạm dừng/tiếp tục lượt đang phát vẫn được
 */
export default function AudioPlayer({
  text, audioUrl = null, audioStatus = "missing", label, rate = 1, onRateChange, autoHideStatus = false,
  onPlay, onEnded, playDisabled = false,
}) {
  const [tts, setTts] = useState({ key: null, playing: false, paused: false });
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [rateState, setRateState] = useState(rate);
  const [ttsError, setTtsError] = useState("");
  const utterRef = useRef(null);
  const audioRef = useRef(null);

  const canTTS = supportsTTS();
  const hasRealAudio = !!audioUrl;
  const playing = hasRealAudio ? audioPlaying : tts.key === text && tts.playing;
  const paused = tts.key === text && tts.paused;

  // Dừng khi rời trang (hành động hệ thống ngoài React — không setState ở đây).
  useEffect(() => {
    const el = audioRef.current;
    return () => {
      try {
        if (hasRealAudio) el?.pause();
        else window.speechSynthesis?.cancel();
      } catch { /* trình duyệt có thể ném khi đóng tab */ }
    };
  }, [hasRealAudio]);

  // Đổi nội dung → hủy lời đọc cũ (trạng thái tự về "dừng" nhờ tts.key).
  useEffect(() => {
    try { window.speechSynthesis?.cancel(); } catch { /* ignore */ }
  }, [text, audioUrl]);

  const speak = (v, silent = false) => {
    if (!text || !canTTS) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      u.rate = v;
      u.volume = volume;
      u.onend = () => { setTts((p) => ({ ...p, playing: false, paused: false })); onEnded?.(); };
      u.onerror = () => {
        setTts((p) => ({ ...p, playing: false, paused: false }));
        setTtsError("Không đọc được giọng máy trên trình duyệt này.");
        onEnded?.();
      };
      utterRef.current = u;
      window.speechSynthesis.speak(u);
      setTts({ key: text, playing: true, paused: false });
      setTtsError("");
      if (!silent) onPlay?.();
    } catch {
      setTtsError("Trình duyệt không hỗ trợ đọc giọng máy.");
    }
  };

  const toggleTTS = () => {
    if (!canTTS || !text) return;
    if (!playing) { speak(rateState); return; }
    try {
      if (paused) {
        window.speechSynthesis.resume();
        setTts((p) => ({ ...p, paused: false }));
      } else {
        window.speechSynthesis.pause();
        setTts((p) => ({ ...p, paused: true }));
      }
    } catch { /* ignore */ }
  };

  const stopTTS = () => {
    try { window.speechSynthesis.cancel(); } catch { /* ignore */ }
    setTts({ key: null, playing: false, paused: false });
  };

  const changeRate = (value) => {
    const v = Number(value);
    setRateState(v);
    onRateChange?.(v);
    // Đang phát thì đọc lại với tốc độ mới (TTS không đổi rate giữa chừng).
    // Đọc lại vì đổi tốc độ KHÔNG tính là một lượt nghe mới (silent).
    if (playing && !hasRealAudio) speak(v, true);
  };

  const missingStatus = !hasRealAudio && audioStatus === "missing";

  return (
    <div className="rounded-xl border border-ink/10 bg-paper2 p-3">
      {label && (
        <p className="text-[11px] font-mono uppercase text-[#8A7C63] mb-2">{label}</p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {/* Phát file thật */}
        {hasRealAudio && (
          <audio
            ref={audioRef}
            src={audioUrl}
            controls
            className="w-full max-w-full"
            onPlay={() => { setAudioPlaying(true); onPlay?.(); }}
            onPause={() => setAudioPlaying(false)}
            onEnded={() => { setAudioPlaying(false); onEnded?.(); }}
          />
        )}

        {/* TTS / nút phát */}
        {!hasRealAudio && text && (
          <>
            <button
              type="button"
              onClick={toggleTTS}
              disabled={!canTTS || (!playing && playDisabled)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-ink text-paper text-sm font-body font-semibold disabled:opacity-50"
              title={playDisabled && !playing ? "Đã hết lượt nghe" : canTTS ? "Đọc bằng giọng máy (TTS)" : "Trình duyệt không hỗ trợ"}
            >
              {playing && !paused ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {playing && !paused ? "Tạm dừng" : paused ? "Tiếp tục" : "Phát"}
            </button>
            <button
              type="button"
              onClick={stopTTS}
              disabled={!playing}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-ink/15 text-sm font-body text-ink disabled:opacity-50"
              title="Dừng"
            >
              <Square className="w-4 h-4" />
              Dừng
            </button>

            <label className="inline-flex items-center gap-1.5 text-xs font-body text-[#8A7C63]">
              Tốc độ
              <select
                value={rateState}
                onChange={(e) => changeRate(e.target.value)}
                className="rounded-lg border border-ink/15 bg-paper px-2 py-1.5 text-xs font-mono text-ink focus:outline-none focus:ring-2 focus:ring-teal/40"
                aria-label="Tốc độ phát"
              >
                {RATES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </label>

            <label className="inline-flex items-center gap-1.5 text-xs font-body text-[#8A7C63]">
              <Volume2 className="w-3.5 h-3.5" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-20 accent-[#1B998B]"
                aria-label="Âm lượng"
              />
            </label>
          </>
        )}
      </div>

      {/* Trạng thái dữ liệu — bắt buộc hiển thị khi chưa có audio gốc */}
      {!autoHideStatus && missingStatus && (
        <p className="mt-2 inline-flex items-start gap-1.5 text-[11px] font-body text-[#8A7C63]">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gold" />
          <span>
            Nội dung âm thanh chưa được cung cấp — đang đọc bằng <b>giọng đọc máy (TTS)</b>,
            không phải bản thu thật.
          </span>
        </p>
      )}
      {!text && !hasRealAudio && (
        <p className="mt-2 inline-flex items-start gap-1.5 text-[11px] font-body text-[#8A7C63]">
          <AudioLines className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>Chưa có nội dung âm thanh cho mục này.</span>
        </p>
      )}
      {ttsError && (
        <p className="mt-2 text-[11px] font-body text-ticket">{ttsError}</p>
      )}
      {!canTTS && text && !ttsError && (
        <p className="mt-2 text-[11px] font-body text-[#8A7C63]">
          Trình duyệt này không hỗ trợ đọc giọng máy — hãy đọc transcript bên dưới.
        </p>
      )}
    </div>
  );
}
