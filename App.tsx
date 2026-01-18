
import React, { useState, useEffect } from 'react';
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

  // If user is trying to auth
  if (!user && authView) {
    return authView === 'login' 
        ? <Login isAr={isAr} onLogin={u => { setUser(u); setAuthView(null); setActiveTab('home'); }} onSwitch={() => setAuthView('register')} /> 
        : <Register isAr={isAr} onRegister={u => { setUser(u); setAuthView(null); setActiveTab('home'); }} onBack={() => setAuthView('login')} />;
  }

  return (
    <div className={`min-h-screen bg-black text-gray-100 gaming-grid ${isAr ? 'font-arabic' : ''}`}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        lang={lang} 
        setLang={setLang}
        role={user?.role || 'Customer'}
        isGuest={!user}
        onLoginRequest={() => setAuthView('login')}
        onLogout={handleLogout}
      />
      
      <main className={`transition-all duration-300 pt-8 pb-20 px-4 md:px-8 lg:px-12 ${isAr ? 'mr-64' : 'ml-64'}`}>
        <div className="max-w-7xl mx-auto">
          {activeTab === 'home' && <Home isAr={isAr} onEnter={handleEnterArea} isLoggedIn={!!user} />}
          
          {user && (
            <>
              {activeTab === 'dashboard' && <Dashboard isAr={isAr} user={user} />}
              {activeTab === 'bookings' && <BookingSystem isAr={isAr} role={user.role} user={user} onOpenPayment={setPaymentModal} />}
              {activeTab === 'orders' && <OrdersSystem isAr={isAr} role={user.role} user={user} onOpenPayment={setPaymentModal} />}
              {activeTab === 'profile' && <Profile isAr={isAr} user={user} onUpdate={setUser} />}
              
              {/* Admin Specific Views */}
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

      <div className="fixed bottom-0 left-0 right-0 h-1.5 bg-zinc-900 z-[60]">
        <div className={`h-full ${isAdmin ? 'bg-blue-500' : 'bg-yellow-400'} w-1/3 animate-pulse transition-all duration-500`}></div>
      </div>
    </div>
  );
};

export default App;
