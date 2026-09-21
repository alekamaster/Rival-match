import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { 
  fetchNotifications, 
  markAllNotificationsAsRead, 
  acceptChallenge 
} from '../services/api';

interface AlertsViewProps {
  currentUserId?: string;
  myTeamId?: string;
  onOpenChat: (matchId?: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  currentUserId = '',
  myTeamId = '',
  onOpenChat,
}) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    // A. Cargar notificaciones iniciales desde Supabase
    async function loadAlerts() {
      setLoading(true);
      try {
        const data = await fetchNotifications();
        setNotifications(data || []);
      } catch (error) {
        console.error('Error loading notifications:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAlerts();

    // B. Suscripción en Tiempo Real para recibir nuevas notificaciones al instante
    if (currentUserId) {
      const channel = supabase
        .channel(`notifications_${currentUserId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${currentUserId}`,
          },
          (payload) => {
            setNotifications((prev) => [payload.new, ...prev]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [currentUserId]);

  // Manejar marcar todas como leídas
  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Manejar aceptar desafío
  const handleAccept = async (notificationId: string, matchId: string) => {
    setProcessingId(notificationId);
    try {
      await acceptChallenge(matchId);
      // Actualizar estado local para reflejar el cambio
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true, type: 'confirmed' } : n))
      );
    } catch (error) {
      console.error('Error accepting challenge:', error);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex w-full min-h-screen bg-[#0b1326] items-center justify-center text-[#dae2fd]">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="material-symbols-outlined animate-spin text-[#4edea3]">sync</span>
          <span>Loading alerts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#0b1326] relative pb-28 p-4 pt-3">
      {/* Header Bar */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-[#dae2fd]">Notifications & Alerts</h2>
          <p className="text-xs text-[#bbcabf]">Stay updated on challenges and match requests</p>
        </div>

        {notifications.some((n) => !n.read) && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs font-bold text-[#4edea3] hover:underline"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* List of Notifications */}
      <div className="flex flex-col gap-3">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-[#bbcabf]">
            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">notifications_off</span>
            <p className="text-xs">No notifications at the moment.</p>
          </div>
        ) : (
          notifications.map((item) => {
            const isProcessing = processingId === item.id;
            const formattedTime = item.created_at
              ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'Now';

            return (
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
                      <h4 className="font-bold text-sm text-[#dae2fd]">{item.title || 'Notification'}</h4>
                      <span className="text-[10px] text-[#bbcabf] font-medium">
                        {formattedTime}
                      </span>
                    </div>
                    <p className="text-xs text-[#bbcabf] mt-1 leading-relaxed">{item.body || item.message || ''}</p>

                    {/* Acciones de Desafío */}
                    {item.type === 'challenge' && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleAccept(item.id, item.match_id || item.matchId)}
                          disabled={isProcessing}
                          className="bg-[#4edea3] text-[#003824] text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#6ffbbe] transition-colors disabled:opacity-50"
                        >
                          {isProcessing ? 'Accepting...' : 'Accept Challenge'}
                        </button>
                        <button
                          onClick={() => onOpenChat(item.match_id || item.matchId)}
                          disabled={isProcessing}
                          className="bg-[#222a3d] text-[#dae2fd] text-xs font-bold px-3 py-1.5 rounded-lg border border-[#2d3449] hover:bg-[#2d3449] disabled:opacity-50"
                        >
                          Open Chat
                        </button>
                      </div>
                    )}

                    {/* Acciones de Chat */}
                    {item.type === 'chat' && (
                      <button
                        onClick={() => onOpenChat(item.match_id || item.matchId)}
                        className="mt-2 text-xs font-bold text-[#4edea3] hover:underline flex items-center gap-1"
                      >
                        <span>Reply in Chat</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};