import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from "rxjs";
import { PlanningService } from 'src/app/core/services/planning.service';
import { convoyModel, PlanningModel } from 'src/app/core/models/planning.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { SchedulingDeleteModalComponent } from '../../scheduling-delete-modal/scheduling-delete-modal.component';
import { OrganizationService } from 'src/app/core/services/organization.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { RolesService } from 'src/app/core/services/roles.service';


@Component({
    selector: 'app-train-edit-scheduling-convoy',
    templateUrl: './train-edit-scheduling-convoy.component.html',
    styleUrl: './train-edit-scheduling-convoy.component.scss',
})
export class TrainEditSchedulingConvoyComponent {
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    @ViewChild('sidenav') sidenav: MatSidenav;
    readonly editPlanning$: BehaviorSubject<PlanningModel | null> = new BehaviorSubject<PlanningModel | null>(null);
    readonly componentName$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    readonly isToggleOpened$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    @Output() triggerConvoyLogs: EventEmitter<{ view: string, id: number, planning: PlanningModel, modal: string }> = new EventEmitter();
    @Output() retrieveConvoys: EventEmitter<any> = new EventEmitter();
    @Input() plannings: PlanningModel[] = [];
    toggleRef: MatSnackBarRef<TextOnlySnackBar>;
    displayedColumns: string[] = ['id', 'pickUpPoint', 'deliverPoint', 'estimatedTimePickUp', 'estimatedTimeDeliver', 'sidCoordinates', 'sidStatus', 'actions'];
    dataSource: convoyModel[] = [];
    originalSource: convoyModel[] = [];
    appliedFilters: any = {};
    userRole: string | null;
    transportMode: string | null;
    id: number;
    headerTitle: string;
    logId: number;
    logModal: string;
    status = [
        { id: 1, name: 'Port Queue', color: '#3386FE' },
    ];

    constructor(private readonly dialogService: MatDialog,
        private readonly planningService: PlanningService,
        private readonly route: ActivatedRoute,
        private readonly cd: ChangeDetectorRef,
        private readonly snackBar: MatSnackBar,
        private readonly orgService: OrganizationService,
        private readonly roleService: RolesService,
        private readonly router: Router
    ) {
        this.retrievePlanningList();
        this.transportMode = orgService.getAppMode();
        this.userRole = roleService.getUserRoles();
    }

    redirectToAddShipment() {
        this.router.navigate(['./add'], { relativeTo: this.route });
    }


    retrievePlanningList(): void {
        this.id = this.route.snapshot.params['id'];
        this.planningService.get(this.id).subscribe(response => {
            this.headerTitle = String(response?.rId)
            this.dataSource = response.planningRailwayShipments;
            this.originalSource = response.planningRailwayShipments;
            this.isLoading$.next(false);
        });
    }

    // OnEmit(row: any, modal: string) {
    //     this.triggerConvoyLogs.emit({ view: 'view', id: row.id, planning: row, modal: modal })
    // }

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

    toggleSidenav(data: { view: string, id: number, planning?: PlanningModel, modal: string }) {
        if (!data) {
            console.error('Sidenav is not initialized');
            return;
        }
        this.logModal = data.modal
        switch (data.view) {
            // case 'copy':
            //     this.logId = data.id;
            //     this.editPlanning$.next(this.plannings.find(p => p.id === data.id) || null)
            //     this.toggleSelectMode();
            //     this.componentName$.next(data.view);
            //     break;
            case 'view':
                this.logId = data.id;
                const planning = data.planning ? data.planning : this.plannings.find(p => p.id === data.id) || null;
                this.editPlanning$.next(planning)
                this.componentName$.next(data.view);
                this.sidenav.open();
                break;
            // case 'mess':
            //     this.editPlanning$.next(this.plannings.find(p => p.id === data.id) || null)
            //     this.componentName$.next(data.view);
            //     this.sidenav.open();
            //     break;
            // case 'edit':
            //     this.editPlanning$.next(this.plannings.find(p => p.id === data.id) || null)
            //     this.componentName$.next(data.view);
            //     this.isLoading$.next(false);
            //     this.sidenav.open();
            //     break;
        }
    }

    openDeleteModal(id: number) {
        this.dialogService.open(SchedulingDeleteModalComponent, {
            disableClose: true,
            data: { "id": id, "title": "convoy" }
        }).afterClosed()
            .subscribe({
                next: (isDelete: boolean) => {
                    if (isDelete) {
                        this.isLoading$.next(true);
                        this.planningService.deleteConvoy(id).subscribe(() => {
                            this.retrievePlanningList();
                            this.cd.detectChanges();
                        })
                    }
                }
            });
    }
}
