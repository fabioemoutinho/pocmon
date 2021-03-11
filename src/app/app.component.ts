import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
} from '@angular/core';
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
  currentPositionX = 16;
  currentPositionY = 33;

  constructor(
    private router: Router,
    private store: Store,
    private pokemonService: PokemonService
  ) {}

  @HostListener('document:keydown', ['$event'])
  move(event: KeyboardEvent) {
    switch (event.key) {
      case 'Down': // IE/Edge specific value
      case 'ArrowDown':
      case 's':
        this.moveDown();
        break;
      case 'Up': // IE/Edge specific value
      case 'ArrowUp':
      case 'w':
        this.moveUp();
        break;
      case 'Left': // IE/Edge specific value
      case 'ArrowLeft':
      case 'a':
        this.moveLeft();
        break;
      case 'Right': // IE/Edge specific value
      case 'ArrowRight':
      case 'd':
        this.moveRight();
        break;
    }
  }

  getBackgroundPosition(): string {
    return `${-this.currentPositionX * 16 + 64}px ${
      -this.currentPositionY * 16 + 64
    }px`;
  }

  moveLeft(): void {
    if (this.currentPositionX > 0) {
      this.currentPositionX -= 1;
    }
  }

  moveRight(): void {
    if (this.currentPositionX < 33) {
      this.currentPositionX += 1;
    }
  }

  moveUp(): void {
    if (this.currentPositionY > 0) {
      this.currentPositionY -= 1;
    }
  }

  moveDown(): void {
    if (this.currentPositionY < 47) {
      this.currentPositionY += 1;
    }
  }

  battle(): void {
    this.store.dispatch(
      selectPokemon({ pokemonId: this.pokemonService.getRandomPokemonId() })
    );
  }

  pokedex(): void {
    this.router.navigate(['pokedex']);
  }
}
