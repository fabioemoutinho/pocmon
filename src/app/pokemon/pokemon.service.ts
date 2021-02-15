import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Pokemon } from './pokemon.reducer';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  constructor() {}

  getRandomPokemonId(): number {
    return Math.floor(Math.random() * 151) + 1;
  }

  getAll(): Observable<Pokemon[]> {
    return of([
      {
        id: 1,
        name: 'Bulbasaur',
      },
    ]);
  }
}
