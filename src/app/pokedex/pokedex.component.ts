import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAllPokemon } from '../pokemon/pokemon.selectors';

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokedexComponent {
  readonly pokemon$ = this.store.select(selectAllPokemon);
  selected?: number = undefined;

  constructor(private store: Store) {}

  select(i: number): void {
    this.selected = i;
  }
}
