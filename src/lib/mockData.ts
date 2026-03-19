import type { Match, Message, StartupProfile, InvestorProfile } from '@/types';
import { MOCK_STARTUP_PROFILES, MOCK_INVESTOR_PROFILES } from '@/constants/data';

const SWIPES_KEY = 'foundermatch_swipes';
const MATCHES_KEY = 'foundermatch_matches';
const MESSAGES_KEY = 'foundermatch_messages';
const FOUNDER_PROFILES_KEY = 'foundermatch_founder_profiles';
const INVESTOR_PROFILES_KEY = 'foundermatch_investor_profiles';

// --- Swipes ---
export interface SwipeRecord {
  swiperId: string;
  targetId: string;
  direction: 'left' | 'right';
}

export function getSwipes(): SwipeRecord[] {
  const raw = localStorage.getItem(SWIPES_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveSwipe(swipe: SwipeRecord): void {
  const swipes = getSwipes();
  swipes.push(swipe);
  localStorage.setItem(SWIPES_KEY, JSON.stringify(swipes));
}

// --- Matches ---
export function getMatches(): Match[] {
  const raw = localStorage.getItem(MATCHES_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveMatch(match: Match): void {
  const matches = getMatches();
  const idx = matches.findIndex((m) => m.id === match.id);
  if (idx >= 0) {
    matches[idx] = match;
  } else {
    matches.push(match);
  }
  localStorage.setItem(MATCHES_KEY, JSON.stringify(matches));
}

export function createMatch(founderId: string, investorId: string): Match {
  const match: Match = {
    id: `match-${Date.now()}`,
    founderId,
    investorId,
    founderLiked: true,
    investorLiked: true,
    matchedAt: new Date().toISOString(),
    unreadCount: 0,
  };
  saveMatch(match);
  return match;
}

// --- Messages ---
export function getMessages(matchId: string): Message[] {
  const raw = localStorage.getItem(MESSAGES_KEY);
  const all: Message[] = raw ? JSON.parse(raw) : [];
  return all.filter((m) => m.matchId === matchId);
}

export function sendMessage(matchId: string, senderId: string, content: string): Message {
  const raw = localStorage.getItem(MESSAGES_KEY);
  const all: Message[] = raw ? JSON.parse(raw) : [];
  const msg: Message = {
    id: `msg-${Date.now()}`,
    matchId,
    senderId,
    content,
    timestamp: new Date().toISOString(),
    read: false,
  };
  all.push(msg);
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(all));
  return msg;
}

// --- Profiles ---
export function getFounderProfile(userId: string): StartupProfile | null {
  const raw = localStorage.getItem(FOUNDER_PROFILES_KEY);
  const all: StartupProfile[] = raw ? JSON.parse(raw) : [];
  return all.find((p) => p.userId === userId) ?? null;
}

export function saveFounderProfile(profile: StartupProfile): void {
  const raw = localStorage.getItem(FOUNDER_PROFILES_KEY);
  const all: StartupProfile[] = raw ? JSON.parse(raw) : [];
  const idx = all.findIndex((p) => p.userId === profile.userId);
  if (idx >= 0) {
    all[idx] = profile;
  } else {
    all.push(profile);
  }
  localStorage.setItem(FOUNDER_PROFILES_KEY, JSON.stringify(all));
}

export function getInvestorProfile(userId: string): InvestorProfile | null {
  const raw = localStorage.getItem(INVESTOR_PROFILES_KEY);
  const all: InvestorProfile[] = raw ? JSON.parse(raw) : [];
  return all.find((p) => p.userId === userId) ?? null;
}

export function saveInvestorProfile(profile: InvestorProfile): void {
  const raw = localStorage.getItem(INVESTOR_PROFILES_KEY);
  const all: InvestorProfile[] = raw ? JSON.parse(raw) : [];
  const idx = all.findIndex((p) => p.userId === profile.userId);
  if (idx >= 0) {
    all[idx] = profile;
  } else {
    all.push(profile);
  }
  localStorage.setItem(INVESTOR_PROFILES_KEY, JSON.stringify(all));
}

// --- Mock discovery cards ---
export function getDiscoverStartups(swipedIds: string[]) {
  return MOCK_STARTUP_PROFILES.filter((s) => !swipedIds.includes(s.id));
}

export function getDiscoverInvestors(swipedIds: string[]) {
  return MOCK_INVESTOR_PROFILES.filter((i) => !swipedIds.includes(i.id));
}

// --- AI Scoring simulation ---
export function generateStartupScores() {
  const rand = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
  const marketPotential = rand(65, 95);
  const teamStrength = rand(60, 90);
  const problemClarity = rand(70, 96);
  const overall = Math.round((marketPotential + teamStrength + problemClarity) / 3);
  return {
    marketPotential,
    teamStrength,
    problemClarity,
    overall,
    feedback: overall >= 85
      ? 'Strong startup fundamentals. Clear market need with solid team execution capability.'
      : overall >= 75
      ? 'Good foundation. Focus on sharpening your go-to-market strategy and team composition.'
      : 'Early stage potential. Refine the problem statement and validate assumptions with user data.',
  };
}

export function generateInvestorScores() {
  const rand = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
  const experience = rand(60, 98);
  const investmentClarity = rand(65, 95);
  const founderFriendliness = rand(70, 95);
  const decisionSpeed = rand(55, 90);
  const overall = Math.round((experience + investmentClarity + founderFriendliness + decisionSpeed) / 4);
  const badge = overall >= 88 ? 'Platinum' : overall >= 76 ? 'Gold' : overall >= 62 ? 'Silver' : 'Bronze';
  return { experience, investmentClarity, founderFriendliness, decisionSpeed, overall, badge } as const;
}

export function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount}`;
}
