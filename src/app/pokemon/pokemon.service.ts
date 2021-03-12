import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pokemon, PokemonResponse } from './pokemon.model';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  constructor(private http: HttpClient) {}

  getRandomPokemonId(): number {
    return Math.floor(Math.random() * 151) + 1;
  }

  getAll(): Observable<Pokemon[]> {
    return this.http.get<PokemonResponse[]>('/assets/data/pokemon.json').pipe(
      map((response) =>
        response.map((pokemon) => ({
          id: pokemon.id,
          name: pokemon.name,
          captureRate: pokemon.capture_rate,
          description: pokemon.description,
          seen: 0,
          own: 0,
        }))
      )
    );
  }
}
