import { inject, Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { map, Observable, tap } from "rxjs";
import { AuthService } from "@core/services/auth.service";
import type { Profile } from "@core/models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  private _selectedUser = signal<Profile | null>(null);
  private _authors = signal<Profile[] | null>(null);
  selectedUser = this._selectedUser.asReadonly();
  authors = this._authors.asReadonly();

  getSelectedUser(userName: string): Observable<Profile> {
    return this.http.get<Profile[]>(`profiles?username=eq.${userName}`).pipe(
      map(user => user[0]),
      tap(user => {
        this._selectedUser.set(user);
      })
    )
  };

  getAuthors(): Observable<Profile[]> {
    return this.http.get<Profile[]>(
      `profiles?posts_count=gt.0&select=id,username,full_name,avatar_url,bio,posts_count,github,twitter,telegram&order=posts_count.desc`
    ).pipe(
      tap(authors => {
        this._authors.set(authors);
      })
    )
  };
}