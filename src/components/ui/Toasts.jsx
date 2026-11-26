import { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';

/** "You can only compare up to 3 organizations" toast. */
export function CompareToast() {
  const { toast } = useApp();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!toast) return undefined;
    let raf2;
    const raf1 = requestAnimationFrame(() => { raf2 = requestAnimationFrame(() => setVisible(true)); });
    const timer = setTimeout(() => setVisible(false), 2200);
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(timer);
    };
  }, [toast]);

  if (!toast) return null;
  return (
    <div className="compare-toast" role="status" aria-live="polite" aria-atomic="true" style={{ opacity: visible ? 1 : 0 }}>
      {toast.message}
    </div>
  );
}

/** Renders "Badge Unlocked!" toasts fired by BadgeSystem via the `badgeUnlocked` document event. */
export function BadgeToastHost() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const timers = [];
    const onUnlock = (e) => {
      const id = `${Date.now()}-${Math.random()}`;
      const { level, def } = e.detail;
      const patch = (changes) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...changes } : i)));
      setItems((prev) => [...prev, { id, level, def, show: false }]);
      timers.push(setTimeout(() => patch({ show: true }), 10));
      timers.push(setTimeout(() => patch({ show: false }), 4000));
      timers.push(setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== id)), 4300));
    };
    document.addEventListener('badgeUnlocked', onUnlock);
    return () => {
      document.removeEventListener('badgeUnlocked', onUnlock);
      timers.forEach(clearTimeout);
    };
  }, []);

  return items.map(({ id, level, def, show }) => (
    <div key={id} className={`badge-notification${show ? ' show' : ''}`} role="status" aria-live="polite" aria-atomic="true">
      <div className="badge-notification-content">
        <div className="badge-notification-icon">{def.name.split(' ')[0]}</div>
        <div className="badge-notification-text">
          <div className="badge-notification-title">Badge Unlocked!</div>
          <div className="badge-notification-desc">{def.name} - {level.levelName}</div>
          <div className="badge-notification-progress">{def.description}: {level.threshold}</div>
        </div>
      </div>
      <span className="sr-only">Badge unlocked: {def.name} {level.levelName}. {def.description} {level.threshold}.</span>
    </div>
  ));
}
