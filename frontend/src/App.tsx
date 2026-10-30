import React, { useState, useEffect, useRef } from 'react';
import type { User } from '@supabase/supabase-js';
import { 
  Language, 
  CitizenProfile, 
  Scheme, 
  ApplicationTrackerItem, 
  EligibilityEvaluation 
} from './types/scheme';
import { GOV_SCHEMES } from './data/schemes';
import { TRANSLATIONS } from './data/translations';
import { evaluateAllSchemes } from './utils/schemeEngine';

// Components
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProfileWizard } from './components/ProfileWizard';
import { SchemeCard } from './components/SchemeCard';
import { SchemeDetailModal } from './components/SchemeDetailModal';
import { ChatbotDrawer } from './components/ChatbotDrawer';
import { FamilyBenefitFinder } from './components/FamilyBenefitFinder';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { DocumentCenter } from './components/DocumentCenter';
import { DistrictPortalFinder } from './components/DistrictPortalFinder';
import { ApplicationTracker } from './components/ApplicationTracker';
import { FraudProtectionBanner } from './components/FraudProtectionBanner';
import { VideoGuidesHub } from './components/VideoGuidesHub';
import { DocumentScannerModal } from './components/DocumentScannerModal';
import { DeadlineReminderHub } from './components/DeadlineReminderHub';
import { CyberFraudShieldModal } from './components/CyberFraudShieldModal';
import { DashboardInsights } from './components/DashboardInsights';
import { ViewAllDocumentsModal } from './components/ViewAllDocumentsModal';
import { AiSchemeAdvisorModal } from './components/AiSchemeAdvisorModal';
import { AiProfileRoadmapModal } from './components/AiProfileRoadmapModal';
import { supabase, supabaseConfigurationError } from './lib/supabase';
import { loadCitizenCloudData, parseSavedSchemeIds, parseTrackedItems, saveCitizenCloudData } from './lib/citizenCloudSync';

import { 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  Building2, 
  Users, 
  HelpCircle, 
  PhoneCall, 
  ExternalLink, 
  ShieldCheck,
  SearchX,
  Bookmark,
  BookmarkCheck,
  Trash2,
  Youtube,
  Scan,
  Clock,
  ShieldAlert,
  Calendar,
  PieChart as PieIcon,
  Bot
} from 'lucide-react';

const DEFAULT_PROFILE: CitizenProfile = {
  age: 38,
  gender: 'Male',
  occupation: 'Farmer',
  annualIncome: 120000,
  category: 'SC',
  district: 'Ludhiana',
  isPunjabDomicile: true,
  landholdingAcres: 3,
  hasDisability: false,
  isWidowOrDestitute: false,
  isEnrolledInSchoolOrCollege: false
};

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [onlyEligibleFilter, setOnlyEligibleFilter] = useState(false);

  const [profile, setProfile] = useState<CitizenProfile>(DEFAULT_PROFILE);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [dataOwnerId, setDataOwnerId] = useState<string | null | undefined>(undefined);
  const [cloudSyncStatus, setCloudSyncStatus] = useState('Cloud sync is not active.');
  const importLocalDataOnSignIn = useRef(false);
  const hadActiveCloudAccount = useRef(false);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);

  // Modal states for new innovative features
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannerTargetScheme, setScannerTargetScheme] = useState<Scheme | null>(null);
  const [isFraudModalOpen, setIsFraudModalOpen] = useState(false);
  const [videoTutorialSchemeId, setVideoTutorialSchemeId] = useState<string>('pm-kisan');
  const [showDashboardInsights, setShowDashboardInsights] = useState(true);
  const [selectedSchemeModalTab, setSelectedSchemeModalTab] = useState<'overview' | 'eligibility' | 'documents' | 'steps' | 'tutorial'>('overview');
  const [schemeForDocumentsModal, setSchemeForDocumentsModal] = useState<Scheme | null>(null);
  const [aiAdvisorScheme, setAiAdvisorScheme] = useState<Scheme | null>(null);
  const [isAiRoadmapOpen, setIsAiRoadmapOpen] = useState<boolean>(false);

  // Saved schemes storage
  const [savedSchemeIds, setSavedSchemeIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('punjab_saved_schemes');
      if (saved) return parseSavedSchemeIds(JSON.parse(saved));
    } catch (e) {
      console.warn('Could not read saved schemes from localStorage', e);
    }
    return new Set<string>(['pm-kisan', 'sarbat-sehat-bima']);
  });

  // Application tracker storage
  const [trackedItems, setTrackedItems] = useState<ApplicationTrackerItem[]>(() => {
    try {
      const saved = localStorage.getItem('punjab_tracked_schemes');
      if (saved) return parseTrackedItems(JSON.parse(saved));
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
    return [
      {
        id: 'track-default-1',
        schemeId: 'pm-kisan',
        schemeTitle: 'PM-Kisan Samman Nidhi Yojana',
        dateStarted: '2026-10-15',
        status: 'Documents Assembled',
        applicationRefNumber: 'PB-PMK-2026-88192'
      },
      {
        id: 'track-default-2',
        schemeId: 'sarbat-sehat-bima',
        schemeTitle: 'Ayushman Bharat - Sarbat Sehat Bima Yojana',
        dateStarted: '2026-10-20',
        status: 'Approved',
        applicationRefNumber: 'SHA-PB-774012'
      }
    ];
  });

  // Smart document owned keys
  const [userOwnedDocs, setUserOwnedDocs] = useState<Set<string>>(() => {
    return new Set<string>([
      'aadhaar card linked with mobile',
      'punjab residence / domicile certificate',
      'active bank passbook (npci mapped)'
    ]);
  });

  useEffect(() => {
    if (!supabase) {
      setAuthReady(true);
      return;
    }

    let active = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setAuthUser(session?.user ?? null);
      setAuthReady(true);
    });

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) {
        console.error('Could not restore Supabase session:', error);
        setCloudSyncStatus(`Authentication error: ${error.message}`);
      }
      setAuthUser(data.session?.user ?? null);
      setAuthReady(true);
    }).catch((error: unknown) => {
      if (!active) return;
      console.error('Could not restore Supabase session:', error);
      setCloudSyncStatus(error instanceof Error ? error.message : 'Could not restore Supabase session.');
      setAuthReady(true);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!authReady) return;

    if (!authUser) {
      if (hadActiveCloudAccount.current) {
        setSavedSchemeIds(new Set(['pm-kisan', 'sarbat-sehat-bima']));
        setTrackedItems([]);
      }
      hadActiveCloudAccount.current = false;
      try {
        const savedSchemes = localStorage.getItem('punjab_saved_schemes');
        const trackedSchemes = localStorage.getItem('punjab_tracked_schemes');
        if (savedSchemes) setSavedSchemeIds(parseSavedSchemeIds(JSON.parse(savedSchemes)));
        if (trackedSchemes) setTrackedItems(parseTrackedItems(JSON.parse(trackedSchemes)));
      } catch (error) {
        console.error('Could not restore local scheme data:', error);
        setCloudSyncStatus('Could not load this device’s saved scheme data.');
      }
      setDataOwnerId(null);
      setCloudSyncStatus('Changes save on this device. Sign in to enable cloud sync.');
      return;
    }

    if (!supabase) return;
    let active = true;
    hadActiveCloudAccount.current = true;
    setDataOwnerId(undefined);
    setSavedSchemeIds(new Set());
    setTrackedItems([]);
    setCloudSyncStatus('Loading your account data…');

    loadCitizenCloudData(authUser.id).then(({ savedSchemeIds: cloudSaved, trackedItems: cloudTracked, hasCloudRecord }) => {
      if (!active) return;
      if (!hasCloudRecord && importLocalDataOnSignIn.current) {
        const localSaved = localStorage.getItem('punjab_saved_schemes');
        const localTracked = localStorage.getItem('punjab_tracked_schemes');
        const migratedSaved = localSaved ? parseSavedSchemeIds(JSON.parse(localSaved)) : cloudSaved;
        const migratedTracked = localTracked
          ? parseTrackedItems(JSON.parse(localTracked)).filter(item => !item.id.startsWith('track-default-'))
          : cloudTracked;
        setSavedSchemeIds(migratedSaved);
        setTrackedItems(migratedTracked);
      } else if (hasCloudRecord) {
        setSavedSchemeIds(cloudSaved);
        setTrackedItems(cloudTracked);
      } else {
        setSavedSchemeIds(new Set());
        setTrackedItems([]);
      }
      importLocalDataOnSignIn.current = false;
      setDataOwnerId(authUser.id);
      setCloudSyncStatus(hasCloudRecord
        ? 'Cloud data is up to date.'
        : 'First-time local data sync is complete.');
    }).catch((error: unknown) => {
      if (!active) return;
      console.error('Could not load Supabase app data:', error);
      setCloudSyncStatus(error instanceof Error ? error.message : 'Could not load cloud data.');
    });

    return () => {
      active = false;
    };
  }, [authReady, authUser?.id]);

  // Keep the signed-in account's cache separate from guest data on shared devices.
  useEffect(() => {
    const ownerId = authUser?.id ?? null;
    if (!authReady || dataOwnerId !== ownerId) return;

    const savedKey = ownerId ? `punjab_saved_schemes:${ownerId}` : 'punjab_saved_schemes';
    const trackedKey = ownerId ? `punjab_tracked_schemes:${ownerId}` : 'punjab_tracked_schemes';
    try {
      localStorage.setItem(trackedKey, JSON.stringify(trackedItems));
      localStorage.setItem(savedKey, JSON.stringify(Array.from(savedSchemeIds)));
    } catch (error) {
      console.error('Could not cache scheme data on this device:', error);
      setCloudSyncStatus('Could not save your local cache.');
    }

    if (!authUser || !supabase) return;
    setCloudSyncStatus('Syncing changes…');
    const timeout = window.setTimeout(() => {
      saveCitizenCloudData(authUser.id, savedSchemeIds, trackedItems).then(() => {
        setCloudSyncStatus('Cloud data is up to date.');
      }).catch((error: unknown) => {
        console.error('Could not sync Supabase app data:', error);
        setCloudSyncStatus(error instanceof Error ? error.message : 'Could not sync cloud data.');
      });
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [authReady, dataOwnerId, authUser?.id, savedSchemeIds, trackedItems]);

  const handleSignIn = async (email: string, password: string, importLocalData: boolean) => {
    if (!supabase) return { error: supabaseConfigurationError || 'Supabase is not configured.' };
    importLocalDataOnSignIn.current = importLocalData;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? { error: error.message } : {};
  };

  const handleSignUp = async (email: string, password: string, importLocalData: boolean) => {
    if (!supabase) return { error: supabaseConfigurationError || 'Supabase is not configured.' };
    importLocalDataOnSignIn.current = importLocalData;
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    if (!data.session) {
      return { notice: 'Check your email to confirm your account, then sign in.' };
    }
    return {};
  };

  const handleSignOut = async () => {
    if (!supabase) return supabaseConfigurationError || 'Supabase is not configured.';
    const { error } = await supabase.auth.signOut();
    return error?.message ?? null;
  };

  const handleToggleSave = (scheme: Scheme) => {
    setSavedSchemeIds(prev => {
      const next = new Set(prev);
      if (next.has(scheme.id)) {
        next.delete(scheme.id);
      } else {
        next.add(scheme.id);
      }
      return next;
    });
  };

  const handleClearSaved = () => {
    setSavedSchemeIds(new Set());
  };

  const t = TRANSLATIONS[currentLang];

  // Evaluate profile against all schemes
  const evaluations = evaluateAllSchemes(profile, GOV_SCHEMES);
  const evaluationMap = new Map<string, EligibilityEvaluation>();
  evaluations.forEach(e => evaluationMap.set(e.schemeId, e));

  const eligibleCount = evaluations.filter(e => e.isEligible).length;
  const potentialCount = evaluations.filter(e => e.isPotentialMatch).length;

  // Filter schemes based on search query and category tags
  const filteredSchemes = GOV_SCHEMES.filter(scheme => {
    // Search filter
    const matchesSearch = !searchQuery || 
      scheme.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.titlePa.includes(searchQuery) ||
      scheme.titleHi.includes(searchQuery) ||
      scheme.descriptionEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.categoryTags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    // Category filter
    let matchesCategory = true;
    if (activeCategoryFilter !== 'all') {
      if (activeCategoryFilter === 'Saved') {
        matchesCategory = savedSchemeIds.has(scheme.id);
      } else if (activeCategoryFilter === 'BPL') {
        matchesCategory = (scheme.maxIncome !== undefined && scheme.maxIncome <= 180000) || scheme.categoryTags.includes('BPL Families');
      } else if (activeCategoryFilter === 'Loans') {
        matchesCategory = scheme.benefitType === 'Loan/Credit' || scheme.categoryTags.includes('Subsidized Finance');
      } else {
        matchesCategory = scheme.categoryTags.some(tag => tag.toLowerCase().includes(activeCategoryFilter.toLowerCase()));
      }
    }

    // Only confirmed eligible filter from search bar
    if (onlyEligibleFilter) {
      const evaluation = evaluationMap.get(scheme.id);
      if (!evaluation?.isEligible) {
        return false;
      }
    }

    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    // Confirmed matches first
    const aEval = evaluationMap.get(a.id);
    const bEval = evaluationMap.get(b.id);
    const aScore = aEval?.isEligible ? 2 : aEval?.isPotentialMatch ? 1 : 0;
    const bScore = bEval?.isEligible ? 2 : bEval?.isPotentialMatch ? 1 : 0;
    if (bScore !== aScore) return bScore - aScore;
    return (bEval?.matchPercentage || 0) - (aEval?.matchPercentage || 0);
  });

  const handleTrackScheme = (scheme: Scheme) => {
    const existing = trackedItems.find(item => item.schemeId === scheme.id);
    if (!existing) {
      const newItem: ApplicationTrackerItem = {
        id: `track-${Date.now()}`,
        schemeId: scheme.id,
        schemeTitle: scheme.titleEn,
        dateStarted: new Date().toISOString().split('T')[0],
        status: 'Discovered'
      };
      setTrackedItems(prev => [newItem, ...prev]);
    }
  };

  const handleAddTrackedSchemeById = (schemeId: string) => {
    const scheme = GOV_SCHEMES.find(s => s.id === schemeId);
    if (scheme) {
      handleTrackScheme(scheme);
    }
  };

  const handleUpdateStatus = (id: string, status: ApplicationTrackerItem['status']) => {
    setTrackedItems(prev => prev.map(item => item.id === id ? { ...item, status } : item));
  };

  const handleUpdateRefNumber = (id: string, refNumber: string) => {
    setTrackedItems(prev => prev.map(item => item.id === id ? { ...item, applicationRefNumber: refNumber } : item));
  };

  const handleRemoveTrackedItem = (id: string) => {
    setTrackedItems(prev => prev.filter(item => item.id !== id));
  };

  const handleToggleDoc = (docKey: string) => {
    setUserOwnedDocs(prev => {
      const next = new Set(prev);
      const lowerKey = docKey.toLowerCase();
      if (next.has(lowerKey)) {
        next.delete(lowerKey);
      } else {
        next.add(lowerKey);
      }
      return next;
    });
  };

  const handleAddOwnedDoc = (docKey: string) => {
    setUserOwnedDocs(prev => new Set(prev).add(docKey.toLowerCase()));
  };

  const handleRemoveOwnedDoc = (docKey: string) => {
    setUserOwnedDocs(prev => {
      const next = new Set(prev);
      next.delete(docKey.toLowerCase());
      return next;
    });
  };

  const handleOpenTutorial = (scheme: Scheme) => {
    setVideoTutorialSchemeId(scheme.id);
    setActiveTab('video-guides');
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const handleOpenScanner = (scheme?: Scheme) => {
    setScannerTargetScheme(scheme || null);
    setIsScannerOpen(true);
  };

  const handleOpenSchemeDetails = (
    scheme: Scheme, 
    initialTab: 'overview' | 'eligibility' | 'documents' | 'steps' | 'tutorial' = 'overview'
  ) => {
    setSelectedScheme(scheme);
    setSelectedSchemeModalTab(initialTab);
  };

  const handleOpenAllDocuments = (scheme: Scheme) => {
    setSchemeForDocumentsModal(scheme);
  };

  // Get saved schemes
  const savedSchemes = GOV_SCHEMES.filter(s => savedSchemeIds.has(s.id));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-teal-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        savedCount={savedSchemeIds.size}
        cloudAccount={{
          configured: Boolean(supabase),
          configurationError: supabaseConfigurationError,
          userEmail: authUser?.email ?? null,
          syncStatus: cloudSyncStatus,
          onSignIn: handleSignIn,
          onSignUp: handleSignUp,
          onSignOut: handleSignOut
        }}
      />

      {/* Hero Section */}
      <HeroBanner
        currentLang={currentLang}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onStartWizard={() => {
          setActiveTab('wizard');
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }}
        onOpenFamilyFinder={() => setActiveTab('family')}
        activeFilter={activeCategoryFilter}
        onFilterChange={setActiveCategoryFilter}
        totalSchemesCount={GOV_SCHEMES.length}
        savedCount={savedSchemeIds.size}
        profile={profile}
        onProfileChange={setProfile}
        onlyEligibleFilter={onlyEligibleFilter}
        onToggleOnlyEligible={setOnlyEligibleFilter}
        eligibleCount={eligibleCount}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        {/* Fraud Protection Safety Alert Banner */}
        <FraudProtectionBanner currentLang={currentLang} />

        {/* Quick Innovation Action Bar for Hackathon Judges & Citizens */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 mb-6">
          <button
            type="button"
            onClick={() => {
              setActiveTab('insights');
              window.scrollTo({ top: 350, behavior: 'smooth' });
            }}
            className="p-3 bg-white hover:bg-teal-50/60 rounded-xl border border-slate-200 hover:border-teal-300 text-left transition-all shadow-2xs group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">Analytics</span>
              <PieIcon className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xs font-bold text-slate-900 line-clamp-1">
              Dashboard Insights
            </div>
            <div className="text-[10px] text-slate-500">
              Pie chart &amp; category split
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('video-guides');
              window.scrollTo({ top: 350, behavior: 'smooth' });
            }}
            className="p-3 bg-white hover:bg-rose-50/60 rounded-xl border border-slate-200 hover:border-rose-300 text-left transition-all shadow-2xs group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">Video Guide</span>
              <Youtube className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xs font-bold text-slate-900 line-clamp-1">
              YouTube Tutorials
            </div>
            <div className="text-[10px] text-slate-500">
              How to apply on .gov.in
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleOpenScanner()}
            className="p-3 bg-white hover:bg-emerald-50/60 rounded-xl border border-slate-200 hover:border-emerald-300 text-left transition-all shadow-2xs group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">AI Scanner</span>
              <Scan className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xs font-bold text-slate-900 line-clamp-1">
              Missing Doc Detector
            </div>
            <div className="text-[10px] text-slate-500">
              Scan &amp; verify certificates
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('deadlines');
              window.scrollTo({ top: 350, behavior: 'smooth' });
            }}
            className="p-3 bg-white hover:bg-amber-50/60 rounded-xl border border-slate-200 hover:border-amber-300 text-left transition-all shadow-2xs group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Countdowns</span>
              <Clock className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xs font-bold text-slate-900 line-clamp-1">
              Deadline Reminders
            </div>
            <div className="text-[10px] text-slate-500">
              e-KYC &amp; cut-off alerts
            </div>
          </button>

          <button
            type="button"
            onClick={() => setIsFraudModalOpen(true)}
            className="p-3 bg-white hover:bg-red-50/60 rounded-xl border border-slate-200 hover:border-red-300 text-left transition-all shadow-2xs group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider">Anti-Scam</span>
              <ShieldAlert className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xs font-bold text-slate-900 line-clamp-1">
              Cyber Fraud Shield
            </div>
            <div className="text-[10px] text-slate-500">
              Fake link check &amp; 1930
            </div>
          </button>
        </div>

        {/* TAB: DASHBOARD & SCHEME DIRECTORY */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Quick Profile Summary Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  {profile.occupation[0]}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Active Citizen Profile: {profile.occupation} • Age {profile.age} • {profile.category} • {profile.district}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Household Income: ₹{profile.annualIncome.toLocaleString('en-IN')}/yr • Land: {profile.landholdingAcres} Acres
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  {eligibleCount} Confirmed Matches
                </span>
                <button
                  type="button"
                  onClick={() => setIsAiRoadmapOpen(true)}
                  className="text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200 border border-amber-300 px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-300" />
                  <span>AI Welfare Roadmap</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowDashboardInsights(!showDashboardInsights)}
                  className="text-xs font-bold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  <PieIcon className="w-3.5 h-3.5" />
                  <span>{showDashboardInsights ? 'Hide Insights' : 'View Insights'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('wizard')}
                  className="text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Dashboard Insights Section with Recharts Pie Chart */}
            {showDashboardInsights && (
              <DashboardInsights
                schemes={GOV_SCHEMES}
                evaluations={evaluations}
                profile={profile}
                currentLang={currentLang}
                onSelectCategory={(cat) => {
                  setActiveCategoryFilter(cat);
                }}
                onOpenScheme={(s) => handleOpenSchemeDetails(s, 'overview')}
              />
            )}

            {/* Scheme Cards Grid */}
            <div className="flex items-center justify-between pb-1">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                Government Welfare Schemes ({filteredSchemes.length})
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                Sorted by Eligibility Match Percentage
              </span>
            </div>

            {filteredSchemes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredSchemes.map((scheme) => (
                  <SchemeCard
                    key={scheme.id}
                    scheme={scheme}
                    evaluation={evaluationMap.get(scheme.id)}
                    currentLang={currentLang}
                    onOpenDetails={(s, tab) => handleOpenSchemeDetails(s, tab)}
                    onOpenAllDocuments={handleOpenAllDocuments}
                    onOpenAiAdvisor={(s) => setAiAdvisorScheme(s)}
                    onOpenTutorial={(s) => handleOpenTutorial(s)}
                    onOpenScanner={(s) => handleOpenScanner(s)}
                    isSaved={savedSchemeIds.has(scheme.id)}
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
                <SearchX className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="font-bold text-slate-800">No schemes matched your search criteria</h3>
                <p className="text-xs text-slate-500">
                  Try adjusting the search query or switching the category filter back to "All Schemes".
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategoryFilter('all');
                  }}
                  className="text-xs font-bold text-blue-700 underline mt-2"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB: ELIGIBILITY WIZARD */}
        {activeTab === 'wizard' && (
          <div className="space-y-6">
            <ProfileWizard
              currentLang={currentLang}
              profile={profile}
              onChange={setProfile}
              onReset={() => setProfile(DEFAULT_PROFILE)}
              onApply={() => {
                setActiveTab('dashboard');
                window.scrollTo({ top: 350, behavior: 'smooth' });
              }}
              onOpenAiRoadmap={() => setIsAiRoadmapOpen(true)}
              eligibleCount={eligibleCount}
              potentialCount={potentialCount}
            />

            {/* Real-time Eligible Schemes Preview */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                Instant Matching Results for this Profile ({evaluations.filter(e => e.isEligible || e.isPotentialMatch).length} Schemes)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {evaluations
                  .filter(e => e.isEligible || e.isPotentialMatch)
                  .map(evalItem => (
                    <SchemeCard
                      key={evalItem.schemeId}
                      scheme={evalItem.scheme}
                      evaluation={evalItem}
                      currentLang={currentLang}
                      onOpenDetails={(s, tab) => handleOpenSchemeDetails(s, tab)}
                      onOpenAllDocuments={handleOpenAllDocuments}
                      onOpenAiAdvisor={(s) => setAiAdvisorScheme(s)}
                      onOpenTutorial={(s) => handleOpenTutorial(s)}
                      onOpenScanner={(s) => handleOpenScanner(s)}
                      isSaved={savedSchemeIds.has(evalItem.scheme.id)}
                      onToggleSave={handleToggleSave}
                    />
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: DASHBOARD INSIGHTS */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            <DashboardInsights
              schemes={GOV_SCHEMES}
              evaluations={evaluations}
              profile={profile}
              currentLang={currentLang}
              onSelectCategory={(cat) => {
                setActiveCategoryFilter(cat);
                setActiveTab('dashboard');
              }}
              onOpenScheme={(s) => handleOpenSchemeDetails(s, 'overview')}
            />
          </div>
        )}

        {/* TAB: SAVED SCHEMES */}
        {activeTab === 'saved' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-teal-900 text-white rounded-2xl p-6 shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-300/30">
                    <Bookmark className="w-3.5 h-3.5 fill-amber-300" />
                    <span>Personal Scheme Vault</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    {t.tabSaved} ({savedSchemeIds.size})
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                    Review and compare the welfare schemes you have bookmarked. Add them to your Application Journey Tracker when you are ready to apply.
                  </p>
                </div>

                {savedSchemeIds.size > 0 && (
                  <button
                    type="button"
                    onClick={handleClearSaved}
                    className="flex items-center gap-1.5 text-xs font-semibold bg-white/10 hover:bg-rose-500/20 text-slate-200 hover:text-rose-200 border border-white/20 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All Saved</span>
                  </button>
                )}
              </div>
            </div>

            {savedSchemes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {savedSchemes.map((scheme) => (
                  <SchemeCard
                    key={scheme.id}
                    scheme={scheme}
                    evaluation={evaluationMap.get(scheme.id)}
                    currentLang={currentLang}
                    onOpenDetails={(s, tab) => handleOpenSchemeDetails(s, tab)}
                    onOpenAllDocuments={handleOpenAllDocuments}
                    onOpenAiAdvisor={(s) => setAiAdvisorScheme(s)}
                    onOpenTutorial={(s) => handleOpenTutorial(s)}
                    onOpenScanner={(s) => handleOpenScanner(s)}
                    isSaved={true}
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
                <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-bold text-base text-slate-800">{t.noSavedSchemes}</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {t.noSavedSchemesDesc}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className="mt-3 inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <span>Browse Schemes Directory</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB: YOUTUBE VIDEO GUIDES */}
        {activeTab === 'video-guides' && (
          <VideoGuidesHub
            currentLang={currentLang}
            initialSchemeId={videoTutorialSchemeId}
            onSelectScheme={(s) => setSelectedScheme(s)}
            onTrackScheme={handleTrackScheme}
            onOpenScannerForScheme={(s) => handleOpenScanner(s)}
          />
        )}

        {/* TAB: AI DOCUMENT SCANNER & DETECTOR */}
        {activeTab === 'scanner' && (
          <div className="space-y-6">
            <DocumentCenter
              currentLang={currentLang}
              evaluations={evaluations}
              userOwnedDocs={userOwnedDocs}
              onToggleDoc={handleToggleDoc}
              onOpenScanner={() => handleOpenScanner()}
            />
          </div>
        )}

        {/* TAB: FAMILY BENEFIT FINDER */}
        {activeTab === 'family' && (
          <FamilyBenefitFinder
            currentLang={currentLang}
            baseProfile={profile}
            onOpenSchemeModal={(s) => setSelectedScheme(s)}
          />
        )}

        {/* TAB: WHAT-IF SIMULATOR */}
        {activeTab === 'whatif' && (
          <WhatIfSimulator
            currentLang={currentLang}
            baseProfile={profile}
            onOpenSchemeModal={(s) => setSelectedScheme(s)}
          />
        )}

        {/* TAB: DISTRICT SEWA KENDRAS */}
        {activeTab === 'districts' && (
          <DistrictPortalFinder
            currentLang={currentLang}
            selectedDistrictName={profile.district}
            onSelectDistrict={(districtName) => setProfile(prev => ({ ...prev, district: districtName }))}
            onOpenSchemeModal={(s) => setSelectedScheme(s)}
          />
        )}

        {/* TAB: DEADLINE REMINDERS */}
        {activeTab === 'deadlines' && (
          <DeadlineReminderHub
            currentLang={currentLang}
            onOpenSchemeModal={(s) => setSelectedScheme(s)}
            onTrackScheme={handleTrackScheme}
          />
        )}

        {/* TAB: APPLICATION TRACKER */}
        {activeTab === 'tracker' && (
          <ApplicationTracker
            currentLang={currentLang}
            trackedItems={trackedItems}
            onUpdateStatus={handleUpdateStatus}
            onUpdateRefNumber={handleUpdateRefNumber}
            onRemoveItem={handleRemoveTrackedItem}
            onOpenSchemeModal={(s) => setSelectedScheme(s)}
            onAddTrackedScheme={handleAddTrackedSchemeById}
          />
        )}

        {/* TAB: CYBER FRAUD SHIELD */}
        {activeTab === 'fraud-shield' && (
          <div className="space-y-6">
            <CyberFraudShieldModal
              currentLang={currentLang}
              onClose={() => setActiveTab('dashboard')}
            />
          </div>
        )}
      </main>

      {/* Scheme Detail & Application Modal */}
      {selectedScheme && (
        <SchemeDetailModal
          scheme={selectedScheme}
          evaluation={evaluationMap.get(selectedScheme.id)}
          currentLang={currentLang}
          initialTab={selectedSchemeModalTab}
          onClose={() => setSelectedScheme(null)}
          onTrackScheme={handleTrackScheme}
          isAlreadyTracked={trackedItems.some(i => i.schemeId === selectedScheme.id)}
          isSaved={savedSchemeIds.has(selectedScheme.id)}
          onToggleSave={handleToggleSave}
          onOpenAiAdvisor={(s) => {
            setSelectedScheme(null);
            setAiAdvisorScheme(s);
          }}
        />
      )}

      {/* View All Documents Dedicated Popup Modal */}
      {schemeForDocumentsModal && (
        <ViewAllDocumentsModal
          scheme={schemeForDocumentsModal}
          currentLang={currentLang}
          onClose={() => setSchemeForDocumentsModal(null)}
          onOpenFullDetails={(s) => {
            setSchemeForDocumentsModal(null);
            handleOpenSchemeDetails(s, 'overview');
          }}
        />
      )}

      {/* Gemini 3.8 Flash Per-Scheme AI Advisor Modal */}
      {aiAdvisorScheme && (
        <AiSchemeAdvisorModal
          scheme={aiAdvisorScheme}
          profile={profile}
          currentLang={currentLang}
          onClose={() => setAiAdvisorScheme(null)}
          onOpenVoiceAssistant={() => {
            setAiAdvisorScheme(null);
            setIsVoiceAssistantOpen(true);
          }}
        />
      )}

      {/* Gemini 3.8 Flash Full Profile AI Welfare Roadmap Modal */}
      {isAiRoadmapOpen && (
        <AiProfileRoadmapModal
          profile={profile}
          currentLang={currentLang}
          onClose={() => setIsAiRoadmapOpen(false)}
          onOpenVoiceAssistant={() => {
            setIsAiRoadmapOpen(false);
            setIsVoiceAssistantOpen(true);
          }}
        />
      )}

      {/* Interactive AI Document Scanner & Missing Doc Detector Modal */}
      {isScannerOpen && (
        <DocumentScannerModal
          currentLang={currentLang}
          onClose={() => setIsScannerOpen(false)}
          targetScheme={scannerTargetScheme}
          userOwnedDocs={userOwnedDocs}
          onAddOwnedDoc={handleAddOwnedDoc}
          onRemoveOwnedDoc={handleRemoveOwnedDoc}
        />
      )}

      {/* Cyber Fraud Shield Modal */}
      {isFraudModalOpen && (
        <CyberFraudShieldModal
          currentLang={currentLang}
          onClose={() => setIsFraudModalOpen(false)}
        />
      )}

      {/* AI Voice Assistant & Chatbot Drawer */}
      <ChatbotDrawer
        isOpen={isVoiceAssistantOpen}
        onClose={() => setIsVoiceAssistantOpen(false)}
        currentLang={currentLang}
        userProfile={profile}
        onOpenSchemeModal={(s) => {
          setIsVoiceAssistantOpen(false);
          setSelectedScheme(s);
        }}
      />

      {!isVoiceAssistantOpen && (
        <button
          type="button"
          onClick={() => setIsVoiceAssistantOpen(true)}
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-blue-800 px-4 py-3 text-sm font-bold text-white shadow-xl shadow-blue-900/25 transition hover:bg-blue-900 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-300"
          aria-label="Open Voice AI in Punjabi or English"
        >
          <Bot className="h-5 w-5" aria-hidden="true" />
          <span>Voice AI (ਪੰਜਾਬੀ / English)</span>
        </button>
      )}

      {/* Official Government Footer */}
      <footer className="bg-slate-900 text-slate-300 text-xs py-8 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-6 border-b border-slate-800">
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-500 text-white flex items-center justify-center font-bold text-xs">
                  PB
                </div>
                <span className="font-extrabold text-white text-sm">
                  {t.appTitle} (CTBF-AI-07)
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-md">
                An intelligent e-governance decision support system built for CT BuildFest 2.0 to empower citizens of Punjab in discovering, verifying, and claiming their statutory government welfare entitlements.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-teal-400 font-semibold pt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero Private Brokerage • 100% Free Public Good</span>
              </div>
            </div>

            <div>
              <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-2">
                Key Citizen Portals
              </h5>
              <ul className="space-y-1.5 text-slate-400">
                <li><a href="https://punjab.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">punjab.gov.in (Official Govt)</a></li>
                <li><a href="https://esewa.punjab.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">esewa.punjab.gov.in (Sewa Kendra)</a></li>
                <li><a href="https://myscheme.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">myscheme.gov.in (National Portal)</a></li>
                <li><a href="https://sha.punjab.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">sha.punjab.gov.in (Ayushman Sehat)</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-2">
                Government Helplines
              </h5>
              <ul className="space-y-1.5 text-slate-400">
                <li>Citizen Grievance: <strong className="text-white">1100</strong></li>
                <li>National Cyber Crime: <strong className="text-white">1930</strong></li>
                <li>Women in Distress: <strong className="text-white">1091</strong></li>
                <li>Childline Helpline: <strong className="text-white">1098</strong></li>
                <li>Kisan Call Center: <strong className="text-white">1800-180-1551</strong></li>
              </ul>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
            <span>© 2026 Government Scheme Eligibility Navigator • Developed for CT BuildFest 2.0</span>
            <span>All official citations sourced directly from gazetted government notifications</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
