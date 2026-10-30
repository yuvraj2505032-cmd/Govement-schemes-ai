import React, { useState } from 'react';
import { ChevronDown, UserRound, X } from 'lucide-react';
import { Language } from '../types/scheme';
import { TRANSLATIONS } from '../data/translations';
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
  cloudAccount,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const t = TRANSLATIONS[currentLang];
  const navItems = [
    { id: 'dashboard', label: t.tabDashboard },
    { id: 'insights', label: t.tabInsights },
    { id: 'wizard', label: t.tabEligibilityWizard },
    { id: 'saved', label: `${t.tabSaved}${savedCount > 0 ? ` (${savedCount})` : ''}` },
    { id: 'video-guides', label: t.tabVideoGuides },
    { id: 'scanner', label: t.tabScanner },
    { id: 'family', label: t.tabFamilyFinder },
    { id: 'whatif', label: t.tabWhatIf },
    { id: 'districts', label: t.tabDistricts },
    { id: 'deadlines', label: t.tabDeadlines },
    { id: 'tracker', label: t.tabTracker },
    { id: 'fraud-shield', label: t.tabFraudShield },
    { id: 'admin', label: t.tabAdmin },
  ];
  const languages: { id: Language; label: string }[] = [
    { id: 'en', label: 'EN' },
    { id: 'pa', label: 'ਪੰਜਾਬੀ' },
    { id: 'hi', label: 'हिंदी' },
  ];

  const selectTab = (tab: string) => {
    onTabChange(tab);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="relative mx-auto grid h-[68px] max-w-7xl grid-cols-[auto_1fr_auto] items-center px-3 sm:px-6">
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          className="inline-flex h-10 w-10 items-center justify-center justify-self-start rounded-xl text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-200"
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <span className="flex w-[19px] flex-col gap-[5px]" aria-hidden="true">
              <span className="h-[2px] w-full rounded-full bg-current" />
              <span className="h-[2px] w-full rounded-full bg-current" />
              <span className="h-[2px] w-full rounded-full bg-current" />
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => selectTab('dashboard')}
          className="inline-flex items-center gap-2 justify-self-center whitespace-nowrap rounded-lg text-sm font-bold tracking-tight text-slate-950 focus:outline-none focus:ring-4 focus:ring-blue-100 sm:gap-2.5 sm:text-lg max-[360px]:text-xs"
        >
          <img src="/janshayak-ai-logo.svg" alt="" className="h-9 w-8 object-contain sm:h-10 sm:w-9" />
          <span>
            Janshayak <span className="text-teal-700">AI</span>
          </span>
        </button>

        <div className="flex items-center justify-self-end gap-1 sm:gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLanguageOpen((open) => !open)}
              aria-label="Choose language"
              aria-expanded={isLanguageOpen}
              className="inline-flex min-h-10 items-center gap-1 rounded-xl px-1.5 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-200 sm:gap-1.5 sm:px-3 sm:text-sm max-[360px]:text-[9px]"
            >
              <span>EN / ਪੰਜਾਬੀ / हिंदी</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
            {isLanguageOpen && (
              <>
                <button
                  type="button"
                  aria-label="Close language menu"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setIsLanguageOpen(false)}
                />
                <div className="absolute right-0 top-full z-50 mt-2 w-40 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10">
                  {languages.map((language) => (
                    <button
                      key={language.id}
                      type="button"
                      onClick={() => {
                        onLanguageChange(language.id);
                        setIsLanguageOpen(false);
                      }}
                      aria-current={currentLang === language.id ? 'true' : undefined}
                      className={`w-full rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
                        currentLang === language.id
                          ? 'bg-blue-50 text-blue-800'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {language.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={() => selectTab('profile')}
            aria-label={t.tabProfile}
            aria-current={activeTab === 'profile' ? 'page' : undefined}
            title={t.tabProfile}
            className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition focus:outline-none focus:ring-4 focus:ring-blue-100 ${
              activeTab === 'profile'
                ? 'border-blue-200 bg-blue-50 text-blue-700'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <UserRound className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {isMenuOpen && (
          <>
            <button
              type="button"
              aria-label="Close navigation menu"
              className="fixed inset-0 z-40 top-[68px] bg-slate-950/20"
              onClick={() => setIsMenuOpen(false)}
            />
            <div
              id="primary-navigation"
              className="absolute left-4 right-4 top-full z-50 mt-2 max-h-[calc(100vh-88px)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-900/15 sm:left-6 sm:right-auto sm:w-[min(390px,calc(100vw-3rem))]"
            >
              <nav aria-label="Main navigation" className="space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectTab(item.id)}
                    aria-current={activeTab === item.id ? 'page' : undefined}
                    className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left text-sm font-medium transition ${
                      activeTab === item.id
                        ? 'bg-blue-50 text-blue-800'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                    {item.id === 'saved' && savedCount > 0 && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{savedCount}</span>
                    )}
                  </button>
                ))}
              </nav>
              <div className="mt-3 border-t border-slate-100 pt-3">
                <SupabaseAccount {...cloudAccount} />
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};
