import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-ink/85 text-ember backdrop-blur-md',
        secondary: 'border-transparent bg-bone-2 text-ink',
        success: 'border-moss/30 bg-moss/15 text-moss',
        warning: 'border-ember/30 bg-ember/15 text-ember-2',
        destructive: 'border-red-500/20 bg-red-500/10 text-red-600',
        outline: 'border-ink/15 text-ink/70',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
