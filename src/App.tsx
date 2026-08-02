import React, { useState } from 'react';
import { Match, Team, ActiveChat, ChatMessage, NotificationItem, SkillLevel, MatchFormat } from './types';
import {
  INITIAL_MATCHES,
  INITIAL_MY_TEAM,
  INITIAL_ACTIVE_CHATS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_NOTIFICATIONS,
  USER_CAPTAIN,
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { FindMatchesView } from './components/FindMatchesView';
import { MyTeamView } from './components/MyTeamView';
import { MatchChatView } from './components/MatchChatView';
import { AlertsView } from './components/AlertsView';
import { CreateMatchModal } from './components/CreateMatchModal';
import { RosterInviteModal } from './components/RosterInviteModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'matches' | 'team' | 'chat' | 'alerts'>('matches');
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [team, setTeam] = useState<Team>(INITIAL_MY_TEAM);
  const [activeChats, setActiveChats] = useState<ActiveChat[]>(INITIAL_ACTIVE_CHATS);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_CHAT_MESSAGES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
  const [challengeTargetTeam, setChallengeTargetTeam] = useState<string | undefined>(undefined);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Challenge a match or team
  const handleChallengeMatch = (match: Match) => {
    setChallengeTargetTeam(match.teamName);
    setIsChallengeModalOpen(true);
  };

  const handleChallengeTeamFromTeamView = () => {
    setChallengeTargetTeam('Opponent FC');
    setIsChallengeModalOpen(true);
  };

  const handleBookmarkMatch = (matchId: string) => {
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id === matchId) {
          const nextState = !m.isBookmarked;
          showToast(nextState ? `Saved ${m.teamName} to bookmarks` : `Removed bookmark`);
          return { ...m, isBookmarked: nextState };
        }
        return m;
      })
    );
  };

  // Submit Challenge / Create Match Request
  const handleSubmitMatch = (data: {
    teamName: string;
    venue: string;
    date: string;
    time: string;
    format: MatchFormat;
    level: SkillLevel;
    feePerPlayer: string;
  }) => {
    const newChatId = `chat_${Date.now()}`;
    const opponent = data.teamName;

    // Create new active chat
    const newChat: ActiveChat = {
      matchId: newChatId,
      title: `City FC vs. ${opponent}`,
      timeLocation: `${data.date}, ${data.time}`,
      venue: data.venue,
      splitFee: `${data.feePerPlayer}/player`,
      opponentName: opponent,
      opponentCaptain: 'Captain',
      unreadCount: 0,
    };

    setActiveChats((prev) => [newChat, ...prev]);

    // Add initial system / user message
    const initialMsg: ChatMessage = {
      id: `msg_init_${Date.now()}`,
      matchId: newChatId,
      senderName: 'You',
      senderTeam: 'City FC',
      avatar: USER_CAPTAIN.avatar,
      text: `Hey! Challenge issued for ${data.date} at ${data.time} (${data.venue}, ${data.format}). Looking forward to a great match!`,
      time: 'Just now',
      isUser: true,
      isRead: true,
    };

    setMessages((prev) => ({
      ...prev,
      [newChatId]: [initialMsg],
    }));

    // Add notification
    const newAlert: NotificationItem = {
      id: `n_${Date.now()}`,
      type: 'challenge',
      title: `Challenge Sent to ${opponent}`,
      body: `Match details: ${data.date} at ${data.time} • ${data.venue} (${data.format}).`,
      time: 'Just now',
      read: false,
      matchId: newChatId,
    };

    setNotifications((prev) => [newAlert, ...prev]);

    showToast(`Challenge sent to ${opponent}! Chat channel opened.`);
    setActiveTab('chat');
  };

  // Send message in chat
  const handleSendMessage = (matchId: string, text: string) => {
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      matchId,
      senderName: 'You',
      senderTeam: 'The Lions',
      avatar: USER_CAPTAIN.avatar,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: true,
      isRead: true,
    };

    setMessages((prev) => {
      const existing = prev[matchId] || [];
      return {
        ...prev,
        [matchId]: [...existing, newMsg],
      };
    });

    // Simulate automated realistic response after 1.5 seconds
    setTimeout(() => {
      const currentChat = activeChats.find((c) => c.matchId === matchId);
      const responses = [
        'Awesome! I will update our team group chat right away.',
        'Perfect! See you at the pitch.',
        'Sounds good. We will be ready!',
        'Got it! Thanks Mark!',
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const replyMsg: ChatMessage = {
        id: `msg_reply_${Date.now()}`,
        matchId,
        senderName: currentChat?.opponentCaptain || 'Alex',
        senderTeam: currentChat?.opponentName || 'City FC',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
        text: randomResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: false,
      };

      setMessages((prev) => ({
        ...prev,
        [matchId]: [...(prev[matchId] || []), replyMsg],
      }));
    }, 1500);
  };

  // Add new player to roster
  const handleAddPlayer = (name: string, position: string) => {
    const newPlayer = {
      id: `p_${Date.now()}`,
      name,
      avatar: `https://images.unsplash.com/photo-${1500648767791 + Math.floor(Math.random() * 1000)}?auto=format&fit=crop&q=80&w=200`,
      role: 'Player',
      position,
      goals: 0,
      assists: 0,
      matchesPlayed: 1,
    };

    setTeam((prev) => ({
      ...prev,
      roster: [...prev.roster, newPlayer],
    }));

    showToast(`${name} added to ${team.name} roster!`);
  };

  // Notification actions
  const handleAcceptChallenge = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
    showToast('Match challenge accepted! Redirecting to match chat...');
    setActiveTab('chat');
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read.');
  };

  const unreadAlerts = notifications.filter((n) => !n.read).length;

  return (
    <div className="bg-[#0b1326] min-h-screen text-[#dae2fd] max-w-lg mx-auto relative flex flex-col font-['Inter',sans-serif]">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#4edea3] text-[#003824] px-4 py-2.5 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2 animate-fade-in border border-white/20">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top App Bar Header */}
      <Navbar
        activeTab={activeTab}
        unreadAlertsCount={unreadAlerts}
        onProfileClick={() => setIsProfileModalOpen(true)}
      />

      {/* Main Tab Screen Content */}
      <main className="flex-1 pt-16">
        {activeTab === 'matches' && (
          <FindMatchesView
            matches={matches}
            onChallengeMatch={handleChallengeMatch}
            onBookmarkMatch={handleBookmarkMatch}
            onCreateMatchClick={() => {
              setChallengeTargetTeam(undefined);
              setIsChallengeModalOpen(true);
            }}
          />
        )}

        {activeTab === 'team' && (
          <MyTeamView
            team={team}
            onChallengeTeamClick={handleChallengeTeamFromTeamView}
            onInvitePlayerClick={() => setIsInviteModalOpen(true)}
          />
        )}

        {activeTab === 'chat' && (
          <MatchChatView
            activeChats={activeChats}
            messages={messages}
            onSendMessage={handleSendMessage}
          />
        )}

        {activeTab === 'alerts' && (
          <AlertsView
            notifications={notifications}
            onAcceptChallenge={handleAcceptChallenge}
            onOpenChat={() => setActiveTab('chat')}
            onMarkAllRead={handleMarkAllRead}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        unreadChatsCount={1}
        unreadAlertsCount={unreadAlerts}
      />

      {/* Create / Host Match Modal */}
      <CreateMatchModal
        isOpen={isChallengeModalOpen}
        onClose={() => setIsChallengeModalOpen(false)}
        targetTeamName={challengeTargetTeam}
        onSubmitMatch={handleSubmitMatch}
      />

      {/* Roster Invite Player Modal */}
      <RosterInviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onAddPlayer={handleAddPlayer}
      />

      {/* Profile & Captain Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#171f33] border border-[#2d3449] w-full max-w-sm rounded-2xl p-6 flex flex-col gap-4 animate-fade-in relative shadow-2xl">
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute top-4 right-4 text-[#bbcabf] hover:text-white"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="flex flex-col items-center text-center gap-2">
              <img
                src={USER_CAPTAIN.avatar}
                alt={USER_CAPTAIN.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-[#4edea3] shadow-md"
              />
              <h3 className="text-xl font-bold text-white">{USER_CAPTAIN.name}</h3>
              <p className="text-xs text-[#4edea3] font-bold bg-[#4edea3]/10 px-2.5 py-1 rounded-full border border-[#4edea3]/30">
                Captain • {USER_CAPTAIN.teamName}
              </p>
            </div>

            <div className="bg-[#0b1326] p-3 rounded-xl border border-[#2d3449] flex flex-col gap-2 text-xs text-[#bbcabf]">
              <div className="flex justify-between py-1 border-b border-[#2d3449]/50">
                <span>Location</span>
                <span className="text-white font-medium">Eastside Sports Complex</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#2d3449]/50">
                <span>Matches Organized</span>
                <span className="text-[#4edea3] font-bold">24 matches</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Fair Play Score</span>
                <span className="text-[#7bd0ff] font-bold">4.9 ★</span>
              </div>
            </div>

            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="w-full bg-[#222a3d] text-white font-bold h-10 rounded-xl text-xs hover:bg-[#2d3449]"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
