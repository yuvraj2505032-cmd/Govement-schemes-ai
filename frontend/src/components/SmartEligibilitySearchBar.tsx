import React, { useState } from 'react';
import { CitizenProfile, Language, Occupation, Category, Gender } from '../types/scheme';
import { TRANSLATIONS } from '../data/translations';
import { PUNJAB_DISTRICTS } from '../data/punjabDistricts';
import { 
  Search, 
  SlidersHorizontal, 
  CheckCircle2, 
  X, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Check, 
  User, 
  Briefcase, 
  IndianRupee, 
  MapPin, 
  Layers,
  Filter
} from 'lucide-react';

interface SmartEligibilitySearchBarProps {
  currentLang: Language;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  profile: CitizenProfile;
  onProfileChange: (updatedProfile: CitizenProfile) => void;
  onlyEligibleFilter: boolean;
  onToggleOnlyEligible: (val: boolean) => void;
  eligibleCount: number;
  totalCount: number;
}

export const SmartEligibilitySearchBar: React.FC<SmartEligibilitySearchBarProps> = ({
  currentLang,
  searchQuery,
  onSearchChange,
  profile,
  onProfileChange,
  onlyEligibleFilter,
  onToggleOnlyEligible,
  eligibleCount,
  totalCount
}) => {
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  const t = TRANSLATIONS[currentLang];

  const occupations: Occupation[] = [
    'Farmer',
    'Agricultural Labourer',
    'Student',
    'Unemployed Youth',
    'Artisan/Craftsperson',
    'Self-Employed/Shopkeeper',
    'Daily Wage Worker',
    'Homemaker',
    'Senior Citizen',
    'Private Employee',
    'Government Employee'
  ];

  const categories: Category[] = ['General', 'SC', 'OBC/BC', 'EWS', 'ST'];
  const genders: Gender[] = ['Male', 'Female', 'Transgender'];

  const incomePresets = [
    { label: '< ₹60k (BPL)', value: 55000 },
    { label: '₹1.5L', value: 150000 },
    { label: '₹2.5L (EWS)', value: 240000 },
    { label: '₹5L', value: 500000 },
    { label: '₹8L', value: 800000 },
  ];

  const updateField = <K extends keyof CitizenProfile>(field: K, value: CitizenProfile[K]) => {
    onProfileChange({
      ...profile,
      [field]: value
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-3">
      {/* Container Box */}
      <div className="bg-white rounded-2xl border-2 border-blue-400/80 shadow-md shadow-blue-500/10 overflow-hidden transition-all duration-200">
        
        {/* Main Search Input Row */}
        <div className="p-2 sm:p-2.5 flex flex-wrap items-center gap-2">
          {/* Search Icon & Text Box */}
          <div className="flex-1 min-w-[240px] flex items-center gap-2 px-2.5">
            <Search className="w-5 h-5 text-blue-600 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full py-1.5 text-xs sm:text-sm bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-hidden font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md text-xs"
                title={t.clearSearch}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Action Buttons right inside search bar */}
            {/* "Only My Eligible" Toggle Switch right inside search bar */}
            <button
              type="button"
              onClick={() => onToggleOnlyEligible(!onlyEligibleFilter)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                onlyEligibleFilter
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
              title="Filter by confirmed eligibility"
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${onlyEligibleFilter ? 'text-white' : 'text-emerald-600'}`} />
              <span className="hidden sm:inline">{t.onlyEligible}</span>
              <span className="sm:hidden">Eligible</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                onlyEligibleFilter ? 'bg-emerald-800 text-emerald-100' : 'bg-emerald-200 text-emerald-900'
              }`}>
                {eligibleCount}
              </span>
            </button>

            {/* Expand / Adjust Inline Eligibility Filters */}
            <button
              type="button"
              onClick={() => setIsPanelExpanded(!isPanelExpanded)}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                isPanelExpanded
                  ? 'bg-blue-700 text-white border-blue-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t.eligibilityFilters}</span>
              {isPanelExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
        </div>

        {/* Inline Eligibility Chips Carousel right inside the search bar */}
        <div className="bg-slate-50/90 border-t border-slate-100 px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Active Criteria:
          </span>

          {/* Age Chip */}
          <button
            type="button"
            onClick={() => setIsPanelExpanded(true)}
            className="inline-flex items-center gap-1 bg-white hover:bg-blue-50 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-lg font-medium shrink-0 transition-colors"
          >
            <User className="w-3 h-3 text-blue-600" />
            <span>Age: <strong>{profile.age}y</strong></span>
          </button>

          {/* Occupation Chip */}
          <button
            type="button"
            onClick={() => setIsPanelExpanded(true)}
            className="inline-flex items-center gap-1 bg-white hover:bg-blue-50 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-lg font-medium shrink-0 transition-colors"
          >
            <Briefcase className="w-3 h-3 text-teal-600" />
            <span><strong>{profile.occupation}</strong></span>
          </button>

          {/* Income Chip */}
          <button
            type="button"
            onClick={() => setIsPanelExpanded(true)}
            className="inline-flex items-center gap-1 bg-white hover:bg-blue-50 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-lg font-medium shrink-0 transition-colors"
          >
            <IndianRupee className="w-3 h-3 text-emerald-600" />
            <span>Income: <strong>₹{(profile.annualIncome / 1000).toFixed(0)}k</strong></span>
          </button>

          {/* Category Chip */}
          <button
            type="button"
            onClick={() => setIsPanelExpanded(true)}
            className="inline-flex items-center gap-1 bg-white hover:bg-blue-50 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-lg font-medium shrink-0 transition-colors"
          >
            <Layers className="w-3 h-3 text-purple-600" />
            <span>Category: <strong>{profile.category}</strong></span>
          </button>

          {/* District Chip */}
          <button
            type="button"
            onClick={() => setIsPanelExpanded(true)}
            className="inline-flex items-center gap-1 bg-white hover:bg-blue-50 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-lg font-medium shrink-0 transition-colors"
          >
            <MapPin className="w-3 h-3 text-rose-500" />
            <span><strong>{profile.district}</strong></span>
          </button>

          {/* Domicile Chip */}
          <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-lg font-semibold shrink-0">
            PB Resident
          </span>

          {profile.hasDisability && (
            <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-lg font-semibold shrink-0">
              PwD (40%+)
            </span>
          )}

          {profile.isWidowOrDestitute && (
            <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-lg font-semibold shrink-0">
              Widow
            </span>
          )}

          {profile.isEnrolledInSchoolOrCollege && (
            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-lg font-semibold shrink-0">
              Student
            </span>
          )}

          <button
            type="button"
            onClick={() => setIsPanelExpanded(!isPanelExpanded)}
            className="text-[10px] text-blue-700 hover:underline font-bold ml-auto shrink-0"
          >
            {isPanelExpanded ? t.hideCriteria : t.modifyCriteria}
          </button>
        </div>

        {/* EXPANDABLE INLINE ELIGIBILITY CONTROLS (Right inside the search bar) */}
        {isPanelExpanded && (
          <div className="p-4 sm:p-5 bg-gradient-to-b from-blue-50/50 to-white border-t border-blue-100 space-y-4 animate-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                  {t.wizardTitle} (Instant Search Recalculation)
                </h4>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                {eligibleCount} Schemes Confirmed for this Criteria
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {/* Age Slider */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>{t.ageLabel}</span>
                  <span className="font-bold text-blue-700">{profile.age} Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="90"
                  value={profile.age}
                  onChange={(e) => updateField('age', Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Occupation Dropdown */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <label className="block font-semibold text-slate-700">{t.occupationLabel}</label>
                <select
                  value={profile.occupation}
                  onChange={(e) => {
                    const occ = e.target.value as Occupation;
                    updateField('occupation', occ);
                    if (occ === 'Student') updateField('isEnrolledInSchoolOrCollege', true);
                  }}
                  className="w-full p-1.5 border border-slate-300 rounded-lg text-xs font-medium"
                >
                  {occupations.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              {/* Annual Income */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>{t.incomeLabel}</span>
                  <span className="font-bold text-teal-700">₹{profile.annualIncome.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {incomePresets.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => updateField('annualIncome', p.value)}
                      className={`text-[10px] px-1.5 py-0.5 rounded-md border transition-all ${
                        profile.annualIncome === p.value
                          ? 'bg-teal-600 text-white border-teal-600 font-bold'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Social Category */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <label className="block font-semibold text-slate-700">{t.categoryLabel}</label>
                <div className="grid grid-cols-5 gap-1">
                  {categories.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => updateField('category', c)}
                      className={`py-1 text-[11px] font-semibold rounded-md border transition-all ${
                        profile.category === c
                          ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* District Dropdown */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <label className="block font-semibold text-slate-700">{t.districtLabel}</label>
                <select
                  value={profile.district}
                  onChange={(e) => updateField('district', e.target.value)}
                  className="w-full p-1.5 border border-slate-300 rounded-lg text-xs font-medium"
                >
                  {PUNJAB_DISTRICTS.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name} ({currentLang === 'pa' ? d.namePa : currentLang === 'hi' ? d.nameHi : d.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Special Toggles */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={profile.hasDisability}
                    onChange={(e) => updateField('hasDisability', e.target.checked)}
                    className="rounded text-purple-600 w-3.5 h-3.5"
                  />
                  <span>PwD (≥ 40%)</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={profile.isWidowOrDestitute}
                    onChange={(e) => updateField('isWidowOrDestitute', e.target.checked)}
                    className="rounded text-rose-600 w-3.5 h-3.5"
                  />
                  <span>Widow</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={profile.isEnrolledInSchoolOrCollege}
                    onChange={(e) => updateField('isEnrolledInSchoolOrCollege', e.target.checked)}
                    className="rounded text-amber-600 w-3.5 h-3.5"
                  />
                  <span>Student</span>
                </label>
              </div>
            </div>

            {/* Done button */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500">
                All schemes update immediately in the search results below.
              </span>

              <button
                type="button"
                onClick={() => setIsPanelExpanded(false)}
                className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-xs cursor-pointer"
              >
                Apply Criteria
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
