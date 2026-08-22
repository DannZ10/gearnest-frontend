'use client';

import React from 'react';

const ITEMS = [
  'Tenda', 'Carrier', 'Sleeping Bag', 'Trekking Pole', 'Headlamp',
  'Kompor Lapangan', 'Matras', 'Raincoat', 'Sepatu Gunung', 'Nesting',
];

function Row() {
  return (
    <>
      {ITEMS.map((t, i) => (
        <span key={i} className="inline-flex items-center">
          <span className="px-8 font-display font-bold uppercase text-2xl sm:text-3xl tracking-tight text-bone/90">
            {t}
          </span>
          <span className="text-ember text-lg" aria-hidden="true">&#10022;</span>
        </span>
      ))}
    </>
  );
}

// Bold kinetic ticker of gear categories. The track holds two identical rows
// and slides by -50%, so the loop is seamless.
export default function Marquee() {
  return (
    <div className="gn-marquee relative overflow-hidden bg-ink border-y-2 border-char py-4 select-none" aria-hidden="true">
      <div className="gn-marquee-track">
        <Row />
        <Row />
      </div>
    </div>
  );
}
