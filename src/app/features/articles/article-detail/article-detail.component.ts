import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { generateHTML } from '@tiptap/core'
import { DatePipe, Location } from '@angular/common';
import { TuiButton, TuiIcon } from "@taiga-ui/core";
import { TuiChip } from "@taiga-ui/kit";
import type { Article } from '@core/models/article.model';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Figcaption, Figure } from '@features/editor/extensions/figure.extension';

@Component({
  selector: 'app-article',
  templateUrl: './article-detail.component.html',
  imports: [
    RouterLink,
    TuiButton,
    TuiIcon,
    DatePipe,
    TuiChip
],
})
export class ArticleComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private sanitizer = inject(DomSanitizer);

  protected readonly article = this.route.snapshot.data['article'] as Article;
  protected readonly articleContent = this.article ? this.sanitizer.bypassSecurityTrustHtml(generateHTML(this.article.content, [
    StarterKit,
    Image,
    Figure,
    Figcaption,
  ])) : null;

  protected back() {
    this.location.back();
  }
}
