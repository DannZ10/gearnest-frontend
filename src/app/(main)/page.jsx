'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'sonner';

import HeroSection from '@/components/organisms/HeroSection';
import Marquee from '@/components/organisms/Marquee';
import StatsBar from '@/components/organisms/StatsBar';
import AdventureGrid from '@/components/organisms/AdventureGrid';
import FeaturedGearGrid from '@/components/organisms/FeaturedGearGrid';
import HowItWorks from '@/components/organisms/HowItWorks';
import CtaBand from '@/components/organisms/CtaBand';

export default function HomePage() {
  const [featuredGears, setFeaturedGears] = useState([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function fetchData() {
      try {
        const gearRes = await api.get('/gears?limit=8');
        setFeaturedGears(gearRes.data.data || []);
      } catch (err) {
        console.error('Failed fetching home data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleAddToCart = (gear) => {
    addItem(gear, 1);
    toast.success(`${gear.name} ditambahkan ke keranjang!`);
  };

  return (
    <div className="pb-16">
      <HeroSection />
      <Marquee />
      <AdventureGrid />
      <FeaturedGearGrid
        gears={featuredGears}
        loading={loading}
        onAddToCart={handleAddToCart}
      />
      <StatsBar />
      <HowItWorks />
      <CtaBand />
    </div>
  );
}
