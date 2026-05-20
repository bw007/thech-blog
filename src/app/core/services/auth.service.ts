import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Supabase } from '@core/config/supabase';
import type { AuthProvider } from '@core/models/auth.model';
import type { AuthError, User } from '@supabase/supabase-js';
import { authErrors } from '@core/constants/error.constants';
import { storage } from '@core/constants/storage.constants';
import { routes } from '@core/constants/routes.constants';
import { AlertService } from './alert.service';
import {Profile} from "@core/models/user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase = inject(Supabase);
  private router = inject(Router);
  private alert = inject(AlertService);

  private _authUser = signal<Partial<User & Profile> | null>(null);
  private _isLoading = signal(this.hasStoredSession());
  private _loadingProvider = signal<AuthProvider>(null);
  isLoading = this._isLoading.asReadonly();
  authUser = this._authUser.asReadonly();
  isLoggedIn = computed(() => !!this._authUser());
  loadingProvider = this._loadingProvider.asReadonly();
  private _initialized = signal(false);

  resendOtpLoading = signal(false);
  private _passwordPattern = signal('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$');
  passwordPattern = this._passwordPattern.asReadonly();

  constructor() {
    this.initAuth().then(() => {
      this._initialized.set(true);
    });

    this.supabase.client.auth.onAuthStateChange((event, session) => {
      this._authUser.set(session?.user ?? null);

      switch (event) {
        case 'PASSWORD_RECOVERY':
          sessionStorage.setItem(storage.PASSWORD_RECOVERY, 'true');
          this.router.navigate([routes.auth.NEW_PASSWORD]);
          break;

        case 'SIGNED_IN':
          if (!this._initialized()) {
            const isOAuth = !!localStorage.getItem(storage.AUTH_PROVIDER);
            if (!isOAuth) break;
          }
          if (sessionStorage.getItem(storage.PASSWORD_RECOVERY)) break;
          if (this.router.url.startsWith('/auth')) {
            this.router.navigate(['/']);
          };
          break;

        case 'SIGNED_OUT':
          this.router.navigate(['/']);
          break;
      }
    });
  }

  // SET PROVIDER
  setLoadingProvider(provider: AuthProvider) {
    this._loadingProvider.set(provider);
  }

  // STORAGE SESSION
  private hasStoredSession(): boolean {
    return Object.keys(localStorage).some(key => key.startsWith('sb-'));
  }

  // INIT AUTH
  private async initAuth() {
    const isRecovery = sessionStorage.getItem(storage.PASSWORD_RECOVERY);
    if (isRecovery) {
      await this.supabase.client.auth.signOut();
      sessionStorage.removeItem(storage.PASSWORD_RECOVERY);
      this._isLoading.set(false);
      this.router.navigate([routes.auth.SIGN_IN]);
      return;
    }

    await this.getSession();
    this._isLoading.set(false);
  }

  // GET USER PROFILE
  async getUserProfile(userId: string) {
    const { data, error } = await this.supabase.client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) {
      this.alert.showNotification(error.message, 'negative');
      return;
    }

    this._authUser.update(user => user ? { ...user, username: data.username } : null);
  }

  // SIGN UP WITH EMAIL
  async signUpWithEmail(fullName: string, email: string, password: string) {
    this.setLoadingProvider('email');

    const [{ error }] = await Promise.all([
      this.supabase.client.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      }),
      new Promise(resolve => setTimeout(resolve, 1500))
    ]);
    
    this.setLoadingProvider(null);

    if (error) {
      this.alert.showNotification(this.getErrorMessage(error), 'negative');
      return;
    };
    
    sessionStorage.setItem(storage.PENDING_EMAIL, email);
    this.router.navigate([routes.auth.VERIFY_EMAIL]);
  }

  // OTP VERIFICATION
  async verifyOtp(email: string, token: string) {
    this.setLoadingProvider('email');
    
    const [{ error }] = await Promise.all([
      this.supabase.client.auth.verifyOtp({ email, token, type: 'signup' }),
      new Promise(resolve => setTimeout(resolve, 1500))
    ]);

    this.setLoadingProvider(null);

    if (error) {
      this.alert.showNotification(this.getErrorMessage(error), 'negative');
      return;
    }

    sessionStorage.removeItem(storage.PENDING_EMAIL);
    this.getSession();
  }

  // RESEND OTP
  async resendOtp(email: string) {
    this.resendOtpLoading.set(true);
    const { error } = await this.supabase.client.auth.resend({
      type: 'signup',
      email
    });

    this.resendOtpLoading.set(false);
    if (error) {
      this.alert.showNotification(this.getErrorMessage(error), 'negative');
      return;
    }
    this.alert.showNotification('Kod qayta yuborildi', 'positive');
  }

  // SIGN IN WITH EMAIL
  async signInWithEmail(email: string, password: string) {
    this.setLoadingProvider('email');

    const [{ error }] = await Promise.all([
      this.supabase.client.auth.signInWithPassword({ email, password }),
      new Promise(resolve => setTimeout(resolve, 1500))
    ]);

    this.setLoadingProvider(null);
    
    if (error) {
      this.alert.showNotification(this.getErrorMessage(error), 'negative');
      if (error.code === 'email_not_confirmed') {
        sessionStorage.setItem(storage.PENDING_EMAIL, email);
        this.router.navigate([routes.auth.VERIFY_EMAIL]);
      }
      return;
    };
    localStorage.setItem(storage.AUTH_PROVIDER, 'email');
    this.router.navigate(['/']);
    this.getSession();
  }

  // FORGOT PASSWORD
  async forgotPassword(email: string) {
    this.setLoadingProvider('email');

    const [{ error }] = await Promise.all([
      this.supabase.client.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}${routes.auth.NEW_PASSWORD}`
      }),
      new Promise(resolve => setTimeout(resolve, 1500))
    ]);

    this.setLoadingProvider(null);
    if (error) {
      this.alert.showNotification(this.getErrorMessage(error), 'negative');
      return;
    }

    this.alert.showNotification('E-pochtani tekshiring', 'positive');
  }

  // UPDATE PASSWORD
  async updatePassword(password: string) {
    this.setLoadingProvider('email');

    const [{ error }] = await Promise.all([
      this.supabase.client.auth.updateUser({ password }),
      new Promise(resolve => setTimeout(resolve, 1500))
    ]);

    this.setLoadingProvider(null);

    if (error) {
      this.alert.showNotification(this.getErrorMessage(error), 'negative');
      return;
    }

    await this.supabase.client.auth.signOut();
    this.alert.showNotification('Parol yangilandi, qayta kiring', 'positive');
    this.router.navigate([routes.auth.SIGN_IN]);
  }

  // SIGN IN WITH GOOGLE
  async signInWithGoogle() {
    this.setLoadingProvider('google');
    localStorage.setItem(storage.AUTH_PROVIDER, 'google');

    const { error } = await this.supabase.client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/full`
      }
    });
    
    if (error) {  
      this.setLoadingProvider(null);
      this.alert.showNotification(this.getErrorMessage(error), 'negative');
      return;
    };
  };

  // SIGN IN WITH TELEGRAM
  async signInWithTelegram(telegramUser: any) {
    const { data, error } = await this.supabase.client.functions.invoke('telegram-auth', {
      body: telegramUser
    });
    
    this.setLoadingProvider(null);
    
    if (error) {
      this.alert.showNotification(this.getErrorMessage(error), 'negative');
      return;
    };
    
    const { error: sessionError } = await this.supabase.client.auth.setSession({
      access_token: data.access_token,
      refresh_token: data.refresh_token
    });
    
    if (sessionError) throw sessionError;
  }

  // SIGN OUT
  async signOut() {
    await this.supabase.client.auth.signOut();
    this.router.navigate(['/'], { replaceUrl: true });
  };

  // SESSION
  async getSession() {
    const { data } = await this.supabase.client.auth.getSession();

    this.setLoadingProvider(null);
    localStorage.removeItem(storage.AUTH_PROVIDER);
    if (data.session) {
      await this.getUserProfile(data.session?.user.id!);
    }
    return data.session;
  }

  // ERRORS
  private getErrorMessage(error: AuthError): string {
    return (error.code && authErrors[error.code]) ?? 'Xatolik yuz berdi';
  }
}