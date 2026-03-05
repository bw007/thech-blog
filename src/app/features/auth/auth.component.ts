import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TuiButton } from "@taiga-ui/core";
import { TuiButtonLoading } from '@taiga-ui/kit';
import { IconComponent } from "@shared/ui/icon.component";
import { AuthService } from '@core/services/auth.service';
import { storage } from '@core/constants/storage.constants';

export type AuthProvider = 'google' | 'github' | 'linkedin' | 'email' | null;

@Component({
  selector: 'app-auth',
  imports: [TuiButton, IconComponent, TuiButtonLoading],
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  protected loadingProvider = signal<AuthProvider>(null);

  loginWithGoogle() {
    this.loadingProvider.set('google');
    localStorage.setItem(storage.AUTH_PROVIDER, 'google');
    this.auth.signInWithGoogle();
  }

  async ngOnInit() {
    const provider = localStorage.getItem(storage.AUTH_PROVIDER) as AuthProvider;
    if (provider) {
      this.loadingProvider.set(provider);
    }
    const session = await this.auth.getSession();

    if (session) {
      this.router.navigate(['/']);
    } else {
      this.loadingProvider.set(null);
    }
    localStorage.removeItem(storage.AUTH_PROVIDER);
  }
}
