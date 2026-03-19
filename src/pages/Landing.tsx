import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Brain, Shield, TrendingUp, Star, CheckCircle2 } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const FEATURES = [
  {
    icon: Zap,
    title: 'Swipe-Style Discovery',
    desc: 'Founders and investors discover each other through intuitive card swiping — like Tinder, but for funding.',
    color: 'from-violet-500/20 to-purple-500/10',
    iconColor: 'text-violet-400',
  },
  {
    icon: Brain,
    title: 'AI Startup Scoring',
    desc: 'Our AI evaluates every startup on market potential, team strength, and problem clarity with detailed feedback.',
    color: 'from-emerald-500/20 to-teal-500/10',
    iconColor: 'text-emerald-400',
  },
  {
    icon: Shield,
    title: 'Investor Quality Score',
    desc: 'Investors go through an AI-powered interview process. Founders see a 1–100 quality score before connecting.',
    color: 'from-blue-500/20 to-indigo-500/10',
    iconColor: 'text-blue-400',
  },
  {
    icon: TrendingUp,
    title: 'Smart Matching',
    desc: 'Match based on industry, stage, funding range, and goals. No more cold emails to the wrong investors.',
    color: 'from-amber-500/20 to-orange-500/10',
    iconColor: 'text-amber-400',
  },
];

const STATS = [
  { label: 'Startups Listed', value: '2,400+' },
  { label: 'Active Investors', value: '840+' },
  { label: 'Successful Matches', value: '$180M+' },
  { label: 'Avg. Time to Match', value: '4 days' },
];

const TESTIMONIALS = [
  {
    quote: 'We raised our seed round in 3 weeks. The AI score system helped us get in front of the right investors immediately.',
    name: 'Aisha Chen',
    role: 'CEO, NeuralPay',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=64&h=64&fit=crop&crop=face',
    raised: '$2M Seed',
  },
  {
    quote: "The investor quality score is brilliant. I can finally see who's serious before spending time on calls.",
    name: 'Marcus Williams',
    role: 'Founder, EduMorph',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
    raised: '$750K Pre-seed',
  },
  {
    quote: "As an investor, the AI startup scoring saves me hours of screening. I see only what's worth my time.",
    name: 'Victoria Hartwell',
    role: 'Partner, Apex Ventures',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=64&h=64&fit=crop&crop=face',
    invested: '12 deals in 6 months',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Hero */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0f]/60 to-[#0a0a0f]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(124,58,237,0.3),transparent)]" />

        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(124,58,237,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(124,58,237,1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center pt-24 pb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300"
          >
            <Zap className="h-3.5 w-3.5" fill="currentColor" />
            AI-Powered Startup–Investor Matching
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight"
          >
            Where{' '}
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Startups
            </span>
            {' '}Meet{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Capital
            </span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-6 text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto"
          >
            The smartest way to connect founders with investors. Swipe, match, and get funded — with AI scoring every step of the way.
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/auth?mode=register"
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-4 text-base font-semibold text-white shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all hover:scale-105"
            >
              Start Matching Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/auth"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-8 py-4 text-base font-medium text-slate-300 hover:bg-white/[0.08] hover:text-white transition-all"
            >
              Sign In
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 backdrop-blur-sm">
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="mt-0.5 text-xs text-slate-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Everything you need to find{' '}
              <span className="text-violet-400">the right match</span>
            </h2>
            <p className="mt-4 text-slate-400 text-lg max-w-2xl mx-auto">
              AI-powered tools designed for both founders and investors.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className={`rounded-2xl border border-white/[0.07] bg-gradient-to-br ${f.color} p-6 backdrop-blur-sm hover:border-white/[0.12] transition-all`}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.07] mb-4 ${f.iconColor}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-16">
            Get funded in <span className="text-violet-400">3 steps</span>
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { n: '01', title: 'Create Your Profile', desc: 'Founders build startup profiles. Investors set their thesis. AI scores everything.' },
              { n: '02', title: 'Swipe & Discover', desc: 'Browse investor cards. Swipe right to connect. Mutual interest creates a match.' },
              { n: '03', title: 'Match & Chat', desc: 'Matched pairs can message directly. From first swipe to funding call.' },
            ].map((step, i) => (
              <motion.div
                key={step.n}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/30 to-purple-600/10 border border-violet-500/30 text-2xl font-black text-violet-400 mb-4">
                  {step.n}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-black text-white text-center mb-16">
            Trusted by <span className="text-violet-400">top founders</span> and investors
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="rounded-2xl border border-white/[0.07] bg-[#12121a] p-6"
              >
                <div className="flex mb-4">
                  {Array(5).fill(0).map((_, j) => (
                    <Star key={j} className="h-4 w-4 text-amber-400" fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                  <div className="ml-auto">
                    <span className="rounded-full bg-emerald-500/15 border border-emerald-500/25 px-2 py-0.5 text-xs text-emerald-400">
                      {t.raised ?? t.invested}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-900/30 to-purple-900/20 p-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Ready to find your perfect match?
            </h2>
            <p className="text-slate-400 mb-8">
              Join 2,400+ startups and 840+ investors already matching on FounderMatch.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              {['Free to join', 'AI-powered scoring', 'Direct messaging'].map((item) => (
                <div key={item} className="flex items-center gap-1.5 text-sm text-slate-400">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  {item}
                </div>
              ))}
            </div>
            <Link
              to="/auth?mode=register"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-4 text-base font-semibold text-white shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all hover:scale-105"
            >
              Create Free Account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 px-4 text-center text-sm text-slate-600">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap className="h-4 w-4 text-violet-500" fill="currentColor" />
          <span className="text-white font-semibold">FounderMatch</span>
        </div>
        <p>© 2026 FounderMatch. All rights reserved.</p>
      </footer>
    </div>
  );
}
