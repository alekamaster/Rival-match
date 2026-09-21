import { supabase } from "../supabase";

// Obtener notificaciones
export async function fetchNotifications() {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
  return data || [];
}

// Marcar notificaciones como leídas
export async function markAllNotificationsAsRead() {
  const { data, error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("read", false);

  if (error) {
    console.error("Error marking notifications as read:", error);
  }
  return data;
}

// Aceptar reto
export async function acceptChallenge(challengeId: string) {
  const { data, error } = await supabase
    .from("matches")
    .update({ status: "accepted" })
    .eq("id", challengeId);

  if (error) {
    console.error("Error accepting challenge:", error);
    throw error;
  }
  return data;
}

// Rechazar reto
export async function rejectChallenge(challengeId: string) {
  const { data, error } = await supabase
    .from("matches")
    .update({ status: "rejected" })
    .eq("id", challengeId);

  if (error) {
    console.error("Error rejecting challenge:", error);
    throw error;
  }
  return data;
}