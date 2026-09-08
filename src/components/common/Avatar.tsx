import React, { useState } from 'react';

export interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  role?: string;
  showBadge?: boolean;
}

const sizeClasses: Record<string, { container: string; text: string; icon: string }> = {
  xs: { container: 'w-6 h-6', text: 'text-[9px]', icon: 'w-3 h-3' },
  sm: { container: 'w-8 h-8', text: 'text-xs', icon: 'w-4 h-4' },
  md: { container: 'w-10 h-10', text: 'text-sm', icon: 'w-5 h-5' },
  lg: { container: 'w-12 h-12', text: 'text-base', icon: 'w-6 h-6' },
  xl: { container: 'w-16 h-16', text: 'text-xl', icon: 'w-8 h-8' },
  '2xl': { container: 'w-24 h-24', text: 'text-3xl', icon: 'w-12 h-12' },
};

function getInitials(name?: string): string {
  if (!name || !name.trim()) return 'KS';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Deterministic color palette for avatars based on name
function getAvatarGradient(name?: string): string {
  if (!name) return 'from-amber-700 via-stone-800 to-amber-900';
  const charSum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const gradients = [
    'from-amber-700 via-amber-800 to-stone-900', // Terracotta artisan
    'from-amber-600 via-stone-700 to-amber-900', // Warm ochre
    'from-stone-800 via-amber-900 to-stone-950', // Deep teak
    'from-emerald-800 via-stone-800 to-emerald-950', // Forest jade
    'from-indigo-900 via-stone-800 to-indigo-950', // Indigo dye
    'from-rose-900 via-amber-900 to-stone-900', // Madder red
  ];
  return gradients[charSum % gradients.length];
}

/**
 * Robust, Fail-Safe Avatar Component for KarigarSetu AI.
 * Priority:
 * 1. Image URL (with error boundary)
 * 2. Deterministic Indian artisan SVG illustration
 * 3. Heritage monogram initials badge
 * NEVER shows broken image icon.
 */
export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = 'Artisan',
  size = 'md',
  className = '',
  role,
  showBadge = false,
}) => {
  const [hasError, setHasError] = useState(false);
  const { container, text } = sizeClasses[size] || sizeClasses.md;
  const initials = getInitials(name);
  const gradient = getAvatarGradient(name);

  // Normalize name to detect known demo personas
  const normalizedName = name.toLowerCase().trim();
  const isRavi = normalizedName.includes('ravi') || normalizedName.includes('artisan');
  const isAnanya = normalizedName.includes('ananya');

  // Multi-tier image candidate sources: 1. Passed src -> 2. Local project asset
  const [srcIndex, setSrcIndex] = useState(0);
  const candidateSources = [
    src,
    isRavi ? '/avatars/ravi-kumar.jpg' : isAnanya ? '/avatars/ananya-sharma.jpg' : null,
  ].filter((s): s is string => !!s && s.trim().length > 0);

  const activeSrc = candidateSources[srcIndex] || null;

  const handleImgError = () => {
    if (srcIndex < candidateSources.length - 1) {
      setSrcIndex((prev) => prev + 1);
    } else {
      setHasError(true);
    }
  };

  const renderFallbackSvg = () => {
    if (isRavi) {
      // Indian Artisan (Ravi Kumar) Stylized SVG Avatar
      return (
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full object-cover"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background */}
          <rect width="100" height="100" fill="#2C1810" />
          <circle cx="50" cy="50" r="46" fill="#422518" />
          {/* Traditional Kurta Garment */}
          <path d="M15 100 L30 68 L50 82 L70 68 L85 100 Z" fill="#C45A2C" />
          <path d="M35 72 L50 82 L65 72 L50 100 Z" fill="#E8B042" opacity="0.8" />
          {/* Neck & Face */}
          <rect x="42" y="52" width="16" height="18" rx="4" fill="#C68642" />
          <ellipse cx="50" cy="42" rx="20" ry="24" fill="#D99B5B" />
          {/* Traditional Artisan Turban / Hair */}
          <path
            d="M30 35 C30 20, 70 20, 70 35 C70 26, 62 16, 50 16 C38 16, 30 26, 30 35 Z"
            fill="#3B1E08"
          />
          {/* Facial Features */}
          <ellipse cx="43" cy="40" rx="2.5" ry="2" fill="#2C1810" />
          <ellipse cx="57" cy="40" rx="2.5" ry="2" fill="#2C1810" />
          {/* Eyebrows */}
          <path d="M39 36 Q43 34 47 36" stroke="#2C1810" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M53 36 Q57 34 61 36" stroke="#2C1810" strokeWidth="1.5" strokeLinecap="round" />
          {/* Friendly Artisan Mustache */}
          <path
            d="M38 50 Q45 47 50 51 Q55 47 62 50 Q56 55 50 52 Q44 55 38 50 Z"
            fill="#2C1810"
          />
          {/* Warm smile */}
          <path d="M44 55 Q50 59 56 55" stroke="#8C421A" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    }

    if (isAnanya) {
      // Indian Buyer Patron (Ananya Sharma) Stylized SVG Avatar
      return (
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full object-cover"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="100" height="100" fill="#1C2826" />
          <circle cx="50" cy="50" r="46" fill="#2D3E3A" />
          {/* Saree drape */}
          <path d="M15 100 L32 66 L50 80 L68 66 L85 100 Z" fill="#8B2635" />
          <path d="M40 70 L65 100 L85 100 L55 68 Z" fill="#D4AF37" opacity="0.85" />
          {/* Neck & Face */}
          <rect x="43" y="52" width="14" height="16" rx="4" fill="#C98A58" />
          <ellipse cx="50" cy="40" rx="18" ry="22" fill="#E0A978" />
          {/* Hair */}
          <path
            d="M28 42 C26 22, 74 22, 72 42 C72 26, 64 16, 50 16 C36 16, 28 26, 28 42 Z"
            fill="#1A110B"
          />
          {/* Bindi */}
          <circle cx="50" cy="33" r="1.8" fill="#8B2635" />
          {/* Eyes */}
          <ellipse cx="43" cy="39" rx="2.2" ry="1.8" fill="#1A110B" />
          <ellipse cx="57" cy="39" rx="2.2" ry="1.8" fill="#1A110B" />
          {/* Smile */}
          <path d="M44 51 Q50 56 56 51" stroke="#8B2635" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
      );
    }

    // Default: Crisp Heritage Monogram Badge
    return (
      <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center text-heritage-gold-light font-black tracking-wider ${text}`}>
        {initials}
      </div>
    );
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 border-2 border-heritage-gold/50 shadow-sm bg-heritage-ivory ${container} ${className}`}
      title={name}
    >
      {activeSrc && !hasError ? (
        <img
          src={activeSrc}
          alt={name}
          onError={handleImgError}
          className="w-full h-full object-cover"
        />
      ) : (
        renderFallbackSvg()
      )}

      {/* Role badge indicator if requested */}
      {showBadge && role && (
        <span
          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-white ${
            role === 'seller' ? 'bg-amber-500' : 'bg-emerald-500'
          }`}
          title={role}
        />
      )}
    </div>
  );
};
