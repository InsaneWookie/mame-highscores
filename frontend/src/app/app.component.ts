import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { UserService } from "./user.service";
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Mame Highscores';

  isLoggedIn = false;
  user = new User;

  sub: any;

  constructor(private readonly authService: AuthService,
              private userService: UserService,
              private router: Router) {
  }

  ngOnInit() {
    // this.isLoggedIn = this.authService.isLoggedIn();
    this.isLoggedIn = this.authService.loggedIn;
    this.sub = this.authService.loginChange.subscribe(value => { this.isLoggedIn = value; });
    this.userService.getUser(this.authService.getUserId()).subscribe(user => this.user = user);
  }

  ngOnDestroy() {
    //prevent memory leak when component destroyed
    this.sub.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
    this.isLoggedIn = false;

    this.router.navigate(['/login']);

  }

}
