import { Component, OnInit } from '@angular/core';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { MatDialog } from '@angular/material/dialog';

/**
* @component - Component representing the welcome page of the application.
 */
@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.scss'
})
export class WelcomePageComponent implements OnInit {

  /**
  * @constructor 
  * @param {MatDialog} dialog - Material servive to open a dialog. 
  */
  constructor(public dialog: MatDialog) { }

  /**
  * Lifecycle hook called after the component was initialized.
  */
  ngOnInit(): void {
  }

  /**
   * Opens the dialog for user registration.
   */
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '400px'
    });
  }

  /**
   * Opens the dialog for user login.
   */
  openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      width: '400px'
    });
  }
}
