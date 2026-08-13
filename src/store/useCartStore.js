import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
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
          const maxStock = gear.stock_available || gear.stock_total || 10;
          const newQty = Math.min(updated[existingIndex].quantity + quantity, maxStock);
          updated[existingIndex].quantity = newQty;
          set({ items: updated });
        } else {
          const maxStock = gear.stock_available || gear.stock_total || 10;
          set({ items: [...currentItems, { gear, quantity: Math.min(quantity, maxStock) }] });
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
          items: get().items.map((i) => {
            if (i.gear.id === gearId) {
              const maxStock = i.gear.stock_available || i.gear.stock_total || 10;
              return { ...i, quantity: Math.min(quantity, maxStock) };
            }
            return i;
          }),
        });
      },

      setBookingDates: (startDate, endDate) => {
        set({ startDate, endDate });
      },

      setDeliveryInfo: (type, address = '', distanceKm = 0) => {
        set({
          deliveryType: type,
          deliveryAddress: address,
          deliveryDistanceKm: Number(distanceKm) || 0,
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
        return get().items.reduce((acc, item) => {
          const price = Number(item.gear.price_per_day) || 0;
          return acc + price * item.quantity * duration;
        }, 0);
      },

      getDeliveryFee: () => {
        const { deliveryType, deliveryDistanceKm } = get();
        if (deliveryType === 'pickup') return 0;
        const km = Number(deliveryDistanceKm) || 0;
        return 10000 + km * 3000;
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
