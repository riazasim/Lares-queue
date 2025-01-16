import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { IntegrationDeleteModalComponent } from '../integration-delete-modal/integration-delete-modal.component';
import { handleError } from 'src/app/shared/utils/error-handling.function';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrganizationService } from 'src/app/core/services/organization.service';
import { PageSettingsModel } from 'src/app/core/models/page.model';
import defaultPageSettings from '../../../core/constants/page.constant';
import { OrganizationModel } from 'src/app/core/models/organization.model';
import { IntegrationService } from 'src/app/core/services/integration.service';

@Component({
  selector: 'app-integration-list',
  templateUrl: './integration-list.component.html',
  styleUrls: ['./integration-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IntegrationListComponent {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // displayedColumns: string[] = ['type', 'name', 'partner', 'locationName', 'apiKey', 'status', 'actions'];
  displayedColumns: string[] = [ 'name', 'portName', 'apiKey', 'actions'];
  dataSource: any[] = [];
  originalSource: any[] = [];
  appliedFilters: any = {};
  pageSettings: PageSettingsModel = {...defaultPageSettings};
  locationId: number;
  portId: string | null;

  constructor(private readonly dialogService: MatDialog, 
              private readonly snackBar: MatSnackBar,
              private readonly cd: ChangeDetectorRef,
              private readonly organizationService: OrganizationService,
              private readonly integrationService: IntegrationService) {}

  ngOnInit(): void {
    this.retrieveIntegrations()
    this.subscribeForOrganizationChanges();
  }

  retrieveIntegrations(): void {
    let data = {
      "start": 0,
      "length": 0,
      "filters": ["", "", "", "", "", ""],
      "order": [{ "dir": "DESC", "column": 0 }]
    }
    this.integrationService.pagination(data).subscribe(response => {
      this.dataSource = response.items;
      this.originalSource = response.items;
      // this.length = response.noTotal;
      this.isLoading$.next(false);
      this.cd.detectChanges();
    })
    // this.integrationService.list({...this.appliedFilters, ...this.pageSettings }).subscribe({
    //     next: (response: IntegrationModel[]) => {
    //       this.dataSource = response;
    //       this.originalSource = response;
    //       this.isLoading$.next(false);
    //     }, 
    //     error: (body) => {
    //   handleError(this.snackBar, body, this.isLoading$);
    // }})
  }

  openDeleteModal(integration: any) {
    this.dialogService.open(IntegrationDeleteModalComponent, {
      disableClose: true,
      data: integration.name
    }).afterClosed()
      .subscribe({
        next: (isDelete: boolean) => {
          if (isDelete) {
            this.isLoading$.next(true);
            this.integrationService.delete(<number>integration.id).subscribe({
              next: () => {
              this.retrieveIntegrations();
              this.snackBar.open('Integration deleted!', 'Success', {
                duration: 3000,
                horizontalPosition: 'center',
                panelClass: ['success-snackbar'],
                verticalPosition: 'top',
              })
            }, error: (body: any) => {
              handleError(this.snackBar, body, this.isLoading$);
            }})
          }
        }
      });
  }

  applyFilter(target: any, column: string): void {
    if (target.value) {
      this.appliedFilters[column] = target.value;
    } else {
      delete this.appliedFilters[column];
    }

    this.dataSource = this.originalSource.filter((el: any) => {
      if (Object.keys(this.appliedFilters).length) {
        let expression = false;
        for (let filter in this.appliedFilters) {
          expression = el[filter]?.toLowerCase().includes(this.appliedFilters[filter].toLowerCase())
          if (!expression) break;
        }

        return expression;
      }

      if (!target.value) return true;

      return el[column].toLowerCase().includes(target.value.toLowerCase());
    });
  }

  subscribeForOrganizationChanges(): void {
    this.organizationService.organization.subscribe((response: OrganizationModel | null) => {
      if (response && response.locationId != this.locationId) {
        this.isLoading$.next(true);
        this.retrieveIntegrations();
      }
    })
  }

  showNotificationAPIKey() {
    this.snackBar.open('API Key copied successfully', 'Success', {
      duration: 3000,
      horizontalPosition: 'center',
      panelClass: ['success-snackbar'],
      verticalPosition: 'top',
    })
  }
}
