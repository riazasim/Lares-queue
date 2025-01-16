import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SchedulingPreviewModel } from 'src/app/core/models/scheduling.model';

@Component({
  selector: 'app-scheduling-cancel-modal',
  templateUrl: './scheduling-cancel-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedulingCancelModalComponent {
  constructor(private readonly dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: SchedulingPreviewModel) {
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}
