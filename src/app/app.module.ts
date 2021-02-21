import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { PokemonEffects } from './pokemon/pokemon.effects';
import { reducer } from './pokemon/pokemon.reducer';
import { BattleComponent } from './battle/battle.component';
import { PokedexComponent } from './pokedex/pokedex.component';

@NgModule({
  declarations: [AppComponent, BattleComponent, PokedexComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot({ pokemon: reducer }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    EffectsModule.forRoot([PokemonEffects]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
