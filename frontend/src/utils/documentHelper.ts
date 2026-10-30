import { Scheme } from '../types/scheme';

export interface DocumentItemMeta {
  emoji: string;
  isMandatory: boolean;
  category: string;
  badgeTextEn: string;
  badgeTextPa: string;
  badgeTextHi: string;
}

/**
 * Intelligent detector for document icons, mandatory/optional status, and category tags
 */
export function getDocumentMeta(docName: string): DocumentItemMeta {
  const lower = docName.toLowerCase();

  // Detect if document is mandatory or optional/conditional
  const isMandatory = 
    !lower.includes('if applicable') &&
    !lower.includes('if required') &&
    !lower.includes('if available') &&
    !lower.includes('optional') &&
    !lower.includes('if applying') &&
    !lower.includes('if any') &&
    !lower.includes('conditional');

  let emoji = '📋';
  let category = 'Identity';

  if (lower.includes('aadhaar')) {
    emoji = '🪪';
    category = 'Identity';
  } else if (lower.includes('voter') || lower.includes('epic')) {
    emoji = '🗳️';
    category = 'Identity';
  } else if (lower.includes('pan')) {
    emoji = '💳';
    category = 'Financial';
  } else if (lower.includes('bank') || lower.includes('passbook') || lower.includes('account') || lower.includes('npci') || lower.includes('ifsc')) {
    emoji = '🏦';
    category = 'Financial';
  } else if (lower.includes('photo') || lower.includes('photograph')) {
    emoji = '📸';
    category = 'Personal';
  } else if (lower.includes('income')) {
    emoji = '📄';
    category = 'Revenue';
  } else if (lower.includes('residence') || lower.includes('domicile')) {
    emoji = '🏠';
    category = 'Residence';
  } else if (lower.includes('caste') || lower.includes('category') || lower.includes('sc') || lower.includes('bc') || lower.includes('obc') || lower.includes('ews')) {
    emoji = '🎓';
    category = 'Social Category';
  } else if (lower.includes('mobile') || lower.includes('phone') || lower.includes('otp')) {
    emoji = '📱';
    category = 'Communication';
  } else if (lower.includes('ration') || lower.includes('food') || lower.includes('nfsa')) {
    emoji = '📃';
    category = 'Family/Ration';
  } else if (lower.includes('education') || lower.includes('marksheet') || lower.includes('matric') || lower.includes('college') || lower.includes('bonafide') || lower.includes('fee receipt')) {
    emoji = '📜';
    category = 'Educational';
  } else if (lower.includes('land') || lower.includes('fard') || lower.includes('jamabandi') || lower.includes('khasra') || lower.includes('patwari') || lower.includes('sowing')) {
    emoji = '🚜';
    category = 'Land & Revenue';
  } else if (lower.includes('disability') || lower.includes('medical') || lower.includes('health') || lower.includes('cancer') || lower.includes('hospital') || lower.includes('civil surgeon')) {
    emoji = '🩺';
    category = 'Medical/Health';
  } else if (lower.includes('marriage') || lower.includes('shagun') || lower.includes('bride') || lower.includes('invitation') || lower.includes('wedding')) {
    emoji = '💍';
    category = 'Family/Civil';
  } else if (lower.includes('electricity') || lower.includes('meter') || lower.includes('power')) {
    emoji = '⚡';
    category = 'Utility';
  } else if (lower.includes('death')) {
    emoji = '📜';
    category = 'Civil Record';
  } else if (lower.includes('birth') || lower.includes('age proof')) {
    emoji = '🎂';
    category = 'Civil Record';
  } else if (lower.includes('driving') || lower.includes('license') || lower.includes('vehicle')) {
    emoji = '🚗';
    category = 'Transport';
  }

  return {
    emoji,
    isMandatory,
    category,
    badgeTextEn: isMandatory ? 'Mandatory' : 'Optional / If Applicable',
    badgeTextPa: isMandatory ? 'ਜ਼ਰੂਰੀ (Mandatory)' : 'ਜੇਕਰ ਲਾਗੂ ਹੋਵੇ (Optional)',
    badgeTextHi: isMandatory ? 'अनिवार्य (Mandatory)' : 'यदि लागू हो (Optional)'
  };
}

/**
 * Downloads a structured citizen factsheet for a scheme
 */
export function downloadSchemeSummary(scheme: Scheme, lang: 'en' | 'pa' | 'hi' = 'en') {
  const isPunjab = scheme.level === 'Punjab State';
  const title = lang === 'pa' ? scheme.titlePa : lang === 'hi' ? scheme.titleHi : scheme.titleEn;
  const dept = lang === 'pa' ? scheme.departmentPa : lang === 'hi' ? scheme.departmentHi : scheme.departmentEn;
  const desc = lang === 'pa' ? scheme.descriptionPa : lang === 'hi' ? scheme.descriptionHi : scheme.descriptionEn;

  const content = `================================================================================
GOVERNMENT OF INDIA & GOVERNMENT OF PUNJAB - WELFARE SCHEME FACTSHEET
CTBF-AI-07 • Government Scheme Eligibility Navigator
================================================================================

SCHEME NAME: ${title}
LEVEL: ${scheme.level}
DEPARTMENT / MINISTRY: ${dept}
OFFICIAL PORTAL: ${scheme.officialPortalUrl}
APPLICATION FEES: 100% FREE (No government application charge; do not pay unauthorized agents)
HELPLINE: ${isPunjab ? 'Punjab Citizen Helpline: 1100 (Toll-Free)' : 'National Citizen Portal: 1800-11-0031'}

--------------------------------------------------------------------------------
1. KEY BENEFITS & FINANCIAL ASSISTANCE:
--------------------------------------------------------------------------------
${scheme.benefitAmountText}

Description:
${desc}

--------------------------------------------------------------------------------
2. ELIGIBILITY CRITERIA:
--------------------------------------------------------------------------------
- Age Requirement: ${scheme.minAge ? scheme.minAge + ' years' : 'Any'} ${scheme.maxAge ? 'to ' + scheme.maxAge + ' years' : ''}
- Annual Income Ceiling: ${scheme.maxIncome ? 'Up to ₹' + scheme.maxIncome.toLocaleString('en-IN') + '/year' : 'No Income Ceiling'}
- Eligible Occupations: ${scheme.eligibleOccupations?.join(', ') || 'All occupations'}
- Social Categories: ${scheme.eligibleCategories?.join(', ') || 'All categories'}
- Target Genders: ${scheme.targetGenders?.join(', ') || 'All'}
- Domicile: ${scheme.requiresPunjabDomicile ? 'Punjab Resident / Domicile Mandatory' : 'All-India Citizens'}
${scheme.maxLandholdingAcres ? `- Maximum Landholding: ${scheme.maxLandholdingAcres} Acres` : ''}
${scheme.requiresDisability ? '- Special Condition: Requires Benchmark Disability (≥ 40%)' : ''}
${scheme.requiresWidow ? '- Special Condition: For Widows / Destitute Women' : ''}

--------------------------------------------------------------------------------
3. REQUIRED DOCUMENTS CHECKLIST:
--------------------------------------------------------------------------------
${scheme.requiredDocuments.map((doc, idx) => {
  const meta = getDocumentMeta(doc.nameEn);
  const status = meta.isMandatory ? '[MANDATORY]' : '[IF APPLICABLE]';
  const digi = doc.availableOnDigiLocker ? '(Available on DigiLocker)' : '';
  const name = lang === 'pa' ? doc.namePa : lang === 'hi' ? doc.nameHi : doc.nameEn;
  return `${idx + 1}. ${meta.emoji} ${name} ${status}
     Issuing Authority: ${doc.issuingAuthority} ${digi}`;
}).join('\n\n')}

--------------------------------------------------------------------------------
4. STEP-BY-STEP APPLICATION PROCEDURE:
--------------------------------------------------------------------------------
${scheme.applicationSteps.map(step => {
  const stepTitle = lang === 'pa' ? step.titlePa : lang === 'hi' ? step.titleHi : step.titleEn;
  const stepDesc = lang === 'pa' ? step.descriptionPa : lang === 'hi' ? step.descriptionHi : step.descriptionEn;
  return `Step ${step.stepNumber}: ${stepTitle}
   ${stepDesc}`;
}).join('\n\n')}

--------------------------------------------------------------------------------
5. IMPORTANT DATES & DEADLINE:
--------------------------------------------------------------------------------
- Application Timeline: ${scheme.applicationDeadline}
- Cycle Type: ${scheme.deadlineType}

--------------------------------------------------------------------------------
OFFICIAL SAFETY ADVISORY:
--------------------------------------------------------------------------------
Apply only on official .gov.in or .nic.in portals or in-person at authorized 
Punjab Sewa Kendras. Beware of fraudulent links asking for bank OTPs or 
registration fees. Report cyber fraud to National Helpline 1930.

Generated on: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
Punjab Scheme Navigator AI (CTBF-AI-07)
================================================================================`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${scheme.id}-scheme-factsheet.txt`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
