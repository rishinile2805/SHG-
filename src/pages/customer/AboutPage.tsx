import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Award,
  Users,
  Building2,
  HeartHandshake,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#1E4D2B]">
          About Our Organization
        </span>
        <h1 className="text-3xl sm:text-5xl font-black font-serif text-[#2C221E]">
          Empowering Rural Women, One Batch at a Time
        </h1>
        <p className="text-sm sm:text-base text-[#735F50] leading-relaxed">
          Registered Self-Help Group (Bachat Gat) operating under Maharashtra State Rural Livelihoods
          Mission (Umed) in Nashik.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#E8DEC8] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#1E4D2B] flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-[#2C221E]">100% Women-Owned</h3>
          <p className="text-xs text-[#735F50] leading-relaxed">
            Every operational decision, from recipe testing to packaging and finances, is led by our
            collective members.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E8DEC8] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#C85A32] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-[#2C221E]">FSSAI Certified</h3>
          <p className="text-xs text-[#735F50] leading-relaxed">
            Strict adherence to hygiene, sanitized processing, food-grade materials, and regular health
            checkups for all workers.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E8DEC8] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#1E4D2B] flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-[#2C221E]">Authentic Recipes</h3>
          <p className="text-xs text-[#735F50] leading-relaxed">
            Preserving centuries of Khandesh & Western Ghats culinary heritage with zero chemical
            flavorings or colors.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E8DEC8] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#C85A32] flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-[#2C221E]">Fair Wages & Profit Share</h3>
          <p className="text-xs text-[#735F50] leading-relaxed">
            Surplus profits are redistributed among member artisans to support women’s emergency funds and
            child education.
          </p>
        </div>
      </div>

      {/* Facility Description */}
      <div className="bg-[#FAF4EC] rounded-3xl p-8 sm:p-12 border border-[#E8DEC8]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32]">
              Our Production Kitchen
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#2C221E]">
              Hygienic, Sunlit and Community-Driven in Nashik
            </h2>
            <p className="text-sm text-[#665446] leading-relaxed">
              Our central kitchen is located near Trimbak Road, Nashik. Built with solar-paneled rooftop
              dryers, stainless steel sorting tables, and water filtration systems, it balances traditional
              methods with modern sanitary safety.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-[#1E4D2B]">
              <span className="bg-white px-3 py-1.5 rounded-xl border border-[#E8DEC8]">
                ✓ Pure RO Water for Cooking
              </span>
              <span className="bg-white px-3 py-1.5 rounded-xl border border-[#E8DEC8]">
                ✓ Glass-Enclosed Solar Dryers
              </span>
              <span className="bg-white px-3 py-1.5 rounded-xl border border-[#E8DEC8]">
                ✓ Nitrogen-Flushed Sealing
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 aspect-4/3 rounded-2xl overflow-hidden bg-white border border-[#E5DACD] shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80"
              alt="Hygienic kitchen facility"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Bulk & Corporate Inquiry */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8DEC8] text-center space-y-4 max-w-3xl mx-auto shadow-xs">
        <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#2C221E]">
          Bulk Orders & Festival Gifting Hampers
        </h3>
        <p className="text-xs sm:text-sm text-[#735F50] leading-relaxed max-w-xl mx-auto">
          We curate customized traditional gift hampers (Chakli, Laddus, Chivda, Masalas) for corporate
          events, weddings, and festivals across India.
        </p>
        <button
          onClick={() => navigateTo('contact')}
          className="px-6 py-3 bg-[#1E4D2B] text-white font-bold rounded-xl text-xs sm:text-sm hover:bg-[#163E23] transition-colors"
        >
          Send Bulk Order Inquiry
        </button>
      </div>
    </div>
  );
};
