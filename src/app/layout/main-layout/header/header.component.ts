import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TuiButton, TuiIcon, TuiPopup } from '@taiga-ui/core';
import { TuiDataList, TuiDropdown } from '@taiga-ui/core';
import { TuiDataListDropdownManager, TuiAvatar, TuiAvatarOutline, TuiDrawer } from '@taiga-ui/kit';
import { AuthService } from '@core/services/auth.service';
import { ThemeService } from '@core/services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [
    RouterLink,
    TuiButton,
    TuiIcon,
    TuiButton,
    TuiDataList,
    TuiDataListDropdownManager,
    TuiDropdown,
    TuiAvatar,
    TuiAvatarOutline,
    TuiDrawer,
    TuiPopup,
    RouterLinkActive
]
})
export class HeaderComponent {
  private theme = inject(ThemeService);
  private auth = inject(AuthService);
  protected dropdownOpen = signal(false);
  protected readonly user = this.auth.currentUser;
  protected readonly isLoggedIn = this.auth.isLoggedIn;
  protected readonly isLoading = this.auth.isLoading;
  protected readonly darkMode = this.theme.darkMode;

  protected readonly open = signal(false);

  themeToggle() {
    this.theme.themeToggle()
  }

  signOut() {
    this.auth.signOut();
  }
}