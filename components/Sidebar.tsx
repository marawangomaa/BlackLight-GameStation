
import React from 'react';
import { LayoutDashboard, Calendar, ShoppingCart, Box, Truck, User, ShieldAlert, Globe, Activity, UserCircle, Home, LogIn, LogOut, Database, Megaphone, X } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: 'en' | 'ar';
  setLang: (l: 'en' | 'ar') => void;
  role: 'Admin' | 'Customer';
  isGuest: boolean;
  onLoginRequest: () => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, lang, setLang, role, isGuest, onLoginRequest, onLogout, isOpen, onClose }) => {
  const isAr = lang === 'ar';
  const isAdmin = !isGuest && role === 'Admin';

  const guestItems = [
    { id: 'home', label: isAr ? 'الرئيسية' : 'Home', icon: Home },
  ];

  const customerItems = [
    { id: 'home', label: isAr ? 'الرئيسية' : 'Home', icon: Home },
    { id: 'dashboard', label: isAr ? 'نشاطاتي' : 'My Activity', icon: Activity },
    { id: 'bookings', label: isAr ? 'حجز محطة' : 'Book Room', icon: Calendar },
    { id: 'orders', label: isAr ? 'طلب أكل' : 'Order Cafe', icon: ShoppingCart },
    { id: 'profile', label: isAr ? 'الملف الشخصي' : 'My Profile', icon: UserCircle },
  ];

  const adminItems = [
    { id: 'home', label: isAr ? 'الرئيسية' : 'Home', icon: Home },
    { id: 'admin-dash', label: isAr ? 'لوحة التحكم' : 'Admin Operations', icon: LayoutDashboard },
    { id: 'admin-ads', label: isAr ? 'إدارة الإعلانات' : 'Campaign Manager', icon: Megaphone },
    { id: 'admin-catalog', label: isAr ? 'كتالوج المحل' : 'Manage Catalog', icon: Database },
    { id: 'admin-bookings', label: isAr ? 'إدارة الحجوزات' : 'Manage Bookings', icon: Calendar },
    { id: 'admin-orders', label: isAr ? 'طلبات الكافية' : 'POS & Orders', icon: ShoppingCart },
    { id: 'admin-delivery', label: isAr ? 'تتبع الدليفري' : 'Delivery Track', icon: Truck },
    { id: 'admin-stock', label: isAr ? 'قاعدة العملاء' : 'Manage Users', icon: Box },
    { id: 'profile', label: isAr ? 'ملفي' : 'Edit Profile', icon: UserCircle },
  ];

  const menuItems = isGuest ? guestItems : (isAdmin ? adminItems : customerItems);

  const sidebarClasses = `
    fixed inset-y-0 transition-transform duration-300 z-50 w-64 bg-zinc-950 border-zinc-800 flex flex-col
    ${isAr ? 'right-0 border-l' : 'left-0 border-r'}
    ${isOpen ? 'translate-x-0' : (isAr ? 'translate-x-full' : '-translate-x-full')}
    md:translate-x-0
  `;

  return (
    <div className={sidebarClasses}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${isAdmin ? 'bg-blue-500 shadow-blue-500/20 shadow-xl' : 'bg-yellow-400 shadow-yellow-400/20 shadow-xl'} rounded-lg flex items-center justify-center transition-colors`}>
              <span className="text-black font-black text-xl">BL</span>
            </div>
            <div>
              <h1 className={`text-xl font-bold tracking-tighter ${isAdmin ? 'text-blue-400' : 'text-yellow-400'}`}>BLACK LIGHT</h1>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                {isGuest ? (isAr ? 'عرض الضيف' : 'Guest View') : (isAdmin ? (isAr ? 'لوحة المشرف' : 'Admin Portal') : (isAr ? 'جناح اللاعب' : 'Gamer Suite'))}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="md:hidden text-zinc-500">
            <X size={20} />
          </button>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto scrollbar-hide">
        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-4 mb-2">{isGuest ? (isAr ? 'التنقل' : 'Navigation') : (isAdmin ? (isAr ? 'الإدارة' : 'Management') : (isAr ? 'محطة المستخدم' : 'User Terminal'))}</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id 
                  ? (isAdmin ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/10' : 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/10') 
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <Icon size={18} />
              <span className={`font-medium ${isAr ? 'text-right flex-1' : ''}`}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800 space-y-3">
        <button 
          onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
          className="w-full flex items-center justify-between px-4 py-2 bg-zinc-900 rounded-lg text-xs font-bold hover:text-zinc-300 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Globe size={14} />
            <span>{lang === 'en' ? 'English' : 'العربية'}</span>
          </div>
        </button>

        <button 
          onClick={isGuest ? onLoginRequest : onLogout}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-black uppercase tracking-widest text-[10px] ${
            isGuest 
            ? 'bg-yellow-400 text-black hover:scale-[1.02]' 
            : 'bg-zinc-900 text-zinc-500 hover:bg-red-500/20 hover:text-red-500'
          }`}
        >
          {isGuest ? <LogIn size={16} /> : <LogOut size={16} />}
          <span>{isGuest ? (isAr ? 'تسجيل دخول' : 'Login') : (isAr ? 'تسجيل خروج' : 'Logout')}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
