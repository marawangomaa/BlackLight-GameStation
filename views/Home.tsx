
import React, { useState, useEffect } from 'react';
import { Gamepad2, Zap, Trophy, Coffee, ArrowRight, Play, Users, Star, Flame, MapPin, Phone, Facebook, Instagram, Music, Film, Tv, Activity, Megaphone, Calendar, ExternalLink, X } from 'lucide-react';
import { Ad } from '../types';
import { api } from '../services/api';

interface HomeProps {
  isAr: boolean;
  onEnter: () => void;
  isLoggedIn: boolean;
}

const Home: React.FC<HomeProps> = ({ isAr, onEnter, isLoggedIn }) => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [showAllAds, setShowAllAds] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);

  useEffect(() => {
    api.getAds().then(setAds);
  }, []);

  const displayedAds = showAllAds ? ads : ads.slice(0, 2);
  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-16 md:space-y-32 animate-in fade-in pb-32">
      {/* Mega Hero Section */}
      <section className="relative min-h-[70vh] md:min-h-[85vh] rounded-[2rem] md:rounded-[4rem] overflow-hidden flex items-center p-6 md:p-20 border border-zinc-800 shadow-[0_0_100px_rgba(255,215,0,0.05)]">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-400/10 via-transparent to-transparent opacity-50 z-10"></div>
        
        <img 
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-[2px] opacity-40 transition-transform duration-[10s] hover:scale-100" 
          alt="Black Light Experience" 
        />
        
        <div className="relative z-20 w-full flex flex-col items-center lg:items-start text-center lg:text-left gap-6 md:gap-10">
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start gap-4 animate-pulse">
              <span className="w-8 md:w-12 h-0.5 bg-yellow-400"></span>
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-yellow-400">
                {isAr ? 'المكان الأقوى في المحمودية' : 'THE ULTIMATE ARENA'}
              </span>
            </div>
            
            {/* The "Cool" Black Light Title */}
            <div className="relative">
              <h1 className="text-5xl md:text-7xl lg:text-[10rem] font-black text-white italic leading-none tracking-tighter select-none">
                BLACK<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500 drop-shadow-[0_0_30px_rgba(255,215,0,0.5)] animate-pulse">LIGHT</span>
              </h1>
              <div className="absolute -top-4 -right-4 md:-right-12 hidden sm:block">
                <div className="bg-yellow-400 text-black px-3 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest rotate-12 shadow-xl">EST. {currentYear}</div>
              </div>
            </div>
            
            <p className="text-zinc-400 text-sm md:text-xl font-medium max-w-xl leading-relaxed mx-auto lg:mx-0">
              {isAr 
                ? 'استمتع بأفضل تجربة ألعاب، أفلام، ومباريات في قلب المحمودية. منطقة مخصصة للرفاهية والمتعة.' 
                : 'Immerse yourself in the premier gaming, cinema, and sports hub in El-Mahmudiya. A territory built for champions.'}
            </p>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-6 pt-4 w-full md:w-auto">
            <button 
              onClick={onEnter}
              className="group bg-yellow-400 text-black px-8 md:px-12 py-4 md:py-6 rounded-[1.5rem] md:rounded-[2rem] font-black uppercase text-xs md:text-sm flex items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,215,0,0.3)] w-full sm:w-auto"
            >
              {isLoggedIn 
                ? (isAr ? 'دخول لوحة التحكم' : 'ENTER COMMAND CENTER') 
                : (isAr ? 'دخول المنطقة' : 'ENTER THE AREA')} 
              <ArrowRight size={20} strokeWidth={4} className="group-hover:translate-x-2 transition-transform" />
            </button>
            <div className="flex items-center justify-center gap-4 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 px-6 md:px-8 py-4 md:py-5 rounded-[1.5rem] md:rounded-[2rem] w-full sm:w-auto">
               <div className="w-2 md:w-3 h-2 md:h-3 bg-green-500 rounded-full animate-ping"></div>
               <span className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-widest italic">{isAr ? 'مفتوح الآن' : 'LIVE NOW'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      {ads.length > 0 && (
        <section className="px-2 md:px-4 space-y-8 md:space-y-12">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
            <div className="flex items-center gap-4 text-center md:text-left">
               <div className="hidden sm:flex w-12 md:w-16 h-12 md:h-16 bg-yellow-400 rounded-2xl items-center justify-center text-black shadow-xl shadow-yellow-400/10">
                  <Megaphone size={32} />
               </div>
               <div>
                  <p className="text-yellow-400 text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] mb-1">{isAr ? 'آخر الأخبار' : 'LATEST UPDATES'}</p>
                  <h2 className="text-2xl md:text-4xl font-black text-white italic tracking-tighter uppercase">{isAr ? 'إعلانات بلاك لايت' : 'ARENA BROADCASTS'}</h2>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {displayedAds.map((ad) => (
              <div 
                key={ad.id} 
                onClick={() => setSelectedAd(ad)}
                className="relative group bg-zinc-950 border border-zinc-900 rounded-[2rem] md:rounded-[3rem] overflow-hidden hover:border-yellow-400/50 transition-all duration-500 flex flex-col sm:flex-row shadow-2xl cursor-pointer"
              >
                <div className="w-full sm:w-48 md:w-64 h-48 sm:h-auto overflow-hidden">
                  <img src={ad.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt={ad.title} />
                </div>
                <div className="flex-1 p-6 md:p-10 flex flex-col justify-center gap-3 bg-gradient-to-br from-zinc-900/50 to-transparent backdrop-blur-sm">
                   <h3 className="text-xl md:text-3xl font-black text-white italic leading-tight uppercase group-hover:text-yellow-400 transition-colors">{ad.title}</h3>
                   <p className="text-zinc-500 text-xs md:text-sm font-medium leading-relaxed line-clamp-2">{ad.description}</p>
                   <div className="mt-2 md:mt-4 flex items-center gap-2 text-yellow-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                     {isAr ? 'تفاصيل الإعلان' : 'VIEW DETAILS'} <ArrowRight size={14}/>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Dynamic Services Grid */}
      <section className="space-y-12 md:space-y-16 px-2 md:px-4">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 border-l-4 border-yellow-400 pl-6 md:pl-8">
          <div className="text-center md:text-left">
            <p className="text-yellow-400 text-[10px] font-black uppercase tracking-[0.4em] mb-2">{isAr ? 'خدماتنا' : 'OUR OFFERINGS'}</p>
            <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter">
              {isAr ? 'ما الذي يميز بلاك لايت؟' : 'WHY BLACK LIGHT?'}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {[
            { 
              icon: Gamepad2, 
              title: isAr ? 'بلاي ستيشن ٥' : 'PS5 PRO LOUNGE', 
              desc: isAr ? 'أحدث الأجهزة والشاشات لتجربة لعب مثالية.' : 'Unmatched graphics with PS5 Pro and 4K displays.' 
            },
            { 
              icon: Tv, 
              title: isAr ? 'مباريات مباشرة' : 'LIVE STADIUM', 
              desc: isAr ? 'شاهد مباريات فريقك المفضل في أجواء حماسية.' : 'Stadium-grade atmosphere for every major game.' 
            },
            { 
              icon: Film, 
              title: isAr ? 'سينما وأفلام' : 'PRIVATE CINEMA', 
              desc: isAr ? 'ليالي الأفلام مع أصدقائك بأفضل جودة صوت وصورة.' : 'Book a private screening with ultra HD quality.' 
            },
            { 
              icon: Star, 
              title: isAr ? 'أعياد ميلاد' : 'ELITE EVENTS', 
              desc: isAr ? 'نظم حفلة عيد ميلادك بمواصفات خاصة وممتعة.' : 'Customized setups for your special celebrations.' 
            },
          ].map((item, i) => (
            <div key={i} className="bg-zinc-950 border border-zinc-900 p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] group hover:border-yellow-400 hover:-translate-y-2 transition-all duration-300 text-center md:text-left">
              <div className="w-16 md:w-20 h-16 md:h-20 bg-zinc-900 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center text-yellow-400 group-hover:bg-yellow-400 group-hover:text-black transition-all mb-6 md:mb-8 shadow-2xl mx-auto md:mx-0">
                <item.icon size={32} md:size={40} />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white italic mb-4">{item.title}</h3>
              <p className="text-zinc-500 text-xs md:text-sm font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Epic Call to Action */}
      <section className="relative bg-zinc-950 border border-zinc-900 rounded-[2rem] md:rounded-[4rem] p-10 md:p-24 flex flex-col items-center text-center gap-8 md:gap-10 overflow-hidden mx-2 md:mx-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
        <Zap className="text-yellow-400 w-16 md:w-24 h-16 md:h-24 drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]" fill="currentColor" />
        
        <div className="space-y-4 max-w-2xl">
          <h3 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase">{isAr ? 'جاهز للتحدي؟' : 'READY TO PLAY?'}</h3>
          <p className="text-zinc-500 text-xs md:text-sm font-bold uppercase tracking-widest leading-loose">
            {isAr 
              ? 'احجز مكانك دلوقتي واستمتع بليلة ما تتنسيش في بلاك لايت كافيه.' 
              : 'Secure your terminal today and experience the next level of entertainment.'}
          </p>
        </div>

        <button 
          onClick={onEnter}
          className="bg-yellow-400 text-black px-10 md:px-16 py-4 md:py-6 rounded-[1.5rem] md:rounded-[2rem] font-black uppercase text-xs md:text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,215,0,0.2)]"
        >
          {isAr ? 'احجز الآن' : 'BOOK MY SPOT'}
        </button>
      </section>
    </div>
  );
};

export default Home;
