import { Dictionary } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Pokemon } from './pokemon.model';
import {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
  State,
  getSelectedPokemonId,
} from './pokemon.reducer';

export const selectPokemonState = createFeatureSelector<State>('pokemon');
export const selectPokemonIds = createSelector(selectPokemonState, selectIds);
export const selectPokemonEntities = createSelector(
  selectPokemonState,
  selectEntities
);
export const selectAllPokemon = createSelector(selectPokemonState, selectAll);
export const selectPokemonTotal = createSelector(
  selectPokemonState,
  selectTotal
);
export const selectCurrentPokemonId = createSelector(
  selectPokemonState,
  getSelectedPokemonId
);
export const selectPokemon = createSelector(
  selectPokemonEntities,
  (pokemonEntities: Dictionary<Pokemon>, id: number) => pokemonEntities[id]
);
export const selectCurrentPokemon = createSelector(
  selectPokemonEntities,
  selectCurrentPokemonId,
  (pokemonEntities, id) => pokemonEntities[Number(id)]
);
