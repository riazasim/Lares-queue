import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { OperationModel } from 'src/app/core/models/operation.model';
import { OperationService } from 'src/app/core/services/operation.service';
import { compare } from 'src/app/shared/utils/sort.function';
import { OperationsDeleteModalComponent } from '../operations-delete-modal/operations-delete-modal.component';
import { BehaviorSubject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
    selector: 'app-operations-list',
    templateUrl: './operations-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OperationsListComponent {
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    displayedColumns = ['name', 'allocatedTime', 'description', 'actions'];
    dataSource: OperationModel[] = [];
    originalSource: OperationModel[] = [];
    appliedFilters: any = {};
    pageIndex: number;
    pageSize: number;
    length: number;
    pageSizeOptions: number[] = [5, 10, 12, 15];

    constructor(private readonly dialogService: MatDialog,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly operationService: OperationService,
        private readonly cd: ChangeDetectorRef) {
        this.retrieveOperations();
    }

    openDeleteModal(id: number) {
        this.dialogService.open(OperationsDeleteModalComponent, {
            disableClose: true,
            data: {}
        }).afterClosed()
            .subscribe({
                next: (isDelete: boolean) => {
                    if (isDelete) {
                        this.isLoading$.next(true);
                        this.operationService.delete(id).subscribe(() => {
                            this.retrieveOperations();
                        });
                    }
                }
            });
    }

    applyFilter(target: any, column: string): void {
        if (typeof target.value !== 'object' && (target.value || typeof target.value === 'boolean')) {
            this.appliedFilters[column] = target.value;
        } else {
            delete this.appliedFilters[column];
        }

        this.dataSource = this.originalSource.filter((el: any) => {
            if (Object.keys(this.appliedFilters).length) {
                let expression = false;
                for (let filter in this.appliedFilters) {
                    expression = (typeof el[filter] !== 'string' ? el[filter] + '' : el[filter]).toLowerCase().includes(this.appliedFilters[filter].toLowerCase());
                    if (!expression) break;
                }

                return expression;
            }
            if (!target.value) return true;

            return typeof el[column] !== 'string' ? el[column] + '' : el[column].toLowerCase().includes(target.value.toLowerCase())
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
                case 'allocatedTime': return compare(a.allocatedTime, b.allocatedTime, isAsc);
                case 'description': return compare(a.description, b.description, isAsc);
                default: return 0;
            }
        });
    }

    retrieveOperations(): void {
        this.pageIndex = 0;
        this.pageSize = 5;

        let data = {
            "start": this.pageIndex,
            "length": this.pageSize,
            "filters": ["", "", "", ""],
            "order": [{ "dir": "DESC", "column": 0 }]
        }
        this.operationService.pagination(data).subscribe(response => {
            this.dataSource = response.items;
            this.originalSource = response.items;
            this.length = response.noTotal;
            this.isLoading$.next(false);
        });
    }

    onPaginateChange(event: PageEvent) {
        this.isLoading$.next(true);
        let data={
          "start": event.pageIndex ? event.pageIndex * event.pageSize : event.pageIndex,

            "length": event.pageSize,
            "filters": ["","","","","",""],
            "order": [{"dir": "DESC", "column": 0}]
        }
        this.operationService.pagination(data).subscribe(response => {
            this.dataSource = response.items;
            this.originalSource = response.items;
            this.isLoading$.next(false);
        })
    }

    redirectAddOperation(): void {
        this.router.navigate(['../add'], { relativeTo: this.route });
    }
}
