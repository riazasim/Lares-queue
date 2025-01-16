import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-scheduling-upgrade-warning-modal',
  templateUrl: './scheduling-upgrade-warning-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulingUpgradeWarningModalComponent {
  constructor(private readonly dialogRef: MatDialogRef<any>) {
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}
