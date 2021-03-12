import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BattleComponent } from './battle/battle.component';
import { MapComponent } from './map/map.component';
import { PokedexComponent } from './pokedex/pokedex.component';

const routes: Routes = [
  {
    path: 'battle',
    component: BattleComponent,
  },
  {
    path: 'map',
    component: MapComponent,
  },
  {
    path: 'pokedex',
    component: PokedexComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
