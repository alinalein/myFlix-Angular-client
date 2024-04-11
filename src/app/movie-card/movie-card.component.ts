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

  ngOnInit(): void {
    this.getMovies();
    this.getUsersFavMovies();
  }

  getMovies(): void {
    this.userRegistrationService.getAllMovies().subscribe(
      (resp: any) => {
        this.movies = resp;
        // console.log(`all movies: ${this.movies}`);
        console.log(this.movies)
      },
      (error) => {
        console.error('Error fetching all movies:', error);
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

  toggleMovieInFavs(movieId: string): void {
    if (movieId && this.favMovies) {
      const index = this.favMovies.findIndex(movie => movie._id === movieId);
      if (index !== -1) {
        // If movie is in favMovies, remove it
        console.log('Deleted')
        this.deleteMovieFromFavs(movieId);
      } else {
        // If movie is not in favMovies, add it
        this.addMovieToFavs(movieId);
        console.log('Added')
      }
    }
  }

  addMovieToFavs(MovieID: string): void {
    this.userRegistrationService.addMovieToFavs(MovieID).subscribe({
      next: (result) => {
        localStorage.setItem('user', JSON.stringify(result.user));
        this.snackBar.open('Movie added to favorites successfully', 'OK', { duration: 3000 });
        console.log(this.favMovies)
      },
      error: (error: any) => {
        console.error('Error adding movie to favorites:', error);
        console.log(this.favMovies)
      }
    });
  }

  deleteMovieFromFavs(id: string): void {
    this.userRegistrationService.deleteMovieFromFavs(id).subscribe({
      next: (result) => {
        localStorage.setItem('user', JSON.stringify(result.user));
        this.snackBar.open('Movie deleted from favorites successfully', 'OK', { duration: 3000 });
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
