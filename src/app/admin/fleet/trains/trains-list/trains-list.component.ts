import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { faStar } from "@fortawesome/pro-solid-svg-icons";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { Sort } from "@angular/material/sort";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { PageEvent } from "@angular/material/paginator";
import { compare } from 'src/app/shared/utils/sort.function';
import { TrainsDeleteModalComponent } from '../trains-delete-modal/trains-delete-modal.component';
import { TrainsService } from 'src/app/core/services/trains.service';
import { TrainModel } from 'src/app/core/models/trains.model';

@Component({
  selector: 'app-trains-list',
  templateUrl: './trains-list.component.html',
  styleUrl: './trains-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainsListComponent implements OnInit {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  displayedColumns: string[] = ['name', 'registrationNumber', 'type', 'status', 'actions'];
  TrainTypeEnum: string[] = ['GOODS', 'PASSENGER'];
  faStarSolid: IconProp = <IconProp>faStar;
  dataSource: TrainModel[] = [];
  originalSource: TrainModel[] = [];
  appliedFilters: any = {};

  pageSizeOptions: number[] = [5, 10, 12, 15];
  pageIndex: number;
  pageSize: number;
  length: number;

  constructor(private readonly dialogService: MatDialog,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly trainsService: TrainsService) {
    this.retrieveTrains();
  }

  ngOnInit(): void {
  }

  filterByStatus(event: any): void {
    this.isLoading$.next(true);
    if (!event.target.value) {
      this.dataSource = [...this.originalSource];

    } else {
      this.dataSource = this.originalSource.filter((el: any) => { return String(el.status).includes(event.target.value) });
    }
    this.isLoading$.next(false);
  }


  filterByType(event: any): void {
    this.isLoading$.next(true);
    if (!event.target.value) {
      this.dataSource = [...this.originalSource];
    } else {
      this.dataSource = this.originalSource.filter((el: any) => { return el.type.includes(event.target.value) });
    }
    this.isLoading$.next(false);
  }

  openDeleteModal(id: number): void {
    this.dialogService.open(TrainsDeleteModalComponent, {
      disableClose: true,
      data: {}
    }).afterClosed()
      .subscribe({
        next: (isDelete: boolean) => {
          if (isDelete) {
            this.isLoading$.next(true);
            this.trainsService.delete(id).subscribe(() => {
              this.retrieveTrains();
            })
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
          if (el[filter] === null) {
            continue
          }
          else {
            expression = el[filter].toLowerCase().includes(this.appliedFilters[filter].toLowerCase());
          }
          if (!expression) break;
        }

        return expression;
      }

      if (!target.value) return true;

      return el[column] + ''.toLowerCase().includes(target.value.toLowerCase());
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
        case 'registrationNumber': return compare(a.registrationNumber, b.registrationNumber, isAsc);
        case 'type': return compare(a.type, b.type, isAsc);
        case 'status': return compare(a.status, b.status, isAsc);
        default: return 0;
      }
    });
  }

  retrieveTrains(): void {

    this.pageIndex = 0;
    this.pageSize = 5;

    let data = {
      "start": this.pageIndex,
      "length": this.pageSize,
      "filters": ["", "", "", "", ""],
      "order": [{ "dir": "DESC", "column": 0 }]
    }
    this.trainsService.pagination(data).subscribe(response => {
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
    this.trainsService.pagination(data).subscribe(response => {
      this.dataSource = response.items;
      this.originalSource = response.items;
      this.isLoading$.next(false);
    })
  }

  redirectAddTrain(): void {
    this.router.navigate(['../add'], { relativeTo: this.route });
  }
}
