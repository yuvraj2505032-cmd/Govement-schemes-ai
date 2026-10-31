import React, { useState, useEffect } from 'react';
import { Scheme, EligibilityEvaluation, Language } from '../types/scheme';
import { TRANSLATIONS } from '../data/translations';
import { getSchemeVideoIds } from '../data/schemeVideos';
import { SchemeVideoTutorials } from './SchemeVideoTutorials';
import { getDocumentMeta, downloadSchemeSummary } from '../utils/documentHelper';
import { 
  X, 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ExternalLink, 
  Youtube, 
  FileCheck, 
  Calendar, 
  Layers, 
  Building2, 
  Sparkles,
  BookmarkPlus,
  Bookmark,
  HelpCircle,
  Lock,
  Download,
  PhoneCall,
  Coins,
  CheckSquare,
  Square,
  Printer,
  FileDown
} from 'lucide-react';
import { printSchemeDocument, downloadSchemeHtmlDocument } from '../utils/printHelper';

interface SchemeDetailModalProps {
  scheme: Scheme | null;
  evaluation?: EligibilityEvaluation;
  currentLang: Language;
  initialTab?: 'overview' | 'eligibility' | 'documents' | 'steps' | 'tutorial';
  onClose: () => void;
  onTrackScheme: (scheme: Scheme) => void;
  isAlreadyTracked: boolean;
  isSaved?: boolean;
  onToggleSave?: (scheme: Scheme) => void;
  onOpenAiAdvisor?: (scheme: Scheme) => void;
}

export const SchemeDetailModal: React.FC<SchemeDetailModalProps> = ({
  scheme,
  evaluation,
  currentLang,
  initialTab = 'overview',
  onClose,
  onTrackScheme,
  isAlreadyTracked,
  isSaved = false,
  onToggleSave,
  onOpenAiAdvisor
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'eligibility' | 'documents' | 'steps' | 'tutorial'>(initialTab);
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, scheme]);

  if (!scheme) return null;

  const t = TRANSLATIONS[currentLang];
  const title = currentLang === 'pa' ? scheme.titlePa : currentLang === 'hi' ? scheme.titleHi : scheme.titleEn;
  const description = currentLang === 'pa' ? scheme.descriptionPa : currentLang === 'hi' ? scheme.descriptionHi : scheme.descriptionEn;
  const department = currentLang === 'pa' ? scheme.departmentPa : currentLang === 'hi' ? scheme.departmentHi : scheme.departmentEn;

  const toggleDoc = (docName: string) => {
    setCheckedDocs(prev => ({
      ...prev,
      [docName]: !prev[docName]
    }));
  };

  const isEligible = evaluation?.isEligible;
  const isPotential = evaluation?.isPotentialMatch;
  const isPunjab = scheme.level === 'Punjab State';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-scheme-title"
      >
        {/* Tricolor Government Top Strip: Saffron, White, Green */}
        <div className="h-1.5 w-full flex">
          <div className="h-full w-1/3 bg-amber-500" />
          <div className="h-full w-1/3 bg-white" />
          <div className="h-full w-1/3 bg-emerald-600" />
        </div>

        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-4 sm:p-6 flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-teal-700/80 text-teal-200 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-teal-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                {scheme.level}
              </span>

              {evaluation && (
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                  isEligible 
                    ? 'bg-emerald-600 text-white' 
                    : isPotential 
                    ? 'bg-amber-500 text-slate-950' 
                    : 'bg-slate-700 text-slate-200'
                }`}>
                  {isEligible ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  <span>{isEligible ? t.confirmedMatch : isPotential ? t.potentialMatch : t.notEligible} ({evaluation.matchPercentage}%)</span>
                </span>
              )}
            </div>

            <h2 id="modal-scheme-title" className="text-lg sm:text-2xl font-extrabold tracking-tight text-white leading-snug">
              {title}
            </h2>
            <p className="text-xs text-slate-300 font-medium">
              {department}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onOpenAiAdvisor && (
              <button
                type="button"
                onClick={() => onOpenAiAdvisor(scheme)}
                className="p-2 px-3 rounded-xl transition-all border border-teal-400/40 bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 hover:text-white flex items-center gap-1.5 text-xs font-bold cursor-pointer shadow-xs"
                title="Ask Gemini 3.8 Flash AI about this scheme"
              >
                <Sparkles className="w-4 h-4 text-teal-300 fill-teal-300" />
                <span className="hidden sm:inline">Ask AI</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => printSchemeDocument(scheme, currentLang)}
              className="p-2 px-3 rounded-xl transition-all border border-amber-400/40 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 hover:text-white flex items-center gap-1.5 text-xs font-bold cursor-pointer shadow-xs"
              title="Print or Save as PDF (Official Government Summary)"
              aria-label="Print or Save as PDF"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>

            {onToggleSave && (
              <button
                type="button"
                onClick={() => onToggleSave(scheme)}
                className={`p-2 rounded-xl transition-all border cursor-pointer ${
                  isSaved
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                    : 'text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 border-white/20'
                }`}
                title={isSaved ? t.savedScheme : t.saveScheme}
                aria-label={isSaved ? t.savedScheme : t.saveScheme}
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-slate-950 text-slate-950' : ''}`} />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 sm:px-6 pt-3 pb-2 border-b border-slate-200 overflow-x-auto scrollbar-none bg-slate-50 text-xs sm:text-sm font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200 font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            Overview &amp; Benefits
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('eligibility')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
              activeTab === 'eligibility'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200 font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            <span>Eligibility Conditions</span>
            {evaluation && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isEligible ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {evaluation.matchPercentage}%
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('documents')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
              activeTab === 'documents'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200 font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            <span>Required Documents ({scheme.requiredDocuments.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('steps')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'steps'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200 font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            Application Process
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tutorial')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
              activeTab === 'tutorial'
                ? 'bg-white text-rose-700 shadow-xs border border-slate-200 font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            <Youtube className="w-3.5 h-3.5 text-rose-600" />
            <span>Video Guide</span>
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-sm text-slate-700">
          {/* TAB 1: OVERVIEW & BENEFITS */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Financial Benefit Callout */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-50 via-emerald-50/50 to-blue-50 border border-teal-200/80">
                <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
                  Total Entitlement &amp; Financial Assistance
                </span>
                <p className="text-lg sm:text-2xl font-black text-teal-950 mt-1">
                  {scheme.benefitAmountText}
                </p>
                <p className="text-xs text-teal-800 mt-1">
                  Type: <strong>{scheme.benefitType}</strong> • Disbursed via Aadhaar-linked DBT directly into citizen bank account.
                </p>
              </div>

              {/* Official Government Factsheet Print/PDF Callout Banner */}
              <div className="p-3.5 bg-gradient-to-r from-amber-50/90 via-orange-50/60 to-amber-50/90 border border-amber-200/90 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 border border-amber-300/60 flex items-center justify-center font-bold text-sm shrink-0">
                    🏛️
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <span>Official Citizen Factsheet &amp; Checklist</span>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-amber-200/70 text-amber-900">PDF / Print</span>
                    </h5>
                    <p className="text-[11px] text-amber-900/80 mt-0.5">
                      Includes full statutory eligibility matrix, document checklist with checkboxes, and Sewa Kendra guidelines.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => printSchemeDocument(scheme, currentLang)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Download as PDF / Print</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadSchemeHtmlDocument(scheme, currentLang)}
                    className="inline-flex items-center gap-1 text-xs font-semibold bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 px-2.5 py-2 rounded-xl transition-colors cursor-pointer"
                    title="Download offline HTML document"
                  >
                    <FileDown className="w-3.5 h-3.5 text-amber-700" />
                    <span className="hidden sm:inline">HTML</span>
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Detailed Scheme Summary
                </h4>
                <p className="text-sm leading-relaxed text-slate-700">
                  {description}
                </p>
              </div>

              {/* Application Fees, Helpline, Deadline, and Portal Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <Coins className="w-4 h-4 text-emerald-600" />
                    <span>Application Fees</span>
                  </div>
                  <p className="text-xs font-extrabold text-emerald-700">
                    ₹0 (100% Free of Cost)
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Government citizen welfare service; no official application fee required.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>Important Dates &amp; Deadline</span>
                  </div>
                  <p className="text-xs font-extrabold text-slate-900">
                    {scheme.applicationDeadline}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Cycle: {scheme.deadlineType}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <PhoneCall className="w-4 h-4 text-amber-600" />
                    <span>Helpline &amp; Contact Details</span>
                  </div>
                  <p className="text-xs font-extrabold text-slate-900">
                    {isPunjab ? 'Punjab Citizen Helpline: 1100 (Toll-Free)' : 'National Helpline: 1800-11-0031'}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Available Monday-Saturday, 7 AM to 9 PM IST.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <Building2 className="w-4 h-4 text-teal-600" />
                    <span>Official Portal</span>
                  </div>
                  <a 
                    href={scheme.officialPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-extrabold text-blue-700 hover:underline flex items-center gap-1"
                  >
                    <span>{scheme.officialPortalName}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <p className="text-[10px] text-slate-500">
                    Verified .gov.in government web gateway
                  </p>
                </div>
              </div>

              {scheme.warningAlert && (
                <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Official Fraud Alert: </strong>
                    {scheme.warningAlert}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ELIGIBILITY CONDITIONS */}
          {activeTab === 'eligibility' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-200 text-xs text-blue-900">
                <strong>Statutory Criteria Matching: </strong> 
                The system checks every statutory government rule from official scheme guidelines and verifies it against your profile in real-time.
              </div>

              {evaluation?.criteria && evaluation.criteria.length > 0 ? (
                <div className="space-y-2.5">
                  {evaluation.criteria.map((crit) => (
                    <div 
                      key={crit.id}
                      className={`p-3.5 rounded-2xl border flex items-start justify-between gap-3 ${
                        crit.isMet 
                          ? 'bg-emerald-50/50 border-emerald-200' 
                          : 'bg-rose-50/50 border-rose-200'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {crit.isMet ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            {currentLang === 'pa' ? crit.labelPa : currentLang === 'hi' ? crit.labelHi : crit.labelEn}
                          </div>
                          <div className="text-[11px] text-slate-600 mt-0.5">
                            Required: <span className="font-semibold">{crit.requiredDescription}</span> • Your profile: <span className="font-semibold">{crit.userValueDescription}</span>
                          </div>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        crit.isMet ? 'bg-emerald-200/60 text-emerald-900' : 'bg-rose-200/60 text-rose-900'
                      }`}>
                        {crit.isMet ? 'MATCHED' : 'NOT MET'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  Open the Eligibility Checker questionnaire to run personalized rule verification against this scheme.
                </p>
              )}

              {/* General criteria overview */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Scheme Rules Summary:
                </h4>
                <ul className="text-xs space-y-1.5 text-slate-600 list-disc pl-4">
                  <li>Age: {scheme.minAge ? `${scheme.minAge} years` : 'Any'} {scheme.maxAge ? `to ${scheme.maxAge} years` : ''}</li>
                  <li>Income Ceiling: {scheme.maxIncome ? `Up to ₹${scheme.maxIncome.toLocaleString('en-IN')}/year` : 'No ceiling'}</li>
                  <li>Occupations: {scheme.eligibleOccupations?.join(', ') || 'All occupations'}</li>
                  <li>Social Categories: {scheme.eligibleCategories?.join(', ') || 'General, SC, ST, OBC/BC, EWS'}</li>
                  <li>Domicile: {scheme.requiresPunjabDomicile ? 'Punjab Resident / Domicile Certificate Required' : 'All Indian Citizens'}</li>
                </ul>
              </div>

              <SchemeVideoTutorials schemeName={title} schemeId={scheme.id} />
            </div>
          )}

          {/* TAB 3: REQUIRED DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-teal-50 rounded-2xl border border-teal-200 text-xs text-teal-900">
                <strong>Required Documents Checklist: </strong>
                Below is the verified list of documents specifically required for this scheme. Check the boxes to track what you have ready.
              </div>

              <div className="space-y-2.5">
                {scheme.requiredDocuments.map((doc, idx) => {
                  const meta = getDocumentMeta(doc.nameEn);
                  const isChecked = !!checkedDocs[doc.nameEn];
                  const docTitle = currentLang === 'pa' ? doc.namePa : currentLang === 'hi' ? doc.nameHi : doc.nameEn;
                  const badgeText = currentLang === 'pa' ? meta.badgeTextPa : currentLang === 'hi' ? meta.badgeTextHi : meta.badgeTextEn;

                  return (
                    <div 
                      key={doc.nameEn}
                      onClick={() => toggleDoc(doc.nameEn)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                        isChecked 
                          ? 'bg-emerald-50/70 border-emerald-300' 
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="pt-0.5 text-slate-400">
                          {isChecked ? (
                            <CheckSquare className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-300" />
                          )}
                        </div>

                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-base shrink-0 border border-slate-200">
                          {meta.emoji}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400 font-bold">{idx + 1}.</span>
                            <span className={`text-xs sm:text-sm font-bold ${isChecked ? 'text-emerald-950' : 'text-slate-900'}`}>
                              {docTitle}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Issuing Authority: <strong className="text-slate-700">{doc.issuingAuthority}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className={`text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
                          meta.isMandatory
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {badgeText}
                        </span>

                        {doc.availableOnDigiLocker && (
                          <span className="bg-teal-50 text-teal-800 text-[9px] font-bold px-1.5 py-0.2 rounded border border-teal-200">
                            DigiLocker Verified
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: APPLICATION PROCESS */}
          {activeTab === 'steps' && (
            <div className="space-y-4">
              <div className="relative border-l-2 border-blue-200 ml-3.5 space-y-6 py-2">
                {scheme.applicationSteps.map((step) => {
                  const stepTitle = currentLang === 'pa' ? step.titlePa : currentLang === 'hi' ? step.titleHi : step.titleEn;
                  const stepDesc = currentLang === 'pa' ? step.descriptionPa : currentLang === 'hi' ? step.descriptionHi : step.descriptionEn;

                  return (
                    <div key={step.stepNumber} className="relative pl-6">
                      <div className="absolute -left-[13px] top-0 w-6 h-6 rounded-full bg-blue-700 text-white text-xs font-bold flex items-center justify-center shadow-xs">
                        {step.stepNumber}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        {stepTitle}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {stepDesc}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="font-bold text-slate-800">
                  Offline Application at Punjab Sewa Kendras:
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Citizens may also visit their nearest District Sewa Kendra or Tehsil Welfare Office with original documents. Government operators verify biometric e-KYC and upload documents without any unauthorized middleman charges.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: VIDEO TUTORIAL */}
          {activeTab === 'tutorial' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200 text-xs text-rose-900 flex items-center gap-2">
                <Youtube className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  Official Application Walkthrough &amp; Portal Demo
                </span>
              </div>

              {/* YouTube Video Player Embed */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-md bg-slate-900">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${getSchemeVideoIds(scheme.id)[0]}?rel=0`}
                  title={`${title} application video tutorial`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="text-xs text-slate-500 font-medium">
                Video: {scheme.youtubeVideoTitle}
              </div>
            </div>
          )}

          {/* Source Citation & Verification Notice */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
            <span className="flex items-center gap-1 text-slate-600">
              <Lock className="w-3 h-3 text-emerald-600" />
              Official Source: <strong className="text-slate-800">{scheme.sourceCitation}</strong>
            </span>
            <span className="bg-slate-100 px-2 py-0.5 rounded-md font-semibold">
              Verified: {scheme.verifiedDate}
            </span>
          </div>
        </div>

        {/* Modal Action Buttons Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onTrackScheme(scheme)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${
                isAlreadyTracked 
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700' 
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <BookmarkPlus className="w-4 h-4 text-indigo-600" />
              <span>{isAlreadyTracked ? 'Tracking in Progress' : 'Add to Application Tracker'}</span>
            </button>

            {onOpenAiAdvisor && (
              <button
                type="button"
                onClick={() => onOpenAiAdvisor(scheme)}
                className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl border border-amber-300 bg-amber-50 text-amber-950 hover:bg-amber-100 transition-all cursor-pointer shadow-2xs"
              >
                <Sparkles className="w-4 h-4 text-amber-600 fill-amber-300" />
                <span>Ask AI Advisor</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => printSchemeDocument(scheme, currentLang)}
              className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl border border-blue-300 bg-blue-50 text-blue-900 hover:bg-blue-100 hover:border-blue-400 transition-all cursor-pointer shadow-2xs group"
              title="Generate official government document and print or save as PDF"
            >
              <Printer className="w-4 h-4 text-blue-700 group-hover:scale-110 transition-transform" />
              <span>Download as PDF / Print</span>
            </button>

            <button
              type="button"
              onClick={() => downloadSchemeSummary(scheme, currentLang)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition-all cursor-pointer shadow-2xs"
              title="Download text summary"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Text Summary</span>
            </button>

            {onToggleSave && (
              <button
                type="button"
                onClick={() => onToggleSave(scheme)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-xs'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500 text-amber-500' : 'text-slate-500'}`} />
                <span>{isSaved ? t.savedScheme : t.saveScheme}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              Close
            </button>

            <a
              href={scheme.officialPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md shadow-blue-600/20 active:scale-95 transition-all"
            >
              <span>Apply on Official Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
