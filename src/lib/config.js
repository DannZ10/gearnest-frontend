import { formatRupiah, formatDate } from '@/lib/format';

// Admin WhatsApp number for "bayar di tempat" confirmation (international format,
// no +, no spaces). Override via NEXT_PUBLIC_ADMIN_WHATSAPP in .env.local.
export const ADMIN_WHATSAPP = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '6281217409277';

/** Build a wa.me link with a pre-filled confirmation template for an on-site booking. */
export function buildWhatsAppUrl(booking, { items, deliveryType, deliveryAddress, deliveryMapsUrl, durationDays, total }) {
  const lines = items.map((i) => {
    const variant = i.variant?.label ? ` (${i.variant.label})` : '';
    return `• ${i.quantity}x ${i.gear.name}${variant}`;
  });

  const parts = [
    'Halo Admin Kembara.id! 👋',
    'Saya mau konfirmasi penyewaan dengan *bayar di tempat*:',
    '',
    `*Kode Booking:* ${booking.booking_code}`,
    `*Periode:* ${formatDate(booking.start_date)} s/d ${formatDate(booking.end_date)} (${durationDays} hari)`,
    `*Metode:* ${deliveryType === 'delivery' ? 'Diantar' : 'Ambil di basecamp'}`,
    ...(deliveryType === 'delivery' && deliveryAddress ? [`*Alamat:* ${deliveryAddress}`] : []),
    ...(deliveryType === 'delivery' && deliveryMapsUrl ? [`*Lokasi:* ${deliveryMapsUrl}`] : []),
    '',
    '*Item:*',
    ...lines,
    '',
    `*Total:* ${formatRupiah(total)}`,
    '',
    'Mohon dikonfirmasi ketersediaan & jadwal serah terimanya. Terima kasih! 🙏',
  ];

  return `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(parts.join('\n'))}`;
}
