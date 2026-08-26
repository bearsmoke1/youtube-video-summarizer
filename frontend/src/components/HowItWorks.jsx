const steps = [
  {
    n: '01',
    t: 'Paste a link',
    d: 'Any public YouTube video that has captions — manual or auto-generated.',
    color: 'bg-brut-lime',
  },
  {
    n: '02',
    t: 'We grab the transcript',
    d: 'The backend pulls the video’s caption track and cleans it up.',
    color: 'bg-brut-sky',
  },
  {
    n: '03',
    t: 'AI writes the summary',
    d: 'DeepSeek turns the transcript into a short or detailed summary.',
    color: 'bg-brut-pink',
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-5xl scroll-mt-20 px-5 py-20">
      <h2 className="text-center font-display text-4xl font-extrabold uppercase sm:text-5xl">
        <span className="border-b-[6px] border-brut-lime">How it works</span>
      </h2>
      <p className="mx-auto mt-4 max-w-lg text-center font-medium text-ink/70">
        Three steps, about 15–30 seconds — no sign-up, no setup.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className={`card-brutal ${s.color} p-6`}>
            <div className="font-display text-4xl font-extrabold">{s.n}</div>
            <h3 className="mt-3 font-display text-xl font-extrabold uppercase">{s.t}</h3>
            <p className="mt-2 font-medium text-ink/80">{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
