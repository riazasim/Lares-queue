import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-no-location-warning',
  templateUrl: './no-location-warning.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoLocationWarningComponent {

  constructor(private readonly dialogRef: MatDialogRef<never>) {}

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}
