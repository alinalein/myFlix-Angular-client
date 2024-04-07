import { Component, OnInit } from '@angular/core';
import { UserRegistrationService } from '../fetch-api-data.service'

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  constructor(public userRegistrationService: UserRegistrationService) { }

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.userRegistrationService.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }
}
