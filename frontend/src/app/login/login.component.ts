import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { AuthService } from "../auth.service";
import { AbstractControl, AsyncValidator, FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { passwordsMatch } from "../user-profile/user-profile.component";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";

// export class UniqueAlterEgoValidator implements AsyncValidator {
//   constructor(private authService: AuthService) {}
//
//   validate(
//     ctrl: AbstractControl
//   ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
//     return this.heroesService.isAlterEgoTaken(ctrl.value).pipe(
//       map(isTaken => (isTaken ? { uniqueAlterEgo: true } : null)),
//       catchError(() => null)
//     );
//   }
// }

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
        window.location.href = '/';
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
