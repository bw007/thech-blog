import { Component, input, signal } from "@angular/core";
import { TuiSkeleton } from "@taiga-ui/kit";

@Component({
    selector: 'app-skeleton',
    template: `<p [tuiSkeleton]="skeleton() ? size() : ''"></p>`,
    imports: [TuiSkeleton]
})
export class SkeletonComponent {
  skeleton = input<boolean>(false);
  size = input<string>('This text serves as the content behind the skeleton and depending on its length, the skeleton will adjust to fit it. This text serves as the content behind the skeleton and depending on its length, the skeleton will adjust to fit it.This text serves as the content behind the skeleton and depending on its length, the skeleton will adjust to fit it.This text serves as the content behind the skeleton and depending on its length, the skeleton will adjust to fit it.')
}