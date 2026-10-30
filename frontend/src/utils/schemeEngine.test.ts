import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateSchemeEligibility, evaluateAllSchemes, simulateWhatIf, aggregateMissingDocuments } from './schemeEngine';
import { CitizenProfile, Scheme } from '../types/scheme';
import { GOV_SCHEMES } from '../data/schemes';

test('schemeEngine: PM-Kisan eligibility for small landholding farmer', () => {
  const farmerProfile: CitizenProfile = {
    username: '',
    age: 42,
    gender: 'Male',
    occupation: 'Farmer',
    annualIncome: 120000,
    category: 'General',
    district: 'Ludhiana',
    isPunjabDomicile: true,
    landholdingAcres: 3.5,
    hasDisability: false,
    isWidowOrDestitute: false,
    isEnrolledInSchoolOrCollege: false
  };

  const pmKisan = GOV_SCHEMES.find(s => s.id === 'pm-kisan')!;
  assert.ok(pmKisan, 'PM-Kisan scheme must exist');

  const result = evaluateSchemeEligibility(farmerProfile, pmKisan);
  assert.equal(result.isEligible, true);
  assert.ok(result.matchPercentage >= 80);
  assert.ok(result.matchedReasons.some(r => r.includes('Landholding')));
});

test('schemeEngine: Post Matric SC Scholarship requires SC category and Student occupation', () => {
  const scStudent: CitizenProfile = {
    username: '',
    age: 20,
    gender: 'Female',
    occupation: 'Student',
    annualIncome: 180000,
    category: 'SC',
    district: 'Jalandhar',
    isPunjabDomicile: true,
    landholdingAcres: 0,
    hasDisability: false,
    isWidowOrDestitute: false,
    isEnrolledInSchoolOrCollege: true
  };

  const postMatric = GOV_SCHEMES.find(s => s.id === 'post-matric-sc')!;
  assert.ok(postMatric, 'Post matric scheme must exist');

  const eligibleResult = evaluateSchemeEligibility(scStudent, postMatric);
  assert.equal(eligibleResult.isEligible, true);

  // If category changed to General, must not be eligible for SC scholarship
  const generalStudent: CitizenProfile = { ...scStudent, category: 'General' };
  const ineligibleResult = evaluateSchemeEligibility(generalStudent, postMatric);
  assert.equal(ineligibleResult.isEligible, false);
  assert.ok(ineligibleResult.failedReasons.some(r => r.includes('Reserved for SC')));
});

test('schemeEngine: Old Age Pension checks minAge and income ceiling', () => {
  const seniorCitizen: CitizenProfile = {
    username: '',
    age: 68,
    gender: 'Male',
    occupation: 'Senior Citizen',
    annualIncome: 45000,
    category: 'General',
    district: 'Bathinda',
    isPunjabDomicile: true,
    landholdingAcres: 0,
    hasDisability: false,
    isWidowOrDestitute: false,
    isEnrolledInSchoolOrCollege: false
  };

  const oldAgeScheme = GOV_SCHEMES.find(s => s.id === 'punjab-old-age-pension')!;
  const result = evaluateSchemeEligibility(seniorCitizen, oldAgeScheme);
  assert.equal(result.isEligible, true);

  // If income exceeds 60,000 ceiling
  const richSenior: CitizenProfile = { ...seniorCitizen, annualIncome: 200000 };
  const richResult = evaluateSchemeEligibility(richSenior, oldAgeScheme);
  assert.equal(richResult.isEligible, false);
});

test('schemeEngine: What-If simulation detects gained and lost schemes', () => {
  const lowIncomeProfile: CitizenProfile = {
    username: '',
    age: 25,
    gender: 'Female',
    occupation: 'Unemployed Youth',
    annualIncome: 50000,
    category: 'SC',
    district: 'Amritsar',
    isPunjabDomicile: true,
    landholdingAcres: 0,
    hasDisability: false,
    isWidowOrDestitute: false,
    isEnrolledInSchoolOrCollege: false
  };

  const whatIf = simulateWhatIf(lowIncomeProfile, { annualIncome: 400000 });
  // Raising income to 400,000 should cause loss of low-income/BPL schemes (like Ashirwad, Smart Ration, PMAY-G)
  assert.ok(whatIf.lostSchemes.length > 0, 'Should lose low-income schemes when income increases');
});

test('schemeEngine: Missing documents aggregator computes readiness percentage', () => {
  const profile: CitizenProfile = {
    username: '',
    age: 30,
    gender: 'Male',
    occupation: 'Farmer',
    annualIncome: 100000,
    category: 'General',
    district: 'Patiala',
    isPunjabDomicile: true,
    landholdingAcres: 4,
    hasDisability: false,
    isWidowOrDestitute: false,
    isEnrolledInSchoolOrCollege: false
  };

  const evaluations = evaluateAllSchemes(profile);
  const userDocs = new Set<string>(['aadhaar card linked with mobile']);

  const docSummary = aggregateMissingDocuments(evaluations, userDocs);
  assert.ok(docSummary.allDocs.length > 0);
  assert.ok(docSummary.ownedDocs.length >= 1);
  assert.ok(docSummary.missingDocs.length > 0);
  assert.ok(docSummary.readinessPercentage > 0 && docSummary.readinessPercentage <= 100);
});
