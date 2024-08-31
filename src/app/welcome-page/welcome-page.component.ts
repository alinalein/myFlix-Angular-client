import { Component, OnInit } from '@angular/core';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
/**
* @component - Component representing the welcome page of the application.
 */
@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.scss'
})
export class WelcomePageComponent implements OnInit {

  private loginDialogRef: MatDialogRef<UserLoginFormComponent> | null = null;
  private registrationDialogRef: MatDialogRef<UserRegistrationFormComponent> | null = null;

  /**
  * @constructor 
  * @param {MatDialog} dialog - Material servive to open a dialog. 
  */
  constructor(
    public dialog: MatDialog,
  ) { }

  /**
  * Lifecycle hook called after the component was initialized.
  */
  ngOnInit(): void {
    this.openUserLoginDialog();
  }

  /**
   * Opens the dialog for user registration.
   */
  openUserRegistrationDialog(): void {
    // Close the login dialog if it's open
    if (this.loginDialogRef) {
      this.loginDialogRef.close();
    }

    // Open the registration dialog
    this.registrationDialogRef = this.dialog.open(UserRegistrationFormComponent, {
      width: '400px',
      hasBackdrop: false
    });
  }


  /**
   * Opens the dialog for user login.
   */
  openUserLoginDialog(): void {
    // Close the registration dialog if it's open
    if (this.registrationDialogRef) {
      this.registrationDialogRef.close();
    }

    // Open the login dialog
    this.loginDialogRef = this.dialog.open(UserLoginFormComponent, {
      width: '400px',
      hasBackdrop: false
    });
  }
}
