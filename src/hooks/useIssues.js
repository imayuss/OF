import { useEffect, useState } from 'react';

/** Pre-fetched Good First Issues. status: loading | ready | error */
export function useIssues() {
  const [status, setStatus] = useState('loading');
  const [issues, setIssues] = useState([]);
  const [updatedAt, setUpdatedAt] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/data/issues.json?v=' + Date.now());
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        setIssues(Array.isArray(data.issues) ? data.issues : []);
        setUpdatedAt(data.updated_at || null);
        setStatus('ready');
      } catch (e) {
        console.error('GFI render failed:', e);
        if (!cancelled) setStatus('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { status, issues, updatedAt };
}
