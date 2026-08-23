export default function URLInputForm({ url, setUrl, type, setType, onSubmit, loading }) {
  function submit(e) {
    e.preventDefault();
    if (!loading && url.trim()) onSubmit();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="flex items-center gap-2 border-[3px] border-ink bg-white px-3">
        <svg className="h-5 w-5 shrink-0 text-ink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" strokeLinecap="round" />
          <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          className="w-full bg-transparent py-3 font-medium text-ink placeholder-ink/40 outline-none"
          placeholder="Paste a YouTube video URL…"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
          aria-label="YouTube video URL"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex border-[3px] border-ink font-mono text-sm font-bold uppercase" role="radiogroup" aria-label="Summary length">
          {['short', 'detailed'].map((t, i) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              disabled={loading}
              className={`px-4 py-2 transition-colors ${i === 0 ? 'border-r-[3px] border-ink' : ''} ${
                type === t ? 'bg-ink text-paper' : 'bg-white text-ink hover:bg-brut-lime'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <button type="submit" disabled={loading || !url.trim()} className="btn-brutal px-6 py-2.5">
          {loading ? 'Summarizing…' : 'Summarize ▸'}
        </button>
      </div>
    </form>
  );
}
