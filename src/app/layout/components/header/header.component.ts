import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiDataList, TuiDropdown } from '@taiga-ui/core';
import { TuiDataListDropdownManager, TuiAvatar, TuiAvatarOutline } from '@taiga-ui/kit';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    TuiButton,
    TuiIcon,
    TuiButton,
    TuiDataList,
    TuiDataListDropdownManager,
    TuiDropdown,
    TuiAvatar,
    TuiAvatarOutline
  ],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  private auth = inject(AuthService);
  protected dropdownOpen = signal(false);
  protected readonly user = this.auth.currentUser;
  protected readonly isLoggedIn = this.auth.isLoggedIn;
  protected readonly isLoading = this.auth.isLoading;

  signOut() {
    this.auth.signOut();
  }
}