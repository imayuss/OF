import { useEffect, useRef } from 'react';
import {
  MILESTONES, formatMilestoneDate, getActiveMilestoneIndex, getCountdown,
} from '../../lib/utils';
import { useNow } from '../../hooks/useNow';

/** "2026 Timeline" card in the hero (anchor target: #timeline). */
export default function Timeline() {
  const now = useNow(60000);
  const containerRef = useRef(null);

  const activeIdx = getActiveMilestoneIndex(now);
  const allPast = MILESTONES.length > 0 && MILESTONES[MILESTONES.length - 1].date <= now;
  const countdown = getCountdown(now);

  // Keep the current milestone centred in the scroll area.
  useEffect(() => {
    const container = containerRef.current;
    const current = container?.querySelector('.current-milestone');
    if (!container || !current || typeof container.scrollTo !== 'function') return undefined;
    const raf = requestAnimationFrame(() => {
      container.scrollTo({
        top: current.offsetTop - container.offsetTop - container.clientHeight / 2 + current.clientHeight / 2,
        behavior: 'smooth',
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [activeIdx]);

  return (
    <div id="timeline" className="lg:col-span-5 fade-up" style={{ animationDelay: '.2s' }}>
      <div className="relative rounded-2xl sm:rounded-3xl p-[1.5px] bg-zinc-200 dark:bg-zinc-700 transition-colors duration-300">
        <svg className="timeline-border-svg" fill="none">
          <rect className="timeline-border-rect" rx="16" ry="16" pathLength="100" />
        </svg>
        <div className="relative z-10 bg-white rounded-[calc(1rem-1.5px)] sm:rounded-[calc(1.5rem-1.5px)] p-6 sm:p-8 h-full w-full">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h3 className="font-headline font-extrabold text-lg sm:text-xl">2026 Timeline</h3>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Live</span>
          </div>

          <div
            id="timeline-milestones"
            ref={containerRef}
            aria-label="GSoC timeline milestones"
            className="space-y-4 sm:space-y-5 overflow-y-auto max-h-[50vh] pl-4 no-scrollbar focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-lg"
          >
            {MILESTONES.map((m, i) => (
              <Milestone
                key={m.label}
                milestone={m}
                isActive={i === activeIdx}
                isFuture={i >= activeIdx}
                isLast={i === MILESTONES.length - 1}
                allPast={allPast}
              />
            ))}
          </div>

          <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-zinc-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500" id="countdown-label">
                {countdown ? `Until: ${countdown.label}` : 'GSoC 2026 selection complete'}
              </span>
              <span id="countdown" className={`font-mono text-sm font-bold ${countdown ? 'text-primary-ink' : 'text-green-600'}`}>
                {countdown ? countdown.text : '🎉 All done!'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Milestone({ milestone: m, isActive, isFuture, isLast, allPast }) {
  const dateStr = formatMilestoneDate(m.date);
  const connector = !isLast && <div className={`w-[2px] h-10 ${isFuture ? 'bg-orange-400/70' : 'bg-zinc-200'}`} />;

  if (isActive && !allPast) {
    return (
      <div className="flex gap-3 sm:gap-4 current-milestone">
        <div className="flex flex-col items-center">
          <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-orange-100 pulse-dot" />
          {connector}
        </div>
        <div>
          <p className="text-[10px] font-bold text-primary-ink">{dateStr}</p>
          <p className="text-sm sm:text-base font-extrabold text-zinc-900 leading-tight">{m.label}</p>
          {m.note && <p className="text-xs text-zinc-500 mt-1">{m.note}</p>}
        </div>
      </div>
    );
  }
  if (isActive && allPast) {
    return (
      <div className="flex gap-3 sm:gap-4 current-milestone">
        <div className="flex flex-col items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 ring-4 ring-green-100" />
          {connector}
        </div>
        <div>
          <p className="text-[10px] font-bold text-green-600">{dateStr}</p>
          <p className="text-sm sm:text-base font-extrabold text-zinc-900 leading-tight">{m.label}</p>
          <p className="text-xs text-green-600 mt-1">✓ Completed</p>
        </div>
      </div>
    );
  }
  if (isFuture) {
    return (
      <div className="flex gap-3 sm:gap-4">
        <div className="flex flex-col items-center">
          <div className="w-3 h-3 rounded-full bg-zinc-400" />
          {connector}
        </div>
        <div>
          <p className="text-[10px] font-bold text-zinc-400">{dateStr}</p>
          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{m.label}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-3 sm:gap-4 opacity-40">
      <div className="flex flex-col items-center">
        <div className="w-2.5 h-2.5 rounded-full bg-white/80" />
        {connector}
      </div>
      <div>
        <p className="text-[10px] font-bold text-zinc-400">{dateStr}</p>
        <p className="text-sm font-bold text-zinc-500">{m.label}</p>
      </div>
    </div>
  );
}
