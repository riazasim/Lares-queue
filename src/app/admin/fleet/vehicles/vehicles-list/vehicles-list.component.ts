import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, skip, startWith, switchMap } from "rxjs";
import { faStar } from "@fortawesome/pro-solid-svg-icons";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSort, Sort } from "@angular/material/sort";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { VehiclesDeleteModalComponent } from "../vehicles-delete-modal/vehicles-delete-modal.component";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { VehicleModel } from 'src/app/core/models/vehicle.model';
import { VehicleService } from 'src/app/core/services/vehicle.service';
import { compare } from 'src/app/shared/utils/sort.function';

@Component({
  selector: 'app-vehicles-list',
  templateUrl: './vehicles-list.component.html',
  styleUrl: './vehicles-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehiclesListComponent implements OnInit {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  displayedColumns: string[] = ['licensePlate', 'type', 'status', 'loadingCapacity', 'actions'];
  VehicleTypeEnum: string[] = ['Truck', 'Trailer'];
  faStarSolid: IconProp = <IconProp>faStar;
  dataSource: VehicleModel[] = [];
  originalSource: VehicleModel[] = [];
  appliedFilters: any = {};

  pageSizeOptions: number[] = [5, 10, 12, 15];
  pageIndex: number;
  pageSize: number;
  length: number;




  constructor(private readonly dialogService: MatDialog,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly vehiclesService: VehicleService) {
    this.retrieveVehicles();
  }

  ngOnInit(): void {
  }


  filterByStatus(event: any): void {
    this.isLoading$.next(true);
    //alert(event.target.value);
    if (!event.target.value) {
      this.dataSource = [...this.originalSource];

    } else {
      //alert(event.target.value)
      this.dataSource = this.originalSource.filter((el: any) => { return String(el.status).includes(event.target.value) });
    }
    this.isLoading$.next(false);
  }




  filterByType(event: any): void {
    this.isLoading$.next(true);
    //alert(event.target.value);
    if (!event.target.value) {
      this.dataSource = [...this.originalSource];
    } else {
      this.dataSource = this.originalSource.filter((el: any) => { return el.type.includes(event.target.value) });
    }
    this.isLoading$.next(false);
  }

  openDeleteModal(id: number): void {
    this.dialogService.open(VehiclesDeleteModalComponent, {
      disableClose: true,
      data: {}
    }).afterClosed()
      .subscribe({
        next: (isDelete: boolean) => {
          if (isDelete) {
            this.isLoading$.next(true);
            this.vehiclesService.delete(id).subscribe(() => {
              this.retrieveVehicles();
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
        case 'licensePlate': return compare(a.license_plate, b.licensePlate, isAsc);
        case 'type': return compare(a.type, b.type, isAsc);
        case 'status': return compare(a.status, b.status, isAsc);
        case 'loadingCapacity': return compare(a.loading_capacity, b.loadingCapacity, isAsc);
        default: return 0;
      }
    });
  }

  retrieveVehicles(): void {

    this.pageIndex = 0;
    this.pageSize = 5;

    let data = {
      "start": this.pageIndex,
      "length": this.pageSize,
      "filters": ["", "", "", "", ""],//["firstname/lastname", "status", "role", "phone", "email"]
      "order": [{ "dir": "DESC", "column": 0 }]
    }
    this.vehiclesService.pagination(data).subscribe(response => {
      //console.log(response)
      // let result =(<any>response.items).map(((c: CustomFieldData) => c.attributes));
      this.dataSource = response.items;
      this.originalSource = response.items;
      this.length = response.noTotal;
      this.isLoading$.next(false);
      //console.log(this.originalSource)
    })
  }

  onPaginateChange(event: PageEvent) {
    this.isLoading$.next(true);
    let data = {
      "start": event.pageIndex ? event.pageIndex * event.pageSize : event.pageIndex,
      "length": event.pageSize,
      "filters": ["", "", "", "", ""],//["firstname/lastname", "status", "role", "phone", "email"]
      "order": [{ "dir": "DESC", "column": 0 }]
    }
    this.vehiclesService.pagination(data).subscribe(response => {
      // let result =(<any>response.items).map(((c: CustomFieldData) => c.attributes));
      // console.log('Api call')
      this.dataSource = response.items;
      this.originalSource = response.items;
      this.isLoading$.next(false);
    })
  }

  // retrieveVehicles(): void {
  //   let data={
  //     "start": 0,
  //     "length": 0,
  //     "filters": ["","","","","",""],//["firstname/lastname", "status", "role", "phone", "email"]
  //     "order": [{"dir": "DESC", "column": 0}]
  //   }
  //   this.vehiclesService.list(data).subscribe(response => {
  //     console.log('Log',response);
  //     this.dataSource = response;
  //     this.originalSource = response;
  //     this.isLoading$.next(false);
  //   })
  // }

  redirectAddVehicle(): void {
    this.router.navigate(['../add'], { relativeTo: this.route });
  }

  // ---------------------------------------------------------------






  // getTableData$(pageNumber: Number, pageSize: Number) {
  //     let data={
  //         "start": 0,
  //         "length": 0,
  //         "filters": ["","","","","",""],//["firstname/lastname", "status", "role", "phone", "email"]
  //         "order": [{"dir": "DESC", "column": 0}]
  //     }
  //
  //     return this.vehiclesService.pagination(pageNumber, pageSize);
  //     // return this.vehiclesService.pagination(pageNumber, pageSize);
  // }
  //
  //

  // private paginator: MatPaginator;
  // private sort: MatSort;
  //
  // @ViewChild(MatSort) set matSort(ms: MatSort) {
  //     this.sort = ms;
  //     this.setDataSourceAttributes();
  // }
  //
  // @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
  //     this.paginator = mp;
  //     this.setDataSourceAttributes();
  // }
  //
  // setDataSourceAttributes() {
  //     this.dataSource1.paginator = this.paginator;
  //     this.dataSource1.sort = this.sort;
  //
  //     if (this.paginator && this.sort) {
  //         alert('working');
  //         this.applyFilter1('');
  //     }
  // }
  //
  // applyFilter1(filterValue: string) {
  //     filterValue = filterValue.trim(); // Remove whitespace
  //     filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
  //     this.dataSource1.filter = filterValue;
  // }




}
