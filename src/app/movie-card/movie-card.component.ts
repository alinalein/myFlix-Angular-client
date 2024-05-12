import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserRegistrationService } from '../fetch-api-data.service'
import { DirectorInfoComponent } from '../director-info/director-info.component';
import { GenreInfoComponent } from '../genre-info/genre-info.component';
import { MovieSynopsisComponent } from '../movie-synopsis/movie-synopsis.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { fakeAsync } from '@angular/core/testing';

/**
 * @component - Component for displaying movies and actions to those movies.
 */
@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})

export class MovieCardComponent implements OnInit {

  movies: any[] = [];
  favMovies: any[] = [];
  isLoading: boolean = true;

  /**
   * @constructor
   * @param {UserRegistrationService} userRegistrationService - Service for API calls. 
   * @param {MatDialog} dialog - Material MatDialog to close dialogs.
   * @param {MatSnackBar} snackBar - Material MatSnackBar to open a dialog.
   */
  constructor(
    public userRegistrationService: UserRegistrationService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
  ) { }

  /**
   * Lifecycle hook called after the component was initialized.
   * It will invoke the function getMovies and getUsersFavMovies.
   */
  ngOnInit(): void {
    this.getMovies();
    this.getUsersFavMovies();
  }

  /**
   * Fetches all movies from the database. 
   * If successful, updates the movies array with the response from the endpoint.
   * If unsuccessful, will show an error message in the console and return an empty array.
   */
  getMovies(): void {
    this.isLoading = true;
    this.userRegistrationService.getAllMovies().pipe(
      catchError(error => {
        console.error('Error fetching movies:', error);
        this.isLoading = false;
        return of([]);
      })
    ).subscribe(
      (resp: any) => {
        this.movies = resp;
        this.isLoading = false;
        console.log(this.movies)
      }
    );
  }

  /**
   * Fetches the user favorite movies from the database. 
   * If successful, updates the favMovies array with the response from the endpoint.
   * If unsuccessful, will show an error message in the console and return an empty array.
   * @returns {any[]} - The array of favorite movies.
   */
  getUsersFavMovies(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userRegistrationService.getFavMovies(user.Username).pipe(
      catchError(error => {
        console.error('Error fetching favorite movies:', error);
        return of([]);
      })
    ).subscribe((resp: any) => {
      this.favMovies = resp;
      console.log(this.favMovies);
      return this.favMovies
    });
  }

  /**
   * Checks is the requested movie is the user favorite list.
   * @param {String} movieId - ID of the requested movie.
   * @returns {boolean} - True if the movie is in the favorite list, false otherwise.
   */
  isMovieInFavs(movieId: string): boolean {
    return this.favMovies.includes(movieId);
  }

  /**
   * Toggles the requested movie between being in the user's favorite list and not.
   * If yes, calls the deleteMovieFromFavs function.
   * If no, calls the addMovieToFavs function.
   * @param {String} movieId - ID of the requested movie.
   */
  toggleMovieInFavs(movieId: string): void {
    const movieInFavs = this.isMovieInFavs(movieId);
    if (movieInFavs) {
      // If movie is in favMovies, remove it
      console.log('Deleted');
      this.deleteMovieFromFavs(movieId);
    } else {
      // If movie is not in favMovies, add it
      console.log('Added');
      this.addMovieToFavs(movieId);
    }
  }

  /**
  * Adds requested movie to the users favorite list.
  * If successful, it will display a success message and call the getUsersFavMovies function.
  * If unsuccessful, will show an error message in the console.
  * @param {String} MovieID - ID of the movie to be added to favorites.
  */
  addMovieToFavs(MovieID: string): void {
    this.userRegistrationService.addMovieToFavs(MovieID).subscribe({
      next: (result) => {
        this.snackBar.open('Movie added to favorites successfully', 'OK', { duration: 3000 });
        this.getUsersFavMovies();
        // console.log(this.favMovies)
        // console.log(result);
      },
      error: (error: any) => {
        console.error('Error adding movie to favorites:', error);
      }
    });
  }

  /**
   * Deletes the requested movie from the user's favorite list.
   * If successful, it will display a success message and call the getUsersFavMovies function.
   * If unsuccessful, it will show an error message in the console.
   * @param {String} MovieID - ID of the movie to be deleted from favorites.
   */
  deleteMovieFromFavs(MovieID: string): void {
    this.userRegistrationService.deleteMovieFromFavs(MovieID).subscribe({
      next: (result) => {
        this.snackBar.open('Movie deleted from favorites successfully', 'OK', { duration: 3000 });
        this.getUsersFavMovies();
        // console.log(this.favMovies)
        // console.log(result);
      },
      error: (error: any) => {
        console.error('Error deleting movie to favorites:', error);
      }
    })
  }

  /**
   * Opens director info dialog.
   * @param {String} name - Name of the director.
   * @param {String} bio - Bio of the director.
   * @param {String} birth - Birth of the director.
   * @param {String} death - Death of the director.
   */
  // expect name of director of specific movie as a string argument
  openDirectorInfo(name: string, bio: string, birth: string, death: string): void {
    this.dialog.open(DirectorInfoComponent, {
      data: {
        Name: name,
        Bio: bio,
        Birth: birth,
        Death: death,
      },
      width: '350px',
    });
  }

  /**
   * Opens gerne info dialog.
   * @param {String} name - Name of the gerne.
   * @param {String} description - Description of the gerne.
   */
  openGenreInfo(name: string, description: string): void {
    this.dialog.open(GenreInfoComponent, {
      data: {
        Name: name,
        Description: description
      },
      width: '350px'
    });
  }

  /**
   * Opens movie synopsis dialog.
   * @param {String} description - Description of the movie.
   */
  openMovieSynopsis(description: string): void {
    this.dialog.open(MovieSynopsisComponent, {
      data: {
        Description: description
      },
      width: '350px'
    });
  }
}
