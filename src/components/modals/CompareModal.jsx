import Modal from './Modal';
import Icon from '../ui/Icon';
import { ORGS } from '../../data/orgs';
import { useApp } from '../../context/AppContext';

const ROWS = [
  ['Category', (org) => org.cat],
  ['GSoC Years', (org) => org.years],
  ['First Year', (org) => org.firstYear],
  ['Competition', (org) => org.competition],
  ['Codebase', (org) => org.codebase],
  ['Tech Stack', (org) => org.tags.join(', ')],
  ['Best Fit', (org) => org.fit.join(', ')],
  ['Repository', (org) => org.github],
];

/** Side-by-side comparison table for 2–3 selected orgs. */
export default function CompareModal() {
  const { compareOpen, closeCompare, compareList } = useApp();
  const selected = compareList.map((name) => ORGS.find((o) => o.name === name)).filter(Boolean);

  return (
    <Modal id="compareModal" open={compareOpen} onClose={closeCompare} className="compare-bg">
      <div className="modal w-full max-w-5xl">
        <button className="close-btn" onClick={closeCompare} aria-label="Close"><Icon name="close" /></button>
        <div className="modal-header pb-4 border-b border-zinc-100">
          <h2 className="text-3xl font-extrabold font-headline">Compare Organizations</h2>
          <p className="text-zinc-500 text-sm mt-1">Side-by-side comparison of your selected projects</p>
        </div>
        <div className="modal-body p-6 overflow-x-auto" id="compareModalBody">
          {selected.length < 2 ? (
            <div className="py-12 text-center border-2 border-dashed border-zinc-200 rounded-2xl">
              <Icon name="compare_arrows" className="text-4xl text-zinc-300 mb-3" />
              <p className="font-bold text-zinc-700">Select at least 2 organizations to compare.</p>
              <p className="text-sm text-zinc-500 mt-2">Use the Compare button on organization cards, then open this tool again.</p>
            </div>
          ) : (
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-zinc-200">
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-widest text-zinc-400">Metric</th>
                  {selected.map((org) => <th key={org.name} className="text-left py-3 px-4 font-bold">{org.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {ROWS.map(([label, getValue]) => (
                  <tr key={label} className="border-b border-zinc-100 last:border-0">
                    <td className="py-3 px-4 font-bold text-zinc-500">{label}</td>
                    {selected.map((org) => <td key={org.name} className="py-3 px-4 text-zinc-700">{getValue(org)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Modal>
  );
}
