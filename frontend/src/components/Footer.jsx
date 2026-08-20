const stack = ['React', 'Vite', 'Node.js', 'Express', 'DeepSeek', 'Docker'];

export default function Footer() {
  return (
    <footer className="border-t-[3px] border-ink bg-brut-lime py-10">
      <div className="mx-auto max-w-6xl px-5 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {stack.map((s) => (
            <span
              key={s}
              className="border-[3px] border-ink bg-white px-3 py-1 font-mono text-xs font-bold uppercase shadow-hard-sm"
            >
              {s}
            </span>
          ))}
        </div>
        <p className="mt-6 font-display text-sm font-extrabold uppercase">
          AI-Powered YouTube Video Summarizer — Student Mini-Project
        </p>
        <p className="mt-1 font-mono text-xs text-ink/70">
          Summaries are AI-generated from video captions and may contain mistakes.
        </p>
      </div>
    </footer>
  );
}
