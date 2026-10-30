import React, { useState } from 'react';
import { CitizenProfile, Language, Scheme, Category, Occupation } from '../types/scheme';
import { TRANSLATIONS } from '../data/translations';
import { simulateWhatIf } from '../utils/schemeEngine';
import { 
  Sliders, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  HelpCircle
} from 'lucide-react';

interface WhatIfSimulatorProps {
  currentLang: Language;
  baseProfile: CitizenProfile;
  onOpenSchemeModal: (scheme: Scheme) => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  currentLang,
  baseProfile,
  onOpenSchemeModal
}) => {
  const t = TRANSLATIONS[currentLang];

  const [simulatedIncome, setSimulatedIncome] = useState(baseProfile.annualIncome);
  const [simulatedAge, setSimulatedAge] = useState(baseProfile.age);
  const [simulatedLand, setSimulatedLand] = useState(baseProfile.landholdingAcres);
  const [simulatedCategory, setSimulatedCategory] = useState<Category>(baseProfile.category);
  const [simulatedOccupation, setSimulatedOccupation] = useState<Occupation>(baseProfile.occupation);

  const simulation = simulateWhatIf(baseProfile, {
    annualIncome: simulatedIncome,
    age: simulatedAge,
    landholdingAcres: simulatedLand,
    category: simulatedCategory,
    occupation: simulatedOccupation
  });

  const resetSimulation = () => {
    setSimulatedIncome(baseProfile.annualIncome);
    setSimulatedAge(baseProfile.age);
    setSimulatedLand(baseProfile.landholdingAcres);
    setSimulatedCategory(baseProfile.category);
    setSimulatedOccupation(baseProfile.occupation);
  };

  const categories: Category[] = ['General', 'SC', 'OBC/BC', 'EWS', 'ST'];
  const occupations: Occupation[] = [
    'Farmer',
    'Student',
    'Unemployed Youth',
    'Artisan/Craftsperson',
    'Self-Employed/Shopkeeper',
    'Daily Wage Worker',
    'Homemaker',
    'Senior Citizen'
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-teal-900 via-blue-900 to-indigo-900 text-white rounded-2xl p-6 shadow-md">
        <div className="inline-flex items-center gap-1.5 bg-teal-500/20 text-teal-300 text-xs font-bold px-3 py-1 rounded-full border border-teal-400/30 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Innovative Feature 9 • Interactive Scenario Engine</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
          {t.whatIfTitle}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
          {t.whatIfSubtitle}
        </p>

        {/* Live Delta Stat Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
            <span className="text-[10px] text-teal-200 uppercase font-semibold">Simulated Eligible</span>
            <div className="text-xl font-black text-white mt-0.5">{simulation.totalSimulatedEligible} Schemes</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
            <span className="text-[10px] text-teal-200 uppercase font-semibold">Net Change</span>
            <div className={`text-xl font-black mt-0.5 ${
              simulation.netChange > 0 ? 'text-emerald-400' : simulation.netChange < 0 ? 'text-rose-400' : 'text-slate-200'
            }`}>
              {simulation.netChange > 0 ? `+${simulation.netChange}` : simulation.netChange}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
            <span className="text-[10px] text-emerald-300 uppercase font-semibold">Schemes Gained</span>
            <div className="text-xl font-black text-emerald-400 mt-0.5">+{simulation.gainedSchemes.length}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
            <span className="text-[10px] text-rose-300 uppercase font-semibold">Schemes Lost</span>
            <div className="text-xl font-black text-rose-400 mt-0.5">-{simulation.lostSchemes.length}</div>
          </div>
        </div>
      </div>

      {/* Simulator Control Sliders */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-sm sm:text-base text-slate-900">
              Adjust Simulation Parameters
            </h3>
          </div>
          <button
            type="button"
            onClick={resetSimulation}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to My Profile</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Income Slider */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Simulate Annual Income</label>
              <span className="text-sm font-extrabold text-blue-700">
                ₹{simulatedIncome.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="20000"
              max="900000"
              step="10000"
              value={simulatedIncome}
              onChange={(e) => setSimulatedIncome(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
              <span>₹20k (BPL)</span>
              <span>₹2.5L (EWS Cap)</span>
              <span>₹5L</span>
              <span>₹9L</span>
            </div>
          </div>

          {/* Age Slider */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Simulate Age</label>
              <span className="text-sm font-extrabold text-teal-700">
                {simulatedAge} Years
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="85"
              value={simulatedAge}
              onChange={(e) => setSimulatedAge(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
              <span>1 yr (Child)</span>
              <span>18 yrs (Adult)</span>
              <span>58 yrs (Pension)</span>
              <span>85 yrs</span>
            </div>
          </div>

          {/* Landholding Slider */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Simulate Agricultural Land</label>
              <span className="text-sm font-extrabold text-indigo-700">
                {simulatedLand} Acres
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="0.5"
              value={simulatedLand}
              onChange={(e) => setSimulatedLand(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
              <span>0 Acres (Landless)</span>
              <span>2.5 Acres (Marginal)</span>
              <span>5 Acres (Small)</span>
              <span>20 Acres</span>
            </div>
          </div>

          {/* Social Category Toggle */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Simulate Social Category</label>
            <div className="grid grid-cols-5 gap-1">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSimulatedCategory(c)}
                  className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    simulatedCategory === c
                      ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Delta Results Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Gained Schemes Card */}
        <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-3">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Newly Gained Schemes ({simulation.gainedSchemes.length})</span>
          </div>

          {simulation.gainedSchemes.length > 0 ? (
            <div className="space-y-2">
              {simulation.gainedSchemes.map((evalItem) => (
                <div
                  key={evalItem.schemeId}
                  onClick={() => onOpenSchemeModal(evalItem.scheme)}
                  className="p-3 bg-emerald-50/50 hover:bg-emerald-100/60 rounded-xl border border-emerald-200 cursor-pointer transition-colors flex items-center justify-between gap-2"
                >
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">
                      {currentLang === 'pa' ? evalItem.scheme.titlePa : currentLang === 'hi' ? evalItem.scheme.titleHi : evalItem.scheme.titleEn}
                    </h5>
                    <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                      {evalItem.scheme.benefitAmountText}
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              No new schemes gained with current simulation adjustments.
            </p>
          )}
        </div>

        {/* Lost Schemes Card */}
        <div className="bg-white rounded-2xl border border-rose-200 p-5 shadow-xs">
          <div className="flex items-center gap-2 text-rose-800 font-bold text-sm mb-3">
            <TrendingDown className="w-4 h-4 text-rose-600" />
            <span>Schemes Lost Under Scenario ({simulation.lostSchemes.length})</span>
          </div>

          {simulation.lostSchemes.length > 0 ? (
            <div className="space-y-2">
              {simulation.lostSchemes.map((evalItem) => (
                <div
                  key={evalItem.schemeId}
                  onClick={() => onOpenSchemeModal(evalItem.scheme)}
                  className="p-3 bg-rose-50/50 hover:bg-rose-100/60 rounded-xl border border-rose-200 cursor-pointer transition-colors flex items-center justify-between gap-2"
                >
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 line-through text-slate-500">
                      {currentLang === 'pa' ? evalItem.scheme.titlePa : currentLang === 'hi' ? evalItem.scheme.titleHi : evalItem.scheme.titleEn}
                    </h5>
                    <p className="text-[10px] text-rose-700 font-semibold mt-0.5">
                      Disqualified: Exceeds income ceiling (Max ₹{evalItem.scheme.maxIncome?.toLocaleString('en-IN')})
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              Zero schemes lost under this simulation!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
