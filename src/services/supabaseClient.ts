import { createClient } from '@supabase/supabase-js';

function isValidHttpUrl(urlStr: string): boolean {
  if (!urlStr || typeof urlStr !== 'string') return false;
  try {
    const parsed = new URL(urlStr);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

// Read from client-side or fallback environment variables
const supabaseUrl =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
  '';

const supabaseAnonKey =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) ||
  '';

export const isSupabaseConfigured = Boolean(
  isValidHttpUrl(supabaseUrl) &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project')
);

// Safe Supabase client instance (prevents crashes when URL is not set or invalid)
export const supabase = isSupabaseConfigured
  ? (() => {
      try {
        return createClient(supabaseUrl, supabaseAnonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
          },
        });
      } catch (err) {
        console.warn('Supabase initialization skipped:', err);
        return null;
      }
    })()
  : null;
