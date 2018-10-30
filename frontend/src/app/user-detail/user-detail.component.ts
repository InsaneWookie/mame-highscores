import { Component, OnInit } from '@angular/core';
import { UserService } from "../user.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  user: object = {
    alias: []
  };
  topGames = [];

  constructor(private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.getUser(params.id); // --> Name must match wanted parameter
    });

  }

  getUser(userId){
    this.userService.getUser(userId).subscribe(user => this.user = user);
  }

}
