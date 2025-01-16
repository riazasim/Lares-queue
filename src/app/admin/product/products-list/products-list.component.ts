import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { faStar } from "@fortawesome/pro-solid-svg-icons";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { Sort } from "@angular/material/sort";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { PageEvent } from "@angular/material/paginator";
import { compare } from 'src/app/shared/utils/sort.function';
import { ProductsDeleteModalComponent } from '../products-delete-modal/products-delete-modal.component';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsListComponent implements OnInit {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  displayedColumns: string[] = ['productCode','name', 'type','actions'];
  faStarSolid: IconProp = <IconProp>faStar;
  dataSource: any[] = [];
  originalSource: any[] = [];
  appliedFilters: any = {};

  pageSizeOptions: number[] = [5, 10, 12, 15];
  pageIndex: number;
  pageSize: number;
  length: number;

  constructor(private readonly dialogService: MatDialog,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly productService: ProductService,) {
    this.retrieveProducts();
  }

  ngOnInit(): void {
  }


  openDeleteModal(id: number): void {
    this.dialogService.open(ProductsDeleteModalComponent, {
      disableClose: true,
      data: {}
    }).afterClosed()
      .subscribe({
        next: (isDelete: boolean) => {
          if (isDelete) {
            this.isLoading$.next(true);
            this.productService.delete(id).subscribe(() => {
              this.retrieveProducts();
            })
          }
        }
      });
  }

  applyFilter(target: any, column: any, isMultipleSearch = false): void {
    if (target.value) {
      if (isMultipleSearch) {
        this.appliedFilters['name'] = target.value;
        this.appliedFilters['code'] = target.value;
        this.appliedFilters['type'] = target.value;
      } else {
        this.appliedFilters[column] = target.value;
      }
    } else {
      if (isMultipleSearch) {
        delete this.appliedFilters['name']
        delete this.appliedFilters['code']
        delete this.appliedFilters['type']
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
        case 'code': return compare(a.code, b.code, isAsc);
        case 'name': return compare(a.name, b.name, isAsc);
        case 'type': return compare(a.type, b.type, isAsc);
        default: return 0;
      }
    });
  }

  retrieveProducts(): void {

    this.pageIndex = 0;
    this.pageSize = 5;

    let data = {
      "start": this.pageIndex,
      "length": this.pageSize,
      "filters": ["", "", "", "", ""],
      "order": [{"dir": "DESC", "column": 0}]
    }
    this.productService.pagination(data).subscribe(response => {
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
      "order": [{"dir": "DESC", "column": 0}]
    }
    this.productService.pagination(data).subscribe(response => {
      this.dataSource = response.items;
      this.originalSource = response.items;
      this.isLoading$.next(false);
    })
  }
  redirectAddProduct(): void {
    this.router.navigate(['../add'], { relativeTo: this.route });
  }

}
