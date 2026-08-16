import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * Adventure category card with background image, icon, and hover effect.
 */
export default function AdventureCard({ icon: Icon, label, slug, img, from, to }) {
  return (
    <Link
      href={`/gears?category=${slug}`}
      className={`group relative block h-56 rounded-3xl overflow-hidden border border-ink/10 bg-gradient-to-b ${from} ${to}`}
    >
      <img
        src={img}
        alt=""
        aria-hidden="true"
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/40 to-ink/10" />
      <div className="absolute inset-0 gn-topo opacity-40" />
      <Icon className="absolute top-5 left-5 w-8 h-8 text-white/90" strokeWidth={1.75} />
      <div className="absolute bottom-0 inset-x-0 p-5 flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Gear</p>
          <h3 className="font-display font-bold uppercase text-xl text-white leading-tight">{label}</h3>
        </div>
        <span className="grid place-items-center w-9 h-9 rounded-full bg-white/15 group-hover:bg-ember text-white transition-colors">
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}
