import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subject, timer } from 'rxjs';
import { distinct, map, takeUntil, takeWhile } from 'rxjs/operators';
import { move } from './map.actions';
import { Direction } from './map.model';
import {
  selectCharacterDirection,
  selectCharacterPosition,
} from './map.selectors';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnDestroy {
  readonly position$ = this.store.select(selectCharacterPosition);
  readonly direction$ = this.store.select(selectCharacterDirection);
  readonly walking$ = timer(0, 200);
  readonly movingSubject = new BehaviorSubject<boolean>(false);
  readonly moving$ = this.movingSubject.asObservable();
  readonly destroyedSubject = new Subject<boolean>();
  readonly keyEventsSubject = new BehaviorSubject<KeyboardEvent | null>(null);
  readonly keyEvents$ = this.keyEventsSubject.asObservable().pipe(
    distinct(),
    map((event) => {
      if (event?.type === 'keydown') {
        this.startMoving(event);
      }
      if (event?.type === 'keyup') {
        this.stopMoving(event);
      }
    })
  );
  private currentKey?: string;

  constructor(private store: Store) {}

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (!this.movingSubject.value) {
      this.keyEventsSubject.next(event);
    }
  }

  @HostListener('document:keyup', ['$event'])
  onKeyup(event: KeyboardEvent) {
    this.keyEventsSubject.next(event);
  }

  startMoving(event: KeyboardEvent) {
    switch (event.key) {
      case 'Down': // IE/Edge specific value
      case 'ArrowDown':
      case 's':
        this.move(event.key, 'DOWN');
        break;
      case 'Up': // IE/Edge specific value
      case 'ArrowUp':
      case 'w':
        this.move(event.key, 'UP');
        break;
      case 'Left': // IE/Edge specific value
      case 'ArrowLeft':
      case 'a':
        this.move(event.key, 'LEFT');
        break;
      case 'Right': // IE/Edge specific value
      case 'ArrowRight':
      case 'd':
        this.move(event.key, 'RIGHT');
        break;
    }
  }

  stopMoving(event: KeyboardEvent) {
    switch (event.key) {
      case 'Down': // IE/Edge specific value
      case 'ArrowDown':
      case 's':
      case 'Up': // IE/Edge specific value
      case 'ArrowUp':
      case 'w':
      case 'Left': // IE/Edge specific value
      case 'ArrowLeft':
      case 'a':
      case 'Right': // IE/Edge specific value
      case 'ArrowRight':
      case 'd':
        if (event.key === this.currentKey) {
          this.currentKey = undefined;
        }
        break;
    }
  }

  getBackgroundPosition(x: number, y: number): string {
    return `
      calc(var(--SCREEN-SIZE) * 0.1 * ${-x} + var(--SCREEN-SIZE) * 0.4)
      calc(var(--SCREEN-SIZE) * 0.1 * ${-y} + var(--SCREEN-SIZE) * 0.4)
    `;
  }

  ngOnDestroy() {
    this.destroyedSubject.next(true);
  }

  private move(key: string, direction: Direction): void {
    if (!this.currentKey) {
      let complete = false;
      this.currentKey = key;
      this.movingSubject.next(true);
      this.walking$
        .pipe(
          takeUntil(this.destroyedSubject.asObservable()),
          takeWhile(() => !complete, true)
        )
        .subscribe(
          () => {
            if (this.currentKey === key) {
              this.store.dispatch(move({ direction }));
            }
            if (!this.currentKey) {
              complete = true;
            }
          },
          (_error) => {},
          () => {
            if (!this.currentKey) {
              this.movingSubject.next(false);
            }
          }
        );
    }
  }
}
