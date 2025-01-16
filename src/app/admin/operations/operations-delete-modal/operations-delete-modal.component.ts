import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-operations-delete-modal',
  templateUrl: './operations-delete-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OperationsDeleteModalComponent {

  constructor(private readonly dialogRef: MatDialogRef<any>) { }

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}
