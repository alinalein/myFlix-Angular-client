import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

// you'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// this import brings in the API calls we created in 6.2
import { UserRegistrationService } from '../fetch-api-data.service';

// this import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * @component - Component for the user to log in.
 */
@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrl: './user-login-form.component.scss'
})
export class UserLoginFormComponent implements OnInit {
  @Input() userData = { Username: '', Password: '' };

  /**
   * @constructor
   * @param {UserRegistrationService} userRegistrationService - Service for API calls. 
   * @param {MatDialogRef<UserLoginFormComponent>} dialogRef - Material reference to a dialog.
   * @param {MatSnackBar} snackBar - Material MatSnackBar to open a dialog
   * @param {Router} router - Angular`s Service for navigation. 
   */
  constructor(
    public userRegistrationService: UserRegistrationService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) { }

  /**
   * Lifecycle hook called after the component was initialized.
   */
  ngOnInit(): void {
  }

  /**
   * Logs the user in with the provided credentials.
   * If successful, will diplay a success message, stores user data and token in local storage and navigate to the movies page.
   * If unsuccessful, will display an error message. 
   */
  // this is the function responsible for sending the form inputs to the backend
  loginUser(): void {
    this.userRegistrationService.userLogin(this.userData).subscribe({
      next: (result) => {
        // logic for a successful user login goes here 
        console.log(result);
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);
        this.dialogRef.close(); // will close the modal UserLoginFormComponent on success

        this.snackBar.open('User logged in successfully', 'OK', { duration: 2000 });
        this.router.navigate(['movies']);
      },
      error: (result) => {
        // display an error message if login fails
        this.snackBar.open(result, 'OK', {
          duration: 2000
        });
      }
    });
  }
}
