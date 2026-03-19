import { useState, useEffect } from 'react';
import type { User } from '@/types';
import { getCurrentUser, setCurrentUser as saveCurrentUser, logout as authLogout } from '@/lib/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => getCurrentUser());

  useEffect(() => {
    const handle = () => setUser(getCurrentUser());
    window.addEventListener('auth-change', handle);
    return () => window.removeEventListener('auth-change', handle);
  }, []);

  function setUser2(u: User | null) {
    if (u) saveCurrentUser(u);
    setUser(u);
    window.dispatchEvent(new Event('auth-change'));
  }

  function logout() {
    authLogout();
    setUser(null);
    window.dispatchEvent(new Event('auth-change'));
  }

  return { user, setUser: setUser2, logout };
}
