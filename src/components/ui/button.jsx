import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-ember hover:bg-ember-2 text-white shadow-lg shadow-ember/25 font-display uppercase tracking-wide',
        secondary:
          'bg-bone-2 hover:bg-sand/40 text-ink border border-ink/10',
        outline:
          'border border-white/25 hover:border-white/60 text-white font-display uppercase tracking-wide',
        ghost:
          'hover:bg-bone-2 text-ink/70 hover:text-ink',
        destructive:
          'bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-500/20',
        link:
          'text-ember-2 underline-offset-4 hover:underline',
      },
      size: {
        default: 'px-6 py-3',
        sm: 'px-4 py-2.5 text-xs',
        lg: 'px-8 py-4',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
