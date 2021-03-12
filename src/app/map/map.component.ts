import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { move } from './map.actions';
import { selectCharacterPosition } from './map.selectors';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent {
  readonly position$ = this.store.select(selectCharacterPosition);

  constructor(private router: Router, private store: Store) {}

  @HostListener('document:keydown', ['$event'])
  move(event: KeyboardEvent) {
    switch (event.key) {
      case 'Down': // IE/Edge specific value
      case 'ArrowDown':
      case 's':
        this.store.dispatch(move({ direction: 'DOWN' }));
        break;
      case 'Up': // IE/Edge specific value
      case 'ArrowUp':
      case 'w':
        this.store.dispatch(move({ direction: 'UP' }));
        break;
      case 'Left': // IE/Edge specific value
      case 'ArrowLeft':
      case 'a':
        this.store.dispatch(move({ direction: 'LEFT' }));
        break;
      case 'Right': // IE/Edge specific value
      case 'ArrowRight':
      case 'd':
        this.store.dispatch(move({ direction: 'RIGHT' }));
        break;
    }
  }

  pokedex(): void {
    this.router.navigate(['pokedex']);
  }

  getBackgroundPosition(x: number, y: number): string {
    return `${-x * 16 + 64}px ${-y * 16 + 64}px`;
  }
}
