import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as PokemonActions from './pokemon.actions';

export interface Pokemon {
  id: number;
  name: string;
}

export interface State extends EntityState<Pokemon> {
  selectedPokemonId: number | null;
}

export const adapter: EntityAdapter<Pokemon> = createEntityAdapter<Pokemon>();
export const initialState: State = adapter.getInitialState({
  selectedPokemonId: null,
});

export const pokemonReducer = createReducer(
  initialState,
  on(PokemonActions.selectPokemon, (state, { pokemonId }) => ({
    ...state,
    selectedPokemonId: pokemonId,
  })),
  on(PokemonActions.loadPokemonSuccess, (state, { pokemon }) =>
    adapter.addMany(pokemon, { ...state, selectedPokemonId: null })
  )
);

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(state: State | undefined, action: Action) {
  return pokemonReducer(state, action);
}
