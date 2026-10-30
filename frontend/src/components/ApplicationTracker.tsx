import React, { useState } from 'react';
import { ApplicationTrackerItem, Language, Scheme } from '../types/scheme';
import { TRANSLATIONS } from '../data/translations';
import { GOV_SCHEMES } from '../data/schemes';
import { 
  BookmarkCheck, 
  Trash2, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  Plus, 
  Clock,
  ArrowRight,
  Printer,
  FileCheck2,
  Building2,
  ShieldCheck,
  Search
} from 'lucide-react';

interface ApplicationTrackerProps {
  currentLang: Language;
  trackedItems: ApplicationTrackerItem[];
  onUpdateStatus: (id: string, status: ApplicationTrackerItem['status']) => void;
  onUpdateRefNumber: (id: string, refNumber: string) => void;
  onRemoveItem: (id: string) => void;
  onOpenSchemeModal: (scheme: Scheme) => void;
  onAddTrackedScheme?: (schemeId: string) => void;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  currentLang,
  trackedItems,
  onUpdateStatus,
  onUpdateRefNumber,
  onRemoveItem,
  onOpenSchemeModal,
  onAddTrackedScheme
}) => {
  const t = TRANSLATIONS[currentLang];
  const [selectedSchemeToAdd, setSelectedSchemeToAdd] = useState(GOV_SCHEMES[0]?.id || '');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const statuses: ApplicationTrackerItem['status'][] = [
    'Discovered',
    'Documents Assembled',
    'Form Submitted',
    'Approved',
    'Disbursed'
  ];

  const handleAddNewScheme = () => {
    if (!selectedSchemeToAdd || !onAddTrackedScheme) return;
    onAddTrackedScheme(selectedSchemeToAdd);
    setIsAddOpen(false);
  };

  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-teal-900 text-white rounded-2xl p-6 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-teal-500/20 text-teal-300 text-xs font-bold px-3 py-1 rounded-full border border-teal-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Innovative Feature 10 • Application Journey Tracker</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {t.tabTracker}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Track the step-by-step progress of all your Central &amp; Punjab government scheme applications from discovery to final bank direct benefit transfer (DBT).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAddOpen(prev => !prev)}
              className="inline-flex items-center gap-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Track Another Scheme</span>
            </button>

            {trackedItems.length > 0 && (
              <button
                type="button"
                onClick={handlePrintSummary}
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-2.5 rounded-xl border border-white/20 transition-colors"
                title="Print or export application journey dossier"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Dossier</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Summary Badges */}
        <div className="flex flex-wrap items-center gap-3 mt-4 text-xs font-semibold text-teal-200">
          <span className="bg-white/10 px-3 py-1 rounded-lg">
            Active Applications: {trackedItems.length}
          </span>
          <span className="bg-white/10 px-3 py-1 rounded-lg">
            Disbursed / Approved: {trackedItems.filter(i => i.status === 'Disbursed' || i.status === 'Approved').length}
          </span>
          <span className="bg-white/10 px-3 py-1 rounded-lg">
            Under Verification: {trackedItems.filter(i => i.status === 'Form Submitted' || i.status === 'Documents Assembled').length}
          </span>
        </div>
      </div>

      {/* Add New Scheme to Tracker Box */}
      {isAddOpen && (
        <div className="bg-white p-5 rounded-2xl border-2 border-teal-500/40 shadow-lg space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-teal-600" />
              <span>Add Any Scheme to Your Application Tracker</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              Cancel
            </button>
          </div>

          <div className="space-y-2">
            <label htmlFor="tracker-scheme-select" className="text-xs font-semibold text-slate-700">
              Select Scheme to Track:
            </label>
            <select
              id="tracker-scheme-select"
              value={selectedSchemeToAdd}
              onChange={(e) => setSelectedSchemeToAdd(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            >
              {GOV_SCHEMES.map((scheme) => (
                <option key={scheme.id} value={scheme.id}>
                  {currentLang === 'pa' ? scheme.titlePa : currentLang === 'hi' ? scheme.titleHi : scheme.titleEn} ({scheme.benefitAmountText})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleAddNewScheme}
              className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-colors"
            >
              Confirm &amp; Add to Journey Tracker
            </button>
          </div>
        </div>
      )}

      {/* Tracked Applications List */}
      {trackedItems.length > 0 ? (
        <div className="space-y-4">
          {trackedItems.map((item) => {
            const scheme = GOV_SCHEMES.find(s => s.id === item.schemeId);
            const currentStatusIndex = statuses.indexOf(item.status);

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Tracking since {item.dateStarted}
                    </span>
                    <h4 
                      onClick={() => scheme && onOpenSchemeModal(scheme)}
                      className="text-base sm:text-lg font-bold text-slate-900 hover:text-blue-700 cursor-pointer transition-colors"
                    >
                      {item.schemeTitle}
                    </h4>
                    {scheme && (
                      <p className="text-xs font-semibold text-teal-700 mt-0.5">
                        {scheme.benefitAmountText}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {scheme && (
                      <a
                        href={scheme.officialPortalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-200 font-semibold"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Remove from tracker"
                      aria-label="Remove tracked scheme"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 5-Step Journey Stepper */}
                <div>
                  <div className="grid grid-cols-5 gap-1 sm:gap-2">
                    {statuses.map((status, idx) => {
                      const isCompleted = idx <= currentStatusIndex;
                      const isCurrent = idx === currentStatusIndex;

                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => onUpdateStatus(item.id, status)}
                          className={`p-2 rounded-xl text-center transition-all cursor-pointer border ${
                            isCurrent
                              ? 'bg-blue-700 border-blue-700 text-white font-bold shadow-xs'
                              : isCompleted
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                              : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                          }`}
                        >
                          <div className="text-[10px] font-bold uppercase tracking-wider mb-0.5 hidden sm:block">
                            Step {idx + 1}
                          </div>
                          <div className="text-[10px] sm:text-xs truncate font-medium">
                            {status}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-[11px] text-slate-400 mt-1.5 text-right">
                    Click any step above to update your application progress
                  </p>
                </div>

                {/* Sewa Kendra Ref Number Input & Status Note */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                    <span className="font-semibold text-slate-700 shrink-0">
                      Application / Sewa Kendra Ref No:
                    </span>
                    <input
                      type="text"
                      value={item.applicationRefNumber || ''}
                      onChange={(e) => onUpdateRefNumber(item.id, e.target.value)}
                      placeholder="e.g. PB-ESW-2026-88192"
                      className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-900 font-mono flex-1 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div className="text-[11px] font-semibold text-slate-600 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Current Status: <strong className="text-slate-900">{item.status}</strong></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
          <BookmarkCheck className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-900">
            No Applications Currently in Tracker
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Click "Track Another Scheme" above or click "Track Scheme" on any scheme details page to follow your application journey step by step.
          </p>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-1.5 bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Start Tracking a Scheme Now</span>
          </button>
        </div>
      )}
    </div>
  );
};
