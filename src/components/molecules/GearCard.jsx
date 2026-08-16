'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PriceTag from '@/components/atoms/PriceTag';
import { ShoppingBag } from 'lucide-react';

/**
 * Gear product card used on landing page and catalog.
 * Displays image, brand badge, stock badge, name, description, price, and add-to-cart.
 */
export default function GearCard({ gear, onAddToCart }) {
  return (
    <Card className="group h-full overflow-hidden flex flex-col hover:border-ember/40 transition-all hover:shadow-xl hover:shadow-ink/5">
      <div className="relative h-44 bg-bone-2 overflow-hidden">
        <img
          src={gear.image_url || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500&auto=format&fit=crop&q=80'}
          alt={gear.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <Badge className="absolute top-3 left-3">
          {gear.brand || gear.category?.name || 'Outdoor'}
        </Badge>
        <Badge variant="success" className="absolute top-3 right-3 backdrop-blur-md bg-moss/90 text-white border-transparent">
          Stok: {gear.stock_available}
        </Badge>
      </div>

      <div className="p-5 flex-grow flex flex-col justify-between gap-4">
        <div>
          <h3 className="font-display font-semibold text-ink text-base uppercase tracking-wide line-clamp-1 group-hover:text-ember transition-colors">
            {gear.name}
          </h3>
          <p className="text-xs text-ink/55 line-clamp-2 mt-1">
            {gear.description || 'Peralatan outdoor berkualitas tinggi.'}
          </p>
        </div>

        <div className="pt-3 border-t border-ink/10 flex items-center justify-between">
          <PriceTag amount={gear.price_per_day} />
          <Button
            size="icon"
            onClick={() => onAddToCart?.(gear)}
            className="p-3 shadow-md shadow-ember/20 active:scale-95"
            title="Tambah ke Keranjang"
          >
            <ShoppingBag className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
