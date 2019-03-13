import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "../models/user";
import { UserService } from "../user.service";
import { concat, pipe } from "rxjs";
import { concatMap } from "rxjs/operators";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  user: User = new User;
  aliases = [];
  passwords = {
    current_password: '',
    new_password: '',
    repeat_new_password: ''
  };

  newAliases = [];
  aliasesToRemove = [];

  inviteEmail = '';
  inviteLinkDisplay = '';

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

    console.log(this.passwords);
    // this.userService.save(this.user).pipe(
    //   concatMap(r => this.userService.createAlasis(this.newAliases)),
    //   concatMap(r => this.userService.removeAliases(this.aliasesToRemove))
    // ).subscribe()
    // concat(
    //   [this.userService.save(this.user),
    //     this.userService.createAlasis(this.newAliases),
    //     this.userService.removeAliases(this.aliasesToRemove)]
    // ).subscribe(
    //   x => { console.log(x); },
    //   err => console.log(err),
    //   () => console.log('done'));

    this.userService.save(this.user.id, this.passwords).subscribe(user => {
      this.user = user;
      //this.aliases = this.user.userGroups[0].aliases; //.map((a) => a.name).join(',');
    });

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
      this.aliases = this.user.userGroups[0].aliases; //.map((a) => a.name).join(',');
    });
  }

  // saveUser(){
  //   return this.userService.save(this.user).subscribe(user => {
  //     this.user = user;
  //     //this.aliases = this.user.userGroups[0].aliases; //.map((a) => a.name).join(',');
  //   });
  // }

  onInviteSubmit() {
    this.userService.inviteUser(this.inviteEmail).subscribe(response => {
      this.inviteLinkDisplay = response.inviteLink;
    });
  }
}
