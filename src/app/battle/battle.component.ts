import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { capturePokemon, selectPokemon } from '../pokemon/pokemon.actions';
import { selectCurrentPokemon } from '../pokemon/pokemon.selectors';

@Component({
  selector: 'app-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BattleComponent {
  readonly pokemon$ = this.store.select(selectCurrentPokemon);

  constructor(private store: Store) {}

  fight(pokemonId: number): void {
    this.store.dispatch(capturePokemon({ pokemonId }));
  }

  run(): void {
    this.store.dispatch(selectPokemon({ pokemonId: null }));
  }
}
