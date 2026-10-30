import React from 'react';
import { EligibilityEvaluation, Language } from '../types/scheme';
import { TRANSLATIONS } from '../data/translations';
import { aggregateMissingDocuments } from '../utils/schemeEngine';
import { 
  FileCheck2, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  Building2, 
  ShieldCheck,
  FolderOpen
} from 'lucide-react';

interface DocumentCenterProps {
  currentLang: Language;
  evaluations: EligibilityEvaluation[];
  userOwnedDocs: Set<string>;
  onToggleDoc: (docKey: string) => void;
  onOpenScanner?: () => void;
}

export const DocumentCenter: React.FC<DocumentCenterProps> = ({
  currentLang,
  evaluations,
  userOwnedDocs,
  onToggleDoc,
  onOpenScanner
}) => {
  const t = TRANSLATIONS[currentLang];
  const { allDocs, ownedDocs, missingDocs, readinessPercentage } = aggregateMissingDocuments(evaluations, userOwnedDocs);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-teal-900 text-white rounded-2xl p-6 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-teal-500/20 text-teal-300 text-xs font-bold px-3 py-1 rounded-full border border-teal-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Innovative Feature 3 • Smart Document Checklist</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {t.docTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              {t.docSubtitle}
            </p>
          </div>

          {/* Readiness Meter Card */}
          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/10 flex items-center gap-4">
            <div>
              <span className="text-[10px] text-teal-300 uppercase font-semibold">Readiness Score</span>
              <div className="text-2xl font-black text-white">{readinessPercentage}% Ready</div>
              <div className="text-[11px] text-slate-300">
                {ownedDocs.length} of {allDocs.length} documents arranged
              </div>
            </div>

            <div className="w-12 h-12 rounded-full border-4 border-teal-400/40 border-t-emerald-400 flex items-center justify-center font-bold text-xs text-emerald-300">
              {readinessPercentage}%
            </div>
          </div>
        </div>

        {/* Helpful links & Scanner Trigger */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-white/10 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-300">Quick Official Verification Portals:</span>
            <a
              href="https://digilocker.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 text-teal-200 px-3 py-1 rounded-lg transition-colors font-medium"
            >
              <span>DigiLocker India</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://esewa.punjab.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 text-teal-200 px-3 py-1 rounded-lg transition-colors font-medium"
            >
              <span>Punjab e-Sewa Kendra Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {onOpenScanner && (
            <button
              type="button"
              onClick={onOpenScanner}
              className="inline-flex items-center gap-1.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch AI Document Scanner &amp; Detector</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of Documents: Missing vs Owned */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Missing Documents Column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-rose-200">
            <h3 className="font-bold text-sm text-rose-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{t.docsMissing} ({missingDocs.length})</span>
            </h3>
            <span className="text-[11px] text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded-md">
              Action Required
            </span>
          </div>

          {missingDocs.length > 0 ? (
            <div className="space-y-2.5">
              {missingDocs.map((doc) => {
                const docTitle = currentLang === 'pa' ? doc.namePa : currentLang === 'hi' ? doc.nameHi : doc.nameEn;
                const docKey = doc.nameEn.toLowerCase().trim();

                return (
                  <div
                    key={doc.nameEn}
                    onClick={() => onToggleDoc(docKey)}
                    className="p-3.5 bg-white hover:bg-slate-50 rounded-xl border border-rose-200/80 shadow-xs cursor-pointer transition-all flex items-start justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        checked={false}
                        onChange={() => {}}
                        className="mt-1 rounded text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                          {docTitle}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Issuing Authority: <strong className="text-slate-700">{doc.issuingAuthority}</strong>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                          Required by: {doc.requiredBySchemes.slice(0, 2).join(', ')}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex flex-col items-end gap-1">
                      {doc.availableOnDigiLocker && (
                        <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                          On DigiLocker
                        </span>
                      )}
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                        Mark as Have
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="font-bold text-slate-800">All required documents are marked as owned!</p>
              <p className="text-[11px] mt-0.5 text-slate-400">You are 100% ready to apply on official portals.</p>
            </div>
          )}
        </div>

        {/* Owned Documents Column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
            <h3 className="font-bold text-sm text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{t.docsOwned} ({ownedDocs.length})</span>
            </h3>
            <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
              Verified &amp; Ready
            </span>
          </div>

          {ownedDocs.length > 0 ? (
            <div className="space-y-2.5">
              {ownedDocs.map((doc) => {
                const docTitle = currentLang === 'pa' ? doc.namePa : currentLang === 'hi' ? doc.nameHi : doc.nameEn;
                const docKey = doc.nameEn.toLowerCase().trim();

                return (
                  <div
                    key={doc.nameEn}
                    onClick={() => onToggleDoc(docKey)}
                    className="p-3.5 bg-emerald-50/40 hover:bg-emerald-50/70 rounded-xl border border-emerald-200 shadow-xs cursor-pointer transition-all flex items-start justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        checked={true}
                        onChange={() => {}}
                        className="mt-1 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                          {docTitle}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Issuing Authority: <strong className="text-slate-700">{doc.issuingAuthority}</strong>
                        </div>
                      </div>
                    </div>

                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0">
                      Arranged
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500">
              <FolderOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p>Tick the documents on the left that you already possess to see your readiness score climb!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
