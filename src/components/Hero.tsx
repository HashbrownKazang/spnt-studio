import React from 'react';
import Image from 'next/image';

interface HeroProps {
  title: string;
  subtitle: string;
  imageSrc: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

export function Hero({
  title,
  subtitle,
  imageSrc,
  ctaText,
  onCtaClick
}: HeroProps) {
  return (
    <div className="relative w-full h-[500px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt="Hero background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          {title}
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl">
          {subtitle}
        </p>
        {ctaText && (
          <button
            onClick={onCtaClick}
            className="px-8 py-3 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-colors"
          >
            {ctaText}
          </button>
        )}
      </div>
    </div>
  );
}
