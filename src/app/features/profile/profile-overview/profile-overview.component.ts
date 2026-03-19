import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiAvatar, TuiAvatarOutline } from '@taiga-ui/kit';
import { TuiButton, TuiIcon } from '@taiga-ui/core';

type ProfileTab = 'posts' | 'followers' | 'following';

@Component({
  selector: 'app-profile-overview',
  templateUrl: './profile-overview.component.html',
  imports: [
    RouterLink,
    TuiAvatar,
    TuiAvatarOutline,
    TuiButton,
    TuiIcon
  ]
})
export class ProfileOverviewComponent {
  // Tab Navigation State
  protected activeTab = signal<ProfileTab>('posts');

  // User Profile Status State
  protected isOwnProfile = signal(false); // Boshqa obunachi profili
  protected isFollowing = signal(false);

  protected toggleFollow() {
    this.isFollowing.set(!this.isFollowing());
  }

  protected setTab(tab: ProfileTab) {
    this.activeTab.set(tab);
  }

  // --- MOCK DATA --- //
  protected socialLinks = [
    { icon: '@tui.map-pin', text: "Toshkent, O'zbekiston", url: null, isLink: false },
    { icon: '@tui.link', text: 'github.com/lazizbek', url: 'https://github.com/lazizbek', isLink: true },
    { icon: '@tui.send', text: 't.me/lazizbek', url: 'https://t.me/lazizbek', isLink: true }
  ];

  protected recentPosts = [
    { id: 1, title: 'Angular 21 da yangi signal API — hamma narsa signal bo\'ladi', slug: 'angular-21-signals', published: true, date: '2 kun oldin' },
    { id: 2, title: 'Supabase RLS: Row Level Security to\'liq qo\'llanma', slug: 'supabase-rls-guide', published: true, date: '1 hafta oldin' },
    { id: 3, title: 'Tailwind CSS v4 — nima o\'zgardi va qanday migrate qilish kerak', slug: 'tailwind-v4-migration', published: true, date: '2 hafta oldin' },
    { id: 4, title: 'TypeScript 5.5 yangiliklari', slug: 'typescript-5-5', published: false, date: '3 hafta oldin' },
    { id: 5, title: 'Angular standalone components best practices', slug: 'angular-standalone-best-practices', published: false, date: '1 oy oldin' }
  ];

  protected followers = signal([
    { id: 1, name: 'Sardor Qodirov', username: 'sardor_q', avatar: '@tui.user', isFollowing: false },
    { id: 2, name: 'Ali Valiyev', username: 'ali_dev', avatar: '@tui.user', isFollowing: true },
    { id: 3, name: 'Nodirbek Yusupov', username: 'nodirbek', avatar: '@tui.user', isFollowing: false },
    { id: 4, name: 'Zarina Aliyeva', username: 'zarina_ui', avatar: '@tui.user', isFollowing: true },
    { id: 5, name: 'Bekzod K.', username: 'bekzodk', avatar: '@tui.user', isFollowing: false }
  ]);

  protected following = signal([
    { id: 101, name: 'Angular Team', username: 'angular', avatar: '@tui.user', isFollowing: true },
    { id: 102, name: 'Taiga UI', username: 'taiga_ui', avatar: '@tui.user', isFollowing: true },
    { id: 103, name: 'Google Developers', username: 'googledevs', avatar: '@tui.user', isFollowing: true },
    { id: 104, name: 'TechCrunch', username: 'techcrunch', avatar: '@tui.user', isFollowing: true }
  ]);

  protected toggleFollowUser(id: number, listType: 'followers' | 'following') {
    if (listType === 'followers') {
      this.followers.update(users => users.map(u => u.id === id ? { ...u, isFollowing: !u.isFollowing } : u));
    } else {
      this.following.update(users => users.map(u => u.id === id ? { ...u, isFollowing: !u.isFollowing } : u));
    }
  }

  protected removeFollower(id: number) {
    this.followers.update(users => users.filter(u => u.id !== id));
  }
}
