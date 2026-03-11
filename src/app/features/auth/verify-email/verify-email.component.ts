import { Component, inject, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { TuiButton, TuiIcon, TuiTextfield, TuiLoader } from "@taiga-ui/core";
import { TuiButtonLoading, TuiInputPin } from "@taiga-ui/kit";
import { AuthService } from "@core/services/auth.service";
import { routes } from "@core/constants/routes.constants";
import { storage } from "@core/constants/storage.constants";

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  imports: [
    FormsModule,
    RouterLink,
    TuiButton,
    TuiButtonLoading,
    TuiTextfield,
    TuiInputPin,
    TuiIcon,
    TuiLoader
  ]
})

export class VerifyEmailComponent implements OnInit {
  private router = inject(Router);
  private auth = inject(AuthService);

  protected loadingProvider = this.auth.loadingProvider;
  
  protected email = signal(sessionStorage.getItem(storage.PENDING_EMAIL) ?? '');
  protected token = signal('');
  protected resendOtpLoading = this.auth.resendOtpLoading;
  protected resendCooldown = signal(0);

  ngOnInit(): void {
    if (!this.email) this.router.navigate([routes.auth.SIGN_UP]);
  };

  onVerify() {
    this.auth.verifyOtp(this.email(), this.token());
  };

  onResend() {
    this.auth.resendOtp(this.email());
    this.resendCooldown.set(60);
    const interval = setInterval(() => {
      this.resendCooldown.update(v => {
        if (v <= 1) clearInterval(interval);
        return v - 1;
      });
    }, 1000);
  };

  onTokenChange(value: string) {
    if (value.length === 6) {
      this.onVerify();
    }
  };
}