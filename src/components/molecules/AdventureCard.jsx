import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

/**
 * Terrain category card — bold index, background image, hover zoom.
 */
export default function AdventureCard({ icon: Icon, label, slug, img, index = 1 }) {
  return (
    <Link
      href={`/gears?category=${slug}`}
      className="group relative block h-64 rounded-md overflow-hidden border-2 border-ink/10 hover:border-ember transition-colors bg-char"
    >
      <img
        src={img}
        alt=""
        aria-hidden="true"
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-char via-char/45 to-char/5" />

      <span className="absolute top-4 left-4 font-display font-bold text-4xl leading-none text-white/85 gn-stroke">
        0{index}
      </span>
      <Icon className="absolute top-5 right-5 w-6 h-6 text-white/80" strokeWidth={2} />

      <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-trail-2 mb-1">Terrain</p>
        <div className="flex items-end justify-between">
          <h3 className="font-display font-bold uppercase text-2xl text-white leading-none tracking-tight">{label}</h3>
          <span className="grid place-items-center w-9 h-9 rounded-md bg-white/15 group-hover:bg-ember text-white transition-colors shrink-0">
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
