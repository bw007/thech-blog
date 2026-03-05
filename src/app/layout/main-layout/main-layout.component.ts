import { Component } from "@angular/core";
import { HeaderComponent } from "../components/header/header.component";
import { RouterOutlet } from "@angular/router";
import { FooterComponnet } from "../components/footer/footer.component";

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  imports: [HeaderComponent, RouterOutlet, FooterComponnet]
})

export class MainLayoutComponent {}