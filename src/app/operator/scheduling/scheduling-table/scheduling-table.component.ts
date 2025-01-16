import { ChangeDetectionStrategy, Component, EventEmitter, Output, Input, OnChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DockStatusEnum } from 'src/app/core/models/dock.model';
import { DockToPlanningModel, SchedulingDockModel } from 'src/app/core/models/scheduling.model';
import { BreakModel, NonWorkingHoursModel, WorkingHoursModel } from 'src/app/core/models/working-hours.model';
import { DockService } from 'src/app/core/services/dock.service';
import { getFormattedDate } from 'src/app/shared/utils/date.functions';
import { getHour } from '../scheduling-box.helper';

@Component({
  selector: 'scheduling-table',
  templateUrl: './scheduling-table.component.html',
  styleUrls: ['./scheduling-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulingTableComponent implements OnChanges {
  readonly isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  readonly filteredTimeslot$: BehaviorSubject<number|null> = new BehaviorSubject<number|null>(null);
  @Input() isLoadingDashboard: boolean|null;
  hours: number[] = [];
  assignedHours: SchedulingDockModel[];
  dockStatusEnum = DockStatusEnum;
  dockStatus: {[status: number]: string} = {
    1: 'Active',
    2: 'Reserved',
    3: 'Service',
    4: 'Inactive'
  }
  @Input() isToggleOpened: boolean;
  @Input() filterDate: string | Date;

  @Output() readonly onDrop: EventEmitter<any> = new EventEmitter<any>();
  @Output() readonly onToggleModal: EventEmitter<any> = new EventEmitter<any>();
  @Output() readonly onFilterTimeslot: EventEmitter<string> = new EventEmitter<string>();

  constructor(private readonly dockService: DockService) {}
 
  ngOnChanges(): void {
    if (typeof this.isLoadingDashboard === 'boolean' && !this.isLoadingDashboard) {
      this.retrieveAssignedHours();
    }
  }

  setFilterTimeSlot(index: number): void {
    if (this.filteredTimeslot$.getValue() === index) {
      this.filteredTimeslot$.next(null);
      this.onFilterTimeslot.emit('');
      return;
    }

    this.filteredTimeslot$.next(index);
    this.onFilterTimeslot.emit(getHour(index));
  }

  handleSchedule(data: {index: number, name: string, dock: number}): void {
    if (this.isToggleOpened) {
      this.onToggleModal.emit({ container: { data }});
    }
  }

  retrieveAssignedHours(): void {
    if (!this.isLoading$.getValue()) this.isLoading$.next(true);
    if (!this.filterDate) this.filterDate = new Date();
    this.dockService.listAssignedHours({ filterDate: getFormattedDate(<Date>this.filterDate) }).subscribe((response: SchedulingDockModel[]) => {
      this.assignedHours = response;
      this.setPanelIntervals(response);
    });
  }

  isAvailableHour(i: number, dock: SchedulingDockModel): boolean {
    if (!dock.workingHour) {
      return false;
    }

    // BETWEEN CASE
    if (this.getMiliseconds((<WorkingHoursModel>dock.workingHour).startTime) <= this.getMiliseconds(i < 10 ? `0${i}:00` : `${i}:00`) &&
        this.getMiliseconds((<WorkingHoursModel>dock.workingHour).endTime) >= this.getMiliseconds(i < 10 ? `0${i}:00` : `${i}:00`)) {
      return true;
    }

    // OUTSIDE CASE
    if (this.getMiliseconds((<WorkingHoursModel>dock.workingHour).startTime) > this.getMiliseconds((<WorkingHoursModel>dock.workingHour).endTime) &&
        (this.getMiliseconds(i < 10 ? `0${i}:00` : `${i}:00`) >= this.getMiliseconds((<WorkingHoursModel>dock.workingHour).startTime) ||
        this.getMiliseconds(i < 10 ? `0${i}:00` : `${i}:00`) <= this.getMiliseconds((<WorkingHoursModel>dock.workingHour).endTime))) {
          return true;
    }

    return false;
  }

  hasHours(i: number, dock: SchedulingDockModel): boolean {
    return (<DockToPlanningModel[]>dock.dockToPlannings).some((nw: DockToPlanningModel) => {
      return +(<string>nw.hour).substring(0,2) === i && nw.remainingTime > 0;
    })
  }

  isOccupied(i: number, dock: SchedulingDockModel): boolean {
    return (<DockToPlanningModel[]>dock.dockToPlannings).some((nw: DockToPlanningModel) => {
      return +(<string>nw.hour).substring(0,2) === i && (!nw.remainingTime || nw.remainingTime < 0);
    })
  }

  isBreak(i: number, dock: SchedulingDockModel): boolean {
    return (<BreakModel[]>(<WorkingHoursModel>dock.workingHour).nonWorkingHours).some((nw: BreakModel) => {
      return +(<string>nw.startWithTime).substring(0,2) <= i &&
      (+(<string>nw.startWithTime).substring(0,2) + (+(<NonWorkingHoursModel>nw.nonWorkingHour).duration.split(':')[0]) > i) ||
      +(<NonWorkingHoursModel>nw.nonWorkingHour).duration.split(':')[0] === 0 && 
      (+(<string>nw.startWithTime).substring(0,2) + (+(<NonWorkingHoursModel>nw.nonWorkingHour).duration.split(':')[0]) === i);
    })
  }

  isService(i: number, dock: SchedulingDockModel): boolean {
    return dock.status === DockStatusEnum.Service && 
          +(<string>dock.startSuspendTime).substring(0,2) <= i && 
          i <= +(<string>dock.endSuspendTime).substring(0,2);
  }

  getRemainingTime(i: number, dock: SchedulingDockModel): number {
    if (!dock.dockToPlannings.length) {
      return 0;
    }

    const plannings = (<DockToPlanningModel[]>dock.dockToPlannings).filter(x => +x.hour.substring(0, 2) === i);

    return plannings.reduce((acc,b) => acc + b.remainingTime, 0);
  }

  getAllocatedTime(i: number, dock: SchedulingDockModel): number {
    if (!dock.dockToPlannings.length) {
      return 0;
    }

    const plannings = (<DockToPlanningModel[]>dock.dockToPlannings).filter(x => +x.hour.substring(0, 2) === i);

    return plannings.reduce((acc,b) => acc + +b.usedAllocatedTime, 0);
  }

  setPanelIntervals(docks: SchedulingDockModel[]): void {
    this.hours.length = 0;
    if (!docks.length) {
      this.isLoading$.next(false);
      return;
    }

    let min = +(<WorkingHoursModel>docks[0]?.workingHour).startTime.substring(0,2);
    let minHour = '';
    let max = +(<WorkingHoursModel>docks[0]?.workingHour).endTime.substring(0,2);
    let maxHour = '';
    let maxMinutes = +(<WorkingHoursModel>docks[0]?.workingHour).endTime.substring(3,5);

    docks.forEach((dock: SchedulingDockModel) => {
      if (dock.workingHour && this.getMiliseconds((<WorkingHoursModel>dock.workingHour).startTime) < this.getMiliseconds(minHour)) {
        min = +(<WorkingHoursModel>dock.workingHour).startTime.substring(0,2);
        minHour = (<WorkingHoursModel>dock.workingHour).startTime;
      }

      if (dock.workingHour && this.getMiliseconds((<WorkingHoursModel>dock.workingHour).endTime) > this.getMiliseconds(maxHour)) {
        max = +(<WorkingHoursModel>dock.workingHour).endTime.substring(0,2);
        maxHour = (<WorkingHoursModel>dock.workingHour).endTime;
      }
    });

    // min = min > 2 ? min - 2 : min;
    // max = max < 22 ? max + 2 : max;

    // if (maxMinutes > 0 && max === 23) {
    //   max = max + 1;
    // }

    for (let i = min; i <= max; i++) {
      this.hours.push(i);
    }

    this.isLoading$.next(false);
    // this.initializeSubscription(true)
  }

  private getMiliseconds(hours: string): number {
    const d = new Date();
    return d.setHours(+hours.substring(0,2), +hours.substring(3,5));
  }
}
