import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { catchError, filter, finalize, map, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { type TuiDialogContext, TuiIcon, TuiScrollbar, tuiScrollbarOptionsProvider } from '@taiga-ui/core';
import { TuiTabs } from '@taiga-ui/kit';
import { injectContext } from '@taiga-ui/polymorpheus';
import type { Article, ArticleStatus } from '@core/models/article.model';
import { EditorService } from '@core/services/editor.service';
import { ArticleMiniCardComponent } from "../article-mini-card/article-mini-card.component";
import { SkeletonComponent } from "@shared/ui/skeleton.component";

@Component({
  standalone: true,
  selector: 'app-article-control',
  templateUrl: './article-control.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TuiTabs,
    TuiIcon,
    TuiScrollbar,
    ArticleMiniCardComponent,
    SkeletonComponent
  ],
  providers: [tuiScrollbarOptionsProvider({mode: 'hidden'})]
})
export class ArticleControlComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly editor = inject(EditorService);
  private readonly router = inject(Router);

  protected readonly context = injectContext<TuiDialogContext<void, void>>();
  
  protected myArticles = signal<Article[]>([]);
  protected activeTab = signal<ArticleStatus>('published');
  protected activeItemIndex = signal(0);
  protected isLoading = signal(false);

  readonly filteredArticles = computed(() => {
    const status = this.activeTab();
    return this.myArticles().filter(a => a.status === status);
  });

  readonly counts = computed(() => {
    const articles = this.myArticles();
    return {
      published: articles.filter(a => a.status === 'published').length,
      draft: articles.filter(a => a.status === 'draft').length,
      scheduled: articles.filter(a => a.status === 'scheduled').length,
    };
  })

  ngOnInit(): void {
    this.getArticles();

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => this.router.url),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.close());
  };

  private getArticles() {
    this.isLoading.set(true);
    this.editor.getMyArticles()
      .pipe(
        catchError(() => of([])),
        finalize(() => this.isLoading.set(false))
      ).subscribe(articles => {
        this.myArticles.set(articles);
      });
  };

  protected setTab(tab: ArticleStatus, index: number): void {
    this.activeTab.set(tab);
    this.activeItemIndex.set(index);
  };

  protected close(): void {
    this.context.completeWith();
  };
};
