import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-black text-white/5 mb-4">404</div>
        <Zap className="h-12 w-12 text-violet-400 mx-auto mb-4" />
        <h1 className="text-2xl font-black text-white mb-2">Page not found</h1>
        <p className="text-slate-500 mb-8">This page doesn't exist or has been moved.</p>
        <Link
          to="/"
          className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-all"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
