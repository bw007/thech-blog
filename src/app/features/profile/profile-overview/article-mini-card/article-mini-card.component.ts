import { Component, computed, inject, input, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { DatePipe } from "@angular/common";
import { TuiIcon, TuiDataList, TuiDropdown, TuiButton } from "@taiga-ui/core";
import { TuiChip } from "@taiga-ui/kit";
import type { Article } from "@core/models/article.model";
import { AuthService } from "@core/services/auth.service";

@Component({
  selector: 'app-article-mini-card',
  templateUrl: './article-mini-card.component.html',
  imports: [
    RouterLink,
    DatePipe,
    TuiIcon,
    TuiDataList,
    TuiDropdown,
    TuiChip,
    TuiButton
  ],
})
export class ArticleMiniCardComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  article = input.required<Article>();

  readonly isMyArticle = computed(() => {
    return this.auth.currentUser()?.id === this.article().author_id;
  });
  readonly dropdownOpen = signal(false);

  protected editArticle() {
    this.router.navigate(['/editor', this.article().id, 'edit']);
    this.dropdownOpen.set(false);
  }
}