import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { User } from "./models/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers() : Observable<User[]> {
    return this.http.get<User[]>('/api/v1/user')
      .pipe(catchError(this.handleError('getUsers', [])));
  }

  getUser(userId: number) : Observable<User>{
    return this.http.get<User>(`/api/v1/user/${userId}`)
      .pipe(catchError(this.handleError('getUser', new User)));
  }

  createUser(user: User) : Observable<User>{
    return this.http.post<User>('/api/v1/user', user)
      .pipe(catchError(this.handleError('createUser', new User)));
  }

  createAlasis(alaseses: any[]) : Observable<object[]> {

    let requests = [];
    alaseses.forEach((a) => {
      a.name = a.name.toUpperCase();
    });

    requests.push(this.http.post('/api/v1/alias', alaseses));

    return forkJoin(requests).pipe(catchError(this.handleError('createAlasis', [])));
  }

  removeAliases(aliases: object[]) : Observable<object[]> {

    let requests = [];
    aliases.forEach((a: any) => {

    });

    requests.push(this.http.post(`/api/v1/alias/delete`, aliases));

    return forkJoin(requests).pipe(catchError(this.handleError('createAlasis', [])));
  }

  updateAlasis(alaseses: object[]) : Observable<object[]> {

    let requests = [];
    alaseses.forEach((a) => {
      requests.push(this.http.put(`/api/v1/alias/{}`, a));
    });

    return forkJoin(requests).pipe(catchError(this.handleError('createAlasis', [])));
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      //this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  inviteUser(inviteEmail: string): Observable<any> {
    return this.http.post<any>('/api/v1/user/invite', {inviteEmail})
      .pipe(catchError(this.handleError('getInviteUser', {})));
  }
}
