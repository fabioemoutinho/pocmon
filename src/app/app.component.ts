import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subscription, timer } from 'rxjs';
import { distinct, map, takeWhile } from 'rxjs/operators';
import { move, stopMoving } from './map/map.actions';
import { Direction } from './map/map.model';

type TrackedEvents = 'keydown' | 'keyup' | 'mousedown' | 'mouseup';
interface DirectionEvent {
  type: TrackedEvents;
  direction: Direction;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  readonly walking$ = timer(0, 200);
  readonly directionEventsSubject = new BehaviorSubject<DirectionEvent | null>(
    null
  );
  readonly directionEvents$ = this.directionEventsSubject.asObservable().pipe(
    distinct(),
    map((event) => {
      if (event?.type.includes('down')) {
        this.move(event.direction);
      }
      if (event?.type.includes('up')) {
        this.removeDirection(event.direction);
      }
    })
  );
  private walkingSubscription?: Subscription;
  private direction: Direction[] = [];

  constructor(private router: Router, private store: Store) {}

  @HostListener('document:keydown', ['$event'])
  @HostListener('document:keyup', ['$event'])
  onKeyEvents(event: KeyboardEvent) {
    const events = [
      'Down',
      'ArrowDown',
      's',
      'Up',
      'ArrowUp',
      'w',
      'Left',
      'ArrowLeft',
      'a',
      'Right',
      'ArrowRight',
      'd',
    ];
    if (events.includes(event.key)) {
      this.directionEventsSubject.next({
        type: event.type as TrackedEvents,
        direction: this.getDirectionFromKey(event.key),
      });
    }
  }

  ngOnInit(): void {
    this.router.navigate(['map']);
  }

  pokedex(): void {
    this.router.navigate(['pokedex']);
  }

  onMouseup(direction: Direction): void {
    this.directionEventsSubject.next({ type: 'mouseup', direction });
  }

  onMousedown(direction: Direction): void {
    this.directionEventsSubject.next({ type: 'mousedown', direction });
  }

  private removeDirection(direction: Direction): void {
    this.direction = this.direction.filter((d) => d !== direction);
    this.stopMoving();
  }

  private getDirectionFromKey(key: string): Direction {
    switch (key) {
      case 'Down': // IE/Edge specific value
      case 'ArrowDown':
      case 's':
        return 'DOWN';
      case 'Up': // IE/Edge specific value
      case 'ArrowUp':
      case 'w':
        return 'UP';
      case 'Left': // IE/Edge specific value
      case 'ArrowLeft':
      case 'a':
        return 'LEFT';
      case 'Right': // IE/Edge specific value
      case 'ArrowRight':
      case 'd':
        return 'RIGHT';
    }
    return 'DOWN';
  }

  private move(direction: Direction): void {
    if (!this.direction.includes(direction)) {
      this.direction = [direction, ...this.direction];
    }

    if (this.walkingSubscription) {
      return;
    }

    let complete = false;
    this.walkingSubscription = this.walking$
      .pipe(
        // TO-DO, takewhile in map route
        takeWhile(() => !complete, true)
      )
      .subscribe(
        () => {
          if (this.direction.length > 0) {
            this.store.dispatch(move({ direction: this.direction[0] }));
          } else {
            complete = true;
          }
        },
        (_error) => {},
        () => {
          this.walkingSubscription = undefined;
          this.stopMoving();
        }
      );
  }

  private stopMoving(): void {
    if (!this.walkingSubscription && this.direction.length === 0) {
      this.store.dispatch(stopMoving());
    }
  }
}
