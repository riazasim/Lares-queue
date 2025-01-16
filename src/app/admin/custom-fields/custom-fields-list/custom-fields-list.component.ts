import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CustomFieldData, CustomFieldModel, ResponseCustomField } from 'src/app/core/models/custom-field.model';
import { CustomFieldService } from 'src/app/core/services/custom-field.service';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomFieldsAddEditModalComponent } from '../custom-fields-add-edit-modal/custom-fields-add-edit-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  OPERATION_DATA_HEADER,
  CONTACT_DATA_HEADER,
  PARTNER_DATA_HEADER,
  LOCATION_DATA_HEADER,
  VEHICLE_DATA_HEADER,
  USER_DATA_HEADER,
  USER_DATA_ROUTE,
  VEHICLE_DATA_ROUTE,
  LOCATION_DATA_ROUTE,
  PARTNER_DATA_ROUTE,
  CONTACT_DATA_ROUTE,
  OPERATION_DATA_ROUTE,
} from 'src/app/core/constants/custom-field-module';

@Component({
  selector: 'app-custom-fields-list',
  templateUrl: './custom-fields-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomFieldsListComponent implements OnInit {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  moduleName: string;
  customFields$: BehaviorSubject< CustomFieldModel[]> = new BehaviorSubject<CustomFieldModel[]>([]);
  moduleType: string;
  id: number;
  constructor(private readonly customFieldService: CustomFieldService,
              private readonly route: ActivatedRoute,
              private readonly dialogService: MatDialog,
              private readonly snackBar: MatSnackBar,
              private readonly router: Router) {
   }

   ngOnInit(): void {
    this.initializeModuleData();
   }

   initializeModuleData(forceLoad: boolean = false): void {
    this.id = this.route.snapshot.params['id'];
    this.moduleType = this.route.snapshot.url[this.route.snapshot.url.length-(this.id ? 2 : 1)].path;
    switch(this.moduleType) {
      case USER_DATA_ROUTE:
            this.retrieveCustomFields('userData', forceLoad);
            this.moduleName = USER_DATA_HEADER;
            if (this.id) this.openAddEditModal(this.id);
            break;
      case VEHICLE_DATA_ROUTE:
            this.retrieveCustomFields('vehicleData', forceLoad);
            this.moduleName = VEHICLE_DATA_HEADER;
            if (this.id) this.openAddEditModal(this.id);
            break;
      case LOCATION_DATA_ROUTE:
            this.retrieveCustomFields('locationData', forceLoad);
            this.moduleName = LOCATION_DATA_HEADER;
            if (this.id) this.openAddEditModal(this.id);
            break;
      case PARTNER_DATA_ROUTE:
        this.retrieveCustomFields('partnerData', forceLoad);
        this.moduleName = PARTNER_DATA_HEADER;
        if (this.id) this.openAddEditModal(this.id);
        break;
      case CONTACT_DATA_ROUTE:
        this.retrieveCustomFields('contactData', forceLoad);
        this.moduleName =CONTACT_DATA_HEADER;
        if (this.id) this.openAddEditModal(this.id);
        break;
      case OPERATION_DATA_ROUTE:
        this.retrieveCustomFields('operationData', forceLoad);
        this.moduleName = OPERATION_DATA_HEADER;
        if (this.id) this.openAddEditModal(this.id);
        break;
    }
   }

  retrieveCustomFields(field: string, forceLoad: boolean = false): void {
    this.customFieldService.list(forceLoad).subscribe((response: ResponseCustomField|null) => {
      if (response) {
        this.customFields$.next((<any>response.data)[field].map(((c: CustomFieldData) => c.attributes)));
      }
      this.isLoading$.next(false);
    });
  }

  openAddEditModal(id?: number) {
    this.dialogService.open(CustomFieldsAddEditModalComponent, {
      disableClose: true,
      data: {
        id,
        moduleType: this.moduleType
      }
    }).afterClosed()
      .subscribe({
        next: (isCreated: boolean) => {
          if (this.id) {
            this.id = 0;
            this.router.navigate(['../'], { relativeTo: this.route });
          }
          if (isCreated) {
            this.isLoading$.next(true);
            this.snackBar.open(id ? 'Success update!' : 'Success create!', '', {
              duration: 3000,
              horizontalPosition: 'start',
              verticalPosition: 'bottom',
            })
            this.initializeModuleData(true);
          }
        }
      });
  }
}
