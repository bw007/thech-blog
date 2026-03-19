import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiAvatar, TuiAvatarOutline } from '@taiga-ui/kit';
import { TuiButton, TuiIcon } from '@taiga-ui/core';

type SettingsTab = 'profile' | 'security' | 'social';

@Component({
  selector: 'app-profile-settings',
  imports: [RouterLink, TuiAvatar, TuiAvatarOutline, TuiButton, TuiIcon],
  templateUrl: './profile-settings.component.html'
})
export class ProfileSettingsComponent {
  activeTab = signal<SettingsTab>('profile');

  setTab(tab: SettingsTab) {
    this.activeTab.set(tab);
  }
}
