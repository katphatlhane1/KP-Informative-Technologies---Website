import React, { useState } from 'react';

interface KpitLogoProps {
  variant?: 'header' | 'footer' | 'badge';
  className?: string;
}

/**
 * Renders the official KP Informative Technologies logo (Logo 2.jpg / kp-update-logo-dark1.png)
 * with a precision SVG vector fallback matching the interlocking KP blue gradient ribbon mark,
 * bold geometric wordmark, and italic tagline.
 */
export const KpitLogo: React.FC<KpitLogoProps> = ({ variant = 'header', className = '' }) => {
  const [imgFailed, setImgFailed] = useState(false);

  const heightClass =
    variant === 'header'
      ? 'h-12 sm:h-14 w-auto'
      : variant === 'footer'
        ? 'h-16 w-auto'
        : 'h-10 w-auto';

  if (!imgFailed) {
    return (
      <img
        src="/src/assets/images/kpit-logo.png"
        alt="KP Informative Technologies – A legacy of innovation, A future of endless possibilities"
        referrerPolicy="no-referrer"
        onError={() => setImgFailed(true)}
        className={`object-contain select-none ${heightClass} ${className}`}
      />
    );
  }

  // Precision vector fallback matching Logo 2.jpg
  return (
    <div
      className={`inline-flex flex-col items-start select-none ${className}`}
      aria-label="KP Informative Technologies"
    >
      <div className="flex items-center gap-3">
        <svg
          viewBox="0 0 120 100"
          className={variant === 'header' ? 'h-10 w-auto' : 'h-12 w-auto'}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="kpitLogoGrad" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#143E68" />
              <stop offset="52%" stopColor="#1F78B4" />
              <stop offset="100%" stopColor="#2AA7EA" />
            </linearGradient>
          </defs>
          {/* Outer & Inner Interlocking KP Ribbon Monogram */}
          <path
            d="M14 14 H32 V44 M14 14 V86 L68 14 H92 C106 14 112 24 112 35 C112 46 106 56 92 56 H68 V86 L46 64"
            stroke="url(#kpitLogoGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M36 56 L66 34 H88"
            stroke="url(#kpitLogoGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="leading-[1.05] tracking-tight font-bold text-[#07090E]">
          <span className="block text-base sm:text-lg">KP Informative</span>
          <span className="block text-base sm:text-lg">Technologies</span>
        </div>
      </div>
      {variant !== 'badge' && (
        <span className="mt-0.5 text-[10px] font-semibold italic tracking-tight text-[#07090E]">
          A legacy of innovation, A future of endless possibilities
        </span>
      )}
    </div>
  );
};
