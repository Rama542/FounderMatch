import { useUser, useClerk } from '@clerk/react';
import { useEffect, useState } from 'react';
import type { User, UserRole } from '@/types';

type AppData = { role: UserRole; profileComplete: boolean };

function appDataKey(id: string) {
  return `fm_app_${id}`;
}

export function useAuth() {
  const { user: clerk, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn || !clerk) {
      setUserState(null);
      return;
    }

    const raw = localStorage.getItem(appDataKey(clerk.id));
    const data: Partial<AppData> = raw ? JSON.parse(raw) : {};

    setUserState({
      id: clerk.id,
      email: clerk.primaryEmailAddress?.emailAddress ?? '',
      name: clerk.fullName ?? clerk.firstName ?? '',
      role: data.role ?? 'founder',
      profileComplete: data.profileComplete ?? false,
      avatar: clerk.imageUrl ?? undefined,
      createdAt: (clerk.createdAt ?? new Date()).toISOString(),
    });
  }, [isLoaded, isSignedIn, clerk]);

  function setUser(u: User | null) {
    if (!clerk || !u) {
      setUserState(null);
      return;
    }
    const data: AppData = { role: u.role, profileComplete: u.profileComplete };
    localStorage.setItem(appDataKey(clerk.id), JSON.stringify(data));
    setUserState(u);
    window.dispatchEvent(new Event('auth-change'));
  }

  async function logout() {
    await signOut();
    setUserState(null);
    window.dispatchEvent(new Event('auth-change'));
  }

  return { user, isLoaded, setUser, logout };
}
