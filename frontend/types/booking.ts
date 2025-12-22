export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED' | 'PARTIAL_REFUND';
export type ServiceCategory = 'CUT' | 'PERM' | 'DYE' | 'TREATMENT';

export interface Shop {
  id: number;
  name: string;
  description?: string;
  address: string;
  phone: string;
  mainImageUrl?: string;
  openingTime?: string;
  closingTime?: string;
  district?: string;
  neighborhood?: string;
  rating?: number;
}

export interface Service {
  id: number;
  shopId: number;
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  category: ServiceCategory;
  isActive: boolean;
}

export interface Reservation {
  id: number;
  shopId: number;
  shopName: string;
  customerId: number;
  serviceId: number;
  serviceName: string;
  reservationDate: string;
  reservationTime: string;
  totalPrice: number;
  status: ReservationStatus;
  customerNote?: string;
  ownerNote?: string;
  createdAt: string;
}

export interface Payment {
  id: number;
  reservationId: number;
  paymentKey?: string;
  orderId: string;
  amount: number;
  paymentMethod?: string;
  status: PaymentStatus;
  approvedAt?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface AvailableSlots {
  date: string;
  availableSlots: TimeSlot[];
}

export interface Review {
  id: number;
  shopId: number;
  customerId: number;
  customerName: string;
  reservationId: number;
  rating: number;
  content?: string;
  images?: string[];
  ownerReply?: string;
  ownerRepliedAt?: string;
  createdAt: string;
}
