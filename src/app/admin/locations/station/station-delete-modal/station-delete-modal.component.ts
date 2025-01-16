import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-station-delete-modal',
  templateUrl: './station-delete-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StationDeleteModalComponent {

  constructor(private readonly dialogRef: MatDialogRef<any>) { }

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }

}
