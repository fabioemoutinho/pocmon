import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectCharacterDirection,
  selectCharacterPosition,
  selectMoving,
} from './map.selectors';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent {
  readonly moving$ = this.store.select(selectMoving);
  readonly position$ = this.store.select(selectCharacterPosition);
  readonly direction$ = this.store.select(selectCharacterDirection);

  constructor(private store: Store) {}

  getBackgroundPosition(x: number, y: number): string {
    return `
      calc(var(--SCREEN-SIZE) * 0.1 * ${-x} + var(--SCREEN-SIZE) * 0.4)
      calc(var(--SCREEN-SIZE) * 0.1 * ${-y} + var(--SCREEN-SIZE) * 0.4)
    `;
  }
}
