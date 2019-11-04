import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { UserService } from "./user.service";
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';

  isLoggedIn = false;
  user = new User;

  sub: any;

  constructor(private readonly authService: AuthService,
              private userService: UserService,
              private router: Router) {
  }

  ngOnInit() {
    // this.isLoggedIn = this.authService.isLoggedIn();
    this.isLoggedIn = this.authService.isLoggedIn();
    this.sub = this.authService.loginChange.subscribe(value => {
      this.isLoggedIn = value;
      this.getUser();
    });
    this.getUser();

  }

  ngOnDestroy() {
    //prevent memory leak when component destroyed
    this.sub.unsubscribe();
  }

  getUser(){
    if(this.isLoggedIn){
      this.userService.getUser(this.authService.getUserId()).subscribe(user => this.user = user);
    }
  }

  onLogout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.user = new User;

    this.router.navigate(['/login']);

  }

}
