// Parse/validate YouTube URLs. Handles watch?v=, youtu.be/, /embed/, /shorts/, /v/.

function isValidId(id) {
  return typeof id === 'string' && /^[A-Za-z0-9_-]{11}$/.test(id);
}

export function extractVideoId(url) {
  if (!url || typeof url !== 'string') return null;
  let u;
  try {
    u = new URL(url.trim());
  } catch {
    return null;
  }
  const host = u.hostname.toLowerCase().replace(/^www\./, '');

  if (host === 'youtu.be') {
    const id = u.pathname.slice(1).split('/')[0];
    return isValidId(id) ? id : null;
  }
  if (host === 'youtube.com' || host === 'm.youtube.com') {
    if (u.pathname === '/watch') {
      const id = u.searchParams.get('v');
      return isValidId(id) ? id : null;
    }
    const m = u.pathname.match(/^\/(embed|shorts|v)\/([^/?]+)/);
    if (m) return isValidId(m[2]) ? m[2] : null;
  }
  return null;
}

export function validateUrl(url) {
  return extractVideoId(url) !== null;
}
