
import React, { useState } from 'react';
import { Camera, Save, User as UserIcon, Mail, Phone, MapPin, Lock, Loader2, Check, Globe, RefreshCw, Upload } from 'lucide-react';
import { api } from '../services/api';
import { User } from '../types';

const Profile: React.FC<{ isAr: boolean, user: User, onUpdate: (u: User) => void }> = ({ isAr, user, onUpdate }) => {
  const [form, setForm] = useState(user);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
    const updated = await api.updateUser(user.id, form);
    onUpdate(updated);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in pb-20">
      <header className="text-center">
        <h2 className="text-4xl font-black text-white italic tracking-tighter">{isAr ? 'حسابي' : 'PROFILE TERMINAL'}</h2>
        <p className="text-zinc-500 font-medium">{isAr ? 'إدارة بياناتك وصورة الحساب.' : 'Update your identity across the Black Light network.'}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[3rem] flex flex-col items-center text-center shadow-2xl">
              <div className="relative group mb-6">
                 <img src={form.image} className="w-32 h-32 rounded-[2.5rem] object-cover border-4 border-zinc-950 shadow-2xl ring-4 ring-yellow-400/20" alt="Avatar" />
                 <label className="absolute inset-0 bg-black/60 rounded-[2.5rem] opacity-0 group-hover:opacity-100 cursor-pointer flex items-center justify-center transition-opacity">
                    <Upload className="text-white" size={32} />
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                 </label>
              </div>
              <h3 className="text-xl font-black text-white italic mb-1">{form.name}</h3>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mb-8">{form.role}</p>
              
              <div className="w-full space-y-4">
                 <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest text-left px-2">Preset Avatars</p>
                 <div className="flex flex-wrap justify-center gap-2">
                    {avatars.map((url, i) => (
                      <button 
                        key={i} 
                        type="button"
                        onClick={() => setForm({...form, image: url})}
                        className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all ${form.image === url ? 'border-yellow-400 scale-110 shadow-lg' : 'border-zinc-800 hover:border-zinc-700'}`}
                      >
                        <img src={url} alt="" />
                      </button>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 p-8 md:p-12 rounded-[3rem] space-y-8 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase flex items-center gap-2 tracking-widest px-1"><UserIcon size={12}/> Gamer Name</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-white focus:border-yellow-400 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase flex items-center gap-2 tracking-widest px-1"><Mail size={12}/> Registered Email</label>
                <input value={form.email} disabled className="w-full bg-zinc-950 border border-zinc-900 rounded-2xl px-5 py-4 text-sm text-zinc-600 opacity-50 cursor-not-allowed" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase flex items-center gap-2 tracking-widest px-1"><Phone size={12}/> Phone Link</label>
                <input value={form.phoneNumber} onChange={e => setForm({...form, phoneNumber: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-white focus:border-yellow-400 outline-none transition-all" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase flex items-center gap-2 tracking-widest px-1"><MapPin size={12}/> Gaming Location</label>
                <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-white focus:border-yellow-400 outline-none transition-all" />
              </div>
            </div>

            <button disabled={loading} className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-xl ${success ? 'bg-green-500 text-white' : 'bg-yellow-400 text-black hover:scale-[1.02] active:scale-95 shadow-yellow-400/10'}`}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : success ? <Check size={20} strokeWidth={3} /> : <><Save size={20}/> UPDATE DATABASE</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
