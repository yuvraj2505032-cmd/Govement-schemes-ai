import React, { useState } from 'react';
import { Scheme, Language } from '../types/scheme';
import { getDocumentMeta, downloadSchemeSummary } from '../utils/documentHelper';
import { 
  X, 
  FileCheck2, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  ExternalLink, 
  Building2, 
  ShieldCheck, 
  Info,
  CheckSquare,
  Square,
  HelpCircle,
  Printer
} from 'lucide-react';
import { printSchemeDocument } from '../utils/printHelper';

interface ViewAllDocumentsModalProps {
  scheme: Scheme | null;
  currentLang: Language;
  onClose: () => void;
  onOpenFullDetails?: (scheme: Scheme) => void;
}

export const ViewAllDocumentsModal: React.FC<ViewAllDocumentsModalProps> = ({
  scheme,
  currentLang,
  onClose,
  onOpenFullDetails
}) => {
  const [checkedDocs, setCheckedDocs] = useState<Record<number, boolean>>({});

  if (!scheme) return null;

  const isPunjab = scheme.level === 'Punjab State';
  const title = currentLang === 'pa' ? scheme.titlePa : currentLang === 'hi' ? scheme.titleHi : scheme.titleEn;
  const dept = currentLang === 'pa' ? scheme.departmentPa : currentLang === 'hi' ? scheme.departmentHi : scheme.departmentEn;

  const totalDocs = scheme.requiredDocuments.length;
  const readyDocsCount = Object.values(checkedDocs).filter(Boolean).length;
  const readinessPercent = totalDocs > 0 ? Math.round((readyDocsCount / totalDocs) * 100) : 0;

  const toggleDoc = (index: number) => {
    setCheckedDocs(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const markAllDocs = () => {
    const allChecked: Record<number, boolean> = {};
    scheme.requiredDocuments.forEach((_, idx) => {
      allChecked[idx] = true;
    });
    setCheckedDocs(allChecked);
  };

  const clearAllDocs = () => {
    setCheckedDocs({});
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="all-docs-title"
      >
        {/* Tricolor Government Top Strip: Saffron, White, Green */}
        <div className="h-1.5 w-full flex">
          <div className="h-full w-1/3 bg-amber-500" />
          <div className="h-full w-1/3 bg-white" />
          <div className="h-full w-1/3 bg-emerald-600" />
        </div>

        {/* Modal Header: Navy Blue Theme with Ashoka Gold Accents */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-5 sm:p-6 flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                <FileCheck2 className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {currentLang === 'pa' ? 'ਦਸਤਾਵੇਜ਼ ਚੈੱਕਲਿਸਟ' : currentLang === 'hi' ? 'दस्तावेज़ चेकलिस्ट' : 'Document Checklist'}
                </span>
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/10 text-slate-200 border border-white/20">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>{scheme.level}</span>
              </span>
            </div>

            <h2 id="all-docs-title" className="text-lg sm:text-xl font-black text-white tracking-tight leading-snug">
              {currentLang === 'pa' 
                ? `ਇਸ ਸਕੀਮ ਲਈ ਲੋੜੀਂਦੇ ਦਸਤਾਵੇਜ਼: ${title}` 
                : currentLang === 'hi' 
                ? `इस योजना के लिए आवश्यक दस्तावेज़: ${title}` 
                : `Required Documents for This Scheme: ${title}`}
            </h2>
            <p className="text-xs text-slate-300 line-clamp-1">
              {dept}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Readiness Meter & Guidance Card */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 sm:p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  {currentLang === 'pa'
                    ? `ਤੁਹਾਡੀ ਤਿਆਰੀ: ${readyDocsCount} ਵਿੱਚੋਂ ${totalDocs} ਦਸਤਾਵੇਜ਼ ਤਿਆਰ (${readinessPercent}%)`
                    : currentLang === 'hi'
                    ? `आपकी तैयारी: ${totalDocs} में से ${readyDocsCount} दस्तावेज़ तैयार (${readinessPercent}%)`
                    : `Application Readiness: ${readyDocsCount} of ${totalDocs} documents ready (${readinessPercent}%)`}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {readinessPercent === 100
                  ? (currentLang === 'pa' ? 'ਵਧਾਈਆਂ! ਸਾਰੇ ਦਸਤਾਵੇਜ਼ ਤਿਆਰ ਹਨ, ਹੁਣੇ ਅਪਲਾਈ ਕਰੋ।' : currentLang === 'hi' ? 'बधाई हो! सभी दस्तावेज़ तैयार हैं, अभी आवेदन करें।' : 'Great! All documents are ready. You can apply on the portal or visit a Sewa Kendra.')
                  : (currentLang === 'pa' ? 'ਚੈੱਕਬਾਕਸ ਤੇ ਕਲਿੱਕ ਕਰਕੇ ਚੈੱਕ ਕਰੋ ਕਿ ਤੁਹਾਡੇ ਕੋਲ ਕਿਹੜੇ ਕਾਗਜ਼ਾਤ ਮੌਜੂਦ ਹਨ।' : currentLang === 'hi' ? 'चेकबॉक्स पर क्लिक करके देखें कि आपके पास कौन से दस्तावेज उपलब्ध हैं।' : 'Click the checkboxes to verify which certificates and records you already have.')}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={markAllDocs}
                className="text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors cursor-pointer"
              >
                Mark All Ready
              </button>
              {readyDocsCount > 0 && (
                <button
                  type="button"
                  onClick={clearAllDocs}
                  className="text-[11px] font-semibold text-slate-500 hover:text-rose-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 hover:border-rose-300 transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                readinessPercent === 100 ? 'bg-emerald-500' : readinessPercent >= 50 ? 'bg-teal-500' : 'bg-amber-500'
              }`}
              style={{ width: `${readinessPercent}%` }}
            />
          </div>
        </div>

        {/* Document List (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center justify-between pb-1">
            <span>
              {currentLang === 'pa' ? 'ਪ੍ਰਮਾਣਿਤ ਦਸਤਾਵੇਜ਼ਾਂ ਦੀ ਸੂਚੀ' : currentLang === 'hi' ? 'सत्यापित दस्तावेजों की सूची' : 'Official Document Requirements'}:
            </span>
            <span className="text-slate-400 font-medium">
              {totalDocs} {currentLang === 'pa' ? 'ਦਸਤਾਵੇਜ਼ ਲੋੜੀਂਦੇ' : 'Items'}
            </span>
          </div>

          <div className="space-y-2.5">
            {scheme.requiredDocuments.map((doc, index) => {
              const meta = getDocumentMeta(doc.nameEn);
              const isChecked = !!checkedDocs[index];
              const docName = currentLang === 'pa' ? doc.namePa : currentLang === 'hi' ? doc.nameHi : doc.nameEn;
              const badgeText = currentLang === 'pa' ? meta.badgeTextPa : currentLang === 'hi' ? meta.badgeTextHi : meta.badgeTextEn;

              return (
                <div 
                  key={index}
                  onClick={() => toggleDoc(index)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                    isChecked 
                      ? 'bg-emerald-50/70 border-emerald-300 shadow-2xs' 
                      : 'bg-white hover:bg-slate-50/90 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Checkbox */}
                  <div className="pt-0.5 shrink-0 text-slate-400">
                    {isChecked ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300 hover:text-slate-500" />
                    )}
                  </div>

                  {/* Document Number & Emoji Icon */}
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-lg shrink-0 border border-slate-200/80">
                    {meta.emoji}
                  </div>

                  {/* Document Title and Issuing Details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400">
                          {index + 1}.
                        </span>
                        <h4 className={`text-sm font-bold transition-colors ${
                          isChecked ? 'text-emerald-950 line-through/10' : 'text-slate-900'
                        }`}>
                          {docName}
                        </h4>
                      </div>

                      {/* Mandatory vs Optional Badge */}
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border shrink-0 ${
                        meta.isMandatory
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {badgeText}
                      </span>
                    </div>

                    {/* Metadata Sub-row */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 font-medium">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        <span>Issued by: <strong>{doc.issuingAuthority}</strong></span>
                      </span>

                      {doc.availableOnDigiLocker && (
                        <span className="inline-flex items-center gap-1 text-teal-700 font-semibold bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200/70 text-[10px]">
                          <span>⚡ DigiLocker Instant e-Verification</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Citizen Advisory Note */}
          <div className="mt-4 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-800">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Official Citizen Guidelines:</span>
            </div>
            <p className="text-[11px] text-amber-800/90 leading-relaxed pl-5">
              Ensure that your name and date of birth match across your Aadhaar Card, Bank Passbook, and Category Certificates to avoid rejection. Photocopies must be self-attested when applying physically at Sewa Kendras.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => printSchemeDocument(scheme, currentLang)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-300 px-3.5 py-2 rounded-xl transition-colors cursor-pointer shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-blue-700" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              type="button"
              onClick={() => downloadSchemeSummary(scheme, currentLang)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-xl transition-colors cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Download Factsheet</span>
            </button>

            {onOpenFullDetails && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFullDetails(scheme);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
              >
                <span>Full Scheme Details</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-5 py-2 rounded-xl transition-colors cursor-pointer shadow-xs ml-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
