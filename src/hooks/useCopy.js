import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useCopy — copy text vào clipboard, giữ trạng thái "đã copy" trong một lúc rồi tự reset.
 *
 * const [copiedKey, copy] = useCopy();
 * copy("abc123", "class-code");        // copiedKey === "class-code" trong 2s
 * {copiedKey === "class-code" ? "Đã sao chép" : "Sao chép"}
 */
export function useCopy(resetMs = 2000) {
  const [copiedKey, setCopiedKey] = useState(null);
  const timer = useRef(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const copy = useCallback((text, key) => {
    const done = () => {
      setCopiedKey(key !== undefined ? key : true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopiedKey(null), resetMs);
    };
    try {
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(done);
      } else {
        done();
      }
    } catch {
      done();
    }
  }, [resetMs]);

  return [copiedKey, copy];
}
