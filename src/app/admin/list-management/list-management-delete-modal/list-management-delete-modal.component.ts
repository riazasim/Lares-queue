import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-list-management-list-delete-modal',
  templateUrl: './list-management-delete-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListManagementDeleteModalComponent {

  constructor(private readonly dialogRef: MatDialogRef<any>,
              @Inject(MAT_DIALOG_DATA) public data: {name: any}) {}


  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }

}
