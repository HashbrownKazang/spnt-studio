import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface HeroProps {
  title: string;
  subtitle: string;
  imageSrc: string;
}

export function Hero({
  title,
  subtitle,
  imageSrc
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
        <Button 
          variant="default" 
          size="lg"
          onClick={() => window.location.href = '/episodes/latest'}
        >
          Listen now
        </Button>
      </div>
    </div>
  );
}
