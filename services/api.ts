import { Room, Booking, Product, Order, User, Ad } from '../types';

export interface IBlackLightAPI {
  getUsers(): Promise<User[]>;
  register(userData: Omit<User, 'id' | 'createdAt' | 'role'>): Promise<User>;
  login(email: string, pass: string): Promise<User | null>;
  updateUser(userId: string, data: Partial<User>): Promise<User>;
  getRooms(): Promise<Room[]>;
  saveRoom(room: Room): Promise<void>;
  deleteRoom(id: number): Promise<void>;
  getProducts(): Promise<Product[]>;
  saveProduct(product: Product): Promise<void>;
  deleteProduct(id: number): Promise<void>;
  getAds(): Promise<Ad[]>;
  saveAd(ad: Partial<Ad>): Promise<void>;
  deleteAd(id: string): Promise<void>;
  getBookings(): Promise<Booking[]>;
  createBooking(booking: Omit<Booking, 'id' | 'timestamp' | 'paymentStatus'>): Promise<Booking>;
  updateBookingStatus(id: string, status: Booking['status']): Promise<void>;
  getOrders(): Promise<Order[]>;
  placeOrder(orderData: Omit<Order, 'id' | 'timestamp' | 'paymentStatus'>): Promise<Order>;
  updateOrderStatus(id: string, status: Order['status']): Promise<void>;
  markPaid(type: 'order' | 'booking', id: string): Promise<void>;
}

// Helper to safely get environment variables
const getViteEnv = (key: string): string | undefined => {
  try {
    // Attempt to access via import.meta.env (Vite standard)
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      return (import.meta as any).env[key];
    }
    // Fallback for some environments that might use process.env
    if (typeof process !== 'undefined' && process.env) {
      return (process.env as any)[key];
    }
  } catch (e) {
    console.warn(`Environment variable ${key} could not be retrieved:`, e);
  }
  return undefined;
};

const INITIAL_ROOMS: Room[] = [
  { id: 1, name: 'Cyberpunk Suite', type: 'VIP', pricePerHour: 150, isAvailable: true, psModel: 'PS5 Pro', description: 'Ultimate gaming experience with RGB lighting and premium seating.', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600' },
  { id: 2, name: 'The Neon Den', type: 'Standard', pricePerHour: 80, isAvailable: true, psModel: 'PS5 Slim', description: 'Cozy neon atmosphere for casual gaming.', image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=600' },
];

const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: 'Espresso Double', category: 'Drink', price: 45, stock: 100, description: 'Freshly roasted premium double espresso.', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=400' },
  { id: 4, name: 'Classic Burger', category: 'Meal', price: 120, stock: 20, description: 'Juicy beef patty with fresh vegetables.', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400' },
];

const INITIAL_ADS: Ad[] = [
  { id: 'ad_1', title: 'FC 24 TOURNAMENT', description: 'Join the weekend clash for a prize pool of 5000 EGP.', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800', isPermanent: true, createdAt: new Date().toISOString() }
];

const DEFAULT_ADMIN: User = {
  id: 'admin_1',
  email: 'blacklight@game.com',
  password: 'Mm123456!',
  name: 'Black Light Admin',
  role: 'Admin',
  phoneNumber: '010 68517773',
  location: 'El-Mahmudiya, Egypt',
  createdAt: new Date().toISOString(),
  image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
};

class MockBackend implements IBlackLightAPI {
  private getStorage<T>(key: string, initial: T): T {
    const data = localStorage.getItem(`bl_v8_${key}`);
    return data ? JSON.parse(data) : initial;
  }
  private setStorage<T>(key: string, data: T): void {
    localStorage.setItem(`bl_v8_${key}`, JSON.stringify(data));
  }
  async getUsers(): Promise<User[]> { return this.getStorage('users', [DEFAULT_ADMIN]); }
  async register(userData: any): Promise<User> {
    const users = await this.getUsers();
    const newUser = { ...userData, id: Math.random().toString(36).substr(2, 9), role: 'Customer', createdAt: new Date().toISOString() };
    this.setStorage('users', [...users, newUser]);
    return newUser;
  }
  async login(email: string, pass: string): Promise<User | null> {
    const users = await this.getUsers();
    return users.find(u => u.email === email && u.password === pass) || null;
  }
  async updateUser(userId: string, data: any): Promise<User> {
    const users = await this.getUsers();
    const updated = users.map(u => u.id === userId ? { ...u, ...data } : u);
    this.setStorage('users', updated);
    return updated.find(u => u.id === userId)!;
  }
  async getRooms(): Promise<Room[]> { return this.getStorage('rooms', INITIAL_ROOMS); }
  async saveRoom(room: Room): Promise<void> {
    const rooms = await this.getRooms();
    const index = rooms.findIndex(r => r.id === room.id);
    if (index >= 0) rooms[index] = room; else rooms.push({ ...room, id: rooms.length + 1 });
    this.setStorage('rooms', rooms);
  }
  async deleteRoom(id: number): Promise<void> {
    const rooms = await this.getRooms();
    this.setStorage('rooms', rooms.filter(r => r.id !== id));
  }
  async getProducts(): Promise<Product[]> { return this.getStorage('products', INITIAL_PRODUCTS); }
  async saveProduct(product: Product): Promise<void> {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) products[index] = product; else products.push({ ...product, id: products.length + 1 });
    this.setStorage('products', products);
  }
  async deleteProduct(id: number): Promise<void> {
    const products = await this.getProducts();
    this.setStorage('products', products.filter(p => p.id !== id));
  }
  async getAds(): Promise<Ad[]> { return this.getStorage('ads', INITIAL_ADS); }
  async saveAd(ad: any): Promise<void> {
    const ads = await this.getAds();
    ads.push(ad);
    this.setStorage('ads', ads);
  }
  async deleteAd(id: string): Promise<void> {
    const ads = await this.getAds();
    this.setStorage('ads', ads.filter(a => a.id !== id));
  }
  async getBookings(): Promise<Booking[]> { return this.getStorage('bookings', []); }
  async createBooking(booking: any): Promise<Booking> {
    const bookings = await this.getBookings();
    const newB = { ...booking, id: 'BK-' + Date.now(), timestamp: new Date().toISOString(), paymentStatus: 'Unpaid' };
    this.setStorage('bookings', [...bookings, newB]);
    return newB;
  }
  async updateBookingStatus(id: string, status: any): Promise<void> {
    const b = await this.getBookings();
    this.setStorage('bookings', b.map(x => x.id === id ? { ...x, status } : x));
  }
  async getOrders(): Promise<Order[]> { return this.getStorage('orders', []); }
  async placeOrder(order: any): Promise<Order> {
    const o = await this.getOrders();
    const newO = { ...order, id: 'ORD-' + Date.now(), timestamp: new Date().toISOString(), paymentStatus: 'Unpaid' };
    this.setStorage('orders', [...o, newO]);
    return newO;
  }
  async updateOrderStatus(id: string, status: any): Promise<void> {
    const o = await this.getOrders();
    this.setStorage('orders', o.map(x => x.id === id ? { ...x, status } : x));
  }
  async markPaid(type: string, id: string): Promise<void> {
    if (type === 'order') {
      const o = await this.getOrders();
      this.setStorage('orders', o.map(x => x.id === id ? { ...x, paymentStatus: 'Paid' } : x));
    } else {
      const b = await this.getBookings();
      this.setStorage('bookings', b.map(x => x.id === id ? { ...x, paymentStatus: 'Paid' } : x));
    }
  }
}

class RealBackend implements IBlackLightAPI {
  private baseUrl = getViteEnv('VITE_API_URL') || '';

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('bl_token')}`,
        ...options?.headers 
      },
    });
    if (!response.ok) {
        const err = await response.text();
        throw new Error(err || 'Network response was not ok');
    }
    return response.json();
  }

  async getUsers(): Promise<User[]> { return this.request('/users'); }
  async register(userData: any): Promise<User> { return this.request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }); }
  
  async login(email: string, pass: string): Promise<User | null> { 
    try {
        const res: any = await this.request('/auth/login', { 
            method: 'POST', 
            body: JSON.stringify({ email, password: pass }) 
        });
        if (res.token) {
            localStorage.setItem('bl_token', res.token);
            return res.user;
        }
        return null;
    } catch {
        return null;
    }
  }

  async updateUser(id: string, data: any): Promise<User> { return this.request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  async getRooms(): Promise<Room[]> { return this.request('/rooms'); }
  async saveRoom(room: Room): Promise<void> { return this.request('/rooms', { method: 'POST', body: JSON.stringify(room) }); }
  async deleteRoom(id: number): Promise<void> { return this.request(`/rooms/${id}`, { method: 'DELETE' }); }
  async getProducts(): Promise<Product[]> { return this.request('/products'); }
  async saveProduct(prod: Product): Promise<void> { return this.request('/products', { method: 'POST', body: JSON.stringify(prod) }); }
  async deleteProduct(id: number): Promise<void> { return this.request(`/products/${id}`, { method: 'DELETE' }); }
  async getAds(): Promise<Ad[]> { return this.request('/ads'); }
  async saveAd(ad: any): Promise<void> { return this.request('/ads', { method: 'POST', body: JSON.stringify(ad) }); }
  async deleteAd(id: string): Promise<void> { return this.request(`/ads/${id}`, { method: 'DELETE' }); }
  async getBookings(): Promise<Booking[]> { return this.request('/bookings'); }
  async createBooking(b: any): Promise<Booking> { return this.request('/bookings', { method: 'POST', body: JSON.stringify(b) }); }
  async updateBookingStatus(id: string, status: string): Promise<void> { return this.request(`/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify(status) }); }
  async getOrders(): Promise<Order[]> { return this.request('/orders'); }
  async placeOrder(o: any): Promise<Order> { return this.request('/orders', { method: 'POST', body: JSON.stringify(o) }); }
  async updateOrderStatus(id: string, status: string): Promise<void> { return this.request(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify(status) }); }
  async markPaid(type: string, id: string): Promise<void> { return this.request(`/payments/${type}/${id}/mark-paid`, { method: 'POST' }); }
}

const api_url = getViteEnv('VITE_API_URL');
const isRealApiEnabled = !!api_url;
console.log(`Backend Connection: ${isRealApiEnabled ? `REAL (API: ${api_url})` : 'MOCK (Local)'}`);

export const api: IBlackLightAPI = isRealApiEnabled ? new RealBackend() : new MockBackend();