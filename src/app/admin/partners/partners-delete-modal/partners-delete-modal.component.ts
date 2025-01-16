import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-partners-delete-modal',
  templateUrl: './partners-delete-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PartnersDeleteModalComponent {

  constructor(private readonly dialogRef: MatDialogRef<any>) { }

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }

}
