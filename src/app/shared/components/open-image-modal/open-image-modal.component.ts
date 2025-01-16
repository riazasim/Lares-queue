import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-open-image-modal',
  templateUrl: './open-image-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpenImageModalComponent {

  constructor(private readonly dialogRef: MatDialogRef<never>,
              @Inject(MAT_DIALOG_DATA) public readonly image: string) {}

  close(): void {
    this.dialogRef.close();
  }
}
