import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss'
})
export class NavigationBarComponent implements OnInit {

  constructor(
    private router: Router,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  routeMovies(): void {
    this.router.navigate(['movies'])
  }

  routeProfile(): void {
    this.router.navigate(['profile']);
  }

  logOut(): void {
    localStorage.setItem('user', '');
    localStorage.setItem('token', '');
    this.snackBar.open('You have been logged out', 'OK', { duration: 2000 });
    this.router.navigate(['welcome']);
  }

}
