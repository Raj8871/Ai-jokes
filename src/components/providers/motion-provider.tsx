'use client';

import { LazyMotion, domAnimation } from 'framer-motion';
import type { ReactNode } from 'react';

interface MotionProviderProps {
  children: ReactNode;
}

export function MotionProvider({ children }: MotionProviderProps) {
  // Using LazyMotion helps reduce bundle size by only loading the animation features needed.
  // domAnimation includes the basic features for DOM animations (style, variants, gestures, etc.).
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
