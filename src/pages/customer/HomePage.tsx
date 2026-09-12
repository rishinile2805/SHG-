import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../../components/customer/ProductCard';
import { ProductCategory } from '../../types';
import {
  ArrowRight,
  Sparkles,
  Heart,
  Users,
  ShieldCheck,
  CheckCircle2,
  PackageCheck,
  Truck,
  Smile,
  Star,
  Quote
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { products, navigateTo, t, language } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    { id: 'All', label: t('catAll') },
    { id: 'Papad', label: t('catPapad') },
    { id: 'Achar', label: t('catAchar') },
    { id: 'Chakli', label: t('catChakli') },
    { id: 'Laddus', label: t('catLaddus') },
    { id: 'Masala', label: t('catMasala') }
  ];

  const filteredProducts =
    selectedCategory === 'All'
      ? products.slice(0, 8)
      : products.filter((p) => p.category === selectedCategory);

  const testimonials = [
    {
      name: 'Sunita Ranade',
      city: 'Pune, Maharashtra',
      product: 'Special Bhajani Chakli',
      rating: 5,
      comment: 'Reminds me of my childhood Diwali in Nashik! The crispiness and the roasted aroma of multi-grain bhajani is truly unmatched. My children finished the packet in two days!'
    },
    {
      name: 'Mahesh Bapat',
      city: 'Dadar, Mumbai',
      product: 'Kairi (Mango) Pickle & Goda Masala',
      rating: 5,
      comment: 'The authentic ceramic martaban matured mango pickle is completely chemical-free. And their Goda Masala gives our Katachi Amti that rich Nashik flavor.'
    },
    {
      name: 'Dr. Vandana Shinde',
      city: 'Gangapur Road, Nashik',
      product: 'Pure Ghee Besan Laddus',
      rating: 5,
      comment: 'As a medical practitioner, I appreciate that they use pure cow ghee and no artificial food colors. You can feel the devotion and care of our local SHG women in every bite.'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF4EC] to-[#FAF7F2] pt-8 sm:pt-14 pb-12 sm:pb-20 border-b border-[#E8DEC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1E4D2B]/10 border border-[#1E4D2B]/20 text-[#1E4D2B] text-xs sm:text-sm font-semibold">
                <Sparkles className="w-4 h-4 text-[#C85A32]" />
                <span>{t('brandSub')}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#2C221E] tracking-tight font-serif leading-[1.15]">
                {t('heroHeadline')}
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-[#665446] leading-relaxed max-w-2xl">
                {t('heroSubheading')}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
                <button
                  id="hero-shop-now-btn"
                  onClick={() => navigateTo('products')}
                  className="px-6 sm:px-8 py-3.5 sm:py-4 bg-[#1E4D2B] hover:bg-[#163E23] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-base active:scale-95"
                >
                  <span>{t('shopNow')}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  id="hero-our-story-btn"
                  onClick={() => navigateTo('our-story')}
                  className="px-6 sm:px-8 py-3.5 sm:py-4 bg-white border-2 border-[#D5C6B5] hover:border-[#1E4D2B] text-[#2C221E] hover:text-[#1E4D2B] font-bold rounded-xl transition-all text-base shadow-xs"
                >
                  {t('ourStoryBtn')}
                </button>
              </div>

              {/* Quick Feature Pillars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-[#E8DEC8]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#1E4D2B]/10 text-[#1E4D2B] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-[#4A3B32]">
                    {t('badgeHomemade')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#C85A32]/10 text-[#C85A32] flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-[#4A3B32]">
                    {t('badgeShg')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#1E4D2B]/10 text-[#1E4D2B] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-[#4A3B32]">
                    {t('badgeNatural')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#C85A32]/10 text-[#C85A32] flex items-center justify-center shrink-0">
                    <Heart className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-[#4A3B32]">
                    {t('badgeFresh')}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Large Visual Card */}
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-4/3 bg-[#F0E8DC] relative">
                  <img
                    src="https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=1000&q=80"
                    alt="Traditional Maharashtrian Chakli and Homemade Snacks by Jijamata Gruh Udyog"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="bg-[#1E4D2B] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      Nashik Pride
                    </span>
                    <h3 className="text-lg font-bold font-serif mt-1">
                      Traditional Bhajani Chakli & Hand-Rolled Papad
                    </h3>
                    <p className="text-xs text-white/80">
                      Prepared using generations-old stone-ground spices.
                    </p>
                  </div>
                </div>

                {/* Floating Micro-Card 1 */}
                <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white p-3.5 rounded-2xl shadow-xl border border-[#E8DEC8] flex items-center gap-3 z-20">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                    <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-sm font-bold text-[#2C221E]">
                      <span>4.9 / 5.0</span>
                    </div>
                    <p className="text-[11px] text-[#735F50]">Over 12,000+ Happy Families</p>
                  </div>
                </div>

                {/* Floating Micro-Card 2 */}
                <div className="absolute -top-4 -right-4 sm:-right-6 bg-white p-3 rounded-2xl shadow-xl border border-[#E8DEC8] flex items-center gap-2.5 z-20">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-[#1E4D2B]">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#2C221E]">45+ Women Artisans</p>
                    <p className="text-[10px] text-emerald-700 font-semibold">Self-Reliant Nashik SHG</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION: MADE WITH TRADITION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8DEC8] shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 aspect-4/3 rounded-2xl overflow-hidden bg-[#F3ECE4] border border-[#E5DACD]">
              <img
                src="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80"
                alt="Women SHG Handcrafting Pickles in Nashik"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32]">
                Our Collective Mission
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#2C221E]">
                {t('madeWithTraditionTitle')}
              </h2>
              <p className="text-[#665446] leading-relaxed text-sm sm:text-base">
                {t('madeWithTraditionDesc')}
              </p>
              <p className="text-[#735F50] text-sm leading-relaxed">
                Every bottle of Kairi Achar and every packet of Bhajani Chakli is crafted in rural
                kitchens with no mass-factory machinery. We empower mothers, sisters, and daughters to
                turn ancestral culinary mastery into financial dignity and independent livelihoods.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => navigateTo('our-story')}
                  className="text-[#1E4D2B] font-bold text-sm hover:underline inline-flex items-center gap-1.5"
                >
                  <span>{t('exploreStory')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION: SHOP OUR HOMEMADE FAVOURITES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1E4D2B]">
              Handcrafted in Small Batches
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#2C221E] mt-1">
              {t('favouritesTitle')}
            </h2>
            <p className="text-sm text-[#735F50] mt-1 max-w-xl">
              {t('favouritesSub')}
            </p>
          </div>

          <button
            id="view-all-products-btn"
            onClick={() => navigateTo('products')}
            className="self-start sm:self-auto px-4 py-2 border border-[#1E4D2B] text-[#1E4D2B] hover:bg-[#1E4D2B] hover:text-white rounded-xl text-sm font-bold transition-colors flex items-center gap-1.5"
          >
            <span>{t('viewAllProducts')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#1E4D2B] text-white shadow-xs'
                  : 'bg-white text-[#5C4A3E] border border-[#E0D5C7] hover:border-[#1E4D2B]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. SECTION: WHY CHOOSE JIJAMATA? */}
      <section className="bg-[#F4ECE3] py-16 sm:py-20 border-y border-[#E8DEC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32]">
              Uncompromising Quality
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#2C221E]">
              {t('whyChooseTitle')}
            </h2>
            <p className="text-sm text-[#735F50]">
              {t('whyChooseSub')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-left">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-2xl border border-[#E8DEC8] shadow-xs flex flex-col justify-between">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#1E4D2B] flex items-center justify-center font-bold text-lg mb-4">
                01
              </div>
              <h3 className="font-bold text-[#2C221E] text-base mb-2">{t('why1Title')}</h3>
              <p className="text-xs text-[#735F50] leading-relaxed">{t('why1Desc')}</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-2xl border border-[#E8DEC8] shadow-xs flex flex-col justify-between">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#C85A32] flex items-center justify-center font-bold text-lg mb-4">
                02
              </div>
              <h3 className="font-bold text-[#2C221E] text-base mb-2">{t('why2Title')}</h3>
              <p className="text-xs text-[#735F50] leading-relaxed">{t('why2Desc')}</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-2xl border border-[#E8DEC8] shadow-xs flex flex-col justify-between">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#1E4D2B] flex items-center justify-center font-bold text-lg mb-4">
                03
              </div>
              <h3 className="font-bold text-[#2C221E] text-base mb-2">{t('why3Title')}</h3>
              <p className="text-xs text-[#735F50] leading-relaxed">{t('why3Desc')}</p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-6 rounded-2xl border border-[#E8DEC8] shadow-xs flex flex-col justify-between">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#C85A32] flex items-center justify-center font-bold text-lg mb-4">
                04
              </div>
              <h3 className="font-bold text-[#2C221E] text-base mb-2">{t('why4Title')}</h3>
              <p className="text-xs text-[#735F50] leading-relaxed">{t('why4Desc')}</p>
            </div>

            {/* Card 5 */}
            <div className="bg-white p-6 rounded-2xl border border-[#E8DEC8] shadow-xs flex flex-col justify-between">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#1E4D2B] flex items-center justify-center font-bold text-lg mb-4">
                05
              </div>
              <h3 className="font-bold text-[#2C221E] text-base mb-2">{t('why5Title')}</h3>
              <p className="text-xs text-[#735F50] leading-relaxed">{t('why5Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION: FROM NASHIK TO YOUR HOME */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1E4D2B]">
            Transparent Farm & Kitchen Journey
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#2C221E]">
            {t('journeyTitle')}
          </h2>
          <p className="text-sm text-[#735F50]">
            {t('journeySub')}
          </p>
        </div>

        {/* 5-Step Visual Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-6 relative">
          {/* Step 1 */}
          <div className="bg-white p-5 rounded-2xl border border-[#E8DEC8] relative">
            <div className="w-10 h-10 rounded-xl bg-[#1E4D2B] text-white flex items-center justify-center mb-3 shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-[#C85A32] uppercase tracking-wider">Step 1</span>
            <h4 className="font-bold text-sm text-[#2C221E] mt-1">{t('step1')}</h4>
            <p className="text-xs text-[#735F50] mt-1.5 leading-relaxed">{t('step1Desc')}</p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-5 rounded-2xl border border-[#E8DEC8] relative">
            <div className="w-10 h-10 rounded-xl bg-[#1E4D2B] text-white flex items-center justify-center mb-3 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-[#C85A32] uppercase tracking-wider">Step 2</span>
            <h4 className="font-bold text-sm text-[#2C221E] mt-1">{t('step2')}</h4>
            <p className="text-xs text-[#735F50] mt-1.5 leading-relaxed">{t('step2Desc')}</p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-5 rounded-2xl border border-[#E8DEC8] relative">
            <div className="w-10 h-10 rounded-xl bg-[#1E4D2B] text-white flex items-center justify-center mb-3 shadow-xs">
              <PackageCheck className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-[#C85A32] uppercase tracking-wider">Step 3</span>
            <h4 className="font-bold text-sm text-[#2C221E] mt-1">{t('step3')}</h4>
            <p className="text-xs text-[#735F50] mt-1.5 leading-relaxed">{t('step3Desc')}</p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-5 rounded-2xl border border-[#E8DEC8] relative">
            <div className="w-10 h-10 rounded-xl bg-[#1E4D2B] text-white flex items-center justify-center mb-3 shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-[#C85A32] uppercase tracking-wider">Step 4</span>
            <h4 className="font-bold text-sm text-[#2C221E] mt-1">{t('step4')}</h4>
            <p className="text-xs text-[#735F50] mt-1.5 leading-relaxed">{t('step4Desc')}</p>
          </div>

          {/* Step 5 */}
          <div className="bg-white p-5 rounded-2xl border border-[#E8DEC8] relative">
            <div className="w-10 h-10 rounded-xl bg-[#C85A32] text-white flex items-center justify-center mb-3 shadow-xs">
              <Smile className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-[#C85A32] uppercase tracking-wider">Step 5</span>
            <h4 className="font-bold text-sm text-[#2C221E] mt-1">{t('step5')}</h4>
            <p className="text-xs text-[#735F50] mt-1.5 leading-relaxed">{t('step5Desc')}</p>
          </div>
        </div>
      </section>

      {/* 6. SECTION: OUR IMPACT */}
      <section className="bg-[#1E4D2B] text-white py-14 sm:py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
          <div className="max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#86EFAC]">
              Community & Women Empowerment
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-white">
              {t('impactTitle')}
            </h2>
            <p className="text-sm text-white/80">
              {t('impactSub')}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-3xl sm:text-5xl font-black font-serif text-[#86EFAC] mb-2">
                {t('stat1Number')}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-white/90">{t('stat1Label')}</p>
            </div>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-3xl sm:text-5xl font-black font-serif text-[#FDE047] mb-2">
                {t('stat2Number')}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-white/90">{t('stat2Label')}</p>
            </div>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-3xl sm:text-5xl font-black font-serif text-[#86EFAC] mb-2">
                {t('stat3Number')}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-white/90">{t('stat3Label')}</p>
            </div>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-3xl sm:text-5xl font-black font-serif text-[#FDE047] mb-2">
                {t('stat4Number')}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-white/90">{t('stat4Label')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SECTION: CUSTOMER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32]">
            Authentic Feedback
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#2C221E]">
            {t('testimonialsTitle')}
          </h2>
          <p className="text-sm text-[#735F50]">
            {t('testimonialsSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test, index) => (
            <div
              key={index}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DEC8] shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <Quote className="w-8 h-8 text-[#E0D5C7]" />
                <div className="flex items-center gap-1">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-sm text-[#5C4A3E] leading-relaxed italic">
                  “{test.comment}”
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#F0E8DC]">
                <h4 className="font-bold text-sm text-[#2C221E]">{test.name}</h4>
                <p className="text-xs text-[#735F50]">{test.city}</p>
                <span className="inline-block text-[11px] font-semibold text-[#1E4D2B] bg-emerald-50 px-2.5 py-0.5 rounded-full mt-2">
                  Verified Purchase: {test.product}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. SECTION: CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#C85A32] to-[#B34D27] text-white p-8 sm:p-14 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
              Taste the True Heritage of Maharashtra
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold font-serif leading-tight">
              {t('ctaTitle')}
            </h3>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed">
              {t('ctaSub')}
            </p>
          </div>

          <button
            onClick={() => navigateTo('products')}
            className="px-8 py-4 bg-white text-[#C85A32] hover:bg-[#FAF4EC] font-black rounded-2xl shadow-md hover:shadow-lg transition-all text-base shrink-0 active:scale-95"
          >
            {t('exploreProductsBtn')}
          </button>
        </div>
      </section>
    </div>
  );
};
