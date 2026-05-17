import { Injectable} from "@angular/core";
import { BehaviorSubject, interval, timer, map, of, scan, Subject, takeUntil, switchMap, distinctUntilChanged } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ProgressService {
  private _progressPercentage = new BehaviorSubject<number>(0);
  progressPercentage$ = this._progressPercentage.asObservable();

  private _stop$ = new Subject<void>();

  start() {
    this._stop$.next();

    of(0).pipe(
      switchMap(() => interval(200)),
      scan((current) => {
        if (current < 70) return current + Math.random() * 15;
        if (current < 85) return current + Math.random() * 3;
        return current;
      }, 0),
      map(v => Math.min(v, 85)),
      distinctUntilChanged(),
      takeUntil(this._stop$),
    ).subscribe(v => this._progressPercentage.next(v));
  }

  finish() {
    this._stop$.next();
    this._progressPercentage.next(100);

    timer(500).subscribe(() => this._progressPercentage.next(0));
  }
}