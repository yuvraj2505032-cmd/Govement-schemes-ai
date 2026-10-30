import React from 'react';
import { CitizenProfile, Language } from '../types/scheme';
import { TRANSLATIONS } from '../data/translations';
import { Sparkles, CheckCircle2, Users, Calculator, ArrowRight, ShieldCheck } from 'lucide-react';
import { SmartEligibilitySearchBar } from './SmartEligibilitySearchBar';

interface HeroBannerProps {
  currentLang: Language;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onStartWizard: () => void;
  onOpenFamilyFinder: () => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  totalSchemesCount: number;
  savedCount?: number;
  profile: CitizenProfile;
  onProfileChange: (updatedProfile: CitizenProfile) => void;
  onlyEligibleFilter: boolean;
  onToggleOnlyEligible: (val: boolean) => void;
  eligibleCount: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  currentLang,
  searchQuery,
  onSearchChange,
  onStartWizard,
  onOpenFamilyFinder,
  activeFilter,
  onFilterChange,
  totalSchemesCount,
  savedCount = 0,
  profile,
  onProfileChange,
  onlyEligibleFilter,
  onToggleOnlyEligible,
  eligibleCount,
}) => {
  const t = TRANSLATIONS[currentLang];

  const filterTags = [
    { id: 'all', label: t.allSchemes },
    { id: 'Saved', label: `${t.filterSaved}${savedCount > 0 ? ` (${savedCount})` : ''}` },
    { id: 'Farmers', label: t.filterFarmers },
    { id: 'Students', label: t.filterStudents },
    { id: 'Women', label: t.filterWomen },
    { id: 'Senior Citizens', label: t.filterSenior },
    { id: 'BPL', label: t.filterBPL },
    { id: 'Health', label: t.filterHealth },
    { id: 'Loans', label: t.filterLoans },
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50/70 via-teal-50/30 to-white pt-6 pb-4 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 bg-blue-100/90 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200 shadow-xs mb-3">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Official E-Governance &amp; Citizen Navigator • Punjab</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {t.appTitle}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
            {t.tagline}
          </p>

          {/* Key Stat Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-5">
            <div className="bg-white/90 p-2.5 rounded-xl border border-slate-200/80 shadow-xs text-center">
              <div className="text-base sm:text-lg font-black text-blue-700">{totalSchemesCount} Verified</div>
              <div className="text-[11px] text-slate-500 font-medium">Central &amp; Punjab Schemes</div>
            </div>
            <div className="bg-white/90 p-2.5 rounded-xl border border-slate-200/80 shadow-xs text-center">
              <div className="text-base sm:text-lg font-black text-teal-700">23 Districts</div>
              <div className="text-[11px] text-slate-500 font-medium">Sewa Kendras Directory</div>
            </div>
            <div className="bg-white/90 p-2.5 rounded-xl border border-slate-200/80 shadow-xs text-center">
              <div className="text-base sm:text-lg font-black text-emerald-700">₹5,00,000</div>
              <div className="text-[11px] text-slate-500 font-medium">Max Annual Cashless Health</div>
            </div>
            <div className="bg-white/90 p-2.5 rounded-xl border border-slate-200/80 shadow-xs text-center">
              <div className="text-base sm:text-lg font-black text-indigo-700">100% Free</div>
              <div className="text-[11px] text-slate-500 font-medium">Zero Broker Fees / Direct DBT</div>
            </div>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <button
              type="button"
              onClick={onStartWizard}
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-blue-600/20 active:scale-95 transition-all"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>{t.wizardTitle}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              type="button"
              onClick={onOpenFamilyFinder}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-sm px-4 py-2.5 rounded-xl shadow-xs active:scale-95 transition-all"
            >
              <Users className="w-4 h-4 text-indigo-600" />
              <span>{t.familyTitle}</span>
            </button>
          </div>
        </div>

        {/* Smart Integrated Search Bar with all Eligibility controls inside */}
        <SmartEligibilitySearchBar
          currentLang={currentLang}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          profile={profile}
          onProfileChange={onProfileChange}
          onlyEligibleFilter={onlyEligibleFilter}
          onToggleOnlyEligible={onToggleOnlyEligible}
          eligibleCount={eligibleCount}
          totalCount={totalSchemesCount}
        />

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
          {filterTags.map((tag) => {
            const isSelected = activeFilter === tag.id;
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => onFilterChange(tag.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-blue-700 text-white shadow-xs font-semibold'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tag.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
