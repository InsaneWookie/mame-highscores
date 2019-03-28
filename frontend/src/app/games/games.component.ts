import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { UserService } from '../user.service';
import { Game } from '../models/game';
import { User } from '../models/user';
import { map, tap } from "rxjs/operators";

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {

  games: Game[];
  users: User[];

  allGames: Game[];

  page = 1;

  constructor(private gameService: GameService, private userService: UserService) {
  }

  getPageSymbol(current: number) {
    let pages: string[] = ['0-9', "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K",
      "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    return pages[current - 1];
  }

  ngOnInit() {
    this.getUsers();
  }

  getUsers(): void {
    // this.userService.getUsers().subscribe(users => {
    //   this.users = users;
    // });

    this.getGames(null);

  }

  pageChanged($event) {
    this.setPage();
  }

  setPage() {
    const symbol = this.getPageSymbol(this.page);

    if (symbol === '0-9') {
      this.games = this.allGames.filter((g) => g.full_name !== null && g.full_name.charAt(0).toLowerCase().match(/^[0-9]/));
    } else {
      this.games = this.allGames.filter((g) => g.full_name !== null && g.full_name.charAt(0).toLowerCase() === symbol.toLowerCase());
    }

  }

  getGames(users: User[]): void {
    this.gameService.getGames()
    // .pipe(map(g => g.slice(0, 100)))
      .subscribe((games) => {
        this.allGames = games;
        this.setPage();
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
