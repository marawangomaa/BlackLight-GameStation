
import React, { useState, useEffect } from 'react';
import { Coffee, Pizza, Cookie, Search, Plus, ShoppingBag, MapPin, Loader2, Check, Smartphone, Home, Clock, ChevronRight, History as HistoryIcon, Filter, AlertCircle, CreditCard } from 'lucide-react';
import { Product, Room, Order, User } from '../types';
import { api } from '../services/api';

const OrdersSystem: React.FC<{ isAr: boolean; role: 'Admin' | 'Customer'; user: User; onOpenPayment: (data: any) => void }> = ({ isAr, role, user, onOpenPayment }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'All' | 'Drink' | 'Snack' | 'Meal'>('All');
  const [showHistory, setShowHistory] = useState(false);
  const [cart, setCart] = useState<{ id: number; qty: number }[]>([]);
  
  const [orderType, setOrderType] = useState<'DineIn' | 'Delivery'>('DineIn');
  const [targetRoomId, setTargetRoomId] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [payMethod, setPayMethod] = useState<'Instapay' | 'Stripe'>('Instapay');
  
  const [loading, setLoading] = useState(false);
  const isAdmin = role === 'Admin';

  const loadData = async () => {
    const [pData, rData, oData] = await Promise.all([api.getProducts(), api.getRooms(), api.getOrders()]);
    setProducts(pData);
    setRooms(rData);
    setOrders(oData);
    if (!targetRoomId && rData.length > 0) {
      setTargetRoomId('waiting');
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleUpdateStatus = async (id: string, current: Order['status']) => {
    let next: Order['status'] = 'Delivered';
    if (current === 'Pending') next = 'Processing';
    else if (current === 'Processing') next = 'On the way';
    
    await api.updateOrderStatus(id, next);
    loadData();
  };

  if (isAdmin) {
    const activeOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Rejected');
    const pastOrders = orders.filter(o => o.status === 'Delivered' || o.status === 'Rejected');
    const displayOrders = showHistory ? pastOrders : activeOrders;

    return (
      <div className="space-y-8 animate-in fade-in pb-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-3xl font-black text-white italic">{isAr ? 'مركز الطلبات' : 'POS & Orders Hub'}</h2>
            <p className="text-zinc-500">{isAr ? 'إدارة الطلبات النشطة وتاريخ المبيعات.' : 'Manage live fulfillment and historical sales.'}</p>
          </div>
          <div className="flex gap-2 bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800">
             <button onClick={() => setShowHistory(false)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${!showHistory ? 'bg-blue-500 text-white' : 'text-zinc-500 hover:text-white'}`}>Active Pool</button>
             <button onClick={() => setShowHistory(true)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${showHistory ? 'bg-zinc-800 text-white border border-zinc-700' : 'text-zinc-500 hover:text-white'}`}>Historical Archive</button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6">
          {displayOrders.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center bg-zinc-900/20 border-2 border-dashed border-zinc-900 rounded-[3rem]">
              <HistoryIcon size={64} className="text-zinc-800 mb-4" />
              <p className="text-sm font-black text-zinc-700 uppercase tracking-widest">No records found in this view</p>
            </div>
          ) : displayOrders.reverse().map(order => (
            <div key={order.id} className={`bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col md:flex-row gap-8 items-center transition-all ${order.status === 'Delivered' ? 'opacity-60 grayscale-[0.5]' : ''}`}>
              <div className="flex-1 space-y-3 w-full text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${order.orderType === 'Delivery' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                    {order.orderType}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-600 font-black">
                     <Clock size={12}/> {new Date(order.timestamp).toLocaleString()}
                  </div>
                  <span className="text-[10px] font-black text-zinc-700">#{order.id}</span>
                </div>
                <h4 className="text-2xl font-black text-white italic">{order.location}</h4>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {order.items.map((item, i) => {
                    const p = products.find(prod => prod.id === item.productId);
                    return <span key={i} className="text-[10px] font-bold text-zinc-400 bg-black/40 border border-zinc-800 px-3 py-1.5 rounded-xl">x{item.quantity} {p?.name}</span>
                  })}
                </div>
              </div>
              
              <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
                <div className="text-right">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Order Total</p>
                    <p className="text-3xl font-black text-white">{order.total} <span className="text-sm">EGP</span></p>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${order.paymentStatus === 'Paid' ? 'bg-green-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                      {order.paymentStatus}
                    </span>
                </div>
                {!showHistory ? (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => api.updateOrderStatus(order.id, 'Rejected').then(loadData)}
                      className="px-6 py-2.5 text-[10px] font-black uppercase text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                      Reject
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(order.id, order.status)}
                      className="px-8 py-2.5 bg-blue-500 text-white text-[10px] font-black uppercase rounded-xl hover:scale-[1.05] transition-transform flex items-center gap-2 shadow-lg shadow-blue-500/20"
                    >
                      {order.status === 'Pending' ? 'Start Processing' : order.status === 'Processing' ? 'Send Out' : 'Mark Delivered'}
                      <ChevronRight size={14} />
                    </button>
                  </div>
                ) : (
                  <div className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase ${order.status === 'Delivered' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500'}`}>
                     Order {order.status}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // CUSTOMER VIEW
  const filteredProducts = products.filter(p => filter === 'All' || p.category === filter);
  
  const addToCart = (id: number) => {
    const product = products.find(p => p.id === id);
    if (!product || product.stock <= 0) return;

    setCart(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing) {
        if (existing.qty >= product.stock) return prev; // Cannot exceed stock
        return prev.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { id, qty: 1 }];
    });
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    const total = cart.reduce((acc, item) => acc + (products.find(prod => prod.id === item.id)?.price || 0) * item.qty, 0);
    const location = orderType === 'DineIn' ? (targetRoomId === 'waiting' ? 'Waiting Room' : rooms.find(r => r.id.toString() === targetRoomId)?.name || 'Counter') : address;

    try {
      const newOrder = await api.placeOrder({
        userId: user.id,
        customerName: user.name,
        items: cart.map(i => ({ productId: i.id, quantity: i.qty })),
        total: total,
        status: 'Pending',
        orderType,
        location,
        phoneNumber: phone || user.phoneNumber
      });

      setCart([]);
      setLoading(false);
      onOpenPayment({ active: true, amount: total, type: payMethod === 'Instapay' ? 'instapay' : 'stripe', id: newOrder.id, category: 'order' });
    } catch (err: any) {
      alert(err.message);
      setLoading(false);
    }
  };

  const cartTotal = cart.reduce((acc, item) => acc + (products.find(p => p.id === item.id)?.price || 0) * item.qty, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 animate-in fade-in pb-24">
      <div className="lg:col-span-3 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-white mb-1 italic tracking-tighter">{isAr ? 'قائمة الكافية' : 'THE BLACK MENU'}</h2>
            <p className="text-zinc-500 font-medium">{isAr ? 'اطلب وجبتك الخفيفة المفضلة.' : 'Curated snacks, energy drinks and specialty meals.'}</p>
          </div>
          <div className="relative group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-yellow-400 transition-colors" />
            <input type="text" placeholder="Search menu..." className="bg-zinc-900 border border-zinc-800 rounded-2xl py-3 pl-12 pr-6 text-sm focus:border-yellow-400 outline-none w-full md:w-80 transition-all focus:ring-4 focus:ring-yellow-400/5" />
          </div>
        </header>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {['All', 'Drink', 'Snack', 'Meal'].map((cat) => (
            <button key={cat} onClick={() => setFilter(cat as any)} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${filter === cat ? 'bg-yellow-400 border-yellow-300 text-black shadow-xl shadow-yellow-400/20' : 'bg-zinc-950 text-zinc-600 border-zinc-900 hover:border-zinc-800 hover:text-zinc-400'}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-6 flex flex-col gap-6 group hover:border-yellow-400/30 transition-all relative overflow-hidden">
              {product.stock <= 0 && (
                <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-[9px] font-black uppercase px-3 py-1 rounded-full shadow-lg">OUT OF STOCK</div>
              )}
              <div className={`h-48 rounded-[2rem] overflow-hidden relative border border-zinc-800 shadow-inner ${product.stock <= 0 ? 'grayscale opacity-50' : ''}`}>
                <img src={product.image || 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=400'} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-black text-xl text-white italic">{product.name}</h4>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded ${product.stock < 10 ? 'text-red-400 bg-red-400/10' : 'text-zinc-500 bg-zinc-800'}`}>STOCK: {product.stock}</span>
                </div>
                <p className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em]">{product.category}</p>
                <p className="text-xs text-zinc-500 line-clamp-2 mt-2 font-medium">{product.description}</p>
              </div>
              <div className="flex justify-between items-center mt-auto">
                <span className="text-2xl font-black text-white">{product.price} <span className="text-xs font-normal opacity-50">EGP</span></span>
                <button 
                  onClick={() => addToCart(product.id)} 
                  disabled={product.stock <= 0}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-xl ${product.stock > 0 ? 'bg-yellow-400 text-black hover:scale-110 active:scale-95 shadow-yellow-400/20' : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}`}
                >
                  <Plus size={24} strokeWidth={3} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-zinc-950 border border-zinc-800 rounded-[3rem] p-8 sticky top-8 flex flex-col h-[calc(100vh-140px)] shadow-2xl">
          <h3 className="font-black text-white uppercase text-xs tracking-widest mb-8 flex items-center gap-3">
            <ShoppingBag size={20} className="text-yellow-400" /> Current Cart
          </h3>

          <div className="space-y-4 mb-8">
            <div className="flex p-1.5 bg-zinc-900 rounded-[2rem] border border-zinc-800">
              <button onClick={() => setOrderType('DineIn')} className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${orderType === 'DineIn' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-600'}`}>DINE IN</button>
              <button onClick={() => setOrderType('Delivery')} className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${orderType === 'Delivery' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-600'}`}>DELIVERY</button>
            </div>

            {orderType === 'DineIn' ? (
              <select value={targetRoomId} onChange={(e) => setTargetRoomId(e.target.value)} className="w-full bg-black border border-zinc-800 text-xs py-4 px-5 rounded-2xl outline-none text-zinc-200 appearance-none focus:border-yellow-400">
                <option value="waiting">Waiting Room / Lobby</option>
                {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            ) : (
              <div className="space-y-2">
                <input type="text" placeholder="Delivery Address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-xs p-4 rounded-2xl text-white outline-none focus:border-yellow-400" />
                <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-xs p-4 rounded-2xl text-white outline-none focus:border-yellow-400" />
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-5 pr-2 scrollbar-hide border-t border-zinc-900 pt-6">
            {cart.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-zinc-800 opacity-20">
                  <ShoppingBag size={64} className="mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Bag is empty</p>
               </div>
            ) : cart.map((item) => {
              const product = products.find(p => p.id === item.id);
              return (
                <div key={item.id} className="flex justify-between items-center gap-4 group">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-white truncate italic">{product?.name}</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">x{item.qty} · {product?.price! * item.qty} EGP</p>
                  </div>
                  <button onClick={() => setCart(prev => prev.filter(p => p.id !== item.id))} className="text-zinc-700 hover:text-red-500 text-[10px] font-black uppercase transition-colors opacity-0 group-hover:opacity-100">Remove</button>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-8 border-t border-zinc-800 space-y-4">
            <div className="flex flex-col gap-2">
               <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] ml-2">Pay via</p>
               <div className="grid grid-cols-2 gap-2">
                 <button onClick={() => setPayMethod('Instapay')} className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${payMethod === 'Instapay' ? 'bg-zinc-800 border-yellow-400/40 text-yellow-400' : 'bg-black border-zinc-800 text-zinc-600'}`}>
                   <Smartphone size={14}/> <span className="text-[9px] font-black uppercase">Instapay</span>
                 </button>
                 <button onClick={() => setPayMethod('Stripe')} className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${payMethod === 'Stripe' ? 'bg-zinc-800 border-blue-400/40 text-blue-400' : 'bg-black border-zinc-800 text-zinc-600'}`}>
                   <CreditCard size={14}/> <span className="text-[9px] font-black uppercase">Card</span>
                 </button>
               </div>
            </div>

            <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Subtotal</span>
                <span className="text-3xl font-black text-white italic">{cartTotal} <span className="text-xs font-normal opacity-50">EGP</span></span>
            </div>
            <button 
              onClick={handlePlaceOrder} 
              disabled={cart.length === 0 || loading || (orderType === 'Delivery' && (!address || !phone))} 
              className="w-full py-5 bg-yellow-400 text-black font-black rounded-3xl shadow-2xl flex items-center justify-center gap-3 uppercase tracking-widest text-xs transition-all active:scale-95 disabled:opacity-20"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : `CHECKOUT WITH ${payMethod}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersSystem;
