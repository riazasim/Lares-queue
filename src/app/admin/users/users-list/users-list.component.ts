import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { UserModel } from 'src/app/core/models/user.model';
import { UserService } from 'src/app/core/services/user.service';
import { compare } from 'src/app/shared/utils/sort.function';
import { UsersDeleteModalComponent } from '../users-delete-modal/users-delete-modal.component';
import { BehaviorSubject, empty } from 'rxjs';
import { NativeResponseWrapper } from 'src/app/core/models/response-wrappers.types';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserRoleModel } from 'src/app/core/models/user-role.model';
import { UserRoleService } from 'src/app/core/services/user-role.service';
import { PageEvent } from "@angular/material/paginator";

@Component({
    selector: 'app-users-list',
    templateUrl: './users-list.component.html',
    styleUrl: './users-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersListComponent {
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    displayedColumns = ['fullName', 'status', 'userRole', 'phone', 'email', 'actions'];
    dataSource: UserModel[] = []
    originalSource: UserModel[] = [];
    appliedFilters: any = {};
    data: UserModel;
    pageSizeOptions: number[] = [5, 10, 12, 15];
    pageIndex: number;
    pageSize: number;
    length: number;

    constructor(private readonly dialogService: MatDialog,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly userService: UserService,
        private readonly snackBar: MatSnackBar,
        private readonly userRoleService: UserRoleService) {
        // this.retrieveRoles();
        this.retrieveUsers();
    }

    openDeleteModal(id: number) {
        this.dialogService.open(UsersDeleteModalComponent, {
            disableClose: true,
            data: {}
        }).afterClosed()
            .subscribe({
                next: (isDelete: boolean) => {
                    if (isDelete) {
                        this.isLoading$.next(true);
                        this.userService.delete(id).subscribe({
                            next: () => {
                                this.retrieveUsers();
                            },
                            error: (error) => {
                                this.isLoading$.next(false);
                                this.handleError(error);
                            }
                        });
                    }
                }
            });
    }

    // retrieveRoles(): void {
    //   this.userRoleService.list({}).subscribe((roles: UserRoleModel[]) => {
    //     this.roles = roles;
    //   })
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
                case 'fullName': return compare(a.fullName, b.fullName, isAsc);
                case 'status': return compare(a.status, b.status, isAsc);
                case 'userRole': return compare(a?.userRole, b?.userRole, isAsc);
                case 'phone': return compare(a?.phone, b?.phone, isAsc);
                case 'email': return compare(a?.email, b?.email, isAsc);
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

        this.userService.pagination(data).subscribe((response) => {
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
        this.userService.pagination(data).subscribe(response => {
            this.dataSource = response.items;
            this.originalSource = response.items;
            this.isLoading$.next(false);
        })
    }
}
