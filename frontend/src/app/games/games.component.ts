import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { UserService } from '../user.service';
import { Game } from '../models/game';
import { User } from '../models/user';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {

  games: Game[];
  users: User[];

  constructor(private gameService: GameService, private userService: UserService) {
  }

  ngOnInit() {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;

      this.getGames(users);
    });

  }

  getGames(users: User[]): void {
    this.gameService.getGames().subscribe((games) => {
      //TODO: think there is a better way of handling this pre processing. But want to do it on the backend anyway

      games.forEach((g) => {
        g.scores = [];
        g.top_scorer = null;
        // g.scores.sort((a, b) => a.rank - b.rank);
        // g.top_scorer = (g.scores.length > 0) ? this.getUserFromAlias(g.scores[0].alias, users) : null;
      });

      this.games = games;
    });
  }

  getUserFromAlias(aliasId: number, users: User[]): User {
    if (aliasId === null) {
      return null;
    }

    return users.find((user) => {
      //TODO: add alias Model
      return user.aliases.some((alias: any) => alias.id === aliasId);
    });
  }

}
