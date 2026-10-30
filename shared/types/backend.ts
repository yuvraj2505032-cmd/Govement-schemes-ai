/**
 * Backend Data & API Types for Government Scheme Eligibility Navigator (CTBF-AI-07)
 */

export type LanguageCode = string;
export type AssistantAppAction =
  | { type: 'search'; query: string }
  | { type: 'filter'; category: 'all' | 'Agriculture' | 'Health' | 'Education' | 'Finance' }
  | { type: 'navigate'; tab: 'dashboard' | 'profile' | 'wizard' | 'saved' | 'insights' | 'family' | 'video-guides' | 'scanner' | 'whatif' | 'districts' | 'deadlines' | 'tracker' };
export type SocialCategory = 'General' | 'SC' | 'ST' | 'OBC/BC' | 'EWS';
export type GenderType = 'All' | 'Male' | 'Female' | 'Transgender';
export type SchemeLevelType = 'Central Government' | 'Punjab State';

export interface EligibilityRules {
  minAge?: number | null;
  maxAge?: number | null;
  maxIncome?: number | null; // Annual income ceiling in INR
  occupations: string[];
  categories: string[];
  districts: string[];
  gender: string;
}

export interface SchemeJSON {
  id: string;
  name: string;
  namePa: string;
  nameHi: string;
  level: SchemeLevelType;
  ministry: string;
  ministryPa: string;
  ministryHi: string;
  eligibility: EligibilityRules;
  benefits: string;
  benefitsPa: string;
  benefitsHi: string;
  documents: string[];
  officialLink: string;
  sourceDoc: string;
}

export interface EligibilityRequestBody {
  age: number;
  income: number;
  occupation: string;
  category: SocialCategory;
  district: string;
  gender: GenderType;
  isPunjabDomicile?: boolean;
  hasDisability?: boolean;
  isWidowOrDestitute?: boolean;
  landholdingAcres?: number;
  consentGiven: boolean;
}

export interface EvaluatedSchemeMatch {
  scheme: SchemeJSON;
  isEligible: boolean;
  isPotentialMatch: boolean;
  matchScore: number;
  satisfiedConditions: string[];
  failedConditions: string[];
}

export interface EligibilityResponseBody {
  status: 'success' | 'error';
  eligibleCount: number;
  potentialCount: number;
  totalEvaluated: number;
  matches: EvaluatedSchemeMatch[];
  consentRecorded: boolean;
  timestamp: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequestBody {
  message: string;
  language: LanguageCode;
  userProfile?: Partial<EligibilityRequestBody>;
  consentGiven: boolean;
  conversationHistory?: ChatMessage[];
}

export interface ChatResponseBody {
  reply: string;
  action?: AssistantAppAction;
  recommendedSchemeIds: string[];
  isAiGrounded: boolean;
  sources: string[];
  consentAcknowledged: boolean;
  dataStored: boolean; // Always false to honor zero-data-storage requirement
}

export interface HealthCheckResponse {
  status: 'ok';
  service: 'Punjab Scheme Navigator API (CTBF-AI-07)';
  schemesLoaded: number;
  version: string;
  timestamp: string;
}
