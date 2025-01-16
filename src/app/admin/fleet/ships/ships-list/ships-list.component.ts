import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { faStar } from "@fortawesome/pro-solid-svg-icons";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { Sort } from "@angular/material/sort";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { PageEvent } from "@angular/material/paginator";
import { compare } from 'src/app/shared/utils/sort.function';
import { ShipsDeleteModalComponent } from '../ships-delete-modal/ships-delete-modal.component';
import { ShipsService } from 'src/app/core/services/ships.service';
import { ShipModel } from 'src/app/core/models/ship.model';

@Component({
  selector: 'app-ships-list',
  templateUrl: './ships-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShipsListComponent implements OnInit {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  displayedColumns: string[] = ['name', 'registrationNo', 'ais', 'bargeType', 'length', 'width', 'maxDraft', 'aerialGauge', 'maxCapacity', 'actions'];
  faStarSolid: IconProp = <IconProp>faStar;
  dataSource: ShipModel[] = [];
  originalSource: ShipModel[] = [];
  appliedFilters: any = {};

  pageSizeOptions: number[] = [5, 10, 12, 15];
  pageIndex: number;
  pageSize: number;
  length: number;

  constructor(private readonly dialogService: MatDialog,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly shipsService: ShipsService) {
    this.retrieveShips();
  }

  ngOnInit(): void {
  }


  openDeleteModal(id: number): void {
    this.dialogService.open(ShipsDeleteModalComponent, {
      disableClose: true,
      data: {}
    }).afterClosed()
      .subscribe({
        next: (isDelete: boolean) => {
          if (isDelete) {
            this.isLoading$.next(true);
            this.shipsService.delete(id).subscribe(() => {
              this.retrieveShips();
            })
          }
        }
      });
  }

  applyFilter(target: any, column: any, isMultipleSearch = false): void {
    if (target.value) {
      if (isMultipleSearch) {
        this.appliedFilters['name'] = target.value;
        this.appliedFilters['length'] = target.value;
        this.appliedFilters['width'] = target.value;
        this.appliedFilters['depth'] = target.value;
      } else {
        this.appliedFilters[column] = target.value;
      }
    } else {
      if (isMultipleSearch) {
        delete this.appliedFilters['name']
        delete this.appliedFilters['length']
        delete this.appliedFilters['width']
        delete this.appliedFilters['depth']
      } else {
        delete this.appliedFilters[column];
      }
    }

    this.dataSource = this.originalSource.filter((el: any) => {
      if (Object.keys(this.appliedFilters).length) {
        let expression = false;
        if (isMultipleSearch && target.value) {
          expression =
            el['name'].toLowerCase().includes(this.appliedFilters['name'].toLowerCase()) ||
            el['length'].includes(this.appliedFilters['length']) ||
            el['width'].includes(this.appliedFilters['width']) ||
            el['depth'].includes(this.appliedFilters['depth']);

          return expression;
        } else {
          for (let filter in this.appliedFilters) {
            expression = el[filter].toString().toLowerCase().includes(this.appliedFilters[filter].toLowerCase());
            if (!expression) break;
          }

          return expression;
        }
      }

      return isMultipleSearch ? true : el[column].toString().includes(target.value);
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
        case 'registrationNo': return compare(a.registrationNo, b.registrationNo, isAsc);
        case 'ais': return compare(a.ais, b.ais, isAsc);
        case 'selfPropelled': return compare(a.selfPropelled, b.selfPropelled, isAsc);
        case 'lockType': return compare(a.lockType, b.lockType, isAsc);
        case 'length': return compare(a.length, b.length, isAsc);
        case 'width': return compare(a.width, b.width, isAsc);
        case 'maxDraft': return compare(a.maxDraft, b.maxDraft, isAsc);
        case 'aerialGauge': return compare(a.aerialGauge, b.aerialGauge, isAsc);
        case 'maxCapacity': return compare(a.maxCapacity, b.maxCapacity, isAsc);
        default: return 0;
      }
    });
  }

  retrieveShips(): void {

    this.pageIndex = 0;
    this.pageSize = 5;

    let data = {
      "start": this.pageIndex,
      "length": this.pageSize,
      "filters": ["", "", "", "", ""],
      "order": [{ "dir": "DESC", "column": 0 }]
    }
    this.shipsService.pagination(data).subscribe(response => {
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
      "filters": ["", "", "", "", ""],
      "order": [{ "dir": "DESC", "column": 0 }]
    }
    this.shipsService.pagination(data).subscribe(response => {
      this.dataSource = response.items;
      this.originalSource = response.items;
      this.isLoading$.next(false);
    })
  }
  redirectAddVehicle(): void {
    this.router.navigate(['../add'], { relativeTo: this.route });
  }

}
