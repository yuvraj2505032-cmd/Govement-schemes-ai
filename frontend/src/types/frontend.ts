/**
 * Frontend State, UI, and Component Types for Government Scheme Eligibility Navigator
 */

import { LanguageCode, SchemeJSON, EvaluatedSchemeMatch } from '../../../shared/types/backend';

export type ActiveNavTab = 
  | 'dashboard'
  | 'wizard'
  | 'saved'
  | 'video-guides'
  | 'scanner'
  | 'family'
  | 'whatif'
  | 'districts'
  | 'deadlines'
  | 'tracker'
  | 'fraud-shield';

export interface CitizenConsentState {
  hasConsent: boolean;
  consentTimestamp: string | null;
  optInLocalWallet: boolean;
}

export interface VoiceAssistantState {
  isOpen: boolean;
  isListening: boolean;
  transcript: string;
  isProcessing: boolean;
  isSpeaking: boolean;
  selectedLanguage: LanguageCode;
  autoSpeakAnswer: boolean;
}

export interface FilterState {
  searchQuery: string;
  categoryFilter: string;
  onlyEligible: boolean;
  selectedLevel: 'All' | 'Central Government' | 'Punjab State';
}

export interface DocumentWalletItem {
  id: string;
  docKey: string;
  displayName: string;
  issuingAuthority: string;
  status: 'verified' | 'missing' | 'in-progress';
  isDigiLockerAvailable: boolean;
}

export interface ApplicationTrackerEntry {
  id: string;
  schemeId: string;
  schemeTitle: string;
  dateStarted: string;
  status: 'Discovered' | 'Documents Assembled' | 'Form Submitted' | 'Approved' | 'Disbursed';
  applicationRefNumber?: string;
  notes?: string;
}

export interface DistrictSummary {
  name: string;
  namePa: string;
  nameHi: string;
  sewaKendraCount: number;
  dcOfficeContact: string;
  helpline: string;
  portalUrl: string;
}
