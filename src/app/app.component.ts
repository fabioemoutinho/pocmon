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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  readonly walking$ = timer(0, 200);
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
  private walkingSubscription?: Subscription;
  private direction: Direction[] = [];

  constructor(private router: Router, private store: Store) {}

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    this.keyEventsSubject.next(event);
  }

  @HostListener('document:keyup', ['$event'])
  onKeyup(event: KeyboardEvent) {
    this.keyEventsSubject.next(event);
  }

  ngOnInit(): void {
    this.router.navigate(['map']);
  }

  pokedex(): void {
    this.router.navigate(['pokedex']);
  }

  up(): void {}
  down(): void {}
  left(): void {}
  right(): void {}

  startMoving(event: KeyboardEvent) {
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
      this.move(this.getDirectionFromKey(event.key));
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
        this.direction = this.direction.filter(
          (direction) => direction !== this.getDirectionFromKey(event.key)
        );
        break;
    }
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
          if (this.direction.length === 0) {
            this.store.dispatch(stopMoving());
          }
          this.walkingSubscription = undefined;
        }
      );
  }
}
