export type AuthProvider = 'google' | 'github' | 'linkedin' | 'email' | 'telegram' | null;

export interface UserCredentals {
  email: string;
  password: string
}