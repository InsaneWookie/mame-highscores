import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { AuthService } from "../auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  login: { username: '', password: '' };

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {
  }

  ngOnInit() {
    this.login = {username: '', password: ''};
  }

  onSubmit() {
    this.http.post('/api/v1/auth/login', this.login).subscribe((res: any) => {

      if(res.registrationRequired){
        this.router.navigate([`/register/${res.inviteCode}`]);
      } else {
        this.authService.login(res);
        window.location.href = '/';
      }
    });
  }

}
