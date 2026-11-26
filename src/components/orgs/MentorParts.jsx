import { CHANNEL_ICONS, sanitizeHrefUrl } from '../../lib/utils';

/** Links to chat channels / mailing lists. Entries without a safe http(s) URL are dropped. */
export function ChannelChips({ records }) {
  return records.map((record, i) => {
    const safe = sanitizeHrefUrl(record.url);
    if (!safe) return null;
    return (
      <a key={`${record.url}-${i}`} className="mentor-link-chip" href={safe} target="_blank" rel="noopener noreferrer">
        <span>{CHANNEL_ICONS[record.type] || '💬'}</span>
        <span>{record.label || record.type}</span>
      </a>
    );
  });
}

function HandleChip({ githubUrl, label }) {
  const safe = githubUrl ? sanitizeHrefUrl(githubUrl) : null;
  if (safe) {
    return (
      <a className="mentor-handle-chip" href={safe} target="_blank" rel="noopener noreferrer">
        <span>🐙</span><span>{label}</span>
      </a>
    );
  }
  return <span className="mentor-handle-chip"><span>👤</span><span>{label}</span></span>;
}

/** Full mentor list used in the org modal. */
export function MentorChips({ mentors }) {
  return mentors.map((mentor, i) => {
    const label = mentor.github ? `@${mentor.github}` : (mentor.name || mentor.githubUrl);
    return <HandleChip key={i} githubUrl={mentor.githubUrl} label={mentor.githubUrl ? label : (mentor.name || 'Mentor')} />;
  });
}

/** First three mentor handles shown on a mentor-finder card. */
export function MentorPreviewChips({ mentors }) {
  const preview = mentors
    .slice(0, 3)
    .filter((m) => m.github || m.name)
    .map((m) => ({ ...m, displayLabel: m.github ? `@${m.github}` : m.name }));
  if (preview.length === 0) return <p className="text-sm text-zinc-600">No mentor handles parsed yet.</p>;
  return (
    <div className="flex flex-wrap gap-2">
      {preview.map((m, i) => <HandleChip key={i} githubUrl={m.githubUrl} label={m.displayLabel} />)}
    </div>
  );
}

const mailingAsChannels = (lists) => (lists || []).map((list) => ({ ...list, type: 'Mailing list' }));
export { mailingAsChannels };

/** "Mentors & Contact" block inside the org modal. */
export function MentorContactSection({ state, entry }) {
  if (state === 'idle' || state === 'loading') {
    return <p className="text-sm text-zinc-500">Loading mentor contact data...</p>;
  }
  if (!entry) return <p className="text-sm text-zinc-500">Mentor data unavailable right now.</p>;

  const ok = entry.status === 'ok';
  const channels = ok ? entry.channels || [] : [];
  const mentors = ok ? entry.mentors || [] : [];
  const lists = ok ? entry.mailingLists || [] : [];
  const hasSections = channels.length > 0 || mentors.length > 0 || lists.length > 0 || !!entry.tip;

  if (!hasSections) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-200 p-5">
        <p className="text-sm text-zinc-600">
          {entry.status === 'fetch-failed' ? 'Mentor data unavailable right now.' : 'No contact info parsed yet.'}
        </p>
      </div>
    );
  }

  const label = 'text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3';
  return (
    <div className="space-y-4">
      {channels.length > 0 && (
        <div>
          <p className={label}>Channels</p>
          <div className="flex flex-wrap gap-2"><ChannelChips records={channels} /></div>
        </div>
      )}
      {mentors.length > 0 && (
        <div>
          <p className={label}>Mentors</p>
          <div className="flex flex-wrap gap-2"><MentorChips mentors={mentors} /></div>
        </div>
      )}
      {lists.length > 0 && (
        <div>
          <p className={label}>Mailing Lists</p>
          <div className="flex flex-wrap gap-2"><ChannelChips records={mailingAsChannels(lists)} /></div>
        </div>
      )}
      {entry.tip && (
        <div className="rounded-2xl bg-orange-50 border border-orange-100 p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-primary-ink mb-1">Contact Tip</p>
          <p className="text-sm text-zinc-700">{entry.tip}</p>
        </div>
      )}
    </div>
  );
}
