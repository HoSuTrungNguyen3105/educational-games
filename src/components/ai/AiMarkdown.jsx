// components/ai/AiMarkdown.jsx
//
// Render Markdown AN TOÀN cho nội dung AI trả về — component DÙNG CHUNG cho
// các bề mặt AI (hiện dùng trong AiChatWidget; AiExplainSheet có thể dùng lại).
//
// An toàn: react-markdown KHÔNG render HTML thô trong nội dung (không dùng
// rehype-raw) nên câu trả lời của model — hay nội dung người dùng trích lại —
// không thể chèn thẻ/script vào trang. Bộ lọc URL mặc định của react-markdown
// cũng chặn các scheme nguy hiểm (javascript:, data:...). Link bị ép mở tab
// mới với rel an toàn.
//
// Style bám Tailwind sẵn có của app (bong bóng chat), không thêm CSS global.

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const components = {
  p: ({ children }) => <p className="my-1 first:mt-0 last:mb-0 leading-relaxed">{children}</p>,
  ul: ({ children }) => <ul className="my-1 list-disc pl-5 space-y-0.5">{children}</ul>,
  ol: ({ children }) => <ol className="my-1 list-decimal pl-5 space-y-0.5">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  h1: ({ children }) => <p className="mt-2 mb-1 first:mt-0 font-display text-base font-bold">{children}</p>,
  h2: ({ children }) => <p className="mt-2 mb-1 first:mt-0 font-display text-[15px] font-bold">{children}</p>,
  h3: ({ children }) => <p className="mt-2 mb-1 first:mt-0 font-display text-sm font-bold">{children}</p>,
  h4: ({ children }) => <p className="mt-2 mb-1 first:mt-0 font-display text-sm font-bold">{children}</p>,
  blockquote: ({ children }) => (
    <blockquote className="my-1.5 border-l-2 border-ink/20 pl-2.5 text-ink/80">{children}</blockquote>
  ),
  hr: () => <hr className="my-2 border-ink/10" />,
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noreferrer noopener" className="underline decoration-ink/40 underline-offset-2 break-all">
      {children}
    </a>
  ),
  pre: ({ children }) => (
    <pre className="my-1.5 overflow-x-auto rounded-lg bg-ink/5 p-2 font-mono text-[12px] leading-relaxed">{children}</pre>
  ),
  code: ({ children }) => (
    <code className="rounded bg-ink/5 px-1 py-0.5 font-mono text-[0.85em]">{children}</code>
  ),
  table: ({ children }) => (
    <div className="my-1.5 overflow-x-auto">
      <table className="w-full border-collapse text-[13px]">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="border border-ink/15 bg-ink/5 px-1.5 py-1 text-left font-semibold">{children}</th>,
  td: ({ children }) => <td className="border border-ink/15 px-1.5 py-1">{children}</td>,
};

export default function AiMarkdown({ children }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {String(children ?? "")}
    </ReactMarkdown>
  );
}
