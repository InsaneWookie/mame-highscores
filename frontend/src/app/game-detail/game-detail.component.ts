import { Component, OnInit } from '@angular/core';
import { GameService } from "../game.service";
import { ActivatedRoute } from "@angular/router";
import { ScoreService } from "../score.service";

@Component({
  selector: 'app-game-detail',
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.scss']
})
export class GameDetailComponent implements OnInit {

  game: object;


  constructor(private gameService: GameService, private scoreService: ScoreService, private route: ActivatedRoute) { }

  ngOnInit() {
    const gameId = + this.route.snapshot.paramMap.get('id');
    this.gameService.getGame(gameId).subscribe(game => {

      this.scoreService.get
      game.scores = [];
      this.game = game


    });
  }

}
