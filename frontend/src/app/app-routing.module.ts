import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { GamesComponent } from "./games/games.component";
import { GameDetailComponent } from "./game-detail/game-detail.component";

const routes: Routes = [
  { path: '' , component: HomeComponent },
  { path: 'games', component: GamesComponent },
  { path: 'games/:id', component: GameDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true, enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
