import { computed, inject, Injectable } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { map, tap } from "rxjs";
import { TuiBreakpointService } from "@taiga-ui/core";

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {
  private readonly breakPoint$ = inject(TuiBreakpointService);
  
  readonly isMobile = toSignal(this.breakPoint$.pipe(map(breakpoint => breakpoint === 'mobile')), {
    initialValue: false
  });
  readonly isDesktopSmall = toSignal(this.breakPoint$.pipe(map(breakpoint => breakpoint === 'desktopSmall')), {
    initialValue: false
  });
  readonly isDesktopLarge = toSignal(this.breakPoint$.pipe(map(breakpoint => breakpoint === 'desktopLarge')), {
    initialValue: false
  });

  readonly isDesktop = computed(() => this.isDesktopSmall() || this.isDesktopLarge());
}