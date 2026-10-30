import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { 
  Scheme, 
  EligibilityEvaluation, 
  Language, 
  CitizenProfile 
} from '../types/scheme';
import { 
  PieChart as PieIcon, 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Building2, 
  MapPin, 
  Info,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

interface DashboardInsightsProps {
  schemes: Scheme[];
  evaluations: EligibilityEvaluation[];
  profile: CitizenProfile;
  currentLang: Language;
  onSelectCategory?: (category: string) => void;
  onOpenScheme?: (scheme: Scheme) => void;
}

interface CategoryDataPoint {
  name: string;
  namePa: string;
  nameHi: string;
  value: number;
  color: string;
  schemes: Scheme[];
  eligibleSchemes: Scheme[];
  description: string;
}

const CATEGORY_COLORS = [
  '#0d9488', // teal-600 (Agriculture)
  '#2563eb', // blue-600 (Health)
  '#7c3aed', // violet-600 (Education)
  '#ea580c', // orange-600 (Social Security & Pensions)
  '#0891b2', // cyan-600 (Housing)
  '#db2777', // pink-600 (Women & Family)
  '#16a34a', // green-600 (Employment & MSME)
];

export const DashboardInsights: React.FC<DashboardInsightsProps> = ({
  schemes,
  evaluations,
  profile,
  currentLang,
  onSelectCategory,
  onOpenScheme
}) => {
  const [viewScope, setViewScope] = useState<'eligible' | 'all'>('eligible');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Map of scheme evaluation
  const evaluationMap = useMemo(() => {
    const map = new Map<string, EligibilityEvaluation>();
    evaluations.forEach(e => map.set(e.schemeId, e));
    return map;
  }, [evaluations]);

  // Helper to categorize each scheme into one of the 7 core citizen welfare pillars
  const getPrimaryCategory = (scheme: Scheme): { key: string; labelEn: string; labelPa: string; labelHi: string } => {
    const text = (scheme.titleEn + ' ' + scheme.categoryTags.join(' ') + ' ' + scheme.departmentEn).toLowerCase();
    
    if (text.includes('kisan') || text.includes('crop') || text.includes('farmer') || text.includes('agri') || text.includes('harvest')) {
      return { key: 'Agriculture', labelEn: 'Agriculture & Farming', labelPa: 'ਖੇਤੀਬਾੜੀ ਅਤੇ ਕਿਸਾਨੀ', labelHi: 'कृषि एवं किसानी' };
    }
    if (text.includes('health') || text.includes('sehat') || text.includes('bima') || text.includes('medical') || text.includes('cancer') || text.includes('hospital')) {
      return { key: 'Health', labelEn: 'Health & Medical Care', labelPa: 'ਸਿਹਤ ਅਤੇ ਇਲਾਜ', labelHi: 'स्वास्थ्य एवं चिकित्सा' };
    }
    if (text.includes('scholarship') || text.includes('education') || text.includes('student') || text.includes('matric') || text.includes('school') || text.includes('college')) {
      return { key: 'Education', labelEn: 'Education & Scholarships', labelPa: 'ਸਿੱਖਿਆ ਅਤੇ ਵਜ਼ੀਫ਼ੇ', labelHi: 'शिक्षा एवं छात्रवृत्तियाँ' };
    }
    if (text.includes('pension') || text.includes('old age') || text.includes('disability') || text.includes('widow') || text.includes('destitute') || text.includes('senior')) {
      return { key: 'Social Security', labelEn: 'Social Security & Pensions', labelPa: 'ਸਮਾਜਿਕ ਸੁਰੱਖਿਆ ਅਤੇ ਪੈਨਸ਼ਨਾਂ', labelHi: 'सामाजिक सुरक्षा एवं पेंशन' };
    }
    if (text.includes('awas') || text.includes('housing') || text.includes('shelter') || text.includes('home')) {
      return { key: 'Housing', labelEn: 'Housing & Shelter', labelPa: 'ਰਿਹਾਇਸ਼ ਅਤੇ ਮਕਾਨ', labelHi: 'आवास एवं मकान' };
    }
    if (text.includes('ashirwad') || text.includes('shagun') || text.includes('woman') || text.includes('girl') || text.includes('daughter') || text.includes('maternity') || text.includes('mother')) {
      return { key: 'Women & Family', labelEn: 'Women & Family Welfare', labelPa: 'ਮਹਿਲਾ ਅਤੇ ਪਰਿਵਾਰ ਭਲਾਈ', labelHi: 'महिला एवं परिवार कल्याण' };
    }
    return { key: 'Employment', labelEn: 'Employment & Enterprise', labelPa: 'ਰੋਜ਼ਗਾਰ ਅਤੇ ਕਾਰੋਬਾਰ', labelHi: 'रोजगार एवं उद्योग' };
  };

  // Group schemes by category
  const categoryData: CategoryDataPoint[] = useMemo(() => {
    const catMap = new Map<string, {
      name: string;
      namePa: string;
      nameHi: string;
      schemes: Scheme[];
      eligibleSchemes: Scheme[];
      color: string;
      description: string;
    }>();

    const descriptions: Record<string, string> = {
      'Agriculture': 'Direct income support, subsidized crop insurance, and mechanization for farmers',
      'Health': 'Cashless hospitalization coverage up to ₹5 Lakh and state medical emergency grants',
      'Education': 'Tuition reimbursement, maintenance allowances, and merit scholarships for students',
      'Social Security': 'Monthly direct pensions for seniors, widows, and persons with disabilities',
      'Housing': 'Subsidies and financial grants for pucca homes in rural and urban Punjab',
      'Women & Family': 'Direct marriage financial aid (Ashirwad ₹51,000) and maternal protection',
      'Employment': 'Collateral-free business credit (Mudra) and government self-employment drives'
    };

    schemes.forEach(scheme => {
      const cat = getPrimaryCategory(scheme);
      const isEligible = evaluationMap.get(scheme.id)?.isEligible || false;

      if (!catMap.has(cat.key)) {
        const colorIndex = catMap.size % CATEGORY_COLORS.length;
        catMap.set(cat.key, {
          name: cat.labelEn,
          namePa: cat.labelPa,
          nameHi: cat.labelHi,
          schemes: [],
          eligibleSchemes: [],
          color: CATEGORY_COLORS[colorIndex],
          description: descriptions[cat.key] || 'Welfare schemes under Punjab & Central Government'
        });
      }

      const item = catMap.get(cat.key)!;
      item.schemes.push(scheme);
      if (isEligible) {
        item.eligibleSchemes.push(scheme);
      }
    });

    const result: CategoryDataPoint[] = [];
    catMap.forEach((val) => {
      const count = viewScope === 'eligible' ? val.eligibleSchemes.length : val.schemes.length;
      if (count > 0 || viewScope === 'all') {
        result.push({
          name: val.name,
          namePa: val.namePa,
          nameHi: val.nameHi,
          value: count,
          color: val.color,
          schemes: val.schemes,
          eligibleSchemes: val.eligibleSchemes,
          description: val.description
        });
      }
    });

    // Sort descending by count
    return result.sort((a, b) => b.value - a.value);
  }, [schemes, evaluationMap, viewScope]);

  // Government Level Distribution (Central vs Punjab State)
  const levelDistribution = useMemo(() => {
    let centralCount = 0;
    let stateCount = 0;

    schemes.forEach(s => {
      const isEligible = evaluationMap.get(s.id)?.isEligible;
      const shouldInclude = viewScope === 'eligible' ? isEligible : true;

      if (shouldInclude) {
        if (s.level === 'Central Government') centralCount++;
        else stateCount++;
      }
    });

    return [
      {
        level: currentLang === 'pa' ? 'ਕੇਂਦਰ ਸਰਕਾਰ (Central)' : currentLang === 'hi' ? 'केंद्र सरकार (Central)' : 'Central Government',
        count: centralCount,
        fill: '#0f766e' // teal-700
      },
      {
        level: currentLang === 'pa' ? 'ਪੰਜਾਬ ਸਰਕਾਰ (Punjab State)' : currentLang === 'hi' ? 'पंजाब सरकार (State)' : 'Punjab State Government',
        count: stateCount,
        fill: '#1d4ed8' // blue-700
      }
    ];
  }, [schemes, evaluationMap, viewScope, currentLang]);

  // Totals & KPI metrics
  const totalEligibleCount = useMemo(() => {
    return Array.from(evaluationMap.values()).filter(e => e.isEligible).length;
  }, [evaluationMap]);

  const totalPotentialsCount = useMemo(() => {
    return Array.from(evaluationMap.values()).filter(e => e.isPotentialMatch).length;
  }, [evaluationMap]);

  const totalActiveChartCount = useMemo(() => {
    return categoryData.reduce((acc, curr) => acc + curr.value, 0);
  }, [categoryData]);

  const onPieEnter = (_: unknown, index: number) => {
    setActiveIndex(index);
  };

  const getLocalizedCategoryName = (item: CategoryDataPoint) => {
    if (currentLang === 'pa') return item.namePa;
    if (currentLang === 'hi') return item.nameHi;
    return item.name;
  };

  return (
    <section className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-8">
      {/* Header and Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-800 rounded-full text-xs font-bold border border-teal-200/70">
            <PieIcon className="w-3.5 h-3.5 text-teal-600" />
            <span>
              {currentLang === 'pa' 
                ? 'ਡੈਸ਼ਬੋਰਡ ਅੰਕੜੇ ਅਤੇ ਵੰਡ' 
                : currentLang === 'hi' 
                ? 'डैशबोर्ड अंतर्दृष्टि एवं वितरण' 
                : 'Dashboard Insights & Category Analytics'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {currentLang === 'pa'
              ? 'ਯੋਗ ਯੋਜਨਾਵਾਂ ਦੀ ਸ਼੍ਰੇਣੀ ਵਾਰ ਵੰਡ'
              : currentLang === 'hi'
              ? 'पात्र योजनाओं का श्रेणी-वार वितरण'
              : 'Distribution of Eligible Welfare Schemes by Category'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            {currentLang === 'pa'
              ? `ਤੁਹਾਡੇ ਪ੍ਰੋਫਾਈਲ (${profile.occupation}, ਉਮਰ ${profile.age}, ${profile.district}) ਮੁਤਾਬਕ ਵੱਖ-ਵੱਖ ਖੇਤਰਾਂ ਵਿੱਚ ਉਪਲਬਧ ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ ਦਾ ਰੀਅਲ-ਟਾਈਮ ਚਾਰਟ।`
              : currentLang === 'hi'
              ? `आपकी प्रोफ़ाइल (${profile.occupation}, आयु ${profile.age}, ${profile.district}) के अनुसार विभिन्न श्रेणियों में उपलब्ध सरकारी योजनाओं का वास्तविक समय दृश्य।`
              : `Interactive Recharts visualization showcasing welfare distribution for ${profile.occupation} (Age ${profile.age}, ${profile.district}) across Agriculture, Health, Education, Pensions, and Social Welfare.`}
          </p>
        </div>

        {/* Scope Toggle: Eligible vs All Schemes */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start md:self-center border border-slate-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setViewScope('eligible')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              viewScope === 'eligible'
                ? 'bg-white text-teal-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {currentLang === 'pa' ? 'ਸਿਰਫ਼ ਯੋਗ ਯੋਜਨਾਵਾਂ' : currentLang === 'hi' ? 'केवल पात्र योजनाएं' : 'Eligible Schemes'} ({totalEligibleCount})
            </span>
          </button>
          <button
            type="button"
            onClick={() => setViewScope('all')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              viewScope === 'all'
                ? 'bg-white text-teal-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>
              {currentLang === 'pa' ? 'ਸਾਰੀਆਂ 20 ਯੋਜਨਾਵਾਂ' : currentLang === 'hi' ? 'सभी 20 योजनाएं' : 'All 20 Schemes'}
            </span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50/60 p-4 rounded-2xl border border-teal-100">
          <div className="text-[11px] font-bold uppercase tracking-wider text-teal-700 mb-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
            <span>{currentLang === 'pa' ? 'ਪੂਰੀ ਤਰ੍ਹਾਂ ਯੋਗ' : currentLang === 'hi' ? 'पूर्णतः पात्र' : 'Confirmed Eligible'}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-teal-900">{totalEligibleCount}</div>
          <div className="text-[11px] text-teal-700/80 mt-0.5">
            {currentLang === 'pa' ? '100% ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ' : currentLang === 'hi' ? '100% मानदंड पूर्ण' : 'Meets 100% criteria'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 p-4 rounded-2xl border border-blue-100">
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-700 mb-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            <span>{currentLang === 'pa' ? 'ਸੰਭਾਵੀ ਮੈਚ' : currentLang === 'hi' ? 'संभावित मिलान' : 'Potential Match'}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-900">{totalPotentialsCount}</div>
          <div className="text-[11px] text-blue-700/80 mt-0.5">
            {currentLang === 'pa' ? 'ਅੰਸ਼ਕ ਦਸਤਾਵੇਜ਼ ਲੋੜੀਂਦੇ' : currentLang === 'hi' ? 'दस्तावेज़ की आवश्यकता' : 'With minor criteria check'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-50/60 p-4 rounded-2xl border border-purple-100">
          <div className="text-[11px] font-bold uppercase tracking-wider text-purple-700 mb-1 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-purple-600" />
            <span>{currentLang === 'pa' ? 'ਕੇਂਦਰ ਬਨਾਮ ਪੰਜਾਬ' : currentLang === 'hi' ? 'केंद्र vs पंजाब' : 'Central vs Punjab'}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-900">
            {levelDistribution[0].count} <span className="text-sm font-semibold text-purple-600">/</span> {levelDistribution[1].count}
          </div>
          <div className="text-[11px] text-purple-700/80 mt-0.5">
            {currentLang === 'pa' ? 'ਕੇਂਦਰ / ਸੂਬਾ ਯੋਜਨਾਵਾਂ' : currentLang === 'hi' ? 'केंद्रीय / राज्य योजनाएं' : 'Central / State initiatives'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 p-4 rounded-2xl border border-amber-100">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800 mb-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{currentLang === 'pa' ? 'ਸਭ ਤੋਂ ਵੱਡਾ ਖੇਤਰ' : currentLang === 'hi' ? 'शीर्ष श्रेणी' : 'Dominant Sector'}</span>
          </div>
          <div className="text-lg sm:text-xl font-black text-amber-950 truncate">
            {categoryData.length > 0 ? getLocalizedCategoryName(categoryData[0]) : 'None'}
          </div>
          <div className="text-[11px] text-amber-800/80 mt-0.5">
            {categoryData.length > 0 ? `${categoryData[0].value} ${currentLang === 'pa' ? 'ਯੋਜਨਾਵਾਂ ਉਪਲਬਧ' : 'Schemes available'}` : '-'}
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Recharts Pie Chart (7 cols on lg) */}
        <div className="lg:col-span-7 bg-slate-50/70 p-4 sm:p-6 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-teal-600" />
              <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">
                {currentLang === 'pa'
                  ? 'ਸ਼੍ਰੇਣੀ ਅਨੁਪਾਤ ਪਾਈ ਚਾਰਟ (Pie Chart)'
                  : currentLang === 'hi'
                  ? 'श्रेणी अनुपात पाई चार्ट (Pie Chart)'
                  : 'Category Distribution Pie Chart'}
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
              {totalActiveChartCount} {currentLang === 'pa' ? 'ਕੁੱਲ' : 'Total'}
            </span>
          </div>

          {totalActiveChartCount > 0 ? (
            <div className="h-72 sm:h-80 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={105}
                    paddingAngle={3}
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                    stroke="#ffffff"
                    strokeWidth={2}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as CategoryDataPoint;
                        const percentage = totalActiveChartCount > 0 
                          ? Math.round((data.value / totalActiveChartCount) * 100) 
                          : 0;
                        return (
                          <div className="bg-slate-900 text-white text-xs p-3 rounded-xl shadow-xl border border-slate-800 space-y-1">
                            <div className="font-bold flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
                              <span>{getLocalizedCategoryName(data)}</span>
                            </div>
                            <div className="text-slate-300">
                              <span className="font-extrabold text-teal-400 text-sm">{data.value}</span> {viewScope === 'eligible' ? 'eligible schemes' : 'total schemes'} ({percentage}%)
                            </div>
                            <div className="text-[10px] text-slate-400 max-w-[200px] leading-tight">
                              {data.description}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => {
                      const item = categoryData.find(d => d.name === value);
                      if (item) {
                        return <span className="text-[11px] font-medium text-slate-700">{getLocalizedCategoryName(item)}</span>;
                      }
                      return <span className="text-[11px] font-medium text-slate-700">{value}</span>;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex flex-col items-center justify-center text-center p-6 space-y-2">
              <Info className="w-8 h-8 text-slate-400" />
              <p className="text-xs text-slate-500 font-medium">
                No schemes match the current citizen profile filters.
              </p>
              <button
                type="button"
                onClick={() => setViewScope('all')}
                className="text-xs font-bold text-teal-700 underline"
              >
                View all 20 schemes
              </button>
            </div>
          )}
        </div>

        {/* Right: Bar Chart Breakdown by Government Level (5 cols on lg) */}
        <div className="lg:col-span-5 bg-slate-50/70 p-4 sm:p-6 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">
                {currentLang === 'pa' ? 'ਸਰਕਾਰੀ ਪੱਧਰ ਵੰਡ' : currentLang === 'hi' ? 'सरकारी स्तर वितरण' : 'Government Level Split'}
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              Central vs Punjab
            </span>
          </div>

          <div className="h-56 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={levelDistribution} 
                layout="vertical"
                margin={{ top: 10, right: 25, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                <YAxis dataKey="level" type="category" width={90} tick={{ fontSize: 10, fontWeight: 600 }} />
                <Tooltip
                  formatter={(val: any) => [`${val} Schemes`, 'Count']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', color: '#fff', fontSize: '11px', border: 'none' }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {levelDistribution.map((entry, idx) => (
                    <Cell key={`bar-cell-${idx}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200/80 text-[11px] text-slate-600 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-700" />
              <span className="font-bold text-slate-800">10 Central Schemes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-700" />
              <span className="font-bold text-slate-800">10 Punjab State Schemes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
            <span>{currentLang === 'pa' ? 'ਸ਼੍ਰੇਣੀ ਅਨੁਸਾਰ ਯੋਜਨਾਵਾਂ ਦੀ ਸੂਚੀ' : currentLang === 'hi' ? 'श्रेणी अनुसार योजनाओं की सूची' : 'Schemes by Welfare Category'}</span>
            <span className="text-xs font-normal text-slate-500">
              ({categoryData.length} active sectors)
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {categoryData.map((item) => {
            const displaySchemes = viewScope === 'eligible' ? item.eligibleSchemes : item.schemes;

            return (
              <div 
                key={item.name}
                className="p-4 rounded-2xl border border-slate-200 hover:border-teal-300 transition-all bg-white hover:shadow-xs group space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-teal-700 transition-colors">
                        {getLocalizedCategoryName(item)}
                      </h4>
                    </div>
                    <span 
                      className="text-xs font-extrabold px-2 py-0.5 rounded-md text-white"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.value}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Sub-list of schemes in this category */}
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {viewScope === 'eligible' ? 'Matching Schemes' : 'Available Schemes'}:
                  </div>
                  <div className="space-y-1">
                    {displaySchemes.slice(0, 3).map(sch => {
                      const evalMatch = evaluationMap.get(sch.id);
                      return (
                        <div 
                          key={sch.id}
                          onClick={() => onOpenScheme && onOpenScheme(sch)}
                          className="flex items-center justify-between text-xs p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer text-slate-700 hover:text-teal-700 transition-colors"
                        >
                          <span className="truncate pr-2 font-medium">{sch.titleEn}</span>
                          {evalMatch && (
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${
                              evalMatch.isEligible 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : evalMatch.isPotentialMatch 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {evalMatch.matchPercentage}%
                            </span>
                          )}
                        </div>
                      );
                    })}
                    {displaySchemes.length > 3 && (
                      <div className="text-[10px] text-slate-400 italic text-right pt-0.5">
                        +{displaySchemes.length - 3} more schemes
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
