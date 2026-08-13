export type UserRole = 'admin' | 'customer';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: UserRole;
  created_at: string;
}

export interface GearCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  gears_count?: number;
}

export interface Gear {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description?: string;
  brand?: string;
  price_per_day: number;
  stock_total: number;
  stock_available: number;
  image_url?: string;
  weight_kg?: number;
  is_available: boolean;
  category?: GearCategory;
}

export type DeliveryType = 'pickup' | 'delivery';
export type BookingStatus = 'pending' | 'confirmed' | 'active' | 'returned' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'expired' | 'refunded';

export interface BookingItem {
  id: number;
  booking_id: number;
  gear_id: number;
  quantity: number;
  price_per_day: number;
  line_total: number;
  gear?: Gear;
}

export interface Payment {
  id: number;
  booking_id: number;
  gateway: string;
  external_id?: string;
  payment_url?: string;
  method?: string;
  amount: number;
  status: PaymentStatus;
  paid_at?: string;
  expired_at?: string;
}

export interface Booking {
  id: number;
  user_id: number;
  booking_code: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  delivery_type: DeliveryType;
  delivery_address?: string;
  delivery_distance_km?: number;
  delivery_fee: number;
  subtotal: number;
  total_price: number;
  status: BookingStatus;
  identity_verified: boolean;
  notes?: string;
  created_at: string;
  user?: User;
  items?: BookingItem[];
  payment?: Payment;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
