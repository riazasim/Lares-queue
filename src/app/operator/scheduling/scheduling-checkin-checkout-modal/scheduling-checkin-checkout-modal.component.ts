import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SchedulingPreviewModel } from 'src/app/core/models/scheduling.model';

@Component({
  selector: 'app-scheduling-checkin-checkout-modal',
  templateUrl: './scheduling-checkin-checkout-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedulingCheckinCheckoutModalComponent {
  constructor(private readonly dialogRef: MatDialogRef<any>,
              @Inject(MAT_DIALOG_DATA) public data: { planning: SchedulingPreviewModel, type: 'checkin' | 'checkout' }) {}

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(this.data);
  }
}
