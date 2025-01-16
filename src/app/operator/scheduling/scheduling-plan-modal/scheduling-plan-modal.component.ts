import { ChangeDetectionStrategy, Component, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-scheduling-plan-modal',
  templateUrl: './scheduling-plan-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedulingPlanModalComponent implements AfterViewInit  {
  @ViewChild('inputSID') inputSID: ElementRef;

  constructor(private readonly dialogRef: MatDialogRef<any>,
              @Inject(MAT_DIALOG_DATA) public readonly data: any) { }

  ngAfterViewInit(): void {
    this.inputSID.nativeElement.value = this.data.planning.sId;
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }

}
