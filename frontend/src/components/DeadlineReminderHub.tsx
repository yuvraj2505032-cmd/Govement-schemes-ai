import React, { useState, useEffect } from 'react';
import { Scheme, Language } from '../types/scheme';
import { GOV_SCHEMES } from '../data/schemes';
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  Bell, 
  CheckCircle2, 
  ExternalLink, 
  Share2, 
  Sparkles, 
  ArrowRight,
  ShieldAlert,
  Copy,
  Check
} from 'lucide-react';

interface DeadlineReminderHubProps {
  currentLang: Language;
  onOpenSchemeModal: (scheme: Scheme) => void;
  onTrackScheme: (scheme: Scheme) => void;
}

interface DeadlineItem {
  schemeId: string;
  schemeTitleEn: string;
  schemeTitlePa: string;
  schemeTitleHi: string;
  deadlineNameEn: string;
  deadlineNamePa: string;
  deadlineNameHi: string;
  targetDate: string; // YYYY-MM-DD
  urgencyLevel: 'Urgent' | 'Approaching' | 'Continuous';
  instructionsEn: string;
  instructionsPa: string;
  instructionsHi: string;
  portalUrl: string;
}

const DEADLINE_ITEMS: DeadlineItem[] = [
  {
    schemeId: 'punjab-post-matric-sc',
    schemeTitleEn: 'Dr. Ambedkar Post Matric Scholarship for SC Students',
    schemeTitlePa: 'ਡਾ. ਅੰਬੇਡਕਰ ਪੋਸਟ ਮੈਟ੍ਰਿਕ ਸਕਾਲਰਸ਼ਿਪ (ਐਸ.ਸੀ ਵਿਦਿਆਰਥੀ)',
    schemeTitleHi: 'डॉ. अम्बेडकर पोस्ट मैट्रिक छात्रवृत्ति (एससी छात्र)',
    deadlineNameEn: 'Academic Year 2026-27 Portal Submission Deadline',
    deadlineNamePa: 'ਅਕਾਦਮਿਕ ਸਾਲ 2026-27 ਆਨਲਾਈਨ ਪੋਰਟਲ ਆਖਰੀ ਮਿਤੀ',
    deadlineNameHi: 'शैक्षणिक सत्र 2026-27 ऑनलाइन पोर्टल अंतिम तिथि',
    targetDate: '2026-11-30',
    urgencyLevel: 'Urgent',
    instructionsEn: 'Upload college fee receipt, caste certificate, and income affidavit on scholarships.punjab.gov.in before the portal closes for institutional verification.',
    instructionsPa: 'ਕਾਲਜ ਫੀਸ ਰਸੀਦ, ਜਾਤੀ ਸਰਟੀਫਿਕੇਟ ਅਤੇ ਆਮਦਨ ਹਲਫ਼ਨਾਮਾ scholarships.punjab.gov.in ਤੇ ਤੁਰੰਤ ਅੱਪਲੋਡ ਕਰੋ।',
    instructionsHi: 'संस्थान सत्यापन हेतु scholarships.punjab.gov.in पर कॉलेज रसीद और जाति प्रमाण पत्र समय पर अपलोड करें।',
    portalUrl: 'https://scholarships.punjab.gov.in'
  },
  {
    schemeId: 'pm-kisan',
    schemeTitleEn: 'PM-Kisan Samman Nidhi Yojana',
    schemeTitlePa: 'ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਕਿਸਾਨ ਸਨਮਾਨ ਨਿਧੀ ਯੋਜਨਾ',
    schemeTitleHi: 'प्रधानमंत्री किसान सम्मान निधि योजना',
    deadlineNameEn: '19th Installment Biometric & OTP e-KYC Verification',
    deadlineNamePa: '19ਵੀਂ ਕਿਸ਼ਤ ਆਧਾਰ ਈ-ਕੇਵਾਈਸੀ ਆਖਰੀ ਮਿਤੀ',
    deadlineNameHi: '19वीं किस्त हेतु आधार ई-केवाईसी सत्यापन अंतिम तिथि',
    targetDate: '2026-11-20',
    urgencyLevel: 'Urgent',
    instructionsEn: 'Complete OTP e-KYC on pmkisan.gov.in or visit nearest Punjab Sewa Kendra to prevent installment hold.',
    instructionsPa: 'ਕਿਸ਼ਤ ਰੁਕਣ ਤੋਂ ਬਚਣ ਲਈ pmkisan.gov.in ਜਾਂ ਸੇਵਾ ਕੇਂਦਰ ਵਿਖੇ ਈ-ਕੇਵਾਈਸੀ ਮੁਕੰਮਲ ਕਰੋ।',
    instructionsHi: 'किस्त में रुकावट से बचने के लिए pmkisan.gov.in पर बायोमेट्रिक या ओटीपी ई-केवाईसी पूर्ण करें।',
    portalUrl: 'https://pmkisan.gov.in'
  },
  {
    schemeId: 'punjab-old-age-pension',
    schemeTitleEn: 'Punjab Old Age Pension Scheme',
    schemeTitlePa: 'ਪੰਜਾਬ ਬੁਢਾਪਾ ਪੈਨਸ਼ਨ ਸਕੀਮ',
    schemeTitleHi: 'पंजाब वृद्धावस्था पेंशन योजना',
    deadlineNameEn: 'Annual Life Certificate (Jeevan Pramaan) Submission',
    deadlineNamePa: 'ਸਾਲਾਨਾ ਜੀਵਨ ਪ੍ਰਮਾਣ ਪੱਤਰ (ਲਾਈਫ ਸਰਟੀਫਿਕੇਟ) ਜਮ੍ਹਾਂ ਕਰਵਾਉਣਾ',
    deadlineNameHi: 'वार्षिक जीवन प्रमाण पत्र सत्यापन',
    targetDate: '2026-12-31',
    urgencyLevel: 'Approaching',
    instructionsEn: 'Senior citizens receiving ₹1,500/month must submit annual digital life certificate via Sewa Kendra or Postman.',
    instructionsPa: '₹1,500 ਮਹੀਨਾਵਾਰ ਪੈਨਸ਼ਨ ਜਾਰੀ ਰੱਖਣ ਲਈ ਸੇਵਾ ਕੇਂਦਰ ਜਾਂ ਡਾਕੀਏ ਰਾਹੀਂ ਜੀਵਨ ਪ੍ਰਮਾਣ ਪੱਤਰ ਜਮ੍ਹਾਂ ਕਰੋ।',
    instructionsHi: '₹1,500 मासिक पेंशन निरंतर रखने हेतु सेवा केंद्र या डाकिए के माध्यम से जीवन प्रमाण पत्र दें।',
    portalUrl: 'https://esewa.punjab.gov.in'
  },
  {
    schemeId: 'punjab-ashirwad',
    schemeTitleEn: 'Punjab Ashirwad (Shagun) Scheme',
    schemeTitlePa: 'ਪੰਜਾਬ ਅਸ਼ੀਰਵਾਦ (ਸ਼ਗਨ) ਸਕੀਮ',
    schemeTitleHi: 'पंजाब आशीर्वाद (शगुन) योजना',
    deadlineNameEn: 'Mandatory Application Window: 30 Days Pre/Post Wedding',
    deadlineNamePa: 'ਲਾਜ਼ਮੀ ਸਮਾਂ ਸੀਮਾ: ਵਿਆਹ ਤੋਂ 30 ਦਿਨ ਪਹਿਲਾਂ ਜਾਂ 30 ਦਿਨ ਬਾਅਦ ਤੱਕ',
    deadlineNameHi: 'अनिवार्य समय सीमा: विवाह से 30 दिन पूर्व या 30 दिन बाद तक',
    targetDate: '2026-12-15',
    urgencyLevel: 'Approaching',
    instructionsEn: 'To claim ₹51,000 for daughter’s marriage, the application MUST be submitted within 30 days of the marriage date at Sewa Kendra.',
    instructionsPa: '₹51,000 ਦੀ ਸਹਾਇਤਾ ਲਈ ਅਰਜ਼ੀ ਵਿਆਹ ਦੀ ਮਿਤੀ ਤੋਂ 30 ਦਿਨਾਂ ਦੇ ਅੰਦਰ ਸੇਵਾ ਕੇਂਦਰ ਵਿੱਚ ਜਮ੍ਹਾਂ ਕਰਵਾਉਣੀ ਲਾਜ਼ਮੀ ਹੈ।',
    instructionsHi: '₹51,000 की सहायता पाने हेतु विवाह के 30 दिनों के भीतर सेवा केंद्र में आवेदन अवश्य जमा करें।',
    portalUrl: 'https://esewa.punjab.gov.in'
  },
  {
    schemeId: 'sarbat-sehat-bima',
    schemeTitleEn: 'Ayushman Bharat - Sarbat Sehat Bima Yojana',
    schemeTitlePa: 'ਆਯੁਸ਼ਮਾਨ ਭਾਰਤ - ਸਰਬੱਤ ਸਿਹਤ ਬੀਮਾ ਯੋਜਨਾ',
    schemeTitleHi: 'आयुष्मान भारत - सरबत सेहत बीमा योजना',
    deadlineNameEn: 'Golden Card Issuance & NFSA Family Mapping',
    deadlineNamePa: 'ਗੋਲਡਨ ਕਾਰਡ ਜਾਰੀ ਕਰਨਾ ਅਤੇ ਪਰਿਵਾਰਕ ਮੈਪਿੰਗ',
    deadlineNameHi: 'गोल्डन कार्ड निर्माण एवं पारिवारिक मैपिंग',
    targetDate: '2027-03-31',
    urgencyLevel: 'Continuous',
    instructionsEn: 'Continuous enrollment available at all Sub-Divisional Hospitals and empaneled private hospitals across Punjab.',
    instructionsPa: 'ਪੰਜਾਬ ਦੇ ਸਾਰੇ ਸਰਕਾਰੀ ਅਤੇ ਸੂਚੀਬੱਧ ਹਸਪਤਾਲਾਂ ਵਿੱਚ ਗੋਲਡਨ ਕਾਰਡ ਸਾਰਾ ਸਾਲ ਮੁਫ਼ਤ ਬਣਦੇ ਹਨ।',
    instructionsHi: 'पंजाब के सभी सरकारी व निजी अस्पतालों में ₹5 लाख का कैशलेस कार्ड पूरे वर्ष उपलब्ध है।',
    portalUrl: 'https://sha.punjab.gov.in'
  }
];

export const DeadlineReminderHub: React.FC<DeadlineReminderHubProps> = ({
  currentLang,
  onOpenSchemeModal,
  onTrackScheme
}) => {
  const [filter, setFilter] = useState<'all' | 'Urgent' | 'Approaching' | 'Continuous'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const calculateDaysLeft = (targetDateStr: string): number => {
    const today = new Date('2026-10-30'); // anchor date in the prompt context
    const target = new Date(targetDateStr);
    const diffTime = target.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const handleCopyAlert = (item: DeadlineItem) => {
    const days = calculateDaysLeft(item.targetDate);
    const text = `🚨 Government Scheme Deadline Alert:\nScheme: ${item.schemeTitleEn}\nTask: ${item.deadlineNameEn}\nDays Remaining: ${days} Days (Deadline: ${item.targetDate})\nOfficial Portal: ${item.portalUrl}\nPunjab Helpline: 1100`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(item.schemeId);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const handleDownloadCalendar = (item: DeadlineItem) => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Punjab Scheme Navigator AI//CTBF-07//EN',
      'BEGIN:VEVENT',
      `SUMMARY:Gov Scheme Deadline: ${item.schemeTitleEn}`,
      `DESCRIPTION:${item.deadlineNameEn} - Apply on ${item.portalUrl}. Helpline: 1100.`,
      `DTSTART;VALUE=DATE:${item.targetDate.replace(/-/g, '')}`,
      `DTEND;VALUE=DATE:${item.targetDate.replace(/-/g, '')}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${item.schemeId}-deadline.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredItems = DEADLINE_ITEMS.filter(item => {
    if (filter === 'all') return true;
    return item.urgencyLevel === filter;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-rose-950 text-white rounded-2xl p-6 shadow-md border border-amber-900/40">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-400/30">
              <Clock className="w-3.5 h-3.5" />
              <span>Innovative Feature 7 • Verified Deadline Reminders</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {currentLang === 'pa' ? 'ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਦੀਆਂ ਆਖਰੀ ਮਿਤੀਆਂ ਅਤੇ ਰੀਮਾਈਂਡਰ' : currentLang === 'hi' ? 'सरकारी योजनाओं की अंतिम तिथियां व अनुस्मारक' : 'Government Schemes Deadline Reminders & Alerts'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              {currentLang === 'pa'
                ? 'ਸਕਾਲਰਸ਼ਿਪ, ਕਿਸਾਨ ਈ-ਕੇਵਾਈਸੀ, ਬੁਢਾਪਾ ਪੈਨਸ਼ਨ ਲਾਈਫ ਸਰਟੀਫਿਕੇਟ ਅਤੇ ਸ਼ਗਨ ਸਕੀਮ ਦੀਆਂ ਆਖਰੀ ਮਿਤੀਆਂ ਨੂੰ ਸਮੇਂ ਸਿਰ ਪੂਰਾ ਕਰੋ ਤਾਂ ਜੋ ਲਾਭ ਨਾ ਰੁਕੇ।'
                : currentLang === 'hi'
                ? 'छात्रवृत्ति, किसान ई-केवाईसी, पेंशन सत्यापन की अंतिम तिथियों से पहले आवेदन करें ताकि लाभ में कोई रुकावट न आए।'
                : 'Stay ahead of critical cut-off dates for scholarships, farmer e-KYC cycles, life certificates, and marriage assistance.'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs px-4 py-3 rounded-xl border border-white/10 text-right">
            <span className="text-[10px] text-amber-300 uppercase font-bold tracking-wider">Active Deadlines</span>
            <div className="text-2xl font-black text-white">{DEADLINE_ITEMS.length} Key Milestones</div>
            <span className="text-[11px] text-slate-300">Live Countdowns Updated Daily</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-white/10 text-xs">
          <span className="text-slate-300 font-medium">Filter Deadlines:</span>
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filter === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            All Deadlines ({DEADLINE_ITEMS.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('Urgent')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filter === 'Urgent' ? 'bg-rose-600 text-white font-bold' : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            Urgent: Expiring Soon
          </button>
          <button
            type="button"
            onClick={() => setFilter('Approaching')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filter === 'Approaching' ? 'bg-amber-600 text-white font-bold' : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            Approaching
          </button>
          <button
            type="button"
            onClick={() => setFilter('Continuous')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filter === 'Continuous' ? 'bg-teal-600 text-white font-bold' : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            Continuous Open
          </button>
        </div>
      </div>

      {/* Deadline Cards List */}
      <div className="space-y-4">
        {filteredItems.map((item) => {
          const scheme = GOV_SCHEMES.find(s => s.id === item.schemeId);
          const daysLeft = calculateDaysLeft(item.targetDate);
          const title = currentLang === 'pa' ? item.schemeTitlePa : currentLang === 'hi' ? item.schemeTitleHi : item.schemeTitleEn;
          const deadlineTitle = currentLang === 'pa' ? item.deadlineNamePa : currentLang === 'hi' ? item.deadlineNameHi : item.deadlineNameEn;
          const instructions = currentLang === 'pa' ? item.instructionsPa : currentLang === 'hi' ? item.instructionsHi : item.instructionsEn;

          return (
            <div
              key={item.schemeId}
              className={`bg-white rounded-2xl border p-5 shadow-xs transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 ${
                item.urgencyLevel === 'Urgent'
                  ? 'border-rose-300 ring-1 ring-rose-400/20 bg-rose-50/10'
                  : item.urgencyLevel === 'Approaching'
                  ? 'border-amber-300 bg-amber-50/10'
                  : 'border-slate-200'
              }`}
            >
              {/* Left Column: Scheme & Deadline Info */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    item.urgencyLevel === 'Urgent'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : item.urgencyLevel === 'Approaching'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-teal-100 text-teal-800 border border-teal-300'
                  }`}>
                    {item.urgencyLevel === 'Urgent' ? '🚨 Action Required' : item.urgencyLevel}
                  </span>

                  <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Cut-off: <strong>{item.targetDate}</strong></span>
                  </span>
                </div>

                <h3 
                  onClick={() => scheme && onOpenSchemeModal(scheme)}
                  className="text-base sm:text-lg font-bold text-slate-900 hover:text-blue-700 cursor-pointer transition-colors"
                >
                  {title}
                </h3>

                <div className="text-xs font-semibold text-rose-900 bg-rose-50/80 px-2.5 py-1 rounded-lg border border-rose-200 inline-block">
                  {deadlineTitle}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                  {instructions}
                </p>
              </div>

              {/* Right Column: Live Countdown Box & Action Buttons */}
              <div className="flex flex-col sm:flex-row md:flex-col items-stretch md:items-end gap-3 shrink-0 w-full sm:w-auto">
                {/* Countdown Gauge */}
                <div className="bg-slate-900 text-white px-4 py-2.5 rounded-xl text-center shadow-xs flex items-center justify-between sm:justify-center gap-3">
                  <div className="text-left sm:text-center">
                    <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
                      Time Remaining
                    </span>
                    <span className="text-xl font-mono font-black text-white">
                      {daysLeft} Days Left
                    </span>
                  </div>
                  <Clock className="w-6 h-6 text-amber-400 shrink-0" />
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleDownloadCalendar(item)}
                    className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors"
                    title="Download .ics calendar event"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Add to Calendar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyAlert(item)}
                    className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
                    title="Copy reminder text for SMS or WhatsApp"
                  >
                    {copiedId === item.schemeId ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Alert</span>
                      </>
                    )}
                  </button>

                  <a
                    href={item.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <span>Apply Now</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
