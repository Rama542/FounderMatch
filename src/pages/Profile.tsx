import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Edit3, MapPin, DollarSign, Users, TrendingUp, Building2, Brain } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getFounderProfile, getInvestorProfile, formatCurrency } from '@/lib/mockData';
import { INDUSTRY_ICONS, STAGE_COLORS } from '@/constants/data';
import ScoreRing from '@/components/features/ScoreRing';
import type { StartupProfile, InvestorProfile } from '@/types';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [founderProfile, setFounderProfile] = useState<StartupProfile | null>(null);
  const [investorProfile, setInvestorProfile] = useState<InvestorProfile | null>(null);

  useEffect(() => {
    if (!user) { navigate('/auth'); return; }
    if (user.role === 'founder') setFounderProfile(getFounderProfile(user.id));
    if (user.role === 'investor') setInvestorProfile(getInvestorProfile(user.id));
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20 pb-12 px-4">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-black text-white">My Profile</h1>
          <button
            onClick={() => navigate('/onboarding')}
            className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm text-slate-400 hover:text-white transition-all"
          >
            <Edit3 className="h-4 w-4" />
            Edit Profile
          </button>
        </div>

        {/* User info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/[0.07] bg-[#12121a] p-6 mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-500/20 text-3xl">
              {user.role === 'founder' ? '🚀' : '💼'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              <p className="text-slate-500 text-sm">{user.email}</p>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium mt-1 ${
                user.role === 'founder'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-blue-500/20 text-blue-400'
              }`}>
                {user.role === 'founder' ? 'Startup Founder' : 'Investor'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Founder profile */}
        {user.role === 'founder' && founderProfile && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="rounded-2xl border border-white/[0.07] bg-[#12121a] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">{INDUSTRY_ICONS[founderProfile.industry]}</div>
                <div>
                  <h3 className="text-lg font-bold text-white">{founderProfile.startupName}</h3>
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STAGE_COLORS[founderProfile.stage]}`}>
                    {founderProfile.stage}
                  </span>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mb-5">
                <Stat icon={DollarSign} label="Raising" value={formatCurrency(founderProfile.fundingRequired)} />
                <Stat icon={Users} label="Team Size" value={`${founderProfile.teamSize} people`} />
                <Stat icon={MapPin} label="Location" value={founderProfile.location} />
              </div>

              {founderProfile.traction && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 mb-4">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-emerald-300">{founderProfile.traction}</span>
                </div>
              )}

              <div className="space-y-3">
                <Section title="Problem">
                  <p className="text-sm text-slate-400 leading-relaxed">{founderProfile.problemStatement}</p>
                </Section>
                <Section title="Solution">
                  <p className="text-sm text-slate-400 leading-relaxed">{founderProfile.solution}</p>
                </Section>
              </div>
            </div>

            {founderProfile.aiScores && (
              <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-900/30 to-[#12121a] p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Brain className="h-5 w-5 text-violet-400" />
                  <h3 className="text-base font-bold text-white">AI Startup Score</h3>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <ScoreRing score={founderProfile.aiScores.overall} size={72} label="Overall" />
                  <ScoreRing score={founderProfile.aiScores.marketPotential} size={72} label="Market" />
                  <ScoreRing score={founderProfile.aiScores.teamStrength} size={72} label="Team" />
                  <ScoreRing score={founderProfile.aiScores.problemClarity} size={72} label="Clarity" />
                </div>
                <p className="mt-4 text-xs text-slate-500 italic">{founderProfile.aiScores.feedback}</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Investor profile */}
        {user.role === 'investor' && investorProfile && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="rounded-2xl border border-white/[0.07] bg-[#12121a] p-6">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="h-8 w-8 text-blue-400" />
                <div>
                  <h3 className="text-lg font-bold text-white">{investorProfile.investorName}</h3>
                  <p className="text-sm text-slate-500">{investorProfile.firmName}</p>
                </div>
              </div>

              <p className="text-sm text-slate-400 leading-relaxed mb-5">{investorProfile.bio}</p>

              <div className="grid sm:grid-cols-2 gap-4 mb-5">
                <Stat icon={DollarSign} label="Investment Range" value={`${formatCurrency(investorProfile.minInvestment)} – ${formatCurrency(investorProfile.maxInvestment)}`} />
                <Stat icon={MapPin} label="Location" value={investorProfile.location} />
              </div>

              <Section title="Preferred Industries">
                <div className="flex flex-wrap gap-1.5">
                  {investorProfile.preferredIndustries.map((ind) => (
                    <span key={ind} className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-xs text-blue-300">
                      {INDUSTRY_ICONS[ind]} {ind}
                    </span>
                  ))}
                </div>
              </Section>

              <Section title="Preferred Stages">
                <div className="flex flex-wrap gap-1.5">
                  {investorProfile.preferredStages.map((s) => (
                    <span key={s} className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STAGE_COLORS[s]}`}>
                      {s}
                    </span>
                  ))}
                </div>
              </Section>

              {investorProfile.portfolioCompanies.length > 0 && (
                <Section title="Portfolio">
                  <div className="flex flex-wrap gap-1.5">
                    {investorProfile.portfolioCompanies.map((co) => (
                      <span key={co} className="rounded-lg bg-white/[0.05] border border-white/[0.07] px-2 py-1 text-xs text-slate-300">{co}</span>
                    ))}
                  </div>
                </Section>
              )}
            </div>

            {investorProfile.qualityScore && investorProfile.interviewCompleted && (
              <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-900/30 to-[#12121a] p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Brain className="h-5 w-5 text-blue-400" />
                  <h3 className="text-base font-bold text-white">Investor Quality Score</h3>
                  <span className="ml-auto text-xs font-bold text-amber-400">{investorProfile.qualityScore.badge}</span>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <ScoreRing score={investorProfile.qualityScore.overall} size={72} label="Overall" />
                  <ScoreRing score={investorProfile.qualityScore.experience} size={72} label="Experience" />
                  <ScoreRing score={investorProfile.qualityScore.investmentClarity} size={72} label="Clarity" />
                  <ScoreRing score={investorProfile.qualityScore.founderFriendliness} size={72} label="Friendliness" />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className="text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <div className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">{title}</div>
      {children}
    </div>
  );
}
