import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-route-delete-modal',
  templateUrl: './route-delete-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RouteDeleteModalComponent {
  constructor(private readonly dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number, title: string, description: string }) {
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }

}
