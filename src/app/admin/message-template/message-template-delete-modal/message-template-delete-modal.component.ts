import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-message-template-delete-modal',
  templateUrl: './message-template-delete-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageTemplateDeleteModalComponent {

  constructor(private readonly dialogRef: MatDialogRef<any>) { }

  cancel() {
    this.dialogRef.close(false);
   }
  confirm() {
    this.dialogRef.close(true);
  }

}
