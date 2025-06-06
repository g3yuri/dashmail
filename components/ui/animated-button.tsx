"use client";

import { useRef } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends ButtonProps {
  hoverScale?: number;
  hoverDuration?: number;
}

export function AnimatedButton({
  children,
  className,
  hoverScale = 1.05,
  hoverDuration = 0.3,
  ...props
}: AnimatedButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = () => {
    if (ref.current) {
      gsap.to(ref.current, {
        scale: hoverScale,
        duration: hoverDuration,
        ease: "power2.out"
      });
    }
  };

  const handleMouseLeave = () => {
    if (ref.current) {
      gsap.to(ref.current, {
        scale: 1,
        duration: hoverDuration,
        ease: "power2.out"
      });
    }
  };

  return (
    <Button
      ref={ref}
      className={cn("transition-none", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </Button>
  );
} 