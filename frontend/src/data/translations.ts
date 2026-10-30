import { Language } from '../types/scheme';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    appTitle: 'Punjab Scheme Navigator AI',
    appSubtitle: 'Government Scheme Eligibility Navigator (CTBF-AI-07) for Punjab & Central Schemes',
    tagline: 'Discover, check eligibility, assemble documents, and apply for 24+ government welfare schemes.',
    punjabGovt: 'Government of Punjab',
    centralGovt: 'Government of India',
    ctBuildFest: 'CT BuildFest 2.0 • E-Governance & Citizen Services Track',
    helplineText: 'Punjab Citizen Helpline: 1100 (Toll-Free)',
    
    // Tabs
    tabDashboard: 'Overview & Schemes',
    tabInsights: 'Dashboard Insights',
    tabEligibilityWizard: 'Eligibility Checker',
    tabVideoGuides: 'Video Guides',
    tabScanner: 'AI Document Scanner',
    tabFamilyFinder: 'Family Benefit Finder',
    tabWhatIf: 'What-If Simulator',
    tabDocuments: 'Smart Document Checklist',
    tabDistricts: 'District Sewa Kendras',
    tabDeadlines: 'Deadline Reminders',
    tabTracker: 'Application Tracker',
    tabFraudShield: 'Cyber Fraud Shield',
    tabSaved: 'Saved Schemes',
    tabChatbot: 'AI Assistant',

    // Hero stats
    statSchemes: '24+ Verified Schemes',
    statDistricts: '23 Punjab Districts',
    statCoverage: '₹5 Lakh Health Cover',
    statFree: '100% Free Citizen Service',

    // Questionnaire
    wizardTitle: 'Check Your Scheme Eligibility',
    wizardSubtitle: 'Answer simple questions to instantly find schemes you and your family qualify for.',
    ageLabel: 'Your Age (Years)',
    genderLabel: 'Gender',
    occupationLabel: 'Occupation',
    incomeLabel: 'Annual Household Income (₹ INR)',
    categoryLabel: 'Social Category',
    districtLabel: 'District in Punjab',
    domicileLabel: 'Resident / Domicile of Punjab?',
    landholdingLabel: 'Agricultural Landholding (Acres)',
    disabilityLabel: 'Person with Benchmark Disability (≥ 40%)?',
    widowLabel: 'Widow / Destitute / Single Mother?',
    studentLabel: 'Currently Enrolled in School / College / ITI?',
    checkButton: 'Find My Eligible Schemes',
    resetButton: 'Reset Filters',

    // Filters & Tags
    allSchemes: 'All Schemes',
    filterFarmers: 'Farmers',
    filterStudents: 'Students & Youth',
    filterWomen: 'Women & Girls',
    filterSenior: 'Senior Citizens',
    filterBPL: 'BPL / Low Income',
    filterHealth: 'Health & Medical',
    filterLoans: 'Self-Employment & Loans',
    filterSaved: 'Saved Schemes',

    // Smart Eligibility Search Bar
    searchPlaceholder: "Search scheme or type eligibility (e.g. 'farmer SC Ludhiana', 'age 60 pension', 'student scholarship')...",
    eligibilityFilters: 'Eligibility Filters',
    onlyEligible: 'Show Only My Eligible Schemes',
    activeCriteria: 'Your Eligibility in Search',
    modifyCriteria: 'Adjust Eligibility Criteria',
    hideCriteria: 'Hide Filters',
    clearSearch: 'Clear',

    // Scheme card
    confirmedMatch: 'Confirmed Eligible',
    potentialMatch: 'Potential Match',
    notEligible: 'Not Eligible',
    viewDetails: 'View Details & Apply',
    saveScheme: 'Save Scheme',
    savedScheme: 'Saved',
    noSavedSchemes: 'No Saved Schemes Yet',
    noSavedSchemesDesc: 'Click the bookmark ribbon on any scheme to save it for quick review, family discussion, and application.',
    officialPortal: 'Official Portal',
    watchTutorial: 'Watch Video Guide',
    verifiedSource: 'Verified Official Source',
    deadline: 'Deadline',
    benefits: 'Key Benefits',
    documents: 'Required Documents',

    // Family Finder
    familyTitle: 'Family Benefit Finder',
    familySubtitle: 'Add members of your household to calculate pooled benefits across the entire family.',
    addMember: '+ Add Family Member',
    totalPotential: 'Total Potential Family Entitlement',
    annualSavings: 'Estimated Cash & Subsidies Value',

    // What-If Simulator
    whatIfTitle: 'What-If Eligibility Simulator',
    whatIfSubtitle: 'Experiment with income, age, landholding, and category to see how government eligibility changes dynamically.',
    incomeSlider: 'Simulate Annual Income: ₹',
    ageSlider: 'Simulate Age: ',
    impactTitle: 'Eligibility Impact Analysis',

    // Smart Documents
    docTitle: 'Smart Document Checklist & Readiness',
    docSubtitle: 'Select the documents you currently hold. The engine identifies missing certificates and tells you where to obtain them.',
    docsOwned: 'Documents You Have',
    docsMissing: 'Documents You Need to Arrange',
    getAtSewaKendra: 'Obtain at Punjab Sewa Kendra / DigiLocker',

    // Fraud Shield
    fraudTitle: 'Official Government Security & Fraud Protection Alert',
    fraudWarning1: 'Never pay application fees to private agents or unauthorized cyber cafes. Official Punjab welfare schemes are free.',
    fraudWarning2: 'Always look for .gov.in or .nic.in domain names. Government officials never ask for OTPs or passwords.',

    // Voice & Chat
    chatHeader: 'Punjab Scheme AI Assistant',
    chatPlaceholder: 'Ask in English, ਪੰਜਾਬੀ, or हिन्दी (e.g. "What schemes are available for farmers in Ludhiana?")...',
    voiceListening: 'Listening... Speak now in Punjabi, Hindi, or English',
    voiceButton: 'Voice Search',
    quickQuestions: 'Quick Questions',
    speechNotSupported: 'Speech recognition is not supported in this browser. Please type your message.'
  },
  pa: {
    appTitle: 'ਪੰਜਾਬ ਸਕੀਮ ਨੈਵੀਗੇਟਰ ਏ.ਆਈ',
    appSubtitle: 'ਸਰਕਾਰੀ ਸਕੀਮ ਯੋਗਤਾ ਨੈਵੀਗੇਟਰ (CTBF-AI-07) - ਪੰਜਾਬ ਅਤੇ ਕੇਂਦਰ ਸਰਕਾਰ ਦੀਆਂ ਸਕੀਮਾਂ',
    tagline: '24+ ਸਰਕਾਰੀ ਭਲਾਈ ਸਕੀਮਾਂ ਦੀ ਯੋਗਤਾ ਜਾਣੋ, ਦਸਤਾਵੇਜ਼ ਚੈੱਕ ਕਰੋ ਅਤੇ ਆਨਲਾਈਨ ਅਪਲਾਈ ਕਰੋ।',
    punjabGovt: 'ਪੰਜਾਬ ਸਰਕਾਰ',
    centralGovt: 'ਭਾਰਤ ਸਰਕਾਰ',
    ctBuildFest: 'ਸੀ.ਟੀ ਬਿਲਡਫੈਸਟ 2.0 • ਈ-ਗਵਰਨੈਂਸ ਅਤੇ ਨਾਗਰਿਕ ਸੇਵਾਵਾਂ ਟਰੈਕ',
    helplineText: 'ਪੰਜਾਬ ਨਾਗਰਿਕ ਹੈਲਪਲਾਈਨ: 1100 (ਟੋਲ-ਫ੍ਰੀ)',

    // Tabs
    tabDashboard: 'ਸਾਰੀਆਂ ਸਕੀਮਾਂ',
    tabInsights: 'ਡੈਸ਼ਬੋਰਡ ਅੰਕੜੇ (Insights)',
    tabEligibilityWizard: 'ਯੋਗਤਾ ਚੈਕਰ',
    tabVideoGuides: 'ਵੀਡੀਓ ਗਾਈਡਾਂ',
    tabScanner: 'ਏ.ਆਈ ਦਸਤਾਵੇਜ਼ ਸਕੈਨਰ',
    tabFamilyFinder: 'ਪਰਿਵਾਰਕ ਲਾਭ ਖੋਜਕ',
    tabWhatIf: 'ਵਟ-ਇਫ਼ ਸਿਮੂਲੇਟਰ',
    tabDocuments: 'ਸਮਾਰਟ ਦਸਤਾਵੇਜ਼ ਸੂਚੀ',
    tabDistricts: 'ਜ਼ਿਲ੍ਹਾ ਸੇਵਾ ਕੇਂਦਰ',
    tabDeadlines: 'ਆਖਰੀ ਮਿਤੀ ਰੀਮਾਈਂਡਰ',
    tabTracker: 'ਅਰਜ਼ੀ ਟਰੈਕਰ',
    tabFraudShield: 'ਸਾਈਬਰ ਧੋਖਾਧੜੀ ਸੁਰੱਖਿਆ',
    tabSaved: 'ਸੰਭਾਲੀਆਂ ਸਕੀਮਾਂ',
    tabChatbot: 'ਏ.ਆਈ ਸਹਾਇਕ',

    // Hero stats
    statSchemes: '24+ ਪ੍ਰਮਾਣਿਤ ਸਕੀਮਾਂ',
    statDistricts: '23 ਪੰਜਾਬ ਦੇ ਜ਼ਿਲ੍ਹੇ',
    statCoverage: '₹5 ਲੱਖ ਮੁਫ਼ਤ ਇਲਾਜ',
    statFree: '100% ਮੁਫ਼ਤ ਨਾਗਰਿਕ ਸੇਵਾ',

    // Questionnaire
    wizardTitle: 'ਆਪਣੀ ਸਰਕਾਰੀ ਸਕੀਮ ਯੋਗਤਾ ਚੈੱਕ ਕਰੋ',
    wizardSubtitle: 'ਕੁੱਝ ਸਰਲ ਸਵਾਲਾਂ ਦੇ ਜਵਾਬ ਦਿਓ ਅਤੇ ਜਾਣੋ ਤੁਸੀਂ ਕਿਹੜੀਆਂ ਸਕੀਮਾਂ ਲਈ ਯੋਗ ਹੋ।',
    ageLabel: 'ਤੁਹਾਡੀ ਉਮਰ (ਸਾਲ)',
    genderLabel: 'ਲਿੰਗ',
    occupationLabel: 'ਕਿੱਤਾ / ਰੋਜ਼ਗਾਰ',
    incomeLabel: 'ਸਾਲਾਨਾ ਪਰਿਵਾਰਕ ਆਮਦਨ (₹ ਰੁਪਏ)',
    categoryLabel: 'ਸਮਾਜਿਕ ਸ਼੍ਰੇਣੀ',
    districtLabel: 'ਪੰਜਾਬ ਦਾ ਜ਼ਿਲ੍ਹਾ',
    domicileLabel: 'ਕੀ ਤੁਸੀਂ ਪੰਜਾਬ ਦੇ ਵਸਨੀਕ ਹੋ?',
    landholdingLabel: 'ਖੇਤੀਯੋਗ ਜ਼ਮੀਨ (ਏਕੜ)',
    disabilityLabel: 'ਦਿਵਿਆਂਗਤਾ (40% ਜਾਂ ਵੱਧ)?',
    widowLabel: 'ਵਿਧਵਾ / ਬੇਸਹਾਰਾ / ਇਕੱਲੀ ਮਾਂ?',
    studentLabel: 'ਕੀ ਤੁਸੀਂ ਸਕੂਲ/ਕਾਲਜ/ITI ਦੇ ਵਿਦਿਆਰਥੀ ਹੋ?',
    checkButton: 'ਯੋਗ ਸਕੀਮਾਂ ਲੱਭੋ',
    resetButton: 'ਰੀਸੈੱਟ ਕਰੋ',

    // Filters & Tags
    allSchemes: 'ਸਾਰੀਆਂ ਸਕੀਮਾਂ',
    filterFarmers: 'ਕਿਸਾਨ',
    filterStudents: 'ਵਿਦਿਆਰਥੀ ਤੇ ਨੌਜਵਾਨ',
    filterWomen: 'ਔਰਤਾਂ ਤੇ ਬੱਚੀਆਂ',
    filterSenior: 'ਬਜ਼ੁਰਗ ਨਾਗਰਿਕ',
    filterBPL: 'ਗਰੀਬ / ਬੀ.ਪੀ.ਐਲ',
    filterHealth: 'ਸਿਹਤ ਤੇ ਇਲਾਜ',
    filterLoans: 'ਸਵੈ-ਰੋਜ਼ਗਾਰ ਤੇ ਕਰਜ਼ੇ',
    filterSaved: 'ਸੰਭਾਲੀਆਂ ਸਕੀਮਾਂ',

    // Smart Eligibility Search Bar
    searchPlaceholder: "ਸਕੀਮ ਖੋਜੋ ਜਾਂ ਯੋਗਤਾ ਲਿਖੋ (ਜਿਵੇਂ ਕਿ 'ਕਿਸਾਨ ਲੁਧਿਆਣਾ', 'ਉਮਰ 60 ਪੈਨਸ਼ਨ', 'SC ਵਿਦਿਆਰਥੀ')...",
    eligibilityFilters: 'ਯੋਗਤਾ ਫਿਲਟਰ',
    onlyEligible: 'ਸਿਰਫ ਮੇਰੇ ਲਈ ਯੋਗ ਸਕੀਮਾਂ ਦਿਖਾਓ',
    activeCriteria: 'ਸਰਚ ਵਿੱਚ ਯੋਗਤਾ ਸ਼ਰਤਾਂ',
    modifyCriteria: 'ਯੋਗਤਾ ਸ਼ਰਤਾਂ ਬਦਲੋ',
    hideCriteria: 'ਫਿਲਟਰ ਲੁਕਾਓ',
    clearSearch: 'ਸਾਫ਼ ਕਰੋ',

    // Scheme card
    confirmedMatch: 'ਪੂਰੀ ਤਰ੍ਹਾਂ ਯੋਗ',
    potentialMatch: 'ਸੰਭਾਵੀ ਯੋਗ',
    notEligible: 'ਯੋਗ ਨਹੀਂ',
    viewDetails: 'ਵੇਰਵੇ ਦੇਖੋ ਅਤੇ ਅਪਲਾਈ ਕਰੋ',
    saveScheme: 'ਸਕੀਮ ਸੇਵ ਕਰੋ',
    savedScheme: 'ਸੇਵ ਕੀਤੀ',
    noSavedSchemes: 'ਅਜੇ ਕੋਈ ਸਕੀਮ ਸੇਵ ਨਹੀਂ ਕੀਤੀ ਗਈ',
    noSavedSchemesDesc: 'ਕਿਸੇ ਵੀ ਸਕੀਮ \'ਤੇ ਬੁੱਕਮਾਰਕ ਆਈਕਨ \'ਤੇ ਕਲਿੱਕ ਕਰਕੇ ਉਸਨੂੰ ਬਾਅਦ ਵਿੱਚ ਦੇਖਣ ਲਈ ਸੇਵ ਕਰੋ।',
    officialPortal: 'ਸਰਕਾਰੀ ਪੋਰਟਲ',
    watchTutorial: 'ਵੀਡੀਓ ਗਾਈਡ ਦੇਖੋ',
    verifiedSource: 'ਤਸਦੀਕਸ਼ੁਦਾ ਸਰਕਾਰੀ ਸਰੋਤ',
    deadline: 'ਆਖਰੀ ਮਿਤੀ',
    benefits: 'ਮੁੱਖ ਲਾਭ',
    documents: 'ਲੋੜੀਂਦੇ ਦਸਤਾਵੇਜ਼',

    // Family Finder
    familyTitle: 'ਪਰਿਵਾਰਕ ਲਾਭ ਖੋਜਕ (Family Benefit Finder)',
    familySubtitle: 'ਪਰਿਵਾਰ ਦੇ ਸਾਰੇ ਜੀਆਂ ਦੇ ਵੇਰਵੇ ਜੋੜੋ ਅਤੇ ਪੂਰੇ ਪਰਿਵਾਰ ਨੂੰ ਮਿਲਣ ਵਾਲੇ ਕੁੱਲ ਲਾਭ ਦੇਖੋ।',
    addMember: '+ ਪਰਿਵਾਰਕ ਮੈਂਬਰ ਜੋੜੋ',
    totalPotential: 'ਪਰਿਵਾਰ ਦਾ ਕੁੱਲ ਸੰਭਾਵੀ ਸਰਕਾਰੀ ਲਾਭ',
    annualSavings: 'ਸਾਲਾਨਾ ਵਿੱਤੀ ਤੇ ਸਬਸਿਡੀ ਮੁੱਲ',

    // What-If Simulator
    whatIfTitle: 'ਵਟ-ਇਫ਼ ਯੋਗਤਾ ਸਿਮੂਲੇਟਰ (What-If Simulator)',
    whatIfSubtitle: 'ਆਮਦਨ ਜਾਂ ਉਮਰ ਬਦਲ ਕੇ ਦੇਖੋ ਕਿ ਯੋਗਤਾ ਕਿਵੇਂ ਬਦਲਦੀ ਹੈ।',
    incomeSlider: 'ਸਾਲਾਨਾ ਆਮਦਨ ਬਦਲੋ: ₹',
    ageSlider: 'ਉਮਰ ਬਦਲੋ: ',
    impactTitle: 'ਯੋਗਤਾ ਤਬਦੀਲੀ ਵਿਸ਼ਲੇਸ਼ਣ',

    // Smart Documents
    docTitle: 'ਸਮਾਰਟ ਦਸਤਾਵੇਜ਼ ਚੈਕਲਿਸਟ',
    docSubtitle: 'ਜਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਤੁਹਾਡੇ ਕੋਲ ਹਨ ਉਨ੍ਹਾਂ \'ਤੇ ਨਿਸ਼ਾਨ ਲਗਾਓ, ਬਾਕੀ ਦਸਤਾਵੇਜ਼ ਬਣਵਾਉਣ ਦਾ ਤਰੀਕਾ ਜਾਣੋ।',
    docsOwned: 'ਤੁਹਾਡੇ ਕੋਲ ਮੌਜੂਦ ਦਸਤਾਵੇਜ਼',
    docsMissing: 'ਲੋੜੀਂਦੇ ਬਕਾਇਆ ਦਸਤਾਵੇਜ਼',
    getAtSewaKendra: 'ਪੰਜਾਬ ਸੇਵਾ ਕੇਂਦਰ ਜਾਂ ਡਿਜੀਲਾਕਰ ਤੋਂ ਪ੍ਰਾਪਤ ਕਰੋ',

    // Fraud Shield
    fraudTitle: 'ਸਰਕਾਰੀ ਸੁਰੱਖਿਆ ਅਤੇ ਧੋਖਾਧੜੀ ਤੋਂ ਸਾਵਧਾਨੀ ਚੇਤਾਵਨੀ',
    fraudWarning1: 'ਕਿਸੇ ਵੀ ਪ੍ਰਾਈਵੇਟ ਏਜੰਟ ਜਾਂ ਦਲਾਲ ਨੂੰ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਲਈ ਪੈਸੇ ਨਾ ਦਿਓ। ਪੰਜਾਬ ਸਰਕਾਰ ਦੀਆਂ ਭਲਾਈ ਸਕੀਮਾਂ ਮੁਫ਼ਤ ਹਨ।',
    fraudWarning2: 'ਹਮੇਸ਼ਾ .gov.in ਜਾਂ .nic.in ਵਾਲੀਆਂ ਅਧਿਕਾਰਤ ਵੈੱਬਸਾਈਟਾਂ ਦੀ ਵਰਤੋਂ ਕਰੋ। ਕਦੇ ਵੀ ਕਿਸੇ ਨਾਲ ਓ.ਟੀ.ਪੀ ਜਾਂ ਪਾਸਵਰਡ ਸਾਂਝਾ ਨਾ ਕਰੋ।',

    // Voice & Chat
    chatHeader: 'ਪੰਜਾਬ ਸਕੀਮ ਏ.ਆਈ ਸਹਾਇਕ',
    chatPlaceholder: 'ਪੰਜਾਬੀ, ਹਿੰਦੀ ਜਾਂ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਪੁੱਛੋ (ਜਿਵੇਂ ਕਿ "ਕਿਸਾਨਾਂ ਲਈ ਕਿਹੜੀਆਂ ਸਕੀਮਾਂ ਹਨ?")...',
    voiceListening: 'ਸੁਣ ਰਿਹਾ ਹੈ... ਹੁਣ ਬੋਲੋ (ਪੰਜਾਬੀ / ਹਿੰਦੀ / ਅੰਗਰੇਜ਼ੀ)',
    voiceButton: 'ਬੋਲ ਕੇ ਪੁੱਛੋ',
    quickQuestions: 'ਆਮ ਸਵਾਲ',
    speechNotSupported: 'ਇਸ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਬੋਲਣ ਵਾਲੀ ਸਹੂਲਤ ਉਪਲਬਧ ਨਹੀਂ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਲਿਖ ਕੇ ਪੁੱਛੋ।'
  },
  hi: {
    appTitle: 'पंजाब योजना नेविगेटर एआई',
    appSubtitle: 'सरकारी योजना पात्रता नेविगेटर (CTBF-AI-07) - पंजाब व केंद्र सरकार की योजनाएं',
    tagline: '24+ सरकारी कल्याणकारी योजनाओं की पात्रता जांचें, दस्तावेज तैयार करें और आवेदन करें।',
    punjabGovt: 'पंजाब सरकार',
    centralGovt: 'भारत सरकार',
    ctBuildFest: 'सीटी बिल्डफेस्ट 2.0 • ई-गवर्नेंस और नागरिक सेवा ट्रैक',
    helplineText: 'पंजाब नागरिक हेल्पलाइन: 1100 (टोल-फ्री)',

    // Tabs
    tabDashboard: 'सभी योजनाएं',
    tabInsights: 'डैशबोर्ड अंतर्दृष्टि (Insights)',
    tabEligibilityWizard: 'पात्रता चेकर',
    tabVideoGuides: 'वीडियो गाइड',
    tabScanner: 'एआई दस्तावेज स्कैनर',
    tabFamilyFinder: 'परिवार लाभ खोजक',
    tabWhatIf: 'व्हाट-इफ सिम्युलेटर',
    tabDocuments: 'स्मार्ट दस्तावेज सूची',
    tabDistricts: 'जिला सेवा केंद्र',
    tabDeadlines: 'अंतिम तिथि अनुस्मारक',
    tabTracker: 'आवेदन ट्रैकर',
    tabFraudShield: 'साइबर सुरक्षा व अलर्ट',
    tabSaved: 'सहेजी गई योजनाएं',
    tabChatbot: 'एआई सहायक',

    // Hero stats
    statSchemes: '24+ सत्यापित योजनाएं',
    statDistricts: '23 पंजाब जिले',
    statCoverage: '₹5 लाख मुफ्त इलाज',
    statFree: '100% मुफ्त नागरिक सेवा',

    // Questionnaire
    wizardTitle: 'अपनी सरकारी योजना पात्रता जांचें',
    wizardSubtitle: 'सरल प्रश्नों के उत्तर दें और तुरंत जानें कि आप किन योजनाओं के लिए पात्र हैं।',
    ageLabel: 'आपकी आयु (वर्ष)',
    genderLabel: 'लिंग',
    occupationLabel: 'व्यवसाय / कार्य',
    incomeLabel: 'वार्षिक पारिवारिक आय (₹ रुपये)',
    categoryLabel: 'सामाजिक श्रेणी',
    districtLabel: 'पंजाब का जिला',
    domicileLabel: 'क्या आप पंजाब के निवासी हैं?',
    landholdingLabel: 'कृषि योग्य भूमि (एकड़)',
    disabilityLabel: 'दिव्यांगता (40% या अधिक)?',
    widowLabel: 'विधवा / निराश्रित महिला?',
    studentLabel: 'क्या आप स्कूल / कॉलेज के छात्र हैं?',
    checkButton: 'पात्र योजनाएं खोजें',
    resetButton: 'रीसेट करें',

    // Filters & Tags
    allSchemes: 'सभी योजनाएं',
    filterFarmers: 'किसान',
    filterStudents: 'छात्र एवं युवा',
    filterWomen: 'महिलाएं व बेटियां',
    filterSenior: 'वरिष्ठ नागरिक',
    filterBPL: 'गरीब / बीपीएल',
    filterHealth: 'स्वास्थ्य व इलाज',
    filterLoans: 'स्वरोजगार व ऋण',
    filterSaved: 'सहेजी गई योजनाएं',

    // Smart Eligibility Search Bar
    searchPlaceholder: "योजना खोजें या पात्रता लिखें (जैसे 'किसान लुधियाना', 'आयु 60 पेंशन', 'एससी छात्र')...",
    eligibilityFilters: 'पात्रता फिल्टर',
    onlyEligible: 'केवल मेरे लिए पात्र योजनाएं दिखाएं',
    activeCriteria: 'सर्च में पात्रता मानदंड',
    modifyCriteria: 'पात्रता मानदंड बदलें',
    hideCriteria: 'फिल्टर छिपाएं',
    clearSearch: 'हटाएं',

    // Scheme card
    confirmedMatch: 'पूर्णतः पात्र',
    potentialMatch: 'संभावित पात्र',
    notEligible: 'अपात्र',
    viewDetails: 'विवरण देखें और आवेदन करें',
    saveScheme: 'योजना सहेजें',
    savedScheme: 'सहेजी गई',
    noSavedSchemes: 'अभी तक कोई योजना सहेजी नहीं गई',
    noSavedSchemesDesc: 'त्वरित समीक्षा और तुलना के लिए किसी भी योजना पर बुकमार्क आइकन पर क्लिक करके सहेजें।',
    officialPortal: 'सरकारी पोर्टल',
    watchTutorial: 'वीडियो गाइड देखें',
    verifiedSource: 'सत्यापित सरकारी स्रोत',
    deadline: 'अंतिम तिथि',
    benefits: 'प्रमुख लाभ',
    documents: 'आवश्यक दस्तावेज',

    // Family Finder
    familyTitle: 'पारिवारिक लाभ खोजक (Family Benefit Finder)',
    familySubtitle: 'परिवार के सभी सदस्यों को जोड़ें और पूरे परिवार के लिए कुल लाभों का आकलन करें।',
    addMember: '+ परिवार का सदस्य जोड़ें',
    totalPotential: 'परिवार का कुल संभावित सरकारी लाभ',
    annualSavings: 'अनुमानित नकद व सब्सिडी मूल्य',

    // What-If Simulator
    whatIfTitle: 'व्हाट-इफ पात्रता सिम्युलेटर',
    whatIfSubtitle: 'आय और आयु बदलकर देखें कि पात्रता कैसे बदलती है।',
    incomeSlider: 'वार्षिक आय बदलें: ₹',
    ageSlider: 'आयु बदलें: ',
    impactTitle: 'पात्रता प्रभाव विश्लेषण',

    // Smart Documents
    docTitle: 'स्मार्ट दस्तावेज चेकलिस्ट',
    docSubtitle: 'अपने पास मौजूद दस्तावेजों को चुनें, शेष दस्तावेजों को बनवाने का तरीका जानें।',
    docsOwned: 'आपके पास मौजूद दस्तावेज',
    docsMissing: 'आवश्यक शेष दस्तावेज',
    getAtSewaKendra: 'पंजाब सेवा केंद्र या डिजिलॉकर से प्राप्त करें',

    // Fraud Shield
    fraudTitle: 'सरकारी सुरक्षा एवं धोखाधड़ी से बचाव चेतावनी',
    fraudWarning1: 'किसी भी निजी दलाल या अनधिकृत साइबर कैफे को पैसे न दें। पंजाब सरकार की कल्याण योजनाएं निःशुल्क हैं।',
    fraudWarning2: 'हमेशा .gov.in या .nic.in डोमेन वाली आधिकारिक वेबसाइटों का ही उपयोग करें। कभी भी ओटीपी या पासवर्ड साझा न करें।',

    // Voice & Chat
    chatHeader: 'पंजाब योजना एआई सहायक',
    chatPlaceholder: 'पंजाबी, हिंदी या अंग्रेजी में पूछें (उदा. "किसानों के लिए कौन सी योजनाएं हैं?")...',
    voiceListening: 'सुन रहा है... अब बोलें (पंजाबी / हिंदी / अंग्रेजी)',
    voiceButton: 'बोलकर पूछें',
    quickQuestions: 'अक्सर पूछे जाने वाले प्रश्न',
    speechNotSupported: 'इस ब्राउज़र में आवाज पहचान की सुविधा उपलब्ध नहीं है। कृपया लिखकर पूछें।'
  }
};
