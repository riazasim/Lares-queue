import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { PlanningService } from 'src/app/core/services/planning.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { handleError } from 'src/app/shared/utils/error-handling.function';
import { MicroService } from 'src/app/core/services/micro.service';
import { StationService } from 'src/app/core/services/stations.service';
import { TrainsService } from 'src/app/core/services/trains.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { createRequiredValidators } from 'src/app/shared/validators/generic-validators';
import { MatDialog } from '@angular/material/dialog';
import { SchedulingDeleteModalComponent } from '../../scheduling-delete-modal/scheduling-delete-modal.component';
import { RouteDeleteModalComponent } from '../../route-delete-modal/route-delete-modal.component';
import { HttpResponse } from '@angular/common/http';

@Component({
    selector: 'app-train-edit-scheduling-route',
    templateUrl: './train-edit-scheduling-route.component.html',
    styleUrls: ['./train-edit-scheduling-route.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrainEditSchedulingRouteComponent implements OnInit {

    planningForm: FormGroup;
    isRoutesLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isStationLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    hideEmail$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    selectedIndex: any = 0;
    locomotives: any[] = [];
    locomotiveType: any;
    stationTypes = [
        { id: 1, name: 'Public', value: 'PUBLIC' },
        { id: 2, name: 'Private', value: 'PRIVATE' },
    ];
    stations: any[] = [];
    station: any[] = [];
    id: number;
    index: number = 0;

    constructor(
        private readonly fb: FormBuilder,
        private readonly planningService: PlanningService,
        private readonly stationService: StationService,
        private readonly trainsService: TrainsService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly snackBar: MatSnackBar,
        private readonly cd: ChangeDetectorRef,
        private readonly dialogService: MatDialog
    ) {
    }

    ngOnInit(): void {
        this.getRoute();
        this.initForm();
    }

    moveItemInFormArray(
        formArray: FormArray,
        fromIndex: number,
        toIndex: number
    ): void {
        const dir = toIndex > fromIndex ? 1 : -1;

        const item = formArray.at(fromIndex);
        for (let i = fromIndex; i * dir < toIndex * dir; i = i + dir) {
            const current = formArray.at(i + dir);
            formArray.setControl(i, current);
        }
        formArray.setControl(toIndex, item);
    }


    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.stations, event.previousIndex, event.currentIndex)
        this.moveItemInFormArray(this.points, event.previousIndex, event.currentIndex);
    }

    initForm(data?: any): void {
        this.planningForm = this.fb.group({
            locomotiveId: this.fb.control(data?.locomotive?.id || ''),
            conductorType: this.fb.control(data?.conductorType || ''),
            userEmail: this.fb.control(data?.userEmail || ''),
            planningRailwayRoutingDetails: this.fb.array([]),
        });
        if (data?.planningRailwayRoutingDetails) {
            data.planningRailwayRoutingDetails.forEach((point: any) => {
                this.addPoints(point);
            });
        }
    }

    get points(): FormArray {
        return this.planningForm.get('planningRailwayRoutingDetails') as FormArray;
    }

    addPoints(data?: any): void {
        const newPoint = this.fb.group({
            planningRailwayRoutingDetailId: [data?.id || null],
            pointType: [data?.pointType || ''],
            stationType: [data?.stationType || ''],
            station: [data?.station?.id || '']
        });
        this.points.push(newPoint);
    }

    getRoute(): void {
        this.id = this.route.snapshot.params['id'];
        this.planningService.get(this.id).subscribe({
            next: (res) => {
                this.initForm(res);
                this.retrieveLocomotives();
                this.locomotiveType = res?.locomotive?.type;
                for (let i = 0; i < res?.planningRailwayRoutingDetails?.length; i++) {
                    this.retrieveStations(res?.planningRailwayRoutingDetails[i]?.stationType, i);
                }
                this.cd.detectChanges();
                this.isRoutesLoading$.next(false);
            },
            error: (err) => {
                this.isRoutesLoading$.next(false);
                handleError(this.snackBar, err);
            }
        });
    }

    retrieveLocomotives(): void {
        const data = {
            start: '',
            length: '',
            filters: ['', '', '', '', ''],
            order: [{ dir: 'DESC', column: 0 }]
        };
        this.trainsService.pagination(data).subscribe({
            next: (response) => {
                this.locomotives = response?.items || [];
                this.cd.detectChanges();
                this.isLoading$.next(false);
            },
            error: (err) => {
                this.isLoading$.next(false);
                handleError(this.snackBar, err);
            }
        });
    }

    onLocomotiveSelected(event: any): void {
        const selectedLocomotiveId = event.target.value;
        const selectedLocomotive = this.locomotives.find(
            (locomotive) => Number(locomotive.id) === Number(selectedLocomotiveId)
        );

        if (selectedLocomotive) {
            this.locomotiveType = selectedLocomotive?.type;
        }
    }

    hideEmail(ev: boolean) {
        console.log(ev,'123')
        localStorage.setItem("userEmail", String(this.planningForm.get('userEmail')))
        if (ev) {
            this.planningForm.get("userEmail")?.setValidators([...createRequiredValidators()]);
            this.planningForm.get("userEmail")?.setValue(String(localStorage.getItem("userEmail")) || "");
        }
        else {
            this.planningForm.get("userEmail")?.setValidators([]);
            this.planningForm.get("userEmail")?.setValue("");
        }
        this.planningForm.get('userEmail')?.updateValueAndValidity();
        this.hideEmail$.next(ev);
    }

    openDeleteModal(point: any, index: any = -1) {
        this.dialogService.open(RouteDeleteModalComponent, {
            disableClose: true,
            data: { "id": point?.value?.planningRailwayRoutingDetailId, "title": "planning", "description": "" }
        }).afterClosed()
            .subscribe({
                next: (isDelete: boolean) => {
                    if (isDelete) {
                        this.planningService.checkDeleteRoute(point?.value?.planningRailwayRoutingDetailId).subscribe({
                            next: res => {
                                if (res.data.attributes.message === "existedInShipment") {
                                    this.dialogService.open(RouteDeleteModalComponent, {
                                        disableClose: true,
                                        data: { "id": point?.value?.planningRailwayRoutingDetailId, "title": "route point", "description": "Shipments exists against this route point. \n Shipments against this point will also be deleted." }
                                    }).afterClosed()
                                        .subscribe({
                                            next: (isDelete: boolean) => {
                                                if (isDelete) {
                                                    this.planningService.deleteRoute(point?.value?.planningRailwayRoutingDetailId).subscribe({
                                                        next: res => {
                                                            this.stations.splice(Number(index), 1);
                                                            this.points.removeAt(Number(index));
                                                            this.cd.detectChanges();
                                                        }
                                                    });
                                                }
                                            }
                                        })
                                }
                                else {
                                    if (index > -1) {
                                        this.stations.splice(Number(index), 1);
                                        this.points.removeAt(Number(index));
                                        this.cd.detectChanges();
                                    }
                                }
                            }
                        })
                    }
                }
            });
    }


    onStationTypeChange(event: any, index: any): void {
        this.retrieveStations(event.target.value, index);
    }

    retrieveStations(type: string, index?: any): void {
        this.isStationLoading$.next(true);
        this.stationService.getStationList(type).subscribe({
            next: (res) => {
                let stationArray: any[] = [];
                res?.forEach((item: any) => {
                    stationArray.push(item.attributes)
                });
                this.stations[index] = stationArray;
                console.log(this.stations, stationArray);
                this.cd.detectChanges();
                this.isStationLoading$.next(false);
            },
            error: (err) => {
                this.isStationLoading$.next(false);
                handleError(this.snackBar, err);
            }
        });
    }

    updateRoutingDetails(): void {
        this.isLoading$.next(true);

        this.points.controls.forEach((control, i, arr) => {
            const group = control as FormGroup;
            if (i === 0) {
                group.patchValue({ pointType: 'Start Point' });
            } else if (i === arr.length - 1) {
                group.patchValue({ pointType: 'End Point' });
            } else {
                group.patchValue({ pointType: 'Touch Point' });
            }
        });

        this.planningForm.patchValue({
            planningRailwayRoutingDetails: this.points.value
        });

        this.planningService.editRouteingDetails(this.id, this.planningForm.value).subscribe({
            next: () => {
                this.router.navigate(['../../success'], { relativeTo: this.route });
            },
            error: (body) => {
                handleError(this.snackBar, body);
                this.isLoading$.next(false);
            }
        });
    }
}
