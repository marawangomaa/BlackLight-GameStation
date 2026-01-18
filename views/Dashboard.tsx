
import React, { useEffect, useState } from 'react';
import { Clock, Wallet, Check, X, MapPin, Coffee, Users, Gamepad2, TrendingUp, DollarSign, ShoppingCart, Activity, ArrowUpRight, History } from 'lucide-react';
import { api } from '../services/api';
import { Booking, Order, Room, User } from '../types';

const Dashboard: React.FC<{ isAr: boolean; user: User }> = ({ isAr, user }) => {
  const isAdmin = user.role === 'Admin';
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const load = async () => {
    const [b, o, r, u] = await Promise.all([api.getBookings(), api.getOrders(), api.getRooms(), api.getUsers()]);
    setBookings(b);
    setOrders(o);
    setRooms(r);
    setAllUsers(u);
  };

  useEffect(() => { load(); }, []);

  const getCombinedHistory = () => {
    const historyB = bookings.filter(b => b.status === 'Completed' || b.status === 'Confirmed');
    const historyO = orders.filter(o => o.status === 'Delivered');
    return [...historyB, ...historyO].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  if (isAdmin) {
    const allTimeRevenue = bookings.filter(b => b.status !== 'Rejected' && b.status !== 'Pending').reduce((s, b) => s + b.totalPrice, 0) +
                         orders.filter(o => o.status !== 'Rejected' && o.status !== 'Pending').reduce((s, o) => s + o.total, 0);
    
    const today = new Date().toISOString().split('T')[0];
    const todayRevenue = bookings.filter(b => b.date === today && b.status !== 'Rejected').reduce((s, b) => s + b.totalPrice, 0) +
                         orders.filter(o => o.timestamp.startsWith(today) && o.status !== 'Rejected').reduce((s, o) => s + o.total, 0);

    const pendingB = bookings.filter(b => b.status === 'Pending');
    const pendingO = orders.filter(o => o.status === 'Pending');
    const liveHistory = getCombinedHistory();

    return (
      <div className="space-y-8 animate-in fade-in pb-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-3xl font-black text-white">{isAr ? 'مركز العمليات' : 'Operation Hub'}</h2>
            <p className="text-zinc-500">{isAr ? 'نظرة مالية وتقنية شاملة.' : 'Financial & Technical Overview'}</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-zinc-900 border border-zinc-800 px-6 py-3 rounded-2xl">
              <p className="text-[10px] font-black text-zinc-500 uppercase flex items-center gap-1"><TrendingUp size={10}/> Today's Revenue</p>
              <p className="text-xl font-black text-green-400">{todayRevenue.toLocaleString()} <span className="text-xs">EGP</span></p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 px-6 py-3 rounded-2xl">
              <p className="text-[10px] font-black text-zinc-500 uppercase flex items-center gap-1"><DollarSign size={10}/> Total All-Time</p>
              <p className="text-xl font-black text-white">{allTimeRevenue.toLocaleString()} <span className="text-xs font-normal opacity-50">EGP</span></p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Registered Gamers', val: allUsers.length, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
            { label: 'Active Sessions', val: bookings.filter(b => b.status === 'Confirmed').length, icon: Gamepad2, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
            { label: 'Unfulfilled Orders', val: orders.filter(o => o.status !== 'Delivered' && o.status !== 'Rejected').length, icon: ShoppingCart, color: 'text-purple-400', bg: 'bg-purple-400/10' },
            { label: 'Pending Actions', val: pendingB.length + pendingO.length, icon: Activity, color: 'text-red-400', bg: 'bg-red-400/10' },
          ].map((stat, i) => (
            <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl group hover:border-zinc-700 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}><stat.icon size={20}/></div>
                <ArrowUpRight size={16} className="text-zinc-700 group-hover:text-zinc-500" />
              </div>
              <p className="text-xs font-bold text-zinc-500 uppercase mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-white">{stat.val}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Priority Tasks */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-4 bg-zinc-800/30 border-b border-zinc-800 flex justify-between items-center">
                <h3 className="font-black text-xs uppercase tracking-widest text-white flex items-center gap-2">
                  <Activity size={14} className="text-red-500" />
                  {isAr ? 'الطلبات العاجلة' : 'Immediate Priority'}
                </h3>
                <span className="text-[10px] font-black text-zinc-500">AWAITING APPROVAL</span>
              </div>
              <div className="divide-y divide-zinc-800 max-h-[400px] overflow-y-auto">
                {pendingB.length === 0 && pendingO.length === 0 ? (
                  <div className="p-20 text-center">
                    <Check size={48} className="mx-auto text-zinc-800 mb-4" />
                    <p className="text-sm font-bold text-zinc-600 uppercase">System clear. No pending tasks.</p>
                  </div>
                ) : (
                  <>
                    {pendingB.map(b => (
                      <div key={b.id} className="p-5 flex items-center justify-between hover:bg-zinc-800/30 transition-colors">
                        <div className="flex gap-4 items-center">
                          <img src={allUsers.find(u => u.id === b.userId)?.image} className="w-10 h-10 rounded-full border border-zinc-700" alt="" />
                          <div>
                            <p className="text-sm font-bold text-white">Booking: {rooms.find(r => r.id === b.roomId)?.name}</p>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">
                              {allUsers.find(u => u.id === b.userId)?.name} · {b.date} @ {b.startTime}:00
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button onClick={() => api.updateBookingStatus(b.id, 'Rejected').then(load)} className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><X size={20}/></button>
                          <button onClick={() => api.updateBookingStatus(b.id, 'Confirmed').then(load)} className="p-2.5 bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20"><Check size={20}/></button>
                        </div>
                      </div>
                    ))}
                    {pendingO.map(o => (
                      <div key={o.id} className="p-5 flex items-center justify-between hover:bg-zinc-800/30 transition-colors">
                        <div className="flex gap-4 items-center">
                          <div className="w-10 h-10 rounded-full bg-yellow-400/10 text-yellow-400 flex items-center justify-center border border-yellow-400/20"><Coffee size={20}/></div>
                          <div>
                            <p className="text-sm font-bold text-white">Order: {o.location}</p>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">
                              {o.customerName} · {o.items.length} Items · {o.total} EGP
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button onClick={() => api.updateOrderStatus(o.id, 'Rejected').then(load)} className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><X size={20}/></button>
                          <button onClick={() => api.updateOrderStatus(o.id, 'Processing').then(load)} className="p-2.5 bg-yellow-400 text-black rounded-xl shadow-lg shadow-yellow-400/20"><Check size={20}/></button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase mb-4 tracking-widest">Room Popularity</h4>
                  <div className="space-y-4">
                    {rooms.slice(0, 3).map((r, idx) => (
                      <div key={r.id} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-zinc-400">{r.name}</span>
                          <span className="text-white">{85 - (idx * 15)}%</span>
                        </div>
                        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{width: `${85 - (idx * 15)}%`}}></div>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
               <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase mb-4 tracking-widest">Recent Completions</h4>
                  <div className="space-y-3">
                    {liveHistory.slice(0, 3).map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-xs text-zinc-400">{item.id.startsWith('BK') ? 'Session' : 'Order'} Completed</span>
                        </div>
                        <span className="text-xs font-black text-white">{item.totalPrice || item.total} EGP</span>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>

          {/* Action History Sidefeed */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 h-full flex flex-col">
              <h3 className="font-black text-xs uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
                <History size={14} /> Full Terminal History
              </h3>
              <div className="flex-1 space-y-6 overflow-y-auto pr-2 scrollbar-hide">
                {liveHistory.length === 0 ? (
                  <p className="text-center text-zinc-700 italic text-xs py-12">No activity records yet.</p>
                ) : (
                  liveHistory.map((act: any) => (
                    <div key={act.id} className="relative pl-6 pb-6 border-l border-zinc-800 last:pb-0">
                      <div className={`absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full border-2 border-zinc-950 ${act.status === 'Completed' || act.status === 'Delivered' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-xs font-black text-zinc-200">
                            {act.roomId ? `Station: ${rooms.find(r => r.id === act.roomId)?.name}` : `Cafe Order: ${act.location}`}
                          </p>
                          <span className="text-[10px] font-black text-white">{act.totalPrice || act.total} EGP</span>
                        </div>
                        <p className="text-[10px] text-zinc-600 font-bold uppercase">{new Date(act.timestamp).toLocaleString()}</p>
                        <p className="text-[10px] text-zinc-500 mt-2 italic font-medium">Status: {act.status}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CUSTOMER DASHBOARD
  const myB = bookings.filter(b => b.userId === user.id);
  const myO = orders.filter(o => o.userId === user.id);

  return (
    <div className="space-y-8 animate-in fade-in max-w-5xl mx-auto">
      <div className="relative overflow-hidden bg-zinc-900 border border-zinc-800 p-8 md:p-12 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Activity size={200} />
        </div>
        <img src={user.image} className="w-32 h-32 rounded-3xl object-cover border-4 border-zinc-950 shadow-2xl relative z-10 ring-4 ring-yellow-400/20" alt="Profile" />
        <div className="relative z-10 text-center md:text-left">
          <h2 className="text-4xl font-black text-white mb-2 italic">WELCOME, {user.name.toUpperCase()}</h2>
          <p className="text-zinc-500 text-sm font-medium">{user.email} · {user.location}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
            <div className="px-6 py-2 bg-black/40 rounded-2xl border border-zinc-800 backdrop-blur-sm">
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Lifetime Sessions</p>
              <p className="text-xl font-black text-yellow-400">{myB.length}</p>
            </div>
            <div className="px-6 py-2 bg-black/40 rounded-2xl border border-zinc-800 backdrop-blur-sm">
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Total Orders</p>
              <p className="text-xl font-black text-white">{myO.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center px-2">
            <h3 className="font-black text-xs uppercase tracking-widest text-zinc-500 flex items-center gap-2"><Activity size={14}/> Active Status</h3>
            <span className="text-[10px] font-bold text-zinc-700">LIVE FEED</span>
          </div>
          <div className="space-y-4">
            {[...myB, ...myO].filter(x => x.status !== 'Completed' && x.status !== 'Delivered' && x.status !== 'Rejected').length === 0 ? (
                <div className="p-12 bg-zinc-900/30 border border-zinc-800 rounded-3xl text-center border-dashed">
                   <Gamepad2 size={32} className="mx-auto text-zinc-800 mb-2" />
                   <p className="text-xs font-bold text-zinc-600 uppercase">No active gaming sessions or orders</p>
                </div>
            ) : [...myB, ...myO].filter(x => x.status !== 'Completed' && x.status !== 'Delivered' && x.status !== 'Rejected').map((act: any) => (
              <div key={act.id} className="group p-6 bg-zinc-900 border border-zinc-800 hover:border-yellow-400/50 rounded-3xl flex justify-between items-center transition-all shadow-lg hover:shadow-yellow-400/5">
                <div className="flex gap-4 items-center">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${act.roomId ? 'bg-blue-500/10 text-blue-400' : 'bg-yellow-400/10 text-yellow-400'}`}>
                    {act.roomId ? <Gamepad2 size={24}/> : <Coffee size={24}/>}
                  </div>
                  <div>
                    <p className="font-black text-white text-lg">{act.roomId ? `Station: ${rooms.find(r => r.id === act.roomId)?.name}` : 'Cafe Request'}</p>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{act.status}</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-xl font-black text-white">{act.totalPrice || act.total} <span className="text-[10px] opacity-50">EGP</span></p>
                   {act.paymentStatus === 'Unpaid' && <p className="text-[9px] font-black text-red-500 uppercase">Awaiting Payment</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center px-2">
            <h3 className="font-black text-xs uppercase tracking-widest text-zinc-500 flex items-center gap-2"><History size={14}/> Recent History</h3>
            <button className="text-[10px] font-black text-yellow-400 hover:underline">VIEW ALL</button>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden divide-y divide-zinc-800/50">
            {[...myB, ...myO].filter(x => x.status === 'Completed' || x.status === 'Delivered').sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 6).map((act: any) => (
              <div key={act.id} className="p-5 flex justify-between items-center opacity-70 hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-4">
                  <div className="text-zinc-600"><Check size={18}/></div>
                  <div>
                    <p className="text-sm font-bold text-zinc-300">{act.roomId ? 'Game Session' : 'Cafe Order'}</p>
                    <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-tighter">{new Date(act.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="text-sm font-black text-zinc-400">{act.totalPrice || act.total} EGP</span>
              </div>
            ))}
            {[...myB, ...myO].filter(x => x.status === 'Completed' || x.status === 'Delivered').length === 0 && (
                 <p className="p-12 text-center text-xs text-zinc-700 italic">No historical records found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
