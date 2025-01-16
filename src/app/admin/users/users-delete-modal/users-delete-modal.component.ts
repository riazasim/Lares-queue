import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-users-delete-modal',
  templateUrl: './users-delete-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersDeleteModalComponent {

  constructor(private readonly dialogRef: MatDialogRef<any>) { }

  cancel() {
    this.dialogRef.close(false);
  }

  confirm() {
    this.dialogRef.close(true);
  }
}
