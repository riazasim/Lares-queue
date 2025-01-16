import { Component, EventEmitter, Input, OnChanges, Output, ChangeDetectionStrategy } from '@angular/core';
import { MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { DockStatusEnum } from 'src/app/core/models/dock.model';
import { SchedulingDockModel } from 'src/app/core/models/scheduling.model';
import { calculateMinMaxHours, getAllocatedTime, getRemainingTime, hasHours, isAvailableHour, isBreak, isOccupied, isService } from '../scheduling-box.helper';

/* DUMMY COMPONENT */
@Component({
  selector: 'app-scheduling-table-box',
  templateUrl: './scheduling-table-box.component.html',
  styleUrls: ['./scheduling-table-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulingTableBoxComponent implements OnChanges {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  hours: number[] = [];
  dockStatusEnum = DockStatusEnum;
  dockStatus: {[status: number]: string} = {
    [DockStatusEnum.Active]: 'Active',
    [DockStatusEnum.Reserved]: 'Reserved',
    [DockStatusEnum.Service]: 'Service',
    [DockStatusEnum.Inactive]: 'Inactive'
  }
  @Input() toggleRef: MatSnackBarRef<TextOnlySnackBar>;
  @Input() isToggleOpened: boolean;
  @Input() assignedHours: SchedulingDockModel[];
  @Output()
  public readonly onDrop: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public readonly onToggleModal: EventEmitter<any> = new EventEmitter<any>();
  done = [];

  private readonly calculateMinMaxHours: Function;
  public readonly getAllocatedTime: Function;
  public readonly getRemainingTime: Function;
  public readonly hasHours: Function;
  public readonly isOccupied: Function;
  public readonly isBreak: Function;
  public readonly isService: Function;
  public readonly isAvailableHour: Function;

  constructor() {
    this.calculateMinMaxHours = calculateMinMaxHours.bind(this);
    this.getAllocatedTime = getAllocatedTime.bind(this);
    this.getRemainingTime = getRemainingTime.bind(this);
    this.hasHours = hasHours.bind(this);
    this.isOccupied = isOccupied.bind(this);
    this.isBreak = isBreak.bind(this);
    this.isService = isService.bind(this);
    this.isAvailableHour = isAvailableHour.bind(this);
  }

  ngOnChanges(): void {
    this.setPanelIntervals(this.assignedHours);
  }

  handleSchedule(data: {index: number, name: string, dock: number, statusListStatus: any}): void {
    if (this.isToggleOpened) {
      this.onToggleModal.emit({ container: { data }});
    }
  }

  setPanelIntervals(docks: SchedulingDockModel[]): void {
    if (!docks?.length) {
      this.isLoading$.next(false);
      return;
    }

    const { min, max } = this.calculateMinMaxHours(docks);

    for (let i = min; i <= max; i++) {
      this.hours.push(i);
    }

    this.isLoading$.next(false);
  }
}
