import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SchedulingPreviewModel } from 'src/app/core/models/scheduling.model';

@Component({
  selector: 'app-scheduling-reject-modal',
  templateUrl: './scheduling-reject-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedulingRejectModalComponent {
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
