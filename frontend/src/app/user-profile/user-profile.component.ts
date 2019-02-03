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
  aliases = [];

  newAliases = [];
  aliasesToRemove = [];

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) {
  }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.getUser(params.id);
    });
  }

  onAliasAdded(event) {
    event.name = event.name.toUpperCase();
    this.newAliases.push({name: event.name, user: this.user.id});
  }

  onAliasRemoved(event){
    this.aliasesToRemove.push(event);
  }

  onSubmit() {

    this.userService.createAlasis(this.newAliases).subscribe(() => {
      this.newAliases = [];
    });
    this.userService.removeAliases(this.aliasesToRemove).subscribe(() => {
      this.aliasesToRemove = [];
    });

    //this.userService.updateAlasis(aliases).subscribe(() => {
      //this.router.navigateByUrl(`user-detail/${user.id}`)
    //});
  }

  getUser(userId){
    this.userService.getUser(userId).subscribe(user => {
      this.user = user;
      this.aliases = this.user.aliases; //.map((a) => a.name).join(',');
    });
  }

}
