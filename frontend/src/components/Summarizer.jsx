import { useState } from 'react';
import URLInputForm from './URLInputForm.jsx';
import SummaryDisplay from './SummaryDisplay.jsx';
import { requestSummary } from '../services/apiService.js';

export default function Summarizer() {
  const [url, setUrl] = useState('');
  const [type, setType] = useState('short');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [summaryType, setSummaryType] = useState('short');
  const [error, setError] = useState('');

  async function onSubmit() {
    setLoading(true);
    setError('');
    setSummary('');
    try {
      const data = await requestSummary(url.trim(), type);
      setSummary(data.summary);
      setSummaryType(data.type);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card-brutal shadow-hard-lg p-5 text-left">
      <URLInputForm
        url={url}
        setUrl={setUrl}
        type={type}
        setType={setType}
        onSubmit={onSubmit}
        loading={loading}
      />

      {loading && <LoadingState />}
      {error && !loading && <ErrorState message={error} />}
      {summary && !loading && <SummaryDisplay summary={summary} type={summaryType} />}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="mt-5 border-t-[3px] border-ink pt-4">
      <p className="mb-3 flex items-center gap-2 font-mono text-sm font-bold uppercase">
        <span className="h-3.5 w-3.5 animate-spin border-2 border-ink border-t-transparent" />
        Summarizing… (15–30s)
      </p>
      <div className="space-y-2">
        {[100, 92, 96, 78].map((w, i) => (
          <div
            key={i}
            className="relative h-4 overflow-hidden border-2 border-ink bg-white"
            style={{ width: `${w}%` }}
          >
            <div className="absolute inset-y-0 -left-1/3 w-1/3 animate-shimmer bg-brut-lime" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div
      role="alert"
      className="mt-5 flex items-start gap-2 border-[3px] border-ink bg-brut-coral px-4 py-3 text-sm font-bold shadow-hard-sm"
    >
      <span>⚠</span>
      <span>{message}</span>
    </div>
  );
}
