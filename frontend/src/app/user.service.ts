import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers() : Observable<object[]> {
    return this.http.get<object[]>('/api/v1/user')
      .pipe(catchError(this.handleError('getUsers', [])));
  }

  getUser(userId: number) : Observable<object>{
    return this.http.get<object[]>(`/api/v1/user/${userId}`)
      .pipe(catchError(this.handleError('getUser', [])));
  }

  createUser(user: object) : Observable<object[]>{
    return this.http.post('/api/v1/user', user)
      .pipe(catchError(this.handleError('createUser', [])));
  }

  createAlasis(alaseses: object[]) : Observable<object[]> {

    let requests = [];
    alaseses.forEach((a) => {
      requests.push(this.http.post('/api/v1/alias', a));
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
}
