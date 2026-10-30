import React, { useState, useEffect } from 'react';
import { Scheme, CitizenProfile, Language } from '../types/scheme';
import { 
  Sparkles, 
  X, 
  Bot, 
  ShieldCheck, 
  ExternalLink, 
  RotateCcw, 
  Printer, 
  CheckCircle2, 
  Building2, 
  MapPin, 
  FileText, 
  HelpCircle,
  PhoneCall
} from 'lucide-react';
import { printSchemeDocument } from '../utils/printHelper';

interface AiSchemeAdvisorModalProps {
  scheme: Scheme | null;
  profile: CitizenProfile;
  currentLang: Language;
  onClose: () => void;
  onOpenVoiceAssistant?: (initialQuery?: string) => void;
}

export const AiSchemeAdvisorModal: React.FC<AiSchemeAdvisorModalProps> = ({
  scheme,
  profile,
  currentLang,
  onClose,
  onOpenVoiceAssistant
}) => {
  const [advice, setAdvice] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdvice = async () => {
    if (!scheme) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schemeId: scheme.id,
          userProfile: profile,
          language: currentLang
        })
      });

      if (!res.ok) {
        throw new Error('AI Advisor request failed');
      }

      const data = await res.json();
      setAdvice(data.advice || '');
    } catch (err) {
      console.error('Error fetching AI advice:', err);
      setError('Could not connect to AI advisor. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvice();
  }, [scheme?.id, currentLang]);

  if (!scheme) return null;

  const title = currentLang === 'pa' ? scheme.titlePa : currentLang === 'hi' ? scheme.titleHi : scheme.titleEn;
  const isPunjab = scheme.level === 'Punjab State';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-advisor-title"
      >
        {/* Tricolor Government Top Strip: Saffron, White, Green */}
        <div className="h-1.5 w-full flex">
          <div className="h-full w-1/3 bg-amber-500" />
          <div className="h-full w-1/3 bg-white" />
          <div className="h-full w-1/3 bg-emerald-600" />
        </div>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-900 via-blue-900 to-indigo-950 text-white p-5 sm:p-6 flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-400 text-slate-950 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                <span>AI Scheme Advisor</span>
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/10 text-slate-200 border border-white/20">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>{scheme.level}</span>
              </span>
            </div>

            <h2 id="ai-advisor-title" className="text-lg sm:text-xl font-black text-white tracking-tight leading-snug">
              {currentLang === 'pa' 
                ? `ਏ.ਆਈ ਯੋਗਤਾ ਸਲਾਹਕਾਰ: ${title}` 
                : currentLang === 'hi' 
                ? `एआई पात्रता सलाहकार: ${title}` 
                : `AI Eligibility & Application Advisor: ${title}`}
            </h2>
            <p className="text-xs text-slate-300">
              Personalized evaluation for {profile.occupation} • Age {profile.age} • {profile.district}, Punjab
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

        {/* Profile Snapshot Strip */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-800">
              Active Citizen Profile:
            </span>
            <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 font-semibold">
              ₹{profile.annualIncome.toLocaleString('en-IN')}/yr
            </span>
            <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 font-semibold">
              {profile.category}
            </span>
            <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 font-semibold">
              {profile.district}
            </span>
          </div>

          <button
            type="button"
            onClick={fetchAdvice}
            disabled={isLoading}
            className="text-[11px] font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Regenerate AI Analysis</span>
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-sm text-slate-800">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 animate-pulse">
                <Sparkles className="w-6 h-6 animate-spin" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                Analyzing Eligibility with Gemini 3.8 Flash...
              </h4>
              <p className="text-xs text-slate-500 max-w-sm">
                Evaluating statutory income limits, age parameters, required certificates, and local Sewa Kendra guidelines in {profile.district}.
              </p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-2">
              <p className="text-xs font-bold">{error}</p>
              <button
                type="button"
                onClick={fetchAdvice}
                className="text-xs font-bold text-rose-700 underline"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Formatted AI Output */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-teal-50/60 via-white to-blue-50/40 border border-teal-200/80 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-teal-900 border-b border-teal-100 pb-2">
                  <Bot className="w-4 h-4 text-teal-700" />
                  <span>Official AI Evaluation &amp; Advisory</span>
                </div>

                <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                  {advice}
                </div>
              </div>

              {/* Citizen Security & Helpline Callout */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-2 font-medium">
                  <PhoneCall className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>
                    Need human clarification? Call <strong>{isPunjab ? 'Punjab Helpline 1100' : 'National Helpdesk 1800-11-0031'}</strong> (Toll-Free).
                  </span>
                </div>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  100% Free Government Service
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => printSchemeDocument(scheme, currentLang)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 bg-white hover:bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-xl transition-colors cursor-pointer shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-blue-700" />
              <span>Print Factsheet</span>
            </button>

            {onOpenVoiceAssistant && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenVoiceAssistant(`How do I apply for ${scheme.titleEn}?`);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Ask Voice AI</span>
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
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-xl shadow-xs transition-colors"
            >
              <span>Official Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
