import React, { useState } from 'react';
import { BookOpen, Server, Layers, ShieldCheck } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  fallbackSubtitle?: string;
  fallbackVariant?: 'campus' | 'lms' | 'cloud' | 'team';
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle = 'KP Informative Technologies',
  fallbackSubtitle = 'Education Technology & Digital Infrastructure',
  fallbackVariant = 'campus',
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    const IconComponent =
      fallbackVariant === 'lms'
        ? BookOpen
        : fallbackVariant === 'cloud'
          ? Server
          : fallbackVariant === 'team'
            ? ShieldCheck
            : Layers;

    return (
      <div
        role="img"
        aria-label={alt}
        className={`relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#004BBE] p-6 text-white ${className}`}
      >
        <div className="flex items-center justify-between text-xs text-slate-300 font-mono-tabular">
          <span>KP Informative Technologies</span>
          <span>Johannesburg, ZA</span>
        </div>
        <div className="my-auto py-6">
          <IconComponent className="h-10 w-10 text-[#38BDF8] mb-3" aria-hidden="true" />
          <p className="font-display text-lg font-semibold tracking-tight text-white">
            {fallbackTitle}
          </p>
          <p className="mt-1 text-xs text-slate-300 max-w-md">{fallbackSubtitle}</p>
        </div>
        <div className="text-xs text-slate-400">
          <span>LMS Architecture · Managed Cloud · Campus Portals</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
