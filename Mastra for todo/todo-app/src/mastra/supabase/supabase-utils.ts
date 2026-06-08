/**
 * Decodes the Supabase JWT token to extract the user ID (sub claim).
 */
export function getUserIdFromToken(token: string): string {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub;
  } catch {
    throw new Error('Invalid token: unable to decode user ID.');
  }
}