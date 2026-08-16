import React from 'react';
import { Card } from '@/components/ui/card';

/**
 * "How It Works" step card with numbered indicator.
 */
export default function StepCard({ number, title, description }) {
  return (
    <Card className="h-full p-6 hover:-translate-y-1 transition-transform">
      <span className="grid place-items-center w-12 h-12 rounded-2xl bg-ink text-ember font-display font-bold text-xl">
        {number}
      </span>
      <h4 className="font-display font-semibold uppercase tracking-wide text-ink text-base mt-4">
        {title}
      </h4>
      <p className="text-xs text-ink/60 mt-1.5 leading-relaxed">{description}</p>
    </Card>
  );
}
