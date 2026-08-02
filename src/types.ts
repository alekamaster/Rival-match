export type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ELITE';
export type MatchFormat = '5v5' | '7v7' | '11v11';

export interface Match {
  id: string;
  teamName: string;
  teamLogo: string;
  level: SkillLevel;
  format: MatchFormat;
  date: string;
  time: string;
  venue: string;
  distanceKm: number;
  lookingForOpponent: boolean;
  playerAvatars: string[];
  extraPlayersCount: number;
  feePerPlayer?: string;
  lat?: number;
  lng?: number;
  isBookmarked?: boolean;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  role?: string;
  isCaptain?: boolean;
  position?: string;
  goals?: number;
  assists?: number;
  matchesPlayed?: number;
}

export interface MatchResult {
  id: string;
  opponent: string;
  score: string;
  type: 'Friendly' | 'League' | 'Tournament';
  date: string;
  isWin?: boolean;
  isDraw?: boolean;
}

export interface Team {
  id: string;
  name: string;
  crest: string;
  location: string;
  rating: number;
  league: string;
  playstyleTitle: string;
  playstyleDescription: string;
  availability: { day: string; short: string; available: boolean }[];
  roster: Player[];
  recentForm: ('W' | 'D' | 'L')[];
  recentMatches: MatchResult[];
}

export interface ChatMessage {
  id: string;
  matchId: string;
  senderName: string;
  senderTeam: string;
  avatar: string;
  text: string;
  time: string;
  isUser: boolean;
  isRead?: boolean;
}

export interface ActiveChat {
  matchId: string;
  title: string;
  timeLocation: string;
  venue: string;
  splitFee: string;
  opponentName: string;
  opponentCaptain: string;
  unreadCount?: number;
}

export interface NotificationItem {
  id: string;
  type: 'challenge' | 'confirmed' | 'chat' | 'invite';
  title: string;
  body: string;
  time: string;
  read: boolean;
  matchId?: string;
}
