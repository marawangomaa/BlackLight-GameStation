
import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, Trash2, Edit, Save, X, Camera, Loader2, Calendar, Link as LinkIcon, Globe } from 'lucide-react';
import { api } from '../services/api';
import { Ad } from '../types';

const AdminAds: React.FC<{ isAr: boolean }> = ({ isAr }) => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [editingAd, setEditingAd] = useState<Partial<Ad> | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const data = await api.getAds();
    setAds(data);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editingAd?.title || !editingAd?.description) return;
    setLoading(true);
    await api.saveAd(editingAd);
    setEditingAd(null);
    load();
    setLoading(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingAd(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteAd = async (id: string) => {
    if (!window.confirm(isAr ? 'حذف هذا الإعلان؟' : 'Delete this campaign?')) return;
    await api.deleteAd(id);
    load();
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">{isAr ? 'إدارة الإعلانات' : 'CAMPAIGN MANAGER'}</h2>
          <p className="text-zinc-500">{isAr ? 'تحكم في ما يراه اللاعبون على الصفحة الرئيسية.' : 'Target your audience with high-impact arena broadcasts.'}</p>
        </div>
        <button 
          onClick={() => setEditingAd({ title: '', description: '', isPermanent: true, image: '' })}
          className="flex items-center gap-2 px-8 py-3 bg-yellow-400 text-black rounded-2xl font-black uppercase text-xs shadow-xl shadow-yellow-400/10 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={16} strokeWidth={3} /> {isAr ? 'إعلان جديد' : 'NEW CAMPAIGN'}
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ads.map((ad) => (
          <div key={ad.id} className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden flex flex-col group hover:border-blue-500/40 transition-all shadow-xl">
            <div className="h-48 relative overflow-hidden">
              <img src={ad.image || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800'} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
              <div className="absolute top-4 right-4 flex gap-2">
                <button onClick={() => setEditingAd(ad)} className="p-2.5 bg-black/60 backdrop-blur-md rounded-xl text-white hover:bg-blue-500 transition-colors"><Edit size={16}/></button>
                <button onClick={() => deleteAd(ad.id)} className="p-2.5 bg-black/60 backdrop-blur-md rounded-xl text-white hover:bg-red-500 transition-colors"><Trash2 size={16}/></button>
              </div>
              <div className="absolute bottom-4 left-4">
                 <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${ad.isPermanent ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {ad.isPermanent ? (isAr ? 'دائم' : 'PERMANENT') : (isAr ? 'مؤقت' : 'TIMED')}
                 </span>
              </div>
            </div>
            <div className="p-8 space-y-4">
               <h3 className="text-xl font-black text-white italic truncate uppercase">{ad.title}</h3>
               <p className="text-zinc-500 text-xs line-clamp-2 leading-relaxed">{ad.description}</p>
               {ad.expiresAt && !ad.isPermanent && (
                 <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 border-t border-zinc-800 pt-4">
                    <Calendar size={12}/> {isAr ? 'ينتهي في:' : 'Expires:'} {new Date(ad.expiresAt).toLocaleDateString()}
                 </div>
               )}
            </div>
          </div>
        ))}
      </div>

      {editingAd && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-[3.5rem] overflow-hidden shadow-2xl">
            <header className="p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-800/20">
              <h3 className="text-2xl font-black text-white italic">{editingAd.id ? 'EDIT CAMPAIGN' : 'LAUNCH NEW CAMPAIGN'}</h3>
              <button onClick={() => setEditingAd(null)} className="text-zinc-500 hover:text-white"><X/></button>
            </header>
            <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto scrollbar-hide">
              <div className="flex flex-col md:flex-row gap-10">
                <div className="w-full md:w-1/3 flex flex-col items-center gap-4">
                  <div className="w-full aspect-square rounded-[2rem] overflow-hidden relative group border-2 border-dashed border-zinc-800 bg-black flex items-center justify-center">
                    {editingAd.image ? (
                      <img src={editingAd.image} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="text-center space-y-2 opacity-20">
                        <Camera size={48} className="mx-auto" />
                        <p className="text-[10px] font-black uppercase">Click to upload</p>
                      </div>
                    )}
                    <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Select Image</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex-1 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase ml-2 tracking-widest">Campaign Title</label>
                    <input 
                      value={editingAd.title || ''} 
                      onChange={e => setEditingAd({...editingAd, title: e.target.value})} 
                      className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-sm text-white focus:border-blue-500 outline-none font-bold" 
                      placeholder="e.g. MEGA TOURNAMENT" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase ml-2 tracking-widest">Announcement Text</label>
                    <textarea 
                      value={editingAd.description || ''} 
                      onChange={e => setEditingAd({...editingAd, description: e.target.value})} 
                      className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-sm text-white focus:border-blue-500 outline-none min-h-[120px] font-medium leading-relaxed" 
                      placeholder="Describe the event or offer..." 
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-zinc-800">
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-zinc-600 uppercase ml-2 tracking-widest flex items-center gap-2">
                      <LinkIcon size={12}/> Destination Link (Optional)
                   </label>
                   <input 
                    value={editingAd.link || ''} 
                    onChange={e => setEditingAd({...editingAd, link: e.target.value})} 
                    className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-sm text-white focus:border-blue-500 outline-none" 
                    placeholder="https://facebook.com/events/..." 
                   />
                </div>
                
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-zinc-600 uppercase ml-2 tracking-widest flex items-center gap-2">
                      <Calendar size={12}/> Campaign Duration
                   </label>
                   <div className="flex p-1 bg-black border border-zinc-800 rounded-2xl">
                      <button 
                        onClick={() => setEditingAd({...editingAd, isPermanent: true, expiresAt: undefined})}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${editingAd.isPermanent ? 'bg-zinc-800 text-white' : 'text-zinc-600'}`}
                      >
                        Permanent
                      </button>
                      <button 
                        onClick={() => setEditingAd({...editingAd, isPermanent: false, expiresAt: new Date(Date.now() + 86400000).toISOString()})}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${!editingAd.isPermanent ? 'bg-zinc-800 text-white' : 'text-zinc-600'}`}
                      >
                        Timed
                      </button>
                   </div>
                   {!editingAd.isPermanent && (
                     <div className="animate-in slide-in-from-top-2">
                        <input 
                          type="date" 
                          value={editingAd.expiresAt ? editingAd.expiresAt.split('T')[0] : ''} 
                          onChange={e => setEditingAd({...editingAd, expiresAt: new Date(e.target.value).toISOString()})}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-xs text-white outline-none focus:border-blue-500"
                        />
                     </div>
                   )}
                </div>
              </div>

              <button 
                onClick={handleSave} 
                disabled={loading} 
                className="w-full py-6 bg-blue-500 text-white rounded-[2rem] font-black uppercase text-xs shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all mt-4"
              >
                {loading ? <Loader2 className="animate-spin" size={20}/> : <><Megaphone size={20}/> PUBLISH BROADCAST</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAds;
