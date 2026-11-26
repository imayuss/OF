import { memo } from 'react';
import Icon from '../ui/Icon';
import OrgLogo from '../ui/OrgLogo';

/** One card in the organization directory. */
function OrgCard({ org, isBookmarked, isComparing, onOpen, onToggleBookmark, onToggleCompare }) {
  const stop = (fn) => (e) => { e.stopPropagation(); fn(org.name); };

  return (
    <article
      className="group bg-white rounded-2xl p-6 border border-zinc-100 transition-all hover:shadow-xl hover:border-primary/20 animate-fade-up cursor-pointer"
      data-org={org.name}
      onClick={() => onOpen(org.name)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-14 h-14 flex-shrink-0 rounded-xl bg-surface-container-low flex items-center justify-center p-2 overflow-hidden">
          <OrgLogo org={org} className="w-full h-full object-contain rounded-lg" size={56} placeholderClassName="bg-primary/5" />
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-primary/10 text-primary-ink text-[10px] font-label uppercase tracking-widest px-2 py-1 rounded-full font-bold">{org.years}y Veteran</span>
          <span className={`complexity-badge ${org.codebase}`}>{org.codebase}</span>
          <button
            className={`bookmark-btn ${isBookmarked ? 'active' : 'text-zinc-300'}`}
            title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            onClick={stop(onToggleBookmark)}
          >
            <Icon name="star" className="text-lg" fill={isBookmarked} />
          </button>
        </div>
      </div>

      <h3 className="font-headline text-lg font-bold text-on-surface mb-1 group-hover:text-primary-ink transition-colors">{org.name}</h3>
      <span className="category-tag">{org.cat.toUpperCase()}</span>
      <p className="text-on-surface-variant text-sm leading-relaxed mb-4 line-clamp-2">{org.desc}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {org.tags.slice(0, 3).map((t) => (
          <span key={t} className="px-2 py-0.5 bg-surface-container-low text-[10px] font-mono rounded">{t}</span>
        ))}
        {org.tags.length > 3 && (
          <span className="px-2 py-0.5 bg-surface-container-low text-[10px] font-mono rounded">+{org.tags.length - 3}</span>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
        <div className="flex items-center gap-3">
          <button
            onClick={stop(onToggleCompare)}
            className={`text-[10px] font-bold uppercase tracking-widest ${isComparing ? 'text-primary-ink' : 'text-zinc-400'} hover:text-primary-ink flex items-center gap-1`}
          >
            <Icon name={isComparing ? 'check_circle' : 'compare_arrows'} className="text-sm" /> {isComparing ? 'Comparing' : 'Compare'}
          </button>
        </div>
        <button
          onClick={stop(onOpen)}
          className="text-primary-ink font-bold text-xs uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all"
        >
          View <Icon name="arrow_forward" className="text-sm" />
        </button>
      </div>
    </article>
  );
}

export default memo(OrgCard);
