import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ArticleService } from '@core/services/article.service';
import { Article } from '@core/models/article.model';
import { TuiButton, TuiIcon } from "@taiga-ui/core";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  imports: [
    RouterLink,
    DatePipe,
    TuiButton,
    TuiIcon
  ],
})
export class ArticleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private articleService = inject(ArticleService);

  article = signal<Article | undefined>(undefined);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.article.set(this.articleService.getArticleById(id));
    }
  }
}
