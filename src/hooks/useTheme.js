import { useCallback, useEffect, useState } from 'react';

const readTheme = () => {
  try {
    return localStorage.getItem('theme') === 'dark';
  } catch {
    return false;
  }
};

/** Dark-mode toggle. The no-flash restore script stays in index.html. */
export function useTheme() {
  const [dark, setDark] = useState(readTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const toggleTheme = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('theme', next ? 'dark' : 'light');
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  }, []);

  return { dark, toggleTheme };
}
