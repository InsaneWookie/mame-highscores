import { Injectable } from '@angular/core';
import { HttpClient } from "../../node_modules/@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { Score } from "./models/Score";

@Injectable({
  providedIn: 'root'
})
export class ScoreService {

  constructor(private http: HttpClient) { }


  getScores(gameId: number) : Observable<Score[]> {
    return this.http.get<Score[]>(`/api/v1/score?sort=rank ASC&game=${gameId}`).pipe(
      catchError(this.handleError('getScores', []))
    )
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
