import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UserService } from "../user.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit {

  user: object = {
    username: "",
    email: "",
    //aliases: []
  };

  aliases: string = "";


  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    let aliases = [];


    // this.user.aliases = aliases;

    console.log(this.user);
    this.userService.createUser(this.user).subscribe((user) => {
      console.log(user);

      this.aliases.split(',').forEach(function (alias){
        aliases.push({name: alias, user: user.id});
      });

      this.userService.createAlasis(aliases).subscribe(() => {
        this.router.navigateByUrl(`user-detail/${user.id}`)
      });


    });
  }

}
