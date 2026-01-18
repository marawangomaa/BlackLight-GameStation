
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Camera, Loader2, Save, X, Coffee, Gamepad2, Pizza, Cookie } from 'lucide-react';
import { api } from '../services/api';
import { Room, Product } from '../types';

const AdminCatalog: React.FC<{ isAr: boolean }> = ({ isAr }) => {
  const [activeTab, setActiveTab] = useState<'rooms' | 'products'>('rooms');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [editingRoom, setEditingRoom] = useState<Partial<Room> | null>(null);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  const load = async () => {
    const [r, p] = await Promise.all([api.getRooms(), api.getProducts()]);
    setRooms(r);
    setProducts(p);
  };

  useEffect(() => { load(); }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'room' | 'product') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'room') setEditingRoom(prev => ({ ...prev, image: reader.result as string }));
        else setEditingProduct(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveRoom = async () => {
    if (!editingRoom?.name) return;
    setLoading(true);
    await api.saveRoom({
      id: editingRoom.id || 0,
      name: editingRoom.name || '',
      type: editingRoom.type || 'Standard',
      pricePerHour: editingRoom.pricePerHour || 0,
      psModel: editingRoom.psModel || 'PS5',
      isAvailable: true,
      description: editingRoom.description || '',
      image: editingRoom.image || ''
    });
    setEditingRoom(null);
    load();
    setLoading(false);
  };

  const saveProduct = async () => {
    if (!editingProduct?.name) return;
    setLoading(true);
    await api.saveProduct({
      id: editingProduct.id || 0,
      name: editingProduct.name || '',
      category: editingProduct.category || 'Drink',
      price: editingProduct.price || 0,
      stock: editingProduct.stock || 0,
      description: editingProduct.description || '',
      image: editingProduct.image || ''
    });
    setEditingProduct(null);
    load();
    setLoading(false);
  };

  const deleteItem = async (type: 'room' | 'product', id: number) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد؟' : 'Are you sure?')) return;
    if (type === 'room') await api.deleteRoom(id);
    else await api.deleteProduct(id);
    load();
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-white italic">{isAr ? 'إدارة الكتالوج' : 'CATALOG MANAGEMENT'}</h2>
          <p className="text-zinc-500">{isAr ? 'تخصيص الغرف وقائمة المأكولات.' : 'Customize rooms and cafe menu items.'}</p>
        </div>
        <div className="flex gap-2 p-1.5 bg-zinc-900 rounded-2xl border border-zinc-800">
          <button onClick={() => setActiveTab('rooms')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'rooms' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-zinc-500'}`}>
            {isAr ? 'الغرف' : 'Rooms'}
          </button>
          <button onClick={() => setActiveTab('products')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'products' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-zinc-500'}`}>
            {isAr ? 'الكافيه' : 'Cafe'}
          </button>
        </div>
      </header>

      <div className="flex justify-end">
        <button 
          onClick={() => activeTab === 'rooms' ? setEditingRoom({}) : setEditingProduct({})}
          className="flex items-center gap-2 px-6 py-3 bg-yellow-400 text-black rounded-2xl font-black uppercase text-xs shadow-xl shadow-yellow-400/10 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={16} strokeWidth={3} /> {isAr ? 'إضافة جديد' : 'ADD NEW'}
        </button>
      </div>

      {activeTab === 'rooms' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map(room => (
            <div key={room.id} className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden flex flex-col group transition-all hover:border-blue-500/40">
              <div className="h-48 relative overflow-hidden">
                <img src={room.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600'} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button onClick={() => setEditingRoom(room)} className="p-2.5 bg-black/60 backdrop-blur-md rounded-xl text-white hover:bg-blue-500 transition-colors"><Edit size={16}/></button>
                  <button onClick={() => deleteItem('room', room.id)} className="p-2.5 bg-black/60 backdrop-blur-md rounded-xl text-white hover:bg-red-500 transition-colors"><Trash2 size={16}/></button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-black text-white italic">{room.name}</h3>
                  <span className="text-blue-400 text-[10px] font-black uppercase bg-blue-500/10 px-2 py-1 rounded">{room.type}</span>
                </div>
                <p className="text-zinc-500 text-xs line-clamp-2">{room.description}</p>
                <div className="flex justify-between items-center pt-2 border-t border-zinc-800">
                  <span className="text-sm font-bold text-zinc-400">{room.psModel}</span>
                  <span className="text-xl font-black text-white">{room.pricePerHour} <span className="text-xs font-normal opacity-50">EGP/h</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-6 flex flex-col gap-4 group hover:border-blue-500/40 transition-all">
              <div className="h-40 rounded-3xl overflow-hidden relative">
                <img src={product.image || 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=400'} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
                <div className="absolute bottom-2 right-2 flex gap-1">
                   <button onClick={() => setEditingProduct(product)} className="p-2 bg-black/80 rounded-lg text-white"><Edit size={14}/></button>
                   <button onClick={() => deleteItem('product', product.id)} className="p-2 bg-black/80 rounded-lg text-red-400"><Trash2 size={14}/></button>
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-white italic truncate">{product.name}</h4>
                <p className="text-[10px] text-zinc-500 uppercase font-black">{product.category} · STOCK: {product.stock}</p>
              </div>
              <p className="text-xs text-zinc-600 line-clamp-1">{product.description}</p>
              <div className="flex justify-between items-center mt-auto">
                <span className="text-xl font-black text-white">{product.price} <span className="text-xs font-normal opacity-50">EGP</span></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Room Edit Modal */}
      {editingRoom && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-[3rem] overflow-hidden shadow-2xl">
            <header className="p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-800/20">
              <h3 className="text-2xl font-black text-white italic">{editingRoom.id ? 'EDIT ROOM' : 'NEW ROOM'}</h3>
              <button onClick={() => setEditingRoom(null)} className="text-zinc-500 hover:text-white"><X/></button>
            </header>
            <div className="p-8 space-y-6">
              <div className="flex flex-col items-center gap-4">
                <div className="w-40 h-40 rounded-[2rem] overflow-hidden relative group border-2 border-dashed border-zinc-800">
                  {editingRoom.image ? <img src={editingRoom.image} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-zinc-700"><Camera size={48}/></div>}
                  <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <span className="text-[10px] font-black text-white">UPLOAD PHOTO</span>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'room')} className="hidden" />
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-black text-zinc-600 uppercase ml-2">Station Name</label>
                  <input value={editingRoom.name || ''} onChange={e => setEditingRoom({...editingRoom, name: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-sm text-white focus:border-blue-500 outline-none" placeholder="e.g. VIP Room 1" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-zinc-600 uppercase ml-2">Type</label>
                  <select value={editingRoom.type} onChange={e => setEditingRoom({...editingRoom, type: e.target.value as any})} className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-sm text-white focus:border-blue-500 outline-none appearance-none">
                    <option value="Standard">Standard</option>
                    <option value="VIP">VIP</option>
                    <option value="Cinema">Cinema</option>
                    <option value="Matches">Matches</option>
                    <option value="Streaming">Streaming</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-zinc-600 uppercase ml-2">PS Model</label>
                  <input value={editingRoom.psModel || ''} onChange={e => setEditingRoom({...editingRoom, psModel: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-sm text-white focus:border-blue-500 outline-none" placeholder="e.g. PS5 Pro" />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-black text-zinc-600 uppercase ml-2">Price Per Hour (EGP)</label>
                  <input type="number" value={editingRoom.pricePerHour || ''} onChange={e => setEditingRoom({...editingRoom, pricePerHour: Number(e.target.value)})} className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-sm text-white focus:border-blue-500 outline-none" />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-black text-zinc-600 uppercase ml-2">Description</label>
                  <textarea value={editingRoom.description || ''} onChange={e => setEditingRoom({...editingRoom, description: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-sm text-white focus:border-blue-500 outline-none min-h-[100px]" placeholder="Briefly describe the room's features..." />
                </div>
              </div>
              <button onClick={saveRoom} disabled={loading} className="w-full py-5 bg-blue-500 text-white rounded-[2rem] font-black uppercase text-xs shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all">
                {loading ? <Loader2 className="animate-spin" size={20}/> : <><Save size={20}/> PERSIST CHANGES</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-[3rem] overflow-hidden shadow-2xl">
            <header className="p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-800/20">
              <h3 className="text-2xl font-black text-white italic">{editingProduct.id ? 'EDIT MENU ITEM' : 'NEW MENU ITEM'}</h3>
              <button onClick={() => setEditingProduct(null)} className="text-zinc-500 hover:text-white"><X/></button>
            </header>
            <div className="p-8 space-y-6">
              <div className="flex flex-col items-center gap-4">
                <div className="w-40 h-40 rounded-[2rem] overflow-hidden relative group border-2 border-dashed border-zinc-800">
                  {editingProduct.image ? <img src={editingProduct.image} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-zinc-700"><Camera size={48}/></div>}
                  <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <span className="text-[10px] font-black text-white">UPLOAD PHOTO</span>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'product')} className="hidden" />
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-black text-zinc-600 uppercase ml-2">Item Name</label>
                  <input value={editingProduct.name || ''} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-sm text-white focus:border-blue-500 outline-none" placeholder="e.g. Monster Energy" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-zinc-600 uppercase ml-2">Category</label>
                  <select value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value as any})} className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-sm text-white focus:border-blue-500 outline-none appearance-none">
                    <option value="Drink">Drink</option>
                    <option value="Snack">Snack</option>
                    <option value="Meal">Meal</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-zinc-600 uppercase ml-2">Stock Level</label>
                  <input type="number" value={editingProduct.stock || ''} onChange={e => setEditingProduct({...editingProduct, stock: Number(e.target.value)})} className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-sm text-white focus:border-blue-500 outline-none" placeholder="0" />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-black text-zinc-600 uppercase ml-2">Price (EGP)</label>
                  <input type="number" value={editingProduct.price || ''} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-sm text-white focus:border-blue-500 outline-none" />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-black text-zinc-600 uppercase ml-2">Description</label>
                  <textarea value={editingProduct.description || ''} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-sm text-white focus:border-blue-500 outline-none min-h-[100px]" placeholder="Flavor notes, ingredients, etc..." />
                </div>
              </div>
              <button onClick={saveProduct} disabled={loading} className="w-full py-5 bg-blue-500 text-white rounded-[2rem] font-black uppercase text-xs shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all">
                {loading ? <Loader2 className="animate-spin" size={20}/> : <><Save size={20}/> UPDATE MENU</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCatalog;
