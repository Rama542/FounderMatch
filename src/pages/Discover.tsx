import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Repeat2, Heart, X, Check, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  getSwipes, saveSwipe, getDiscoverStartups, getDiscoverInvestors, createMatch
} from '@/lib/mockData';
import { MOCK_INVESTOR_PROFILES } from '@/constants/data';
import SwipeCard from '@/components/features/SwipeCard';
import { toast } from 'sonner';

export default function Discover() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [swipedIds, setSwipedIds] = useState<string[]>([]);
  const [showMatch, setShowMatch] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/auth'); return; }
    const existing = getSwipes().filter((s) => s.swiperId === user.id).map((s) => s.targetId);
    setSwipedIds(existing);
  }, [user, navigate]);

  if (!user) return null;

  const isFounder = user.role === 'founder';

  const cards = isFounder
    ? getDiscoverInvestors(swipedIds)
    : getDiscoverStartups(swipedIds);

  function handleSwipe(targetId: string, direction: 'left' | 'right') {
    saveSwipe({ swiperId: user!.id, targetId, direction });
    setSwipedIds((prev) => [...prev, targetId]);

    if (direction === 'right') {
      // Simulate 60% chance of mutual like for demo
      const isMutualLike = Math.random() > 0.4;
      if (isMutualLike) {
        const founderId = isFounder ? user!.id : targetId;
        const investorId = isFounder ? targetId : user!.id;
        createMatch(founderId, investorId);
        setTimeout(() => {
          setShowMatch(true);
          setTimeout(() => setShowMatch(false), 3000);
        }, 400);
      }
    }
  }

  const isEmpty = cards.length === 0;

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20 pb-12 px-4">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Repeat2 className="h-5 w-5 text-violet-400" />
            <h1 className="text-xl font-black text-white">
              {isFounder ? 'Discover Investors' : 'Discover Startups'}
            </h1>
          </div>
          <p className="text-sm text-slate-500">
            {isFounder ? 'Swipe right to connect with investors' : 'Swipe right on startups you want to fund'}
          </p>
        </div>

        {/* Swipe stats */}
        <div className="flex items-center justify-center gap-6 mb-6">
          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <X className="h-4 w-4 text-red-400" />
            Pass
          </div>
          <div className="text-xs text-slate-600">{cards.length} remaining</div>
          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <Heart className="h-4 w-4 text-emerald-400" />
            Connect
          </div>
        </div>

        {/* Card stack */}
        {isEmpty ? (
          <EmptyState onReset={() => setSwipedIds([])} />
        ) : (
          <div className="relative" style={{ height: '560px' }}>
            {cards.slice(0, 3).map((card, i) => (
              <SwipeCard
                key={card.id}
                type={isFounder ? 'investor' : 'startup'}
                data={card as any}
                onSwipe={handleSwipe}
                isTop={i === 0}
                stackIndex={i}
              />
            ))}
          </div>
        )}

        {/* Match overlay */}
        <AnimatePresence>
          {showMatch && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
              onClick={() => setShowMatch(false)}
            >
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                  className="text-8xl mb-4"
                >
                  🎉
                </motion.div>
                <h2 className="text-4xl font-black text-white mb-2">It's a Match!</h2>
                <p className="text-slate-400 mb-6">You and your match both liked each other!</p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => { setShowMatch(false); navigate('/matches'); }}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white"
                  >
                    <Check className="h-4 w-4" />
                    Send Message
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tips */}
        <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <span className="text-xs font-medium text-slate-400">Tips for better matches</span>
          </div>
          <p className="text-xs text-slate-600">
            {isFounder
              ? 'Investors with higher quality scores have completed our AI interview and are more likely to respond quickly.'
              : 'Startups with AI scores above 80 have strong fundamentals. Look for traction indicators like MRR.'}
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl border border-white/[0.07] bg-[#12121a] p-12 text-center"
    >
      <div className="text-5xl mb-4">🎯</div>
      <h3 className="text-lg font-bold text-white mb-2">You've seen them all!</h3>
      <p className="text-sm text-slate-500 mb-6">
        You've gone through all available profiles. Check your matches or reset to start over.
      </p>
      <button
        onClick={onReset}
        className="rounded-xl bg-violet-500/20 border border-violet-500/30 px-6 py-2.5 text-sm font-medium text-violet-300 hover:bg-violet-500/30 transition-all"
      >
        Reset Discovery
      </button>
    </motion.div>
  );
}
