import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccessPointsService } from 'src/app/core/services/access-points.service';
import { TenantsService } from 'src/app/core/services/tenants.service';
import { TenantsImportModalComponent } from './tenants-import-modal/tenants-import-modal.component';
import { BehaviorSubject } from 'rxjs';
import { handleError } from 'src/app/shared/utils/error-handling.function';
import { PageEvent } from '@angular/material/paginator';
import { createRequiredValidators } from 'src/app/shared/validators/generic-validators';

@Component({
  selector: 'app-tenants',
  templateUrl: './tenants.component.html',
  styleUrls: ['./tenants.component.scss']
})
export class TenantsComponent implements OnInit {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  @Output() nextTab = new EventEmitter<void>();
  tenantsForm: FormGroup;
  pageSizeOptions = [5, 10, 15];
  pageIndex = 0;
  pageSize = 5;
  length = 0;
  rows: number[] = [1];
  accessPoints: any[] = [];
  selectedAccessPoints: any[] = [];

  constructor(private fb: FormBuilder,
    private readonly dialogService: MatDialog,
    private readonly tenantsService: TenantsService,
    private readonly accessPointsService: AccessPointsService,
        private snackBar: MatSnackBar,
        private cdr: ChangeDetectorRef
  ) { }


  ngOnInit(): void {
    this.initForm();
    // this.getAccessPointsList();
    this.updateLength();
  }

  initData() {
    this.initForm();
    this.getAccessPointsList();  
  }

  updateLength() {
    this.length = this.tenants.length;
  }

  initForm() {
    this.tenantsForm = this.fb.group({
      tenants: this.fb.array([])
    });

    this.addRow();
  }

  get tenants(): FormArray {
    return this.tenantsForm.get('tenants') as FormArray;
  }

  getAccessPointsList(){
    this.accessPointsService.getAccessPointsList().subscribe({
      next: (response) => {
        this.accessPoints = response.map((item:any) => item.attributes);
        console.log('Access Points Loaded:', this.accessPoints);
      },
      error: (error) => console.error('Failed to load access points:', error)
    });
  }

  createTenant(tenantData: any = null): FormGroup {
    return this.fb.group({
      name: [tenantData ? tenantData.attributes.name : '', [...createRequiredValidators()]],
      insideQueueCapacity: [tenantData ? tenantData.attributes.insideQueueCapacity : '', [...createRequiredValidators()]],
      initialInsideQueue: [tenantData ? tenantData.attributes.initialInsideQueue : '', [...createRequiredValidators()]],
      hourlyProcessingSpeedMax: [tenantData ? tenantData.attributes.hourlyProcessingSpeedMax : '', [...createRequiredValidators()]],
      parameterAccessPointId: [tenantData ? tenantData.attributes.parameterAccessPointId : '', [...createRequiredValidators()]],
      gateToTenantTime: [tenantData ? tenantData.attributes.gateToTenantTimeInMin : '', [...createRequiredValidators()]],
    });
  }

  addRow(): void {
    this.tenants.push(this.createTenant());
    this.updateLength();
  }

  removeRow(index: number): void {
    if (this.tenants.length > 1) {
      this.tenants.removeAt(index);
      this.updateLength();
    }
  }

  onAccessPointSelectionChange(): void {
    const selected = this.tenantsForm
      .get('parameterAccessPointId')
      ?.value;
    this.selectedAccessPoints = selected || [];
  }

  removeAccessPoint(ap: any): void {
    this.selectedAccessPoints = this.selectedAccessPoints.filter(
      (item) => item !== ap
    );

    this.tenantsForm
      .get('parameterAccessPointId')
      ?.setValue(this.selectedAccessPoints);
  }

  openImportModal(): void {
    this.isLoading$.next(true);
    this.dialogService.open(TenantsImportModalComponent, {
      disableClose: true,
      data: {}
    }).afterClosed()
      .subscribe({
        next: (response) => {
          if (response && response.data && response.data.items) {
            this.updateTenantsForm(response.data.items);
          }
          this.isLoading$.next(false);
        },
        error: (error) => {
          console.error('Error during import:', error);
          handleError(this.snackBar, error);
          this.isLoading$.next(false);
        }
      });
  }
  
  updateTenantsForm(importedTenants: any[]): void {
    const tenantsArray = this.tenants as FormArray;
    importedTenants.forEach((tenantItem) => {
      if (tenantItem.type === "tenant") {
        tenantsArray.push(this.createTenant(tenantItem));
      }
    });
    this.cdr.markForCheck(); // Trigger change detection manually
}

onPaginateChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  next() {
    const tenantsData = this.tenantsForm.getRawValue().tenants.map((tenant: any) => ({
      ...tenant,
      insideQueueCapacity: tenant.insideQueueCapacity.toString(),
      initialInsideQueue: tenant.initialInsideQueue.toString(),
      hourlyProcessingSpeedMax: tenant.hourlyProcessingSpeedMax.toString(),
      gateToTenantTime: tenant.gateToTenantTime.toString(),
    }));
    const payload = {
          queue: {
            parameterTenants: tenantsData },
        };
        this.tenantsService.create(payload).subscribe({
          next: () => {
            this.nextTab.emit();
          },
          error: (error: any) => {
            console.error('Error during creation:', error);
            handleError(this.snackBar, error);
          }
        });
      }
  }
