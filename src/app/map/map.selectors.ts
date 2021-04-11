import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from './map.reducer';

export const selectMapState = createFeatureSelector<State>('map');
export const selectCharacterPosition = createSelector(
  selectMapState,
  (state) => state.coordinates
);
export const selectCharacterDirection = createSelector(
  selectMapState,
  (state) => state.direction
);
