export default function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b-[3px] border-ink bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <a href="#top" className="flex items-center gap-2 font-display text-xl font-extrabold">
          <span className="grid h-9 w-9 place-items-center border-[3px] border-ink bg-brut-lime text-sm shadow-hard-sm">
            ▶
          </span>
          SummarAI
        </a>
        <nav className="hidden gap-6 font-mono text-sm font-bold uppercase sm:flex">
          <a href="#how" className="decoration-[3px] underline-offset-4 hover:underline">How it works</a>
          <a href="#features" className="decoration-[3px] underline-offset-4 hover:underline">Features</a>
        </nav>
        <a href="#tool" className="btn-brutal px-4 py-2">Summarize</a>
      </div>
    </header>
  );
}
