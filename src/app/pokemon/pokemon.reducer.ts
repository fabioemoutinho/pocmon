import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as PokemonActions from './pokemon.actions';
import { Pokemon } from './pokemon.model';

export interface State extends EntityState<Pokemon> {
  selectedPokemonId: number | null;
}

export const adapter: EntityAdapter<Pokemon> = createEntityAdapter<Pokemon>();
export const initialState: State = adapter.getInitialState({
  selectedPokemonId: null,
});

export const pokemonReducer = createReducer(
  initialState,
  on(PokemonActions.capturePokemon, (state, { pokemonId }) => {
    if (pokemonId) {
      return adapter.updateOne(
        {
          id: pokemonId,
          changes: {
            own: (state.entities[pokemonId] as Pokemon).own + 1,
          },
        },
        { ...state, selectedPokemonId: null }
      );
    }
    return state;
  }),
  on(PokemonActions.selectPokemon, (state, { pokemonId }) => {
    if (pokemonId) {
      return adapter.updateOne(
        {
          id: pokemonId,
          changes: { seen: (state.entities[pokemonId] as Pokemon).seen + 1 },
        },
        state
      );
    }
    return state;
  }),
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

export const getSelectedPokemonId = (state: State) => state.selectedPokemonId;

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
