export type UserRole = 'founder' | 'investor';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  avatar?: string;
  profileComplete: boolean;
  createdAt: string;
}

export interface StartupProfile {
  id: string;
  userId: string;
  startupName: string;
  industry: Industry;
  problemStatement: string;
  solution: string;
  stage: StartupStage;
  fundingRequired: number;
  pitchDeckUrl?: string;
  videoPitchUrl?: string;
  teamSize: number;
  location: string;
  website?: string;
  traction?: string;
  aiScores?: StartupAIScores;
  createdAt: string;
}

export interface InvestorProfile {
  id: string;
  userId: string;
  investorName: string;
  firmName: string;
  bio: string;
  minInvestment: number;
  maxInvestment: number;
  preferredIndustries: Industry[];
  preferredStages: StartupStage[];
  portfolioCompanies: string[];
  location: string;
  linkedIn?: string;
  qualityScore?: InvestorQualityScore;
  interviewCompleted: boolean;
  createdAt: string;
}

export interface StartupAIScores {
  marketPotential: number;
  teamStrength: number;
  problemClarity: number;
  overall: number;
  feedback: string;
}

export interface InvestorQualityScore {
  experience: number;
  investmentClarity: number;
  founderFriendliness: number;
  decisionSpeed: number;
  overall: number;
  badge: 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
}

export type Industry =
  | 'FinTech'
  | 'HealthTech'
  | 'EdTech'
  | 'CleanTech'
  | 'AI/ML'
  | 'SaaS'
  | 'E-Commerce'
  | 'DeepTech'
  | 'Gaming'
  | 'Web3'
  | 'Marketplace'
  | 'Consumer'
  | 'BioTech'
  | 'SpaceTech'
  | 'PropTech';

export type StartupStage = 'Idea' | 'MVP' | 'Early Revenue' | 'Scaling';

export interface Match {
  id: string;
  founderId: string;
  investorId: string;
  founderLiked: boolean;
  investorLiked: boolean;
  matchedAt?: string;
  lastMessage?: string;
  unreadCount?: number;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface SwipeAction {
  targetId: string;
  direction: 'left' | 'right';
}

export interface AIInterviewQuestion {
  id: string;
  question: string;
  answer: string;
}
