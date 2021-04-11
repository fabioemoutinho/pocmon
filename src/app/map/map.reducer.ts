import { Action, createReducer, on } from '@ngrx/store';
import * as MapActions from './map.actions';
import { Coordinates, Direction, Tiles } from './map.model';

export interface State {
  coordinates: Coordinates;
  previousCoordinates?: Coordinates;
  direction: Direction;
  stepsToBattle: number;
  currentTile?: number;
  previousTile?: number;
  tiles: Tiles;
}

export const initialState: State = {
  coordinates: {
    x: 16,
    y: 33,
  },
  direction: 'DOWN',
  stepsToBattle: 0,
  tiles: [],
};

export const mapReducer = createReducer(
  initialState,
  on(MapActions.loadMapSuccess, (state, { tiles }) => ({ ...state, tiles })),
  on(MapActions.move, (state, { direction }) => ({
    ...state,
    direction,
  })),
  on(MapActions.moveSuccess, (state, { x, y }) => ({
    ...state,
    coordinates: { x, y },
    previousCoordinates: { x: state.coordinates.x, y: state.coordinates.y },
    currentTile: state.tiles[y][x],
    previousTile: state.currentTile,
  })),
  on(MapActions.decrementStepsToBattleSuccess, (state) => ({
    ...state,
    stepsToBattle: state.stepsToBattle - 1,
  })),
  on(MapActions.resetStepsToBattleSuccess, (state, { steps }) => ({
    ...state,
    stepsToBattle: steps,
  }))
);

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(state: State | undefined, action: Action) {
  return mapReducer(state, action);
}
