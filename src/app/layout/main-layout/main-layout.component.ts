import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./header/header.component";
import { FooterComponnet } from "./footer/footer.component";

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponnet
  ]
})

export class MainLayoutComponent {}