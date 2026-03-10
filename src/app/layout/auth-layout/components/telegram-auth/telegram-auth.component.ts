import { Component, inject, input, OnInit, output } from "@angular/core";
import { Router } from "@angular/router";
import { TuiButton } from "@taiga-ui/core";
import { TuiButtonLoading } from "@taiga-ui/kit";
import { IconComponent } from "@shared/ui/icon.component";
import { AuthService } from "@core/services/auth.service";
import { environment } from "@env/environment";

@Component({
  selector: 'app-telegram-auth',
  templateUrl: './telegram-auth.component.html',
  imports: [
    TuiButton,
    TuiButtonLoading,
    IconComponent
  ]
})

export class TelegramAuthComponent implements OnInit {
  loadingProvider = input();
  signInTelegram = output();
  auth = inject(AuthService);
  router = inject(Router);

  async ngOnInit() {
    const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?23';
      script.setAttribute('data-telegram-login', environment.telegram.verification_bot);
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-radius', '10');
      script.setAttribute('data-onauth', 'onTelegramAuth(user)');
      script.setAttribute('data-request-access', 'write');
      script.async = true;
      document.getElementById('telegram-widget')?.appendChild(script);
    
      (window as any)['onTelegramAuth'] = async (user: any) => {
        console.log('Telegram user:', user);
        
        try {
          await this.auth.signInWithTelegram(user);
          this.router.navigate(['/']);
        } catch (e) {
          // this.loadingProvider.set(null);
        }
      };
  }
}