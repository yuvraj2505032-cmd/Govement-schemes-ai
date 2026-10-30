import React, { useState, useEffect } from 'react';
import { CitizenProfile, Language } from '../types/scheme';
import { 
  Sparkles, 
  X, 
  Bot, 
  ShieldCheck, 
  RotateCcw, 
  CheckCircle2, 
  MapPin, 
  IndianRupee, 
  FileText, 
  PhoneCall,
  Printer,
  TrendingUp,
  Award,
  Users
} from 'lucide-react';

interface AiProfileRoadmapModalProps {
  profile: CitizenProfile;
  currentLang: Language;
  onClose: () => void;
  onOpenVoiceAssistant?: () => void;
}

export const AiProfileRoadmapModal: React.FC<AiProfileRoadmapModalProps> = ({
  profile,
  currentLang,
  onClose,
  onOpenVoiceAssistant
}) => {
  const [roadmap, setRoadmap] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoadmap = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/profile-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: profile,
          language: currentLang
        })
      });

      if (!res.ok) {
        throw new Error('AI Profile Roadmap request failed');
      }

      const data = await res.json();
      setRoadmap(data.analysis || '');
    } catch (err) {
      console.error('Error fetching AI roadmap:', err);
      setError('Could not connect to AI advisor. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, [profile, currentLang]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-roadmap-title"
      >
        {/* Tricolor Government Top Strip: Saffron, White, Green */}
        <div className="h-1.5 w-full flex">
          <div className="h-full w-1/3 bg-amber-500" />
          <div className="h-full w-1/3 bg-white" />
          <div className="h-full w-1/3 bg-emerald-600" />
        </div>

        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                <span>AI Welfare Roadmap</span>
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/10 text-slate-200 border border-white/20">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>Punjab &amp; Central Schemes</span>
              </span>
            </div>

            <h2 id="ai-roadmap-title" className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
              {currentLang === 'pa' 
                ? 'ਤੁਹਾਡਾ ਨਿੱਜੀ ਸਰਕਾਰੀ ਭਲਾਈ ਰੋਡਮੈਪ (AI Roadmap)' 
                : currentLang === 'hi' 
                ? 'आपकी व्यक्तिगत सरकारी कल्याण योजना (AI Roadmap)' 
                : 'Personalized Government Welfare Roadmap (AI Audit)'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Audit for {profile.occupation} • Age {profile.age} • Income ₹{profile.annualIncome.toLocaleString('en-IN')}/yr • {profile.district}, Punjab
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

        {/* Profile Metrics Snapshot */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-800">Parameters:</span>
            <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 font-semibold text-slate-700">
              {profile.occupation}
            </span>
            <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 font-semibold text-slate-700">
              {profile.category}
            </span>
            <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 font-semibold text-slate-700">
              ₹{profile.annualIncome.toLocaleString('en-IN')}/yr
            </span>
            <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 font-semibold text-slate-700">
              {profile.district}
            </span>
          </div>

          <button
            type="button"
            onClick={fetchRoadmap}
            disabled={isLoading}
            className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Recalculate AI Roadmap</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-sm text-slate-800">
          {isLoading ? (
            <div className="py-14 flex flex-col items-center justify-center space-y-3.5 text-center">
              <div className="w-14 h-14 rounded-3xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 animate-pulse">
                <Sparkles className="w-7 h-7 animate-spin text-indigo-600" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">
                Building Your Government Welfare Roadmap with Gemini 3.8 Flash...
              </h4>
              <p className="text-xs text-slate-500 max-w-md">
                Analyzing direct cash transfers, subsidized health coverage, educational quotas, and pension multipliers across 20+ Punjab &amp; Central schemes.
              </p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-2">
              <p className="text-xs font-bold">{error}</p>
              <button
                type="button"
                onClick={fetchRoadmap}
                className="text-xs font-bold text-rose-700 underline"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/40 border border-indigo-200/80 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 border-b border-indigo-100 pb-2">
                  <Bot className="w-4 h-4 text-indigo-700" />
                  <span>Gemini 3.8 Flash Welfare Audit &amp; Recommendation</span>
                </div>

                <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                  {roadmap}
                </div>
              </div>

              {/* Citizen Security Notice */}
              <div className="p-3.5 bg-amber-50/90 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                <PhoneCall className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <strong>Official Government Advisory: </strong>
                  <span>
                    Applications can be filed online for ₹0 or in-person at your nearest Punjab Sewa Kendra. Dial <strong>1100</strong> for free citizen helpline guidance.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          {onOpenVoiceAssistant && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenVoiceAssistant();
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Ask Voice AI Assistant</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer ml-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
