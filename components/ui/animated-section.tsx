"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fadeUp' | 'fadeLeft' | 'fadeRight' | 'scale' | 'none';
  delay?: number;
  duration?: number;
  stagger?: number;
}

export function AnimatedSection({
  children,
  className = '',
  animation = 'fadeUp',
  delay = 0,
  duration = 0.8,
  stagger = 0.1
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || animation === 'none') return;

    const element = ref.current;
    
    let fromVars: gsap.TweenVars = {};
    const toVars: gsap.TweenVars = {
      opacity: 1,
      duration,
      ease: "power3.out",
      delay,
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    };

    switch (animation) {
      case 'fadeUp':
        fromVars = { y: 50, opacity: 0 };
        toVars.y = 0;
        break;
      case 'fadeLeft':
        fromVars = { x: -50, opacity: 0 };
        toVars.x = 0;
        break;
      case 'fadeRight':
        fromVars = { x: 50, opacity: 0 };
        toVars.x = 0;
        break;
      case 'scale':
        fromVars = { scale: 0.8, opacity: 0 };
        toVars.scale = 1;
        break;
    }

    // Animar elementos hijos si tienen la clase 'animate-child'
    const children = element.querySelectorAll('.animate-child');
    if (children.length > 0) {
      toVars.stagger = stagger;
      gsap.fromTo(children, fromVars, toVars);
    } else {
      gsap.fromTo(element, fromVars, toVars);
    }

  }, [animation, delay, duration, stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
} 