import React from 'react';
import { NotificationItem } from '../types';

interface AlertsViewProps {
  notifications: NotificationItem[];
  onAcceptChallenge: (notificationId: string) => void;
  onOpenChat: () => void;
  onMarkAllRead: () => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  notifications,
  onAcceptChallenge,
  onOpenChat,
  onMarkAllRead,
}) => {
  return (
    <div className="flex flex-col w-full min-h-screen bg-[#0b1326] relative pb-28 p-4 pt-3">
      {/* Header Bar */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-[#dae2fd]">Notifications & Alerts</h2>
          <p className="text-xs text-[#bbcabf]">Stay updated on challenges and match requests</p>
        </div>

        <button
          onClick={onMarkAllRead}
          className="text-xs font-bold text-[#4edea3] hover:underline"
        >
          Mark all read
        </button>
      </div>

      {/* List of Notifications */}
      <div className="flex flex-col gap-3">
        {notifications.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-xl border transition-all ${
              !item.read
                ? 'bg-[#171f33] border-[#4edea3]/50 shadow-md'
                : 'bg-[#131b2e] border-[#2d3449] opacity-85'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  item.type === 'challenge'
                    ? 'bg-[#4edea3]/20 text-[#4edea3]'
                    : item.type === 'confirmed'
                    ? 'bg-[#7bd0ff]/20 text-[#7bd0ff]'
                    : item.type === 'chat'
                    ? 'bg-[#10b981]/20 text-[#4edea3]'
                    : 'bg-[#222a3d] text-[#bbcabf]'
                }`}
              >
                <span className="material-symbols-outlined text-xl">
                  {item.type === 'challenge'
                    ? 'sports'
                    : item.type === 'confirmed'
                    ? 'check_circle'
                    : item.type === 'chat'
                    ? 'chat'
                    : 'group_add'}
                </span>
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-sm text-[#dae2fd]">{item.title}</h4>
                  <span className="text-[10px] text-[#bbcabf] font-medium">{item.time}</span>
                </div>
                <p className="text-xs text-[#bbcabf] mt-1 leading-relaxed">{item.body}</p>

                {/* Contextual Actions */}
                {item.type === 'challenge' && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => onAcceptChallenge(item.id)}
                      className="bg-[#4edea3] text-[#003824] text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#6ffbbe] transition-colors"
                    >
                      Accept Challenge
                    </button>
                    <button
                      onClick={onOpenChat}
                      className="bg-[#222a3d] text-[#dae2fd] text-xs font-bold px-3 py-1.5 rounded-lg border border-[#2d3449] hover:bg-[#2d3449]"
                    >
                      Open Chat
                    </button>
                  </div>
                )}

                {item.type === 'chat' && (
                  <button
                    onClick={onOpenChat}
                    className="mt-2 text-xs font-bold text-[#4edea3] hover:underline flex items-center gap-1"
                  >
                    <span>Reply in Chat</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
