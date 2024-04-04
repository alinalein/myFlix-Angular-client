import { Component, OnInit, Input } from '@angular/core';

// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in 6.2
import { UserRegistrationService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrl: './user-registration-form.component.scss'
})
export class UserRegistrationFormComponent implements OnInit {
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  // params
  constructor(
    public userRegistrationService: UserRegistrationService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  // This is the function responsible for sending the form inputs to the backend
  registerUser(): void {
    this.userRegistrationService.userRegistration(this.userData).subscribe({
      next: (result) => {
        // Logic for a successful user registration goes here! (To be implemented)
        this.dialogRef.close(); // This will close the modal on success!
        console.log(result);
        this.snackBar.open('User registered successfully', 'OK', { duration: 2000 });
      },
      error: (error) => {
        console.error('Registration error:', error);
        let errorMessage = 'An error occurred. Please try again later.';
        if (error && error.error && error.error.errors) {
          errorMessage = error.error.errors.join('. '); // Join error messages into a single string
        }
        this.snackBar.open(errorMessage, 'OK', { duration: 2000 });
      }
    });
  }
}
