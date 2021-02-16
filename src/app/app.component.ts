import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectPokemon } from './pokemon/pokemon.actions';
import { PokemonService } from './pokemon/pokemon.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(
    private router: Router,
    private store: Store,
    private pokemonService: PokemonService
  ) {}

  battle(): void {
    this.store.dispatch(
      selectPokemon({ pokemonId: this.pokemonService.getRandomPokemonId() })
    );
  }

  pokedex(): void {
    this.router.navigate(['pokedex']);
  }
}
