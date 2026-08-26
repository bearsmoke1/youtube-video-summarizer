import Summarizer from './Summarizer.jsx';

export default function Hero() {
  return (
    <section id="top" className="mx-auto max-w-4xl px-5 pb-12 pt-14 text-center sm:pt-20">
      <span className="chip-brutal bg-brut-yellow">
        <span className="h-2 w-2 rounded-full bg-ink" />
        Powered by DeepSeek AI
      </span>

      <h1 className="mt-7 font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-7xl">
        Summarize any{' '}
        <span className="inline-block -rotate-2 border-[3px] border-ink bg-brut-lime px-3 shadow-hard">
          YouTube
        </span>{' '}
        video in seconds
      </h1>

      <p className="mx-auto mt-6 max-w-xl text-lg font-medium text-ink/70">
        Paste a link, pick short or detailed, and get the key points instantly — stop watching a
        30-minute video for three takeaways.
      </p>

      <div id="tool" className="mt-10 scroll-mt-24">
        <Summarizer />
      </div>

      <p className="mt-4 font-mono text-xs font-bold uppercase tracking-wide text-ink/50">
        Works on videos with captions · No account · Free
      </p>
    </section>
  );
}
