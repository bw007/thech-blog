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
  selectedUser = this._selectedUser.asReadonly();

  getSelectedUser(userName: string): Observable<Profile> {
    return this.http.get<Profile[]>(`profiles?username=eq.${userName}`).pipe(
      map(user => user[0]),
      tap(user => {
        this._selectedUser.set(user);
      })
    )
  }
}