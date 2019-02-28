import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { GamesComponent } from "./games/games.component";
import { GameDetailComponent } from "./game-detail/game-detail.component";
import { GameUploadComponent } from "./game-upload/game-upload.component";
import { UsersComponent } from "./users/users.component";
import { UserDetailComponent } from "./user-detail/user-detail.component";
import { UserCreateComponent } from "./user-create/user-create.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { LoginComponent } from "./login/login.component";

const routes: Routes = [
  { path: '' , component: HomeComponent },
  { path: 'games', component: GamesComponent },
  { path: 'games/:id', component: GameDetailComponent },
  { path: 'game-upload', component: GameUploadComponent },
  { path: 'users', component: UsersComponent },
  { path: 'users/:id', component: UserDetailComponent },
  { path: 'users-create', component: UserCreateComponent },
  { path: 'profile/:id', component: UserProfileComponent },
  { path: 'login', component: LoginComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true, enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
