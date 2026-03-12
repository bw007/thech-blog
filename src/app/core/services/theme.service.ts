import { inject, Injectable } from "@angular/core";
import { WA_LOCAL_STORAGE, WA_WINDOW } from '@ng-web-apis/common';
import { TUI_DARK_MODE, TUI_DARK_MODE_KEY } from "@taiga-ui/core";

@Injectable({
  providedIn: 'root'
})

export class ThemeService {
  private readonly _darkMode = inject(TUI_DARK_MODE);

  readonly darkMode = this._darkMode.asReadonly();
  private readonly media = inject(WA_WINDOW).matchMedia('(prefers-color-scheme: dark)');

  constructor() {
    this.media.addEventListener('change', (e) => {
      this._darkMode.set(e.matches);
    });
  }

  themeToggle() {
    this._darkMode.update((value) => !value);
  }
}