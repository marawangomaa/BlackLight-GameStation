
import React, { useEffect, useState } from 'react';
import { User as UserIcon, Calendar, ShoppingCart, Info, Search, Mail, Phone, MapPin } from 'lucide-react';
import { api } from '../services/api';
import { User, Booking, Order } from '../types';

const AdminUsers: React.FC<{ isAr: boolean }> = ({ isAr }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [history, setHistory] = useState<{ bookings: Booking[], orders: Order[] }>({ bookings: [], orders: [] });

  const load = async () => {
    const u = await api.getUsers();
    setUsers(u.filter(x => x.role === 'Customer'));
  };

  const loadHistory = async (user: User) => {
    const [b, o] = await Promise.all([api.getBookings(), api.getOrders()]);
    setHistory({
      bookings: b.filter(x => x.userId === user.id),
      orders: o.filter(x => x.userId === user.id)
    });
    setSelectedUser(user);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-8 animate-in fade-in">
      <header>
        <h2 className="text-3xl font-black text-white">{isAr ? 'قاعدة بيانات العملاء' : 'Customer Database'}</h2>
        <p className="text-zinc-500">View and manage all registered gamers at Black Light.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col h-[70vh]">
          <div className="p-4 border-b border-zinc-800">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input type="text" placeholder="Search gamers..." className="w-full bg-black border border-zinc-800 rounded-xl py-2 pl-10 text-xs text-white" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-800">
            {users.map(u => (
              <button 
                key={u.id} 
                onClick={() => loadHistory(u)}
                className={`w-full p-4 flex items-center gap-4 transition-colors ${selectedUser?.id === u.id ? 'bg-blue-500/10' : 'hover:bg-zinc-800/50'}`}
              >
                <img src={u.image} className="w-10 h-10 rounded-full object-cover" alt="" />
                <div className="text-left">
                  <p className="font-bold text-sm text-white">{u.name}</p>
                  <p className="text-[10px] text-zinc-500">{u.phoneNumber}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {!selectedUser ? (
            <div className="h-full flex flex-col items-center justify-center bg-zinc-900/30 border-2 border-dashed border-zinc-800 rounded-3xl text-zinc-700">
              <UserIcon size={64} className="mb-4 opacity-20" />
              <p className="font-black uppercase tracking-widest text-sm">Select a user to view details</p>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl flex gap-8 items-start">
                <img src={selectedUser.image} className="w-24 h-24 rounded-2xl object-cover border-2 border-blue-500" alt="" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-black text-white">{selectedUser.name}</h3>
                    <span className="bg-blue-500 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase">Customer</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="flex items-center gap-2 text-xs text-zinc-400"><Mail size={14}/> {selectedUser.email}</div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400"><Phone size={14}/> {selectedUser.phoneNumber}</div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400"><MapPin size={14}/> {selectedUser.location}</div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400"><Calendar size={14}/> Joined {new Date(selectedUser.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
                  <h4 className="font-black text-xs uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2"><Calendar size={14}/> Booking History</h4>
                  <div className="space-y-3">
                    {history.bookings.length === 0 ? <p className="text-xs italic text-zinc-600">No session records</p> : history.bookings.map(b => (
                      <div key={b.id} className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex justify-between items-center text-xs">
                        <span>{b.date} Session</span>
                        <span className="font-black">{b.totalPrice} EGP</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
                  <h4 className="font-black text-xs uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2"><ShoppingCart size={14}/> Cafe History</h4>
                  <div className="space-y-3">
                    {history.orders.length === 0 ? <p className="text-xs italic text-zinc-600">No cafe records</p> : history.orders.map(o => (
                      <div key={o.id} className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex justify-between items-center text-xs">
                        <span>{o.items.length} items</span>
                        <span className="font-black">{o.total} EGP</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
