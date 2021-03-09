import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { interval, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { capturePokemon, selectPokemon } from '../pokemon/pokemon.actions';
import { Pokemon } from '../pokemon/pokemon.model';
import { selectCurrentPokemon } from '../pokemon/pokemon.selectors';

@Component({
  selector: 'app-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('throwing', [
      state(
        'init',
        style({
          transform: 'scale(2) rotate(0deg)',
        })
      ),
      state(
        'throwing',
        style({
          bottom: '120px',
          transform: 'scale(2) rotate(360deg)',
        })
      ),
      transition('init => throwing', [animate('500ms')]),
    ]),
  ],
})
export class BattleComponent {
  count = 100;
  successCircleSize = 0;
  throwing = '';
  readonly pokemon$ = this.store
    .select(selectCurrentPokemon)
    .pipe(tap((pokemon) => this.initComponent(pokemon)));
  readonly counter$ = this.getInterval;

  private tries = 0;

  constructor(private store: Store, private snackbar: MatSnackBar) {}

  throw(pokemonId: number, pokemonName: string): void {
    this.throwing = 'init';
    setTimeout(() => (this.throwing = 'throwing'));
    setTimeout(() => {
      this.throwing = '';
      this.tries += 1;
      if (this.count < this.successCircleSize) {
        this.catch(pokemonId, pokemonName);
      } else {
        if (this.tries === 3) {
          this.flee(pokemonName);
        }
      }
    }, 500);
  }

  run(): void {
    this.snackbar.open('Got away safely!');
    this.store.dispatch(selectPokemon({ pokemonId: null }));
  }

  private catch(pokemonId: number, pokemonName: string): void {
    this.snackbar.open(`${pokemonName.toLocaleUpperCase()} was caught!`);
    this.store.dispatch(capturePokemon({ pokemonId }));
  }

  private flee(pokemonName: string): void {
    this.snackbar.open(`Wild ${pokemonName.toLocaleUpperCase()} fled!`);
    this.store.dispatch(selectPokemon({ pokemonId: null }));
  }

  private initComponent(pokemon?: Pokemon): void {
    if (pokemon) {
      this.count = 100;
      this.tries = 0;
      this.setSuccessCircleSize(pokemon);
    }
  }

  private getInterval(captureRate: number): Observable<number> {
    return interval(this.getMinMax(30 * (captureRate / 255), 5, 40)).pipe(
      tap(() => {
        if (this.count === 0) {
          this.count = 100;
        } else {
          this.count -= 1;
        }
      })
    );
  }

  private setSuccessCircleSize(pokemon?: Pokemon): void {
    if (pokemon) {
      const rate = (pokemon.captureRate / 255) * 100;
      this.successCircleSize = this.getMinMax(rate, 40, 70);
    }
  }

  private getMinMax(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}
