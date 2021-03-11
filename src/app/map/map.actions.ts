import { createAction, props } from '@ngrx/store';
import { Coordinates, Direction, Tiles } from './map.model';

export const loadMap = createAction('[Map] Load Map');

export const loadMapSuccess = createAction(
  '[Map] Load Map Success',
  props<{ tiles: Tiles }>()
);

export const move = createAction(
  '[Map] Move Character',
  props<{ direction: Direction }>()
);

export const moveSuccess = createAction(
  '[Map] Move Character Success',
  props<Coordinates>()
);
