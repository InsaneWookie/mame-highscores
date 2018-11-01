import { Component, OnInit } from '@angular/core';
import { GameService } from "../game.service";
import { ActivatedRoute } from "@angular/router";
import { ScoreService } from "../score.service";
import { Game } from "../models/game";
import { Score } from "../models/Score";

@Component({
  selector: 'app-game-detail',
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.scss']
})
export class GameDetailComponent implements OnInit {

  game: Game;
  scores: Score[];


  constructor(private gameService: GameService,
              private scoreService: ScoreService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    const gameId = + this.route.snapshot.paramMap.get('id');
    this.gameService.getGame(gameId).subscribe(game => {

      this.game = game;
    });

    this.scoreService.getScores(gameId).subscribe(scores => this.scores = scores);
  }

}
