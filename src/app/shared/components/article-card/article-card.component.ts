import { Component, computed, inject, input, output, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { DatePipe } from "@angular/common";
import { TuiIcon, TuiDataList, TuiDropdown, TuiButton } from "@taiga-ui/core";
import { TuiChip, TuiAvatar } from "@taiga-ui/kit";
import type { Article } from "@core/models/article.model";
import { AuthService } from "@core/services/auth.service";
import { generateHTML } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Figcaption, Figure } from "@features/editor/extensions/figure.extension";

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

  protected getArticleContent(content: Article['content']) {
    return this.sanitizer.bypassSecurityTrustHtml(generateHTML(content, [
      StarterKit,
      Image,
      Figure,
      Figcaption,
    ]))
  }
}