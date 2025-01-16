import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-trains-delete-modal',
  templateUrl: './trains-delete-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainsDeleteModalComponent {
  constructor(private readonly dialogRef: MatDialogRef<any>) { }

  cancel() {
    this.dialogRef.close(false);
  }

  confirm() {
    this.dialogRef.close(true);
  }
}
