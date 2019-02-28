import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { GamesComponent } from './games/games.component';
import { GameDetailComponent } from './game-detail/game-detail.component';
import { GameUploadComponent } from './game-upload/game-upload.component';
import { UsersComponent } from './users/users.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MomentModule } from 'ngx-moment';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // needed for ngx-chips
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { LoginComponent } from './login/login.component';
import { AuthInterceptor } from "./http.interceptor";
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './auth.guard';
// import { far } from '@fortawesome/free-regular-svg-icons';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GamesComponent,
    GameDetailComponent,
    GameUploadComponent,
    UsersComponent,
    UserCreateComponent,
    UserDetailComponent,
    UserProfileComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    MomentModule,
    TagInputModule,
    BrowserAnimationsModule,
    FontAwesomeModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(){
    library.add(fas);
  }
}
