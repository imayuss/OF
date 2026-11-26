import { useEffect, useState } from 'react';
import { logoUrlFor, orgInitials } from '../../lib/utils';

/**
 * Org avatar with the same fallback chain as the old handleImgError():
 * GitHub avatar → clearbit guess → initials placeholder.
 * `initials="first"` reproduces the recommender's single-letter placeholder.
 */
export default function OrgLogo({ org, className = 'w-full h-full object-contain', placeholderClassName = '', initials = 'two', size }) {
  const primary = logoUrlFor(org);
  const [stage, setStage] = useState(primary ? 0 : 2);

  useEffect(() => { setStage(primary ? 0 : 2); }, [primary]);

  if (stage >= 2) {
    const text = initials === 'first' ? (org.name[0] || '?').toUpperCase() : orgInitials(org.name);
    return (
      <div className={`logo-placeholder flex w-full h-full items-center justify-center text-primary-ink font-bold text-xl ${placeholderClassName}`}>
        {text}
      </div>
    );
  }

  const clearbitDomain = `${org.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.org`;
  const src = stage === 0 ? primary : `https://logo.clearbit.com/${clearbitDomain}`;
  return (
    <img
      src={src}
      alt={`${org.name} logo`}
      className={className}
      width={size}
      height={size}
      onError={() => setStage((s) => s + 1)}
    />
  );
}
