import { Component, OnInit, Input } from '@angular/core';
import { UserRegistrationService } from '../fetch-api-data.service'

import { Router } from '@angular/router';
// this import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';
// you'll use this import to close the dialog on success
import { MatDialog } from '@angular/material/dialog';

/**
 * @component - Component for displaying user details and action of the details.
 */
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})

export class UserProfileComponent implements OnInit {
  @Input() updatedUser = { Username: '', Email: '', Birthday: '' };
  favMovies: any[] = []
  user: any = {};
  isLoading: boolean = true;
  noFavMoviesMessage: boolean = false;

  /**
   * @constructor
   * @param {UserRegistrationService} userRegistrationService - Service for API calls. 
   * @param {Router} router - Angular service for navigation.
   * @param {MatDialog} dialog - Material MatDialog to close dialogs.
   * @param {MatSnackBar} snackBar - Material MatSnackBar to open a dialog.
   */
  constructor(
    public userRegistrationService: UserRegistrationService,
    public router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) { }

  /**
   * Lifecycle hook called after the component was initialized.
   * It will invoke the function getFavoriteMovies and getUserData.
   */
  // will need to fetch the user data from localStorage and access the user.FavoriteMovies
  ngOnInit(): void {
    this.getFavoriteMovies();
    this.getUserData()
  }

  /**
   * Fetches the users favorite movies from database.
   * If successful, will add the favorite movies of the user to the favMovies array.
   * If unsuccessful, will show an error message in the console.
   */
  getFavoriteMovies(): void {
    this.isLoading = true;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    // fetch user's favorite movie IDs and all movies simultaneously
    this.userRegistrationService.getAllMovies().subscribe((resp: any[]) => {
      // filter movies based on favorite movie IDs
      this.favMovies = resp.filter((movie) => user.FavoriteMovies.includes(movie._id));
      this.noFavMoviesMessage = this.favMovies.length === 0;
      this.isLoading = false;
      console.log('Favorite Movies:', this.favMovies);
    },
      (error: any) => {
        console.error('Error fetching favorite movies:', error);
        this.isLoading = false;
      }
    );
  }

  /**
   * Fetches user details from database.
   * If successful, will add the user details to the user object.
   * If unsuccessful, will show an error message in the console.
   */
  getUserData(): void {
    this.userRegistrationService.getUser().subscribe(
      (resp: {}) => {
        this.user = resp;
        console.log('user: ', this.user)
      },
      (error: any) => {
        console.error('Error fetching user data:', error);
      }
    )
  }

  /**
   * Updates the user details in the database.
   * If successful, will display a success message and set the user object to the updatedUser object, then clear the updatedUser object again.
   * If unsuccessful, will display an error message in the browser and show an error message in the console. 
   */
  updateUserData(): void {
    this.userRegistrationService.updateUserDetails(this.updatedUser).subscribe({
      next: (resp: any) => {
        localStorage.setItem('user', JSON.stringify(resp));
        this.user = resp;
        console.log(this.user);
        this.snackBar.open('Your profile has been updated', 'OK', {
          duration: 3000
        });
        this.updatedUser = { Username: '', Email: '', Birthday: '' }
        // window.location.reload();-> the window jumps
      },
      error: (error) => {
        console.error('Error updating user data:', error);
        this.snackBar.open('Failed to update profile. Please try again.', 'OK', {
          duration: 3000
        });
      }
    });
  }

  /**
   * Deletes user from the database.
   * @returns - If user will not confirm to delete the profile.
   * If confirmed and successful, will display a success message, clear the local storage and navigate to the welcome page.
   * If unsuccessful, will display an error message in the browser and show an error message in the console. 
   */
  deleteUser(): void {
    const confirmDelete = confirm('Are you sure you want to delete your account?');
    if (!confirmDelete) {
      return;
    }

    this.userRegistrationService.deleteUser().subscribe({
      next: (result) => {
        localStorage.clear();
        // logic for a successful user registration goes here
        this.dialog.closeAll()
        this.router.navigate(['welcome']);
        console.log(result);
        this.snackBar.open('User deleted successfully', 'OK', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error deleting user:', error);
        let errorMessage = 'An error occurred while deleting your account. Please try again later.';
        this.snackBar.open(errorMessage, 'OK', { duration: 2000 });
      }
    });
  }
}
