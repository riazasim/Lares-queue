import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ChangeDetectorRef, HostListener, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SchedulingImportModalComponent } from '../scheduling-import-modal/scheduling-import-modal.component';
import { SchedulingPlanModalComponent } from '../scheduling-plan-modal/scheduling-plan-modal.component';
import { PlanningService } from 'src/app/core/services/planning.service';
import { PlanningModel, UpdatePlanningDock } from 'src/app/core/models/planning.model';
import { BehaviorSubject, Subscription } from 'rxjs';
import { SchedulingDeleteModalComponent } from '../scheduling-delete-modal/scheduling-delete-modal.component';
import { MatSidenav } from '@angular/material/sidenav';
import { ComvexPlanningList } from 'src/app/core/models/scheduling.model';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { getFormattedDate } from 'src/app/shared/utils/date.functions';
import { StatusListService } from 'src/app/core/services/status-list.service';
import { StatusListModel } from 'src/app/core/models/status-list.model';
import { getTimeSlot } from '../scheduling-box.helper';
import { OperationModel } from 'src/app/core/models/operation.model';
import { SchedulingUpgradeWarningModalComponent } from '../scheduling-upgrade-warning-modal/scheduling-upgrade-warning-modal.component';
import { SchedulingCancelModalComponent } from '../scheduling-cancel-modal/scheduling-cancel-modal.component';
import { handleError } from 'src/app/shared/utils/error-handling.function';
import { OrganizationService } from 'src/app/core/services/organization.service';
import { SchedulingRejectModalComponent } from '../scheduling-reject-modal/scheduling-reject-modal.component';
import { SchedulingCheckinCheckoutModalComponent } from '../scheduling-checkin-checkout-modal/scheduling-checkin-checkout-modal.component';
import { FilterModel, FilterTypeENum } from '../scheduling-search-bar/scheduling-search-bar.component';
import { PageSettingsModel } from 'src/app/core/models/page.model';
import defaultPageSettings from '../../../core/constants/page.constant';
import { AuthService } from 'src/app/core/services/auth.service';
import { RolesService } from 'src/app/core/services/roles.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('sidenav') sidenav: MatSidenav;
    readonly isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    readonly isCardDetailsLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    readonly cardLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    readonly newCardsLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    readonly componentName$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    readonly isTableView$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    readonly isToggleOpened$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    readonly isMobileCardList$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    readonly isTimeSlotFilterMode$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    readonly editPlanning$: BehaviorSubject<PlanningModel | null> = new BehaviorSubject<PlanningModel | null>(null);
    readonly hasReachedEndPage$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    readonly sortBy$: BehaviorSubject<number> = new BehaviorSubject<number>(12);
    readonly sortOrder$: BehaviorSubject<string> = new BehaviorSubject('DESC');
    readonly isComvexReorder$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isTableLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    plannings: PlanningModel[] = []
    filterDate: any = new Date();
    filterTypeEnum = FilterTypeENum;
    userRole: string;
    transportMode: any;
    logId: number;
    logModal: string;
    planning: any;
    toggleRef: MatSnackBarRef<TextOnlySnackBar>;
    statuses: StatusListModel[] = [];
    operations: OperationModel[] = [];
    length: number;
    pageSettings: PageSettingsModel = { start: 0, length: 5 };
    appliedFilters: any = {};

    innerWidth: number;
    readonly isComvexOrganization$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    readonly isUmexOrganization$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    comvexSubscription: Subscription;
    umexSubscription: Subscription;
    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.innerWidth = window.innerWidth;
        this.applyMobileView();
    }

    constructor(private readonly dialogService: MatDialog,
        private readonly planningService: PlanningService,
        private readonly snackBar: MatSnackBar,
        private readonly statusListService: StatusListService,
        private readonly cd: ChangeDetectorRef,
        private readonly organizationService: OrganizationService,
        private readonly roleService: RolesService
    ) {
        this.getUserRole();
        this.getTransportMode();
    }

    ngOnInit(): void {
        this.retrievePlanningList();
        // this.retrieveSIDStatuses();
        this.subscribeForLocationChange(true);
        this.subscribeForSortByChanges(true);
        this.subscribeForSortOrderChanges(true);
        this.subscribeForOrganizationChanges();
    }

    ngAfterViewInit(): void {
        this.innerWidth = window.innerWidth;
        this.applyMobileView();
    }

    getUserRole() {
        this.userRole = this.roleService.getUserRoles();
        console.log(this.userRole)
    }
    getTransportMode() {
        this.transportMode = this.organizationService.getAppMode();
    }

    getCardDetails(item: any = 0) {
        this.isCardDetailsLoading$.next(true)
        if (item !== 0) {
            this.planningService.get(item.planning.id).subscribe({
                next: (res) => {
                    console.log(res)
                    this.planning = res
                    this.isCardDetailsLoading$.next(false)
                },
                error: (body) => {
                    this.isCardDetailsLoading$.next(false)
                    handleError(this.snackBar, body, this.isCardDetailsLoading$)
                }
            })
        }
    }

    subscribeForOrganizationChanges(): void {
        if (!this.comvexSubscription)
            this.comvexSubscription = this.organizationService.isComvexOrganization$.subscribe((isComvex) => {
                this.isComvexOrganization$.next(isComvex);
            })

        if (!this.umexSubscription)
            this.umexSubscription = this.organizationService.isUmexOrganization$.subscribe((isUmex) => {
                this.isUmexOrganization$.next(isUmex);
            })
    }

    subscribeForSortByChanges(isFirstLoad: boolean = false): void {
        this.sortBy$.subscribe((response) => {
            this.appliedFilters['column'] = response;
            if (!isFirstLoad) this.retrievePlanningList();
            isFirstLoad = false;
        });
    }

    subscribeForSortOrderChanges(isFirstLoad: boolean = false): void {
        this.sortOrder$.subscribe((dir) => {
            this.appliedFilters['dir'] = dir;
            if (!isFirstLoad) this.retrievePlanningList();
            isFirstLoad = false;
        });
    }

    setTimeSlotFilterMode(event: { key: FilterModel, value: string }): void {
        if (!event.value) {
            this.isTimeSlotFilterMode$.next(false);
        } else {
            this.isTimeSlotFilterMode$.next(true);
        }
        this.setSingleSearchFilter(event);
    }

    setSingleSearchFilter(event: { key: FilterModel, value: string }): void {
        this.isLoading$.next(true);
        let key;

        if (event.key.prev) {
            let prev;
            switch (event.key.prev) {
                case FilterTypeENum.sId: prev = 'sId'; break;
                case FilterTypeENum.truckLicensePlateFront: prev = 'truckLicensePlateFront'; break;
                case FilterTypeENum.truckLicensePlateBack: prev = 'truckLicensePlateBack'; break;
                case FilterTypeENum.dockName: prev = 'dockName'; break;
                case FilterTypeENum.status: prev = 'status'; break;
                case FilterTypeENum.timeSlot: prev = 'timeSlot'; break;
            }
            delete this.appliedFilters[prev];
        }

        switch (event.key.curr) {
            case FilterTypeENum.sId: key = 'sId'; break;
            case FilterTypeENum.truckLicensePlateFront: key = 'truckLicensePlateFront'; break;
            case FilterTypeENum.truckLicensePlateBack: key = 'truckLicensePlateBack'; break;
            case FilterTypeENum.dockName: key = 'dockName'; break;
            case FilterTypeENum.status: key = 'status'; break;
            case FilterTypeENum.timeSlot: key = 'timeSlot'; break;
        }
        this.appliedFilters[key] = event.value;
        this.retrievePlanningList();
    }

    applyMobileView(): void {
        if (this.innerWidth < 993) {
            if (!this.isMobileCardList$.getValue()) this.isMobileCardList$.next(true);
        } else {
            if (this.isMobileCardList$.getValue()) this.isMobileCardList$.next(false);
        }
    }

    onBottomReached(): void {
        this.newCardsLoading$.next(true)
        this.pageSettings.length = this.pageSettings.length + 5;
        this.retrievePlanningList();
    }

    subscribeForLocationChange(isFirstLoad: boolean = false): void {
        this.organizationService.organization.subscribe((response) => {
            if (response) {
                if (!isFirstLoad) this.isLoading$.next(true);
                this.retrievePlanningList();
            } else {
                this.isLoading$.next(false);
            }
            isFirstLoad = false;
        });
    }

    retrieveSIDStatuses(): void {
        this.statusListService.listSid().subscribe({
            next: (list: StatusListModel[]) => {
                this.statuses = list;
            }
        })
    }

    toggleSelectMode(): void {
        if (this.isToggleOpened$.value) return;
        this.isToggleOpened$.next(true);
        this.toggleRef = this.snackBar.open('SID has been copied, please select the cell to schedule the planning!', 'Exit', {
            panelClass: ['bg-white']
        })

        this.toggleRef.afterDismissed().subscribe(() => {
            navigator.clipboard.writeText("");
            this.isToggleOpened$.next(false);
            this.cd.detectChanges();
        })
    }

    drop(event: any): void {
        const planning = this.isToggleOpened$.value ? this.plannings.find(p => p.id === this.logId) : event.item.data;
        const data = event.container.data;

        if (event.previousContainer === event.container) {
        } else {
            this.isLoading$.next(true);
            const day = this.filterDate.getDate() < 10 ? `0${this.filterDate.getDate()}` : this.filterDate.getDate();
            const month = this.filterDate.getMonth() < 10 ? `0${this.filterDate.getMonth() + 1}` : this.filterDate.getMonth() + 1;
            const year = this.filterDate.getFullYear();
            const plannedStatus = this.statuses.find(s => s.name.toLowerCase() === 'planned');
            if (!plannedStatus) {
                this.snackBar.open('Please add "Planned" status in Lists module.', 'Warning', {
                    duration: 3000,
                    horizontalPosition: 'center',
                    panelClass: ['error-snackbar'],
                    verticalPosition: 'top',
                })
                return;
            }
            this.updatePlanning(<any>{
                assigningDate: `${year}-${month}-${day}`,
                hour: this.getHour(data.index),
                planning: planning.id,
                dock: data.dock,
                statusListStatus: <number>plannedStatus?.id,
                timeSlot: this.getHour(data.index)
            });
        }
    }

    getHour(index: number): string {
        return `${index < 10 ? '0' + index + ':00:00' : index + ':00:00'}`;
    }

    handleDateChange(event: string | Date): void {
        this.filterDate = event instanceof Date ? event : new Date(event);
        // this.filterDate = <Date>event;
        this.plannings.length = 0;
        this.isTableLoading$.next(true);
        this.retrievePlanningList();
        this.getCardDetails()
    }

    onPaginateChange(ev: any) {
        this.isTableLoading$.next(true);
        this.pageSettings = ev;
        let data = {
            "start": ev.start,
            "length": ev.length,
            "filters": [this.formatDate(this.filterDate), "", "", "", "", ""],
            "order": [{ "dir": "DESC", "column": 0 }]
        }
        this.planningService.getPaginatePlanningShipment(data).subscribe({
            next: response => {
                this.plannings = response.items;
                this.isTableLoading$.next(false);
                this.cd.detectChanges();
                this.isLoading$.next(false);
            }
        })
    }

    handleOpenPlanUpgradeWarning(): void {
        this.sidenav.close();
        this.dialogService.open(SchedulingUpgradeWarningModalComponent, {
            disableClose: true
        }).afterClosed().subscribe(() => null)
    }

    updatePlanning(data: UpdatePlanningDock): void {
        this.planningService.updatePlanningToDock(data).subscribe({
            next: () => {
                if (this.isTableView$.getValue() && this.isComvexOrganization$.getValue()) {
                    this.isLoading$.next(false);
                } else if (this.isTableView$.getValue() && !this.isComvexOrganization$.getValue()) {
                    this.isLoading$.next(false);
                } else {
                    this.retrievePlanningList();
                }
                this.snackBar.open('SID has been scheduled!', 'Success', {
                    duration: 3000,
                    horizontalPosition: 'center',
                    panelClass: ['success-snackbar'],
                    verticalPosition: 'top',
                })
                if (this.isToggleOpened$.value) this.logId = 0;
                this.isToggleOpened$.next(false);
            },
            error: (body) => {
                if (this.isToggleOpened$.value) this.logId = 0;
                this.isToggleOpened$.next(false);
                handleError(this.snackBar, body, this.isLoading$)
            }
        });
    }

    openImportModal(): void {
        this.isLoading$.next(true);
        this.dialogService.open(SchedulingImportModalComponent, {
            disableClose: true,
            data: {}
        }).afterClosed()
            .subscribe({
                next: (isImported) => {
                    if (isImported) {
                        this.retrievePlanningList();
                    } else {
                        this.isLoading$.next(false);
                    }
                }
            });
    }

    openCancellationModal(planning: PlanningModel): void {
        this.dialogService.open(SchedulingCancelModalComponent, {
            disableClose: true,
            data: planning
        }).afterClosed()
            .subscribe({
                next: (isCancel) => {
                    if (isCancel) {
                        this.isLoading$.next(true);
                        this.cancelPlanning(<number>planning.id);
                    }
                }
            });
    }

    openRejectModal(planning: PlanningModel): void {
        this.dialogService.open(SchedulingRejectModalComponent, {
            disableClose: true,
            data: planning
        }).afterClosed()
            .subscribe({
                next: (isCancel) => {
                    if (isCancel) {
                        this.isLoading$.next(true);
                        this.rejectPlanning(<number>planning.id);
                    }
                }
            });
    }

    cancelPlanning(planningId: number): void {
        this.planningService.cancel(planningId).subscribe({
            next: () => {
                this.snackBar.open('SID cancelled!', 'Success', {
                    duration: 3000,
                    horizontalPosition: 'center',
                    panelClass: ['success-snackbar'],
                    verticalPosition: 'top',
                })
                this.retrievePlanningList();
            },
            error: (body) => {
                handleError(this.snackBar, body, this.isLoading$);
            }
        })
    }

    rejectPlanning(planningId: number): void {
        this.planningService.reject(planningId).subscribe({
            next: () => {
                this.snackBar.open('SID rejected!', 'Success', {
                    duration: 3000,
                    horizontalPosition: 'center',
                    panelClass: ['success-snackbar'],
                    verticalPosition: 'top',
                })
                this.retrievePlanningList();
            },
            error: (body) => {
                handleError(this.snackBar, body, this.isLoading$);
            }
        })
    }

    openCheckinModal(planning: PlanningModel): void {
        this.dialogService.open(SchedulingCheckinCheckoutModalComponent, {
            disableClose: true,
            data: {
                planning,
                type: 'checkin'
            }
        }).afterClosed()
            .subscribe({
                next: (checkIn) => {
                    if (checkIn) {
                        this.isLoading$.next(true);
                        this.checkInPlanning(<number>planning.id);
                    }
                }
            });
    }

    openCheckOutModal(planning: PlanningModel): void {
        this.dialogService.open(SchedulingCheckinCheckoutModalComponent, {
            disableClose: true,
            data: {
                planning,
                type: 'checkout'
            }
        }).afterClosed()
            .subscribe({
                next: (checkIn) => {
                    if (checkIn) {
                        this.isLoading$.next(true);
                        this.checkOutPlanning(<number>planning.id);
                    }
                }
            });
    }

    checkInPlanning(id: number): void {
        this.planningService.checkin(id).subscribe({
            next: () => {
                this.snackBar.open('SID checked-in!', 'Success', {
                    duration: 3000,
                    horizontalPosition: 'center',
                    panelClass: ['success-snackbar'],
                    verticalPosition: 'top',
                })
                this.retrievePlanningList();
            }, error: (body) => {
                handleError(this.snackBar, body, this.isLoading$);
            }
        });
    }

    checkOutPlanning(id: number): void {
        this.planningService.checkout(id).subscribe({
            next: () => {
                this.snackBar.open('SID checked-out!', 'Success', {
                    duration: 3000,
                    horizontalPosition: 'center',
                    panelClass: ['success-snackbar'],
                    verticalPosition: 'top',
                })
                this.retrievePlanningList();
            }, error: (body) => {
                handleError(this.snackBar, body, this.isLoading$);
            }
        });
    }

    dateRemoved() {
        this.filterDate = "";
        this.retrievePlanningList();
    }

    retrievePlanningList(): void {
        this.isTableLoading$.next(true);
        let data;
        data = {
            "start": this.pageSettings.start,
            "length": this.pageSettings.length,
            "filters": [this.formatDate(this.filterDate), "", "", "", "", "", "", ""],
            "order": [{ "dir": "DESC", "column": 0 }],
        };
        this.planningService.getPaginatePlanningShipment(data).subscribe((response: any) => {
            this.plannings = response.items;
            this.length = response.noFiltered;
            this.isTableLoading$.next(false);
            this.isCardDetailsLoading$.next(false)
            this.newCardsLoading$.next(false);
            this.cd.detectChanges();
        });
    }

    formatDate(date: Date | string): string {
        let formattedDate = '';
        if (date === "") return formattedDate;
        if (typeof date === 'string') {
            const tempDate = new Date(date);
            formattedDate = this.formatDateObject(tempDate);
        } else {
            formattedDate = this.formatDateObject(date);
        }

        return formattedDate;
    }

    private formatDateObject(date: Date): string {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
        return formattedDate;
    }

    openPlanEditModal(event: any): void {
        const planning = this.editPlanning$.getValue();
        const data = event.container.data;

        this.dialogService.open(SchedulingPlanModalComponent, {
            disableClose: true,
            data: {
                planning,
                ...data,
                timeSlot: getTimeSlot(data.index),
                date: this.filterDate
            }
        }).afterClosed()
            .subscribe({
                next: (response) => {
                    if (response) {
                        this.isLoading$.next(true);
                        const plannedStatus = this.statuses.find(s => s.name.toLowerCase() === 'planned');
                        if (!plannedStatus) {
                            this.snackBar.open('Please add "Planned" status in Lists module.', 'Warning', {
                                duration: 3000,
                                horizontalPosition: 'center',
                                panelClass: ['error-snackbar'],
                                verticalPosition: 'top',
                            })
                            return;
                        }
                        this.updatePlanning(<any>{
                            assigningDate: getFormattedDate(this.filterDate),
                            hour: this.getHour(data.index),
                            planning: <number>(<PlanningModel>planning).id,
                            dock: data.dock,
                            statusListStatus: plannedStatus.id,
                            timeSlot: this.getHour(data.index)
                        });
                    } else {
                        this.toggleRef.dismiss();
                    }
                },
                error: (body) => {
                    handleError(this.snackBar, body, this.isLoading$);
                }
            });
    }

    openPlanModal(event: any): void {
        const planning = this.isToggleOpened$.value ? this.editPlanning$.getValue() : event.item.data;
        const data = event.container.data;

        this.dialogService.open(SchedulingPlanModalComponent, {
            disableClose: true,
            data: {
                planning,
                ...data,
                timeSlot: getTimeSlot(data.index),
                date: this.filterDate
            }
        }).afterClosed()
            .subscribe({
                next: (response) => {
                    if (response) {
                        this.isLoading$.next(true);
                        const plannedStatus = this.statuses.find(s => s.name.toLowerCase() === 'planned');
                        if (!plannedStatus) {
                            this.snackBar.open('Please add "Planned" status in Lists module.', 'Warning', {
                                duration: 3000,
                                horizontalPosition: 'center',
                                panelClass: ['error-snackbar'],
                                verticalPosition: 'top',
                            })
                            return;
                        }
                        // this
                    } else {
                        this.toggleRef.dismiss();
                    }
                }
            });
    }

    toggleSidenav(data: { view: string, id: number, planning?: any, modal: string }) {
        if (!this.sidenav) {
            console.error('Sidenav is not initialized');
            return;
        }
        this.logModal = data.modal
        switch (data.view) {
            case 'copy':
                this.logId = data.id;
                this.editPlanning$.next(this.plannings.find(p => p.id === data.id) || null)
                this.toggleSelectMode();
                this.componentName$.next(data.view);
                break;
            case 'view':
                this.logId = data.id;
                this.planning = data.planning ? data.planning : this.plannings.find(p => p.id === data.id) || null;
                this.componentName$.next(data.view);
                this.sidenav.open();
                break;
            case 'mess':
                this.editPlanning$.next(this.plannings.find(p => p.id === data.id) || null)
                this.componentName$.next(data.view);
                this.sidenav.open();
                break;
            case 'edit':
                this.editPlanning$.next(this.plannings.find(p => p.id === data.id) || null)
                this.componentName$.next(data.view);
                this.isLoading$.next(false);
                this.sidenav.open();
                break;
        }
    }

    openDeleteModal(planning: PlanningModel | ComvexPlanningList | null): void {
        if (!planning) return;

        this.dialogService.open(SchedulingDeleteModalComponent, {
            disableClose: true,
            data: {
                sId: planning.id
            }
        }).afterClosed()
            .subscribe({
                next: (isDelete: boolean) => {
                    if (isDelete) {
                        this.isLoading$.next(true);
                        this.planningService.delete(<number>planning.id).subscribe({
                            next: () => {
                                this.snackBar.open('SID deleted!', 'Success', {
                                    duration: 3000,
                                    horizontalPosition: 'center',
                                    panelClass: ['success-snackbar'],
                                    verticalPosition: 'top',
                                })
                                this.retrievePlanningList();
                            }, error: (body) => handleError(this.snackBar, body, this.isLoading$)
                        })
                    }
                }
            });
    }

    ngOnDestroy(): void {
        if (this.comvexSubscription) this.comvexSubscription.unsubscribe();
        if (this.umexSubscription) this.umexSubscription.unsubscribe();
    }
}
