import { Component, OnInit } from '@angular/core';
import { UserRegistrationService } from '../fetch-api-data.service'

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {

  ngOnInit(): void {
  }
  // will need to fetch the user data from local stroge and access the user.FavoriteMovies
}
