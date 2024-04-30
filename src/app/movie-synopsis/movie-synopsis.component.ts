import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

/**
* @component - Component for the movie synopsis dialog.
*/
@Component({
  selector: 'app-movie-synopsis',
  templateUrl: './movie-synopsis.component.html',
  styleUrl: './movie-synopsis.component.scss'
})
export class MovieSynopsisComponent implements OnInit {

  /**
  * @constructor
  * @param {any} data - Data passed from the MovieCardComponent to the dialog.
  * @param {MatDialogRef<GenreInfoComponent>} dialogRef - Reference to the dialog.
  */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      Description: string
    },
    public dialogRef: MatDialogRef<MovieSynopsisComponent>
  ) { }

  /**
  * Lifecycle hook called after the component was initialized with all data-bound properties of a directive.
  */
  ngOnInit(): void {
  }

  /**
   * Closes the movie synopsis dialog.
   */
  closeSynopsis(): void {
    this.dialogRef.close()
  }

}


