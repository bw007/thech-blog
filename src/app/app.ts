import { TuiRoot } from "@taiga-ui/core";
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot],
  template: `
    <tui-root>
      <router-outlet />
    </tui-root>
  `,
  styles: [],
})
export class App {}
