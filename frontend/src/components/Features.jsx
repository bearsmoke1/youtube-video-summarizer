const Icon = ({ d }) => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);

const features = [
  {
    title: 'Short or detailed',
    body: 'Bullet-point gist or a structured deep-dive — your call, per video.',
    color: 'bg-brut-lime',
    icon: <Icon d={<><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><circle cx="3.5" cy="6" r="1" /><circle cx="3.5" cy="12" r="1" /><circle cx="3.5" cy="18" r="1" /></>} />,
  },
  {
    title: 'Copy & download',
    body: 'Copy the summary or save it as a .txt in one click.',
    color: 'bg-brut-sky',
    icon: <Icon d={<><path d="M9 9h9v11H6V6h3" /><path d="M9 3h6v4H9z" /></>} />,
  },
  {
    title: 'No account, no cost',
    body: 'No login, no tracking, no payment. Just paste and go.',
    color: 'bg-brut-pink',
    icon: <Icon d={<><path d="M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6z" /><path d="m9 12 2 2 4-4" /></>} />,
  },
  {
    title: 'Fast & lightweight',
    body: 'A clean React + Node app — a summary in roughly 15–30 seconds.',
    color: 'bg-brut-yellow',
    icon: <Icon d={<><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></>} />,
  },
];

export default function Features() {
  return (
    <section id="features" className="mx-auto max-w-5xl scroll-mt-20 px-5 py-16">
      <h2 className="text-center font-display text-4xl font-extrabold uppercase sm:text-5xl">
        <span className="border-b-[6px] border-brut-pink">Why you’ll like it</span>
      </h2>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div key={f.title} className="card-brutal bg-white p-6">
            <div className={`grid h-11 w-11 place-items-center border-[3px] border-ink ${f.color} shadow-hard-sm`}>
              {f.icon}
            </div>
            <h3 className="mt-4 font-display font-extrabold uppercase">{f.title}</h3>
            <p className="mt-2 text-sm font-medium text-ink/75">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
