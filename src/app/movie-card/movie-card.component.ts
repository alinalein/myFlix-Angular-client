import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserRegistrationService } from '../fetch-api-data.service'
import { DirectorInfoComponent } from '../director-info/director-info.component';
import { GenreInfoComponent } from '../genre-info/genre-info.component';
import { MovieSynopsisComponent } from '../movie-synopsis/movie-synopsis.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  favMovies: any[] = [];
  user = {};
  constructor(public userRegistrationService: UserRegistrationService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.getMovies();
    this.getAllFavMovies();
  }

  getMovies(): void {
    this.userRegistrationService.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  getAllFavMovies(): void {

  }
  addMovieToFav(movieId: string): void {
    this.userRegistrationService.addMovieToFavs(movieId).subscribe({
      next: (result) => {
        localStorage.setItem('user', JSON.stringify(result.user));
        this.snackBar.open('Movie added to favorites successfully', 'OK', { duration: 3000 });
      },
      error: (error: any) => {
        console.error('Error adding movie to favorites:', error);
      }
    });
  }

  deleteMovieFromFav(): void {

  }
  openDirectorInfo(): void {
    this.dialog.open(DirectorInfoComponent, {
      width: '280px'
    });
  }

  openGenreInfo(): void {
    this.dialog.open(GenreInfoComponent, {
      width: '280px'
    });
  }

  openMovieSynopsis(): void {
    this.dialog.open(MovieSynopsisComponent, {
      width: '280px'
    });
  }
}
