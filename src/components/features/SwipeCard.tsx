import { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import { MapPin, Users, TrendingUp, DollarSign, X, Heart } from 'lucide-react';
import { STAGE_COLORS, INDUSTRY_ICONS } from '@/constants/data';
import { formatCurrency } from '@/lib/mockData';
import ScoreRing from './ScoreRing';
import type { StartupStage, Industry } from '@/types';

interface StartupCardData {
  id: string;
  startupName: string;
  industry: Industry;
  stage: StartupStage;
  fundingRequired: number;
  location: string;
  traction?: string;
  teamSize: number;
  problemStatement: string;
  founderName: string;
  founderAvatar?: string;
  aiScores?: {
    overall: number;
    marketPotential: number;
    teamStrength: number;
    problemClarity: number;
  };
}

interface InvestorCardData {
  id: string;
  investorName: string;
  firmName: string;
  bio: string;
  minInvestment: number;
  maxInvestment: number;
  preferredIndustries: Industry[];
  preferredStages: StartupStage[];
  location: string;
  portfolioCompanies: string[];
  interviewCompleted: boolean;
  qualityScore?: { overall: number; badge: string };
  avatar?: string;
}

interface SwipeCardProps {
  type: 'startup' | 'investor';
  data: StartupCardData | InvestorCardData;
  onSwipe: (id: string, direction: 'left' | 'right') => void;
  isTop: boolean;
  stackIndex: number;
}

export default function SwipeCard({ type, data, onSwipe, isTop, stackIndex }: SwipeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-25, 25]);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, -20], [1, 0]);
  const [isDragging, setIsDragging] = useState(false);

  function handleDragEnd(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    setIsDragging(false);
    const threshold = 120;
    if (info.offset.x > threshold) {
      onSwipe(data.id, 'right');
    } else if (info.offset.x < -threshold) {
      onSwipe(data.id, 'left');
    }
  }

  const scale = 1 - stackIndex * 0.04;
  const yOffset = stackIndex * 12;

  if (type === 'startup') {
    const s = data as StartupCardData;
    return (
      <motion.div
        ref={cardRef}
        className="absolute w-full cursor-grab active:cursor-grabbing select-none"
        style={{
          x: isTop ? x : 0,
          rotate: isTop ? rotate : 0,
          scale,
          y: yOffset,
          zIndex: 10 - stackIndex,
        }}
        drag={isTop ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        animate={!isTop ? { scale, y: yOffset } : undefined}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-gradient-to-b from-[#1a1a2e] to-[#16162a] shadow-2xl shadow-black/60">
          {/* Swipe indicators */}
          {isTop && (
            <>
              <motion.div
                className="absolute top-6 left-6 z-20 rotate-[-15deg] rounded-lg border-4 border-emerald-400 px-3 py-1 text-lg font-black text-emerald-400 uppercase tracking-widest"
                style={{ opacity: likeOpacity }}
              >
                Match!
              </motion.div>
              <motion.div
                className="absolute top-6 right-6 z-20 rotate-[15deg] rounded-lg border-4 border-red-400 px-3 py-1 text-lg font-black text-red-400 uppercase tracking-widest"
                style={{ opacity: nopeOpacity }}
              >
                Pass
              </motion.div>
            </>
          )}

          {/* Header gradient */}
          <div className="relative h-48 bg-gradient-to-br from-violet-900/60 via-purple-900/40 to-slate-900 flex items-end p-5">
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-transparent to-transparent" />
            <div className="relative flex items-end gap-3 w-full">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm text-2xl border border-white/10">
                {INDUSTRY_ICONS[s.industry]}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white truncate">{s.startupName}</h3>
                <div className="flex items-center gap-2 flex-wrap mt-1">
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STAGE_COLORS[s.stage]}`}>
                    {s.stage}
                  </span>
                  <span className="text-xs text-violet-400 font-medium">{s.industry}</span>
                </div>
              </div>
              {s.aiScores && (
                <ScoreRing score={s.aiScores.overall} size={52} strokeWidth={4} />
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-4">
            <p className="text-sm text-slate-300 leading-relaxed line-clamp-2">{s.problemStatement}</p>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <DollarSign className="h-3 w-3" />
                  Raising
                </div>
                <div className="text-sm font-semibold text-white">{formatCurrency(s.fundingRequired)}</div>
              </div>
              <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Users className="h-3 w-3" />
                  Team
                </div>
                <div className="text-sm font-semibold text-white">{s.teamSize} people</div>
              </div>
            </div>

            {s.traction && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-2">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                <span className="text-xs text-emerald-300">{s.traction}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              {s.founderAvatar && (
                <img src={s.founderAvatar} alt={s.founderName} className="h-6 w-6 rounded-full object-cover" />
              )}
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span>{s.founderName}</span>
                <span>·</span>
                <MapPin className="h-3 w-3" />
                <span>{s.location}</span>
              </div>
            </div>
          </div>

          {/* Action hint */}
          {isTop && !isDragging && (
            <div className="flex items-center justify-center gap-8 px-5 pb-5">
              <button
                onClick={() => onSwipe(data.id, 'left')}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all hover:scale-110"
              >
                <X className="h-5 w-5" />
              </button>
              <button
                onClick={() => onSwipe(data.id, 'right')}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all hover:scale-110"
              >
                <Heart className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // Investor card
  const inv = data as InvestorCardData;
  return (
    <motion.div
      ref={cardRef}
      className="absolute w-full cursor-grab active:cursor-grabbing select-none"
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        scale,
        y: yOffset,
        zIndex: 10 - stackIndex,
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      animate={!isTop ? { scale, y: yOffset } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-gradient-to-b from-[#1a1a2e] to-[#16162a] shadow-2xl shadow-black/60">
        {isTop && (
          <>
            <motion.div
              className="absolute top-6 left-6 z-20 rotate-[-15deg] rounded-lg border-4 border-emerald-400 px-3 py-1 text-lg font-black text-emerald-400 uppercase tracking-widest"
              style={{ opacity: likeOpacity }}
            >
              Connect!
            </motion.div>
            <motion.div
              className="absolute top-6 right-6 z-20 rotate-[15deg] rounded-lg border-4 border-red-400 px-3 py-1 text-lg font-black text-red-400 uppercase tracking-widest"
              style={{ opacity: nopeOpacity }}
            >
              Pass
            </motion.div>
          </>
        )}

        <div className="relative h-48 bg-gradient-to-br from-blue-900/60 via-indigo-900/40 to-slate-900 flex items-end p-5">
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-transparent to-transparent" />
          <div className="relative flex items-end gap-3 w-full">
            {inv.avatar ? (
              <img src={inv.avatar} alt={inv.investorName} className="h-14 w-14 rounded-xl object-cover border border-white/10" />
            ) : (
              <div className="h-14 w-14 rounded-xl bg-blue-500/20 flex items-center justify-center text-2xl border border-white/10">
                👤
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-white truncate">{inv.investorName}</h3>
              <p className="text-sm text-blue-300">{inv.firmName}</p>
            </div>
            {inv.qualityScore && inv.interviewCompleted && (
              <div className="flex flex-col items-center">
                <ScoreRing score={inv.qualityScore.overall} size={52} strokeWidth={4} />
                <span className="text-[10px] text-slate-500 mt-0.5">{inv.qualityScore.badge}</span>
              </div>
            )}
            {!inv.interviewCompleted && (
              <div className="rounded-lg bg-amber-500/20 border border-amber-500/30 px-2 py-1 text-xs text-amber-400">
                Not Interviewed
              </div>
            )}
          </div>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed line-clamp-2">{inv.bio}</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3">
              <div className="text-xs text-slate-500 mb-1">Investment Range</div>
              <div className="text-sm font-semibold text-white">
                {formatCurrency(inv.minInvestment)} – {formatCurrency(inv.maxInvestment)}
              </div>
            </div>
            <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3">
              <div className="text-xs text-slate-500 mb-1">Focus</div>
              <div className="text-sm font-semibold text-white truncate">
                {inv.preferredStages.join(', ')}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {inv.preferredIndustries.slice(0, 3).map((ind) => (
              <span key={ind} className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-xs text-blue-300">
                {INDUSTRY_ICONS[ind]} {ind}
              </span>
            ))}
          </div>

          {inv.portfolioCompanies.length > 0 && (
            <div>
              <div className="text-xs text-slate-500 mb-1.5">Portfolio Highlights</div>
              <div className="flex flex-wrap gap-1">
                {inv.portfolioCompanies.slice(0, 3).map((co) => (
                  <span key={co} className="rounded-md bg-white/[0.05] px-2 py-0.5 text-xs text-slate-300">{co}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {isTop && !isDragging && (
          <div className="flex items-center justify-center gap-8 px-5 pb-5">
            <button
              onClick={() => onSwipe(data.id, 'left')}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all hover:scale-110"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              onClick={() => onSwipe(data.id, 'right')}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all hover:scale-110"
            >
              <Heart className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
