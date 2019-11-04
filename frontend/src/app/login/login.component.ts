import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from "../auth.service";
import {  FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  invalidLogin = false;
  loggingIn = false;

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),

    });
  }

  onSubmit() {
    this.loginForm.markAsTouched({onlySelf: true});
    if(this.loginForm.invalid){
      return;
    }

    this.invalidLogin = false;
    this.loggingIn = true;
    this.http.post('/api/v1/auth/login', this.loginForm.value).subscribe((res: any) => {

      if(res.success){
        this.authService.login(res);
        //window.location.href = '/';
        this.router.navigate(['/dashboard']);
      } else {
        this.invalidLogin = true;
        this.loggingIn = false;
      }

    }, () => { this.loggingIn = false; });
  }

  get username(){
    return this.loginForm.get('username');
  }

  get password(){
    return this.loginForm.get('password');
  }


}
