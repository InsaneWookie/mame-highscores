import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { last } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  games: Array<Object> = [];

  lastPlayedGames: Array<Object> = [];

  topPlayers: Array<Object> = [];

  lastestScores: Array<Object> = [
    // {
    //     id: 1,
    //     rank: 1,
    //     name: "ROW",
    //     score: 12345,
    //     alias: Object({user: 1}),
    //     game: Object({ id: 1, full_name: "test" })
    // }
  ];

  constructor(private gameService: GameService) {
  }

  getGames(): void {
    this.gameService.getGames2().subscribe(games => this.games = games);
  }

  getTopPlayers(): void {
    this.gameService.getTopPlayers().subscribe(topPlayers => this.topPlayers = topPlayers);
  }

  getLastPlayed(): void {
    this.gameService.getLastPlayed().subscribe((lastPlayed: any) => {
      lastPlayed = lastPlayed.filter(l => l.gameplayed !== null)
        .sort((a, b) => (a.gameplayed.date_time < b.gameplayed.date_time) ? 1 : -1)
        .slice(0, 10);
      this.lastPlayedGames = lastPlayed;
    });
  }

  ngOnInit() {
    this.getTopPlayers();
    this.getLastPlayed();
  }

}
