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

export const decrementStepsToBattle = createAction(
  '[Map] Decrement Steps to Battle'
);

export const decrementStepsToBattleSuccess = createAction(
  '[Map] Decrement Steps to Battle Success'
);

export const decrementStepsToBattleNoOp = createAction(
  '[Map] Decrement Steps to Battle NoOp'
);

export const resetStepsToBattle = createAction('[Map] Reset Steps to Battle');

export const resetStepsToBattleSuccess = createAction(
  '[Map] Reset Steps to Battle Success',
  props<{ steps: number }>()
);
