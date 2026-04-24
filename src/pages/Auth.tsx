import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { SignIn, SignUp } from '@clerk/react';

const clerkAppearance = {
  variables: {
    colorBackground: '#12121a',
    colorPrimary: '#7c3aed',
    colorText: '#ffffff',
    colorTextSecondary: '#94a3b8',
    colorInputBackground: 'rgba(255,255,255,0.04)',
    colorInputText: '#ffffff',
    colorInputPlaceholder: '#64748b',
    borderRadius: '0.75rem',
    fontFamily: 'inherit',
  },
  elements: {
    card: 'bg-transparent shadow-none border-0 !p-0',
    rootBox: 'w-full',
    socialButtonsBlockButton: '!border-white/[0.08] !bg-white/[0.04] !text-white hover:!bg-white/[0.08]',
    formButtonPrimary: '!bg-gradient-to-r !from-violet-600 !to-purple-600',
    footerActionLink: '!text-violet-400 hover:!text-violet-300',
    formFieldInput: '!border-white/[0.08] !bg-white/[0.04] !text-white',
    formFieldLabel: '!text-slate-400',
    dividerLine: '!bg-white/[0.08]',
    dividerText: '!text-slate-500',
    headerTitle: '!text-white',
    headerSubtitle: '!text-slate-400',
    footer: '!bg-transparent',
    main: '!gap-4',
  },
};

export default function Auth() {
  const [params] = useSearchParams();
  const [mode, setMode] = useState<'login' | 'register'>(
    params.get('mode') === 'register' ? 'register' : 'login'
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 py-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(124,58,237,0.15),transparent)]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-8 flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-700">
              <Zap className="h-4 w-4 text-white" fill="white" />
            </div>
            <span className="font-space text-lg font-bold text-white">
              Founder<span className="text-violet-400">Match</span>
            </span>
          </Link>
        </div>

        {/* Mode toggle */}
        <div className="flex rounded-xl border border-white/[0.08] bg-white/[0.03] p-1 mb-4">
          {(['login', 'register'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                mode === m
                  ? 'bg-violet-600 text-white shadow-lg'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {m === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#12121a] p-6">
          {mode === 'login' ? (
            <SignIn
              appearance={clerkAppearance}
              afterSignInUrl="/dashboard"
              routing="hash"
            />
          ) : (
            <SignUp
              appearance={clerkAppearance}
              afterSignUpUrl="/onboarding"
              routing="hash"
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}
