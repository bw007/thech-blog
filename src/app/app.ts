import { TuiRoot } from "@taiga-ui/core";
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from "@core/services/theme.service";
import { ProgressBarComponent } from "@shared/ui/progress-bar.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot, ProgressBarComponent],
  template: `
    <tui-root [attr.tuiTheme]="darkMode() ? 'dark' : 'light'">
      <router-outlet />
      <app-progress-bar />
    </tui-root>
  `,
  styles: [],
})
export class App {
  private theme = inject(ThemeService);
  darkMode = this.theme.darkMode;
}
