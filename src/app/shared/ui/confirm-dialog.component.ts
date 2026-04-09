import { Component, inject } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';
import { TuiDialogContext } from '@taiga-ui/core';

export interface ConfirmDialogData {
  title: string;
  description: string;
  confirmText: string;
  cancelText?: string;
  confirmAppearance?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [TuiButton],
  template: `
    <p class="text-app-text-secondary text-sm mb-4">
      {{ context.data.description }}
    </p>
    <div class="flex gap-2 justify-end">
      <button
        tuiButton
        appearance="flat"
        size="s"
        (click)="context.completeWith(false)"
      >
        {{ context.data.cancelText ?? 'Bekor qilish' }}
      </button>
      <button
        tuiButton
        [appearance]="context.data.confirmAppearance ?? 'primary'"
        size="s"
        (click)="context.completeWith(true)"
      >
        {{ context.data.confirmText }}
      </button>
    </div>
  `,
})
export class ConfirmDialogComponent {
  readonly context = inject<TuiDialogContext<boolean, ConfirmDialogData>>(POLYMORPHEUS_CONTEXT);
}