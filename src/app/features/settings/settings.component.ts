import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiAvatar, TuiAvatarOutline } from '@taiga-ui/kit';
import { TuiButton, TuiIcon } from '@taiga-ui/core';

type SettingsTab = 'profile' | 'security' | 'social';

@Component({
  selector: 'app-settings',
  imports: [RouterLink, TuiAvatar, TuiAvatarOutline, TuiButton, TuiIcon],
  templateUrl: './settings.component.html'
})
export class SettingsComponent {
  activeTab = signal<SettingsTab>('profile');

  setTab(tab: SettingsTab) {
    this.activeTab.set(tab);
  }
}
