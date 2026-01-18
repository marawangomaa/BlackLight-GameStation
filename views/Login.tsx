
import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { User } from '../types';

const Login: React.FC<{ onLogin: (u: User) => void, onSwitch: () => void, isAr: boolean }> = ({ onLogin, onSwitch, isAr }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const user = await api.login(email, pass);
    if (user) onLogin(user);
    else setError(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-black gaming-grid">
      <div className="w-full max-w-md space-y-8 animate-in zoom-in-95 duration-500">
        <div className="text-center">
          <div className="w-20 h-20 bg-yellow-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-yellow-400/20 rotate-3 hover:rotate-0 transition-transform">
            <span className="text-black font-black text-4xl">BL</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter italic">BLACK LIGHT</h1>
          <p className="text-zinc-500 mt-2 font-medium">Elevate your gaming experience.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl space-y-6 backdrop-blur-xl">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                required
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-yellow-400 outline-none transition-all" 
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                required
                type="password" 
                placeholder="Password" 
                value={pass}
                onChange={e => setPass(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-yellow-400 outline-none transition-all" 
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-xs text-center font-bold">Invalid credentials. Please try again.</p>}

          <button disabled={loading} className="w-full bg-yellow-400 text-black py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <><ShieldCheck size={20}/> LOG IN <ArrowRight size={18}/></>}
          </button>

          <p className="text-center text-zinc-500 text-xs">
            Don't have an account? <button type="button" onClick={onSwitch} className="text-yellow-400 font-bold hover:underline">Register now</button>
          </p>
        </form>

        <div className="bg-zinc-900/30 p-4 rounded-2xl border border-zinc-800 text-center">
            <p className="text-[10px] text-zinc-600 font-bold uppercase mb-2">Demo Admin Access</p>
            <p className="text-[10px] text-zinc-400">blacklight@game.com / Mm123456!</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
