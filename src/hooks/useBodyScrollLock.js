import { useEffect } from 'react';

/** Locks page scroll while any overlay is open (replaces manual body.style.overflow juggling). */
export function useBodyScrollLock(locked, { modalClass = false } = {}) {
  useEffect(() => {
    if (!locked) return undefined;
    const { body, documentElement } = document;
    const prevBody = body.style.overflow;
    const prevHtml = documentElement.style.overflow;
    body.style.overflow = 'hidden';
    if (modalClass) {
      documentElement.style.overflow = 'hidden';
      body.classList.add('modal-open');
    }
    return () => {
      body.style.overflow = prevBody;
      documentElement.style.overflow = prevHtml;
      if (modalClass) body.classList.remove('modal-open');
    };
  }, [locked, modalClass]);
}
