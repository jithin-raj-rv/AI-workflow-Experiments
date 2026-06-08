import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

/**
 * Throws if Supabase environment variables are not configured.
 */
export function checkClient(): void {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      'Supabase not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.'
    );
  }
}

/**
 * Returns a Supabase client using the anon key (no user context).
 * RLS policies that depend on auth.uid() will NOT apply.
 */
export function getSupabaseClient(): SupabaseClient {
  checkClient();
  if (!client) {
    client = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
  }
  return client;
}

/**
 * Returns a Supabase client authenticated with the user's JWT token.
 * RLS policies using `auth.uid()` will resolve to the token's user.
 *
 * @param token - The user's Supabase JWT (from Authorization header)
 */
export function getAuthenticatedClient(token: string): SupabaseClient {
  checkClient();
  return createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}