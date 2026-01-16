// Simple single-user authentication
// In production, you should use environment variables for the password
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

export function verifyPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}
