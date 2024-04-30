import { Component, OnInit, Input } from '@angular/core';

// you'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// this import brings in the API calls we created in 6.2
import { UserRegistrationService } from '../fetch-api-data.service';

// this import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * @component - Component to register a user.
 */
@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrl: './user-registration-form.component.scss'
})

export class UserRegistrationFormComponent implements OnInit {
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  /**
   * @constructor
   * @param {UserRegistrationService} userRegistrationService - Service for API calls. 
   * @param { MatDialogRef<UserRegistrationFormComponent>} dialogRef - Material reference to a dialog.
   * @param {MatSnackBar} snackBar - Material MatSnackBar to open a dialog.
   */
  constructor(
    public userRegistrationService: UserRegistrationService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) { }

  /**
   * Lifecycle hook called after the component was initialized.
   */
  ngOnInit(): void {
  }

  /**
   * Registers the user to the application
   * If successful, will display a success message and close the registration dialog.
   * If unsuccessful, will display an error message in the browser and show an error message in the console. 
   */
  // this is the function responsible for sending the form inputs to the backend
  registerUser(): void {
    this.userRegistrationService.userRegistration(this.userData).subscribe({
      next: (result) => {
        // logic for a successful user registration goes here
        this.dialogRef.close(); // will close the modal on success
        console.log(result);
        this.snackBar.open('User registered successfully', 'OK', { duration: 2000 });
      },
      error: (error) => {
        console.error('Registration error:', error);
        let errorMessage = 'An error occurred. Please try again later.';
        if (error && error.error && error.error.errors) {
          errorMessage = error.error.errors.join('. '); // join error messages into a single string
        }
        this.snackBar.open(errorMessage, 'OK', { duration: 2000 });
      }
    });
  }
}
