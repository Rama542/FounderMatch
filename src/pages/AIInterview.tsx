import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronRight, Sparkles, CheckCircle2, Trophy } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getInvestorProfile, saveInvestorProfile, generateInvestorScores } from '@/lib/mockData';
import { AI_INTERVIEW_QUESTIONS } from '@/constants/data';
import ScoreRing from '@/components/features/ScoreRing';
import { toast } from 'sonner';

type Phase = 'intro' | 'interview' | 'analyzing' | 'results';

export default function AIInterview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(AI_INTERVIEW_QUESTIONS.length).fill(''));
  const [scores, setScores] = useState<ReturnType<typeof generateInvestorScores> | null>(null);
  const [typingAnswer, setTypingAnswer] = useState('');

  if (!user || user.role !== 'investor') {
    navigate('/dashboard');
    return null;
  }

  function startInterview() {
    setPhase('interview');
    setCurrentQ(0);
  }

  function handleNext() {
    const updated = [...answers];
    updated[currentQ] = typingAnswer;
    setAnswers(updated);
    setTypingAnswer('');

    if (currentQ < AI_INTERVIEW_QUESTIONS.length - 1) {
      setCurrentQ((q) => q + 1);
    } else {
      setPhase('analyzing');
      // Simulate AI analysis
      setTimeout(() => {
        const result = generateInvestorScores();
        setScores(result);
        // Save to profile
        const profile = getInvestorProfile(user.id);
        if (profile) {
          saveInvestorProfile({
            ...profile,
            qualityScore: result,
            interviewCompleted: true,
          });
        }
        setPhase('results');
      }, 3500);
    }
  }

  const badgeConfig = {
    Platinum: { color: 'from-slate-300 to-slate-100', text: 'text-slate-800', border: 'border-slate-300/50', bg: 'bg-slate-300/10' },
    Gold: { color: 'from-amber-400 to-yellow-300', text: 'text-amber-900', border: 'border-amber-400/50', bg: 'bg-amber-400/10' },
    Silver: { color: 'from-slate-400 to-slate-300', text: 'text-slate-800', border: 'border-slate-400/50', bg: 'bg-slate-400/10' },
    Bronze: { color: 'from-orange-700 to-orange-500', text: 'text-orange-900', border: 'border-orange-600/50', bg: 'bg-orange-600/10' },
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20 pb-12 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(124,58,237,0.1),transparent)]" />
      <div className="mx-auto max-w-2xl relative">
        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/30 to-purple-600/10 border border-violet-500/30">
                  <Brain className="h-10 w-10 text-violet-400" />
                </div>
              </div>
              <h1 className="text-3xl font-black text-white mb-3">AI Investor Interview</h1>
              <p className="text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
                Answer {AI_INTERVIEW_QUESTIONS.length} structured questions. Our AI will evaluate your responses and generate your <span className="text-violet-300 font-medium">Investor Quality Score</span> — visible to founders before they connect with you.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8 text-left">
                {[
                  { label: 'Experience', desc: 'Your investment track record and expertise' },
                  { label: 'Investment Clarity', desc: 'How clearly you articulate your thesis' },
                  { label: 'Founder Friendliness', desc: 'Your approach to founder relationships' },
                  { label: 'Decision Speed', desc: 'How quickly you move on opportunities' },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-white/[0.07] bg-[#12121a] p-4">
                    <div className="text-sm font-semibold text-white mb-1">{item.label}</div>
                    <div className="text-xs text-slate-500">{item.desc}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={startInterview}
                className="flex items-center gap-2 mx-auto rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all hover:scale-105"
              >
                <Sparkles className="h-5 w-5" />
                Begin AI Interview
              </button>
            </motion.div>
          )}

          {phase === 'interview' && (
            <motion.div
              key={`q-${currentQ}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              {/* Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-500 font-medium">
                    Question {currentQ + 1} of {AI_INTERVIEW_QUESTIONS.length}
                  </span>
                  <span className="text-xs text-violet-400 font-medium">
                    {Math.round(((currentQ) / AI_INTERVIEW_QUESTIONS.length) * 100)}% complete
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {AI_INTERVIEW_QUESTIONS.map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                        i < currentQ ? 'bg-violet-500' : i === currentQ ? 'bg-violet-500/60' : 'bg-white/[0.06]'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* AI avatar + question */}
              <div className="rounded-2xl border border-white/[0.07] bg-[#12121a] p-8 mb-4">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex-shrink-0">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-violet-400 font-medium mb-1">FounderMatch AI</div>
                    <p className="text-base text-white font-medium leading-relaxed">
                      {AI_INTERVIEW_QUESTIONS[currentQ]}
                    </p>
                  </div>
                </div>

                <textarea
                  value={typingAnswer}
                  onChange={(e) => setTypingAnswer(e.target.value)}
                  placeholder="Type your answer here... Be specific and genuine."
                  rows={5}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-violet-500/60 focus:outline-none focus:ring-1 focus:ring-violet-500/30 transition-all resize-none"
                />
              </div>

              <button
                onClick={handleNext}
                disabled={!typingAnswer.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 py-4 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {currentQ === AI_INTERVIEW_QUESTIONS.length - 1 ? 'Submit & Generate Score' : 'Next Question'}
                <ChevronRight className="h-4 w-4" />
              </button>
            </motion.div>
          )}

          {phase === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/30 to-purple-600/10 border border-violet-500/30 mx-auto mb-6"
              >
                <Brain className="h-10 w-10 text-violet-400" />
              </motion.div>
              <h2 className="text-2xl font-black text-white mb-3">Analyzing your responses...</h2>
              <p className="text-slate-500 mb-6">
                Our AI is evaluating your investment experience, clarity, and approach.
              </p>
              <div className="flex flex-col gap-2 max-w-sm mx-auto">
                {['Parsing investment thesis...', 'Evaluating founder alignment...', 'Calculating decision metrics...'].map((s, i) => (
                  <motion.div
                    key={s}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 1.1 }}
                    className="flex items-center gap-2 text-sm text-slate-400"
                  >
                    <motion.div
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.4 }}
                      className="h-1.5 w-1.5 rounded-full bg-violet-400"
                    />
                    {s}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {phase === 'results' && scores && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
              <h1 className="text-3xl font-black text-white mb-2">Interview Complete!</h1>
              <p className="text-slate-400 mb-8">Here's your Investor Quality Score</p>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 mb-8 bg-violet-500/10 border-violet-500/30">
                <Trophy className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-bold text-white">{scores.badge} Investor</span>
              </div>

              {/* Score rings */}
              <div className="rounded-2xl border border-white/[0.07] bg-[#12121a] p-8 mb-6">
                <div className="flex flex-col items-center mb-8">
                  <ScoreRing score={scores.overall} size={120} strokeWidth={8} />
                  <div className="mt-3 text-lg font-bold text-white">Overall Quality Score</div>
                  <div className="text-sm text-slate-500">out of 100</div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  <ScoreRing score={scores.experience} size={72} strokeWidth={5} label="Experience" />
                  <ScoreRing score={scores.investmentClarity} size={72} strokeWidth={5} label="Clarity" />
                  <ScoreRing score={scores.founderFriendliness} size={72} strokeWidth={5} label="Friendliness" />
                  <ScoreRing score={scores.decisionSpeed} size={72} strokeWidth={5} label="Speed" />
                </div>

                <div className="mt-6 rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 text-sm text-slate-400 text-left">
                  <p className="font-medium text-white mb-1">AI Feedback</p>
                  <p>
                    {scores.overall >= 85
                      ? "Outstanding investor profile. Your clarity of thesis and founder-first approach makes you highly attractive to quality startups."
                      : scores.overall >= 75
                      ? "Strong profile with clear investment criteria. Founders will appreciate your structured decision process."
                      : "Good foundation. Consider being more specific about your investment thesis to attract better-matched founders."}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 mb-6">
                Your score is now visible to founders before they connect with you. It updates each time you retake the interview.
              </p>

              <button
                onClick={() => { toast.success('Score saved to your profile!'); navigate('/dashboard'); }}
                className="flex items-center gap-2 mx-auto rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all hover:scale-105"
              >
                View Dashboard
                <ChevronRight className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
