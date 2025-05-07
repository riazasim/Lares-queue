import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from "@angular/material/paginator";
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { AccessPointsService } from 'src/app/core/services/access-points.service';
import { handleError } from 'src/app/shared/utils/error-handling.function';
import { numDecimal } from 'src/app/shared/utils/num-decimal.function';
import { createRequiredValidators } from 'src/app/shared/validators/generic-validators';

@Component({
  selector: 'app-access-points',
  templateUrl: './access-points.component.html',
  styleUrls: ['./access-points.component.scss'],
})
export class AccessPointsComponent implements OnInit {
  [x: string]: any;
  numDecimalUtil = numDecimal;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  @Output() nextTab = new EventEmitter<void>();
  accessPointsForm: FormGroup;
  pageSizeOptions = [5, 10, 15];
  pageIndex = 0;
  pageSize = 5;
  length = 0;

  constructor(private fb: FormBuilder,
    private readonly accessPointsService: AccessPointsService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.accessPointsForm = this.fb.group({
      accessPoints: this.fb.array([]),
    });

    this.addAccessPoint();
    this.updateLength();
  }

  updateLength() {
    this.length = this.accessPoints.length;
  }


  get accessPoints(): FormArray {
    return this.accessPointsForm.get('accessPoints') as FormArray;
  }

  createAccessPoint(): FormGroup {
    return this.fb.group({
      name: ['', [...createRequiredValidators()]],
      wrongLPRPercentage: ['', [...createRequiredValidators(), Validators.max(100), Validators.min(0), Validators.pattern(/^\d+$/)]],
      wrongLPRProcessingTime: ['', [...createRequiredValidators()]],
      correctLPRProcessingTime: ['', [...createRequiredValidators()]],
    });
  }

  addAccessPoint(): void {
    this.accessPoints.push(this.createAccessPoint());
    this.updateLength();
  }

  removeAccessPoint(index: number): void {
    if (this.accessPoints.length > 1) {
      this.accessPoints.removeAt(index);
      this.updateLength();
    }
  }

  onPaginateChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  next() {
    const payload = {
      data: this.accessPointsForm.getRawValue().accessPoints,
      processId: localStorage.getItem('processId')
    };
    this.accessPointsService.create(payload).subscribe({
      next: () => {
        this.isLoading$.next(false);
        this.nextTab.emit();
      },
      error: (error: any) => {
        console.error('Error during creation:', error);
        this.isLoading$.next(false);
        handleError(this.snackBar, error, this.isLoading$);
      }
    });
  }
}



