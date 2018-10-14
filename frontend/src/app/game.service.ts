import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class GameService {

  constructor(private http: HttpClient) { }

  getGames() : Observable<object[]> {
    return this.http.get<object[]>('/game?where={"has_mapping": true, "clone_of":null}&limit=500&sort=full_name ASC').pipe(
      catchError(this.handleError('getHeroes', []))
    )
    // return [
    //   {
    //     id: 1, clone_of: null, full_name: "Donkey Kong", name: "Donkey Kong",
    //     scores: [{ name: "ABC", score: 123 }]
    //   }
    //
    // ];
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
