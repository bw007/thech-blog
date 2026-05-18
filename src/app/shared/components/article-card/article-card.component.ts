import { Component, computed, inject, input, output, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { DatePipe } from "@angular/common";
import { TuiIcon, TuiDataList, TuiDropdown, TuiButton } from "@taiga-ui/core";
import { TuiChip, TuiAvatar } from "@taiga-ui/kit";
import type { Article } from "@core/models/article.model";
import { AuthService } from "@core/services/auth.service";

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  imports: [
    RouterLink,
    DatePipe,
    TuiIcon,
    TuiDataList,
    TuiDropdown,
    TuiChip,
    TuiButton,
    TuiAvatar
  ],
})
export class ArticleCardComponent {
  private readonly auth = inject(AuthService);
  private readonly sanitizer = inject(DomSanitizer);

  article = input.required<Article>();
  loadingId = input<string | null>(null);
  showActions = input<boolean>(true);
  editArticle = output<string>();
  publishArticle = output<string>();
  unpublishArticle = output<string>();
  deleteArticle = output<string>();

  readonly isMyArticle = computed(() => {
    return this.auth.currentUser()?.id === this.article().author_id;
  });
  readonly dropdownOpen = signal(false);

  protected readonly articleText = computed(() => {
    const nodes = this.article().content['content'];
    const firstNodes = Array.isArray(nodes) ? nodes.slice(0, 4) : [];

    return firstNodes
      .map((node: any) => this.extractText(node))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  });

  private readonly skipTypes = new Set([
    'image', 'figure', 'figcaption', 'horizontalRule'
  ]);

  private extractText(node: any): string {
    if (!node) return '';
    console.log(node)
    if (this.skipTypes.has(node.type)) return '';

    if (node.type === 'text') return node.text || '';

    if (node.content?.length) {
      return node.content
        .map((child: any) => this.extractText(child))
        .join(' ');
    }
    return '';
  }
}