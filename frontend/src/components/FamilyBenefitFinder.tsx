import React, { useState } from 'react';
import { FamilyMember, CitizenProfile, Scheme, Language, Occupation, Gender } from '../types/scheme';
import { TRANSLATIONS } from '../data/translations';
import { calculateFamilyBenefits } from '../utils/schemeEngine';
import { 
  Users, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  IndianRupee, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

interface FamilyBenefitFinderProps {
  currentLang: Language;
  baseProfile: CitizenProfile;
  onOpenSchemeModal: (scheme: Scheme) => void;
}

export const FamilyBenefitFinder: React.FC<FamilyBenefitFinderProps> = ({
  currentLang,
  baseProfile,
  onOpenSchemeModal
}) => {
  const t = TRANSLATIONS[currentLang];

  // Default realistic demo family for instant demonstration to judges
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      id: 'fam-1',
      relation: 'Father',
      name: 'Harbhajan Singh',
      age: 52,
      gender: 'Male',
      occupation: 'Farmer',
      hasDisability: false,
      isStudent: false,
      matchedSchemeIds: []
    },
    {
      id: 'fam-2',
      relation: 'Mother',
      name: 'Paramjit Kaur',
      age: 48,
      gender: 'Female',
      occupation: 'Homemaker',
      hasDisability: false,
      isStudent: false,
      matchedSchemeIds: []
    },
    {
      id: 'fam-3',
      relation: 'Daughter',
      name: 'Simranjeet Kaur',
      age: 19,
      gender: 'Female',
      occupation: 'Student',
      hasDisability: false,
      isStudent: true,
      matchedSchemeIds: []
    },
    {
      id: 'fam-4',
      relation: 'Grandparent',
      name: 'Gurdial Singh',
      age: 72,
      gender: 'Male',
      occupation: 'Senior Citizen',
      hasDisability: false,
      isStudent: false,
      matchedSchemeIds: []
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newRelation, setNewRelation] = useState<FamilyMember['relation']>('Son');
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState(22);
  const [newGender, setNewGender] = useState<Gender>('Male');
  const [newOccupation, setNewOccupation] = useState<Occupation>('Unemployed Youth');
  const [newDisability, setNewDisability] = useState(false);
  const [newStudent, setNewStudent] = useState(false);

  const familyResults = calculateFamilyBenefits(familyMembers, baseProfile);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    const newMember: FamilyMember = {
      id: `fam-${Date.now()}`,
      relation: newRelation,
      name: newName || `${newRelation} (${newAge}y)`,
      age: newAge,
      gender: newGender,
      occupation: newOccupation,
      hasDisability: newDisability,
      isStudent: newStudent,
      matchedSchemeIds: []
    };

    setFamilyMembers(prev => [...prev, newMember]);
    setNewName('');
    setIsAdding(false);
  };

  const removeMember = (id: string) => {
    setFamilyMembers(prev => prev.filter(m => m.id !== id));
  };

  // Estimate total pooled family benefits
  let totalEstimatedCash = 0;
  let totalEstimatedCover = 0;

  familyResults.forEach(r => {
    r.eligibleSchemes.forEach(e => {
      if (e.scheme.id === 'pm-kisan') totalEstimatedCash += 6000;
      if (e.scheme.id === 'punjab-old-age-pension') totalEstimatedCash += 18000;
      if (e.scheme.id === 'punjab-widow-pension') totalEstimatedCash += 18000;
      if (e.scheme.id === 'post-matric-sc') totalEstimatedCash += 35000; // fee + allowance
      if (e.scheme.id === 'punjab-ashirwad') totalEstimatedCash += 51000;
      if (e.scheme.id === 'punjab-mera-kaam-mera-maan') totalEstimatedCash += 30000;
      if (e.scheme.id === 'sarbat-sehat-bima') totalEstimatedCover = 500000; // family floater
    });
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-teal-900 text-white rounded-2xl p-6 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-teal-500/20 text-teal-300 text-xs font-bold px-3 py-1 rounded-full border border-teal-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Innovative Feature 2 • Household Maximizer</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {t.familyTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              {t.familySubtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addMember}</span>
          </button>
        </div>

        {/* Pooled Household Totals Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/10">
          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/10">
            <span className="text-[11px] text-teal-300 font-semibold uppercase">Total Household Members</span>
            <div className="text-xl font-black text-white mt-0.5">{familyMembers.length} Members</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/10">
            <span className="text-[11px] text-teal-300 font-semibold uppercase">Combined Annual Cash/Subsidies</span>
            <div className="text-xl font-black text-emerald-400 mt-0.5">₹{totalEstimatedCash.toLocaleString('en-IN')} / year</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/10">
            <span className="text-[11px] text-teal-300 font-semibold uppercase">Total Family Health Floater</span>
            <div className="text-xl font-black text-blue-300 mt-0.5">₹{totalEstimatedCover.toLocaleString('en-IN')} / year</div>
          </div>
        </div>
      </div>

      {/* Add Member Form Modal/Expansion */}
      {isAdding && (
        <form onSubmit={handleAddMember} className="bg-white rounded-2xl border border-blue-200 p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-600" />
            <span>Add Family Member Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Relation</label>
              <select
                value={newRelation}
                onChange={(e) => setNewRelation(e.target.value as any)}
                className="w-full text-xs p-2 border border-slate-300 rounded-lg"
              >
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Spouse">Spouse</option>
                <option value="Son">Son</option>
                <option value="Daughter">Daughter</option>
                <option value="Grandparent">Grandparent</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Name / Nickname</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Gurpreet"
                className="w-full text-xs p-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
              <input
                type="number"
                min="0"
                max="105"
                value={newAge}
                onChange={(e) => setNewAge(Number(e.target.value))}
                className="w-full text-xs p-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
              <select
                value={newGender}
                onChange={(e) => setNewGender(e.target.value as any)}
                className="w-full text-xs p-2 border border-slate-300 rounded-lg"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Transgender">Transgender</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Occupation</label>
              <select
                value={newOccupation}
                onChange={(e) => {
                  const occ = e.target.value as Occupation;
                  setNewOccupation(occ);
                  if (occ === 'Student') setNewStudent(true);
                }}
                className="w-full text-xs p-2 border border-slate-300 rounded-lg"
              >
                <option value="Farmer">Farmer</option>
                <option value="Homemaker">Homemaker</option>
                <option value="Student">Student</option>
                <option value="Senior Citizen">Senior Citizen</option>
                <option value="Unemployed Youth">Unemployed Youth</option>
                <option value="Artisan/Craftsperson">Artisan/Craftsperson</option>
                <option value="Daily Wage Worker">Daily Wage Worker</option>
                <option value="Self-Employed/Shopkeeper">Self-Employed/Shopkeeper</option>
              </select>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newDisability}
                  onChange={(e) => setNewDisability(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Disability (≥ 40%)</span>
              </label>

              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newStudent}
                  onChange={(e) => setNewStudent(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Student</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-xs px-4 py-1.5 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800"
            >
              Save Member
            </button>
          </div>
        </form>
      )}

      {/* Family Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {familyResults.map(({ member, eligibleSchemes, potentialSchemes }) => (
          <div
            key={member.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-sm">
                    {member.relation[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <span>{member.name}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full">
                        {member.relation}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      {member.age} yrs • {member.gender} • {member.occupation}
                      {member.hasDisability && ' • PwD'}
                      {member.isStudent && ' • Student'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeMember(member.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                  title="Remove member"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Matched Schemes for this Member */}
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Eligible Schemes:</span>
                  <span className="text-emerald-700 font-bold">{eligibleSchemes.length} Confirmed</span>
                </div>

                {eligibleSchemes.length > 0 ? (
                  <div className="space-y-1.5">
                    {eligibleSchemes.map((evalItem) => {
                      const scheme = evalItem.scheme;
                      const title = currentLang === 'pa' ? scheme.titlePa : currentLang === 'hi' ? scheme.titleHi : scheme.titleEn;

                      return (
                        <div
                          key={scheme.id}
                          onClick={() => onOpenSchemeModal(scheme)}
                          className="p-2.5 bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-200 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-2 group"
                        >
                          <div>
                            <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                              {title}
                            </div>
                            <div className="text-[10px] text-teal-700 font-bold mt-0.5">
                              {scheme.benefitAmountText}
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    No confirmed matches based on general criteria.
                  </p>
                )}
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1 text-emerald-700 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Direct Beneficiary
              </span>
              <span>{potentialSchemes.length} Potential Programs</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
