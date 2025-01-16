import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faStar } from '@fortawesome/pro-solid-svg-icons';
import { PartnerModel } from 'src/app/core/models/partner.model';
import { PartnerService } from 'src/app/core/services/partner.service';
import { compare } from 'src/app/shared/utils/sort.function';
import { PartnersDeleteModalComponent } from '../partners-delete-modal/partners-delete-modal.component';
import { BehaviorSubject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-partners-list',
  templateUrl: './partners-list.component.html',
  styleUrl: './partners-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PartnersListComponent implements OnInit {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  displayedColumns = ['name', 'status', 'addrCountry', 'contactPhone', 'contactEmail', 'actions'];
  faStarSolid: IconProp = <IconProp>faStar;
  dataSource: PartnerModel[] = []
  originalSource: PartnerModel[] = []
  appliedFilters: any = {};
  pageSizeOptions: number[] = [5, 10, 12, 15];
  pageIndex: number;
  pageSize: number;
  length: number;
  constructor(private readonly dialogService: MatDialog,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly partnerService: PartnerService) {
  }

  ngOnInit(): void {
    this.retrievePartners()
  }

  openDeleteModal(id: number): void {
    this.dialogService.open(PartnersDeleteModalComponent, {
      disableClose: true,
      data: {}
    }).afterClosed()
      .subscribe({
        next: (isDelete: boolean) => {
          if (isDelete) {
            this.isLoading$.next(true);
            this.partnerService.delete(id).subscribe(() => {
              this.retrievePartners();
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

  filterByStatus(event: any): void {
    this.isLoading$.next(true);
    if (!event.target.value) {
      this.dataSource = [...this.originalSource];
    } else {
      this.dataSource = this.originalSource.filter((el: any) => { return String(el.status).includes(event.target.value) });
    }
    this.isLoading$.next(false);
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
          switch (typeof this.appliedFilters[filter]) {
            case 'boolean':
              expression = el[filter] === this.appliedFilters[filter];
              break;
            default:
              expression = el[filter].toLowerCase().includes(this.appliedFilters[filter].toLowerCase())
              break;
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
        case 'type': return compare(a.type, b.type, isAsc);
        case 'status': return compare(a.status, b.status, isAsc);
        case 'address': return compare(a.address, b.address, isAsc);
        case 'phone': return compare(a.phone, b.phone, isAsc);
        case 'email': return compare(a.email, b.email, isAsc);
        default: return 0;
      }
    });
  }

  retrievePartners(): void {
    this.isLoading$.next(true);
    this.pageIndex = 0;
    this.pageSize = 5;

    let data = {
      "start": this.pageIndex,
      "length": this.pageSize,
      "filters": ["", "", "", "", ""],
      "order": [{ "dir": "DESC", "column": 0 }]
    }

    this.partnerService.pagination(data).subscribe((response) => {
      this.dataSource = response.items;
      this.originalSource = response.items;
      this.length = response.noTotal;
      this.isLoading$.next(false);
    });
  }
  onPaginateChange(event: PageEvent) {
    this.isLoading$.next(true);
    let data = {
      "start": event.pageIndex ? event.pageIndex * event.pageSize : event.pageIndex,

      "length": event.pageSize,
      "filters": ["", "", "", "", "", ""],//["firstname/lastname", "status", "role", "phone", "email"]
      "order": [{ "dir": "DESC", "column": 0 }]
    }
    this.partnerService.pagination(data).subscribe(response => {
      this.dataSource = response.items;
      this.originalSource = response.items;
      this.isLoading$.next(false);
    })
  }

  redirectAddPartner(): void {
    this.router.navigate(['../add'], { relativeTo: this.route });
  }
}
