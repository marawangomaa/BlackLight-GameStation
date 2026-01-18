
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

  return (
    <div className="space-y-32 animate-in fade-in pb-32">
      {/* Mega Hero Section */}
      <section className="relative min-h-[85vh] rounded-[4rem] overflow-hidden flex items-center p-8 md:p-20 border border-zinc-800 shadow-[0_0_100px_rgba(255,215,0,0.05)]">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-400/10 via-transparent to-transparent opacity-50 z-10"></div>
        
        <img 
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-[2px] opacity-40 transition-transform duration-[10s] hover:scale-100" 
          alt="Black Light Experience" 
        />
        
        <div className="relative z-20 w-full flex flex-col items-center lg:items-start text-center lg:text-left gap-10">
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start gap-4 animate-pulse">
              <span className="w-12 h-0.5 bg-yellow-400"></span>
              <span className="text-xs font-black uppercase tracking-[0.5em] text-yellow-400">
                {isAr ? 'المكان الأقوى في المحمودية' : 'THE ULTIMATE ARENA'}
              </span>
            </div>
            
            {/* The "Cool" Black Light Title */}
            <div className="relative">
              <h1 className="text-7xl md:text-[10rem] font-black text-white italic leading-none tracking-tighter select-none">
                BLACK<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500 drop-shadow-[0_0_30px_rgba(255,215,0,0.5)] animate-pulse">LIGHT</span>
              </h1>
              <div className="absolute -top-4 -right-12 hidden md:block">
                <div className="bg-yellow-400 text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest rotate-12 shadow-xl">EST. 2024</div>
              </div>
            </div>
            
            <p className="text-zinc-400 text-xl font-medium max-w-xl leading-relaxed mx-auto lg:mx-0">
              {isAr 
                ? 'استمتع بأفضل تجربة ألعاب، أفلام، ومباريات في قلب المحمودية. منطقة مخصصة للرفاهية والمتعة.' 
                : 'Immerse yourself in the premier gaming, cinema, and sports hub in El-Mahmudiya. A territory built for champions.'}
            </p>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4">
            <button 
              onClick={onEnter}
              className="group bg-yellow-400 text-black px-12 py-6 rounded-[2rem] font-black uppercase text-sm flex items-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,215,0,0.3)]"
            >
              {isLoggedIn 
                ? (isAr ? 'دخول لوحة التحكم' : 'ENTER COMMAND CENTER') 
                : (isAr ? 'دخول المنطقة' : 'ENTER THE AREA')} 
              <ArrowRight size={20} strokeWidth={4} className="group-hover:translate-x-2 transition-transform" />
            </button>
            <div className="flex items-center gap-4 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 px-8 py-5 rounded-[2rem]">
               <div className="w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
               <span className="text-[10px] font-black text-white uppercase tracking-widest italic">{isAr ? 'مفتوح الآن' : 'LIVE NOW'}</span>
            </div>
          </div>
        </div>

        {/* Floating Socials Bar */}
        <div className="absolute bottom-12 right-12 z-20 hidden lg:flex flex-col gap-6">
           <a href="https://www.facebook.com/profile.php?id=61556427669036" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-yellow-400 transition-colors"><Facebook size={20}/></a>
           <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-yellow-400 transition-colors"><Instagram size={20}/></a>
           <div className="h-20 w-px bg-zinc-800 mx-auto"></div>
           <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest [writing-mode:vertical-lr]">FOLLOW US</span>
        </div>
      </section>

      {/* Announcements Section */}
      {ads.length > 0 && (
        <section className="px-4 space-y-12">
          <div className="flex flex-col md:flex-row items-end justify-between gap-6">
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center text-black shadow-xl shadow-yellow-400/10">
                  <Megaphone size={32} />
               </div>
               <div>
                  <p className="text-yellow-400 text-[10px] font-black uppercase tracking-[0.4em] mb-1">{isAr ? 'آخر الأخبار' : 'LATEST UPDATES'}</p>
                  <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">{isAr ? 'إعلانات بلاك لايت' : 'ARENA BROADCASTS'}</h2>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayedAds.map((ad) => (
              <div 
                key={ad.id} 
                onClick={() => setSelectedAd(ad)}
                className="relative group bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden hover:border-yellow-400/50 transition-all duration-500 flex flex-col md:flex-row shadow-2xl cursor-pointer"
              >
                <div className="w-full md:w-64 h-64 md:h-auto overflow-hidden">
                  <img src={ad.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt={ad.title} />
                  {!ad.isPermanent && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl">
                      <Calendar size={12}/> {isAr ? 'عرض محدود' : 'LIMITED TIME'}
                    </div>
                  )}
                </div>
                <div className="flex-1 p-8 md:p-10 flex flex-col justify-center gap-4 bg-gradient-to-br from-zinc-900/50 to-transparent backdrop-blur-sm">
                   <h3 className="text-3xl font-black text-white italic leading-tight uppercase group-hover:text-yellow-400 transition-colors">{ad.title}</h3>
                   <p className="text-zinc-500 text-sm font-medium leading-relaxed line-clamp-2">{ad.description}</p>
                   <div className="mt-4 flex items-center gap-2 text-yellow-400 text-[10px] font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                     {isAr ? 'تفاصيل الإعلان' : 'VIEW DETAILS'} <ArrowRight size={14}/>
                   </div>
                </div>
              </div>
            ))}
          </div>

          {ads.length > 2 && (
            <div className="flex justify-center">
               <button 
                onClick={() => setShowAllAds(!showAllAds)}
                className="px-10 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white hover:border-yellow-400 transition-all"
               >
                 {showAllAds ? (isAr ? 'عرض أقل' : 'COLLAPSE FEED') : (isAr ? 'مشاهدة المزيد' : 'SEE MORE BROADCASTS')}
               </button>
            </div>
          )}
        </section>
      )}

      {/* Ad Details Modal */}
      {selectedAd && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
           <div className="w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-[3rem] overflow-hidden shadow-2xl relative flex flex-col md:flex-row">
              <button 
                onClick={() => setSelectedAd(null)}
                className="absolute top-6 right-6 z-20 p-3 bg-black/60 text-white rounded-full hover:bg-yellow-400 hover:text-black transition-all"
              >
                <X size={24} />
              </button>
              
              <div className="w-full md:w-1/2 h-[300px] md:h-auto relative">
                <img src={selectedAd.image} className="w-full h-full object-cover" alt={selectedAd.title} />
                {!selectedAd.isPermanent && (
                  <div className="absolute top-6 left-6 bg-red-500 text-white text-xs font-black uppercase px-4 py-2 rounded-full shadow-2xl">
                    {isAr ? 'ينتهي الإعلان قريباً' : 'EXPIRES SOON'}
                  </div>
                )}
              </div>

              <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center gap-8 bg-gradient-to-br from-zinc-900/30 to-black">
                 <div className="space-y-4">
                    <p className="text-yellow-400 text-[10px] font-black uppercase tracking-[0.4em]">{isAr ? 'بث رسمي' : 'OFFICIAL BROADCAST'}</p>
                    <h3 className="text-5xl font-black text-white italic leading-none tracking-tighter uppercase">{selectedAd.title}</h3>
                 </div>
                 
                 <p className="text-zinc-400 text-lg font-medium leading-relaxed">
                    {selectedAd.description}
                 </p>

                 <div className="flex flex-col gap-4">
                   {selectedAd.link && (
                     <a 
                      href={selectedAd.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-yellow-400 text-black px-8 py-5 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-yellow-400/10"
                     >
                       {isAr ? 'زيارة الرابط المرفق' : 'VISIT CAMPAIGN LINK'} <ExternalLink size={18} />
                     </a>
                   )}
                   <button 
                    onClick={() => setSelectedAd(null)}
                    className="px-8 py-5 border border-zinc-800 text-zinc-500 rounded-2xl font-black uppercase text-xs hover:bg-zinc-900 hover:text-white transition-all"
                   >
                     {isAr ? 'إغلاق' : 'CLOSE BROADCAST'}
                   </button>
                 </div>

                 <div className="flex items-center gap-3 text-zinc-700 text-[10px] font-black uppercase tracking-widest pt-4 border-t border-zinc-900">
                    <Calendar size={12}/> Published: {new Date(selectedAd.createdAt).toLocaleDateString()}
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Dynamic Services Grid */}
      <section className="space-y-16 px-4">
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-l-4 border-yellow-400 pl-8">
          <div>
            <p className="text-yellow-400 text-[10px] font-black uppercase tracking-[0.4em] mb-2">{isAr ? 'خدماتنا' : 'OUR OFFERINGS'}</p>
            <h2 className="text-5xl font-black text-white italic tracking-tighter">
              {isAr ? 'ما الذي يميز بلاك لايت؟' : 'WHY BLACK LIGHT?'}
            </h2>
          </div>
          <p className="text-zinc-500 max-w-xs text-xs font-bold uppercase tracking-widest leading-loose opacity-60">
            Premium Hardware. Elite Vibes. Direct Service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
            <div key={i} className="bg-zinc-950 border border-zinc-900 p-10 rounded-[3rem] group hover:border-yellow-400 hover:-translate-y-2 transition-all duration-300">
              <div className="w-20 h-20 bg-zinc-900 rounded-[2rem] flex items-center justify-center text-yellow-400 group-hover:bg-yellow-400 group-hover:text-black transition-all mb-8 shadow-2xl">
                <item.icon size={40} />
              </div>
              <h3 className="text-2xl font-black text-white italic mb-4">{item.title}</h3>
              <p className="text-zinc-500 text-sm font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Location / Social Fusion */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-[4rem] p-12 md:p-20 relative overflow-hidden group">
          <Activity className="absolute bottom-[-50px] right-[-50px] text-yellow-400 opacity-5 w-80 h-80 rotate-12" />
          
          <div className="relative z-10 space-y-12">
            <div className="space-y-4">
              <h3 className="text-5xl font-black text-white italic tracking-tighter">{isAr ? 'تواصل مع الكرو' : 'CONNECT WITH THE CREW'}</h3>
              <p className="text-zinc-500 max-w-md font-medium">
                {isAr 
                  ? 'انضم لمجتمعنا على السوشيال ميديا وشوف آخر العروض والبطولات.' 
                  : 'Join our community on social platforms for exclusive tournaments and daily offers.'}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <a href="https://www.facebook.com/profile.php?id=61556427669036" target="_blank" rel="noopener noreferrer" className="p-6 bg-zinc-950 rounded-3xl text-blue-500 hover:scale-110 hover:bg-blue-500 hover:text-white transition-all border border-zinc-800 shadow-xl"><Facebook size={28} fill="currentColor" /></a>
              <a href="http://instagram.com" target="_blank" rel="noopener noreferrer" className="p-6 bg-zinc-950 rounded-3xl text-pink-500 hover:scale-110 hover:bg-pink-500 hover:text-white transition-all border border-zinc-800 shadow-xl"><Instagram size={28} /></a>
              <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className="p-6 bg-zinc-950 rounded-3xl text-white hover:scale-110 hover:bg-white hover:text-black transition-all border border-zinc-800 shadow-xl"><Music size={28} /></a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-yellow-400 text-black rounded-2xl"><Phone size={24} /></div>
                <div>
                  <p className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">{isAr ? 'اتصل بنا' : 'HOTLINE'}</p>
                  <a href="tel:01068517773" className="text-xl font-black text-white">010 68517773</a>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="p-4 bg-yellow-400 text-black rounded-2xl"><MapPin size={24} /></div>
                <div>
                  <p className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">{isAr ? 'العنوان' : 'LOCATION'}</p>
                  <p className="text-sm font-bold text-white leading-tight">{isAr ? 'المحمودية - المنشية - شارع البوسطة' : 'El-Manshiya, El-Bosta St, El-Mahmudiya'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[600px] lg:h-auto rounded-[4rem] overflow-hidden border border-zinc-800 shadow-2xl relative">
           <div className="absolute inset-0 bg-yellow-400/5 mix-blend-overlay pointer-events-none"></div>
           <iframe 
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3410.155891399435!2d30.5555556!3d31.1333333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzHCsDA4JzAwLjAiTiAzMMKwMzMnMjAuMCJF!5e0!3m2!1sen!2seg!4v1715600000000!5m2!1sen!2seg" 
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: 'grayscale(1) contrast(1.2) invert(0.9)' }} 
              allowFullScreen 
              loading="lazy" 
           ></iframe>
        </div>
      </section>

      {/* Epic Call to Action */}
      <section className="relative bg-zinc-950 border border-zinc-900 rounded-[4rem] p-16 md:p-24 flex flex-col items-center text-center gap-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
        <Zap className="text-yellow-400 w-24 h-24 drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]" fill="currentColor" />
        
        <div className="space-y-4 max-w-2xl">
          <h3 className="text-6xl font-black text-white italic tracking-tighter uppercase">{isAr ? 'جاهز للتحدي؟' : 'READY TO PLAY?'}</h3>
          <p className="text-zinc-500 font-bold uppercase tracking-widest leading-loose">
            {isAr 
              ? 'احجز مكانك دلوقتي واستمتع بليلة ما تتنسيش في بلاك لايت كافيه.' 
              : 'Secure your terminal today and experience the next level of entertainment.'}
          </p>
        </div>

        <button 
          onClick={onEnter}
          className="bg-yellow-400 text-black px-16 py-6 rounded-[2rem] font-black uppercase text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,215,0,0.2)]"
        >
          {isAr ? 'احجز الآن' : 'BOOK MY SPOT'}
        </button>
      </section>
    </div>
  );
};

export default Home;
