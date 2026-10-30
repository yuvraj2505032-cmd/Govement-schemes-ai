import React from 'react';
import { Language } from '../types/scheme';
import { 
  ShieldAlert, 
  ShieldCheck, 
  X, 
  PhoneCall, 
  AlertTriangle, 
  ExternalLink, 
  Lock, 
  CheckCircle2, 
  XCircle,
  HelpCircle,
  FileWarning,
  Eye
} from 'lucide-react';

interface CyberFraudShieldModalProps {
  currentLang: Language;
  onClose: () => void;
}

export const CyberFraudShieldModal: React.FC<CyberFraudShieldModalProps> = ({
  currentLang,
  onClose
}) => {
  const scams = [
    {
      titleEn: 'Fake WhatsApp & Telegram Subsidy Links',
      titlePa: 'ਨਕਲੀ ਵਟਸਐਪ ਅਤੇ ਟੈਲੀਗ੍ਰਾਮ ਸਬਸਿਡੀ ਲਿੰਕ',
      titleHi: 'फर्जी व्हाट्सएप व टेलीग्राम सब्सिडी लिंक',
      fakeSample: 'pmkisan-direct-transfer2026.xyz / punjab-shagun-free.top',
      realPortal: 'pmkisan.gov.in / esewa.punjab.gov.in',
      warningEn: 'Never click on links received via WhatsApp or SMS ending in .xyz, .top, or .apk. Official government portals ONLY end in .gov.in or .nic.in.',
      warningPa: 'ਵਟਸਐਪ ਜਾਂ ਐਸ.ਐਮ.ਐਸ ਤੇ ਆਏ ਕਿਸੇ ਵੀ ਅਣਜਾਣ ਲਿੰਕ ਤੇ ਕਲਿੱਕ ਨਾ ਕਰੋ। ਸਰਕਾਰੀ ਪੋਰਟਲ ਸਿਰਫ਼ .gov.in ਜਾਂ .nic.in ਨਾਲ ਖਤਮ ਹੁੰਦੇ ਹਨ।',
      warningHi: 'व्हाट्सएप या मैसेज पर आए किसी भी अनजान लिंक पर क्लिक न करें। केवल .gov.in या .nic.in वाले पतों पर ही जाएं।'
    },
    {
      titleEn: 'Private Agents & Middlemen Demanding Cash Fees',
      titlePa: 'ਪ੍ਰਾਈਵੇਟ ਏਜੰਟਾਂ ਅਤੇ ਦਲਾਲਾਂ ਵੱਲੋਂ ਨਕਦੀ ਦੀ ਮੰਗ',
      titleHi: 'निजी दलालों द्वारा अवैध पैसे की मांग',
      fakeSample: 'Demanding ₹1,500 - ₹5,000 for "Quick Approval"',
      realPortal: 'Punjab Sewa Kendra fixed fee: ₹30 to ₹50 with official receipt',
      warningEn: 'Government welfare schemes in Punjab have NO commission or agent fee. If anyone demands a bribe, report directly to Anti-Corruption Helpline 95012-00200 or 1100.',
      warningPa: 'ਪੰਜਾਬ ਸਰਕਾਰ ਦੀਆਂ ਸਕੀਮਾਂ ਲਈ ਕੋਈ ਕਮਿਸ਼ਨ ਨਹੀਂ ਲੱਗਦਾ। ਜੇਕਰ ਕੋਈ ਰਿਸ਼ਵਤ ਮੰਗੇ ਤਾਂ 95012-00200 ਜਾਂ 1100 ਤੇ ਸ਼ਿਕਾਇਤ ਕਰੋ।',
      warningHi: 'सरकारी योजनाओं में कोई दलाली नहीं है। रिश्वत मांगने पर सीधे 95012-00200 या 1100 पर शिकायत करें।'
    },
    {
      titleEn: 'Fake OTP & Aadhaar Verification Phone Calls',
      titlePa: 'ਨਕਲੀ ਓ.ਟੀ.ਪੀ ਅਤੇ ਆਧਾਰ ਤਸਦੀਕ ਕਾਲਾਂ',
      titleHi: 'फर्जी ओटीपी व आधार सत्यापन फोन कॉल',
      fakeSample: '"I am speaking from DC Office / Bank. Share OTP to disburse ₹6,000"',
      realPortal: 'Govt officials NEVER ask for OTP, PIN, or CVV over the phone',
      warningEn: 'Direct Benefit Transfer (DBT) is deposited directly by the treasury into your Aadhaar-linked bank account. You NEVER need to give an OTP to receive money.',
      warningPa: 'ਸਰਕਾਰੀ ਪੈਸੇ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਕਦੇ ਵੀ ਕਿਸੇ ਨੂੰ ਓ.ਟੀ.ਪੀ (OTP) ਨਾ ਦੱਸੋ। ਸਰਕਾਰ ਕਦੇ ਵੀ ਫੋਨ ਤੇ ਓ.ਟੀ.ਪੀ ਨਹੀਂ ਮੰਗਦੀ।',
      warningHi: 'डीबीटी का पैसा खाते में आने के लिए कभी भी ओटीपी की जरूरत नहीं होती। किसी से ओटीपी साझा न करें।'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div 
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fraud-modal-title"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-950 via-red-900 to-amber-950 text-white p-5 sm:p-6 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-300 text-xs font-bold px-3 py-1 rounded-full border border-rose-400/30">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Innovative Feature 8 • Citizen Cyber Defense &amp; Anti-Fraud Protection</span>
            </div>
            <h2 id="fraud-modal-title" className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Official Government Fraud Alert &amp; Security Shield
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Protect your bank account, Aadhaar, and family savings from predatory online scams targeting rural citizens and scheme beneficiaries.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
            aria-label="Close fraud alert modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Emergency Helplines Callout */}
          <div className="bg-gradient-to-r from-red-50 to-amber-50 p-4 rounded-xl border border-red-200 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-red-900 uppercase tracking-wider">
                Emergency Citizen Grievance &amp; Cyber Helplines
              </span>
              <div className="text-xs sm:text-sm font-bold text-slate-900">
                Immediately report suspicious calls, unverified portals, or extortion:
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href="tel:1930"
                className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Cyber Helpline: 1930</span>
              </a>

              <a
                href="tel:1100"
                className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Punjab 1100</span>
              </a>
            </div>
          </div>

          {/* 3 Common Scams in Punjab */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <FileWarning className="w-4 h-4 text-rose-600" />
              <span>3 Most Common Scams Targeting Punjab Citizens</span>
            </h3>

            <div className="space-y-3">
              {scams.map((scam, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <h4 className="font-bold text-sm text-slate-900">
                    {idx + 1}. {currentLang === 'pa' ? scam.titlePa : currentLang === 'hi' ? scam.titleHi : scam.titleEn}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-red-100/70 border border-red-200 text-red-950 flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-[11px] uppercase text-red-800">Scammer Trick:</strong>
                        <span>{scam.fakeSample}</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-emerald-100/70 border border-emerald-200 text-emerald-950 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-[11px] uppercase text-emerald-800">Official Truth:</strong>
                        <span>{scam.realPortal}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 pt-1 leading-relaxed">
                    {currentLang === 'pa' ? scam.warningPa : currentLang === 'hi' ? scam.warningHi : scam.warningEn}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick 4-Step Citizen Safety Golden Rules */}
          <div className="p-4 bg-teal-50 rounded-xl border border-teal-200 space-y-2 text-xs text-teal-950">
            <h4 className="font-bold text-sm text-teal-950 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              <span>4 Golden Rules for Punjab Scheme Applicants</span>
            </h4>
            <ul className="space-y-1.5 list-disc list-inside text-teal-900 leading-relaxed">
              <li><strong>Always check for `.gov.in` or `.nic.in`</strong> in your browser address bar.</li>
              <li><strong>Zero application fees:</strong> Direct online portal applications are 100% free; Sewa Kendras charge only the government-printed receipt rate (₹30-₹50).</li>
              <li><strong>Never share bank OTPs or ATM PINs</strong> with any caller claiming to disburse benefits.</li>
              <li><strong>Aadhaar biometric locking:</strong> Lock your biometrics on the mAadhaar app when not visiting a Sewa Kendra.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 font-bold"
          >
            <span>Visit National Cybercrime Portal (cybercrime.gov.in)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors"
          >
            I Understand, Close Alert
          </button>
        </div>
      </div>
    </div>
  );
};
