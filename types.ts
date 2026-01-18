
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'Admin' | 'Customer';
  phoneNumber: string;
  location: string;
  image?: string;
  createdAt: string;
}

export interface Room {
  id: number;
  name: string;
  description?: string;
  image?: string;
  type: 'VIP' | 'Standard' | 'Streaming' | 'Cinema' | 'Matches';
  pricePerHour: number;
  isAvailable: boolean;
  psModel: string;
}

export interface Booking {
  id: string;
  roomId: number;
  userId: string;
  date: string; // YYYY-MM-DD
  startTime: number; // 0-23 hour
  duration: number;
  totalPrice: number;
  depositAmount: number;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Rejected';
  timestamp: string;
  paymentStatus: 'Unpaid' | 'Paid';
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  image?: string;
  category: 'Drink' | 'Snack' | 'Meal';
  price: number;
  stock: number;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  items: { productId: number; quantity: number }[];
  total: number;
  status: 'Pending' | 'Processing' | 'On the way' | 'Delivered' | 'Rejected';
  timestamp: string;
  orderType: 'DineIn' | 'Delivery';
  location: string;
  phoneNumber?: string;
  paymentStatus: 'Unpaid' | 'Paid';
}

export interface Ad {
  id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
  isPermanent: boolean;
  expiresAt?: string; // ISO string
  createdAt: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  method: 'Instapay';
  status: 'Pending' | 'Success' | 'Failed';
  referenceId: string;
}
