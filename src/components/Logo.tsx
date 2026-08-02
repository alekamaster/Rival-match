import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
  };

  const textClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* RivalMatch Icon */}
      <div className={`relative ${sizeClasses[size]} aspect-square flex items-center justify-center shrink-0`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Soccer Ball Globe Lines */}
          <circle cx="50" cy="50" r="42" stroke="#ffffff" strokeWidth="6" strokeOpacity="0.2" />
          <circle cx="50" cy="50" r="42" stroke="#4edea3" strokeWidth="6" strokeDasharray="25 15" strokeDashoffset="10" />
          
          {/* Pentagon Soccer pattern lines */}
          <path d="M50 25 L65 36 L59 54 L41 54 L35 36 Z" stroke="#ffffff" strokeWidth="4" strokeLinejoin="round" fill="none" opacity="0.6" />
          <path d="M50 25 L50 8" stroke="#ffffff" strokeWidth="4" opacity="0.6" />
          <path d="M65 36 L80 30" stroke="#ffffff" strokeWidth="4" opacity="0.6" />
          <path d="M59 54 L72 68" stroke="#ffffff" strokeWidth="4" opacity="0.6" />
          <path d="M41 54 L28 68" stroke="#ffffff" strokeWidth="4" opacity="0.6" />
          <path d="M35 36 L20 30" stroke="#ffffff" strokeWidth="4" opacity="0.6" />

          {/* Top Swirling Arrow (Green) */}
          <path
            d="M 22 50 C 22 30, 40 18, 75 22"
            stroke="#4edea3"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 66 12 L 80 23 L 64 33"
            fill="none"
            stroke="#4edea3"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Bottom Swirling Arrow (White) */}
          <path
            d="M 78 50 C 78 70, 60 82, 25 78"
            stroke="#ffffff"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 34 88 L 20 77 L 36 67"
            fill="none"
            stroke="#ffffff"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {showText && (
        <div className={`font-extrabold tracking-tight ${textClasses[size]} flex items-center leading-none`}>
          <span className="text-[#4edea3]">Rival</span>
          <span className="text-white">Match</span>
        </div>
      )}
    </div>
  );
};
