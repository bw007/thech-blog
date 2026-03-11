import { Component, input } from "@angular/core";

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <svg
      [attr.width]="size()" 
      [attr.height]="size()" 
      fill="currentColor"
    >
      <use [attr.href]="'/icons/sprite.svg#' + name()"></use>
    </svg>
  `,
  styles: [`
    :host { display: inline-flex; }
  `]
})
export class IconComponent {
  name = input.required<string>();
  size = input<number>(24);
}