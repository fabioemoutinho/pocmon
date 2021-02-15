import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pokemon } from './pokemon.model';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  constructor(private http: HttpClient) {}

  getRandomPokemonId(): number {
    return Math.floor(Math.random() * 151) + 1;
  }

  getAll(): Observable<Pokemon[]> {
    return this.http.get<Pokemon[]>('/assets/pokemon/data.json');
  }
}
