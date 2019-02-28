import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { User } from "../models/user";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  login: {username: '', password: ''};

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.login = {username: '', password: ''}
  }

  onSubmit() {
    this.http.post('/api/v1/auth/login', this.login).subscribe((res) => {
      console.log(res);
    });
  }

}
