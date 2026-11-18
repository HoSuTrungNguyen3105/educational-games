// SpeakingRecorder.jsx — ghi âm bằng MediaRecorder cho phần Speaking.
//
// TRUNG THỰC (README §0.3): trình duyệt không hỗ trợ ghi âm hoặc người dùng
// từ chối quyền mic → hiện trạng thái rõ ràng, KHÔNG giả lập bản ghi.
// Component chỉ lo ghi/phát lại; trang quyết định lưu qua
// progressService.recordSpeakingAttempt (prop `onSave`).
import { useEffect, useRef, useState } from "react";
import { Mic, Square, Save, AlertTriangle, Trash2 } from "lucide-react";
import { GhostButton, PrimaryButton } from "../../components/ui";
import { formatClock } from "../utils/examTimerUtils.js";

function recorderSupported() {
  return (
    typeof window !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof window.MediaRecorder !== "undefined"
  );
}

/**
 * @param {object} props
 * @param {string|null} [props.savedRecording]  dataURL bản ghi đã lưu (phát lại được)
 * @param {(dataUrl: string, durationSec: number) => void} [props.onSave]
 *        gọi khi người học bấm "Lưu" với bản ghi mới; không truyền → chỉ ghi/phát tại chỗ
 * @param {string} [props.saveLabel]
 */
export default function SpeakingRecorder({ savedRecording = null, onSave, saveLabel = "Lưu lượt luyện" }) {
  const supported = recorderSupported();
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [blobUrl, setBlobUrl] = useState(null);
  const [dataUrl, setDataUrl] = useState(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const startedRef = useRef(0);
  const timerRef = useRef(null);
  const urlRef = useRef(null);

  // Dọn dẹp khi rời trang: dừng mic + thu hồi object URL.
  useEffect(() => {
    const stream = streamRef;
    const url = urlRef;
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      try { stream.current?.getTracks().forEach((t) => t.stop()); } catch { /* ignore */ }
      if (url.current) URL.revokeObjectURL(url.current);
    };
  }, []);

  const start = async () => {
    setError("");
    setSaved(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new window.MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        try { stream.getTracks().forEach((t) => t.stop()); } catch { /* ignore */ }
        if (timerRef.current) clearInterval(timerRef.current);
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        if (urlRef.current) URL.revokeObjectURL(urlRef.current);
        const url = URL.createObjectURL(blob);
        urlRef.current = url;
        setBlobUrl(url);
        const reader = new FileReader();
        reader.onload = () => setDataUrl(typeof reader.result === "string" ? reader.result : null);
        reader.readAsDataURL(blob);
      };
      startedRef.current = Date.now();
      setElapsed(0);
      recorder.start();
      setRecording(true);
      timerRef.current = setInterval(() => {
        setElapsed(Math.round((Date.now() - startedRef.current) / 1000));
      }, 500);
    } catch {
      setError("Không truy cập được microphone. Hãy kiểm tra quyền mic của trình duyệt rồi thử lại.");
      setRecording(false);
    }
  };

  const stop = () => {
    try { recorderRef.current?.stop(); } catch { /* ignore */ }
    setRecording(false);
  };

  const discard = () => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
    setBlobUrl(null);
    setDataUrl(null);
    setElapsed(0);
    setSaved(false);
  };

  const handleSave = () => {
    if (!dataUrl || !onSave) return;
    onSave(dataUrl, elapsed);
    setSaved(true);
  };

  if (!supported) {
    return (
      <div className="rounded-xl border border-gold/40 bg-gold/10 p-3 space-y-2">
        <p className="flex items-start gap-2 text-sm font-body text-ink">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-gold" />
          <span>
            <b>Chưa khả dụng:</b> trình duyệt này không hỗ trợ ghi âm (MediaRecorder).
            Bạn vẫn có thể đọc câu hỏi, xem dàn ý và câu trả lời mẫu để tự luyện nói.
          </span>
        </p>
        {savedRecording && (
          <audio controls src={savedRecording} className="w-full max-w-full" aria-label="Bản ghi đã lưu" />
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-ink/10 bg-paper2 p-3 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {!recording ? (
          <button
            type="button"
            onClick={start}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-ticket text-paper text-sm font-body font-semibold"
          >
            <Mic className="w-4 h-4" />
            {blobUrl ? "Ghi lại" : "Bắt đầu ghi âm"}
          </button>
        ) : (
          <button
            type="button"
            onClick={stop}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-ink text-paper text-sm font-body font-semibold"
          >
            <Square className="w-4 h-4" />
            Dừng ghi · {formatClock(elapsed)}
          </button>
        )}
        {recording && (
          <span className="inline-flex items-center gap-1.5 text-xs font-body text-ticket" aria-live="polite">
            <span className="w-2 h-2 rounded-full bg-ticket animate-pulse" />
            Đang ghi… {formatClock(elapsed)}
          </span>
        )}
        {blobUrl && !recording && (
          <>
            <GhostButton onClick={discard}>
              <span className="inline-flex items-center gap-1"><Trash2 className="w-4 h-4" /> Xoá bản ghi</span>
            </GhostButton>
            {onSave && (
              <PrimaryButton onClick={handleSave} disabled={!dataUrl || saved}>
                <span className="inline-flex items-center gap-1.5"><Save className="w-4 h-4" /> {saved ? "Đã lưu" : saveLabel}</span>
              </PrimaryButton>
            )}
          </>
        )}
      </div>

      {blobUrl && !recording && (
        <audio controls src={blobUrl} className="w-full max-w-full" aria-label="Nghe lại bản ghi của bạn" />
      )}
      {!blobUrl && savedRecording && (
        <div>
          <p className="text-[11px] font-mono uppercase text-[#8A7C63] mb-1">Bản ghi đã lưu trước đó</p>
          <audio controls src={savedRecording} className="w-full max-w-full" aria-label="Bản ghi đã lưu" />
        </div>
      )}
      {error && <p className="text-xs font-body text-ticket">{error}</p>}
    </div>
  );
}
