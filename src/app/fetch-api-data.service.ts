import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// declaring the api url that will provide data for the client app
// const apiUrl = 'https://movie-api-lina-834bc70d6952.herokuapp.com/';
const apiUrl = 'http://localhost:8080/';

// service for fetching data from the API
@Injectable({
  providedIn: 'root'
})

export class UserRegistrationService {

  /**
   * Constructor for the UserRegistrationService class.
   * @constructor
   * @param {HttpClient} http - To make HTTP requests.
   */
  // inject the HttpClient module to the constructor params & making it available to the entire class under this.http
  constructor(private http: HttpClient) {
  }

  /**
   * Handles HTTP errors.
   * @param {HttpErrorResponse} error - HTTP error response.
   * @returns {any} - Error encountered during an API call.
   */
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

  /**
   * Extracts non-typed response data.
   * @param {Object} res - API response. 
   * @returns {any} - Extracted response data.
   */
  private extractResponseData(res: Object): any {
    const body = res;
    return body || {};
  }
  // User calls 

  /**
   * Registers a new user by making a POST request to the user registration endpoint.
   * @param {any} userDetails - Details provided by the user for registration.
   * @returns {Observable<any>} - Observable that emits the API response.
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users/signup', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Logs the user in by making a POST request to the user login endpoint.
   * @param {any} userDetails - Details provided by the user for login.
   * @returns {Observable<any>} - Observable that emits the API response.
   */
  public userLogin(userDetails: any): Observable<any> {
    // console.log(userDetails);
    return this.http.post(apiUrl + 'users/login', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Gets user details from the local storage.
   * @returns {Observable<any>} - Observable emits details about the user retrieved from local storage.
   */
  getUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return of(user);
  }

  /**
   * Updates user details by making a PUT request to the user update endpoint.
   * @param {any} updatedUser - The update details about the user provided by the user.
   * @returns {Observable<any>} - Observable that emits the API response.
   */
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

  /**
   * Deletes user details by making a DELETE request to the user delete endpoint.
   * @returns {Observable<any>} - Observable that emits the API response.
   */
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

  // Movies calls 

  /**
   * Retrieves all movies from the database by making a GET request to the corresponding endpoint.
   * @returns {Observable<any>} - Observable that emits the API response.
   */
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

  /**
   * Retrieves the requested movie from the database by making a GET request to the corresponding endpoint.
   * @param {String} Title - Title of the movie to be retrieved.
   * @returns {Observable<any>} - Observable that emits the API response.
   */
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

  /**
   * Retrieves the requested director from the database by making a GET request to the corresponding endpoint.
   * @param {String} Director - Director of the movie to be retrieved.
   * @returns {Observable<any>} - Observable that emits the API response.
   */
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

  /**
   * Retrieves the requested genre from the database by making a GET request to the corresponding endpoint.
   * @param {String} Genre - Genre of the movie to be retrieved.
   * @returns {Observable<any>} - Observable that emits the API response.
   */
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

  /**
 * Retrieves user favorite movies by making a GET request to the corresponding endpoint.
 * @param {string} Username - Username of the user.
 * @returns {Observable<any>} Observable that emits the API response.
 */
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
      // filter out and return only the favorite movies from the response data
      map((data: any) => {
        if (data && data.FavoriteMovies) {
          return data.FavoriteMovies;
        } else {
          throw new Error('FavoriteMovies not found in response data');
        }
      })
    );
  }

  /**
   * Adds a movie to the user's favorite movies by making a PUT request to the corresponding endpoint.
   * @param {String} MovieID - ID of the movie to be added to favorites.
   * @returns {Observable<any>} Observable that emits the API response.
   */
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
        // update user's favorite movies in local storage
        if (!user.FavoriteMovies.includes(MovieID)) {
          user.FavoriteMovies.push(MovieID);
          localStorage.setItem('user', JSON.stringify(user));
        }

        return result;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Deletes a movie from the users favorite movies by making a DELETE request to the corresponding endpoint.
   * @param {String} MovieID - ID of the movie to be removed from favorites
   * @returns {Observable<any>} Observable that emits the API response.
   */
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
        // remove deleted movie ID from user's favorite movies list in local storage
        user.FavoriteMovies = user.FavoriteMovies.filter((id: string) => id !== MovieID);
        localStorage.setItem('user', JSON.stringify(user));

        return result;
      }),
      catchError(this.handleError)
    );
  }

  // S3 bucket calls 

  /**
  * Lists all objects in an S3 bucket depending on the specified type by making a GET request to the corresponding endpoint.
  * @param {String} type - Either 'original' or 'thumbnail', specifying the type of pictures to load.
  * @returns {Observable<any>} Observable that emits the API response containing the list of images.
  */
  getAllImagesFromS3(type: string): Observable<any> {
    const token = localStorage.getItem('token');
    const url = `${apiUrl}images/${type}`;

    return this.http.get(url, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
  * Retrieves a specific object from an S3 bucket depending on the specified type and key by making a GET request to the corresponding endpoint.
  * @param {String} key - Key of the image to be retrieved from the S3 bucket.
  * @returns {Observable<any>} Observable that emits the API response containing the image data.
  */
  getSpecificImageFromS3(key: string): Observable<any> {
    const token = localStorage.getItem('token');
    const url = `${apiUrl}images/${key}`;

    return this.http.get(url, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        }),
      // Response should be treated as a binary large object (Blob), data like images, audio, video
      responseType: 'blob'
    }).pipe(
      // Blod, the data returned by API
      map((response: Blob) => {
        // Create a URL from the Blob object, what allows display in <img> element's src attribute to display the image
        return URL.createObjectURL(response);
      }),
      catchError(this.handleError)
    );
  }

  /**
    * Uploads an image to the cloud via a POST request to the corresponding endpoint.
    * @param {File} image - The image file to be uploaded to the cloud.
    * @returns {Observable<any>} - Observable that emits the API response.
    */
  public uploadImageToS3(file: File): Observable<any> {
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('image', file);

    return this.http.post(apiUrl + 'images/', formData, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      catchError((error) => {
        console.error('Error uploading image to S3:', error);
        throw error;
      })
    );
  }
}