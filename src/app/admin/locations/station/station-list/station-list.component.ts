import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faStar } from '@fortawesome/pro-solid-svg-icons';
import { compare } from 'src/app/shared/utils/sort.function';
import { StationDeleteModalComponent } from '../station-delete-modal/station-delete-modal.component';
import { BehaviorSubject } from 'rxjs';
import { StationService } from 'src/app/core/services/stations.service';
import { StationModel } from 'src/app/core/models/station.model';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-station-list',
  templateUrl: './station-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StationListComponent implements OnInit {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  displayedColumns = ['name', 'type', 'addrCounty', 'addrCity', 'addrCountry', 'addrZipCode', 'contact', 'actions'];
  faStarSolid: IconProp = <IconProp>faStar;
  dataSource: StationModel [] = []
  originalSource: StationModel[] = []
  appliedFilters: any = {};
  pageSizeOptions: number[] = [5, 10, 12, 15];
  pageIndex: number;
  pageSize: number;
  length: number;
  constructor(private readonly dialogService: MatDialog,
              private readonly router: Router,
              private readonly route: ActivatedRoute,
              private readonly stationService: StationService) {
               }

  ngOnInit(): void {
    this.retrieveStations()
  }

  openDeleteModal(id: number): void {
    this.dialogService.open(StationDeleteModalComponent, {
      disableClose: true,
      data: {}
    }).afterClosed()
      .subscribe({
        next: (isDelete: boolean) => {
          if (isDelete) {
            this.isLoading$.next(true);
            this.stationService.delete(id).subscribe(() => {
              this.retrieveStations();
            })
          }
        }
      });
  }

  filterByType(event: any): void {
    this.isLoading$.next(true);
    if (!event.target.value) {
        this.dataSource = [...this.originalSource];
    } else {
        this.dataSource = this.originalSource.filter((el: any) => { return String(el.type).includes(event.target.value) });
    }
    this.isLoading$.next(false);
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

    this.dataSource = data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'type': return compare(a.type, b.type, isAsc);
        default: return 0;
      }
    });
  }

  retrieveStations(): void {
    this.pageIndex = 0;
    this.pageSize = 5;

    let data = {
      "start": this.pageIndex,
      "length": this.pageSize,
      "filters": ["", "", "", "", ""],
      "order": [{ "dir": "DESC", "column": 0 }]
    }
    this.stationService.pagination(data).subscribe(response => {
      this.dataSource = response.items;
      this.originalSource = response.items;
      this.length = response.noTotal;
      this.isLoading$.next(false);
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
    this.stationService.pagination(data).subscribe(response => {
        this.dataSource = response.items;
        this.originalSource = response.items;
        this.isLoading$.next(false);
    })
}

  redirectAddStation(): void {
    this.router.navigate(['../add'], { relativeTo: this.route });
  }
}
