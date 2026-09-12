import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Heart,
  Users,
  Sparkles,
  Award,
  Sun,
  ShieldCheck,
  Flame,
  ArrowRight
} from 'lucide-react';

export const OurStoryPage: React.FC = () => {
  const { navigateTo, t } = useApp();

  const artisans = [
    {
      name: 'Smt. Kalpana Patil',
      role: 'Master of Chakli & Flours (12 yrs experience)',
      quote: 'We roast every single cereal separately over controlled heat until the grain turns golden. That is the only way to get real bhajani crispness without extra oil.',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Smt. Sunita Deshmukh',
      role: 'Pickle & Fermentation Custodian (15 yrs experience)',
      quote: 'Our mango pickle sits in traditional white ceramic martabans under the Nashik sun for 21 days with raw mustard oil. No chemical vinegar or synthetic preservatives ever enter our jars.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Smt. Rekha Wagh',
      role: 'Hand-Rolled Papad In-Charge (10 yrs experience)',
      quote: 'Rolling papads with the wooden latna is a rhythm we learned from our grandmothers. It gives the papad a uniform thinness that bubbles up delicately when roasted on an open flame.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80'
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#FAF4EC] to-[#FAF7F2] py-14 sm:py-20 border-b border-[#E8DEC8]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E4D2B]/10 text-[#1E4D2B] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nashik Women's Empowerment Collective</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-serif text-[#2C221E] leading-tight">
            Handcrafted with Devotion. Rooted in Nashik.
          </h1>
          <p className="text-base sm:text-lg text-[#665446] leading-relaxed max-w-2xl mx-auto">
            The story of 45+ village women who transformed generational culinary wisdom into economic
            freedom and authentic home happiness.
          </p>
        </div>
      </section>

      {/* Origin Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32]">
              How We Began in 2018
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#2C221E]">
              From Courtyard Kitchens to a Self-Help Movement
            </h2>
            <p className="text-sm sm:text-base text-[#665446] leading-relaxed">
              Jijamata Gruh Udyog started when a small circle of seven women in rural Nashik came together
              during Diwali. Tired of store-bought snacks made with palm oil and artificial enhancers,
              they pooled their savings to roast and sell traditional multi-grain Bhajani Chakli and Udid
              Papad to neighboring localities.
            </p>
            <p className="text-sm sm:text-base text-[#665446] leading-relaxed">
              The response was overwhelming. Families loved the nostalgic taste of authentic home cooking.
              Today, our Self-Help Group (SHG) has expanded into a recognized community cooperative
              supporting over 45 rural women households with reliable income, children's schooling, and
              dignified financial independence.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white aspect-4/3 bg-[#F0E8DC]">
              <img
                src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80"
                alt="Traditional spices and authentic Indian culinary heritage"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Traditional Principles */}
      <section className="bg-[#F4ECE3] py-16 border-y border-[#E8DEC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1E4D2B]">
              Our Craft Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#2C221E]">
              Generational Techniques We Refuse to Compromise
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DEC8] space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-[#C85A32] flex items-center justify-center">
                <Sun className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#2C221E]">Solar Drying & Natural Aging</h3>
              <p className="text-xs text-[#735F50] leading-relaxed">
                Our papads and pickling spices are sun-dried under clean glass canopies in the dry, bright
                Nashik climate. No high-heat dehydrators that strip the nutritional value of native grains.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DEC8] space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#1E4D2B] flex items-center justify-center">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#2C221E]">Slow-Roasting in Iron Kadhais</h3>
              <p className="text-xs text-[#735F50] leading-relaxed">
                For our signature Bhajani Chakli, each pulse (chana dal, urad dal, moong, rice, coriander
                seeds) is roasted separately in heavy cast-iron pans to bring out its distinctive nutty
                aroma.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DEC8] space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-[#C85A32] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#2C221E]">Pure Desi Cow Ghee & Cold-Pressed Oil</h3>
              <p className="text-xs text-[#735F50] leading-relaxed">
                We strictly reject palm oil, cottonseed oil, and artificial aromas. Our besan and dink
                laddus are bound exclusively using pure churned cow ghee.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Artisan Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32]">
            Meet The Women
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#2C221E]">
            The Hands Behind the Taste
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {artisans.map((artisan, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-[#E8DEC8] overflow-hidden shadow-xs flex flex-col justify-between"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={artisan.image}
                    alt={artisan.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#1E4D2B]"
                  />
                  <div>
                    <h4 className="font-bold text-base text-[#2C221E]">{artisan.name}</h4>
                    <p className="text-xs text-[#1E4D2B] font-semibold">{artisan.role}</p>
                  </div>
                </div>
                <p className="text-xs text-[#5C4A3E] leading-relaxed italic border-t border-[#F0E8DC] pt-4">
                  “{artisan.quote}”
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-[#1E4D2B] text-white p-8 sm:p-12 rounded-3xl space-y-4">
          <h3 className="text-2xl sm:text-3xl font-black font-serif">
            Experience the Taste of Authentic Nashik Kitchens
          </h3>
          <p className="text-sm text-white/80 max-w-lg mx-auto">
            Order today and get freshly prepared homemade delicacies delivered right to your doorstep.
          </p>
          <button
            onClick={() => navigateTo('products')}
            className="px-8 py-3.5 bg-white text-[#1E4D2B] font-bold rounded-xl text-sm shadow-md hover:bg-[#FAF4EC] transition-all inline-flex items-center gap-2"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
