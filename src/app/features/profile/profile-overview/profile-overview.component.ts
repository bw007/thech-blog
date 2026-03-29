import { Component, inject, INJECTOR, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, finalize, Observable, of } from 'rxjs';
import { TuiAvatar, TuiAvatarOutline, TuiTabs } from '@taiga-ui/kit';
import { TuiButton, tuiDialog, TuiIcon } from '@taiga-ui/core';
import { SkeletonComponent } from "@shared/ui/skeleton.component";
import { ArticleMiniCardComponent } from "./article-mini-card/article-mini-card.component";
import { AuthService } from '@core/services/auth.service';
import { ArticleService } from '@core/services/article.service';

type ProfileTab = 'posts' | 'followers' | 'following';

@Component({
  selector: 'app-profile-overview',
  templateUrl: './profile-overview.component.html',
  imports: [
    RouterLink,
    TuiAvatar,
    TuiAvatarOutline,
    TuiButton,
    TuiIcon,
    TuiTabs,
    SkeletonComponent,
    ArticleMiniCardComponent
  ]
})
export class ProfileOverviewComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly article = inject(ArticleService);
  private readonly injector = inject(INJECTOR);

  private isOwnProfileId = this.route.snapshot.paramMap.get('id');
  protected isAuthUser = this.auth.currentUser;
  protected userProfile = this.auth.userProfile;
  protected isMyProfile = signal(this.isOwnProfileId !== this.isAuthUser()?.id);
  protected isLoading = signal(true);
  protected userArticles = this.article.userArticles;
  protected activeTab = signal<ProfileTab>('posts');
  protected isFollowing = signal(false);
  protected activeItemIndex = signal(0);

  // --- MOCK DATA --- //
  protected socialLinks = [
    { icon: '@tui.map-pin', text: "Toshkent, O'zbekiston", url: null, isLink: false },
    { icon: '@tui.link', text: 'github.com/test', url: 'https://github.com/test', isLink: true },
    { icon: '@tui.send', text: 't.me/test', url: 'https://t.me/test', isLink: true }
  ];

  protected followers = signal([
    { id: 1, name: 'Sardor Qodirov', username: 'sardor_q', avatar: '@tui.user', isFollowing: false },
    { id: 2, name: 'Ali Valiyev', username: 'ali_dev', avatar: '@tui.user', isFollowing: true }
  ]);

  protected following = signal([
    { id: 101, name: 'Angular Team', username: 'angular', avatar: '@tui.user', isFollowing: true },
    { id: 102, name: 'Taiga UI', username: 'taiga_ui', avatar: '@tui.user', isFollowing: true }
  ]);
  // --------------------------

  ngOnInit(): void {
    if(this.isOwnProfileId) {
      this.getArticles(this.isOwnProfileId);
      this.auth.getUserProfile(this.isOwnProfileId);
    } else {
      this.getArticles(this.isAuthUser()!.id);
      this.auth.getUserProfile(this.isAuthUser()!.id);
    }
  };

  getArticles(userId: string) {
    this.isLoading.set(true);
    this.article.getUserArticles(userId)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.isLoading.set(false))
      ).subscribe();
  };

  protected async openArticleDialog(): Promise<void> {
    const dialog = await this.lazyLoad();
    dialog().subscribe();
  };

  private async lazyLoad(): Promise<(data: void) => Observable<void>> {
    const { ArticleControlComponent } = await import('./article-control/article-control.component');

    return tuiDialog(ArticleControlComponent, {
      injector: this.injector,
      dismissible: true,
      label: 'Maqolalarni boshqarish'
    });
  };

  protected toggleFollow() {
    this.isFollowing.set(!this.isFollowing());
  };

  protected setTab(tab: ProfileTab) {
    this.activeTab.set(tab);
  };

  protected toggleFollowUser(id: number, listType: 'followers' | 'following') {
    if (listType === 'followers') {
      this.followers.update(users => users.map(u => u.id === id ? { ...u, isFollowing: !u.isFollowing } : u));
    } else {
      this.following.update(users => users.map(u => u.id === id ? { ...u, isFollowing: !u.isFollowing } : u));
    }
  };

  protected removeFollower(id: number) {
    this.followers.update(users => users.filter(u => u.id !== id));
  };
}