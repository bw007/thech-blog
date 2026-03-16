import { DOCUMENT, effect, inject, Injectable } from "@angular/core";
import { WA_WINDOW } from '@ng-web-apis/common';
import { TUI_DARK_MODE } from "@taiga-ui/core";

@Injectable({
  providedIn: 'root'
})

export class ThemeService {
  private readonly document = inject(DOCUMENT).documentElement;
  private readonly _darkMode = inject(TUI_DARK_MODE);

  readonly darkMode = this._darkMode.asReadonly();
  private readonly media = inject(WA_WINDOW).matchMedia('(prefers-color-scheme: dark)');
  private readonly selector = "dark";

  constructor() {
    effect(() => {
      if (this.darkMode()) {
        this.document.setAttribute('data-theme', 'dark');
      } else {
        this.document.removeAttribute('data-theme');
      };
    });
    this.loadTheme();
    this.media.addEventListener('change', (e) => {
      this._darkMode.set(e.matches);
    });
  };

  loadTheme() {
    this.document.classList.toggle(this.selector, this.darkMode());
  };

  themeToggle() {
    this._darkMode.update((value) => !value);
    this.loadTheme();
  };
}