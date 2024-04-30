import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * @component - Component representing the navigation bar.
 */
@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss'
})
export class NavigationBarComponent implements OnInit {

  /**
   * @constructor 
   * @param {Router} router - Service for the route navigation.
   * @param {MatSnackBar} snackBar - Material snack bar service for displaying notifications.
   */
  constructor(
    private router: Router,
    public snackBar: MatSnackBar
  ) { }

  /**
   * Lifecycle hook called after the component was initialized.
   */
  ngOnInit(): void {
  }

  /**
   *Routes to the movies page.
   */
  routeMovies(): void {
    this.router.navigate(['movies'])
  }

  /**
   * Routes to the user's profile page.
   */
  routeProfile(): void {
    this.router.navigate(['profile']);
  }

  /**
   * Logs the user out , clears the local storage and navigates to the welcome page. 
   */
  logOut(): void {
    localStorage.setItem('user', '');
    localStorage.setItem('token', '');
    this.snackBar.open('You have been logged out', 'OK', { duration: 2000 });
    this.router.navigate(['welcome']);
  }
}
