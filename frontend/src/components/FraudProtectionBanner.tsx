import React from 'react';
import { Language } from '../types/scheme';
import { TRANSLATIONS } from '../data/translations';
import { ShieldAlert, ShieldCheck, Lock, AlertTriangle, PhoneCall } from 'lucide-react';

interface FraudProtectionBannerProps {
  currentLang: Language;
}

export const FraudProtectionBanner: React.FC<FraudProtectionBannerProps> = ({ currentLang }) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <div className="bg-gradient-to-r from-amber-50 via-rose-50 to-amber-50 border border-amber-200/90 rounded-2xl p-4 sm:p-5 shadow-xs mb-8">
      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-300 text-amber-700 flex items-center justify-center shrink-0">
          <ShieldAlert className="w-6 h-6 text-amber-600" />
        </div>

        <div className="space-y-1 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
              <span>{t.fraudTitle}</span>
            </h3>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Official .gov.in / .nic.in Only</span>
            </span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {t.fraudWarning1}
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t.fraudWarning2}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-slate-700 font-semibold">
            <span className="flex items-center gap-1 text-rose-700">
              <AlertTriangle className="w-3.5 h-3.5" />
              Report Cyber Fraud: Call <strong>1930</strong> (National Cybercrime Portal)
            </span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1 text-blue-700">
              <PhoneCall className="w-3.5 h-3.5" />
              Punjab Citizen Grievance Helpline: <strong>1100</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
