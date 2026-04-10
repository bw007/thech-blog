import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TuiButton, TuiIcon, TuiPopup } from '@taiga-ui/core';
import { TuiDataList, TuiDropdown } from '@taiga-ui/core';
import { TuiDataListDropdownManager, TuiAvatar, TuiAvatarOutline, TuiDrawer } from '@taiga-ui/kit';
import { AuthService } from '@core/services/auth.service';
import { ThemeService } from '@core/services/theme.service';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [
    RouterLink,
    RouterLinkActive,
    TuiButton,
    TuiIcon,
    TuiDataList,
    TuiDataListDropdownManager,
    TuiDropdown,
    TuiAvatar,
    TuiAvatarOutline,
    TuiDrawer,
    TuiPopup
  ]
})
export class HeaderComponent implements OnInit {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private theme = inject(ThemeService);
  private auth = inject(AuthService);

  protected dropdownOpen = signal(false);
  protected readonly user = this.auth.currentUser;
  protected readonly isLoggedIn = this.auth.isLoggedIn;
  protected readonly isLoading = this.auth.isLoading;
  protected readonly darkMode = this.theme.darkMode;

  protected readonly open = signal(false);

  ngOnInit(): void {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.dropdownOpen.set(false);
    });
  }

  themeToggle() {
    this.theme.themeToggle();
  };

  signOut() {
    this.auth.signOut();
  };
}