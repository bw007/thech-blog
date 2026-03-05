import { computed, inject, Injectable, signal } from '@angular/core';
import { Supabase } from '@core/config/supabase';
import { User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase = inject(Supabase);

  currentUser = signal<User | null>(null);
  isLoading = signal(this.hasStoredSession());
  isLoggedIn = computed(() => !!this.currentUser());

  constructor() {
    this.initAuth();

    this.supabase.client.auth.onAuthStateChange((event, session) => {
      this.currentUser.set(session?.user ?? null);
    })
  }

  private hasStoredSession(): boolean {
    return Object.keys(localStorage).some(key => key.startsWith('sb-'));
  }

  private async initAuth() {
    const session = await this.getSession();
    this.currentUser.set(session?.user ?? null);
    this.isLoading.set(false);
  }

  // SIGN IN WITH GOOGLE
  async signInWithGoogle() {
    const { error } = await this.supabase.client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth`
      }
    });
    if (error) throw error;
  };

  // SIGN OUT
  async signOut() {
    await this.supabase.client.auth.signOut();
    window.location.href = '/';
  };

  // SESSION
  async getSession() {
    const { data } = await this.supabase.client.auth.getSession();
    return data.session;
  }

  // USER
  async getUser() {
    const { data } = await this.supabase.client.auth.getUser();
    return data.user;
  }
}
