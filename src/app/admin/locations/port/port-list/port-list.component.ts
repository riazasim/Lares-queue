import { ChangeDetectionStrategy,  Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { UserModel } from 'src/app/core/models/user.model';
import { compare } from 'src/app/shared/utils/sort.function';
import { BehaviorSubject } from 'rxjs';
import { NativeResponseWrapper } from 'src/app/core/models/response-wrappers.types';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from "@angular/material/paginator";
import { MicroService } from 'src/app/core/services/micro.service';

@Component({
    selector: 'app-port-list',
    templateUrl: './port-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortListComponent {
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    displayedColumns = ['name', 'addrCounty', 'addrCity', 'addrCountry', 'addrZipCode', 'addrCoordinates'];
    dataSource: any[] = []
    originalSource: any[] = [];
    appliedFilters: any = {};
    data: any;
    pageSizeOptions: number[] = [5, 10, 12, 15];
    pageIndex: number;
    pageSize: number;
    length: number;

    constructor(
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly snackBar: MatSnackBar,
        private readonly microService: MicroService) {
        this.retrieveUsers();
    }

    // openDeleteModal(id: number) {
    //     this.dialogService.open(UsersDeleteModalComponent, {
    //         disableClose: true,
    //         data: {}
    //     }).afterClosed()
    //         .subscribe({
    //             next: (isDelete: boolean) => {
    //                 if (isDelete) {
    //                     this.isLoading$.next(true);
    //                     this.userService.delete(id).subscribe({
    //                         next: () => {
    //                             this.retrieveUsers();
    //                         },
    //                         error: (error) => {
    //                             this.isLoading$.next(false);
    //                             this.handleError(error);
    //                         }
    //                     });
    //                 }
    //             }
    //         });
    // }

    handleError(body: NativeResponseWrapper<UserModel>): void {
        if (body.code === 400) {
            for (let prop in body.error.form) {
                this.snackBar.open('Error!', (<any>body.error.form)[prop], {
                    duration: 3000,
                    horizontalPosition: 'end',
                    panelClass: ['error-snackbar'],
                    verticalPosition: 'bottom',
                })
            }
        } else {
            this.snackBar.open('Error!', body.error.detail, {
                duration: 3000,
                horizontalPosition: 'end',
                panelClass: ['error-snackbar'],
                verticalPosition: 'bottom',
            })
        }
    }

    filterByStatus(event: any): void {
        this.isLoading$.next(true);
        //alert(event.target.value);
        if (!event.target.value) {
            this.dataSource = [...this.originalSource];
        } else {
            this.dataSource = this.originalSource.filter((el: any) => { return String(el.user.status).includes(event.target.value) });
        }
        this.isLoading$.next(false);
    }

    filterByRole(event: any): void {
        // alert(event.target.value);
        this.isLoading$.next(true);
        if (!event.target.value) {
            this.dataSource = [...this.originalSource];
        } else {
            this.dataSource = this.originalSource.filter((el: any) => { return el.user.userRole.includes(event.target.value) });
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
                    if (el[filter] === null) {
                        continue
                    }
                    else {
                        if (filter === 'fullName') {
                            expression = el.userSetting['firstName'].toLowerCase().includes(this.appliedFilters[filter].toLowerCase()) || el.userSetting['lastName'].toLowerCase().includes(this.appliedFilters[filter].toLowerCase());
                        }
                        else if (filter === 'email') {
                            expression = el.user[filter].toLowerCase().includes(this.appliedFilters[filter].toLowerCase());
                        }
                        else {
                            expression = el[filter].toLowerCase().includes(this.appliedFilters[filter].toLowerCase());
                        }
                    }
                    if (!expression) break;
                }

                return expression;
            }

            if (column === 'fullName') {
                return el.userSetting['firstName'].toLowerCase().includes(target.value.toLowerCase()) || el.userSetting['lastName'].toLowerCase().includes(target.value.toLowerCase());
            }
            else if (column === 'email') {
                return el.user[column].toLowerCase().includes(target.value.toLowerCase());
            }
            else {
                return el[column].toLowerCase().includes(target.value.toLowerCase());
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
                case 'type': return compare(a.type, b.type, isAsc);
                case 'addrCounty': return compare(a?.addrCounty, b?.addrCounty, isAsc);
                case 'addrCity': return compare(a?.addrCity, b?.addrCity, isAsc);
                case 'addrCountry': return compare(a?.addrCountry, b?.addrCountry, isAsc);
                case 'addrZipCode': return compare(a?.addrZipCode, b?.addrZipCode, isAsc);
                case 'addrCoordinates': return compare(a?.addrCoordinates, b?.addrCoordinates, isAsc);
                default: return 0;
            }
        });
    }

    redirectAddUser(): void {
        this.router.navigate(['../add'], { relativeTo: this.route });
    }

    retrieveUsers(): void {
        this.pageIndex = 0;
        this.pageSize = 5;

        let data = {
            "start": this.pageIndex,
            "length": this.pageSize,
            "filters": ["", "", "", "", ""],
            "order": [{ "dir": "DESC", "column": 0 }]
        }

        this.microService.paginatePorts(data).subscribe((response) => {
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
        this.microService.paginatePorts(data).subscribe(response => {
            this.dataSource = response.items;
            this.originalSource = response.items;
            this.isLoading$.next(false);
        })
    }
}
