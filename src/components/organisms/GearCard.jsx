'use client';

import React from 'react';
import { rupiah } from '@/lib/useReveal';

/**
 * Design-system gear card (from a live API gear object). Clicking opens the
 * detail modal via `onOpen`. Reused on the landing catalog and the /gears page.
 */
export default function GearCard({ gear, onOpen, index = 0 }) {
  const stock = Number(gear.stock_available ?? 0);
  const low = stock <= 5;
  const category = gear.category?.name || gear.category_name || 'Gear';
  const img = gear.image_url || '/img/tenda-dome.webp';

  return (
    <article
      className="gear-card"
      style={{ '--i': index }}
      tabIndex={0}
      role="button"
      aria-label={`Lihat detail ${gear.name}`}
      onClick={() => onOpen?.(gear)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onOpen?.(gear))}
    >
      <div className="gear-media">
        <img src={img} alt={gear.name} loading="lazy" onError={(e) => { e.currentTarget.src = '/img/tenda-dome.webp'; }} />
        <span className="gear-cat-badge">{category}</span>
        <span className={`gear-stock${low ? ' low' : ''}`}>{low ? `Stok ${stock}` : `Tersedia ${stock}`}</span>
      </div>
      <div className="gear-body">
        <h3>{gear.name}</h3>
        {gear.description && <p className="gear-desc">{gear.description}</p>}
        {gear.brand && (
          <div className="gear-rating">
            <span className="val">{gear.brand}</span>
          </div>
        )}
        <div className="gear-foot">
          <span className="gear-price">{rupiah(gear.price_per_day)}<small>/hari</small></span>
          <span className="detail">Lihat Detail</span>
        </div>
      </div>
    </article>
  );
}
