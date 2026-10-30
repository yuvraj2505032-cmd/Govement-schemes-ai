import { CitizenProfile, Scheme, EligibilityEvaluation, EligibilityCriterion, FamilyMember } from '../types/scheme';
import { GOV_SCHEMES } from '../data/schemes';

export function evaluateSchemeEligibility(profile: CitizenProfile, scheme: Scheme): EligibilityEvaluation {
  const criteria: EligibilityCriterion[] = [];
  const matchedReasons: string[] = [];
  const failedReasons: string[] = [];

  let totalWeight = 0;
  let earnedWeight = 0;

  // 1. Age criteria
  if (scheme.minAge !== undefined || scheme.maxAge !== undefined) {
    totalWeight += 20;
    const min = scheme.minAge ?? 0;
    const max = scheme.maxAge ?? 120;
    const isAgeMet = profile.age >= min && profile.age <= max;

    if (isAgeMet) {
      earnedWeight += 20;
      matchedReasons.push(`Age ${profile.age} is within eligible range (${min} - ${max === 120 ? 'No upper limit' : max} years)`);
    } else {
      failedReasons.push(`Age ${profile.age} falls outside required range (${min} - ${max === 120 ? 'No limit' : max} years)`);
    }

    criteria.push({
      id: 'age',
      labelEn: `Age Requirement: ${min} - ${max === 120 ? 'No limit' : max} years`,
      labelPa: `ਉਮਰ ਸ਼ਰਤ: ${min} - ${max === 120 ? 'ਕੋਈ ਵੱਧ ਤੋਂ ਵੱਧ ਸੀਮਾ ਨਹੀਂ' : max} ਸਾਲ`,
      labelHi: `आयु मानदंड: ${min} - ${max === 120 ? 'कोई अधिकतम सीमा नहीं' : max} वर्ष`,
      isMet: isAgeMet,
      userValueDescription: `Your age: ${profile.age} years`,
      requiredDescription: `${min} to ${max === 120 ? 'Unlimited' : max} years`,
      isMandatory: true
    });
  }

  // 2. Income criteria
  if (scheme.maxIncome !== undefined) {
    totalWeight += 25;
    const isIncomeMet = profile.annualIncome <= scheme.maxIncome;

    if (isIncomeMet) {
      earnedWeight += 25;
      matchedReasons.push(`Annual income ₹${profile.annualIncome.toLocaleString('en-IN')} is within maximum ceiling of ₹${scheme.maxIncome.toLocaleString('en-IN')}`);
    } else {
      failedReasons.push(`Annual income ₹${profile.annualIncome.toLocaleString('en-IN')} exceeds ceiling of ₹${scheme.maxIncome.toLocaleString('en-IN')}`);
    }

    criteria.push({
      id: 'income',
      labelEn: `Annual Income Ceiling: Up to ₹${scheme.maxIncome.toLocaleString('en-IN')}`,
      labelPa: `ਸਾਲਾਨਾ ਆਮਦਨ ਸੀਮਾ: ਵੱਧ ਤੋਂ ਵੱਧ ₹${scheme.maxIncome.toLocaleString('en-IN')}`,
      labelHi: `वार्षिक आय सीमा: अधिकतम ₹${scheme.maxIncome.toLocaleString('en-IN')}`,
      isMet: isIncomeMet,
      userValueDescription: `Your income: ₹${profile.annualIncome.toLocaleString('en-IN')}`,
      requiredDescription: `Up to ₹${scheme.maxIncome.toLocaleString('en-IN')}`,
      isMandatory: true
    });
  }

  // 3. Gender criteria
  if (scheme.targetGenders && scheme.targetGenders.length > 0 && !scheme.targetGenders.includes('All')) {
    totalWeight += 15;
    const isGenderMet = scheme.targetGenders.includes(profile.gender);

    if (isGenderMet) {
      earnedWeight += 15;
      matchedReasons.push(`Gender requirement (${scheme.targetGenders.join(', ')}) matched`);
    } else {
      failedReasons.push(`Scheme is reserved for ${scheme.targetGenders.join(', ')} applicants`);
    }

    criteria.push({
      id: 'gender',
      labelEn: `Target Gender: ${scheme.targetGenders.join(', ')}`,
      labelPa: `ਲਿੰਗ ਸ਼ਰਤ: ${scheme.targetGenders.join(', ')}`,
      labelHi: `लक्षित लिंग: ${scheme.targetGenders.join(', ')}`,
      isMet: isGenderMet,
      userValueDescription: `Your gender: ${profile.gender}`,
      requiredDescription: scheme.targetGenders.join(', '),
      isMandatory: true
    });
  }

  // 4. Social Category / Caste criteria
  if (scheme.eligibleCategories && scheme.eligibleCategories.length > 0) {
    totalWeight += 15;
    const isCategoryMet = scheme.eligibleCategories.includes(profile.category);

    if (isCategoryMet) {
      earnedWeight += 15;
      matchedReasons.push(`Category (${profile.category}) is eligible for this scheme`);
    } else {
      failedReasons.push(`Reserved for ${scheme.eligibleCategories.join(', ')} categories`);
    }

    criteria.push({
      id: 'category',
      labelEn: `Eligible Categories: ${scheme.eligibleCategories.join(', ')}`,
      labelPa: `ਯੋਗ ਸ਼੍ਰੇਣੀਆਂ: ${scheme.eligibleCategories.join(', ')}`,
      labelHi: `पात्र श्रेणियां: ${scheme.eligibleCategories.join(', ')}`,
      isMet: isCategoryMet,
      userValueDescription: `Your category: ${profile.category}`,
      requiredDescription: scheme.eligibleCategories.join(', '),
      isMandatory: true
    });
  }

  // 5. Occupation criteria
  if (scheme.eligibleOccupations && scheme.eligibleOccupations.length > 0) {
    totalWeight += 15;
    const isOccupationMet = scheme.eligibleOccupations.includes(profile.occupation);

    if (isOccupationMet) {
      earnedWeight += 15;
      matchedReasons.push(`Occupation (${profile.occupation}) qualifies for targeted benefits`);
    } else {
      failedReasons.push(`Scheme prioritizes ${scheme.eligibleOccupations.join(', ')}`);
    }

    criteria.push({
      id: 'occupation',
      labelEn: `Target Occupation: ${scheme.eligibleOccupations.join(', ')}`,
      labelPa: `ਕਿੱਤਾ ਸ਼ਰਤ: ${scheme.eligibleOccupations.join(', ')}`,
      labelHi: `लक्षित व्यवसाय: ${scheme.eligibleOccupations.join(', ')}`,
      isMet: isOccupationMet,
      userValueDescription: `Your occupation: ${profile.occupation}`,
      requiredDescription: scheme.eligibleOccupations.join(', '),
      isMandatory: false // might be non-mandatory if generalized
    });
  }

  // 6. Punjab Domicile criteria
  if (scheme.requiresPunjabDomicile) {
    totalWeight += 10;
    const isDomicileMet = profile.isPunjabDomicile;

    if (isDomicileMet) {
      earnedWeight += 10;
      matchedReasons.push('Resident / Domicile of Punjab confirmed');
    } else {
      failedReasons.push('Requires bona fide Punjab domicile certificate');
    }

    criteria.push({
      id: 'domicile',
      labelEn: 'Punjab State Domicile / Residence Proof',
      labelPa: 'ਪੰਜਾਬ ਰਿਹਾਇਸ਼ ਦਾ ਸਬੂਤ ਜ਼ਰੂਰੀ',
      labelHi: 'पंजाब निवास प्रमाण पत्र अनिवार्य',
      isMet: isDomicileMet,
      userValueDescription: profile.isPunjabDomicile ? 'Yes, Punjab Resident' : 'Not a Punjab resident',
      requiredDescription: 'Bona fide Punjab Resident',
      isMandatory: true
    });
  }

  // 7. Landholding criteria (farmers)
  if (scheme.maxLandholdingAcres !== undefined) {
    totalWeight += 10;
    const isLandMet = profile.landholdingAcres <= scheme.maxLandholdingAcres;

    if (isLandMet) {
      earnedWeight += 10;
      matchedReasons.push(`Landholding of ${profile.landholdingAcres} acres is under maximum limit of ${scheme.maxLandholdingAcres} acres`);
    } else {
      failedReasons.push(`Landholding ${profile.landholdingAcres} acres exceeds threshold of ${scheme.maxLandholdingAcres} acres`);
    }

    criteria.push({
      id: 'landholding',
      labelEn: `Landholding Limit: Up to ${scheme.maxLandholdingAcres} acres`,
      labelPa: `ਜ਼ਮੀਨ ਦੀ ਸੀਮਾ: ਵੱਧ ਤੋਂ ਵੱਧ ${scheme.maxLandholdingAcres} ਏਕੜ`,
      labelHi: `भूमि सीमा: अधिकतम ${scheme.maxLandholdingAcres} एकड़`,
      isMet: isLandMet,
      userValueDescription: `${profile.landholdingAcres} acres`,
      requiredDescription: `Max ${scheme.maxLandholdingAcres} acres`,
      isMandatory: true
    });
  }

  // 8. Disability specific
  if (scheme.requiresDisability) {
    totalWeight += 15;
    const isDisabilityMet = profile.hasDisability;

    if (isDisabilityMet) {
      earnedWeight += 15;
      matchedReasons.push('Eligible under Benchmark Disability (≥ 40%)');
    } else {
      failedReasons.push('Requires certified Disability of 40% or above');
    }

    criteria.push({
      id: 'disability',
      labelEn: 'Benchmark Disability (≥ 40%) or UDID Card',
      labelPa: '40% ਜਾਂ ਵੱਧ ਦਿਵਿਆਂਗਤਾ / UDID ਕਾਰਡ',
      labelHi: '40% या अधिक दिव्यांगता / यूडीआईडी कार्ड',
      isMet: isDisabilityMet,
      userValueDescription: profile.hasDisability ? 'Yes (Certified)' : 'No disability reported',
      requiredDescription: 'Certified ≥ 40% Disability',
      isMandatory: true
    });
  }

  // 9. Widow specific
  if (scheme.requiresWidow) {
    totalWeight += 15;
    const isWidowMet = profile.isWidowOrDestitute;

    if (isWidowMet) {
      earnedWeight += 15;
      matchedReasons.push('Eligible under Widows / Destitute Women category');
    } else {
      failedReasons.push('Reserved for Widows, Destitute, or Deserted Women');
    }

    criteria.push({
      id: 'widow',
      labelEn: 'Widow / Destitute Status',
      labelPa: 'ਵਿਧਵਾ ਜਾਂ ਬੇਸਹਾਰਾ ਸਥਿਤੀ',
      labelHi: 'विधवा अथवा निराश्रित स्थिति',
      isMet: isWidowMet,
      userValueDescription: profile.isWidowOrDestitute ? 'Yes' : 'No',
      requiredDescription: 'Widow or Destitute Woman',
      isMandatory: true
    });
  }

  // Default baseline if no explicit criteria specified
  if (totalWeight === 0) {
    totalWeight = 100;
    earnedWeight = 100;
  }

  const matchPercentage = Math.round((earnedWeight / totalWeight) * 100);

  // Mandatory checks: all mandatory criteria must be met for confirmed eligibility
  const mandatoryCriteria = criteria.filter(c => c.isMandatory);
  const allMandatoryMet = mandatoryCriteria.every(c => c.isMet);

  const isEligible = allMandatoryMet && matchPercentage >= 80;
  const isPotentialMatch = !isEligible && (matchPercentage >= 50 || (allMandatoryMet && matchPercentage >= 60));

  return {
    schemeId: scheme.id,
    scheme,
    isEligible,
    isPotentialMatch,
    matchPercentage,
    criteria,
    matchedReasons,
    failedReasons
  };
}

export function evaluateAllSchemes(profile: CitizenProfile, schemes: Scheme[] = GOV_SCHEMES): EligibilityEvaluation[] {
  return schemes.map(scheme => evaluateSchemeEligibility(profile, scheme))
    .sort((a, b) => {
      // Sort confirmed matches first, then highest percentage
      if (a.isEligible && !b.isEligible) return -1;
      if (!a.isEligible && b.isEligible) return 1;
      if (a.isPotentialMatch && !b.isPotentialMatch) return -1;
      if (!a.isPotentialMatch && b.isPotentialMatch) return 1;
      return b.matchPercentage - a.matchPercentage;
    });
}

export function calculateFamilyBenefits(members: FamilyMember[], baseProfile: CitizenProfile, schemes: Scheme[] = GOV_SCHEMES) {
  return members.map(member => {
    const memberProfile: CitizenProfile = {
      ...baseProfile,
      age: member.age,
      gender: member.gender,
      occupation: member.occupation,
      hasDisability: member.hasDisability,
      isEnrolledInSchoolOrCollege: member.isStudent,
      isWidowOrDestitute: member.relation === 'Mother' && baseProfile.isWidowOrDestitute
    };

    const evaluations = evaluateAllSchemes(memberProfile, schemes);
    const eligibleSchemes = evaluations.filter(e => e.isEligible);
    const potentialSchemes = evaluations.filter(e => e.isPotentialMatch);

    return {
      member,
      eligibleSchemes,
      potentialSchemes,
      eligibleCount: eligibleSchemes.length
    };
  });
}

export function simulateWhatIf(
  baseProfile: CitizenProfile,
  modifications: Partial<CitizenProfile>,
  schemes: Scheme[] = GOV_SCHEMES
) {
  const simulatedProfile = { ...baseProfile, ...modifications };
  const currentEvaluations = evaluateAllSchemes(baseProfile, schemes);
  const simulatedEvaluations = evaluateAllSchemes(simulatedProfile, schemes);

  const currentEligibleIds = new Set(currentEvaluations.filter(e => e.isEligible).map(e => e.schemeId));
  const simulatedEligibleIds = new Set(simulatedEvaluations.filter(e => e.isEligible).map(e => e.schemeId));

  const gainedSchemes = simulatedEvaluations.filter(e => simulatedEligibleIds.has(e.schemeId) && !currentEligibleIds.has(e.schemeId));
  const lostSchemes = currentEvaluations.filter(e => currentEligibleIds.has(e.schemeId) && !simulatedEligibleIds.has(e.schemeId));
  const retainedSchemes = simulatedEvaluations.filter(e => simulatedEligibleIds.has(e.schemeId) && currentEligibleIds.has(e.schemeId));

  return {
    simulatedProfile,
    simulatedEvaluations,
    gainedSchemes,
    lostSchemes,
    retainedSchemes,
    totalSimulatedEligible: simulatedEligibleIds.size,
    netChange: simulatedEligibleIds.size - currentEligibleIds.size
  };
}

export function aggregateMissingDocuments(evaluations: EligibilityEvaluation[], userOwnedDocs: Set<string>) {
  const eligibleEvaluations = evaluations.filter(e => e.isEligible || e.isPotentialMatch);
  const docMap = new Map<string, {
    nameEn: string;
    namePa: string;
    nameHi: string;
    issuingAuthority: string;
    availableOnDigiLocker: boolean;
    requiredBySchemes: string[];
    isOwned: boolean;
  }>();

  for (const evaluation of eligibleEvaluations) {
    for (const doc of evaluation.scheme.requiredDocuments) {
      const key = doc.nameEn.toLowerCase().trim();
      const isOwned = userOwnedDocs.has(key);

      if (!docMap.has(key)) {
        docMap.set(key, {
          nameEn: doc.nameEn,
          namePa: doc.namePa,
          nameHi: doc.nameHi,
          issuingAuthority: doc.issuingAuthority,
          availableOnDigiLocker: doc.availableOnDigiLocker,
          requiredBySchemes: [evaluation.scheme.titleEn],
          isOwned
        });
      } else {
        const existing = docMap.get(key)!;
        if (!existing.requiredBySchemes.includes(evaluation.scheme.titleEn)) {
          existing.requiredBySchemes.push(evaluation.scheme.titleEn);
        }
      }
    }
  }

  const allDocs = Array.from(docMap.values());
  const ownedDocs = allDocs.filter(d => d.isOwned);
  const missingDocs = allDocs.filter(d => !d.isOwned);

  return {
    allDocs,
    ownedDocs,
    missingDocs,
    readinessPercentage: allDocs.length > 0 ? Math.round((ownedDocs.length / allDocs.length) * 100) : 100
  };
}
