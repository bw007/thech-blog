import { Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./header/header.component";
import { FooterComponnet } from "./footer/footer.component";
import { ProgressBarComponent } from "@shared/ui/progress-bar.component";
import { ArticleService } from "@core/services/article.service";
import { ProgressService } from "@core/services/progress.service";

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponnet,
    ProgressBarComponent
  ]
})

export class MainLayoutComponent {
  private progressService = inject(ProgressService);
  private article = inject(ArticleService);
}