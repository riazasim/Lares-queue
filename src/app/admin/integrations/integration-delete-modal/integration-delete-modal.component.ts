import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-integration-delete-modal',
  templateUrl: './integration-delete-modal.component.html',
  styleUrls: ['./integration-delete-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IntegrationDeleteModalComponent {
  constructor(private readonly dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: string) {}

  cancel(): void {
  this.dialogRef.close(false);
  }

  confirm(): void {
  this.dialogRef.close(true);
  }
}
