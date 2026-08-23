import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// A cart line is identified by gear + chosen variant, so the same gear in two
// sizes/colors are two distinct lines.
export const cartLineKey = (gearId, variantId) => `${gearId}:${variantId ?? 'base'}`;

const maxStockFor = (gear, variant) =>
  variant ? Number(variant.stock ?? 0) : Number(gear.stock_available ?? gear.stock_total ?? 10);

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      startDate: null,
      endDate: null,
      deliveryType: 'pickup',
      deliveryAddress: '',
      deliveryMapsUrl: '',
      deliveryDistanceKm: 0,
      deliveryFee: 0, // authoritative value comes from the server /delivery/quote
      paymentMethod: 'online', // 'online' (Midtrans) | 'onsite' (bayar di tempat via WhatsApp)

      addItem: (gear, quantity = 1, variant = null) => {
        const items = get().items;
        const key = cartLineKey(gear.id, variant?.id);
        const max = maxStockFor(gear, variant);
        const idx = items.findIndex((i) => cartLineKey(i.gear.id, i.variant?.id) === key);

        if (idx > -1) {
          const updated = [...items];
          updated[idx] = { ...updated[idx], quantity: Math.min(updated[idx].quantity + quantity, max) };
          set({ items: updated });
        } else {
          set({ items: [...items, { gear, variant, quantity: Math.min(quantity, max) }] });
        }
      },

      removeItem: (key) => {
        set({ items: get().items.filter((i) => cartLineKey(i.gear.id, i.variant?.id) !== key) });
      },

      updateQuantity: (key, quantity) => {
        if (quantity <= 0) {
          get().removeItem(key);
          return;
        }
        set({
          items: get().items.map((i) => {
            if (cartLineKey(i.gear.id, i.variant?.id) !== key) return i;
            return { ...i, quantity: Math.min(quantity, maxStockFor(i.gear, i.variant)) };
          }),
        });
      },

      setBookingDates: (startDate, endDate) => set({ startDate, endDate }),

      // Changing type/address/link invalidates any previous quote until re-fetched.
      setDeliveryInfo: (type, address = '', mapsUrl = '') => {
        set({
          deliveryType: type,
          deliveryAddress: address,
          deliveryMapsUrl: mapsUrl,
          deliveryDistanceKm: 0,
          deliveryFee: 0,
        });
      },

      setDeliveryQuote: ({ distanceKm = 0, deliveryFee = 0 }) => {
        set({ deliveryDistanceKm: Number(distanceKm) || 0, deliveryFee: Number(deliveryFee) || 0 });
      },

      setPaymentMethod: (method) => set({ paymentMethod: method }),

      clearCart: () => {
        set({
          items: [],
          startDate: null,
          endDate: null,
          deliveryType: 'pickup',
          deliveryAddress: '',
          deliveryMapsUrl: '',
          deliveryDistanceKm: 0,
          deliveryFee: 0,
          paymentMethod: 'online',
        });
      },

      getDurationDays: () => {
        const { startDate, endDate } = get();
        if (!startDate || !endDate) return 1;
        const diffTime = Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 1;
      },

      getTotalWeightKg: () =>
        get().items.reduce((acc, i) => acc + (Number(i.gear.weight_kg) || 0) * i.quantity, 0),

      getSubtotal: () => {
        const duration = get().getDurationDays();
        return get().items.reduce(
          (acc, i) => acc + (Number(i.gear.price_per_day) || 0) * i.quantity * duration,
          0
        );
      },

      getDeliveryFee: () => (get().deliveryType === 'pickup' ? 0 : Number(get().deliveryFee) || 0),

      getTotalPrice: () => get().getSubtotal() + get().getDeliveryFee(),
    }),
    {
      name: 'gearnest-cart-store',
    }
  )
);
