import { Component, OnInit } from '@angular/core';
import { UserService } from "../user.service";
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "../models/user";
import { Game } from "../models/game";

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  user: User = new User();
  games: Game[] = [];
  topGames = [];

  constructor(private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.getUser(params.id);
      this.getGames(params.id);
    });

  }

  getUser(userId){
    this.userService.getUser(userId).subscribe(user => this.user = user);
  }

  getGames(userId){
    this.userService.getGames(userId).subscribe( games => this.games = games);
  }

}
