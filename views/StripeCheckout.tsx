
import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Lock, Loader2, X, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

interface StripeProps {
  amount: number;
  onSuccess: () => void;
  onClose: () => void;
  type: 'order' | 'booking';
  id: string;
  isAr: boolean;
}

const StripeCheckout: React.FC<StripeProps> = ({ amount, onSuccess, onClose, type, id, isAr }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '', name: '' });

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate real network latency
    await new Promise(r => setTimeout(r, 2000));
    await api.markPaid(type, id);
    setSuccess(true);
    setLoading(false);
    setTimeout(() => onSuccess(), 2000);
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-500/20 animate-bounce">
            <CheckCircle2 className="text-white" size={48} />
          </div>
          <h3 className="text-3xl font-black text-white italic">{isAr ? 'تم الدفع بنجاح' : 'PAYMENT SUCCESSFUL'}</h3>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Redirecting to Terminal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] overflow-hidden shadow-2xl text-zinc-900">
        <header className="p-8 bg-zinc-50 border-b border-zinc-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xs">S</div>
            <span className="font-black uppercase tracking-tighter text-sm">Stripe Secure Checkout</span>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-900"><X size={20}/></button>
        </header>

        <form onSubmit={handlePay} className="p-8 space-y-6">
          <div className="text-center mb-8">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{isAr ? 'المبلغ المطلوب' : 'AMOUNT TO PAY'}</p>
            <p className="text-4xl font-black">{amount} <span className="text-sm font-normal text-zinc-400">EGP</span></p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Cardholder Name</label>
              <input required value={card.name} onChange={e => setCard({...card, name: e.target.value})} className="w-full bg-zinc-100 border border-zinc-200 rounded-xl p-4 text-sm focus:border-blue-500 outline-none" placeholder="John Doe" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Card Number</label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input required maxLength={16} value={card.number} onChange={e => setCard({...card, number: e.target.value})} className="w-full bg-zinc-100 border border-zinc-200 rounded-xl p-4 pl-12 text-sm focus:border-blue-500 outline-none" placeholder="4242 4242 4242 4242" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Expiry Date</label>
                <input required maxLength={5} value={card.expiry} onChange={e => setCard({...card, expiry: e.target.value})} className="w-full bg-zinc-100 border border-zinc-200 rounded-xl p-4 text-sm focus:border-blue-500 outline-none" placeholder="MM/YY" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">CVC</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input required maxLength={3} value={card.cvc} onChange={e => setCard({...card, cvc: e.target.value})} className="w-full bg-zinc-100 border border-zinc-200 rounded-xl p-4 pl-12 text-sm focus:border-blue-500 outline-none" placeholder="123" />
                </div>
              </div>
            </div>
          </div>

          <button disabled={loading} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95">
            {loading ? <Loader2 className="animate-spin" size={20}/> : <><ShieldCheck size={20}/> PAY SECURELY</>}
          </button>

          <div className="flex items-center justify-center gap-2 opacity-40">
            <Lock size={12}/>
            <span className="text-[9px] font-black uppercase tracking-widest">Encrypted SSL Connection</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StripeCheckout;
