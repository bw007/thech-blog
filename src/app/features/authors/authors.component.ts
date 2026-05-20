import { Component, inject, OnInit, signal, computed } from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, RouterLink} from '@angular/router';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiAvatar, TuiAvatarOutline } from '@taiga-ui/kit';
import { HttpClient } from '@angular/common/http';
import {Profile} from "@core/models/user.model";

export interface Author {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  posts_count: number;
  github_url: string | null;
  twitter_url: string | null;
  telegram_url: string | null;
}

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  imports: [
    RouterLink,
    TuiButton,
    TuiIcon,
    TuiAvatar,
    TuiAvatarOutline
  ]
})
export class AuthorsComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  protected readonly authors = this.route.snapshot.data['authors'] as Profile[];
  protected searchQuery = signal('');

  protected readonly filteredAuthors = computed(() => {
    const q = this.searchQuery().toLowerCase();
    if (!q) return this.authors;
    return this.authors.filter(a =>
      a.full_name.toLowerCase().includes(q) ||
      a.username.toLowerCase().includes(q) ||
      a.bio?.toLowerCase().includes(q)
    );
  });

  ngOnInit(): void {

  }

  protected getSocialLinks(author: Profile) {
    const links = [];
    if (author.github) links.push({ icon: '@tui.github', href: author.github, label: 'GitHub' });
    if (author.twitter) links.push({ icon: '@tui.twitter', href: author.twitter, label: 'Twitter' });
    if (author.telegram) links.push({ icon: '@tui.send', href: author.telegram, label: 'Telegram' });
    return links;
  }
}