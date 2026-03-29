import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TuiButton, TuiIcon } from "@taiga-ui/core";
import type { Article } from '@core/models/article.model';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  imports: [
    RouterLink,
    TuiButton,
    TuiIcon,
    DatePipe
  ],
})
export class ArticleComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly article = this.route.snapshot.data['article'] as Article;
}
