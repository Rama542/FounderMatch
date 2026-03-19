import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Sparkles, TrendingUp, Users, MessageSquare,
  Repeat2, Brain, Trophy, Star, AlertCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getFounderProfile, getInvestorProfile, getMatches, formatCurrency } from '@/lib/mockData';
import { MOCK_STARTUP_PROFILES, MOCK_INVESTOR_PROFILES, INDUSTRY_ICONS, STAGE_COLORS } from '@/constants/data';
import ScoreRing from '@/components/features/ScoreRing';
import type { StartupProfile, InvestorProfile } from '@/types';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [founderProfile, setFounderProfile] = useState<StartupProfile | null>(null);
  const [investorProfile, setInvestorProfile] = useState<InvestorProfile | null>(null);
  const matches = getMatches();

  useEffect(() => {
    if (!user) { navigate('/auth'); return; }
    if (!user.profileComplete) { navigate('/onboarding'); return; }
    if (user.role === 'founder') setFounderProfile(getFounderProfile(user.id));
    if (user.role === 'investor') setInvestorProfile(getInvestorProfile(user.id));
  }, [user, navigate]);

  if (!user) return null;

  const isFounder = user.role === 'founder';

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20 pb-12 px-4">
      <div className="mx-auto max-w-6xl">
        {/* Greeting */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Good to see you, <span className="text-violet-400">{user.name.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            {isFounder ? 'Your startup dashboard' : 'Your investor dashboard'}
          </p>
        </motion.div>

        {isFounder ? (
          <FounderDashboard profile={founderProfile} matches={matches} />
        ) : (
          <InvestorDashboard profile={investorProfile} userId={user.id} matches={matches} />
        )}
      </div>
    </div>
  );
}

function FounderDashboard({ profile, matches }: { profile: StartupProfile | null; matches: ReturnType<typeof getMatches> }) {
  const scores = profile?.aiScores;

  return (
    <div className="space-y-6">
      {/* AI Score Banner */}
      {scores && (
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
          className="rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-900/30 via-purple-900/20 to-[#12121a] p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-violet-400" />
            <h2 className="text-lg font-bold text-white">AI Startup Score</h2>
            <span className="ml-auto rounded-full bg-violet-500/20 px-2 py-0.5 text-xs text-violet-400 font-medium">
              Powered by AI
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <ScoreRing score={scores.overall} size={80} label="Overall" />
            <ScoreRing score={scores.marketPotential} size={80} label="Market Potential" />
            <ScoreRing score={scores.teamStrength} size={80} label="Team Strength" />
            <ScoreRing score={scores.problemClarity} size={80} label="Problem Clarity" />
          </div>
          <p className="mt-4 text-sm text-slate-400 italic">"{scores.feedback}"</p>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible"
        className="grid sm:grid-cols-3 gap-4"
      >
        <Link to="/discover" className="group rounded-2xl border border-white/[0.07] bg-[#12121a] p-5 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
              <Repeat2 className="h-5 w-5 text-violet-400" />
            </div>
            <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
          </div>
          <div className="text-base font-bold text-white">Discover Investors</div>
          <div className="text-xs text-slate-500 mt-0.5">Swipe through matched investors</div>
        </Link>

        <Link to="/matches" className="group rounded-2xl border border-white/[0.07] bg-[#12121a] p-5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
              <Users className="h-5 w-5 text-emerald-400" />
            </div>
            <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
          </div>
          <div className="text-base font-bold text-white">My Matches</div>
          <div className="text-xs text-slate-500 mt-0.5">{matches.length} active matches</div>
        </Link>

        <Link to="/matches" className="group rounded-2xl border border-white/[0.07] bg-[#12121a] p-5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
              <MessageSquare className="h-5 w-5 text-blue-400" />
            </div>
            <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
          </div>
          <div className="text-base font-bold text-white">Messages</div>
          <div className="text-xs text-slate-500 mt-0.5">Connect with your matches</div>
        </Link>
      </motion.div>

      {/* Startup profile preview */}
      {profile && (
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible"
          className="rounded-2xl border border-white/[0.07] bg-[#12121a] p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Your Startup</h2>
            <Link to="/profile" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
              Edit Profile →
            </Link>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-2xl flex-shrink-0">
              {INDUSTRY_ICONS[profile.industry]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-white">{profile.startupName}</h3>
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STAGE_COLORS[profile.stage]}`}>
                  {profile.stage}
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1 line-clamp-2">{profile.problemStatement}</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="text-xs text-slate-500">
                  Raising <span className="text-white font-semibold">{formatCurrency(profile.fundingRequired)}</span>
                </div>
                <div className="text-xs text-slate-500">
                  Team <span className="text-white font-semibold">{profile.teamSize}</span>
                </div>
                {profile.traction && (
                  <div className="text-xs text-emerald-400">{profile.traction}</div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Top Investors */}
      <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Top Investors for You</h2>
          <Link to="/discover" className="text-xs text-violet-400 hover:text-violet-300">See all →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_INVESTOR_PROFILES.map((inv) => (
            <div key={inv.id} className="rounded-xl border border-white/[0.07] bg-[#12121a] p-4 hover:border-white/[0.12] transition-all">
              <div className="flex items-center gap-3 mb-3">
                {inv.avatar ? (
                  <img src={inv.avatar} alt={inv.investorName} className="h-10 w-10 rounded-xl object-cover" />
                ) : (
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-lg">👤</div>
                )}
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{inv.investorName}</div>
                  <div className="text-xs text-slate-500">{inv.firmName}</div>
                </div>
                {inv.qualityScore && inv.interviewCompleted && (
                  <ScoreRing score={inv.qualityScore.overall} size={40} strokeWidth={3} className="ml-auto flex-shrink-0" />
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {inv.preferredIndustries.slice(0, 2).map((ind) => (
                  <span key={ind} className="text-xs text-blue-300 bg-blue-500/10 rounded-full px-2 py-0.5">{INDUSTRY_ICONS[ind]} {ind}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function InvestorDashboard({ profile, userId, matches }: { profile: InvestorProfile | null; userId: string; matches: ReturnType<typeof getMatches> }) {
  const navigate = useNavigate();
  const hasScore = profile?.qualityScore && profile?.interviewCompleted;

  return (
    <div className="space-y-6">
      {/* Quality Score Banner */}
      {hasScore ? (
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
          className="rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-[#12121a] p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">Your Investor Quality Score</h2>
            <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-bold ${
              profile!.qualityScore!.badge === 'Platinum' ? 'bg-slate-300/20 text-slate-200' :
              profile!.qualityScore!.badge === 'Gold' ? 'bg-amber-500/20 text-amber-400' :
              profile!.qualityScore!.badge === 'Silver' ? 'bg-slate-400/20 text-slate-400' :
              'bg-orange-800/20 text-orange-400'
            }`}>
              {profile!.qualityScore!.badge}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <ScoreRing score={profile!.qualityScore!.overall} size={80} label="Overall" />
            <ScoreRing score={profile!.qualityScore!.experience} size={80} label="Experience" />
            <ScoreRing score={profile!.qualityScore!.investmentClarity} size={80} label="Clarity" />
            <ScoreRing score={profile!.qualityScore!.founderFriendliness} size={80} label="Friendliness" />
          </div>
        </motion.div>
      ) : (
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
          className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h2 className="text-base font-bold text-white mb-1">Complete Your AI Interview</h2>
              <p className="text-sm text-slate-400 mb-4">
                Founders can see your quality score before swiping. Complete the AI interview to earn your Investor Quality Badge and attract better startups.
              </p>
              <button
                onClick={() => navigate('/ai-interview')}
                className="flex items-center gap-2 rounded-lg bg-amber-500/20 border border-amber-500/30 px-4 py-2 text-sm font-medium text-amber-300 hover:bg-amber-500/30 transition-all"
              >
                <Sparkles className="h-4 w-4" />
                Start AI Interview
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible"
        className="grid sm:grid-cols-3 gap-4"
      >
        <Link to="/discover" className="group rounded-2xl border border-white/[0.07] bg-[#12121a] p-5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
              <Repeat2 className="h-5 w-5 text-blue-400" />
            </div>
            <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
          </div>
          <div className="text-base font-bold text-white">Browse Startups</div>
          <div className="text-xs text-slate-500 mt-0.5">Discover AI-scored startups</div>
        </Link>

        <Link to="/matches" className="group rounded-2xl border border-white/[0.07] bg-[#12121a] p-5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
              <Users className="h-5 w-5 text-emerald-400" />
            </div>
            <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
          </div>
          <div className="text-base font-bold text-white">Portfolio Matches</div>
          <div className="text-xs text-slate-500 mt-0.5">{matches.length} active connections</div>
        </Link>

        <button
          onClick={() => navigate('/ai-interview')}
          className="group rounded-2xl border border-white/[0.07] bg-[#12121a] p-5 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
              <Brain className="h-5 w-5 text-violet-400" />
            </div>
            <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
          </div>
          <div className="text-base font-bold text-white">AI Interview</div>
          <div className="text-xs text-slate-500 mt-0.5">{hasScore ? 'Retake to improve score' : 'Get your quality score'}</div>
        </button>
      </motion.div>

      {/* Top Startups */}
      <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Recommended Startups</h2>
          <Link to="/discover" className="text-xs text-violet-400 hover:text-violet-300">See all →</Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {MOCK_STARTUP_PROFILES.slice(0, 4).map((s) => (
            <div key={s.id} className="rounded-xl border border-white/[0.07] bg-[#12121a] p-4 hover:border-white/[0.12] transition-all">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-xl flex-shrink-0">
                  {INDUSTRY_ICONS[s.industry]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{s.startupName}</span>
                    <span className={`inline-flex items-center rounded-full border px-1.5 py-px text-[10px] font-medium ${STAGE_COLORS[s.stage]}`}>
                      {s.stage}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Raising {formatCurrency(s.fundingRequired)}</div>
                  {s.traction && (
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-emerald-400" />
                      <span className="text-xs text-emerald-400">{s.traction}</span>
                    </div>
                  )}
                </div>
                {s.aiScores && (
                  <div className="flex flex-col items-center">
                    <ScoreRing score={s.aiScores.overall} size={40} strokeWidth={3} />
                    <span className="text-[10px] text-slate-600 mt-0.5">AI Score</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
