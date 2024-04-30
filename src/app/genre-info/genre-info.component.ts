import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
* @component - Component for the genre info dialog.
*/
@Component({
  selector: 'app-genre-info',
  templateUrl: './genre-info.component.html',
  styleUrl: './genre-info.component.scss'
})
export class GenreInfoComponent implements OnInit {

  /**
   * @constructor
   * @param {any} data - Data passed from the MovieCardComponent to the dialog.
   * @param {MatDialogRef<GenreInfoComponent>} dialogRef - Reference to the dialog.
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      Name: string,
      Description: string
    },
    public dialogRef: MatDialogRef<GenreInfoComponent>
  ) { }

  /**
   * Lifecycle hook called after the component was initialized with all data-bound properties of a directive.
  */
  ngOnInit(): void {
  }

  /**
   * Closes the genre info dialog.
   */
  closeGenre(): void {
    this.dialogRef.close();
  }
}
