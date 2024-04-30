import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
* @component - Component for the director info dialog.
 */
@Component({
  selector: 'app-director-info',
  templateUrl: './director-info.component.html',
  styleUrl: './director-info.component.scss'
})
export class DirectorInfoComponent implements OnInit {

  /**
   * @constructor
   * @param {any} data - Data passed from the MovieCardComponent to the dialog.
   * @param {MatDialogRef<DirectorInfoComponent>} dialogRef - Reference to the dialog.
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      Name: string,
      Bio: string,
      Birth: string,
      Death: string
    },
    public dialogRef: MatDialogRef<DirectorInfoComponent>,
  ) { }

  /**
  * Lifecycle hook called after the component was initialized with all data-bound properties of a directive.
  */
  ngOnInit(): void {
  }

  /**
  * Closes the director info dialog.
  */
  closeDirector(): void {
    this.dialogRef.close();
  }
}
