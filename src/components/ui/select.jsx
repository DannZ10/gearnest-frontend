import * as React from 'react';
import { cn } from '@/lib/utils';

const Select = React.forwardRef(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      'flex w-full rounded-xl border border-ink/15 bg-bone px-4 py-2.5 text-sm text-ink transition-colors focus-visible:outline-none focus-visible:border-ember disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = 'Select';

export { Select };
