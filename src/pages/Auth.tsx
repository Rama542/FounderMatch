import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, User, ChevronRight, Rocket, LineChart } from 'lucide-react';
import { login, register } from '@/lib/auth';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import type { UserRole } from '@/types';

export default function Auth() {
  const [params] = useSearchParams();
  const [mode, setMode] = useState<'login' | 'register'>(
    params.get('mode') === 'register' ? 'register' : 'login'
  );
  const [role, setRole] = useState<UserRole>('founder');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const { setUser } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (mode === 'login') {
        const user = login(email, password);
        if (user) {
          setUser(user);
          toast.success(`Welcome back, ${user.name}!`);
          navigate(user.profileComplete ? '/dashboard' : '/onboarding');
        } else {
          toast.error('Invalid credentials. Try registering first.');
        }
      } else {
        if (!name.trim()) {
          toast.error('Please enter your name.');
          setLoading(false);
          return;
        }
        const user = register(email, name, role);
        setUser(user);
        toast.success('Account created! Let\'s set up your profile.');
        navigate('/onboarding');
      }
      setLoading(false);
    }, 800);
  }

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

        <div className="rounded-2xl border border-white/[0.08] bg-[#12121a] p-8">
          <h1 className="text-2xl font-black text-white mb-1">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            {mode === 'login'
              ? 'Sign in to continue matching'
              : 'Join the smartest funding platform'}
          </p>

          {/* Mode toggle */}
          <div className="flex rounded-xl border border-white/[0.08] bg-white/[0.03] p-1 mb-6">
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                {/* Role selection */}
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <button
                    type="button"
                    onClick={() => setRole('founder')}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                      role === 'founder'
                        ? 'border-violet-500 bg-violet-500/10 text-violet-300'
                        : 'border-white/[0.08] bg-white/[0.02] text-slate-500 hover:border-white/[0.15]'
                    }`}
                  >
                    <Rocket className="h-5 w-5" />
                    <span className="text-sm font-semibold">I'm a Founder</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('investor')}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                      role === 'investor'
                        ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                        : 'border-white/[0.08] bg-white/[0.02] text-slate-500 hover:border-white/[0.15]'
                    }`}
                  >
                    <LineChart className="h-5 w-5" />
                    <span className="text-sm font-semibold">I'm an Investor</span>
                  </button>
                </div>

                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-violet-500/60 focus:outline-none focus:ring-1 focus:ring-violet-500/30 transition-all"
                  />
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-violet-500/60 focus:outline-none focus:ring-1 focus:ring-violet-500/30 transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-violet-500/60 focus:outline-none focus:ring-1 focus:ring-violet-500/30 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 disabled:opacity-60 transition-all hover:scale-[1.02]"
            >
              {loading ? (
                <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {mode === 'login' && (
            <p className="mt-6 text-center text-xs text-slate-600">
              Demo: register with any email/password to get started
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
