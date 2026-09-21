import { createClient } from '@supabase/supabase-js';

// Reemplaza estos dos valores con la URL y la Anon Key de tu proyecto en Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://TU-PROYECTO.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'TU-ANON-KEY-AQUI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);