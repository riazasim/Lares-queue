import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-port-delete-modal',
  templateUrl: './port-delete-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortDeleteModalComponent {

  constructor(private readonly dialogRef: MatDialogRef<any>) { }

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }

}
