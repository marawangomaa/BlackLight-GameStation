
import React, { useState } from 'react';
import { Database, Layout, Server, Shield, CreditCard, ChevronRight, Code2 } from 'lucide-react';
import { BACKEND_ARCHITECTURE_MD, DATABASE_ENTITY_SNIPPET, DB_CONTEXT_SNIPPET, ANGULAR_STRUCTURE_SNIPPET } from '../constants';

const Architecture: React.FC<{ isAr: boolean }> = ({ isAr }) => {
  const [activeTab, setActiveTab] = useState<'backend' | 'database' | 'frontend' | 'payment'>('backend');

  const CodeBlock = ({ code, title }: { code: string; title: string }) => (
    <div className="rounded-xl overflow-hidden border border-zinc-800 bg-black my-4">
      <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center">
        <span className="text-xs font-mono text-zinc-500">{title}</span>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
        </div>
      </div>
      <pre className="p-4 text-xs font-mono overflow-x-auto text-yellow-50/80 leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-bold tracking-tight text-white mb-1">
          {isAr ? 'مواصفات النظام' : 'System Specifications'}
        </h2>
        <p className="text-zinc-500">
          {isAr ? 'الهندسة المعمارية والتقنيات المستخدمة في بلاك لايت.' : 'Deep dive into Black Light\'s technical foundations.'}
        </p>
      </header>

      <div className="flex flex-wrap gap-2 p-1 bg-zinc-900/50 rounded-xl border border-zinc-800 w-fit">
        {[
          { id: 'backend', label: isAr ? 'الخلفية البرمجية' : 'Backend (Onion)', icon: Server },
          { id: 'database', label: isAr ? 'قاعدة البيانات' : 'Database (ERD)', icon: Database },
          { id: 'frontend', label: isAr ? 'الواجهة الأمامية' : 'Frontend (Angular)', icon: Layout },
          { id: 'payment', label: isAr ? 'بوابة الدفع' : 'Payment (Instapay)', icon: CreditCard },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? 'bg-yellow-400 text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-8 min-h-[500px]">
        {activeTab === 'backend' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="prose prose-invert prose-yellow max-w-none">
              <h3 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
                <Shield className="text-yellow-400" />
                .NET 8 Onion Architecture
              </h3>
              <div className="text-zinc-400 space-y-4 whitespace-pre-line text-sm leading-relaxed">
                {BACKEND_ARCHITECTURE_MD}
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
                <h4 className="font-bold text-white mb-4">{isAr ? 'مبادئ SOLID المطبقة' : 'Applied SOLID Principles'}</h4>
                <ul className="space-y-3">
                  {[
                    { p: 'Single Responsibility', d: 'Each service handles exactly one business domain (Booking, Order).' },
                    { p: 'Open/Closed', d: 'Extending functionality via interfaces without modifying core entities.' },
                    { p: 'Liskov Substitution', d: 'Derived repository implementations satisfy base constraints.' },
                    { p: 'Interface Segregation', d: 'Granular interfaces (IBookingRead, IBookingWrite).' },
                    { p: 'Dependency Inversion', d: 'High-level business logic depends on abstractions, not details.' },
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1.5 shrink-0"></div>
                      <div>
                        <span className="font-bold text-zinc-300 block">{item.p}</span>
                        <span className="text-zinc-500">{item.d}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'database' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                <h4 className="text-yellow-400 font-bold mb-4">Users & Identity</h4>
                <ul className="text-xs text-zinc-400 space-y-2">
                  <li className="flex justify-between"><span>ApplicationUser</span> <span className="text-zinc-600">PK</span></li>
                  <li className="flex justify-between"><span>UserRoles</span> <span className="text-zinc-600">Join</span></li>
                  <li className="flex justify-between"><span>Roles</span> <span className="text-zinc-600">PK</span></li>
                </ul>
              </div>
              <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                <h4 className="text-yellow-400 font-bold mb-4">Core Booking</h4>
                <ul className="text-xs text-zinc-400 space-y-2">
                  <li className="flex justify-between"><span>Rooms</span> <span className="text-zinc-600">PK</span></li>
                  <li className="flex justify-between"><span>Bookings</span> <span className="text-zinc-600">FK (User, Room)</span></li>
                  <li className="flex justify-between"><span>TimeSlots</span> <span className="text-zinc-600">Value Object</span></li>
                </ul>
              </div>
              <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                <h4 className="text-yellow-400 font-bold mb-4">Sales & Inventory</h4>
                <ul className="text-xs text-zinc-400 space-y-2">
                  <li className="flex justify-between"><span>Products</span> <span className="text-zinc-600">PK</span></li>
                  <li className="flex justify-between"><span>Orders</span> <span className="text-zinc-600">PK</span></li>
                  <li className="flex justify-between"><span>OrderItems</span> <span className="text-zinc-600">FK (Order, Product)</span></li>
                </ul>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CodeBlock code={DATABASE_ENTITY_SNIPPET} title="Domain/Entities/Booking.cs" />
              <CodeBlock code={DB_CONTEXT_SNIPPET} title="Infrastructure/Persistence/ApplicationDbContext.cs" />
            </div>
          </div>
        )}

        {activeTab === 'frontend' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold text-yellow-400 mb-6 flex items-center gap-2">
                <Layout className="text-yellow-400" />
                Angular 19 Evolution
              </h3>
              <div className="space-y-6">
                {[
                  { t: 'Standalone Components', d: 'Reduced boilerplate, cleaner dependency management without NgModules.' },
                  { t: 'Signals-based State', d: 'Fine-grained reactivity for UI updates (Dashboard charts & Live availability).' },
                  { t: 'i18n & RTL', d: 'Native support for English and Arabic via built-in localization and SCSS logical properties.' },
                  { t: 'Tailwind Interop', d: 'Utility-first styling with gaming themes and dark mode focus.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
                      <Code2 size={16} className="text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-200">{item.t}</h4>
                      <p className="text-sm text-zinc-500">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <CodeBlock code={ANGULAR_STRUCTURE_SNIPPET} title="Angular 19 Structure Overview" />
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-yellow-400 mb-2">Instapay Integration (Egypt)</h3>
              <p className="text-zinc-500">Secure & Direct Mobile Wallet Transactions</p>
            </div>

            <div className="relative flex flex-col items-center gap-8 py-8">
              <div className="flex items-center gap-12 w-full justify-center">
                <div className="flex flex-col items-center gap-2 w-32">
                  <div className="w-16 h-16 rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
                    <Layout size={24} />
                  </div>
                  <span className="text-[10px] uppercase font-bold text-zinc-500">Frontend UI</span>
                </div>
                <ChevronRight className="text-zinc-700" />
                <div className="flex flex-col items-center gap-2 w-32">
                  <div className="w-16 h-16 rounded-full bg-blue-400/10 border border-blue-400/30 flex items-center justify-center text-blue-400">
                    <Server size={24} />
                  </div>
                  <span className="text-[10px] uppercase font-bold text-zinc-500">Backend API</span>
                </div>
                <ChevronRight className="text-zinc-700" />
                <div className="flex flex-col items-center gap-2 w-32">
                  <div className="w-16 h-16 rounded-full bg-green-400/10 border border-green-400/30 flex items-center justify-center text-green-400">
                    <Shield size={24} />
                  </div>
                  <span className="text-[10px] uppercase font-bold text-zinc-500">Instapay Switch</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="bg-zinc-900/80 p-6 rounded-xl border border-zinc-800">
                  <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                    Step 1: Payment Intent
                  </h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Customer clicks "Pay via Instapay". Backend creates a PaymentIntent with a unique Hash (UUID). Returns a signed URI with the amount and business IBAN.
                  </p>
                </div>
                <div className="bg-zinc-900/80 p-6 rounded-xl border border-zinc-800">
                  <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    Step 2: Webhook Sync
                  </h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Instapay processor triggers a secure callback to our HTTPS Webhook. Backend validates the HMAC signature, updates Order status to "Paid", and sends SignalR notification to UI.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Architecture;
