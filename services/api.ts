
import { Room, Booking, Product, Order, User, Ad } from '../types';

const INITIAL_ROOMS: Room[] = [
  { id: 1, name: 'Cyberpunk Suite', type: 'VIP', pricePerHour: 150, isAvailable: true, psModel: 'PS5 Pro', description: 'Ultimate gaming experience with RGB lighting and premium seating.', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600' },
  { id: 2, name: 'The Neon Den', type: 'Standard', pricePerHour: 80, isAvailable: true, psModel: 'PS5 Slim', description: 'Cozy neon atmosphere for casual gaming.', image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=600' },
];

const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: 'Espresso Double', category: 'Drink', price: 45, stock: 100, description: 'Freshly roasted premium double espresso.', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=400' },
  { id: 4, name: 'Classic Burger', category: 'Meal', price: 120, stock: 20, description: 'Juicy beef patty with fresh vegetables.', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400' },
];

const INITIAL_ADS: Ad[] = [
  {
    id: 'ad_1',
    title: 'FC 24 TOURNAMENT',
    description: 'Join the weekend clash for a prize pool of 5000 EGP. Registration ends Friday!',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800',
    isPermanent: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'ad_2',
    title: 'NIGHT OWL OFFER',
    description: 'Play from 2 AM to 8 AM and get 40% OFF on all VIP stations.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800',
    isPermanent: false,
    expiresAt: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    createdAt: new Date().toISOString()
  }
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

class MockBackend {
  private getStorage<T>(key: string, initial: T): T {
    const data = localStorage.getItem(`bl_v8_${key}`);
    return data ? JSON.parse(data) : initial;
  }

  private setStorage<T>(key: string, data: T): void {
    localStorage.setItem(`bl_v8_${key}`, JSON.stringify(data));
  }

  // --- Auth & Users ---
  async getUsers(): Promise<User[]> {
    return this.getStorage('users', [DEFAULT_ADMIN]);
  }

  async register(userData: Omit<User, 'id' | 'createdAt' | 'role'>): Promise<User> {
    const users = await this.getUsers();
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      role: 'Customer',
      createdAt: new Date().toISOString()
    };
    this.setStorage('users', [...users, newUser]);
    return newUser;
  }

  async login(email: string, pass: string): Promise<User | null> {
    const users = await this.getUsers();
    const user = users.find(u => u.email === email && u.password === pass);
    return user || null;
  }

  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    const users = await this.getUsers();
    const updated = users.map(u => u.id === userId ? { ...u, ...data } : u);
    this.setStorage('users', updated);
    return updated.find(u => u.id === userId)!;
  }

  // --- Rooms ---
  async getRooms(): Promise<Room[]> {
    return this.getStorage('rooms', INITIAL_ROOMS);
  }

  async saveRoom(room: Room): Promise<void> {
    const rooms = await this.getRooms();
    const index = rooms.findIndex(r => r.id === room.id);
    if (index >= 0) {
      rooms[index] = room;
    } else {
      rooms.push({ ...room, id: rooms.length > 0 ? Math.max(...rooms.map(r => r.id)) + 1 : 1 });
    }
    this.setStorage('rooms', rooms);
  }

  async deleteRoom(id: number): Promise<void> {
    const rooms = await this.getRooms();
    this.setStorage('rooms', rooms.filter(r => r.id !== id));
  }

  // --- Products ---
  async getProducts(): Promise<Product[]> {
    return this.getStorage('products', INITIAL_PRODUCTS);
  }

  async saveProduct(product: Product): Promise<void> {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.push({ ...product, id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1 });
    }
    this.setStorage('products', products);
  }

  async deleteProduct(id: number): Promise<void> {
    const products = await this.getProducts();
    this.setStorage('products', products.filter(p => p.id !== id));
  }

  // --- Ads & Announcements ---
  async getAds(): Promise<Ad[]> {
    const allAds = this.getStorage('ads', INITIAL_ADS);
    const now = new Date();
    // Filter out expired ones
    return allAds.filter(ad => ad.isPermanent || !ad.expiresAt || new Date(ad.expiresAt) > now);
  }

  async saveAd(ad: Partial<Ad>): Promise<void> {
    const ads = await this.getAds();
    if (ad.id) {
      const idx = ads.findIndex(a => a.id === ad.id);
      if (idx >= 0) ads[idx] = { ...ads[idx], ...ad } as Ad;
    } else {
      ads.push({ 
        ...ad, 
        id: 'AD-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        createdAt: new Date().toISOString()
      } as Ad);
    }
    this.setStorage('ads', ads);
  }

  async deleteAd(id: string): Promise<void> {
    const ads = await this.getAds();
    this.setStorage('ads', ads.filter(a => a.id !== id));
  }

  // --- Bookings ---
  async getBookings(): Promise<Booking[]> {
    return this.getStorage('bookings', []);
  }

  async createBooking(booking: Omit<Booking, 'id' | 'timestamp' | 'paymentStatus'>): Promise<Booking> {
    const bookings = await this.getBookings();
    const newBooking: Booking = { 
      ...booking, 
      id: 'BK-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      timestamp: new Date().toISOString(),
      paymentStatus: 'Unpaid'
    };
    this.setStorage('bookings', [...bookings, newBooking]);
    return newBooking;
  }

  async updateBookingStatus(id: string, status: Booking['status']): Promise<void> {
    const bookings = await this.getBookings();
    this.setStorage('bookings', bookings.map(b => b.id === id ? { ...b, status } : b));
  }

  // --- Orders ---
  async getOrders(): Promise<Order[]> {
    return this.getStorage('orders', []);
  }

  async placeOrder(orderData: Omit<Order, 'id' | 'timestamp' | 'paymentStatus'>): Promise<Order> {
    const products = await this.getProducts();
    const orders = await this.getOrders();

    const updatedProducts = [...products];
    for (const item of orderData.items) {
      const pIndex = updatedProducts.findIndex(p => p.id === item.productId);
      if (pIndex === -1 || updatedProducts[pIndex].stock < item.quantity) {
        throw new Error(`Insufficient stock for item: ${updatedProducts[pIndex]?.name || 'Unknown'}`);
      }
      updatedProducts[pIndex] = {
        ...updatedProducts[pIndex],
        stock: updatedProducts[pIndex].stock - item.quantity
      };
    }

    this.setStorage('products', updatedProducts);

    const newOrder: Order = { 
      ...orderData, 
      id: 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      timestamp: new Date().toISOString(),
      paymentStatus: 'Unpaid'
    };
    this.setStorage('orders', [...orders, newOrder]);
    return newOrder;
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<void> {
    const orders = await this.getOrders();
    this.setStorage('orders', orders.map(o => o.id === id ? { ...o, status } : o));
  }

  async markPaid(type: 'order' | 'booking', id: string): Promise<void> {
    if (type === 'order') {
      const orders = await this.getOrders();
      this.setStorage('orders', orders.map(o => o.id === id ? { ...o, paymentStatus: 'Paid' } : o));
    } else {
      const bookings = await this.getBookings();
      this.setStorage('bookings', bookings.map(b => b.id === id ? { ...b, paymentStatus: 'Paid' } : b));
    }
  }

  async resetDatabase(): Promise<void> {
    localStorage.clear();
    window.location.reload();
  }
}

export const api = new MockBackend();
