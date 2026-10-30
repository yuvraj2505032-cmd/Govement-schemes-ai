import React, { useState } from 'react';
import { Language, DistrictInfo, Scheme } from '../types/scheme';
import { TRANSLATIONS } from '../data/translations';
import { PUNJAB_DISTRICTS } from '../data/punjabDistricts';
import { GOV_SCHEMES } from '../data/schemes';
import { 
  MapPin, 
  Building2, 
  PhoneCall, 
  CheckCircle2, 
  Search, 
  ExternalLink,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface DistrictPortalFinderProps {
  currentLang: Language;
  selectedDistrictName: string;
  onSelectDistrict: (districtName: string) => void;
  onOpenSchemeModal: (scheme: Scheme) => void;
}

export const DistrictPortalFinder: React.FC<DistrictPortalFinderProps> = ({
  currentLang,
  selectedDistrictName,
  onSelectDistrict,
  onOpenSchemeModal
}) => {
  const t = TRANSLATIONS[currentLang];
  const [districtSearch, setDistrictSearch] = useState('');

  const activeDistrict = PUNJAB_DISTRICTS.find(d => d.name === selectedDistrictName) || PUNJAB_DISTRICTS[0];

  const filteredDistricts = PUNJAB_DISTRICTS.filter(d => 
    d.name.toLowerCase().includes(districtSearch.toLowerCase()) ||
    d.namePa.includes(districtSearch) ||
    d.nameHi.includes(districtSearch)
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-blue-900 to-indigo-900 text-white rounded-2xl p-6 shadow-md">
        <div className="inline-flex items-center gap-1.5 bg-teal-500/20 text-teal-300 text-xs font-bold px-3 py-1 rounded-full border border-teal-400/30 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Innovative Feature 6 • Punjab 23 Districts Directory</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
          {t.tabDistricts}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
          Locate Punjab Sewa Kendras, Deputy Commissioner helpline numbers, and local welfare nodal offices across all 23 districts of Punjab.
        </p>

        {/* District Quick Search Bar */}
        <div className="mt-5 max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={districtSearch}
              onChange={(e) => setDistrictSearch(e.target.value)}
              placeholder="Search Punjab district (e.g. Ludhiana, Amritsar, Bathinda)..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white text-slate-900 rounded-xl focus:outline-hidden font-medium"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* District List Selector */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs max-h-[550px] overflow-y-auto space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-2">
            Select District ({filteredDistricts.length})
          </span>
          {filteredDistricts.map((district) => {
            const isSelected = district.name === activeDistrict.name;
            const displayName = currentLang === 'pa' ? district.namePa : currentLang === 'hi' ? district.nameHi : district.name;

            return (
              <button
                key={district.name}
                type="button"
                onClick={() => onSelectDistrict(district.name)}
                className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-teal-300' : 'text-slate-400'}`} />
                  <span>{displayName}</span>
                  <span className={`text-[10px] font-normal ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                    ({district.name})
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                  isSelected ? 'bg-blue-800 text-teal-200' : 'bg-slate-100 text-slate-600'
                }`}>
                  {district.sewaKendraCount} Kendras
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected District Details & Key Local Contacts */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200 uppercase tracking-wider">
                  District Profile &amp; Contact Hub
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  District {activeDistrict.name} ({currentLang === 'pa' ? activeDistrict.namePa : activeDistrict.nameHi})
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  District Administrative Complex Headquarters: {activeDistrict.headquarters}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 text-blue-900 px-3.5 py-2 rounded-xl text-center">
                <div className="text-lg font-black text-blue-800">{activeDistrict.sewaKendraCount}</div>
                <div className="text-[10px] font-bold text-blue-600 uppercase">Operational Sewa Kendras</div>
              </div>
            </div>

            {/* Address & Helpline Callout Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Main Sewa Kendra / Mini Secretariat</span>
                </span>
                <p className="text-xs font-semibold text-slate-800 leading-snug">
                  {activeDistrict.mainSewaKendraAddress}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <PhoneCall className="w-3.5 h-3.5 text-teal-600" />
                  <span>DC Office &amp; Local Grievance Helplines</span>
                </span>
                <p className="text-xs font-bold text-slate-900">
                  DC Office: <a href={`tel:${activeDistrict.dcOfficeContact}`} className="text-blue-700 hover:underline">{activeDistrict.dcOfficeContact}</a>
                </p>
                <p className="text-xs font-bold text-teal-800 mt-0.5">
                  Citizen Helpline: <a href="tel:1100" className="text-teal-700 underline">1100 (Toll-Free)</a>
                </p>
              </div>
            </div>

            {/* Popular / High-Impact Schemes in this District */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                Key Schemes Actively Disbursed in {activeDistrict.name}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeDistrict.popularSchemes.map((schemeId) => {
                  const scheme = GOV_SCHEMES.find(s => s.id === schemeId);
                  if (!scheme) return null;
                  const schemeTitle = currentLang === 'pa' ? scheme.titlePa : currentLang === 'hi' ? scheme.titleHi : scheme.titleEn;

                  return (
                    <div
                      key={scheme.id}
                      onClick={() => onOpenSchemeModal(scheme)}
                      className="p-3 bg-white hover:bg-blue-50/50 rounded-xl border border-slate-200 hover:border-blue-300 cursor-pointer shadow-xs transition-all flex items-center justify-between gap-2 group"
                    >
                      <div>
                        <div className="font-bold text-xs text-slate-900 group-hover:text-blue-700">
                          {schemeTitle}
                        </div>
                        <div className="text-[10px] text-teal-700 font-semibold mt-0.5">
                          {scheme.benefitAmountText}
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
