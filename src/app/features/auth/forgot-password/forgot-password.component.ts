import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "@core/services/auth.service";
import { TuiButton, TuiIcon, TuiTextfield } from "@taiga-ui/core";
import { TuiButtonLoading } from "@taiga-ui/kit";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  imports: [
    FormsModule,
    RouterLink,
    TuiButton,
    TuiButtonLoading,
    TuiTextfield,
    TuiIcon
  ]
})

export class ForgotPasswordComponent {
  private router = inject(Router);
  private auth = inject(AuthService);

  protected loadingProvider = this.auth.loadingProvider;

  protected email = signal('');

  onSendLink() {
    if (!this.email()) return;
    this.auth.forgotPassword(this.email());
  }
}