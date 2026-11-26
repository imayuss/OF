/**
 * `.modal-bg` backdrop shared by the org / compare / analytics / help dialogs.
 * Visibility is the `open` class (the CSS handles the fade), clicking the backdrop closes.
 */
export default function ModalBackdrop({ id, open, onClose, className = '', children, ...rest }) {
  return (
    <div
      id={id}
      className={`modal-bg${className ? ` ${className}` : ''}${open ? ' open' : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      {...rest}
    >
      {children}
    </div>
  );
}
