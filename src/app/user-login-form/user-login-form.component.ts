import { Component, OnInit, Input } from '@angular/core';

// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in 6.2
import { UserRegistrationService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrl: './user-login-form.component.scss'
})
export class UserLoginFormComponent {
  @Input() userData = { Username: '', Password: '' };

  // params
  constructor(
    public userRegistrationService: UserRegistrationService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  // This is the function responsible for sending the form inputs to the backend
  loginUser(): void {
    this.userRegistrationService.userLogin(this.userData).subscribe({
      next: (result) => {
        // Logic for a successful user login goes here! 
        console.log(result);
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);
        this.dialogRef.close(); // This will close the modal on success!

        this.snackBar.open('User logged in successfully', 'OK', { duration: 2000 });
      },
      error: (result) => {
        this.snackBar.open(result, 'OK', {
          duration: 2000
        });
      }
    });
  }
}
