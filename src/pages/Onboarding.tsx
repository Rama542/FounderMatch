import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, Zap, Rocket, LineChart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { saveFounderProfile, saveInvestorProfile, generateStartupScores } from '@/lib/mockData';
import { INDUSTRIES, STARTUP_STAGES, INDUSTRY_ICONS } from '@/constants/data';
import { toast } from 'sonner';
import type { StartupProfile, InvestorProfile, Industry, StartupStage, UserRole } from '@/types';
import { cn } from '@/lib/utils';

export default function Onboarding() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Founder fields
  const [startupName, setStartupName] = useState('');
  const [industry, setIndustry] = useState<Industry | ''>('');
  const [stage, setStage] = useState<StartupStage | ''>('');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [funding, setFunding] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [location, setLocation] = useState('');
  const [traction, setTraction] = useState('');

  // Investor fields
  const [firmName, setFirmName] = useState('');
  const [bio, setBio] = useState('');
  const [minInv, setMinInv] = useState('');
  const [maxInv, setMaxInv] = useState('');
  const [selIndustries, setSelIndustries] = useState<Industry[]>([]);
  const [selStages, setSelStages] = useState<StartupStage[]>([]);
  const [portfolio, setPortfolio] = useState('');

  const [roleChosen, setRoleChosen] = useState(false);
  const [localRole, setLocalRole] = useState<UserRole>('founder');

  if (!user) {
    navigate('/auth');
    return null;
  }

  const isFounder = localRole === 'founder';

  const founderSteps = [
    { title: 'Startup Basics', subtitle: 'Tell us about your company' },
    { title: 'Problem & Solution', subtitle: 'What are you solving?' },
    { title: 'Funding & Team', subtitle: 'Stage and funding details' },
  ];

  const investorSteps = [
    { title: 'About You', subtitle: 'Your investment profile' },
    { title: 'Investment Thesis', subtitle: 'What you look for' },
    { title: 'Portfolio', subtitle: 'Your track record' },
  ];

  const steps = isFounder ? founderSteps : investorSteps;

  function toggleIndustry(ind: Industry) {
    setSelIndustries((prev) =>
      prev.includes(ind) ? prev.filter((i) => i !== ind) : [...prev, ind]
    );
  }

  function toggleStage(s: StartupStage) {
    setSelStages((prev) =>
      prev.includes(s) ? prev.filter((i) => i !== s) : [...prev, s]
    );
  }

  function handleNext() {
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    } else {
      handleSubmit();
    }
  }

  function handleSubmit() {
    setLoading(true);
    setTimeout(() => {
      if (isFounder) {
        const profile: StartupProfile = {
          id: `sp-${Date.now()}`,
          userId: user.id,
          startupName,
          industry: industry as Industry,
          problemStatement: problem,
          solution,
          stage: stage as StartupStage,
          fundingRequired: Number(funding),
          teamSize: Number(teamSize),
          location,
          traction: traction || undefined,
          aiScores: generateStartupScores(),
          createdAt: new Date().toISOString(),
        };
        saveFounderProfile(profile);
      } else {
        const profile: InvestorProfile = {
          id: `ip-${Date.now()}`,
          userId: user.id,
          investorName: user.name,
          firmName,
          bio,
          minInvestment: Number(minInv),
          maxInvestment: Number(maxInv),
          preferredIndustries: selIndustries,
          preferredStages: selStages,
          portfolioCompanies: portfolio.split(',').map((s) => s.trim()).filter(Boolean),
          location,
          interviewCompleted: false,
          createdAt: new Date().toISOString(),
        };
        saveInvestorProfile(profile);
      }
      setUser({ ...user!, role: localRole, profileComplete: true });
      toast.success('Profile created! AI is scoring your profile...');
      navigate('/dashboard');
      setLoading(false);
    }, 1200);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 py-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(124,58,237,0.1),transparent)]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-lg"
      >
        {!roleChosen && (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-700">
                <Zap className="h-4 w-4 text-white" fill="white" />
              </div>
              <span className="font-space text-lg font-bold text-white">
                Founder<span className="text-violet-400">Match</span>
              </span>
            </div>
            <h1 className="text-2xl font-black text-white mb-1">Who are you?</h1>
            <p className="text-sm text-slate-500 mb-8">Choose your role to personalise your experience</p>
            <div className="rounded-2xl border border-white/[0.08] bg-[#12121a] p-8">
              <div className="grid grid-cols-2 gap-4 mb-8">
                <button
                  type="button"
                  onClick={() => setLocalRole('founder')}
                  className={`flex flex-col items-center gap-3 rounded-xl border p-6 transition-all ${
                    localRole === 'founder'
                      ? 'border-violet-500 bg-violet-500/10 text-violet-300'
                      : 'border-white/[0.08] bg-white/[0.02] text-slate-500 hover:border-white/[0.15]'
                  }`}
                >
                  <Rocket className="h-7 w-7" />
                  <div>
                    <div className="text-sm font-semibold">I'm a Founder</div>
                    <div className="text-xs text-slate-500 mt-0.5">Raise funding</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setLocalRole('investor')}
                  className={`flex flex-col items-center gap-3 rounded-xl border p-6 transition-all ${
                    localRole === 'investor'
                      ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                      : 'border-white/[0.08] bg-white/[0.02] text-slate-500 hover:border-white/[0.15]'
                  }`}
                >
                  <LineChart className="h-7 w-7" />
                  <div>
                    <div className="text-sm font-semibold">I'm an Investor</div>
                    <div className="text-xs text-slate-500 mt-0.5">Discover startups</div>
                  </div>
                </button>
              </div>
              <button
                onClick={() => {
                  setUser({ ...user!, role: localRole });
                  setRoleChosen(true);
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {roleChosen && (
        <>
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-700">
              <Zap className="h-4 w-4 text-white" fill="white" />
            </div>
            <span className="font-space text-lg font-bold text-white">
              Founder<span className="text-violet-400">Match</span>
            </span>
          </div>
          <h1 className="text-2xl font-black text-white">{steps[step].title}</h1>
          <p className="text-sm text-slate-500 mt-1">{steps[step].subtitle}</p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                'flex-1 h-1 rounded-full transition-all duration-500',
                i <= step ? 'bg-violet-500' : 'bg-white/[0.08]'
              )}
            />
          ))}
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#12121a] p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {isFounder ? (
                <>
                  {step === 0 && (
                    <>
                      <Field label="Startup Name" required>
                        <input value={startupName} onChange={(e) => setStartupName(e.target.value)} placeholder="e.g. NeuralPay" className={inputCls} />
                      </Field>
                      <Field label="Industry" required>
                        <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                          {INDUSTRIES.map((ind) => (
                            <button
                              key={ind}
                              type="button"
                              onClick={() => setIndustry(ind)}
                              className={cn(
                                'flex flex-col items-center gap-1 rounded-xl border p-2 text-xs transition-all',
                                industry === ind
                                  ? 'border-violet-500 bg-violet-500/10 text-violet-300'
                                  : 'border-white/[0.06] bg-white/[0.02] text-slate-500 hover:border-white/[0.15]'
                              )}
                            >
                              <span>{INDUSTRY_ICONS[ind]}</span>
                              <span>{ind}</span>
                            </button>
                          ))}
                        </div>
                      </Field>
                      <Field label="Location" required>
                        <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. San Francisco, CA" className={inputCls} />
                      </Field>
                    </>
                  )}
                  {step === 1 && (
                    <>
                      <Field label="Problem Statement" required>
                        <textarea
                          value={problem}
                          onChange={(e) => setProblem(e.target.value)}
                          placeholder="What problem are you solving? Be specific."
                          rows={3}
                          className={inputCls}
                        />
                      </Field>
                      <Field label="Your Solution" required>
                        <textarea
                          value={solution}
                          onChange={(e) => setSolution(e.target.value)}
                          placeholder="How does your product solve this problem?"
                          rows={3}
                          className={inputCls}
                        />
                      </Field>
                      <Field label="Traction (optional)">
                        <input value={traction} onChange={(e) => setTraction(e.target.value)} placeholder="e.g. $50K MRR, 500 customers" className={inputCls} />
                      </Field>
                    </>
                  )}
                  {step === 2 && (
                    <>
                      <Field label="Startup Stage" required>
                        <div className="grid grid-cols-2 gap-2">
                          {STARTUP_STAGES.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setStage(s)}
                              className={cn(
                                'rounded-xl border p-3 text-sm font-medium transition-all',
                                stage === s
                                  ? 'border-violet-500 bg-violet-500/10 text-violet-300'
                                  : 'border-white/[0.06] bg-white/[0.02] text-slate-500 hover:border-white/[0.15]'
                              )}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </Field>
                      <Field label="Funding Required ($)" required>
                        <input type="number" value={funding} onChange={(e) => setFunding(e.target.value)} placeholder="e.g. 1000000" className={inputCls} />
                      </Field>
                      <Field label="Team Size" required>
                        <input type="number" value={teamSize} onChange={(e) => setTeamSize(e.target.value)} placeholder="e.g. 5" className={inputCls} />
                      </Field>
                    </>
                  )}
                </>
              ) : (
                <>
                  {step === 0 && (
                    <>
                      <Field label="Firm / Fund Name" required>
                        <input value={firmName} onChange={(e) => setFirmName(e.target.value)} placeholder="e.g. Apex Ventures" className={inputCls} />
                      </Field>
                      <Field label="Bio" required>
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          placeholder="Tell founders about yourself, your background and investment philosophy..."
                          rows={4}
                          className={inputCls}
                        />
                      </Field>
                      <Field label="Location" required>
                        <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. New York, NY" className={inputCls} />
                      </Field>
                    </>
                  )}
                  {step === 1 && (
                    <>
                      <Field label="Investment Range ($)">
                        <div className="grid grid-cols-2 gap-3">
                          <input type="number" value={minInv} onChange={(e) => setMinInv(e.target.value)} placeholder="Min (e.g. 100000)" className={inputCls} />
                          <input type="number" value={maxInv} onChange={(e) => setMaxInv(e.target.value)} placeholder="Max (e.g. 5000000)" className={inputCls} />
                        </div>
                      </Field>
                      <Field label="Preferred Industries (select multiple)" required>
                        <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                          {INDUSTRIES.map((ind) => (
                            <button
                              key={ind}
                              type="button"
                              onClick={() => toggleIndustry(ind)}
                              className={cn(
                                'flex flex-col items-center gap-1 rounded-xl border p-2 text-xs transition-all',
                                selIndustries.includes(ind)
                                  ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                                  : 'border-white/[0.06] bg-white/[0.02] text-slate-500 hover:border-white/[0.15]'
                              )}
                            >
                              <span>{INDUSTRY_ICONS[ind]}</span>
                              <span>{ind}</span>
                            </button>
                          ))}
                        </div>
                      </Field>
                      <Field label="Preferred Stages" required>
                        <div className="grid grid-cols-2 gap-2">
                          {STARTUP_STAGES.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => toggleStage(s)}
                              className={cn(
                                'rounded-xl border p-3 text-sm font-medium transition-all',
                                selStages.includes(s)
                                  ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                                  : 'border-white/[0.06] bg-white/[0.02] text-slate-500 hover:border-white/[0.15]'
                              )}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </Field>
                    </>
                  )}
                  {step === 2 && (
                    <>
                      <Field label="Portfolio Companies (comma-separated)">
                        <input
                          value={portfolio}
                          onChange={(e) => setPortfolio(e.target.value)}
                          placeholder="e.g. Stripe, Notion, Figma"
                          className={inputCls}
                        />
                      </Field>
                      <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                        <p className="text-sm text-amber-300 font-medium mb-1">🎯 AI Investor Interview</p>
                        <p className="text-xs text-slate-400">After setup, complete the AI interview to get your Investor Quality Score. Founders see this before connecting with you.</p>
                      </div>
                    </>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-slate-400 hover:text-white transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 disabled:opacity-60 transition-all"
            >
              {loading ? (
                <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : step === steps.length - 1 ? (
                <>
                  <Check className="h-4 w-4" />
                  Complete Setup
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
        </>
        )}
      </motion.div>
    </div>
  );
}

const inputCls = 'w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-violet-500/60 focus:outline-none focus:ring-1 focus:ring-violet-500/30 transition-all resize-none';

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">
        {label}{required && <span className="text-violet-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
