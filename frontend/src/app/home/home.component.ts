import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    games: Array<Object> = [{
        id: 1,
        name: 'Windstorm'
    }];

    lastPlayedGames: Array<Object> = [
        {id: 1, name: 'Windstorm', clean_name: "bob", play_count: 3, last_played: new Date() }
    ];

    topPlayers: Array<Object> = [
        {id: 1, username: "new guy", total_points: 123 }
    ];

    lastestScores: Array<Object> = [
        {
            id: 1,
            rank: 1,
            name: "ROW",
            score: 12345,
            alias: Object({user: 1}),
            game: Object({ id: 1, full_name: "test" })
        }
    ];

    constructor() {
    }

    ngOnInit() {
    }

}
