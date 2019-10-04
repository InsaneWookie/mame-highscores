import { Component, OnInit } from '@angular/core';
import { UserService } from "../user.service";
import { User } from '../models/user';
import { AuthService } from '../auth.service';
import { forkJoin, Observable, of } from "rxjs";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: object[];
  loggedInUser: User;

  constructor(
    private userService: UserService,
    private authService: AuthService) {
  }

  ngOnInit() {
    this.getUsers();
    this.userService.getUser(this.authService.getUserId()).subscribe(user => this.loggedInUser = user);
  }

  getUsers(): void {
    this.userService.getUsers().subscribe(users => this.users = users);
  }

}
