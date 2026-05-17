import { Component, inject, input } from "@angular/core";
import { TuiProgress } from "@taiga-ui/kit";
import { AsyncPipe } from "@angular/common";
import { TuiSizeS, TuiSizeXS, TuiSizeXXS } from "@taiga-ui/core";
import { ProgressService } from "@core/services/progress.service";

@Component({
  selector: 'app-progress-bar',
  template: `<progress
    max="100"
    [size]="size()"
    color="var(--color-green-300)"
    class="bg-transparent! transition-opacity duration-300 fixed w-full top-0 z-50"
    [class.opacity-0]="(value | async) === 0"
    tuiProgressBar
    [value]="value | async"
  ></progress>`,
  imports: [ AsyncPipe, TuiProgress]
})
export class ProgressBarComponent {
  private progressService = inject(ProgressService);

  protected value = this.progressService.progressPercentage$;
  size = input<TuiSizeS | TuiSizeXXS | TuiSizeXS>('xxs')
}