import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LogoComponent } from "@shared/ui/logo.component";

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet, LogoComponent],
  templateUrl: './auth-layout.component.html'
})
export class AuthLayoutComponent {}
