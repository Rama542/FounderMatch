import type { User, UserRole } from '@/types';

const USER_KEY = 'foundermatch_user';
const USERS_KEY = 'foundermatch_users';

export function getCurrentUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setCurrentUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function logout(): void {
  localStorage.removeItem(USER_KEY);
}

export function getUsers(): User[] {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveUser(user: User): void {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx >= 0) {
    users[idx] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function login(email: string, _password: string): User | null {
  const users = getUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (user) {
    setCurrentUser(user);
    return user;
  }
  return null;
}

export function register(email: string, name: string, role: UserRole): User {
  const user: User = {
    id: `user-${Date.now()}`,
    email,
    name,
    role,
    profileComplete: false,
    createdAt: new Date().toISOString(),
  };
  saveUser(user);
  setCurrentUser(user);
  return user;
}

export function updateUserProfile(updates: Partial<User>): User {
  const current = getCurrentUser();
  if (!current) throw new Error('No user logged in');
  const updated = { ...current, ...updates };
  saveUser(updated);
  setCurrentUser(updated);
  return updated;
}
