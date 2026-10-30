import { Scheme } from '../types/scheme';
import { getDocumentMeta } from './documentHelper';

/**
 * Generates an authentic, high-resolution government-style HTML document
 * ready for printing or saving as PDF via the browser print dialog.
 */
export function getGovernmentPrintTemplate(scheme: Scheme, lang: 'en' | 'pa' | 'hi' = 'en'): string {
  const isPunjab = scheme.level === 'Punjab State';
  const title = lang === 'pa' ? scheme.titlePa : lang === 'hi' ? scheme.titleHi : scheme.titleEn;
  const dept = lang === 'pa' ? scheme.departmentPa : lang === 'hi' ? scheme.departmentHi : scheme.departmentEn;
  const desc = lang === 'pa' ? scheme.descriptionPa : lang === 'hi' ? scheme.descriptionHi : scheme.descriptionEn;
  
  const refNumber = `PB-GOV/${scheme.id.toUpperCase()}/${new Date().getFullYear()}`;
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title} - Official Government Factsheet</title>
  <style>
    @page {
      size: A4;
      margin: 12mm 15mm 15mm 15mm;
    }
    
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Times New Roman', Times, 'Georgia', serif;
      color: #111827;
      background: #ffffff;
      margin: 0;
      padding: 0;
      font-size: 11pt;
      line-height: 1.45;
    }

    .tricolor-bar {
      height: 5px;
      width: 100%;
      display: flex;
      margin-bottom: 12px;
    }
    .tricolor-saffron { width: 33.33%; background-color: #FF9933; }
    .tricolor-white { width: 33.33%; background-color: #FFFFFF; border-bottom: 1px solid #e5e7eb; }
    .tricolor-green { width: 33.33%; background-color: #138808; }

    .gov-header {
      text-align: center;
      border-bottom: 2px solid #1e3a8a;
      padding-bottom: 12px;
      margin-bottom: 14px;
      position: relative;
    }

    .emblem-title {
      font-size: 15pt;
      font-weight: bold;
      color: #1e3a8a;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin: 0;
    }

    .sub-dept {
      font-size: 10pt;
      font-weight: 600;
      color: #374151;
      margin-top: 2px;
    }

    .document-badge {
      display: inline-block;
      margin-top: 6px;
      background-color: #f3f4f6;
      border: 1px solid #d1d5db;
      padding: 3px 10px;
      font-size: 9pt;
      font-weight: bold;
      color: #1f2937;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .meta-strip {
      display: flex;
      justify-content: space-between;
      font-size: 9pt;
      color: #4b5563;
      margin-top: 8px;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 6px;
    }

    .scheme-title-box {
      background-color: #f8fafc;
      border: 1px solid #cbd5e1;
      border-left: 5px solid #1e3a8a;
      padding: 10px 14px;
      margin-top: 10px;
      margin-bottom: 14px;
    }

    .scheme-title-box h1 {
      margin: 0;
      font-size: 14pt;
      font-weight: bold;
      color: #0f172a;
    }

    .scheme-title-box .dept-line {
      font-size: 9.5pt;
      color: #475569;
      margin-top: 3px;
    }

    .section-title {
      font-size: 11pt;
      font-weight: bold;
      color: #1e3a8a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #94a3b8;
      padding-bottom: 3px;
      margin-top: 14px;
      margin-bottom: 8px;
    }

    .benefit-box {
      background-color: #f0fdf4;
      border: 1px solid #86efac;
      padding: 8px 12px;
      margin-bottom: 10px;
    }

    .benefit-box .amount {
      font-size: 13pt;
      font-weight: bold;
      color: #14532d;
    }

    .benefit-box .mode {
      font-size: 9pt;
      color: #166534;
      margin-top: 2px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 6px;
      margin-bottom: 12px;
      font-size: 9.5pt;
    }

    th, td {
      border: 1px solid #cbd5e1;
      padding: 6px 8px;
      text-align: left;
      vertical-align: top;
    }

    th {
      background-color: #f1f5f9;
      color: #1e293b;
      font-weight: bold;
    }

    .badge-mandatory {
      font-size: 8pt;
      font-weight: bold;
      background-color: #fee2e2;
      color: #991b1b;
      padding: 1px 6px;
      border-radius: 3px;
      display: inline-block;
    }

    .badge-optional {
      font-size: 8pt;
      font-weight: bold;
      background-color: #fef3c7;
      color: #92400e;
      padding: 1px 6px;
      border-radius: 3px;
      display: inline-block;
    }

    .checkbox-square {
      display: inline-block;
      width: 13px;
      height: 13px;
      border: 1.5px solid #334155;
      margin-right: 6px;
      vertical-align: middle;
    }

    .steps-list {
      margin: 0;
      padding-left: 20px;
      font-size: 9.5pt;
    }

    .steps-list li {
      margin-bottom: 6px;
    }

    .steps-list strong {
      color: #0f172a;
    }

    .advisory-box {
      background-color: #fffbeb;
      border: 1px solid #fde68a;
      padding: 8px 12px;
      margin-top: 14px;
      font-size: 8.5pt;
      color: #78350f;
    }

    .signature-grid {
      display: flex;
      justify-content: space-between;
      margin-top: 24px;
      padding-top: 12px;
      border-top: 1px dashed #94a3b8;
      font-size: 9pt;
    }

    .sig-col {
      width: 45%;
      text-align: center;
    }

    .sig-line {
      height: 35px;
      border-bottom: 1px solid #334155;
      margin-bottom: 4px;
    }

    .helpline-footer {
      text-align: center;
      margin-top: 16px;
      font-size: 8.5pt;
      color: #64748b;
      border-top: 1px solid #e2e8f0;
      padding-top: 6px;
    }
  </style>
</head>
<body>

  <!-- Tricolor Bar -->
  <div class="tricolor-bar">
    <div class="tricolor-saffron"></div>
    <div class="tricolor-white"></div>
    <div class="tricolor-green"></div>
  </div>

  <!-- Government Official Header -->
  <div class="gov-header">
    <div style="font-size: 18pt; margin-bottom: 2px;">🏛️</div>
    <div class="emblem-title">
      ${isPunjab ? 'GOVERNMENT OF PUNJAB' : 'GOVERNMENT OF INDIA & STATE OF PUNJAB'}
    </div>
    <div class="sub-dept">${dept}</div>
    <div class="document-badge">OFFICIAL WELFARE SCHEME CITIZEN FACTSHEET</div>
  </div>

  <!-- Document Metadata -->
  <div class="meta-strip">
    <div><strong>REF NO:</strong> ${refNumber}</div>
    <div><strong>LEVEL:</strong> ${scheme.level.toUpperCase()}</div>
    <div><strong>DATE:</strong> ${currentDate}</div>
    <div><strong>FEES:</strong> ₹0 (FREE OF COST)</div>
  </div>

  <!-- Scheme Title Box -->
  <div class="scheme-title-box">
    <h1>${title}</h1>
    <div class="dept-line">
      Official Portal: <strong>${scheme.officialPortalUrl}</strong> • Benefit Type: <strong>${scheme.benefitType}</strong>
    </div>
  </div>

  <!-- Section 1: Financial Entitlement -->
  <div class="section-title">1. Financial Entitlement & Key Benefits</div>
  <div class="benefit-box">
    <div class="amount">${scheme.benefitAmountText}</div>
    <div class="mode">
      Disbursement Mode: Direct Benefit Transfer (DBT) via Aadhaar-seeded NPCI Bank Account.
    </div>
  </div>
  <p style="font-size: 9.5pt; margin-top: 4px; margin-bottom: 10px;">
    ${desc}
  </p>

  <!-- Section 2: Statutory Eligibility Criteria -->
  <div class="section-title">2. Statutory Eligibility Criteria</div>
  <table>
    <thead>
      <tr>
        <th style="width: 35%;">Eligibility Parameter</th>
        <th>Prescribed Requirement / Statutory Criteria</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Age Criterion</strong></td>
        <td>${scheme.minAge ? scheme.minAge + ' years' : 'Any Age'} ${scheme.maxAge ? 'to ' + scheme.maxAge + ' years' : ''}</td>
      </tr>
      <tr>
        <td><strong>Annual Income Ceiling</strong></td>
        <td>${scheme.maxIncome ? 'Up to ₹' + scheme.maxIncome.toLocaleString('en-IN') + ' per annum' : 'No Income Ceiling Prescribed'}</td>
      </tr>
      <tr>
        <td><strong>Eligible Occupations</strong></td>
        <td>${scheme.eligibleOccupations?.join(', ') || 'Open to all categories of citizens'}</td>
      </tr>
      <tr>
        <td><strong>Eligible Social Category</strong></td>
        <td>${scheme.eligibleCategories?.join(', ') || 'General, SC, ST, OBC/BC, EWS'}</td>
      </tr>
      <tr>
        <td><strong>Target Gender</strong></td>
        <td>${scheme.targetGenders?.join(', ') || 'All Genders'}</td>
      </tr>
      <tr>
        <td><strong>Domicile Requirement</strong></td>
        <td>${scheme.requiresPunjabDomicile ? 'Bonafide Resident / Domicile of Punjab Mandatory' : 'All-India National Coverage'}</td>
      </tr>
      ${scheme.maxLandholdingAcres ? `
      <tr>
        <td><strong>Landholding Ceiling</strong></td>
        <td>Maximum up to ${scheme.maxLandholdingAcres} Acres of agricultural land</td>
      </tr>` : ''}
      ${scheme.requiresDisability ? `
      <tr>
        <td><strong>Special Disability Condition</strong></td>
        <td>Benchmark Disability of 40% or more certified by Civil Surgeon</td>
      </tr>` : ''}
      ${scheme.requiresWidow ? `
      <tr>
        <td><strong>Marital / Social Status</strong></td>
        <td>Widow, Destitute Woman, or Single Mother</td>
      </tr>` : ''}
      <tr>
        <td><strong>Application Timeline</strong></td>
        <td>${scheme.applicationDeadline} (Cycle: ${scheme.deadlineType})</td>
      </tr>
    </tbody>
  </table>

  <!-- Section 3: Document Checklist -->
  <div class="section-title">3. Required Documents Checklist (For Sewa Kendra / Online Submission)</div>
  <table>
    <thead>
      <tr>
        <th style="width: 8%; text-align: center;">Tick</th>
        <th style="width: 42%;">Document Name</th>
        <th style="width: 32%;">Issuing Authority</th>
        <th style="width: 18%;">Status</th>
      </tr>
    </thead>
    <tbody>
      ${scheme.requiredDocuments.map(doc => {
        const meta = getDocumentMeta(doc.nameEn);
        const name = lang === 'pa' ? doc.namePa : lang === 'hi' ? doc.nameHi : doc.nameEn;
        return `<tr>
          <td style="text-align: center;"><span class="checkbox-square"></span></td>
          <td><strong>${meta.emoji} ${name}</strong></td>
          <td>${doc.issuingAuthority} ${doc.availableOnDigiLocker ? '<br><small style="color:#0f766e;">(Available on DigiLocker)</small>' : ''}</td>
          <td>
            <span class="${meta.isMandatory ? 'badge-mandatory' : 'badge-optional'}">
              ${meta.isMandatory ? 'MANDATORY' : 'IF APPLICABLE'}
            </span>
          </td>
        </tr>`;
      }).join('')}
    </tbody>
  </table>

  <!-- Section 4: Application Procedure -->
  <div class="section-title">4. Step-by-Step Application Procedure</div>
  <ol class="steps-list">
    ${scheme.applicationSteps.map(step => {
      const stepTitle = lang === 'pa' ? step.titlePa : lang === 'hi' ? step.titleHi : step.titleEn;
      const stepDesc = lang === 'pa' ? step.descriptionPa : lang === 'hi' ? step.descriptionHi : step.descriptionEn;
      return `<li><strong>Step ${step.stepNumber}: ${stepTitle}</strong> — ${stepDesc}</li>`;
    }).join('')}
  </ol>

  <!-- Official Safety Advisory -->
  <div class="advisory-box">
    <strong>⚠️ ANTI-FRAUD CITIZEN ADVISORY:</strong>
    All welfare schemes under the Government of India and Government of Punjab are provided 100% free of charge. Do NOT pay money to any unauthorized private middlemen or agents. Only apply on verified <strong>.gov.in</strong> portals or in person at official Punjab Sewa Kendras. Report scam messages to National Cybercrime Helpline <strong>1930</strong>.
  </div>

  <!-- Signatures / Acknowledgement -->
  <div class="signature-grid">
    <div class="sig-col">
      <div class="sig-line"></div>
      <div><strong>Applicant Signature / Thumb Impression</strong></div>
      <div style="font-size: 8pt; color: #64748b;">Date: __________________</div>
    </div>
    <div class="sig-col">
      <div class="sig-line"></div>
      <div><strong>Punjab Sewa Kendra / Tehsil Officer Stamp</strong></div>
      <div style="font-size: 8pt; color: #64748b;">Operator ID & Date: __________________</div>
    </div>
  </div>

  <!-- Footer -->
  <div class="helpline-footer">
    Official Helpline: ${isPunjab ? 'Punjab Citizen Helpline 1100 (Toll-Free)' : 'National Citizen Helpdesk 1800-11-0031'} • Generated via Punjab Scheme Navigator AI (CTBF-AI-07)
  </div>

</body>
</html>`;
}

/**
 * Triggers the browser's native Print / Save as PDF dialog
 * by rendering the government template into an isolated hidden iframe.
 * Completely compliant with sandbox constraints (avoids window.open).
 */
export function printSchemeDocument(scheme: Scheme, lang: 'en' | 'pa' | 'hi' = 'en') {
  try {
    let printFrame = document.getElementById('scheme-print-frame') as HTMLIFrameElement | null;
    
    if (!printFrame) {
      printFrame = document.createElement('iframe');
      printFrame.id = 'scheme-print-frame';
      printFrame.style.position = 'fixed';
      printFrame.style.right = '0';
      printFrame.style.bottom = '0';
      printFrame.style.width = '0';
      printFrame.style.height = '0';
      printFrame.style.border = '0';
      printFrame.setAttribute('aria-hidden', 'true');
      document.body.appendChild(printFrame);
    }

    const doc = printFrame.contentWindow?.document;
    if (!doc) {
      // Fallback
      window.print();
      return;
    }

    const html = getGovernmentPrintTemplate(scheme, lang);
    doc.open();
    doc.write(html);
    doc.close();

    setTimeout(() => {
      try {
        printFrame?.contentWindow?.focus();
        printFrame?.contentWindow?.print();
      } catch (err) {
        console.warn('Iframe print error, falling back:', err);
        window.print();
      }
    }, 350);
  } catch (error) {
    console.error('Print scheme error:', error);
    window.print();
  }
}

/**
 * Also allows downloading the full HTML document directly
 */
export function downloadSchemeHtmlDocument(scheme: Scheme, lang: 'en' | 'pa' | 'hi' = 'en') {
  const html = getGovernmentPrintTemplate(scheme, lang);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${scheme.id}-official-factsheet.html`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
