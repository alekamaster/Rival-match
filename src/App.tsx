import React, { useState, useEffect } from 'react';
// 1. Tipos de datos
import { Match, Team, ActiveChat, ChatMessage, NotificationItem, SkillLevel, MatchFormat } from './types';

// 2. Componentes visuales
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { FindMatchesView } from './components/FindMatchesView';
import { MyTeamView } from './components/MyTeamView';
import { MatchChatView } from './components/MatchChatView';
import { AlertsView } from './components/AlertsView';
import { CreateMatchModal } from './components/CreateMatchModal';
import { RosterInviteModal } from './components/RosterInviteModal';

// 3. Cliente de Supabase y funciones de API
import { supabase } from './supabase';
import { fetchNotifications, markAllNotificationsAsRead, acceptChallenge } from './services/api';

export default function App() {
  // --- ESTADOS DE NAVEGACIÓN Y PANTALLAS ---
  const [activeTab, setActiveTab] = useState<'matches' | 'team' | 'chat' | 'alerts'>('matches');

  // --- ESTADOS DE DATOS ---
  const [matches, setMatches] = useState<Match[]>([]);
  const [team, setTeam] = useState<Team>({
    id: 't_cityfc',
    name: 'City FC',
    badge: 'https://images.unsplash.com/photo-1614632537190-23e4146777db?auto=format&fit=crop&q=80&w=200',
    coverImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800',
    level: 'Intermediate',
    format: '7v7',
    record: '12W - 4L - 2D',
    captainName: 'Alexis',
    captainAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    roster: [],
  });
  const [activeChats, setActiveChats] = useState<ActiveChat[]>([]);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // --- ESTADOS DE MODALES Y NOTIFICACIONES MENTALES (TOAST) ---
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
  const [challengeTargetTeam, setChallengeTargetTeam] = useState<string | undefined>(undefined);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // ID de usuario y equipo activos (Temporales mientras configuramos Login)
  const currentUserId = 'usr_1';
  const currentTeamId = 't_cityfc';

  // --- FUNCIÓN PARA MOSTRAR MENSAJES FLOTANTES ---
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // --- Cargar Partidos desde Supabase ---
  useEffect(() => {
    async function loadMatches() {
      const { data, error } = await supabase
        .from('match_requests')
        .select(`
          id,
          venue_name,
          match_date,
          price_split_info,
          status,
          host_team:teams!host_team_id (
            id,
            name,
            badge_url,
            level,
            format
          )
        `)
        .eq('status', 'open');

      if (!error && data) {
        const formatted: Match[] = data.map((item: any) => ({
          id: item.id,
          teamName: item.host_team?.name || 'Equipo Rival',
          badge: item.host_team?.badge_url || 'https://via.placeholder.com/150',
          venue: item.venue_name,
          date: new Date(item.match_date).toLocaleDateString(),
          time: new Date(item.match_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          format: item.host_team?.format || '7v7',
          level: item.host_team?.level || 'Intermediate',
          feePerPlayer: item.price_split_info || '$5/player',
          isBookmarked: false,
        }));
        setMatches(formatted);
      }
    }

    if (activeTab === 'matches') {
      loadMatches();
    }
  }, [activeTab]);

  // --- Cargar Notificaciones desde Supabase ---
  useEffect(() => {
    async function loadAlerts() {
      const data = await fetchNotifications(currentUserId);
      if (data) {
        const formattedAlerts: NotificationItem[] = data.map((n: any) => ({
          id: n.id,
          type: n.type,
          title: n.title,
          body: n.body,
          time: new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: n.read,
          matchId: n.match_id,
        }));
        setNotifications(formattedAlerts);
      }
    }

    loadAlerts();
  }, [activeTab]);

  // --- ACCIONES Y ACCIONES DE EVENTOS ---
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
          showToast(nextState ? `Guardado ${m.teamName} en favoritos` : `Eliminado de favoritos`);
          return { ...m, isBookmarked: nextState };
        }
        return m;
      })
    );
  };

  // Crear o publicar un nuevo partido
  const handleSubmitMatch = async (data: {
    teamName: string;
    venue: string;
    date: string;
    time: string;
    format: MatchFormat;
    level: SkillLevel;
    feePerPlayer: string;
  }) => {
    // Insertar en Supabase
    const { error } = await supabase.from('match_requests').insert([
      {
        host_team_id: currentTeamId,
        venue_name: data.venue,
        match_date: `${data.date}T${data.time}:00Z`,
        price_split_info: `${data.feePerPlayer}/player`,
        status: 'open',
      },
    ]);

    if (error) {
      showToast('Error al publicar el partido en Supabase');
      return;
    }

    showToast(`¡Desafío publicado para ${data.teamName}!`);
    setIsChallengeModalOpen(false);
    setActiveTab('chat');
  };

  // Enviar mensaje de chat
  const handleSendMessage = async (matchId: string, text: string) => {
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      matchId,
      senderName: 'Tú',
      senderTeam: team.name,
      avatar: team.captainAvatar,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: true,
      isRead: true,
    };

    setMessages((prev) => ({
      ...prev,
      [matchId]: [...(prev[matchId] || []), newMsg],
    }));

    // Guardar también en base de datos
    await supabase.from('chat_messages').insert([
      {
        match_id: matchId,
        sender_id: currentUserId,
        content: text,
      },
    ]);
  };

  // Agregar jugador al equipo
  const handleAddPlayer = async (name: string, position: string) => {
    const newPlayer = {
      id: `p_${Date.now()}`,
      name,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200`,
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

    showToast(`¡${name} agregado a la plantilla de ${team.name}!`);
  };

  // Aceptar Desafío desde Notificaciones
  const handleAcceptChallenge = async (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
    showToast('¡Desafío aceptado! Redirigiendo al chat del partido...');
    setActiveTab('chat');
  };

  // Marcar todas las notificaciones como leídas
  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead(currentUserId);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('Todas las notificaciones marcadas como leídas.');
  };

  // Contadores para insignias (badges)
  const unreadAlerts = notifications.filter((n) => !n.read).length;

  return (
    <div className="bg-[#0b1326] min-h-screen text-[#dae2fd] max-w-lg mx-auto relative flex flex-col font-['Inter',sans-serif]">
      {/* Toast Banner Flotante */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#4edea3] text-[#003824] px-4 py-2.5 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2 animate-fade-in border border-white/20">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Encabezado Superior */}
      <Navbar
        activeTab={activeTab}
        unreadAlertsCount={unreadAlerts}
        onProfileClick={() => setIsProfileModalOpen(true)}
      />

      {/* Contenido Principal de Pestañas */}
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

      {/* Navegación Inferior */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        unreadChatsCount={1}
        unreadAlertsCount={unreadAlerts}
      />

      {/* Modal Crear Partido */}
      <CreateMatchModal
        isOpen={isChallengeModalOpen}
        onClose={() => setIsChallengeModalOpen(false)}
        targetTeamName={challengeTargetTeam}
        onSubmitMatch={handleSubmitMatch}
      />

      {/* Modal Invitar Jugador */}
      <RosterInviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onAddPlayer={handleAddPlayer}
      />

      {/* Modal Perfil del Capitán */}
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
                src={team.captainAvatar}
                alt={team.captainName}
                className="w-20 h-20 rounded-full object-cover border-2 border-[#4edea3] shadow-md"
              />
              <h3 className="text-xl font-bold text-white">{team.captainName}</h3>
              <p className="text-xs text-[#4edea3] font-bold bg-[#4edea3]/10 px-2.5 py-1 rounded-full border border-[#4edea3]/30">
                Capitán • {team.name}
              </p>
            </div>

            <div className="bg-[#0b1326] p-3 rounded-xl border border-[#2d3449] flex flex-col gap-2 text-xs text-[#bbcabf]">
              <div className="flex justify-between py-1 border-b border-[#2d3449]/50">
                <span>Ubicación</span>
                <span className="text-white font-medium">Canchas Locales</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#2d3449]/50">
                <span>Partidos Organizados</span>
                <span className="text-[#4edea3] font-bold">24 partidos</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Fair Play</span>
                <span className="text-[#7bd0ff] font-bold">4.9 ★</span>
              </div>
            </div>

            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="w-full bg-[#222a3d] text-white font-bold h-10 rounded-xl text-xs hover:bg-[#2d3449]"
            >
              Cerrar Perfil
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
