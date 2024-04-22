import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://movie-api-lina-834bc70d6952.herokuapp.com/';

// const apiUrl = 'http://localhost:8080/';

@Injectable({
  providedIn: 'root'
})

export class UserRegistrationService {

  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned error code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  // Non-typed response extraction
  private extractResponseData(res: Object): any {
    const body = res;
    return body || {};
  }

  // Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users/signup', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  public userLogin(userDetails: any): Observable<any> {
    // console.log(userDetails);
    return this.http.post(apiUrl + 'users/login', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  getUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return of(user);
  }

  updateUserDetails(updatedUser: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    //updated user will be passed in request body
    return this.http.put(apiUrl + 'users/update/' + user.Username, updatedUser, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    )
  }

  deleteUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/deregister/' + user.Username, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      catchError(this.handleError)
    );
  }

  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  getOneMovie(Title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/title/' + Title, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  getDirector(Director: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/director/' + Director, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  getGenre(Genre: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/genre/' + Genre, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  getFavMovies(Username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + Username, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError),
      map((data: any) => {
        if (data && data.FavoriteMovies) {
          return data.FavoriteMovies;
        } else {
          throw new Error('FavoriteMovies not found in response data');
        }
      })
    );
  }

  addMovieToFavs(MovieID: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.put(apiUrl + 'users/' + user.Username + '/movies/add/' + MovieID, null, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map((result) => {
        // Update user's favorite movies in local storage
        if (!user.FavoriteMovies.includes(MovieID)) {
          user.FavoriteMovies.push(MovieID);
          localStorage.setItem('user', JSON.stringify(user));
        }

        return result;
      }),
      catchError(this.handleError)
    );
  }

  deleteMovieFromFavs(MovieID: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/' + user.Username + '/movies/remove/' + MovieID, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map((result) => {
        // Remove deleted movie ID from user's favorite movies list in local storage
        user.FavoriteMovies = user.FavoriteMovies.filter((id: string) => id !== MovieID);
        localStorage.setItem('user', JSON.stringify(user));

        return result;
      }),
      catchError(this.handleError)
    );
  }
}