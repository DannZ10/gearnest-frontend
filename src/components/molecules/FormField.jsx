import React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/**
 * Form field wrapper with icon overlay and label.
 * Used in login/register forms.
 */
export default function FormField({ icon: Icon, label, children, className }) {
  return (
    <div className={cn(className)}>
      <Label>{label}</Label>
      <div className="relative">
        <Icon className="w-4 h-4 absolute left-3.5 top-3.5 text-ink/40" />
        {children}
      </div>
    </div>
  );
}
