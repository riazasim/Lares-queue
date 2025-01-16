import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { PlanningModel } from 'src/app/core/models/planning.model';
import { PlanningService } from 'src/app/core/services/planning.service';
import { PageEvent } from '@angular/material/paginator';
import { SchedulingDeleteModalComponent } from 'src/app/operator/scheduling/scheduling-delete-modal/scheduling-delete-modal.component';
import { Sort } from '@angular/material/sort';
import { SchedulingImportModalComponent } from 'src/app/operator/scheduling/scheduling-import-modal/scheduling-import-modal.component';

@Component({
  selector: 'app-list-status',
  templateUrl: './list-status.component.html',
  styleUrls: ['./list-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListStatusComponent {
  @Output() triggerOpenLogs: EventEmitter<{ view: string, id: number, planning: PlanningModel }> = new EventEmitter();
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  displayedColumns: string[] = ['id', 'manevre', 'vesselId', 'berth', 'products', 'estimatedTimeArrival', 'relativeTimeArrival', 'delay', 'coordinates', 'shipmentStatus'];
  dataSource: PlanningModel[] = [];
  originalSource: PlanningModel[] = [];
  appliedFilters: any = {};

  pageSizeOptions: number[] = [20];
  pageIndex: number;
  pageSize: number;
  length: number;

  constructor(private readonly dialogService: MatDialog,
      private readonly planningService: PlanningService,
      private readonly cd: ChangeDetectorRef) {
      this.retrievePlanningList();
  }


  retrievePlanningList(): void {

      this.pageIndex = 0;
      this.pageSize = 20;

      let data = {
          "start": this.pageIndex,
          "length": this.pageSize,
          "filters": ["", "", "", "", "", ""],
          "order": [{ "dir": "DESC", "column": 0 }]
      }
      this.planningService.pagination(data).subscribe((response: any) => {
          this.dataSource = response.items;
          this.originalSource = response.items;
          this.length = response.noTotal;
          this.isLoading$.next(false)
          this.cd.detectChanges();
      })
  }

  onPaginateChange(event: PageEvent) {
      this.isLoading$.next(true);
      let data = {
          "start": event.pageIndex ? event.pageIndex * event.pageSize : event.pageIndex,

          "length": event.pageSize,
          "filters": ["", "", "", "", "", ""],
          "order": [{ "dir": "DESC", "column": 0 }]
      }
      this.planningService.pagination(data).subscribe(response => {
          this.dataSource = response.items;
          this.originalSource = response.items;
          this.isLoading$.next(false);
          this.cd.detectChanges();
      })
  }

  openDeleteModal(id: number) {
      this.dialogService.open(SchedulingDeleteModalComponent, {
          disableClose: true,
          data: { "id": id, "title": "planning" }
      }).afterClosed()
          .subscribe({
              next: (isDelete: boolean) => {
                  if (isDelete) {
                      this.isLoading$.next(true);
                      this.planningService.delete(id).subscribe(() => {
                          this.retrievePlanningList();
                          this.cd.detectChanges();
                      })
                  }
              }
          });
  }

  applyFilter(target: any, column: string, isMultipleSearch = false): void {
      if (target.value) {
          if (isMultipleSearch) {
              this.appliedFilters['contactFirstName'] = target.value;
              this.appliedFilters['contactLastName'] = target.value;
              this.appliedFilters['contactPhoneRegionCode'] = target.value;
              this.appliedFilters['contactPhone'] = target.value;
              this.appliedFilters['contactEmail'] = target.value;
          } else {
              this.appliedFilters[column] = target.value;
          }
      } else {
          if (isMultipleSearch) {
              delete this.appliedFilters['contactFirstName']
              delete this.appliedFilters['contactLastName']
              delete this.appliedFilters['contactPhoneRegionCode']
              delete this.appliedFilters['contactPhone']
              delete this.appliedFilters['contactEmail']
          } else {
              delete this.appliedFilters[column];
          }
      }

      this.dataSource = this.originalSource.filter((el: any) => {
          if (Object.keys(this.appliedFilters).length) {
              let expression = false;
              if (isMultipleSearch && target.value) {
                  expression =
                      el['contactFirstName'].concat(' ', el['contactLastName']).toLowerCase().includes(this.appliedFilters['contactFirstName'].toLowerCase()) ||
                      el['contactLastName'].concat(' ', el['contactFirstName']).toLowerCase().includes(this.appliedFilters['contactLastName'].toLowerCase()) ||
                      el['contactPhoneRegionCode'].toLowerCase().includes(this.appliedFilters['contactPhoneRegionCode'].toLowerCase()) ||
                      el['contactPhone'].toLowerCase().includes(this.appliedFilters['contactPhone'].toLowerCase()) ||
                      el['contactEmail'].toLowerCase().includes(this.appliedFilters['contactEmail'].toLowerCase());

                  return expression;
              } else {
                  for (let filter in this.appliedFilters) {
                      expression = el[filter].toLowerCase().includes(this.appliedFilters[filter].toLowerCase());
                      if (!expression) break;
                  }

                  return expression;
              }
          }

          return isMultipleSearch ? true : el[column].includes(target.value);
      });
  }

  sortData(sort: Sort): void {
      const data = this.dataSource.slice();
      if (!sort.active || sort.direction === '') {
          this.dataSource = data;
          return;
      }
  }
  openImportModal(): void {
      this.isLoading$.next(true);
      this.dialogService.open(SchedulingImportModalComponent, {
          disableClose: true,
          data: {}
      }).afterClosed()
          .subscribe({
              next: (isImported) => {
                  if (isImported) {
                      this.retrievePlanningList();
                  } else {
                      this.isLoading$.next(false);
                  }
              }
          });
  }
}
