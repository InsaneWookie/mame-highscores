import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { UserService } from "./user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Mame Highscores';

  isLoggedIn = false;
  user = null;

  constructor(private readonly authService: AuthService,
              private userService: UserService,
              private router: Router) {
  }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userService.getUser(this.authService.getUserId()).subscribe(user => this.user = user);

  }

  onLogout() {
    this.authService.logout();
    this.isLoggedIn = false;

    this.router.navigate(['/login']);

  }
}
