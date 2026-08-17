// Talks to the backend. Same-origin "/api" is proxied to the backend by Vite.
export async function requestSummary(url, type) {
  let res;
  try {
    res = await fetch('/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, type }),
    });
  } catch {
    throw new Error('Cannot reach the server. Is the backend running?');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Request failed. Please try again.');
  }
  return data;
}
