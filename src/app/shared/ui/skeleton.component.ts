import { Component, input } from "@angular/core";
import { TuiSkeleton } from "@taiga-ui/kit";

@Component({
    selector: 'app-skeleton',
    template: `<span [tuiSkeleton]="skeleton() ? size().repeat(count()) : ''"></span>`,
    imports: [TuiSkeleton]
})
export class SkeletonComponent {
  skeleton = input<boolean>(false);
  count = input<number>(1);
  size = input<string>('----------')
}