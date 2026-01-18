
import React, { useState, useEffect } from 'react';
import { Monitor, CheckCircle2, Loader2, Clock, User as UserIcon, Calendar as CalIcon, ChevronRight, Play, Square, XCircle, Activity, Gamepad2, Info, Smartphone, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
import { Room, Booking, User } from '../types';
import { api } from '../services/api';

const BookingSystem: React.FC<{ isAr: boolean; role: 'Admin' | 'Customer'; user: User; onOpenPayment: (data: any) => void }> = ({ isAr, role, user, onOpenPayment }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
  const [payMethod, setPayMethod] = useState<'instapay' | 'stripe'>('instapay');
  const [loading, setLoading] = useState(false);
  
  // Admin-only state
  const [expandedRoomId, setExpandedRoomId] = useState<number | null>(null);

  const isAdmin = role === 'Admin';

  const load = async () => {
    const [r, b] = await Promise.all([api.getRooms(), api.getBookings()]);
    setRooms(r);
    setBookings(b);
  };

  useEffect(() => { load(); }, []);

  const handleBooking = async () => {
    if (!selectedRoomId || selectedSlots.length === 0) return;
    setLoading(true);

    const startHour = Math.min(...selectedSlots);
    const duration = selectedSlots.length;
    const room = rooms.find(r => r.id === selectedRoomId);
    
    if (room) {
      const totalPrice = room.pricePerHour * duration;
      const depositAmount = Math.ceil(totalPrice * 0.2); // 20% Deposit

      const newBooking = await api.createBooking({
        roomId: selectedRoomId,
        userId: user.id,
        date: selectedDate,
        startTime: startHour,
        duration: duration,
        totalPrice: totalPrice,
        depositAmount: depositAmount,
        status: 'Pending'
      });

      setSelectedSlots([]);
      setSelectedRoomId(null);
      setLoading(false);

      // Open Payment Modal for the Deposit
      onOpenPayment({ 
        active: true, 
        amount: depositAmount, 
        type: payMethod, 
        id: newBooking.id, 
        category: 'booking' 
      });
      
      load();
    } else {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: Booking['status']) => {
    await api.updateBookingStatus(id, status);
    load();
  };

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  const hours = Array.from({ length: 15 }, (_, i) => i + 9); // 9 AM to Midnight

  if (isAdmin) {
    return (
      <div className="space-y-6 md:space-y-8 animate-in fade-in pb-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white italic">{isAr ? 'جداول المحطات' : 'Live Terminal Operations'}</h2>
            <p className="text-zinc-500 text-sm">{isAr ? 'إدارة جلسات اللعب والتحقق من المواعيد المتاحة.' : 'Oversee live terminals and audit time-slot availability.'}</p>
          </div>
          <div className="flex gap-2 p-1.5 bg-zinc-900 rounded-2xl border border-zinc-800 scrollbar-hide overflow-x-auto w-full md:w-auto">
            {dates.map(date => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`px-4 md:px-5 py-2 md:py-2.5 rounded-xl text-[10px] md:text-xs font-black transition-all whitespace-nowrap ${selectedDate === date ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                {new Date(date).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' })}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 md:gap-6">
          {rooms.map(room => {
            const roomBookings = bookings.filter(b => b.roomId === room.id && b.date === selectedDate && (b.status === 'Confirmed' || b.status === 'Pending'));
            const isExpanded = expandedRoomId === room.id;

            return (
              <div key={room.id} className="bg-zinc-900 border border-zinc-800 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden transition-all shadow-xl">
                <div 
                  onClick={() => setExpandedRoomId(isExpanded ? null : room.id)}
                  className="p-4 md:p-6 cursor-pointer flex justify-between items-center bg-zinc-800/20 hover:bg-zinc-800/40 transition-colors"
                >
                  <div className="flex items-center gap-4 md:gap-6">
                    <img src={room.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=200'} className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl object-cover border border-zinc-800" alt="" />
                    <div>
                      <h3 className="text-lg md:text-2xl font-black text-white italic uppercase tracking-tighter">{room.name}</h3>
                      <p className="text-[9px] md:text-[10px] text-blue-500 font-black uppercase tracking-widest">{room.psModel} · {room.pricePerHour} EGP/h</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 md:gap-8">
                    <div className="hidden sm:flex flex-col items-end">
                      <p className="text-[9px] md:text-[10px] text-zinc-500 font-black uppercase tracking-widest">Active Pool</p>
                      <p className="text-sm md:text-lg font-black text-white">{roomBookings.length} {isAr ? 'جلسات' : 'SESSIONS'}</p>
                    </div>
                    {isExpanded ? <ChevronUp className="text-zinc-500" /> : <ChevronDown className="text-zinc-500" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 md:p-8 border-t border-zinc-800 space-y-8 animate-in slide-in-from-top-2">
                    {/* Visual 24h Timeline Grid */}
                    <div className="space-y-4">
                       <h4 className="text-[9px] md:text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                          <Activity size={12} className="text-blue-500"/> Day Timeline Audit
                       </h4>
                       <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 xl:grid-cols-15 gap-2">
                          {hours.map(h => {
                            const b = roomBookings.find(bk => h >= bk.startTime && h < (bk.startTime + bk.duration));
                            const status = b ? b.status : 'Free';
                            
                            return (
                              <div 
                                key={h} 
                                className={`h-12 md:h-16 rounded-xl flex flex-col items-center justify-center border transition-all ${
                                  status === 'Confirmed' ? 'bg-blue-500/20 border-blue-500/40 text-blue-400' :
                                  status === 'Pending' ? 'bg-orange-500/20 border-orange-500/40 text-orange-400' :
                                  'bg-zinc-950 border-zinc-800 text-zinc-700'
                                }`}
                              >
                                <span className="text-[9px] md:text-[10px] font-black">{h}:00</span>
                                <span className="text-[7px] md:text-[8px] font-bold uppercase tracking-tighter mt-1">{status}</span>
                              </div>
                            );
                          })}
                       </div>
                    </div>

                    {/* Detailed Session List */}
                    <div className="space-y-4">
                      <h4 className="text-[9px] md:text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <Clock size={12} className="text-yellow-400"/> Operational Sessions
                      </h4>
                      {roomBookings.length === 0 ? (
                        <div className="py-12 text-center border-2 border-dashed border-zinc-800/50 rounded-[1.5rem]">
                          <p className="text-[9px] text-zinc-700 font-black uppercase tracking-widest italic">Station Available for Walk-ins</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {roomBookings.sort((a,b) => a.startTime - b.startTime).map(b => (
                            <div key={b.id} className={`p-4 md:p-6 rounded-2xl md:rounded-3xl border flex flex-col gap-4 ${b.status === 'Pending' ? 'bg-orange-500/5 border-orange-500/20' : 'bg-zinc-950 border-zinc-800 shadow-lg'}`}>
                              <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                   <div className={`p-2 rounded-xl ${b.status === 'Pending' ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/20' : 'bg-blue-500/10 text-blue-400'}`}>
                                     {b.status === 'Pending' ? <Activity size={18}/> : <Play size={18}/>}
                                   </div>
                                   <div className="text-left">
                                      <p className="text-sm md:text-lg font-black text-white italic leading-tight">{b.startTime}:00 - {b.startTime + b.duration}:00</p>
                                      <p className="text-[8px] md:text-[9px] text-zinc-600 font-bold uppercase tracking-widest">ID: {b.id}</p>
                                   </div>
                                 </div>
                                 <span className={`text-[8px] md:text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${b.status === 'Pending' ? 'bg-orange-500 text-white' : 'bg-zinc-800 text-blue-400'}`}>
                                   {b.status}
                                 </span>
                              </div>
                              
                              <div className="flex justify-between items-center text-[9px] font-black uppercase px-2 border-y border-zinc-800/50 py-2">
                                <span className="text-zinc-600">Audit:</span>
                                <span className={b.paymentStatus === 'Paid' ? 'text-green-500' : 'text-red-500'}>{b.depositAmount} EGP · {b.paymentStatus}</span>
                              </div>

                              <div className="flex gap-2">
                                {b.status === 'Pending' ? (
                                  <>
                                    <button onClick={() => updateStatus(b.id, 'Rejected')} className="flex-1 py-2 text-[9px] font-black bg-red-500/10 text-red-500 rounded-xl uppercase">Reject</button>
                                    <button onClick={() => updateStatus(b.id, 'Confirmed')} className="flex-1 py-2 text-[9px] font-black bg-blue-500 text-white rounded-xl uppercase shadow-xl shadow-blue-500/20">Authorize</button>
                                  </>
                                ) : (
                                  <>
                                    <button onClick={() => updateStatus(b.id, 'Rejected')} className="flex items-center justify-center gap-1 flex-1 py-2 text-[9px] font-black bg-zinc-800 text-zinc-500 rounded-xl uppercase hover:bg-red-500/10 hover:text-red-500 transition-colors"><XCircle size={12}/> Terminate</button>
                                    <button onClick={() => updateStatus(b.id, 'Completed')} className="flex items-center justify-center gap-1 flex-1 py-2 text-[9px] font-black bg-blue-500 text-white rounded-xl uppercase shadow-xl shadow-blue-500/20"><Square size={12}/> Close</button>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // CUSTOMER VIEW
  const selectedRoom = rooms.find(r => r.id === selectedRoomId);
  const totalPrice = (selectedSlots.length * (selectedRoom?.pricePerHour || 0));
  const depositPrice = Math.ceil(totalPrice * 0.2);

  return (
    <div className="space-y-8 animate-in fade-in max-w-6xl mx-auto pb-32 md:pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter">{isAr ? 'حجز المحطات' : 'STATION RESERVATION'}</h2>
          <p className="text-zinc-500 text-sm font-medium">{isAr ? 'اختر اليوم والوقت المناسب.' : 'Select a date and build your block.'}</p>
        </div>
        <div className="flex gap-2 p-1.5 bg-zinc-900 rounded-2xl border border-zinc-800 scrollbar-hide overflow-x-auto w-full md:w-auto">
          {dates.map(date => (
            <button
              key={date}
              onClick={() => { setSelectedDate(date); setSelectedSlots([]); }}
              className={`px-4 md:px-5 py-2 md:py-2.5 rounded-xl text-[10px] md:text-xs font-black transition-all whitespace-nowrap ${selectedDate === date ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              {new Date(date).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' })}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12">
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4">{isAr ? '1. اختر محطة' : '1. CHOOSE STATION'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {rooms.map(room => (
              <button
                key={room.id}
                onClick={() => { setSelectedRoomId(room.id); setSelectedSlots([]); }}
                className={`w-full text-left rounded-[1.5rem] md:rounded-[2rem] border-2 transition-all relative overflow-hidden group flex flex-col ${selectedRoomId === room.id ? 'bg-yellow-400 border-yellow-300 text-black shadow-2xl' : 'bg-zinc-950 border-zinc-900 text-zinc-500 hover:border-zinc-700'}`}
              >
                <div className="h-28 md:h-32 w-full relative">
                  <img src={room.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600'} className="w-full h-full object-cover" alt="" />
                  <div className={`absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors ${selectedRoomId === room.id ? 'opacity-0' : ''}`}></div>
                </div>
                <div className="p-4 md:p-5 space-y-1 relative">
                  <p className={`font-black text-base md:text-lg italic ${selectedRoomId === room.id ? 'text-black' : 'text-white'}`}>{room.name}</p>
                  <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest opacity-80">{room.psModel} · {room.pricePerHour} EGP/h</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4">{isAr ? '2. اختر الوقت' : '2. BUILD YOUR TIMELINE'}</h3>
          {!selectedRoomId ? (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center bg-zinc-900/10 border-2 border-dashed border-zinc-900 rounded-[2rem] md:rounded-[3rem] text-zinc-800">
              <Gamepad2 size={64} className="mb-4 opacity-20" />
              <p className="text-[9px] md:text-xs font-black uppercase tracking-widest opacity-50">Select a room first</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {hours.map(h => {
                const isBooked = bookings.some(b => 
                  b.roomId === selectedRoomId && 
                  b.date === selectedDate && 
                  (b.status === 'Confirmed' || b.status === 'Pending') &&
                  h >= b.startTime && h < (b.startTime + b.duration)
                );
                const isSelected = selectedSlots.includes(h);

                return (
                  <button
                    key={h}
                    disabled={isBooked}
                    onClick={() => {
                      if (isSelected) setSelectedSlots(prev => prev.filter(s => s !== h));
                      else setSelectedSlots(prev => [...prev, h].sort((a,b) => a-b));
                    }}
                    className={`relative p-4 md:p-6 rounded-2xl md:rounded-3xl border-2 font-black transition-all text-center flex flex-col items-center justify-center gap-1 group ${
                      isBooked ? 'bg-zinc-950 border-zinc-950 text-zinc-900 cursor-not-allowed grayscale' :
                      isSelected ? 'bg-yellow-400 border-yellow-300 text-black scale-[0.98] shadow-2xl shadow-yellow-400/20' :
                      'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-yellow-400/40 hover:text-white'
                    }`}
                  >
                    <span className="text-base md:text-lg italic">{h}:00</span>
                    <span className="text-[9px] md:text-[10px] opacity-50 uppercase tracking-tighter">{h >= 12 ? 'PM' : 'AM'}</span>
                    {isBooked && <span className="absolute bottom-2 text-[7px] md:text-[8px] font-black text-red-500/50 uppercase">TAKEN</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedSlots.length > 0 && (
        <div className="fixed bottom-4 md:bottom-12 left-0 right-0 px-4 md:px-0 md:left-1/2 md:-translate-x-1/2 w-full max-w-4xl animate-in slide-in-from-bottom-12 z-[60]">
          <div className="bg-black border border-yellow-400/40 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 backdrop-blur-xl">
            <div className="space-y-4 w-full md:w-auto text-center md:text-left">
              <div className="space-y-1">
                <p className="text-[9px] md:text-[10px] uppercase font-black text-zinc-500 tracking-[0.2em]">Summary</p>
                <p className="text-xl md:text-2xl font-black text-white italic">{selectedRoom?.name}</p>
                <div className="flex items-center justify-center md:justify-start gap-3 text-[9px] md:text-[10px] text-yellow-400 font-black uppercase tracking-widest bg-yellow-400/10 px-3 py-1 rounded-full w-fit mx-auto md:mx-0">
                  <Clock size={12}/> {selectedSlots[0]}:00 - {selectedSlots[selectedSlots.length-1] + 1}:00
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-12 w-full md:w-auto">
              <div className="text-center md:text-right space-y-1 md:space-y-2">
                <div>
                  <p className="text-[9px] md:text-[10px] uppercase font-black text-zinc-500 tracking-widest">Deposit Required</p>
                  <p className="text-2xl md:text-3xl font-black text-yellow-400 italic">
                    {depositPrice} <span className="text-xs font-normal">EGP</span>
                  </p>
                </div>
              </div>
              <button 
                onClick={handleBooking}
                disabled={loading}
                className="bg-yellow-400 text-black px-8 md:px-12 py-4 md:py-5 rounded-2xl md:rounded-3xl font-black uppercase text-xs md:text-sm hover:scale-[1.05] transition-transform flex items-center justify-center gap-2 shadow-2xl shadow-yellow-400/20 active:scale-95 w-full md:w-auto"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : `BOOK NOW`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingSystem;
