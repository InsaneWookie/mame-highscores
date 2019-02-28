import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from "rxjs";
import { User } from "./models/user";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  isLoggedIn() {
    const token = localStorage.getItem('id_token');
    const expiresAt = parseInt(localStorage.getItem('expires_at'), 10);
    const hasExpired = (!!expiresAt) ? moment().diff(moment(expiresAt)) > 0 : true;
    return !!token && !hasExpired;
  }

  login(res) {
    const expiresAt = moment().add(res.expiresIn, 'second');

    localStorage.setItem('id_token', res.accessToken);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
    localStorage.setItem('user_id', res.userId);
  }

  // login(): Observable<User> {
  //
  //   return this.http.post('/api/v1/auth/login', this.login)
  //     .pipe()
  //     .subscribe((res: any) => {
  //
  //
  //     const expiresAt = moment().add(res.expiresIn, 'second');
  //
  //     localStorage.setItem('id_token', res.accessToken);
  //     localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  //
  //     window.location.href = '/';
  //   });
  //
  // }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
  }

  getUserId() {
    return parseInt(localStorage.getItem('user_id'), 10);
  }
}
