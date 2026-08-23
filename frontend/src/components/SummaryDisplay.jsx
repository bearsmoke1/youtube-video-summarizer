import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function SummaryDisplay({ summary, type }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard may be blocked */
    }
  }

  function download() {
    const blob = new Blob([summary], { type: 'text/plain;charset=utf-8' });
    const href = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = href;
    a.download = 'summary.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(href);
  }

  return (
    <div className="mt-5 border-t-[3px] border-ink pt-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 font-display text-base font-extrabold uppercase">
          Summary
          <span className="border-[3px] border-ink bg-brut-lime px-2 py-0.5 font-mono text-[10px] font-bold uppercase">
            {type}
          </span>
        </h3>
        <div className="flex gap-2">
          <button onClick={copy} className="btn-brutal bg-white px-3 py-1.5 text-xs">
            {copied ? 'Copied ✓' : 'Copy'}
          </button>
          <button onClick={download} className="btn-brutal bg-white px-3 py-1.5 text-xs">
            Download
          </button>
        </div>
      </div>

      <div className="scroll-thin max-h-[440px] overflow-y-auto border-[3px] border-ink bg-white p-4">
        <div className="prose prose-sm prose-neutral max-w-none prose-headings:font-display prose-headings:uppercase prose-strong:font-bold prose-li:marker:text-ink">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
