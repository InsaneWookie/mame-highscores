import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { GamesComponent } from "./games/games.component";

const routes: Routes = [
  { path: '' , component: HomeComponent },
  { path: 'games', component: GamesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
