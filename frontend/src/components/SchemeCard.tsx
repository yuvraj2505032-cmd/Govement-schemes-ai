import React, { useState, useRef, useEffect } from 'react';
import { Scheme, EligibilityEvaluation, Language } from '../types/scheme';
import { TRANSLATIONS } from '../data/translations';
import { getDocumentMeta, downloadSchemeSummary } from '../utils/documentHelper';
import { 
  ShieldCheck, 
  ExternalLink, 
  FileText, 
  Youtube, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Scan,
  XCircle,
  MoreVertical,
  Download,
  Info,
  CheckSquare,
  FileCheck2,
  Building2,
  Printer
} from 'lucide-react';
import { printSchemeDocument } from '../utils/printHelper';

interface SchemeCardProps {
  scheme: Scheme;
  evaluation?: EligibilityEvaluation;
  currentLang: Language;
  onOpenDetails: (scheme: Scheme, initialTab?: 'overview' | 'eligibility' | 'documents' | 'steps' | 'tutorial') => void;
  onOpenTutorial: (scheme: Scheme) => void;
  onOpenScanner?: (scheme: Scheme) => void;
  onOpenAllDocuments?: (scheme: Scheme) => void;
  onOpenAiAdvisor?: (scheme: Scheme) => void;
  isSaved?: boolean;
  onToggleSave?: (scheme: Scheme) => void;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({
  scheme,
  evaluation,
  currentLang,
  onOpenDetails,
  onOpenTutorial,
  onOpenScanner,
  onOpenAllDocuments,
  onOpenAiAdvisor,
  isSaved = false,
  onToggleSave
}) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[currentLang];

  const title = currentLang === 'pa' ? scheme.titlePa : currentLang === 'hi' ? scheme.titleHi : scheme.titleEn;
  const description = currentLang === 'pa' ? scheme.descriptionPa : currentLang === 'hi' ? scheme.descriptionHi : scheme.descriptionEn;
  const department = currentLang === 'pa' ? scheme.departmentPa : currentLang === 'hi' ? scheme.departmentHi : scheme.departmentEn;

  const isEligible = evaluation?.isEligible;
  const isPotential = evaluation?.isPotentialMatch;
  const matchPercentage = evaluation?.matchPercentage ?? 75;

  const isPunjab = scheme.level === 'Punjab State';

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleOpenAllDocs = () => {
    setIsMenuOpen(false);
    if (onOpenAllDocuments) {
      onOpenAllDocuments(scheme);
    } else {
      onOpenDetails(scheme, 'documents');
    }
  };

  const handleMenuItemClick = (action: () => void) => {
    setIsMenuOpen(false);
    action();
  };

  // Trilingual labels for Required Documents heading
  const reqDocsHeading = currentLang === 'pa' 
    ? 'ਲੋੜੀਂਦੇ ਦਸਤਾਵੇਜ਼' 
    : currentLang === 'hi' 
    ? 'आवश्यक दस्तावेज़' 
    : 'Required Documents';

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 hover:shadow-lg flex flex-col justify-between overflow-hidden relative ${
      isEligible 
        ? 'border-emerald-300 ring-1 ring-emerald-400/30' 
        : isPotential 
        ? 'border-amber-300 ring-1 ring-amber-400/20' 
        : 'border-slate-200'
    }`}>
      {/* Top Banner with Scheme Level & Eligibility Status */}
      <div className="p-4 sm:p-5 pb-3">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
            isPunjab 
              ? 'bg-teal-50 text-teal-800 border border-teal-200' 
              : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            <ShieldCheck className="w-3 h-3" />
            <span>{scheme.level}</span>
          </span>

          <div className="flex items-center gap-1.5">
            {evaluation && (
              <span className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-md border ${
                isEligible
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : isPotential
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}>
                {isEligible ? (
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-3 h-3 text-amber-600" />
                )}
                <span>{matchPercentage}% Match</span>
              </span>
            )}

            {onToggleSave && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSave(scheme);
                }}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-amber-50 text-amber-700 border-amber-300 shadow-xs'
                    : 'bg-slate-50 text-slate-400 hover:text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                title={isSaved ? t.savedScheme : t.saveScheme}
                aria-label={isSaved ? t.savedScheme : t.saveScheme}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Scheme Title & Department */}
        <h3 
          onClick={() => onOpenDetails(scheme, 'overview')}
          className="text-base sm:text-lg font-bold text-slate-900 hover:text-blue-700 cursor-pointer transition-colors leading-snug"
        >
          {title}
        </h3>
        <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 font-medium">
          {department}
        </p>

        {/* Category Tags */}
        <div className="flex flex-wrap gap-1 mt-2.5">
          {scheme.categoryTags.slice(0, 3).map((tag) => (
            <span 
              key={tag}
              className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded-md"
            >
              {tag}
            </span>
          ))}
          {scheme.deadlineType === 'Seasonal' && (
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
              Seasonal Cycle
            </span>
          )}
        </div>

        {/* Key Benefits Callout Card */}
        <div className="mt-3.5 p-3 rounded-xl bg-gradient-to-r from-blue-50/80 via-teal-50/50 to-blue-50/80 border border-blue-100/80">
          <div className="text-[10px] font-semibold text-blue-900 uppercase tracking-wider">
            {t.benefits}
          </div>
          <div className="text-xs sm:text-sm font-extrabold text-teal-900 mt-0.5">
            {scheme.benefitAmountText}
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Eligibility Match Progress Bar & Explanation Toggle */}
        {evaluation && (
          <div className="mt-3 pt-2.5 border-t border-slate-100">
            <div className="flex items-center justify-between gap-2 text-[11px] mb-1">
              <span className="font-semibold text-slate-600">
                Eligibility Score: <strong className={isEligible ? 'text-emerald-700' : isPotential ? 'text-amber-700' : 'text-slate-700'}>{matchPercentage}%</strong>
              </span>

              <button
                type="button"
                onClick={() => setShowExplanation(prev => !prev)}
                className="text-blue-700 hover:text-blue-900 font-bold flex items-center gap-0.5 text-[11px] cursor-pointer"
              >
                <span>{showExplanation ? 'Hide Reasons' : 'Why am I eligible?'}</span>
                {showExplanation ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  isEligible ? 'bg-emerald-500' : isPotential ? 'bg-amber-500' : 'bg-slate-400'
                }`}
                style={{ width: `${matchPercentage}%` }}
              />
            </div>

            {/* Expandable Explanation Breakdown */}
            {showExplanation && (
              <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 animate-in fade-in">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Rule-by-Rule Eligibility Verification:
                </div>

                <div className="space-y-1.5">
                  {evaluation.criteria.map((c) => (
                    <div key={c.id} className="flex items-start gap-1.5 text-[11px]">
                      {c.isMet ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className={c.isMet ? 'font-semibold text-emerald-950' : 'font-semibold text-rose-950'}>
                          {currentLang === 'pa' ? c.labelPa : currentLang === 'hi' ? c.labelHi : c.labelEn}:
                        </span>{' '}
                        <span className="text-slate-600">{c.userValueDescription} (Requirement: {c.requiredDescription})</span>
                      </div>
                    </div>
                  ))}
                </div>

                {evaluation.failedReasons.length > 0 && (
                  <div className="pt-1.5 text-[10px] text-rose-700 font-medium">
                    ⚠️ Note: {evaluation.failedReasons.join(', ')}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* REQUIRED DOCUMENTS SECTION WITH THREE-DOT (⋮) MENU */}
        {/* ------------------------------------------------------------------ */}
        <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50/70 -mx-4 -mb-3 sm:-mx-5 sm:-mb-3 p-4 sm:p-5 rounded-b-2xl">
          <div className="flex items-center justify-between mb-2 relative" ref={menuRef}>
            {/* Heading with Icon */}
            <div className="flex items-center gap-1.5">
              <span className="text-sm">📋</span>
              <h4 className="text-xs font-bold text-slate-800 tracking-tight">
                {reqDocsHeading}
              </h4>
              <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                {scheme.requiredDocuments.length}
              </span>
            </div>

            {/* Three-Dot Menu (⋮) Trigger Button */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(prev => !prev);
                }}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  isMenuOpen 
                    ? 'bg-blue-100 text-blue-900 border-blue-300' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/80 border-transparent hover:border-slate-300'
                }`}
                title="Scheme options and document actions"
                aria-label="Three dot menu options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Dropdown Menu Popup */}
              {isMenuOpen && (
                <div 
                  className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100 overflow-hidden"
                  role="menu"
                >
                  {/* Subtle Tricolor Accent Indicator */}
                  <div className="h-1 w-full flex">
                    <div className="h-full w-1/3 bg-amber-500" />
                    <div className="h-full w-1/3 bg-slate-200" />
                    <div className="h-full w-1/3 bg-emerald-600" />
                  </div>

                  <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Quick Actions (⋮)</span>
                    <span className="text-[9px] text-amber-700 bg-amber-50 px-1 py-0.2 rounded font-extrabold">AI</span>
                  </div>

                  {/* AI Scheme Advisor */}
                  {onOpenAiAdvisor && (
                    <button
                      type="button"
                      onClick={() => handleMenuItemClick(() => onOpenAiAdvisor(scheme))}
                      className="w-full text-left px-3.5 py-2 text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-50/70 to-orange-50/40 hover:from-amber-100 hover:to-orange-100 flex items-center gap-2.5 transition-colors cursor-pointer border-b border-amber-100/70"
                      role="menuitem"
                    >
                      <Sparkles className="w-4 h-4 text-amber-600 fill-amber-300" />
                      <span>✨ Ask Gemini AI Advisor</span>
                    </button>
                  )}

                  {/* 1. View All Documents */}
                  <button
                    type="button"
                    onClick={() => handleMenuItemClick(handleOpenAllDocs)}
                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-teal-50 hover:text-teal-900 flex items-center gap-2.5 transition-colors cursor-pointer"
                    role="menuitem"
                  >
                    <span className="text-base">📋</span>
                    <span>View All Documents</span>
                  </button>

                  {/* 2. Full Scheme Details */}
                  <button
                    type="button"
                    onClick={() => handleMenuItemClick(() => onOpenDetails(scheme, 'overview'))}
                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-900 flex items-center gap-2.5 transition-colors cursor-pointer"
                    role="menuitem"
                  >
                    <Info className="w-4 h-4 text-blue-600" />
                    <span>Full Scheme Details</span>
                  </button>

                  {/* 3. Eligibility Criteria */}
                  <button
                    type="button"
                    onClick={() => handleMenuItemClick(() => onOpenDetails(scheme, 'eligibility'))}
                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-900 flex items-center gap-2.5 transition-colors cursor-pointer"
                    role="menuitem"
                  >
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                    <span>Eligibility Criteria</span>
                  </button>

                  {/* 4. Application Process */}
                  <button
                    type="button"
                    onClick={() => handleMenuItemClick(() => onOpenDetails(scheme, 'steps'))}
                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-indigo-50 hover:text-indigo-900 flex items-center gap-2.5 transition-colors cursor-pointer"
                    role="menuitem"
                  >
                    <FileCheck2 className="w-4 h-4 text-indigo-600" />
                    <span>Application Process</span>
                  </button>

                  {/* 5. Official Website */}
                  <a
                    href={scheme.officialPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 hover:text-blue-700 flex items-center gap-2.5 transition-colors"
                    role="menuitem"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-500" />
                    <span>Official Website (.gov.in)</span>
                  </a>

                  {/* 6. Print / Save as PDF */}
                  <button
                    type="button"
                    onClick={() => handleMenuItemClick(() => printSchemeDocument(scheme, currentLang))}
                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-900 flex items-center gap-2.5 transition-colors cursor-pointer"
                    role="menuitem"
                  >
                    <Printer className="w-4 h-4 text-blue-600" />
                    <span>Print / Save as PDF</span>
                  </button>

                  {/* 7. Download Information */}
                  <div className="pt-1 mt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleMenuItemClick(() => downloadSchemeSummary(scheme, currentLang))}
                      className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-amber-50 hover:text-amber-900 flex items-center gap-2.5 transition-colors cursor-pointer"
                      role="menuitem"
                    >
                      <Download className="w-4 h-4 text-amber-600" />
                      <span>Download Factsheet</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Document Items List (Showing Scheme-Specific Documents with icons & badges) */}
          <div className="space-y-1.5">
            {scheme.requiredDocuments.slice(0, 3).map((doc, docIdx) => {
              const meta = getDocumentMeta(doc.nameEn);
              const docName = currentLang === 'pa' ? doc.namePa : currentLang === 'hi' ? doc.nameHi : doc.nameEn;
              const badgeLabel = currentLang === 'pa' ? meta.badgeTextPa : currentLang === 'hi' ? meta.badgeTextHi : meta.badgeTextEn;

              return (
                <div 
                  key={docIdx}
                  onClick={handleOpenAllDocs}
                  className="flex items-center justify-between gap-2 p-1.5 px-2.5 rounded-lg bg-white border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/30 transition-colors cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm shrink-0">{meta.emoji}</span>
                    <span className="font-semibold text-slate-800 truncate text-[11px] sm:text-xs">
                      {docName}
                    </span>
                  </div>

                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                    meta.isMandatory
                      ? 'bg-rose-50 text-rose-800 border border-rose-200/70'
                      : 'bg-amber-50 text-amber-800 border border-amber-200/70'
                  }`}>
                    {meta.isMandatory ? 'Mandatory' : 'If Applicable'}
                  </span>
                </div>
              );
            })}

            {/* If more than 3 documents, clickable "+X more documents" button */}
            {scheme.requiredDocuments.length > 3 ? (
              <button
                type="button"
                onClick={handleOpenAllDocs}
                className="w-full py-1 text-center text-[11px] font-bold text-blue-700 hover:text-blue-900 hover:underline cursor-pointer flex items-center justify-center gap-1"
              >
                <span>+{scheme.requiredDocuments.length - 3} more documents</span>
                <span className="text-slate-400 font-normal">• View All</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleOpenAllDocs}
                className="w-full py-1 text-center text-[10px] font-bold text-slate-500 hover:text-blue-700 cursor-pointer flex items-center justify-center gap-1"
              >
                <span>View Full Document Checklist &amp; Authorities</span>
              </button>
            )}
          </div>

          {/* Application Deadline */}
          <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5 font-medium truncate">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{scheme.applicationDeadline}</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded shrink-0">
              ₹0 App Fee
            </span>
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="p-4 bg-slate-50/90 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {onOpenAiAdvisor && (
            <button
              type="button"
              onClick={() => onOpenAiAdvisor(scheme)}
              className="flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-2xs"
              title="Personalized Gemini 3.8 Flash AI advice"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-300" />
              <span>AI Advisor</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onOpenTutorial(scheme)}
            className="flex items-center gap-1 text-[11px] font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
            title="Watch verified video application guide"
          >
            <Youtube className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden sm:inline">Tutorial</span>
          </button>

          {onOpenScanner && (
            <button
              type="button"
              onClick={() => onOpenScanner(scheme)}
              className="flex items-center gap-1 text-[11px] font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              title="Scan and detect missing documents"
            >
              <Scan className="w-3.5 h-3.5 text-teal-600" />
              <span className="hidden sm:inline">Scan Docs</span>
            </button>
          )}

          <a
            href={scheme.officialPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-blue-700 bg-white hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-lg transition-colors"
            title="Open verified official portal"
          >
            <ExternalLink className="w-3 h-3" />
            <span className="hidden sm:inline">Portal</span>
          </a>
        </div>

        <button
          type="button"
          onClick={() => onOpenDetails(scheme, 'overview')}
          className="flex items-center gap-1.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 px-3.5 py-1.5 rounded-lg shadow-xs active:scale-95 transition-all ml-auto cursor-pointer"
        >
          <span>{t.viewDetails}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
