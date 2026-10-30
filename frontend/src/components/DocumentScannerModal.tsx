import React, { useState } from 'react';
import { Scheme, Language } from '../types/scheme';
import { GOV_SCHEMES } from '../data/schemes';
import { 
  X, 
  Sparkles, 
  FileCheck2, 
  AlertCircle, 
  CheckCircle2, 
  UploadCloud, 
  Scan, 
  ShieldCheck, 
  Building2, 
  ExternalLink,
  RefreshCw,
  FolderOpen,
  ArrowRight,
  FileText
} from 'lucide-react';

interface DocumentScannerModalProps {
  currentLang: Language;
  onClose: () => void;
  targetScheme?: Scheme | null;
  userOwnedDocs: Set<string>;
  onAddOwnedDoc: (docKey: string) => void;
  onRemoveOwnedDoc: (docKey: string) => void;
}

interface SampleDoc {
  nameEn: string;
  namePa: string;
  nameHi: string;
  key: string;
  authority: string;
  sampleId: string;
  isDigiLocker: boolean;
}

const SAMPLE_DOCS: SampleDoc[] = [
  {
    key: 'aadhaar card linked with mobile',
    nameEn: 'Aadhaar Card (Linked with Mobile)',
    namePa: 'ਮੋਬਾਈਲ ਨਾਲ ਲਿੰਕ ਆਧਾਰ ਕਾਰਡ',
    nameHi: 'मोबाइल से लिंक आधार कार्ड',
    authority: 'UIDAI Govt of India',
    sampleId: 'XXXX-XXXX-8912',
    isDigiLocker: true
  },
  {
    key: 'land ownership records (fard / jamabandi)',
    nameEn: 'Land Ownership Records (Fard / Jamabandi)',
    namePa: 'ਜ਼ਮੀਨ ਦੀ ਫ਼ਰਦ / ਜਮ੍ਹਾਂਬੰਦੀ ਰਿਕਾਰਡ',
    nameHi: 'भूमि स्वामित्व रिकॉर्ड (जमाबंदी/फ़र्द)',
    authority: 'Revenue Department Punjab (PLRS)',
    sampleId: 'PLRS-FARD-2026/08912',
    isDigiLocker: false
  },
  {
    key: 'punjab residence / domicile certificate',
    nameEn: 'Punjab Residence / Domicile Certificate',
    namePa: 'ਪੰਜਾਬ ਰਿਹਾਇਸ਼ੀ / ਡੋਮੀਸਾਈਲ ਸਰਟੀਫਿਕੇਟ',
    nameHi: 'पंजाब निवास / अधिवास प्रमाण पत्र',
    authority: 'Tehsildar / DC Office Punjab',
    sampleId: 'PB-DOM-2024-99120',
    isDigiLocker: true
  },
  {
    key: 'annual income certificate (issued by tehsildar/sdm)',
    nameEn: 'Income Certificate (Issued by Tehsildar/SDM)',
    namePa: 'ਆਮਦਨ ਸਰਟੀਫਿਕੇਟ (ਤਹਿਸੀਲਦਾਰ ਵੱਲੋਂ ਜਾਰੀ)',
    nameHi: 'आय प्रमाण पत्र (तहसीलदार द्वारा जारी)',
    authority: 'Sub-Divisional Magistrate / Tehsildar',
    sampleId: 'PB-INC-2026-44129',
    isDigiLocker: true
  },
  {
    key: 'sc / st / bc caste certificate',
    nameEn: 'SC / ST / BC Caste Certificate',
    namePa: 'ਅਨੁਸੂਚਿਤ ਜਾਤੀ / ਪੱਛੜੀ ਸ਼੍ਰੇਣੀ ਸਰਟੀਫਿਕੇਟ',
    nameHi: 'अनुसूचित जाति / पिछड़ा वर्ग प्रमाण पत्र',
    authority: 'Department of Social Justice, Punjab',
    sampleId: 'PB-SC-2023-11843',
    isDigiLocker: true
  },
  {
    key: 'active bank passbook (npci mapped)',
    nameEn: 'Active Bank Passbook (NPCI Mapped)',
    namePa: 'ਬੈਂਕ ਪਾਸਬੁੱਕ (NPCI ਆਧਾਰ ਲਿੰਕ)',
    nameHi: 'सक्रिय बैंक पासबुक (NPCI मैप किया गया)',
    authority: 'Scheduled Commercial Bank / PNB / SBI',
    sampleId: 'A/C: *******8821 (IFSC: PUNB0012)',
    isDigiLocker: true
  },
  {
    key: 'nfsa smart ration card / blue card',
    nameEn: 'NFSA Smart Ration Card / Blue Card',
    namePa: 'ਸਮਾਰਟ ਰਾਸ਼ਨ ਕਾਰਡ (ਨੀਲਾ ਕਾਰਡ)',
    nameHi: 'स्मार्ट राशन कार्ड (नीला कार्ड)',
    authority: 'Food & Civil Supplies Department Punjab',
    sampleId: 'PB-NFSA-901238',
    isDigiLocker: true
  }
];

export const DocumentScannerModal: React.FC<DocumentScannerModalProps> = ({
  currentLang,
  onClose,
  targetScheme,
  userOwnedDocs,
  onAddOwnedDoc,
  onRemoveOwnedDoc
}) => {
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(
    targetScheme?.id || 'pm-kisan'
  );
  const [scanningDocKey, setScanningDocKey] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scannedFeedback, setScannedFeedback] = useState<string | null>(null);

  const activeScheme = GOV_SCHEMES.find(s => s.id === selectedSchemeId) || GOV_SCHEMES[0];

  const handleSimulateScan = (doc: SampleDoc) => {
    setScanningDocKey(doc.key);
    setScanProgress(15);
    setScannedFeedback('Reading document metadata & barcode...');

    const timer1 = setTimeout(() => {
      setScanProgress(55);
      setScannedFeedback('Performing OCR text extraction & verifying issuing authority...');
    }, 450);

    const timer2 = setTimeout(() => {
      setScanProgress(85);
      setScannedFeedback('Validating security seal with Punjab e-District & DigiLocker schema...');
    }, 850);

    const timer3 = setTimeout(() => {
      setScanProgress(100);
      setScannedFeedback(`Successfully Verified: ${doc.nameEn} (${doc.sampleId})`);
      onAddOwnedDoc(doc.key);
      setScanningDocKey(null);
    }, 1300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  // Analyze missing documents for active scheme
  const schemeDocs = activeScheme.requiredDocuments;
  const verifiedCount = schemeDocs.filter(d => userOwnedDocs.has(d.nameEn.toLowerCase())).length;
  const missingCount = schemeDocs.length - verifiedCount;
  const readinessPct = Math.round((verifiedCount / (schemeDocs.length || 1)) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div 
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="scanner-modal-title"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-teal-900 text-white p-5 sm:p-6 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-teal-500/20 text-teal-300 text-xs font-bold px-3 py-1 rounded-full border border-teal-400/30">
              <Scan className="w-3.5 h-3.5" />
              <span>AI Document Scanner &amp; Missing Document Detector</span>
            </div>
            <h2 id="scanner-modal-title" className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Smart Citizen Document Scanner
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Scan or attach your identity and revenue certificates. The AI engine flags missing documents required for government verification and guides you to Punjab Sewa Kendras.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
            aria-label="Close document scanner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Target Scheme Selector */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label htmlFor="scheme-doc-select" className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-700" />
                <span>Evaluate Document Readiness for Target Scheme:</span>
              </label>

              <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                readinessPct === 100 
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : readinessPct >= 50
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-rose-100 text-rose-800 border-rose-300'
              }`}>
                {readinessPct}% Documents Ready ({verifiedCount}/{schemeDocs.length})
              </span>
            </div>

            <select
              id="scheme-doc-select"
              value={selectedSchemeId}
              onChange={(e) => setSelectedSchemeId(e.target.value)}
              className="w-full bg-white border border-slate-300 text-slate-900 text-sm font-semibold rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            >
              {GOV_SCHEMES.map((scheme) => (
                <option key={scheme.id} value={scheme.id}>
                  {currentLang === 'pa' ? scheme.titlePa : currentLang === 'hi' ? scheme.titleHi : scheme.titleEn} ({scheme.benefitAmountText})
                </option>
              ))}
            </select>
          </div>

          {/* Missing Document Detector Results for Selected Scheme */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>Missing Document Detector Results</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                {missingCount === 0 ? 'All Documents Available!' : `${missingCount} Missing Certificate(s)`}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {schemeDocs.map((doc, idx) => {
                const isPossessed = userOwnedDocs.has(doc.nameEn.toLowerCase());
                const docTitle = currentLang === 'pa' ? doc.namePa : currentLang === 'hi' ? doc.nameHi : doc.nameEn;

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                      isPossessed
                        ? 'bg-emerald-50/80 border-emerald-300'
                        : 'bg-rose-50/80 border-rose-300 ring-1 ring-rose-400/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          isPossessed ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                        }`}>
                          {isPossessed ? '✓ Verified in Wallet' : '⚠️ Missing Document'}
                        </span>

                        {doc.availableOnDigiLocker && (
                          <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded-md">
                            DigiLocker Ready
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 mt-2">
                        {docTitle}
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Issuing Authority: <strong className="text-slate-800">{doc.issuingAuthority}</strong>
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs">
                      {isPossessed ? (
                        <button
                          type="button"
                          onClick={() => onRemoveOwnedDoc(doc.nameEn.toLowerCase())}
                          className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold underline"
                        >
                          Remove from Wallet
                        </button>
                      ) : (
                        <div className="w-full flex items-center justify-between gap-2">
                          <span className="text-[10px] text-rose-700 font-semibold">
                            Get at Sewa Kendra or DigiLocker
                          </span>
                          <button
                            type="button"
                            onClick={() => onAddOwnedDoc(doc.nameEn.toLowerCase())}
                            className="bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-xs"
                          >
                            Mark As Possessed
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Scanner Simulator Box */}
          <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 text-white rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
                  <Scan className="w-4 h-4 text-teal-400" />
                  <span>Interactive AI Scanner: Scan Sample Documents</span>
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Click any document below to simulate real-time AI OCR extraction and verification against Punjab government databases.
                </p>
              </div>

              {scanningDocKey && (
                <div className="flex items-center gap-2 text-xs font-bold text-teal-300 bg-teal-900/60 px-3 py-1.5 rounded-lg border border-teal-500/30">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Scanning... {scanProgress}%</span>
                </div>
              )}
            </div>

            {/* Scan feedback alert */}
            {scannedFeedback && (
              <div className="p-3 bg-teal-950/80 border border-teal-500/40 rounded-xl text-xs text-teal-200 font-medium animate-in fade-in">
                {scannedFeedback}
              </div>
            )}

            {/* Sample Doc Quick Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {SAMPLE_DOCS.map((doc) => {
                const isPossessed = userOwnedDocs.has(doc.key);
                const isCurrentlyScanning = scanningDocKey === doc.key;

                return (
                  <button
                    key={doc.key}
                    type="button"
                    disabled={isCurrentlyScanning}
                    onClick={() => handleSimulateScan(doc)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isCurrentlyScanning
                        ? 'bg-teal-900/80 border-teal-400 text-white ring-2 ring-teal-400'
                        : isPossessed
                        ? 'bg-slate-800/80 border-emerald-500/60 text-slate-200 hover:border-emerald-400'
                        : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-500'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] text-teal-400 font-mono font-bold truncate">
                          {doc.sampleId}
                        </span>
                        {isPossessed && (
                          <span className="text-[9px] bg-emerald-900 text-emerald-300 font-bold px-1.5 py-0.2 rounded-md">
                            Scanned
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-white mt-1 line-clamp-1">
                        {doc.nameEn}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                        {doc.authority}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] font-semibold text-teal-300">
                      <span>{isPossessed ? 'Re-scan Document' : 'Click to Scan Document'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-600 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
            <span>Zero Data Storage: Scans are processed locally in your browser for privacy.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            Done &amp; Return to Schemes
          </button>
        </div>
      </div>
    </div>
  );
};
