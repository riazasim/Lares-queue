import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { OperationModel } from 'src/app/core/models/operation.model';
import { OperationService } from 'src/app/core/services/operation.service';
import { createRequiredValidators } from 'src/app/shared/validators/generic-validators';

@Component({
  selector: 'app-operations-add-edit',
  templateUrl: './operations-add-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OperationsAddEditComponent implements OnInit {
  operationForm: FormGroup;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  id: number;
  constructor(private operationService: OperationService,
              private fb: UntypedFormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.subscribeForQueryParams();
  }

  subscribeForQueryParams(): void {
    this.route.params.subscribe((params: any) => {
      if (params.id) {
        this.id = params.id;
        this.operationService.get(params.id).subscribe(response => {
          this.initForm(response);
          this.isLoading$.next(false);
          this.cd.detectChanges();
        });
      } else {
        this.initForm();
        this.isLoading$.next(false);
        this.cd.detectChanges();
      }
    })
  }

  initForm(data: OperationModel = <OperationModel>{}): void {
    this.operationForm = this.fb.group({
      id: this.fb.control(data?.id),
      name: this.fb.control(data?.name || '', [...createRequiredValidators()]),
      type: this.fb.control(data?.type || '', [...createRequiredValidators()]),
      allocatedTime: this.fb.control(data?.allocatedTime || '', [...createRequiredValidators()]),
      description: this.fb.control(data?.description || '', [...createRequiredValidators()]),
    });
  }

  saveOperation(): void {
    this.isLoading$.next(true);
    if (this.operationForm.get('id')?.value) {
      this.operationService.edit(this.id, this.parseData(this.operationForm.value)).subscribe(() => {
        this.isLoading$.next(false)
        this.router.navigate(['../../success'], { relativeTo: this.route });
      });
    } else {
      this.operationService.create(this.parseData(this.operationForm.value)).subscribe(() => {
        this.isLoading$.next(false);
        this.router.navigate(['../success'], { relativeTo: this.route });
      });
    }
  }

  parseData(data: OperationModel): OperationModel {
    return {
      ...data,
      allocatedTime: +data.allocatedTime
    }
  }

}
