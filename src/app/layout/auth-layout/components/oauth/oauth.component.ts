import { Component, input, output } from "@angular/core";
import { TuiButton } from "@taiga-ui/core";
import { TuiButtonLoading } from "@taiga-ui/kit";
import { IconComponent } from "@shared/ui/icon.component";
import { AuthProvider } from "@core/models/auth.model";

@Component({
  selector: 'app-oauth',
  templateUrl: './oauth.component.html',
  imports: [
    TuiButton,
    TuiButtonLoading,
    IconComponent
  ]
})

export class OauthComponent {
  protected readonly signIn = output<AuthProvider>();
  readonly loadingProvider = input.required<AuthProvider>();
}