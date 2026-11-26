import Icon from '../ui/Icon';
import OrgLogo from '../ui/OrgLogo';
import { ORGS } from '../../data/orgs';
import { MAX_COMPARE, useApp } from '../../context/AppContext';

/** "Compare Organizations" promo + the three live compare slots. */
export default function CompareSection() {
  const { compareList, toggleCompare, openCompare, openPicker } = useApp();
  const selected = compareList.map((name) => ORGS.find((o) => o.name === name)).filter(Boolean);
  const emptySlots = Array.from({ length: MAX_COMPARE - selected.length }, (_, i) => selected.length + i);

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="font-label text-xs font-bold uppercase tracking-[0.2em] text-primary-ink">Decision Tool</span>
          <h2 className="text-4xl font-extrabold font-headline tracking-tighter mt-2 mb-6">Compare Organizations</h2>
          <p className="text-zinc-600 leading-relaxed mb-8">
            Select up to 3 orgs to compare side-by-side. See history, mentor count, tech stack, competition level, and active GFIs at a glance.
          </p>
          <button
            onClick={openCompare}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-black font-bold rounded-xl hover:scale-95 transition-all shadow-lg"
          >
            <Icon name="compare" /> Open Comparison Tool
          </button>
        </div>

        <div id="compare" className="bg-surface-container-low rounded-3xl p-8 border border-zinc-100">
          <div className="grid grid-cols-3 gap-4 text-center">
            {selected.map((org) => (
              <div key={org.name} className="bg-white rounded-xl p-4 border border-zinc-100">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center mx-auto mb-3 overflow-hidden">
                  <OrgLogo org={org} />
                </div>
                <p className="font-bold text-sm truncate">{org.name}</p>
                <p className="text-[10px] text-zinc-500 font-label uppercase mt-1">{org.years}y · {org.competition}</p>
                <button onClick={() => toggleCompare(org.name)} className="text-[9px] text-red-500 font-bold uppercase mt-2 hover:underline">Remove</button>
              </div>
            ))}
            {emptySlots.map((slot) => (
              <div
                key={slot}
                role="button"
                tabIndex={0}
                onClick={() => openPicker(slot)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPicker(slot); } }}
                className="bg-white rounded-xl p-4 border border-zinc-100 border-dashed border-zinc-300 flex flex-col items-center justify-center opacity-50 cursor-pointer hover:opacity-80 hover:border-orange-400 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center mb-3">
                  <Icon name="add" className="text-zinc-400" />
                </div>
                <p className="font-bold text-sm text-zinc-400">Add org</p>
                <p className="text-[10px] text-zinc-400 font-label uppercase mt-1">Slot {slot + 1}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
