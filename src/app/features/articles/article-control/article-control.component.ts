import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Router } from '@angular/router';
import { catchError, EMPTY, finalize, Observable, of, switchMap, tap } from 'rxjs';
import { TuiDialogService, TuiIcon, TuiScrollbar, tuiScrollbarOptionsProvider } from '@taiga-ui/core';
import { SkeletonComponent } from '@shared/ui/skeleton.component';
import { ArticleCardComponent } from '@shared/components/article-card/article-card.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '@shared/ui/confirm-dialog.component';
import { TuiTabs } from '@taiga-ui/kit';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import type { Article, ArticleStatus } from '@core/models/article.model';
import { EditorService } from '@core/services/editor.service';
import { ResponsiveService } from '@core/services/responsive.service';
import { ArticleService } from '@core/services/article.service';
import { AlertService } from '@core/services/alert.service';

@Component({
  selector: 'app-article-control',
  templateUrl: './article-control.component.html',
  imports: [
    NgTemplateOutlet,
    TuiTabs,
    TuiIcon,
    ArticleCardComponent,
    SkeletonComponent,
    TuiScrollbar
  ],
  providers: [tuiScrollbarOptionsProvider({ mode: 'hidden' })]  
})
export class ArticleControlComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly editor = inject(EditorService);
  private readonly article = inject(ArticleService);
  private readonly responsive = inject(ResponsiveService);
  private readonly dialogs = inject(TuiDialogService);
  private readonly alert = inject(AlertService);

  protected isDesktop = this.responsive.isDesktop;
  protected myArticles = signal<Article[]>([]);
  protected activeTab = signal<ArticleStatus>('published');
  protected activeItemIndex = signal(0);
  protected isLoading = signal(false);
  protected actionLoadingId = this.article.actionLoadingId;

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
  });

  ngOnInit(): void {
    this.getArticles();
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

  protected editArticle(id: string) {
    this.router.navigate(['/editor', id, 'edit']);
  };

  private handleAction(action$: Observable<Article>, confirm = false) {
    const action = confirm ? this.dialogs.open<boolean>(new PolymorpheusComponent(ConfirmDialogComponent), {
      label: 'Maqolani o\'chirish',
      size: 's',
      data: {
        title: 'Maqolani o\'chirish',
        description: 'Haqiqatan ham ushbu maqolani o\'chirmoqchimisiz?',
        confirmText: 'O\'chirish',
        confirmAppearance: 'accent'
      } satisfies ConfirmDialogData
    }).pipe(
        finalize(() => this.article.setActionLoadingId(null)),
        switchMap((res) => res ? action$ : EMPTY)
      ) : action$;    
    
    return action.pipe(
      catchError(() => EMPTY)
    )
  }

  protected publishArticle(id: string) {
    this.handleAction(this.article.publishArticle(id))
      .pipe(
        tap((article) => this.myArticles.update(articles => {
          this.alert.showNotification('Maqola nashr qilindi', 'success');
          return articles.map(a => a.id === article.id ? article : a)
        }))
      )
      .subscribe();
  }

  protected unpublishArticle(id: string) {
    this.handleAction(this.article.unpublishArticle(id))
      .pipe(
        tap((article) => this.myArticles.update(articles => {
          this.alert.showNotification('Maqola nashrdan qaytarildi', 'success');
          return articles.map(a => a.id === article.id ? article : a)
        }))
      )
      .subscribe();
  }

  protected deleteArticle(id: string) {
    this.handleAction(this.article.deleteArticle(id), true)
      .pipe(
        tap((article) => this.myArticles.update(articles => {
          this.alert.showNotification('Maqola o\'chirildi', 'success');
          return articles.filter(a => a.id !== article.id)
        }))
      )
      .subscribe();
  }

  protected setTab(tab: ArticleStatus, index: number): void {
    this.activeTab.set(tab);
    this.activeItemIndex.set(index);
  };
}
