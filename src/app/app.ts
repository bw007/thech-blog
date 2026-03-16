import { TuiRoot } from "@taiga-ui/core";
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from "@core/services/theme.service";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot],
  template: `
    <tui-root [attr.tuiTheme]="darkMode() ? 'dark' : 'light'">
      <router-outlet />
    </tui-root>
  `,
  styles: [],
})
export class App {
  private theme = inject(ThemeService);
  darkMode = this.theme.darkMode;
}
