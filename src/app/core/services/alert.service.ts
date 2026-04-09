import { inject, Injectable } from "@angular/core";
import { TuiAlertService } from "@taiga-ui/core";

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private readonly alerts = inject(TuiAlertService);

  showNotification(content: string, appearance: string): void {
    this.alerts
      .open(content, {
        appearance,
        autoClose: 3000,
        closeable: true
      })
      .subscribe();
  };
}