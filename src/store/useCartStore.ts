import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Gear, DeliveryType } from '@/types';

export interface CartItem {
  gear: Gear;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  startDate: string | null;
  endDate: string | null;
  deliveryType: DeliveryType;
  deliveryAddress: string;
  deliveryDistanceKm: number;
  addItem: (gear: Gear, quantity?: number) => void;
  removeItem: (gearId: number) => void;
  updateQuantity: (gearId: number, quantity: number) => void;
  setBookingDates: (startDate: string, endDate: string) => void;
  setDeliveryInfo: (type: DeliveryType, address?: string, distanceKm?: number) => void;
  clearCart: () => void;
  getDurationDays: () => number;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      startDate: null,
      endDate: null,
      deliveryType: 'pickup',
      deliveryAddress: '',
      deliveryDistanceKm: 0,

      addItem: (gear, quantity = 1) => {
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex((i) => i.gear.id === gear.id);

        if (existingIndex > -1) {
          const updated = [...currentItems];
          const newQty = Math.min(updated[existingIndex].quantity + quantity, gear.stock_available);
          updated[existingIndex].quantity = newQty;
          set({ items: updated });
        } else {
          set({ items: [...currentItems, { gear, quantity: Math.min(quantity, gear.stock_available) }] });
        }
      },

      removeItem: (gearId) => {
        set({ items: get().items.filter((i) => i.gear.id !== gearId) });
      },

      updateQuantity: (gearId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(gearId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.gear.id === gearId
              ? { ...i, quantity: Math.min(quantity, i.gear.stock_available) }
              : i
          ),
        });
      },

      setBookingDates: (startDate, endDate) => {
        set({ startDate, endDate });
      },

      setDeliveryInfo: (type, address = '', distanceKm = 0) => {
        set({
          deliveryType: type,
          deliveryAddress: address,
          deliveryDistanceKm: distanceKm,
        });
      },

      clearCart: () => {
        set({ items: [], startDate: null, endDate: null, deliveryAddress: '', deliveryDistanceKm: 0 });
      },

      getDurationDays: () => {
        const { startDate, endDate } = get();
        if (!startDate || !endDate) return 1;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 1;
      },

      getSubtotal: () => {
        const duration = get().getDurationDays();
        return get().items.reduce((acc, item) => acc + item.gear.price_per_day * item.quantity * duration, 0);
      },

      getDeliveryFee: () => {
        const { deliveryType, deliveryDistanceKm } = get();
        if (deliveryType === 'pickup') return 0;
        return 10000 + (deliveryDistanceKm * 3000);
      },

      getTotalPrice: () => {
        return get().getSubtotal() + get().getDeliveryFee();
      },
    }),
    {
      name: 'gearnest-cart-store',
    }
  )
);
