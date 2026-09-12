import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Heart,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Award,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { ProductCategory } from '../../types';

export const Footer: React.FC = () => {
  const { navigateTo, t, setRole } = useApp();

  const categories: { id: ProductCategory; nameKey: string }[] = [
    { id: 'Papad', nameKey: 'catPapad' },
    { id: 'Achar', nameKey: 'catAchar' },
    { id: 'Chakli', nameKey: 'catChakli' },
    { id: 'Laddus', nameKey: 'catLaddus' },
    { id: 'Masala', nameKey: 'catMasala' }
  ];

  return (
    <footer className="bg-[#231C18] text-[#EBE3D9] pt-16 pb-12 border-t border-[#3A2F29]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-[#3A2F29]">
          {/* Brand & SHG Story Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1E4D2B] text-white flex items-center justify-center font-serif font-bold text-lg border border-[#377F4C]">
                जि
              </div>
              <div>
                <h4 className="text-xl font-black font-serif text-white tracking-tight">
                  Jijamata Gruh Udyog
                </h4>
                <p className="text-xs text-[#D97706] font-medium">
                  जिजामाता महिला बचत गट, नाशिक
                </p>
              </div>
            </div>

            <p className="text-sm text-[#B8A89A] leading-relaxed pr-4">
              “{t('brandTagline')}” — A self-reliant women's Self-Help Group from Nashik, Maharashtra
              dedicated to handcrafted purity, authentic generational recipes, and economic
              empowerment for local rural women artisans.
            </p>

            {/* Certifications badges */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-[#EBE3D9]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#86EFAC]" />
                FSSAI Registered
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-[#EBE3D9]">
                <Award className="w-3.5 h-3.5 text-[#FDE047]" />
                100% Traditional Hand-Rolled
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {t('quickLinks')}
            </h5>
            <ul className="space-y-2.5 text-sm text-[#B8A89A]">
              <li>
                <button
                  onClick={() => navigateTo('home')}
                  className="hover:text-white transition-colors"
                >
                  {t('navHome')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('products')}
                  className="hover:text-white transition-colors"
                >
                  {t('navProducts')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('our-story')}
                  className="hover:text-white transition-colors"
                >
                  {t('navOurStory')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="hover:text-white transition-colors"
                >
                  {t('navAbout')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-white transition-colors"
                >
                  {t('navContact')}
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {t('filterCategory')}
            </h5>
            <ul className="space-y-2.5 text-sm text-[#B8A89A]">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      navigateTo('products');
                    }}
                    className="hover:text-white transition-colors"
                  >
                    {t(cat.nameKey)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support & Contact */}
          <div>
            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {t('customerSupport')}
            </h5>
            <ul className="space-y-3 text-sm text-[#B8A89A]">
              <li>
                <button
                  onClick={() => navigateTo('track-order')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-[#86EFAC]"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {t('navTrackOrder')}
                </button>
              </li>
              <li className="flex items-start gap-2 text-xs leading-relaxed">
                <MapPin className="w-4 h-4 text-[#C85A32] shrink-0 mt-0.5" />
                <span>Survey No. 42, Near Trimbak Road, Nashik, Maharashtra 422007</span>
              </li>
              <li className="flex items-center gap-2 text-xs">
                <Phone className="w-4 h-4 text-[#86EFAC] shrink-0" />
                <span>{t('contactPhone')}</span>
              </li>
              <li className="flex items-center gap-2 text-xs">
                <Mail className="w-4 h-4 text-[#93C5FD] shrink-0" />
                <span>{t('contactEmail')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8A7A6E]">
          <p>© {new Date().getFullYear()} Jijamata Gruh Udyog. {t('allRightsReserved')}</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setRole('admin')}
              className="text-[#D97706] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Admin Staff Login</span>
              <ExternalLink className="w-3 h-3" />
            </button>
            <span>•</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" /> in Nashik
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
