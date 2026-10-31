import React, { useState } from 'react';
import { Scheme, Language } from '../types/scheme';
import { GOV_SCHEMES } from '../data/schemes';
import { getSchemeVideoIds } from '../data/schemeVideos';
import { 
  Youtube, 
  Play, 
  ExternalLink, 
  CheckCircle2, 
  FileText, 
  Search, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  BookOpen,
  Sparkles,
  Share2,
  Bookmark
} from 'lucide-react';

interface VideoGuidesHubProps {
  currentLang: Language;
  onSelectScheme: (scheme: Scheme) => void;
  onTrackScheme: (scheme: Scheme) => void;
  onOpenScannerForScheme?: (scheme: Scheme) => void;
  initialSchemeId?: string;
}

export const VideoGuidesHub: React.FC<VideoGuidesHubProps> = ({
  currentLang,
  onSelectScheme,
  onTrackScheme,
  onOpenScannerForScheme,
  initialSchemeId
}) => {
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(
    initialSchemeId || 'pm-kisan'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);

  const selectedScheme = GOV_SCHEMES.find(s => s.id === selectedSchemeId) || GOV_SCHEMES[0];

  const categories = [
    { id: 'all', label: currentLang === 'pa' ? 'ਸਾਰੀਆਂ ਵੀਡੀਓਜ਼' : currentLang === 'hi' ? 'सभी वीडियो' : 'All Tutorials' },
    { id: 'Farmers', label: currentLang === 'pa' ? 'ਕਿਸਾਨ' : currentLang === 'hi' ? 'किसान' : 'Farmers' },
    { id: 'Students', label: currentLang === 'pa' ? 'ਵਿਦਿਆਰਥੀ' : currentLang === 'hi' ? 'छात्र' : 'Students' },
    { id: 'Women', label: currentLang === 'pa' ? 'ਔਰਤਾਂ' : currentLang === 'hi' ? 'महिलाएं' : 'Women & Girls' },
    { id: 'Healthcare', label: currentLang === 'pa' ? 'ਸਿਹਤ' : currentLang === 'hi' ? 'स्वास्थ्य' : 'Healthcare' },
    { id: 'Senior Citizens', label: currentLang === 'pa' ? 'ਬਜ਼ੁਰਗ' : currentLang === 'hi' ? 'वरिष्ठ नागरिक' : 'Senior Citizens' },
  ];

  const filteredSchemes = GOV_SCHEMES.filter(s => {
    const title = (currentLang === 'pa' ? s.titlePa : currentLang === 'hi' ? s.titleHi : s.titleEn).toLowerCase();
    const videoTitle = s.youtubeVideoTitle.toLowerCase();
    const matchesSearch = title.includes(searchQuery.toLowerCase()) || videoTitle.includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || s.categoryTags.some(tag => tag.toLowerCase().includes(selectedCategory.toLowerCase()));
    return matchesSearch && matchesCat;
  });

  const title = currentLang === 'pa' ? selectedScheme.titlePa : currentLang === 'hi' ? selectedScheme.titleHi : selectedScheme.titleEn;
  const department = currentLang === 'pa' ? selectedScheme.departmentPa : currentLang === 'hi' ? selectedScheme.departmentHi : selectedScheme.departmentEn;

  // Curated chapters for video demonstration
  const videoChapters = [
    { time: '00:00', titleEn: 'Official Portal Verification & Login', titlePa: 'ਸਰਕਾਰੀ ਪੋਰਟਲ ਜਾਂਚ ਅਤੇ ਲੌਗਇਨ', titleHi: 'आधिकारिक पोर्टल सत्यापन एवं लॉगिन' },
    { time: '01:20', titleEn: 'Citizen Registration & Aadhaar e-KYC', titlePa: 'ਨਾਗਰਿਕ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਅਤੇ ਆਧਾਰ ਈ-ਕੇਵਾਈਸੀ', titleHi: 'नागरिक पंजीकरण एवं आधार ई-केवाईसी' },
    { time: '03:15', titleEn: 'Uploading Documents & Income Details', titlePa: 'ਦਸਤਾਵੇਜ਼ ਅਤੇ ਆਮਦਨ ਵੇਰਵੇ ਅੱਪਲੋਡ ਕਰਨਾ', titleHi: 'दस्तावेज एवं आय विवरण अपलोड करना' },
    { time: '05:00', titleEn: 'Final Review & Acknowledgement Slip', titlePa: 'ਅੰਤਿਮ ਜਾਂਚ ਅਤੇ ਰਸੀਦ ਪ੍ਰਾਪਤੀ', titleHi: 'अंतिम समीक्षा एवं पावती रसीद' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-red-900/40">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-300 text-xs font-bold px-3 py-1 rounded-full border border-rose-400/30">
              <Youtube className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
              <span>Official Video Guides • Step-by-Step Portal Walkthroughs</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {currentLang === 'pa' ? 'ਸਰਕਾਰੀ ਸਕੀਮ ਆਨਲਾਈਨ ਅਪਲਾਈ ਵੀਡੀਓ ਗਾਈਡ' : currentLang === 'hi' ? 'सरकारी योजना ऑनलाइन आवेदन वीडियो गाइड' : 'How-To-Apply YouTube Video Application Guides'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              {currentLang === 'pa' 
                ? 'ਪੰਜਾਬ ਸਰਕਾਰ ਅਤੇ ਕੇਂਦਰ ਸਰਕਾਰ ਦੇ ਅਧਿਕਾਰਤ ਪੋਰਟਲਾਂ (.gov.in) ਤੇ ਅਰਜ਼ੀ ਦੇਣ ਦਾ ਕਦਮ-ਦਰ-ਕਦਮ ਪ੍ਰਮਾਣਿਤ ਤਰੀਕਾ ਦੇਖੋ।'
                : currentLang === 'hi'
                ? 'पंजाब सरकार एवं केंद्र सरकार के आधिकारिक पोर्टल्स (.gov.in) पर आवेदन करने का चरणबद्ध सत्यापित वीडियो ट्यूटोरियल।'
                : 'Watch verified step-by-step video tutorials demonstrating registration, e-KYC, and document submission on official .gov.in portals.'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs px-4 py-3 rounded-xl border border-white/10 text-right">
            <span className="text-[10px] text-rose-300 uppercase font-bold tracking-wider">Video Tutorials</span>
            <div className="text-2xl font-black text-white">{GOV_SCHEMES.length} Verified Guides</div>
            <span className="text-[11px] text-slate-300">100% Free • Official Portals Only</span>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={currentLang === 'pa' ? 'ਵੀਡੀਓ ਟਿਊਟੋਰੀਅਲ ਖੋਜੋ...' : currentLang === 'hi' ? 'वीडियो ट्यूटोरियल खोजें...' : 'Search scheme video tutorial...'}
              className="w-full bg-slate-800/80 border border-slate-700 text-white placeholder-slate-400 text-xs sm:text-sm pl-9 pr-3 py-2 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Video Guide Spotlight View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Active Video Player & Walkthrough */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            {/* Player Container */}
            <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
              {isPlaying ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${getSchemeVideoIds(selectedScheme.id)[0]}?autoplay=1&rel=0`}
                  title={`${title} application video tutorial`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-gradient-to-t from-slate-950 via-slate-900/90 to-slate-900/60">
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    <Youtube className="w-3.5 h-3.5 fill-white" />
                    <span>Official Guide</span>
                  </div>

                  <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-xs text-slate-200 text-xs px-2.5 py-1 rounded-md border border-white/10 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-rose-400" />
                    <span>6:45 mins</span>
                  </div>

                  {/* Play Button Trigger */}
                  <button
                    type="button"
                    onClick={() => setIsPlaying(true)}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all mb-4 group cursor-pointer"
                    aria-label="Play video tutorial"
                  >
                    <Play className="w-8 h-8 fill-white ml-1 text-white group-hover:scale-110 transition-transform" />
                  </button>

                  <h3 className="text-base sm:text-xl font-extrabold text-white max-w-xl leading-snug">
                    {selectedScheme.youtubeVideoTitle}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-md">
                    {title} • {department}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPlaying(true)}
                      className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-all flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Start Video Tutorial</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Video Details & Quick Actions Bar */}
            <div className="p-5 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {selectedScheme.level}
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Benefit: {selectedScheme.benefitAmountText}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {department}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={selectedScheme.officialPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-colors"
                  >
                    <span>Open Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {onOpenScannerForScheme && (
                    <button
                      type="button"
                      onClick={() => onOpenScannerForScheme(selectedScheme)}
                      className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-300 text-xs font-bold px-3 py-2 rounded-xl transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                      <span>Scan Documents</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onTrackScheme(selectedScheme)}
                    className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Track Scheme</span>
                  </button>
                </div>
              </div>

              {/* Video Chapters / Interactive Timeline */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Tutorial Chapters &amp; Key Moments:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {videoChapters.map((chap, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setActiveChapter(idx);
                        setIsPlaying(true);
                      }}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-2 ${
                        activeChapter === idx
                          ? 'bg-rose-50 border-rose-300 text-rose-950 font-bold'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="bg-rose-600 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md">
                          {chap.time}
                        </span>
                        <span className="line-clamp-1">
                          {currentLang === 'pa' ? chap.titlePa : currentLang === 'hi' ? chap.titleHi : chap.titleEn}
                        </span>
                      </div>
                      <Play className="w-3 h-3 text-slate-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Required Documents Checklist for this Video */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-700" />
                <span>Documents Needed Before Applying</span>
              </h4>
              <span className="text-[11px] font-semibold text-slate-500">
                {selectedScheme.requiredDocuments.length} Required
              </span>
            </div>

            <div className="space-y-2.5">
              {selectedScheme.requiredDocuments.map((doc, idx) => {
                const docName = currentLang === 'pa' ? doc.namePa : currentLang === 'hi' ? doc.nameHi : doc.nameEn;
                return (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-900">
                        {docName}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Issuing: <strong className="text-slate-700">{doc.issuingAuthority}</strong>
                      </div>
                      {doc.availableOnDigiLocker && (
                        <span className="inline-block mt-1 bg-blue-100 text-blue-800 text-[9px] font-bold px-1.5 py-0.2 rounded-md">
                          Available on DigiLocker
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Official Portal Assurance */}
            <div className="p-3.5 bg-gradient-to-tr from-teal-50 to-emerald-50 rounded-xl border border-teal-200 text-xs text-teal-900 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-teal-950">
                <ShieldCheck className="w-4 h-4 text-teal-700" />
                <span>Zero Broker Commission Warning</span>
              </div>
              <p className="text-[11px] text-teal-800 leading-relaxed">
                As shown in the video tutorial, government registration on <strong>{selectedScheme.officialPortalName}</strong> is 100% free of charge. Do not pay middlemen.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Other Video Guides to Browse */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
            <Youtube className="w-5 h-5 text-rose-600" />
            <span>More Punjab &amp; Central Scheme Video Guides ({filteredSchemes.length})</span>
          </h3>
          <span className="text-xs text-slate-500">
            Click any tutorial to play above
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredSchemes.map((scheme) => {
            const isCurrent = scheme.id === selectedSchemeId;
            const cardTitle = currentLang === 'pa' ? scheme.titlePa : currentLang === 'hi' ? scheme.titleHi : scheme.titleEn;

            return (
              <div
                key={scheme.id}
                onClick={() => {
                  setSelectedSchemeId(scheme.id);
                  setIsPlaying(false);
                  window.scrollTo({ top: 350, behavior: 'smooth' });
                }}
                className={`group bg-white rounded-2xl border p-4 cursor-pointer transition-all hover:shadow-md flex flex-col justify-between ${
                  isCurrent
                    ? 'border-rose-400 ring-2 ring-rose-300/40 bg-rose-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="relative aspect-video rounded-xl bg-slate-900 flex items-center justify-center overflow-hidden mb-3 group-hover:opacity-95">
                    <div className="w-10 h-10 rounded-full bg-rose-600/90 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                      <Play className="w-5 h-5 fill-white ml-0.5 text-white" />
                    </div>
                    <span className="absolute bottom-2 right-2 bg-slate-950/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded-md">
                      6:30
                    </span>
                    <span className="absolute top-2 left-2 bg-blue-700/80 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-md">
                      {scheme.level === 'Punjab State' ? 'Punjab' : 'Central'}
                    </span>
                  </div>

                  <h5 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 group-hover:text-rose-700 transition-colors">
                    {scheme.youtubeVideoTitle}
                  </h5>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                    {cardTitle}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-teal-700 font-semibold truncate max-w-[140px]">
                    {scheme.benefitAmountText}
                  </span>
                  <span className="text-rose-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    <span>Watch</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
