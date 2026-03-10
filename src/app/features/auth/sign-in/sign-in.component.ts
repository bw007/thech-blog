import { Component, inject, signal, viewChild } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { TuiValidationError } from "@taiga-ui/cdk/classes";
import { TuiIcon, TuiError, TuiButton, TuiTextfield } from "@taiga-ui/core";
import { TuiButtonLoading, TuiPassword } from "@taiga-ui/kit";
import { AuthService } from "@core/services/auth.service";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  imports: [
    FormsModule,
    RouterLink,
    TuiButton,
    TuiTextfield,
    TuiPassword,
    TuiButtonLoading,
    TuiIcon,
    TuiError
  ]
})

export class SignInComponent {
  readonly form = viewChild.required<NgForm>('signinForm');
  private auth = inject(AuthService);

  loadingProvider = this.auth.loadingProvider;

  protected email = signal('');
  protected password = signal('');

  get emailError(): TuiValidationError | null {
    const control = this.form()?.controls['email'];
    if (!control || !control.touched || control.valid) return null;

    if (control.hasError('required')) return new TuiValidationError('E-pochta manzili majburiy');
    if (control.hasError('email')) return new TuiValidationError('Noto\'g\'ri e-pochta shakli');
    return null;
  };

  get passwordError(): TuiValidationError | null {
    const control = this.form()?.controls['password'];
    if (!control || !control.touched || control.valid) return null;

    if (control.hasError('required')) return new TuiValidationError('Parol majburiy');
    if (control.hasError('minlength')) return new TuiValidationError('Kamida 8 ta belgi kiriting');
    return null;
  };

  onSigninSubmit(form: NgForm) {
    if (form.invalid) {
      form.form.markAllAsTouched();
      form.form.markAllAsDirty();
      return;
    };
    this.auth.signInWithEmail(this.email(), this.password());
  };
}