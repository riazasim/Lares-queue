import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageModel } from 'src/app/core/models/message.model';
import { MessageService } from 'src/app/core/services/message.service';
import { compare } from 'src/app/shared/utils/sort.function';
import { MessageTemplateDeleteModalComponent } from '../message-template-delete-modal/message-template-delete-modal.component';
import { BehaviorSubject } from 'rxjs';
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-message-template-list',
  templateUrl: './message-template-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageTemplateListComponent {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  displayedColumns = ['name', 'message', 'requiresResponseBit', 'actions'];
  dataSource: MessageModel[] = []
  originalSource: MessageModel[] = []
  appliedFilters: any = {}


  pageSizeOptions: number[] = [5, 10, 12, 15];
  pageIndex: number;
  pageSize: number;
  length: number;


  constructor(private readonly dialogService: MatDialog,
    private readonly router: Router,
              private readonly route: ActivatedRoute,
              private readonly messageService: MessageService,
              private readonly cd: ChangeDetectorRef) {
                this.retrieveTemplates();
               }

  openDeleteModal(id: number) {
    this.dialogService.open(MessageTemplateDeleteModalComponent, {
      disableClose: true,
      data: {}
    }).afterClosed()
      .subscribe({
        next: (isDelete: boolean) => {
          if (isDelete) {
            this.isLoading$.next(true);
            this.messageService.delete(id).subscribe(() => {
              this.retrieveTemplates();
            })
          }
        }
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
        case 'message': return compare(a.message, b.message, isAsc);
        case 'requiresResponseBit': return compare(a.requiresResponseBit, b.requiresResponseBit, isAsc);
        default: return 0;
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
              expression = el[filter].toLowerCase().includes(this.appliedFilters[filter].toLowerCase());
              break;
          }
          if (!expression) break;
        }

        return expression && el[column].toLowerCase().includes(target.value.toLowerCase());
      }

      return el[column].toLowerCase().includes(target.value.toLowerCase());
    });
  }

  filterByRequiresResponse(event: any): void {
    this.isLoading$.next(true);
    switch(event.target.value) {
      case 'true':
        this.appliedFilters['requiresResponseBit'] = true;
        this.dataSource = this.bindAppliedFilter(true);
        break;
      case 'false':
        this.appliedFilters['requiresResponseBit'] = false;
        this.dataSource = this.bindAppliedFilter(false);
        break;
      default:
        delete this.appliedFilters['requiresResponseBit'];
        this.dataSource = this.bindAppliedFilter(false, true);
        break;
    }
    this.isLoading$.next(false);
  }

  bindAppliedFilter(requiresResponseBit: boolean, ignoreStatus = false): any[] {
    if (Object.keys(this.appliedFilters).length) {
      return this.originalSource.filter((el: any) => {
          let expression = false;
          for (let filter in this.appliedFilters) {
            switch(typeof this.appliedFilters[filter]) {
              case 'boolean':
                expression = el[filter] === this.appliedFilters[filter];
                break;
              default:
                expression = el[filter].toLowerCase().includes(this.appliedFilters[filter].toLowerCase());
                break;
            }
            if (!expression) break;
          }

          return ignoreStatus ? expression : expression && !!el.requiresResponseBit === requiresResponseBit;
      });
    }

    return ignoreStatus ? this.originalSource.slice() : this.originalSource.filter(el => !!el.requiresResponseBit === requiresResponseBit);
  }

  // retrieveTemplates(): void {
  //   this.messageService.list({}).subscribe((response: MessageModel[]) => {
  //     this.dataSource = response;
  //     this.originalSource = response;
  //     this.cd.markForCheck();
  //     this.isLoading$.next(false);
  //   })
  // }


  retrieveTemplates(): void {

    this.pageIndex=0;
    this.pageSize=5;

    let data={
      "start": this.pageIndex,
      "length": this.pageSize,
      "filters": ["","","","","",""],//["firstname/lastname", "status", "role", "phone", "email"]
      "order": [{"dir": "DESC", "column": 0}]
    }
    this.messageService.pagination(data).subscribe(response => {
      //console.log(response)
      // let result =(<any>response.items).map(((c: CustomFieldData) => c.attributes));
      this.dataSource = response.items;
      this.originalSource = response.items;
      this.length=response.noTotal;
      this.cd.markForCheck();
      this.isLoading$.next(false);
      //console.log(this.originalSource)
    })
  }

  onPaginateChange(event: PageEvent) {
    this.isLoading$.next(true);
    //  console.log("API call");
    let data={
      "start": event.pageIndex ? event.pageIndex * event.pageSize : event.pageIndex,

      "length": event.pageSize,
      "filters": ["","","","","",""],//["firstname/lastname", "status", "role", "phone", "email"]
      "order": [{"dir": "DESC", "column": 0}]
    }
    this.messageService.pagination(data).subscribe(response => {
      // let result =(<any>response.items).map(((c: CustomFieldData) => c.attributes));
      // console.log('Api call')
      this.dataSource = response.items;
      this.originalSource = response.items;
      this.isLoading$.next(false);
    })
  }

  redirectAddMessage(): void {
    this.router.navigate(['../add'], { relativeTo: this.route });
  }
}
