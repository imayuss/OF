/** Material Symbols glyph (font loaded from Google Fonts in index.html). */
export default function Icon({ name, className = '', fill = false, style }) {
  return (
    <span
      className={`material-symbols-outlined${className ? ` ${className}` : ''}${fill ? ' icon-fill' : ''}`}
      style={style}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
