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
import { Supabase } from '@core/config/supabase';

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
  private supabase = inject(Supabase);
  private sanitizer = inject(DomSanitizer);

  protected readonly article = this.route.snapshot.data['article'] as Article;
  protected readonly articleContent = this.article ? this.sanitizer.bypassSecurityTrustHtml(generateHTML(this.article.content, [
    StarterKit,
    Image,
    Figure,
    Figcaption,
  ])) : null;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.incrementViews(id);
  }

  protected back() {
    this.location.back();
  };

  private incrementViews(id: string): void {
    const key = `viewed_${id}`;

    if (sessionStorage.getItem(key)) return;

    this.supabase.client
      .rpc('increment_views', { article_id: id })
      .then(({ error }) => {
        if (error) {
          console.error('Views increment error:', error);
          return;
        }
        sessionStorage.setItem(key, '1');
      });
  };
}
