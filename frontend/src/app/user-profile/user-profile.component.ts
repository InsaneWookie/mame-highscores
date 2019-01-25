import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "../models/user";
import { UserService } from "../user.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  user: User = new User;
  aliases = "";

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) {
  }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.getUser(params.id);
    });
  }



  onSubmit() {

    let aliases = [];

    this.aliases.split(',').forEach((alias) => {
      aliases.push({name: alias, user: this.user.id});
    });

    this.userService.updateAlasis(aliases).subscribe(() => {
      //this.router.navigateByUrl(`user-detail/${user.id}`)
    });
  }

  getUser(userId){
    this.userService.getUser(userId).subscribe(user => {
      this.user = user;
      this.aliases = this.user.aliases.map((a) => a.name).join(',');
    });
  }

}
