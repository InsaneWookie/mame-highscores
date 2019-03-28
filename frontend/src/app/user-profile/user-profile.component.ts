import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "../models/user";
import { UserService } from "../user.service";
import { concat, pipe } from "rxjs";
import { concatMap } from "rxjs/operators";
import { FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Validators } from '@angular/forms';

export const passwordsMatch: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const newPassword = control.get('newPassword');
  const repeatNewPassword = control.get('repeatNewPassword');
// debugger;
  return (newPassword.value !== repeatNewPassword.value) ? {'passwordsMatch':  true} : null
};

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  user: User = new User;
  aliases = [];

  changePasswordForm = new FormGroup({
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl(''),
    repeatNewPassword: new FormControl(''),
  }, { validators: passwordsMatch});

  newAliases = [];
  aliasesToRemove = [];

  inviteEmail = '';
  inviteLinkDisplay = '';

  isSaving = false;

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) {
  }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.getUser(params.id);
    });
  }

  get currentPassword(){
    return this.changePasswordForm.get('currentPassword');
  }

  get newPassword(){
    return this.changePasswordForm.get('newPassword');
  }

  get repeatNewPassword(){
    return this.changePasswordForm.get('repeatNewPassword');
  }


  onAliasAdded(event) {
    event.name = event.name.toUpperCase();
    this.newAliases.push({name: event.name, user: this.user.id});
  }

  onAliasRemoved(event){
    if(event.id){ //only add to remove list if its been saved
      this.aliasesToRemove.push(event);
    }

  }

  onSubmit() {


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

  onChangePasswordSubmit(){
    // console.warn(this.changePasswordForm.value);
    this.isSaving=true;
    this.userService.save(this.user.id, this.changePasswordForm.value).subscribe(user => {
      this.user = user;
      this.isSaving = false;
    }, (err) => { this.isSaving = false; } );
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
