import React, { useState, useEffect, useRef } from 'react';
import type { User } from '@supabase/supabase-js';
import { 
  Language, 
  CitizenProfile, 
  Scheme, 
  ApplicationTrackerItem, 
  EligibilityEvaluation,
  ManagedOfficialSite
} from './types/scheme';
import { GOV_SCHEMES } from './data/schemes';
import { TRANSLATIONS } from './data/translations';
import { evaluateAllSchemes } from './utils/schemeEngine';
import { matchesSchemeSearch } from './utils/schemeSearch';

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
import { AdminConsole } from './components/AdminConsole';
import { supabase, supabaseConfigurationError } from './lib/supabase';
import { loadCitizenCloudData, parseCitizenProfile, parseSavedSchemeIds, parseTrackedItems, saveCitizenCloudData } from './lib/citizenCloudSync';
import { createLocalAccount, restoreLocalAccount, signInLocalAccount, signOutLocalAccount } from './lib/localAuth';
import type { LocalAccount } from './lib/localAuth';

import { 
  ShieldCheck,
  SearchX,
  Bookmark,
  Trash2,
  Mic,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';

const DEFAULT_PROFILE: CitizenProfile = {
  username: '',
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

function getPreferredLanguage(): Language {
  try {
    const savedLanguage = localStorage.getItem('janshayak_language');
    return savedLanguage === 'pa' || savedLanguage === 'hi' ? savedLanguage : 'en';
  } catch (error) {
    console.warn('Could not restore the preferred language:', error);
    return 'en';
  }
}

function loadStoredProfile(key: string): CitizenProfile | null {
  try {
    const stored = localStorage.getItem(key);
    return stored ? parseCitizenProfile(JSON.parse(stored)) : null;
  } catch (error) {
    console.warn(`Could not restore profile from ${key}:`, error);
    return null;
  }
}

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>(getPreferredLanguage);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');

  const [profile, setProfile] = useState<CitizenProfile>(() => loadStoredProfile('janshayak_profile') ?? DEFAULT_PROFILE);
  const [managedSites, setManagedSites] = useState<ManagedOfficialSite[]>([]);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [localAccount, setLocalAccount] = useState<LocalAccount | null>(null);
  const [localAuthReady, setLocalAuthReady] = useState(false);
  const [localAuthError, setLocalAuthError] = useState<string | null>(null);
  const [dataOwnerId, setDataOwnerId] = useState<string | null | undefined>(undefined);
  const [cloudSyncStatus, setCloudSyncStatus] = useState('Cloud sync is not active.');
  const importLocalDataOnSignIn = useRef(false);
  const importLocalDataOnLocalSignUp = useRef(false);
  const hadActiveCloudAccount = useRef(false);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [assistantInitialQuestion, setAssistantInitialQuestion] = useState('');
  const hasWelcomedOnLoad = useRef(false);

  const handleLanguageChange = (language: Language) => {
    setCurrentLang(language);
    try {
      localStorage.setItem('janshayak_language', language);
    } catch (error) {
      console.warn('Could not save the preferred language:', error);
    }
  };

  useEffect(() => {
    if (hasWelcomedOnLoad.current || !('speechSynthesis' in window)) return;
    const greetings: Record<Language, { text: string; locale: string }> = {
      en: { text: 'Hello! Welcome to Jansahayak AI. How can I help you today?', locale: 'en-IN' },
      pa: { text: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ! ਜਨਸਹਾਇਕ AI ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?', locale: 'pa-IN' },
      hi: { text: 'नमस्ते! जनसहायक AI में आपका स्वागत है। आज मैं आपकी कैसे मदद कर सकता हूँ?', locale: 'hi-IN' }
    };

    const timeout = window.setTimeout(() => {
      if (hasWelcomedOnLoad.current) return;
      hasWelcomedOnLoad.current = true;

      const greeting = greetings[currentLang];
      const utterance = new SpeechSynthesisUtterance(greeting.text);
      utterance.lang = greeting.locale;
      utterance.rate = 0.95;

      const voices = window.speechSynthesis.getVoices();
      const languagePrefix = greeting.locale.split('-')[0].toLowerCase();
      const voice = voices.find(candidate => candidate.lang.toLowerCase() === greeting.locale.toLowerCase())
        ?? voices.find(candidate => candidate.lang.toLowerCase().startsWith(`${languagePrefix}-`));
      if (voice) utterance.voice = voice;

      window.speechSynthesis.speak(utterance);
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [currentLang]);

  // Modal states for new innovative features
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannerTargetScheme, setScannerTargetScheme] = useState<Scheme | null>(null);
  const [isFraudModalOpen, setIsFraudModalOpen] = useState(false);
  const [videoTutorialSchemeId, setVideoTutorialSchemeId] = useState<string>('pm-kisan');
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
    try {
      setLocalAccount(restoreLocalAccount());
    } catch (error) {
      console.error('Could not restore local account:', error);
      setLocalAuthError(error instanceof Error ? error.message : 'Could not restore the local account.');
    } finally {
      setLocalAuthReady(true);
    }
  }, []);

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
    if (!authReady || !localAuthReady) return;

    if (!authUser && localAccount) {
      const ownerId = `local-${localAccount.id}`;
      hadActiveCloudAccount.current = false;
      try {
        const savedSchemes = localStorage.getItem(`punjab_saved_schemes:${ownerId}`);
        const trackedSchemes = localStorage.getItem(`punjab_tracked_schemes:${ownerId}`);
        const savedProfile = loadStoredProfile(`janshayak_profile:${ownerId}`);
        const importGuestData = importLocalDataOnLocalSignUp.current;
        const guestSavedSchemes = importGuestData ? localStorage.getItem('punjab_saved_schemes') : null;
        const guestTrackedSchemes = importGuestData ? localStorage.getItem('punjab_tracked_schemes') : null;
        setSavedSchemeIds(savedSchemes
          ? parseSavedSchemeIds(JSON.parse(savedSchemes))
          : guestSavedSchemes
            ? parseSavedSchemeIds(JSON.parse(guestSavedSchemes))
            : new Set());
        setTrackedItems(trackedSchemes
          ? parseTrackedItems(JSON.parse(trackedSchemes))
          : guestTrackedSchemes
            ? parseTrackedItems(JSON.parse(guestTrackedSchemes)).filter(item => !item.id.startsWith('track-default-'))
            : []);
        setProfile(savedProfile ?? (importGuestData ? loadStoredProfile('janshayak_profile') : null) ?? DEFAULT_PROFILE);
        importLocalDataOnLocalSignUp.current = false;
        setDataOwnerId(ownerId);
        setCloudSyncStatus('This account is saved on this device only. It does not sync to the cloud.');
      } catch (error) {
        console.error('Could not load local account data:', error);
        setCloudSyncStatus(error instanceof Error ? error.message : 'Could not load local account data.');
      }
      return;
    }

    if (!authUser) {
      if (hadActiveCloudAccount.current) {
        setSavedSchemeIds(new Set(['pm-kisan', 'sarbat-sehat-bima']));
        setTrackedItems([]);
      }
      setProfile(loadStoredProfile('janshayak_profile') ?? DEFAULT_PROFILE);
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
    setProfile(DEFAULT_PROFILE);
    setSavedSchemeIds(new Set());
    setTrackedItems([]);
    setCloudSyncStatus('Loading your account data…');

    loadCitizenCloudData(authUser.id).then(({ savedSchemeIds: cloudSaved, trackedItems: cloudTracked, profile: cloudProfile, hasCloudRecord }) => {
      if (!active) return;
      const cachedProfile = loadStoredProfile(`janshayak_profile:${authUser.id}`);
      const importedProfile = !hasCloudRecord && importLocalDataOnSignIn.current
        ? loadStoredProfile('janshayak_profile')
        : null;
      setProfile(cloudProfile ?? importedProfile ?? cachedProfile ?? DEFAULT_PROFILE);
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
  }, [authReady, localAuthReady, authUser?.id, localAccount?.id]);

  // Keep the signed-in account's cache separate from guest data on shared devices.
  useEffect(() => {
    const ownerId = authUser?.id ?? (localAccount ? `local-${localAccount.id}` : null);
    if (!authReady || !localAuthReady || dataOwnerId !== ownerId) return;

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
      saveCitizenCloudData(authUser.id, savedSchemeIds, trackedItems, profile).then(() => {
        setCloudSyncStatus('Cloud data is up to date.');
      }).catch((error: unknown) => {
        console.error('Could not sync Supabase app data:', error);
        setCloudSyncStatus(error instanceof Error ? error.message : 'Could not sync cloud data.');
      });
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [authReady, localAuthReady, dataOwnerId, authUser?.id, localAccount?.id, savedSchemeIds, trackedItems, profile]);

  useEffect(() => {
    const ownerId = authUser?.id ?? (localAccount ? `local-${localAccount.id}` : null);
    if (!authReady || !localAuthReady || dataOwnerId !== ownerId) return;
    try {
      localStorage.setItem(ownerId ? `janshayak_profile:${ownerId}` : 'janshayak_profile', JSON.stringify(profile));
    } catch (error) {
      console.error('Could not cache citizen profile on this device:', error);
      setCloudSyncStatus('Could not save your profile on this device.');
    }
  }, [authReady, localAuthReady, dataOwnerId, authUser?.id, localAccount?.id, profile]);

  useEffect(() => {
    if (!supabase) {
      setManagedSites([]);
      return;
    }
    let active = true;
    supabase
      .from('managed_official_sites')
      .select('id, title, url, description, category, created_at')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          console.error('Could not load admin-added official scheme sites:', error);
          return;
        }
        setManagedSites((data ?? []).map(site => ({
          id: site.id,
          title: site.title,
          url: site.url,
          description: site.description,
          category: site.category,
          createdAt: site.created_at
        })));
      });
    return () => {
      active = false;
    };
  }, []);

  const handleSignIn = async (email: string, password: string, importLocalData: boolean) => {
    if (!supabase) return { error: supabaseConfigurationError || 'Supabase is not configured.' };
    importLocalDataOnSignIn.current = importLocalData;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && localAccount) {
      signOutLocalAccount();
      setLocalAccount(null);
    }
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
    if (localAccount) {
      signOutLocalAccount();
      setLocalAccount(null);
    }
    return {};
  };

  const handleLocalSignIn = async (email: string, password: string) => {
    const account = await signInLocalAccount(email, password);
    if (authUser && supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        signOutLocalAccount();
        return { error: `Could not switch accounts: ${error.message}` };
      }
    }
    setLocalAccount(account);
    return {};
  };

  const handleLocalSignUp = async (email: string, password: string, importLocalData: boolean) => {
    const account = await createLocalAccount(email, password);
    if (authUser && supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        signOutLocalAccount();
        return { error: `Could not switch accounts: ${error.message}` };
      }
    }
    importLocalDataOnLocalSignUp.current = importLocalData;
    setLocalAccount(account);
    return {};
  };

  const handleSignOut = async () => {
    if (localAccount) {
      signOutLocalAccount();
      setLocalAccount(null);
      return null;
    }
    if (!supabase) return supabaseConfigurationError || 'Supabase is not configured.';
    const { error } = await supabase.auth.signOut();
    return error?.message ?? null;
  };

  const handleSaveProfile = async () => {
    const ownerId = authUser?.id ?? (localAccount ? `local-${localAccount.id}` : null);
    if (!authReady || dataOwnerId !== ownerId) {
      throw new Error('Your account data is still loading. Please try again in a moment.');
    }

    const profileKey = ownerId ? `janshayak_profile:${ownerId}` : 'janshayak_profile';
    try {
      localStorage.setItem(profileKey, JSON.stringify(profile));
    } catch (error) {
      console.error('Could not save citizen profile on this device:', error);
      throw new Error('Could not save the profile on this device. Check available storage and try again.');
    }

    if (authUser) {
      if (!supabase) throw new Error(supabaseConfigurationError || 'Supabase is not configured.');
      setCloudSyncStatus('Saving your profile to Supabase…');
      try {
        const { error: metadataError } = await supabase.auth.updateUser({
          data: { username: profile.username.trim() }
        });
        if (metadataError) throw metadataError;
        await saveCitizenCloudData(authUser.id, savedSchemeIds, trackedItems, profile);
      } catch (error) {
        console.error('Could not save citizen profile to Supabase:', error);
        setCloudSyncStatus(error instanceof Error ? error.message : 'Could not save profile to Supabase.');
        throw new Error('The profile is saved on this device, but cloud sync failed. Check your connection and Supabase setup.');
      }
      setCloudSyncStatus('Your profile is saved and synced to Supabase.');
      return;
    }

    setCloudSyncStatus('Your profile is saved on this device. Sign in to sync it with Supabase.');
  };

  const handleSetPassword = async (password: string) => {
    if (!authUser || !supabase) {
      throw new Error('Sign in to your account before setting a password.');
    }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      console.error('Could not update Supabase account password:', error);
      throw new Error(error.message);
    }
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
    const matchesSearch = matchesSchemeSearch(scheme, searchQuery);

    // Category filter
    let matchesCategory = true;
    if (activeCategoryFilter !== 'all') {
      if (activeCategoryFilter === 'Saved') {
        matchesCategory = savedSchemeIds.has(scheme.id);
      } else {
        const categoryText = [
          ...scheme.categoryTags,
          scheme.titleEn,
          scheme.descriptionEn,
          scheme.benefitAmountText,
          scheme.benefitType,
          scheme.departmentEn,
          ...(scheme.eligibleOccupations ?? []),
        ].join(' ').toLowerCase();
        const categoryTerms: Record<string, RegExp> = {
          Agriculture: /farm|agri|crop|kisan|dairy|livestock|seed|irrigat/,
          Health: /health|medical|hospital|treatment|medicine|care|insurance/,
          Education: /education|student|scholarship|school|college|learning|tuition|girl child/,
        };
        if (activeCategoryFilter === 'Finance') {
          const financeText = [scheme.categoryTags.join(' '), scheme.benefitType, scheme.benefitAmountText].join(' ').toLowerCase();
          matchesCategory = scheme.benefitType !== 'Health Cover' && /finance|loan|credit|pension|subsidy|financial|saving|direct cash transfer|cash transfer|allowance|wage/.test(financeText);
        } else {
          matchesCategory = categoryTerms[activeCategoryFilter]?.test(categoryText)
            ?? scheme.categoryTags.some(tag => tag.toLowerCase().includes(activeCategoryFilter.toLowerCase()));
        }
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
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900 selection:bg-blue-100 selection:text-slate-900">
      {/* Top Navbar */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        savedCount={savedSchemeIds.size}
        cloudAccount={{
          configured: Boolean(supabase),
          configurationError: supabaseConfigurationError,
          userEmail: authUser?.email ?? null,
          localUserEmail: localAccount?.email ?? null,
          localAuthError,
          syncStatus: cloudSyncStatus,
          onSignIn: handleSignIn,
          onSignUp: handleSignUp,
          onLocalSignIn: handleLocalSignIn,
          onLocalSignUp: handleLocalSignUp,
          onSignOut: handleSignOut
        }}
      />

      {activeTab === 'dashboard' && (
        <HeroBanner
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onStartWizard={() => setActiveTab('wizard')}
          onOpenFamilyFinder={() => setActiveTab('family')}
          activeFilter={activeCategoryFilter}
          onFilterChange={setActiveCategoryFilter}
          onAskAI={() => {
            setAssistantInitialQuestion(searchQuery.trim());
            setIsVoiceAssistantOpen(true);
          }}
        />
      )}

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10">

        {/* TAB: DASHBOARD & SCHEME DIRECTORY */}
        {activeTab === 'dashboard' && (
          <div className="space-y-5">
            {/* Scheme Cards Grid */}
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                  Explore government schemes
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Discover benefits and support matched to your needs.
                </p>
              </div>
              <span className="text-sm font-medium text-slate-500">
                {filteredSchemes.length} {filteredSchemes.length === 1 ? 'scheme' : 'schemes'}
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

            {managedSites.length > 0 && (
              <section className="space-y-4 pt-5">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-slate-900">More official scheme portals</h2>
                  <p className="mt-1 text-sm text-slate-500">Official resources added by authorized administrators.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {managedSites.map(site => (
                    <article key={site.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">{site.category}</p>
                      <h3 className="mt-2 text-base font-semibold text-slate-900">{site.title}</h3>
                      {site.description && <p className="mt-2 text-sm leading-6 text-slate-600">{site.description}</p>}
                      <a href={site.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:underline">
                        Visit official portal <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      </a>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* TAB: ELIGIBILITY WIZARD */}
        {(activeTab === 'wizard' || activeTab === 'profile') && (
          <div className="space-y-6">
            {activeTab === 'profile' && (
              <header className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-200"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Back to home
                </button>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Private citizen profile</p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">My Profile</h1>
                <p className="mt-2 text-sm text-slate-600">
                  Your eligibility details are saved on this device. Sign in to sync them securely to your Supabase account. {authUser ? cloudSyncStatus : ''}
                </p>
              </header>
            )}
            <ProfileWizard
              currentLang={currentLang}
              profile={profile}
              onChange={setProfile}
              onSaveProfile={handleSaveProfile}
              onSetPassword={handleSetPassword}
              accountEmail={authUser?.email ?? null}
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

        {activeTab === 'admin' && (
          <AdminConsole
            user={authUser}
            sites={managedSites}
            onSitesChange={setManagedSites}
          />
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
        initialQuestion={assistantInitialQuestion}
        onInitialQuestionHandled={() => setAssistantInitialQuestion('')}
        onAppAction={(action) => {
          if (action.type === 'search') {
            setSearchQuery(action.query);
            setActiveCategoryFilter('all');
            setActiveTab('dashboard');
            return;
          }
          if (action.type === 'filter') {
            setActiveCategoryFilter(action.category);
            setActiveTab('dashboard');
            return;
          }
          setActiveTab(action.tab);
          if (action.tab === 'dashboard') window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSchemeModal={(s) => {
          setIsVoiceAssistantOpen(false);
          setSelectedScheme(s);
        }}
      />

      {!isVoiceAssistantOpen && (
        <button
          type="button"
          onClick={() => setIsVoiceAssistantOpen(true)}
          className="fixed bottom-5 right-5 z-40 inline-flex min-h-16 items-center gap-3 rounded-full bg-blue-700 px-6 text-base font-semibold text-white shadow-2xl shadow-blue-900/30 transition hover:-translate-y-0.5 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:bottom-7 sm:right-7"
          aria-label="Open multilingual Voice AI"
        >
          <Mic className="h-6 w-6" aria-hidden="true" />
          <span>Voice AI</span>
        </button>
      )}

      {/* Official Government Footer */}
      <footer className="bg-slate-900 text-slate-300 text-xs py-8 border-t border-slate-800 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <FraudProtectionBanner currentLang={currentLang} />
        </div>
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
