import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-vehicles-delete-modal',
  templateUrl: './vehicles-delete-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehiclesDeleteModalComponent {
  constructor(private readonly dialogRef: MatDialogRef<any>) { }

  cancel() {
    this.dialogRef.close(false);
  }

  confirm() {
    this.dialogRef.close(true);
  }
}
