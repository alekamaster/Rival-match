import React from 'react';

interface BottomNavProps {
  activeTab: 'matches' | 'team' | 'chat' | 'alerts';
  onTabChange: (tab: 'matches' | 'team' | 'chat' | 'alerts') => void;
  unreadChatsCount?: number;
  unreadAlertsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  unreadChatsCount = 1,
  unreadAlertsCount = 1,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe glass border-t border-[#2d3449]/50 shadow-lg">
      <div className="flex justify-between items-center h-16 max-w-lg mx-auto px-3">
        {/* Matches Tab */}
        <button
          onClick={() => onTabChange('matches')}
          className={`flex flex-col items-center justify-center flex-1 min-h-[48px] transition-colors ${
            activeTab === 'matches' ? 'text-[#4edea3]' : 'text-[#bbcabf] hover:text-[#dae2fd]'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">search</span>
          <span className="text-[10px] font-bold tracking-wider uppercase mt-0.5">
            Matches
          </span>
        </button>

        {/* Team Tab */}
        <button
          onClick={() => onTabChange('team')}
          className={`flex flex-col items-center justify-center flex-1 min-h-[48px] transition-colors ${
            activeTab === 'team' ? 'text-[#4edea3]' : 'text-[#bbcabf] hover:text-[#dae2fd]'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">groups</span>
          <span className="text-[10px] font-bold tracking-wider uppercase mt-0.5">
            Team
          </span>
        </button>

        {/* Chat Tab */}
        <button
          onClick={() => onTabChange('chat')}
          className={`flex flex-col items-center justify-center flex-1 min-h-[48px] transition-colors relative ${
            activeTab === 'chat' ? 'text-[#4edea3]' : 'text-[#bbcabf] hover:text-[#dae2fd]'
          }`}
        >
          <div className="relative">
            <span className="material-symbols-outlined text-[24px]">chat_bubble</span>
            {unreadChatsCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-[#7bd0ff] text-[#00354a] font-extrabold text-[9px] rounded-full flex items-center justify-center shadow-sm">
                {unreadChatsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-wider uppercase mt-0.5">
            Chat
          </span>
        </button>

        {/* Alerts Tab */}
        <button
          onClick={() => onTabChange('alerts')}
          className={`flex flex-col items-center justify-center flex-1 min-h-[48px] transition-colors relative ${
            activeTab === 'alerts' ? 'text-[#4edea3]' : 'text-[#bbcabf] hover:text-[#dae2fd]'
          }`}
        >
          <div className="relative">
            <span className="material-symbols-outlined text-[24px]">notifications</span>
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-[#ffb4ab] text-[#690005] font-extrabold text-[9px] rounded-full flex items-center justify-center shadow-sm">
                {unreadAlertsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-wider uppercase mt-0.5">
            Alerts
          </span>
        </button>
      </div>
    </nav>
  );
};
