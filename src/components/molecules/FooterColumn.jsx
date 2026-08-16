import React from 'react';
import Link from 'next/link';

/**
 * Footer navigation column with title and link list.
 */
export default function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="font-display font-semibold text-white text-sm uppercase tracking-wide mb-4">{title}</h4>
      <ul className="space-y-2.5 text-xs">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link href={href} className="text-sand/70 hover:text-ember transition-colors">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
