import { Injectable} from "@angular/core";
import { BehaviorSubject, interval, timer, scan, Subject, takeUntil, distinctUntilChanged } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ProgressService {
  private _progressPercentage = new BehaviorSubject<number>(0);
  progressPercentage$ = this._progressPercentage.asObservable();

  private _stop$ = new Subject<void>();
  private _finishTimer$ = new Subject<void>();

  start() {
    this._stop$.next();

    interval(200).pipe(
      scan((current) => {
        if (current < 70) return current + Math.random() * 15;
        if (current < 85) return current + Math.random() * 3;
        if (current < 95) return current + Math.random() * 0.5;
        return current;
      }, 0),
      distinctUntilChanged(),
      takeUntil(this._stop$),
    ).subscribe(v => this._progressPercentage.next(v));
  }

  finish() {
    this._stop$.next();
    this._progressPercentage.next(100);

    this._finishTimer$.next();

    timer(500).pipe(
      takeUntil(this._finishTimer$)
    ).subscribe(() => this._progressPercentage.next(0));
  }
}