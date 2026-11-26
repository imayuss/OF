import { useCallback, useEffect, useState } from 'react';
import { ORGS } from '../data/orgs';

function createDefaultMentorEntry(org) {
  return {
    org: org.name,
    ideasUrl: org.ideas || '',
    channels: [],
    mentors: [],
    mailingLists: [],
    tip: '',
    status: 'fetch-failed',
    lastFetched: '',
  };
}

/** Loads the cached mentors snapshot once. state: idle | loading | loaded | error */
export function useMentorData() {
  const [state, setState] = useState('idle');
  const [data, setData] = useState({});

  useEffect(() => {
    let cancelled = false;
    setState('loading');
    (async () => {
      try {
        const res = await fetch(`/data/mentors.json?v=${Date.now()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!json || typeof json !== 'object' || Array.isArray(json)) {
          throw new Error('Invalid mentors.json payload');
        }
        if (!cancelled) {
          setData(json);
          setState('loaded');
        }
      } catch (error) {
        console.error('Mentor data load failed:', error);
        if (!cancelled) {
          setData({});
          setState('error');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const getEntry = useCallback(
    (name) => {
      const org = ORGS.find((item) => item.name === name);
      if (!org) return null;
      return data[name] || createDefaultMentorEntry(org);
    },
    [data],
  );

  return { state, data, getEntry };
}
