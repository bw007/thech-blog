import { Component, inject, OnInit, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { ArticleCardComponent } from "@shared/components/article-card/article-card.component";
import { SkeletonComponent } from "@shared/ui/skeleton.component";
import { ArticleService } from '@core/services/article.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [
    ArticleCardComponent,
    SkeletonComponent
  ],
})
export class HomeComponent implements OnInit {
  private article = inject(ArticleService);

  articles = this.article.publishedArticles;
  protected isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.isLoading.set(true);
    this.article.getPublishedArticles().pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe();
  }
}
