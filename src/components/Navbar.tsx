import React from 'react';
import { Logo } from './Logo';
import { USER_CAPTAIN } from '../data/mockData';

interface NavbarProps {
  activeTab: 'matches' | 'team' | 'chat' | 'alerts';
  title?: string;
  onProfileClick?: () => void;
  unreadAlertsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  title,
  onProfileClick,
}) => {
  const getTabTitle = () => {
    if (title) return title;
    switch (activeTab) {
      case 'matches':
        return 'Find Matches';
      case 'team':
        return 'My Team';
      case 'chat':
        return 'Match Details';
      case 'alerts':
        return 'Notifications';
      default:
        return 'RivalMatch';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-safe glass border-b border-[#2d3449]/40 shadow-[0_1px_8px_rgba(0,0,0,0.3)]">
      <div className="h-16 px-4 max-w-lg mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {activeTab === 'matches' ? (
            <div className="flex items-center gap-2">
              <Logo size="sm" showText={false} />
              <span className="font-semibold text-lg text-[#dae2fd] tracking-tight">
                {getTabTitle()}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Logo size="sm" showText={false} />
              <span className="font-semibold text-lg text-[#dae2fd] tracking-tight">
                {getTabTitle()}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={onProfileClick}
          className="relative w-9 h-9 rounded-full overflow-hidden border border-[#4edea3]/40 focus:outline-none focus:ring-2 focus:ring-[#4edea3] transition-transform active:scale-95 shadow-sm"
          title={`${USER_CAPTAIN.name} (${USER_CAPTAIN.teamName})`}
        >
          <img
            src={USER_CAPTAIN.avatar}
            alt={USER_CAPTAIN.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#4edea3] rounded-full border border-[#0b1326]" />
        </button>
      </div>
    </header>
  );
};
