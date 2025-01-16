import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-partners-contacts-delete-modal',
  templateUrl: './partners-contacts-delete-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PartnersContactsDeleteModalComponent {
  
  constructor(private readonly dialogRef: MatDialogRef<any>) { }

  cancel() {
    this.dialogRef.close(false);
   }
  confirm() {
    this.dialogRef.close(true);
  }

}
