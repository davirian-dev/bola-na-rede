// ==============================================================================
// BOLA NA REDE: CARREIRA - RESILIENT SUPABASE CLIENT (src/lib/supabase/client.ts)
// ==============================================================================

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return false;
  if (url.includes('your-project') || anonKey.includes('your-anon-key')) return false;

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function getSupabase(): SupabaseClient | null {
  if (typeof window === 'undefined') return null;

  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  return client;
}
