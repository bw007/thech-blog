import { Component, inject, input, PLATFORM_ID } from "@angular/core";
import { TuiProgress, TuiProgressBar } from "@taiga-ui/kit";
import {  } from '@ng-web-apis/platform';
import { AsyncPipe, isPlatformServer } from "@angular/common";
import { map, Observable, of, startWith, timer } from "rxjs";
import { TuiSizeS, TuiSizeXS, TuiSizeXXS } from "@taiga-ui/core";

@Component({
  selector: 'app-progress-bar',
  template: `<progress
    max="100"
    [size]="size()"
    color="var(--color-green-300)"
    class="bg-transparent!"
    tuiProgressBar
    [value]="value() | async"
  ></progress>`,
  imports: [ AsyncPipe, TuiProgress]
})
export class ProgressBarComponent {
  value = input<Observable<string | number>>();
  size = input<TuiSizeS | TuiSizeXXS | TuiSizeXS>('xxs')
}