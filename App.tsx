
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Home from './views/Home';
import Dashboard from './views/Dashboard';
import BookingSystem from './views/BookingSystem';
import OrdersSystem from './views/OrdersSystem';
import Architecture from './views/Architecture';
import AdminDelivery from './views/AdminDelivery';
import AdminUsers from './views/AdminUsers';
import AdminCatalog from './views/AdminCatalog';
import AdminAds from './views/AdminAds';
import Profile from './views/Profile';
import Login from './views/Login';
import Register from './views/Register';
import InstapayCheckout from './views/InstapayCheckout';
import StripeCheckout from './views/StripeCheckout';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<'login' | 'register' | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [paymentModal, setPaymentModal] = useState<{ active: boolean, amount: number, type: 'instapay' | 'stripe', id: string, category: 'order' | 'booking' }>({ 
    active: false, amount: 0, type: 'instapay', id: '', category: 'order' 
  });

  const isAr = lang === 'ar';
  const isAdmin = user?.role === 'Admin';

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const handleEnterArea = () => {
    if (user) {
      setActiveTab(isAdmin ? 'admin-dash' : 'dashboard');
    } else {
      setAuthView('login');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('home');
  };

  // Close sidebar on navigation (mobile)
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  if (!user && authView) {
    return authView === 'login' 
        ? <Login isAr={isAr} onLogin={u => { setUser(u); setAuthView(null); setActiveTab('home'); }} onSwitch={() => setAuthView('register')} /> 
        : <Register isAr={isAr} onRegister={u => { setUser(u); setAuthView(null); setActiveTab('home'); }} onBack={() => setAuthView('login')} />;
  }

  return (
    <div className={`min-h-screen bg-black text-gray-100 gaming-grid ${isAr ? 'font-arabic' : ''}`}>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-zinc-950 border-b border-zinc-800 z-40 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
            <span className="text-black font-black text-sm">BL</span>
          </div>
          <span className="text-sm font-black text-yellow-400">BLACK LIGHT</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-zinc-400 hover:text-white transition-colors"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        lang={lang} 
        setLang={setLang}
        role={user?.role || 'Customer'}
        isGuest={!user}
        onLoginRequest={() => setAuthView('login')}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <main className={`transition-all duration-300 pt-20 md:pt-8 pb-20 px-4 md:px-8 lg:px-12 ${isAr ? 'md:mr-64' : 'md:ml-64'}`}>
        <div className="max-w-7xl mx-auto">
          {activeTab === 'home' && <Home isAr={isAr} onEnter={handleEnterArea} isLoggedIn={!!user} />}
          
          {user && (
            <>
              {activeTab === 'dashboard' && <Dashboard isAr={isAr} user={user} />}
              {activeTab === 'bookings' && <BookingSystem isAr={isAr} role={user.role} user={user} onOpenPayment={setPaymentModal} />}
              {activeTab === 'orders' && <OrdersSystem isAr={isAr} role={user.role} user={user} onOpenPayment={setPaymentModal} />}
              {activeTab === 'profile' && <Profile isAr={isAr} user={user} onUpdate={setUser} />}
              
              {activeTab === 'admin-dash' && <Dashboard isAr={isAr} user={user} />}
              {activeTab === 'admin-ads' && <AdminAds isAr={isAr} />}
              {activeTab === 'admin-catalog' && <AdminCatalog isAr={isAr} />}
              {activeTab === 'admin-bookings' && <BookingSystem isAr={isAr} role={user.role} user={user} onOpenPayment={setPaymentModal} />}
              {activeTab === 'admin-orders' && <OrdersSystem isAr={isAr} role={user.role} user={user} onOpenPayment={setPaymentModal} />}
              {activeTab === 'admin-delivery' && <AdminDelivery isAr={isAr} />}
              {activeTab === 'admin-stock' && <AdminUsers isAr={isAr} />}
            </>
          )}
          
          {activeTab === 'architecture' && <Architecture isAr={isAr} />}
        </div>
      </main>

      {paymentModal.active && (
        paymentModal.type === 'instapay' ? (
          <InstapayCheckout 
              amount={paymentModal.amount} 
              id={paymentModal.id} 
              type={paymentModal.category} 
              onClose={() => setPaymentModal({...paymentModal, active: false})} 
              onSuccess={() => setPaymentModal({...paymentModal, active: false})} 
          />
        ) : (
          <StripeCheckout 
              amount={paymentModal.amount} 
              id={paymentModal.id} 
              type={paymentModal.category} 
              isAr={isAr}
              onClose={() => setPaymentModal({...paymentModal, active: false})} 
              onSuccess={() => setPaymentModal({...paymentModal, active: false})} 
          />
        )
      )}

      <div className="fixed bottom-0 left-0 right-0 h-1 bg-zinc-900 z-[60]">
        <div className={`h-full ${isAdmin ? 'bg-blue-500' : 'bg-yellow-400'} w-1/3 animate-pulse transition-all duration-500`}></div>
      </div>
    </div>
  );
};

export default App;
