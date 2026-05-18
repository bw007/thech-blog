import { Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-logo',
  template: `
    <a [routerLink]="href()" class="flex items-center gap-2 text-app-text-primary no-underline">
      <span class="w-2.5 h-2.5 bg-green-400 rounded-full"></span>
      <span class="text-lg tracking-tight">thech<strong class="text-green-400">blog</strong></span>
    </a>
  `,
  imports: [RouterLink]
})
export class LogoComponent {
  href = input<string>('/');
}