import Icon from '../ui/Icon';
import { useApp } from '../../context/AppContext';

/** Keyboard shortcuts dialog (opened with the header ? button or the ? key). */
export default function HelpModal() {
  const { helpOpen, closeHelp } = useApp();
  return (
    <div
      className={`modal-bg${helpOpen ? ' open' : ''}`}
      id="helpModal"
      onClick={(e) => { if (e.target === e.currentTarget) closeHelp(); }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="helpModalTitle">
        <button className="close-btn" onClick={closeHelp} aria-label="Close keyboard shortcuts modal">
          <Icon name="close" />
        </button>

        <div className="modal-header">
          <h2 id="helpModalTitle">Keyboard Shortcuts</h2>
          <p>Quick shortcuts for navigation</p>
        </div>

        <div className="modal-body">
          <div className="section-title">Keyboard Shortcuts</div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">Key</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
          <tbody>

          <tr className="category-row">
            <td colSpan="2">Navigation</td>
          </tr>

          <tr className="shortcut-row">
            <td className="py-2">
              <kbd>↑</kbd>
              <kbd>↓</kbd>
              <kbd>←</kbd>
              <kbd>→</kbd>
            </td>
            <td className="py-2">Move focus between cards</td>
          </tr>

          <tr className="shortcut-row">
            <td className="py-2"><kbd>Enter</kbd></td>
            <td className="py-2">Open focused card</td>
          </tr>

          <tr className="shortcut-row">
            <td className="py-2"><kbd>/</kbd></td>
            <td className="py-2">Focus search bar</td>
          </tr>


          <tr className="category-row">
            <td colSpan="2">Actions</td>
          </tr>

          <tr className="shortcut-row">
            <td className="py-2"><kbd>C</kbd></td>
            <td className="py-2">Toggle compare</td>
          </tr>

          <tr className="shortcut-row">
            <td className="py-2"><kbd>A</kbd></td>
            <td className="py-2">Go to AI Recommender Page</td>
          </tr>

          <tr className="shortcut-row">
            <td className="py-2"><kbd>M</kbd></td>
            <td className="py-2">Go to Mentors Page</td>
          </tr>

          <tr className="shortcut-row">
            <td className="py-2"><kbd>R</kbd></td>
            <td className="py-2">Reset filters</td>
          </tr>


          <tr className="category-row">
            <td colSpan="2">General</td>
          </tr>

          <tr className="shortcut-row">
            <td className="py-2"><kbd>H</kbd></td>
            <td className="py-2">Go to top</td>
          </tr>

          <tr className="shortcut-row">
            <td className="py-2"><kbd>Esc</kbd></td>
            <td className="py-2">Close panel</td>
          </tr>

          <tr className="shortcut-row">
            <td className="py-2"><kbd>?</kbd></td>
            <td className="py-2">Open help dialog</td>
          </tr>

          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
