import { Component, inject, signal, viewChild } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { TuiIcon, TuiError, TuiButton, TuiTextfield } from "@taiga-ui/core";
import { TuiButtonLoading, TuiPassword } from "@taiga-ui/kit";
import { TuiValidationError } from "@taiga-ui/cdk/classes";
import { AuthService } from "@core/services/auth.service";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  imports: [
    TuiButton,
    TuiIcon,
    TuiError,
    TuiTextfield,
    FormsModule,
    TuiButtonLoading,
    TuiPassword
  ]
})

export class SignUpComponent {
  readonly form = viewChild.required<NgForm>('signupForm')
  private auth = inject(AuthService);

  protected passwordPattern = this.auth.passwordPattern;
  protected loadingProvider = this.auth.loadingProvider;

  protected fullName = signal('');
  protected email = signal('');
  protected password = signal('');
  protected confirmPassword = signal('');

  get fullNameError(): TuiValidationError | null {
    const control = this.form()?.controls['fullName'];
    if (!control || !control.touched || control.valid) return null;

    if (control.hasError('required')) return new TuiValidationError('E-pochta manzili majburiy');
    if (control.hasError('minlength')) return new TuiValidationError('Kamida 2 ta belgi kiriting');
    return null;
  }

  get emailError(): TuiValidationError | null {
    const control = this.form()?.controls['email'];
    if (!control || !control.touched || control.valid) return null;

    if (control.hasError('required')) return new TuiValidationError('E-pochta manzili majburiy');
    if (control.hasError('email')) return new TuiValidationError('Noto\'g\'ri e-pochta shakli');
    return null;
  }

  get passwordError(): TuiValidationError | null {
    const control = this.form()?.controls['password'];
    if (!control || !control.touched || control.valid) return null;

    if (control.hasError('required')) return new TuiValidationError('Parol majburiy');
    if (control.hasError('minlength')) return new TuiValidationError('Kamida 8 ta belgi kiriting');
    if (control.hasError('pattern')) return new TuiValidationError('Parol kuchsiz');
    return null;
  }

  onSignupSubmit(form: NgForm) {
    if (form.invalid) {
      form.form.markAllAsTouched();
      form.form.markAllAsDirty();
      return;
    }
    this.auth.signUpWithEmail(this.fullName(), this.email(), this.password());
  }
}