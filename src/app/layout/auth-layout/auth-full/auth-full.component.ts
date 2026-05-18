import { Component, computed, inject, OnInit } from "@angular/core";
import { NavigationEnd, Router, RouterLink, RouterOutlet } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { filter, map } from "rxjs";
import { storage } from "@core/constants/storage.constants";
import { OauthComponent } from "../components/oauth/oauth.component";
import { AuthService } from "@core/services/auth.service";
import { AuthProvider, UserCredentals } from "@core/models/auth.model";

@Component({
  selector: 'app-auth-full',
  templateUrl: './auth-full.component.html',
  imports: [
    RouterOutlet,
    RouterLink,
    OauthComponent
  ]
})
export class AuthFullComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  protected readonly year = new Date().getFullYear();

  protected loadingProvider = this.auth.loadingProvider;

  private currentRoutePath = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => this.router.url.split('?')[0])
    ),
    { initialValue: this.router.url.split('?')[0] }
  );

  readonly isSignUp = computed(() => this.currentRoutePath().includes('sign-up'));

  ngOnInit(): void {
    const provider = localStorage.getItem(storage.AUTH_PROVIDER) as AuthProvider;
    if (provider) {
      this.auth.setLoadingProvider(provider);
    }
  }

  signInWithOauth(provider: AuthProvider) {
    if (provider === 'google') {
      this.auth.signInWithGoogle();
    }
  }
}