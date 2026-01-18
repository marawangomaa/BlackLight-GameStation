
import React, { useState } from 'react';
import { Smartphone, CheckCircle2, ShieldCheck, ArrowRight, Loader2, X } from 'lucide-react';
import { api } from '../services/api';

interface InstapayProps {
  amount: number;
  onSuccess: () => void;
  onClose: () => void;
  type: 'order' | 'booking';
  id: string;
}

const InstapayCheckout: React.FC<InstapayProps> = ({ amount, onSuccess, onClose, type, id }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const simulatePayment = () => {
    setLoading(true);
    setTimeout(async () => {
      await api.markPaid(type, id);
      setStep(3);
      setLoading(false);
      setTimeout(() => onSuccess(), 2000);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Smartphone className="text-white" size={24} />
                <span className="text-white font-black text-sm uppercase tracking-widest">Instapay Checkout</span>
            </div>
            <button onClick={onClose} className="text-white/50 hover:text-white"><X size={20}/></button>
        </div>

        <div className="p-8 space-y-8">
          {step === 1 && (
            <div className="space-y-6 text-center animate-in zoom-in-95">
              <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                <p className="text-xs font-bold text-zinc-500 uppercase mb-1">Paying To</p>
                <p className="text-lg font-black text-white">BLACK LIGHT GAMING</p>
                <p className="text-[10px] text-zinc-600 mt-1 tracking-widest">IPA: blacklight@instapay</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-zinc-500 uppercase mb-2">Total Amount</p>
                <p className="text-4xl font-black text-white">{amount} <span className="text-sm font-normal opacity-50">EGP</span></p>
              </div>
              <button onClick={() => setStep(2)} className="w-full bg-yellow-400 text-black py-4 rounded-xl font-black uppercase text-xs flex items-center justify-center gap-2">
                Proceed with Wallet <ArrowRight size={16} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 text-center animate-in slide-in-from-right-4">
              <div className="w-48 h-48 bg-white p-2 mx-auto rounded-xl">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=instapay://pay?ipa=blacklight@instapay&amt=${amount}`} className="w-full h-full" alt="QR Code" />
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed px-4">
                Open your <span className="text-yellow-400 font-bold underline">Instapay Egypt</span> app and scan this code or use our IPA to complete the transfer.
              </p>
              <button disabled={loading} onClick={simulatePayment} className="w-full bg-white text-black py-4 rounded-xl font-black uppercase text-xs flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" size={18} /> : <><ShieldCheck size={18}/> I've Transferred the Money</>}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="py-12 text-center animate-in zoom-in-110">
              <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-xl font-black text-white mb-2">Payment Successful!</h3>
              <p className="text-xs text-zinc-500">Transaction ID: TX-{Math.random().toString(36).substr(2, 8).toUpperCase()}</p>
            </div>
          )}
        </div>

        <div className="px-8 py-4 bg-zinc-950 border-t border-zinc-800 text-[9px] text-zinc-600 text-center font-bold uppercase tracking-widest">
            Direct & Secure Egyptian Banking Switch
        </div>
      </div>
    </div>
  );
};

export default InstapayCheckout;
