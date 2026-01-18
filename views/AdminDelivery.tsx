
import React, { useEffect, useState } from 'react';
import { Truck, MapPin, Phone, Check, Clock, Box, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { Order } from '../types';

const AdminDelivery: React.FC<{ isAr: boolean }> = ({ isAr }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const load = async () => {
    const all = await api.getOrders();
    setOrders(all.filter(o => o.orderType === 'Delivery' && o.status !== 'Rejected'));
  };

  useEffect(() => { load(); }, []);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return 'text-orange-400 bg-orange-400/10';
      case 'Processing': return 'text-blue-400 bg-blue-400/10';
      case 'On the way': return 'text-purple-400 bg-purple-400/10';
      case 'Delivered': return 'text-green-400 bg-green-400/10';
      default: return 'text-zinc-500 bg-zinc-500/10';
    }
  };

  const nextStatus = async (id: string, current: Order['status']) => {
    let next: Order['status'] = 'Delivered';
    if (current === 'Pending') next = 'Processing';
    else if (current === 'Processing') next = 'On the way';
    else if (current === 'On the way') next = 'Delivered';
    
    await api.updateOrderStatus(id, next);
    load();
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-white">{isAr ? 'تتبع الدليفري' : 'Delivery Fleet'}</h2>
          <p className="text-zinc-500">{isAr ? 'تابع حالة الطلبات الخارجية.' : 'Real-time logistics management.'}</p>
        </div>
        <button onClick={load} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors">
          <RefreshCw size={20} />
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {orders.map(order => (
          <div key={order.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col">
            <div className="p-6 flex-1 space-y-4">
              <div className="flex justify-between items-start">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <p className="text-[10px] text-zinc-500 font-bold">{new Date(order.timestamp).toLocaleTimeString()}</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-bold text-white text-lg">{order.items.length} items to {order.customerName}</h4>
                <div className="flex items-start gap-2 text-zinc-400 text-xs">
                  <MapPin size={14} className="shrink-0 mt-0.5" />
                  <span>{order.location}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400 text-xs">
                  <Phone size={14} />
                  <span>{order.phoneNumber}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-zinc-950 border-t border-zinc-800">
              {order.status !== 'Delivered' ? (
                <button 
                  onClick={() => nextStatus(order.id, order.status)}
                  className="w-full py-2 bg-blue-500 text-white rounded-lg text-xs font-black uppercase hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={14} />
                  {order.status === 'Pending' ? 'Start Processing' : order.status === 'Processing' ? 'Ship Order' : 'Mark Delivered'}
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 text-green-400 text-xs font-bold uppercase py-2">
                  <Check size={14} /> Order Fulfilled
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDelivery;
