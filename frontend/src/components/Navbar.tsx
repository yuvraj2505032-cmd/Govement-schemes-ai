import React from 'react';
import { Language } from '../types/scheme';
import { TRANSLATIONS } from '../data/translations';
import { Shield, Globe, PhoneCall, Sparkles, Building2, HelpCircle } from 'lucide-react';
import { SupabaseAccount } from './SupabaseAccount';
import type { SupabaseAccountProps } from './SupabaseAccount';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  savedCount?: number;
  cloudAccount: SupabaseAccountProps;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  activeTab,
  onTabChange,
  savedCount = 0,
  cloudAccount
}) => {
  const t = TRANSLATIONS[currentLang];

  const navItems = [
    { id: 'dashboard', label: t.tabDashboard },
    { id: 'insights', label: t.tabInsights || 'Dashboard Insights' },
    { id: 'wizard', label: t.tabEligibilityWizard },
    { id: 'saved', label: `${t.tabSaved}${savedCount > 0 ? ` (${savedCount})` : ''}` },
    { id: 'video-guides', label: t.tabVideoGuides || 'Video Guides' },
    { id: 'scanner', label: t.tabScanner || 'AI Document Scanner' },
    { id: 'family', label: t.tabFamilyFinder },
    { id: 'whatif', label: t.tabWhatIf },
    { id: 'districts', label: t.tabDistricts },
    { id: 'deadlines', label: t.tabDeadlines || 'Deadlines' },
    { id: 'tracker', label: t.tabTracker },
    { id: 'fraud-shield', label: t.tabFraudShield || 'Cyber Fraud Shield' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Gov Announcement Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-teal-900 text-white text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-semibold text-teal-300">
              <Building2 className="w-3.5 h-3.5" />
              {t.punjabGovt} &amp; {t.centralGovt}
            </span>
            <span className="hidden md:inline text-slate-300">•</span>
            <span className="hidden md:inline bg-teal-800/80 text-teal-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              {t.ctBuildFest}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a 
              href="tel:1100" 
              className="flex items-center gap-1.5 text-teal-300 hover:text-white transition-colors font-medium"
              title="Call Punjab Citizen Helpline"
            >
              <PhoneCall className="w-3 h-3" />
              <span>{t.helplineText}</span>
            </a>
            <span className="text-slate-400">|</span>
            <span className="flex items-center gap-1 text-emerald-300 font-medium">
              <Shield className="w-3 h-3" />
              <span>Verified .gov.in Portals Only</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Branding */}
          <div 
            onClick={() => onTabChange('dashboard')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-lg text-slate-900 tracking-tight">
                  Punjab Scheme AI
                </span>
                <span className="bg-blue-100 text-blue-800 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded-md border border-blue-200">
                  CTBF-07
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 hidden sm:block">
                E-Governance Citizen Scheme Navigator
              </p>
            </div>
          </div>

          {/* Right Action Controls: Language Toggle & AI Voice Assistant Trigger */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 sm:p-1 rounded-xl border border-slate-200 text-[11px] sm:text-xs font-semibold">
              <Globe className="w-3 h-3 text-slate-500 ml-1 mr-0.5 hidden xs:inline" />
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg transition-all ${
                  currentLang === 'en'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('pa')}
                className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg transition-all ${
                  currentLang === 'pa'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                ਪੰਜਾਬੀ
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('hi')}
                className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg transition-all ${
                  currentLang === 'hi'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                हिन्दी
              </button>
            </div>
            <SupabaseAccount {...cloudAccount} />
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto pt-3 pb-1 border-t border-slate-100 mt-2 scrollbar-none text-xs sm:text-sm">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
