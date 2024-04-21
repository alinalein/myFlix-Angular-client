import { Component, OnInit, Input } from '@angular/core';
import { UserRegistrationService } from '../fetch-api-data.service'

import { Router } from '@angular/router';
// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';
// You'll use this import to close the dialog on success
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})

export class UserProfileComponent implements OnInit {
  @Input() updatedUser = { Username: '', Email: '', Birthday: '' };
  favMovies: any[] = []
  user: any = {};


  constructor(
    public userRegistrationService: UserRegistrationService,
    public router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) { }

  // will need to fetch the user data from local stroge and access the user.FavoriteMovies
  ngOnInit(): void {
    this.getFavoriteMovies();
    this.getUserData()
  }

  getFavoriteMovies(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    // Fetch user's favorite movie IDs and all movies simultaneously
    this.userRegistrationService.getAllMovies().subscribe((resp: any[]) => {
      // Filter movies based on favorite movie IDs
      this.favMovies = resp.filter((movie) => user.FavoriteMovies.includes(movie._id));
      console.log('Favorite Movies:', this.favMovies);
    },
      (error: any) => {
        console.error('Error fetching favorite movies:', error);
        // Handle error if needed
      }
    );
  }



  getUserData(): void {
    this.userRegistrationService.getUser().subscribe(
      (resp: {}) => {
        this.user = resp;
        console.log('user: ', this.user)
      }),
      (error: any) => {
        console.error('Error fetching user data:', error);
      }
  }

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

  deleteUser(): void {
    const confirmDelete = confirm('Are you sure you want to delete your account?');
    if (!confirmDelete) {
      return;
    }

    this.userRegistrationService.deleteUser().subscribe({
      next: (result) => {
        localStorage.clear();
        // Logic for a successful user registration goes here! (To be implemented)
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
