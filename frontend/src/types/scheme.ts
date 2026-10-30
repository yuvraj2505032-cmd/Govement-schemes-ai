export type Language = 'en' | 'pa' | 'hi';

export type Category = 'General' | 'SC' | 'ST' | 'OBC/BC' | 'EWS';

export type Gender = 'All' | 'Male' | 'Female' | 'Transgender';

export type Occupation = 
  | 'Farmer'
  | 'Agricultural Labourer'
  | 'Student'
  | 'Unemployed Youth'
  | 'Artisan/Craftsperson'
  | 'Self-Employed/Shopkeeper'
  | 'Daily Wage Worker'
  | 'Homemaker'
  | 'Senior Citizen'
  | 'Private Employee'
  | 'Government Employee';

export type SchemeLevel = 'Punjab State' | 'Central Government';

export interface EligibilityCriterion {
  id: string;
  labelEn: string;
  labelPa: string;
  labelHi: string;
  isMet: boolean;
  userValueDescription: string;
  requiredDescription: string;
  isMandatory: boolean;
}

export interface Scheme {
  id: string;
  titleEn: string;
  titlePa: string;
  titleHi: string;
  level: SchemeLevel;
  departmentEn: string;
  departmentPa: string;
  departmentHi: string;
  categoryTags: string[];
  descriptionEn: string;
  descriptionPa: string;
  descriptionHi: string;
  benefitAmountText: string;
  benefitType: 'Direct Cash Transfer' | 'Health Cover' | 'Scholarship' | 'Subsidy' | 'Pension' | 'Housing' | 'Loan/Credit' | 'In-Kind/Ration';
  minAge?: number;
  maxAge?: number;
  maxIncome?: number; // Annual in INR, undefined if no ceiling
  targetGenders?: Gender[];
  eligibleCategories?: Category[];
  eligibleOccupations?: Occupation[];
  requiresPunjabDomicile: boolean;
  maxLandholdingAcres?: number; // for farmer schemes
  requiresDisability?: boolean;
  requiresWidow?: boolean;
  applicationDeadline: string;
  deadlineType: 'Ongoing' | 'Seasonal' | 'Fixed Date';
  officialPortalUrl: string;
  officialPortalName: string;
  youtubeVideoId: string; // YouTube video ID or search query
  youtubeVideoTitle: string;
  requiredDocuments: {
    nameEn: string;
    namePa: string;
    nameHi: string;
    issuingAuthority: string;
    availableOnDigiLocker: boolean;
  }[];
  applicationSteps: {
    stepNumber: number;
    titleEn: string;
    titlePa: string;
    titleHi: string;
    descriptionEn: string;
    descriptionPa: string;
    descriptionHi: string;
  }[];
  sourceCitation: string;
  verifiedDate: string;
  warningAlert?: string;
}

export interface CitizenProfile {
  username: string;
  age: number;
  gender: Gender;
  occupation: Occupation;
  annualIncome: number;
  category: Category;
  district: string;
  isPunjabDomicile: boolean;
  landholdingAcres: number;
  hasDisability: boolean;
  isWidowOrDestitute: boolean;
  isEnrolledInSchoolOrCollege: boolean;
}

export interface ManagedOfficialSite {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  createdAt: string;
}

export interface EligibilityEvaluation {
  schemeId: string;
  scheme: Scheme;
  isEligible: boolean;
  isPotentialMatch: boolean; // meets most or close
  matchPercentage: number;
  criteria: EligibilityCriterion[];
  matchedReasons: string[];
  failedReasons: string[];
}

export interface FamilyMember {
  id: string;
  relation: 'Self' | 'Spouse' | 'Father' | 'Mother' | 'Son' | 'Daughter' | 'Grandparent' | 'Other';
  name: string;
  age: number;
  gender: Gender;
  occupation: Occupation;
  hasDisability: boolean;
  isStudent: boolean;
  matchedSchemeIds: string[];
}

export interface DistrictInfo {
  name: string;
  namePa: string;
  nameHi: string;
  headquarters: string;
  sewaKendraCount: number;
  mainSewaKendraAddress: string;
  dcOfficeContact: string;
  helpline: string;
  popularSchemes: string[];
}

export interface ApplicationTrackerItem {
  id: string;
  schemeId: string;
  schemeTitle: string;
  dateStarted: string;
  status: 'Discovered' | 'Documents Assembled' | 'Form Submitted' | 'Approved' | 'Disbursed';
  applicationRefNumber?: string;
  notes?: string;
}

// Re-export full-stack API and Frontend types
export * from '../../../shared/types/backend';
export * from './frontend';
