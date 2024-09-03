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
  user: any = {};

  isLoadingMovies: boolean = true;
  noFavMoviesMessage: boolean = false;
  favMovies: any[] = []

  isLoadingImages: boolean = true;
  selectedFile: File | null = null;
  thumbnails: any[] = [];
  // key will be a string, url created from it will also be a string, object like dictionary 
  imageUrls: { [key: string]: string } = {};

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
    this.getUserData();
    this.loadThumbnails();
  }

  /**
   * Fetches the users favorite movies from database.
   * If successful, will add the favorite movies of the user to the favMovies array.
   * If unsuccessful, will show an error message in the console.
   */
  getFavoriteMovies(): void {
    this.isLoadingMovies = true;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    // fetch user's favorite movie IDs and all movies simultaneously
    this.userRegistrationService.getAllMovies().subscribe((resp: any[]) => {
      // filter movies based on favorite movie IDs
      this.favMovies = resp.filter((movie) => user.FavoriteMovies.includes(movie._id));
      this.noFavMoviesMessage = this.favMovies.length === 0;
      this.isLoadingMovies = false;
      console.log('Favorite Movies:', this.favMovies);
    },
      (error: any) => {
        console.error('Error fetching favorite movies:', error);
        this.isLoadingMovies = false;
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

  /**
   * Uploads a selected image to an AWS S3 bucket.
   * If no file is selected, prompts the user to select one.
   * On success, clears the file input and adds the image to thumbnails.
   * On failure, displays an error message and logs the error.
   */
  uploadImage(): void {
    // Check if a file is selected
    if (!this.selectedFile) {
      alert('Please select an image file to upload.');
      return;
    }

    // Upload the selected file to S3
    this.userRegistrationService.uploadImageToS3(this.selectedFile).subscribe({
      next: () => {
        console.log('Image uploaded successfully.');

        // Clear the file input field
        const fileInput = document.getElementById('fileInput') as HTMLInputElement | null;
        if (fileInput) {
          fileInput.value = '';
        }

        // Append the new image to the list and fetch its URL
        this.addNewImageToThumbnails();
      },
      error: (error) => {
        console.error('Error uploading image:', error);
        alert(error.status === 409 ? 'This file has already been uploaded.' : 'There was an error uploading the image.');
      },
    });
  }

  /**
 * Adds a newly uploaded image to the list of thumbnails.
 * Generates a new image key based on the selected file's name.
 * Checks if the image is already in the list, if not, adds it.
 * Fetches the image URL from S3 and stores it for display.
 */
  addNewImageToThumbnails(): void {
    // ! to make sure that selectedFile is not null 
    const newImageKey = `resized-images/${this.selectedFile!.name}`;

    // Check if the new image key already exists, if not add to list
    if (!this.thumbnails.includes(newImageKey)) {
      this.thumbnails.push(newImageKey);

      // Fetch the new image URL
      this.userRegistrationService.getSpecificImageFromS3(newImageKey).subscribe(
        (imageUrl) => this.imageUrls[newImageKey] = imageUrl, // Add the URL to imageUrls object
        (error) => console.error('Error fetching image:', error)
      );
    }
  }

  /**
   * Handles the file selection event from the input element.
   * Sets the selected file to be uploaded.
   * @param event - The file input change event.
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  /**
   * Loads all thumbnail image keys from an AWS S3 bucket.
   * Fetches all images with the 'thumbnail' prefix from S3.
   * Sorts the images by their last modified date.
   * Stores the sorted image keys in the `thumbnails` array.
   * Calls `loadImages` to fetch the actual image URLs.
   * Handles loading state and logs warnings or errors if needed.
   */
  loadThumbnails(): void {
    this.isLoadingImages = true
    this.userRegistrationService.getAllImagesFromS3('thumbnail').subscribe(
      (response) => {
        if (response && response.Contents) {
          this.thumbnails = response.Contents
            .sort((a: any, b: any) => new Date(a.LastModified).getTime() - new Date(b.LastModified).getTime())
            .map((item: any) => item.Key);

          this.loadImages(); // Load the actual images using the keys
        } else {
          console.warn('No contents found in the response');
        }
        this.isLoadingImages = false
      },
      (error: any) => {
        console.error('Error fetching images:', error);
        this.isLoadingImages = false
      }
    );
  }

  /**
   * Loads the actual image URLs for each thumbnail key from S3.
   * Iterates over the `thumbnails` array to fetch each image URL.
   * Stores the image URL in the `imageUrls` object with the corresponding key.
   * Logs an error if fetching any image fails.
   */
  loadImages(): void {
    this.thumbnails.forEach((key: string) => {
      this.userRegistrationService.getSpecificImageFromS3(key).subscribe(
        (imageUrl) => {
          this.imageUrls[key] = imageUrl; // Store the image URL to corresponding  key in the imageUrls object
        },
        (error: any) => {
          console.error('Error fetching image:', error);
        }
      );
    });
  }
}
