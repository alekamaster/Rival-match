import React, { useState, useRef, useEffect } from 'react';
import { ActiveChat, ChatMessage } from '../types';
import { USER_CAPTAIN } from '../data/mockData';

interface MatchChatViewProps {
  activeChats?: ActiveChat[];
  messages?: Record<string, ChatMessage[]>;
  onSendMessage?: (matchId: string, text: string) => void;
  onBackClick?: () => void;
}

export const MatchChatView: React.FC<MatchChatViewProps> = ({
  activeChats = [],
  messages = {},
  onSendMessage,
  onBackClick,
}) => {
  const [selectedChatId, setSelectedChatId] = useState<string>(
    activeChats[0]?.matchId || 'chat_city_lions'
  );
  const [inputText, setInputText] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Sincronizar el chatId seleccionado cuando cambian los chats activos
  useEffect(() => {
    if (activeChats.length > 0 && !activeChats.some((c) => c.matchId === selectedChatId)) {
      setSelectedChatId(activeChats[0].matchId);
    }
  }, [activeChats, selectedChatId]);

  const currentChat = activeChats.find((c) => c.matchId === selectedChatId) || activeChats[0];
  const currentMessages = messages[selectedChatId] || [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    if (onSendMessage) {
      onSendMessage(selectedChatId, inputText.trim());
    }
    setInputText('');
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#0b1326] relative pb-28">
      {/* Top Selector if multiple chats exist */}
      {activeChats.length > 1 && (
        <div className="bg-[#131b2e] px-4 py-2 border-b border-[#2d3449] flex gap-2 overflow-x-auto hide-scrollbar sticky top-16 z-40">
          {activeChats.map((chat) => (
            <button
              key={chat.matchId}
              onClick={() => setSelectedChatId(chat.matchId)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedChatId === chat.matchId
                  ? 'bg-[#4edea3] text-[#003824] shadow-sm'
                  : 'bg-[#222a3d] text-[#bbcabf] hover:text-white'
              }`}
            >
              <span>{chat.title || 'Match Chat'}</span>
            </button>
          ))}
        </div>
      )}

      {/* Sticky Match Details Summary Header */}
      <div className="sticky top-16 z-30 bg-[#0b1326]/90 backdrop-blur-md px-4 py-3 flex flex-col gap-1 border-b border-[#171f33] shadow-sm">
        <div className="flex justify-between items-start w-full">
          <div className="flex flex-col gap-1">
            <h2 className="font-semibold text-xl text-[#dae2fd]">
              {currentChat?.title || 'City FC vs. Opponent'}
            </h2>
            <div className="flex items-center gap-2 text-[#bbcabf] text-sm">
              <span className="material-symbols-outlined text-[16px] text-[#4edea3]">
                calendar_today
              </span>
              <span>{currentChat?.timeLocation || 'Today'}</span>
              <span className="w-1 h-1 rounded-full bg-[#2d3449]" />
              <span className="material-symbols-outlined text-[16px] text-[#7bd0ff]">
                stadium
              </span>
              <span>{currentChat?.venue || 'Local Turf Field'}</span>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 px-2.5 py-1 bg-[#131b2e] rounded-md text-[#4edea3] font-bold text-xs border border-[#4edea3]/30">
              <span className="material-symbols-outlined text-[14px]">payments</span>
              <span>Split Fee: {currentChat?.splitFee || '$5/player'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 px-4 py-4 flex flex-col gap-4">
        {/* System Message Banner */}
        <div className="flex justify-center w-full my-1">
          <span className="px-3 py-1 bg-[#131b2e] border border-[#2d3449] text-[#bbcabf] rounded-full text-xs font-bold tracking-wider">
            Match Confirmed - Chat Opened
          </span>
        </div>

        {currentMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-[#bbcabf]/60 text-xs">
            <span className="material-symbols-outlined text-3xl mb-2">chat_bubble_outline</span>
            <span>No messages yet. Start coordinating the match!</span>
          </div>
        ) : (
          currentMessages.map((msg) => {
            if (msg.isUser) {
              return (
                /* User Message (Right - Emerald) */
                <div
                  key={msg.id}
                  className="flex flex-col items-end w-full max-w-[85%] self-end gap-1 animate-fade-in"
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs font-bold text-[#bbcabf]">
                      You ({USER_CAPTAIN?.teamName || 'Your Team'})
                    </span>
                    <div className="w-6 h-6 rounded-full bg-[#4edea3]/20 flex items-center justify-center overflow-hidden border border-[#4edea3]/40">
                      <img
                        src={USER_CAPTAIN?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt="You"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>

                  <div className="bg-[#4edea3] px-4 py-3 rounded-2xl rounded-tr-sm text-[#003824] text-sm font-medium shadow-md relative group">
                    {msg.text}
                    <div className="flex items-center justify-end mt-1 text-[10px] text-[#003824]/70 gap-1 font-semibold">
                      <span>{msg.time || ''}</span>
                      <span>Read</span>
                      <span className="material-symbols-outlined text-[14px]">done_all</span>
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                /* Opponent Message (Left - Dark Surface) */
                <div
                  key={msg.id}
                  className="flex flex-col items-start w-full max-w-[85%] gap-1 animate-fade-in"
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className="w-6 h-6 rounded-full bg-[#222a3d] flex items-center justify-center overflow-hidden border border-[#2d3449]">
                      <img
                        src={msg.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={msg.senderName || 'Opponent'}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <span className="text-xs font-bold text-[#bbcabf]">
                      {msg.senderName || 'Captain'} ({msg.senderTeam || 'Opponent Team'})
                    </span>
                  </div>

                  <div className="bg-[#171f33] border border-[#2d3449] px-4 py-3 rounded-2xl rounded-tl-sm text-[#dae2fd] text-sm font-medium shadow-sm relative group">
                    {msg.text}
                    <div className="text-[10px] text-[#bbcabf] mt-1 text-right">
                      {msg.time || ''}
                    </div>
                  </div>
                </div>
              );
            }
          })
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Chat Input Bar */}
      <div className="fixed bottom-16 left-0 right-0 p-3 bg-[#0b1326]/95 backdrop-blur-lg border-t border-[#171f33] z-40 max-w-lg mx-auto">
        <form
          onSubmit={handleSend}
          className="flex items-center gap-2 bg-[#131b2e] rounded-full px-3 py-1.5 border border-[#222a3d] focus-within:border-[#4edea3]/60 transition-colors shadow-sm"
        >
          <button
            type="button"
            onClick={() =>
              onSendMessage &&
              onSendMessage(
                selectedChatId,
                '📍 Sharing pitch location: Turf Field 2, Entrance B'
              )
            }
            className="w-8 h-8 flex items-center justify-center text-[#bbcabf] hover:text-[#4edea3] transition-colors shrink-0"
            title="Attach location or fee reminder"
          >
            <span className="material-symbols-outlined text-xl">add_circle</span>
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${currentChat?.opponentCaptain || 'captain'}...`}
            className="flex-1 bg-transparent border-none outline-none text-[#dae2fd] placeholder:text-[#bbcabf]/60 text-sm h-10 px-1"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-9 h-9 rounded-full bg-[#4edea3] flex items-center justify-center text-[#003824] hover:bg-[#6ffbbe] disabled:opacity-40 transition-all shrink-0 shadow-md"
          >
            <span
              className="material-symbols-outlined text-lg font-bold"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              send
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};