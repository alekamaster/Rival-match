import { supabase } from './supabase';

// 1. Obtener todas las notificaciones del usuario activo
export async function getUnreadAlertsCount(userId: string) {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('read', false);

  if (error) {
    console.error('Error al contar alertas:', error.message);
    return 0;
  }
  return count || 0;
}

// 2. Marcar una notificación como leída
export async function getUnreadChatsCount(userId: string) {
  const { count, error } = await supabase
    .from('chat_messages')
    .select('*', { count: 'exact', head: true })
    .neq('sender_id', userId); // Cuenta los recibidos

  if (error) {
    console.error('Error al contar chats:', error.message);
    return 0;
  }
  return count || 0;
}

// 3. Marcar TODAS como leídas
export async function markAllNotificationsAsRead(userId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId);

  if (error) console.error('Error al marcar todas leídas:', error.message);
}

// 4. Aceptar un desafío (Cambia el estado del partido en Supabase)
export async function acceptChallenge(matchId: string, guestTeamId: string) {
  const { error } = await supabase
    .from('match_requests')
    .update({ 
      guest_team_id: guestTeamId,
      status: 'confirmed' 
    })
    .eq('id', matchId);

  if (error) console.error('Error al aceptar desafío:', error.message);
}
import { supabase } from '../supabase';

// Cargar partidos cercanos usando la función de PostGIS
export async function fetchNearbyMatches(lat: number, lng: number, distanceMeters = 20000) {
  const { data, error } = await supabase.rpc('get_nearby_matches', {
    user_lat: lat,
    user_long: lng,
    distance_meters: distanceMeters,
  });

  if (error) {
    console.error('Error al obtener partidos cercanos:', error.message);
    return [];
  }
  return data;
}

// Alternativa: Cargar todos los partidos 'open' directamente
export async function fetchOpenMatches() {
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
    .eq('status', 'open')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al cargar partidos:', error.message);
    return [];
  }
  return data;
}