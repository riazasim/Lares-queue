import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-status-delete-modal',
  templateUrl: './status-delete-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusDeleteModalComponent {

  constructor(private readonly dialogRef: MatDialogRef<any>,
              @Inject(MAT_DIALOG_DATA) public data: {name: any}) {
  }


  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}
