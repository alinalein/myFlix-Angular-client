import { Component, OnInit, Input } from '@angular/core';
import { UserRegistrationService } from '../fetch-api-data.service'

import { Router } from '@angular/router';
// this import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';
// you'll use this import to close the dialog on success
import { MatDialog } from '@angular/material/dialog';
import { NgStyle } from '@angular/common';

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
  * Checks if the selected image has a valid file format (JPEG, PNG, GIF, or WebP); if not, displays an alert and aborts.
  * If successful, the selected image is uploaded to S3, the file input field is cleared, and the list of image keys is fetched from S3 to identify and add the newest image key to the `thumbnails` array.
  * Fetches the URL of the newly added image and stores it in the `imageUrls` object.
  * If unsuccessful, displays an appropriate error message (e.g., duplicate upload or general upload error) and logs the error to the console.
  */
  uploadImage(): void {
    // Check if a file is selected
    if (!this.selectedFile) return alert('Please select an image file to upload.');

    // Check for valid file format
    const allowedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedFormats.includes(this.selectedFile.type)) {
      return alert('Unallowed file format. Please upload a JPEG, PNG, GIF, or WebP image.');
    }

    // Upload the selected file to S3
    this.userRegistrationService.uploadImageToS3(this.selectedFile).subscribe({
      next: () => {
        console.log('Image uploaded successfully.');
        alert('Image was uploaded')
        // Clear the file input field
        const fileInput = document.getElementById('fileInput') as HTMLInputElement | null;
        if (fileInput) fileInput.value = '';

        setTimeout(() => {

          this.userRegistrationService.getAllImagesFromS3('thumbnail').subscribe(
            (response) => {
              if (response && response.Contents) {
                // Sort the images by LastModified date in descending order
                const sortedImages = response.Contents
                  .filter((item: any) => item.Key && !item.Key.endsWith('/')) // Filter out empty items
                  .sort((a: any, b: any) => new Date(b.LastModified).getTime() - new Date(a.LastModified).getTime());

                if (sortedImages.length > 0) {
                  // Get the newest image key
                  const newImageKey = sortedImages[0].Key;

                  // Add the new image to thumbnails and load its URL
                  this.addNewImageToThumbnails(newImageKey);
                }
              }
            },
            (error) => {
              console.error('Error fetching images from S3:', error);
            }
          );
        }, 800);
      },
      error: (error) => {
        console.error('Error uploading image:', error);
        alert(error.status === 409 ? 'This file has already been uploaded.' : 'There was an error uploading the image.');
      },
    });
  }

  /**
   * Adds a new image key to the `thumbnails` array and fetches its corresponding image URL from S3.
   * Checks if the provided `newImageKey` already exists in the `thumbnails` array to avoid duplicates.
   * If the `newImageKey` does not exist:
   * - Adds the key to the `thumbnails` array.
   * - Fetches the image URL from S3 using the `newImageKey`.
   * - Stores the fetched image URL in the `imageUrls` object.
   * If successful, the new image key is added to the `thumbnails` array and its URL is stored in the `imageUrls` object.
   * If unsuccessful, logs a message indicating that the key is already present, or logs an error if fetching the image URL fails.
   */
  addNewImageToThumbnails(newImageKey: string): void {
    // Check if the new image key already exists; if not, add to the list
    if (!this.thumbnails.includes(newImageKey)) {
      this.thumbnails.push(newImageKey);

      // Fetch the new image URL from S3
      this.userRegistrationService.getSpecificImageFromS3(newImageKey).subscribe(
        (imageUrl) => {
          // Add the URL to the imageUrls object
          this.imageUrls[newImageKey] = imageUrl;
          console.log(`New image added to cache for key: ${newImageKey}`);
        },
        (error) => {
          console.error('Error fetching image:', error);
        }
      );
    } else {
      console.log('Image key already exists in the thumbnails list.');
    }
  }

  /**
   * Loads all thumbnail image keys from an AWS S3 bucket.
   * Fetches images with the 'thumbnail' prefix from S3.
   * Filters out empty items representing folders.
   * Sorts image keys by their last modified date in ascending order.
   * If successful, stores the sorted keys in the `thumbnails` array and calls `loadImages()` to fetch their URLs.
   * If unsuccessful, logs a warning if no contents are found or logs an error if the S3 request fails.
   */
  loadThumbnails(): void {
    this.isLoadingImages = true;

    this.userRegistrationService.getAllImagesFromS3('thumbnail').subscribe(
      (response) => {
        if (response && response.Contents) {
          this.thumbnails = response.Contents
            // Filters out the empty item in S3 bucket that was created while (folder) in S3 created
            .filter((item: any) => item.Key && !item.Key.endsWith('/'))
            // Sorts the items according to which item is larger than the other 
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
   * Iterates over the `thumbnails` array and checks if each image URL is already cached in the `imageUrls` object.
   * If an image URL is already in the cache, it logs a message indicating the cache hit.
   * If an image URL is not found in the cache, it fetches the image URL from S3 and stores it in the cache (`imageUrls` object) using the corresponding key.
   * If successful, the image URL is stored in the `imageUrls` object.
   * If unsuccessful, it logs an error indicating that fetching the image from S3 has failed.
   */
  loadImages(): void {
    this.thumbnails.forEach((key: string) => {
      // Check if the image is already in the cache
      if (this.imageUrls[key]) {
        // Image is in the cache, use it
        console.log(`Image for key ${key} found in cache.`);
      } else {
        // If not, fetch it from S3 and store it in the cache
        this.userRegistrationService.getSpecificImageFromS3(key).subscribe(
          (imageUrl) => {
            // Store the fetched image URL in the cache
            this.imageUrls[key] = imageUrl;
          },
          (error: any) => {
            console.error('Error fetching image:', error);
          }
        );
      }
    });
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
}
