import { inject, Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, of, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private _selectedUser = signal<any>(null);
  selectedUser = this._selectedUser.asReadonly();

  getSelectedUser(userName: string): Observable<any> {
    console.log(userName);
    return this.http.get(`profiles?username=eq.${userName}`).pipe(
      tap((data) => {
        console.log(data);
        this._selectedUser.set(data);
      }),
      catchError((err) => {
        console.log(err)
        return of(null)
      })
    )
  }
}