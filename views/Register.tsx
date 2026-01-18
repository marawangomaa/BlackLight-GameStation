
import React, { useState } from 'react';
import { UserPlus, Mail, Lock, User as UserIcon, Phone, MapPin, Loader2, ArrowLeft, Camera, Upload } from 'lucide-react';
import { api } from '../services/api';
import { User } from '../types';

const Register: React.FC<{ onRegister: (u: User) => void, onBack: () => void, isAr: boolean }> = ({ onRegister, onBack, isAr }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phoneNumber: '', location: '', image: '' });
  const [loading, setLoading] = useState(false);

  const avatars = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aria',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoey',
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const user = await api.register({
        ...form,
        image: form.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.name}`
    });
    onRegister(user);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-black gaming-grid">
      <div className="w-full max-w-2xl space-y-8 animate-in slide-in-from-bottom-8 duration-500">
        <header className="flex justify-between items-center">
            <button onClick={onBack} className="text-zinc-600 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors"><ArrowLeft size={14}/> Back to Terminal</button>
            <div className="text-right">
                <h1 className="text-4xl font-black text-white italic tracking-tighter">JOIN THE SQUAD</h1>
                <p className="text-zinc-500 text-[10px] uppercase font-black tracking-[0.3em]">Initialize Gamer Account</p>
            </div>
        </header>

        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 p-10 rounded-[3rem] space-y-10 shadow-[0_0_100px_rgba(255,215,0,0.05)] backdrop-blur-xl">
          <div className="flex flex-col md:flex-row items-center gap-10">
             <div className="flex flex-col items-center gap-4">
                <div className="relative w-32 h-32 group">
                   <img src={form.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=new`} className="w-full h-full rounded-3xl object-cover border-4 border-black shadow-2xl ring-2 ring-zinc-800" alt="" />
                   <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-3xl opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                      <Upload className="text-white" size={24} />
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                   </label>
                   <div className="absolute -bottom-2 -right-2 p-2 bg-yellow-400 text-black rounded-xl shadow-lg shadow-yellow-400/20 pointer-events-none"><Camera size={16}/></div>
                </div>
                <div className="flex gap-1.5">
                   {avatars.map((url, i) => (
                      <button type="button" key={i} onClick={() => setForm({...form, image: url})} className={`w-8 h-8 rounded-lg overflow-hidden border-2 ${form.image === url ? 'border-yellow-400' : 'border-zinc-800'}`}>
                         <img src={url} alt="" />
                      </button>
                   ))}
                </div>
             </div>
             <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                    <input required placeholder="Display Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-yellow-400 outline-none transition-all" />
                </div>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                    <input required type="email" placeholder="Email Address" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-yellow-400 outline-none transition-all" />
                </div>
                <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                    <input required placeholder="Phone Number" value={form.phoneNumber} onChange={e => setForm({...form, phoneNumber: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-yellow-400 outline-none transition-all" />
                </div>
                <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                    <input required placeholder="Location / Area" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-yellow-400 outline-none transition-all" />
                </div>
                <div className="relative md:col-span-2">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                    <input required type="password" placeholder="Create Access Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-yellow-400 outline-none transition-all" />
                </div>
             </div>
          </div>

          <button disabled={loading} className="w-full bg-yellow-400 text-black py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:scale-[1.01] transition-all shadow-2xl shadow-yellow-400/20 active:scale-95">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <><UserPlus size={20}/> INITIALIZE ACCOUNT</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
