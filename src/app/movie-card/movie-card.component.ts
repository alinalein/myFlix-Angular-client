import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserRegistrationService } from '../fetch-api-data.service'
import { DirectorInfoComponent } from '../director-info/director-info.component';
import { GenreInfoComponent } from '../genre-info/genre-info.component';
import { MovieSynopsisComponent } from '../movie-synopsis/movie-synopsis.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})

export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  favMovies: any[] = [];

  constructor(public userRegistrationService: UserRegistrationService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
  ) { }

  //call those functions when component mounted
  ngOnInit(): void {
    this.getMovies();
    this.getUsersFavMovies();
  }

  getMovies(): void {
    this.userRegistrationService.getAllMovies().pipe(
      catchError(error => {
        console.error('Error fetching favorite movies:', error);
        return of([]);
      })
    ).subscribe(
      (resp: any) => {
        this.movies = resp;
        console.log(this.movies)
      }
    );
  }

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
    });
  }

  isMovieInFavs(movieId: string): boolean {
    return this.favMovies.includes(movieId);
  }

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

  addMovieToFavs(MovieID: string): void {
    this.userRegistrationService.addMovieToFavs(MovieID).subscribe({
      next: (result) => {
        this.snackBar.open('Movie added to favorites successfully', 'OK', { duration: 3000 });
        this.getUsersFavMovies();
        console.log(this.favMovies)
        console.log(result);
      },
      error: (error: any) => {
        console.error('Error adding movie to favorites:', error);
      }
    });
  }

  deleteMovieFromFavs(MovieID: string): void {
    this.userRegistrationService.deleteMovieFromFavs(MovieID).subscribe({
      next: (result) => {
        this.snackBar.open('Movie deleted from favorites successfully', 'OK', { duration: 3000 });
        this.getUsersFavMovies();
        console.log(this.favMovies)
        console.log(result);
      },
      error: (error: any) => {
        console.error('Error deleting movie to favorites:', error);
      }
    })
  }

  //expect name of driector of specific movie as a string argument
  openDirectorInfo(Director: string): void {
    this.dialog.open(DirectorInfoComponent, {
      width: '280px'
    });
  }

  openGenreInfo(Genre: string): void {
    this.dialog.open(GenreInfoComponent, {
      width: '280px'
    });
  }

  openMovieSynopsis(Description: string): void {
    this.dialog.open(MovieSynopsisComponent, {
      width: '280px'
    });
  }
}
