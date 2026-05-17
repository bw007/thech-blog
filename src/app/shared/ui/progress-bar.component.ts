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
    class="bg-transparent!"
    tuiProgressBar
    [value]="value | async"
  ></progress>`,
  imports: [ AsyncPipe, TuiProgress]
})
export class ProgressBarComponent {
  private progressService = inject(ProgressService);

  protected value = this.progressService.progressPercentage$;
  // value = input<Observable<string | number>>();
  size = input<TuiSizeS | TuiSizeXXS | TuiSizeXS>('xxs')
}