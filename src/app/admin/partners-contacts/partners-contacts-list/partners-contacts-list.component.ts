import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { PartnerContactModel } from 'src/app/core/models/partner-contact.model';
import { PartnerContactService } from 'src/app/core/services/partner-contact.service';
import { compare } from 'src/app/shared/utils/sort.function';
import { PartnersContactsDeleteModalComponent } from '../partners-contacts-delete-modal/partners-contacts-delete-modal.component';

@Component({
  selector: 'app-partners-contacts-list',
  templateUrl: './partners-contacts-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PartnersContactsListComponent {
  isLoading: boolean = false;
  displayedColumns = ['fullName', 'address', 'contactNumber', 'email', 'actions'];
  dataSource: PartnerContactModel[] = []
  originalSource: PartnerContactModel[] = []
  appliedFilters: any = {};
  constructor(private readonly dialogService: MatDialog,
    private readonly router: Router,
              private readonly route: ActivatedRoute,
              private readonly partnerContactService: PartnerContactService,
              private readonly cd: ChangeDetectorRef) {
                this.retrivePartnerContacts();
               }

  openDeleteModal(id: number): void {
    this.dialogService.open(PartnersContactsDeleteModalComponent, {
      disableClose: true,
      data: {}
    }).afterClosed()
      .subscribe({
        next: (isDelete: boolean) => {
          if (isDelete) {
            this.isLoading = true;
            this.partnerContactService.delete(id).subscribe(() => {
              this.retrivePartnerContacts();
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
          switch(typeof this.appliedFilters[filter]) {
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

      return el[column]+''.toLowerCase().includes(target.value.toLowerCase());
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
        case 'fullName': return compare(a.fullName, b.fullName, isAsc);
        case 'partnerType': return compare(a.partnerType, b.partnerType, isAsc);
        case 'address': return compare(a.address, b.address, isAsc);
        case 'contactNumber': return compare(a.contactNumber, b.contactNumber, isAsc);
        case 'email': return compare(a.email, b.email, isAsc);
        default: return 0;
      }
    });
  }

  retrivePartnerContacts(): void {
    this.partnerContactService.list({}).subscribe(response => {
      this.isLoading = false;
      this.dataSource = response;
      this.originalSource = response;
      this.cd.detectChanges();
    })
  }

  redirectAddMessage(): void {
    this.router.navigate(['../add'], { relativeTo: this.route });
  }
}
