import { Action, createReducer, on } from '@ngrx/store';
import * as MapActions from './map.actions';
import { Coordinates, Tiles } from './map.model';

export interface State {
  coordinates: Coordinates;
  tiles: Tiles;
}

export const initialState: State = {
  coordinates: {
    x: 16,
    y: 33,
  },
  tiles: [],
};

export const mapReducer = createReducer(
  initialState,
  on(MapActions.loadMapSuccess, (state, { tiles }) => ({ ...state, tiles })),
  on(MapActions.moveSuccess, (state, { x, y }) => ({
    ...state,
    coordinates: { x, y },
  }))
);

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(state: State | undefined, action: Action) {
  return mapReducer(state, action);
}
