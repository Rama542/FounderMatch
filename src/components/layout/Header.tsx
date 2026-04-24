import { Link, useLocation } from 'react-router-dom';
import { Zap, LayoutDashboard, Repeat2, MessageSquare, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { UserButton } from '@clerk/react';
import { cn } from '@/lib/utils';

export default function Header() {
  const { user } = useAuth();
  const location = useLocation();

  const navLinks = user
    ? [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/discover', label: 'Discover', icon: Repeat2 },
        { to: '/matches', label: 'Matches', icon: MessageSquare },
      ]
    : [];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#0a0a0f]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 shadow-lg shadow-violet-500/30 transition-transform group-hover:scale-110">
              <Zap className="h-4 w-4 text-white" fill="white" />
            </div>
            <span className="font-space text-lg font-700 text-white tracking-tight">
              Founder<span className="text-violet-400">Match</span>
            </span>
          </Link>

          {/* Nav */}
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                    location.pathname === to
                      ? 'bg-violet-500/15 text-violet-300'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:block max-w-[120px] truncate">{user.name}</span>
                  <span className={cn(
                    'rounded-full px-1.5 py-0.5 text-xs font-medium',
                    user.role === 'founder'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-blue-500/20 text-blue-400'
                  )}>
                    {user.role === 'founder' ? 'Founder' : 'Investor'}
                  </span>
                </Link>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-2"
                >
                  Sign in
                </Link>
                <Link
                  to="/auth?mode=register"
                  className="rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all hover:scale-105"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {user && (
        <div className="md:hidden border-t border-white/[0.06] px-4 py-2 flex gap-1">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex flex-1 flex-col items-center gap-0.5 rounded-lg py-2 text-xs font-medium transition-all',
                location.pathname === to
                  ? 'text-violet-300'
                  : 'text-slate-500 hover:text-slate-300'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
