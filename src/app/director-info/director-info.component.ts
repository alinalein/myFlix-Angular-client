import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-director-info',
  templateUrl: './director-info.component.html',
  styleUrl: './director-info.component.scss'
})
export class DirectorInfoComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      Name: string,
      Bio: string,
      Birth: string,
      Death: string
    },
    public dialogRef: MatDialogRef<DirectorInfoComponent>,
  ) { }

  ngOnInit(): void {
  }

  closeDirector(): void {
    this.dialogRef.close();
  }
}
