import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
  MatSnackBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
} from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { MapEffects } from './map/map.effects';
import { reducer as mapReducer } from './map/map.reducer';
import { PokemonEffects } from './pokemon/pokemon.effects';
import { reducer as pokemonReducer } from './pokemon/pokemon.reducer';
import { BattleComponent } from './battle/battle.component';
import { MapComponent } from './map/map.component';
import { PokedexComponent } from './pokedex/pokedex.component';

@NgModule({
  declarations: [AppComponent, BattleComponent, MapComponent, PokedexComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MatSnackBarModule,
    ReactiveComponentModule,
    StoreModule.forRoot({ map: mapReducer, pokemon: pokemonReducer }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    EffectsModule.forRoot([MapEffects, PokemonEffects]),
  ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
