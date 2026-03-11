import { Component, inject, signal, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { TuiValidationError } from '@taiga-ui/cdk/classes';
import { TuiButton, TuiIcon, TuiLabel, TuiTextfield, TuiError } from '@taiga-ui/core';
import { TuiButtonLoading, TuiPassword } from '@taiga-ui/kit';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [
    FormsModule,
    TuiButton,
    TuiButtonLoading,
    TuiIcon,
    TuiLabel,
    TuiTextfield,
    TuiPassword,
    TuiError
],
  templateUrl: './new-password.component.html'
})
export class NewPasswordComponent {
  readonly form = viewChild.required<NgForm>('passwordForm');
  private auth = inject(AuthService);

  protected loadingProvider = this.auth.loadingProvider;

  protected passwordPattern = this.auth.passwordPattern;
  protected newPassword = signal('');
  protected confirmPassword = signal('');
  
  get passwordError(): TuiValidationError | null {
    const control = this.form()?.controls['password'];
    if (!control || !control.touched || control.valid) return null;

    if (control.hasError('required')) return new TuiValidationError('Parol majburiy');
    if (control.hasError('minlength')) return new TuiValidationError('Kamida 8 ta belgi kiriting');
    if (control.hasError('pattern')) return new TuiValidationError('Parol kuchsiz');
    return null;
  }

  onResetPassword() {
    if (this.newPassword() !== this.confirmPassword()) return;
    this.auth.updatePassword(this.newPassword());
  }
}