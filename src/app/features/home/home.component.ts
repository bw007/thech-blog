import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ArticleService } from '@core/services/article.service';
import { TuiIcon } from "@taiga-ui/core";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [
    RouterLink,
    DatePipe,
    TuiIcon
  ],
})
export class HomeComponent {
  private article = inject(ArticleService);

  articles = this.article.getLatestArticles();
}
