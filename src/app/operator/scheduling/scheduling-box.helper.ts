import { DockStatusEnum } from "src/app/core/models/dock.model";
import { DockToPlanningModel, SchedulingDockModel } from "src/app/core/models/scheduling.model";
import { BreakModel, WorkingHoursModel } from "src/app/core/models/working-hours.model";

export function getMiliseconds(hours: string): number {
  const d = new Date();
  return d.setHours(+hours.substring(0, 2), +hours.substring(3, 5));
}

export function calculateMinMaxHours(docks: SchedulingDockModel[]) {
  let min = +(<WorkingHoursModel>docks[0]?.workingHour).startTime.substring(0, 2);
  let minHour = '';
  let max = +(<WorkingHoursModel>docks[0]?.workingHour).endTime.substring(0, 2);
  let maxHour = '';
  let maxMinutes = +(<WorkingHoursModel>docks[0]?.workingHour).endTime.substring(3, 5);

  docks.forEach((dock: SchedulingDockModel) => {
    if (dock.workingHour && getMiliseconds(( < WorkingHoursModel > dock.workingHour).startTime) < getMiliseconds(minHour)) {
      min = +( < WorkingHoursModel > dock.workingHour).startTime.substring(0, 2);
      minHour = ( < WorkingHoursModel > dock.workingHour).startTime;
    }

    if (dock.workingHour && getMiliseconds(( < WorkingHoursModel > dock.workingHour).endTime) > getMiliseconds(maxHour)) {
      max = +( < WorkingHoursModel > dock.workingHour).endTime.substring(0, 2);
      maxHour = ( < WorkingHoursModel > dock.workingHour).endTime;
    }
  });

  // min = min > 2 ? min - 2 : min;
  // max = max < 22 ? max + 2 : max;

  if (maxMinutes > 0 && max === 23) {
    max = max + 1;
  }

  return {
    min,
    max
  };
}

/**
 * Gets Sum of used allocated time from Planning object
 * @param {number} i index
 * @param {object} dock Dock object
 * @returns {number} sum of total used allocated time
 */
export function getAllocatedTime(i: number, dock: SchedulingDockModel): number {
  if (!dock.dockToPlannings.length) {
    return 0;
  }

  const plannings = ( < DockToPlanningModel[] > dock.dockToPlannings).filter(x => +x.hour.substring(0, 2) === i);

  return plannings.reduce((acc, b) => acc + +b.usedAllocatedTime, 0);
}

/**
 * Gets sum of total remaining time from Planning object
 * @param {number} i index
 * @param {object} dock Dock object
 * @returns {number} sum of total remaining time
 */
export function getRemainingTime(i: number, dock: SchedulingDockModel): number {
    if (!dock.dockToPlannings.length) {
        return 0;
    }

    const plannings = (<DockToPlanningModel[]>dock.dockToPlannings).filter(x => +x.hour.substring(0, 2) === i);

    return plannings.reduce((acc, b) => acc + b.remainingTime, 0);
}

/* UTILITIES FUNCTIONS FOR CHECKING TIMESLOTS STATUSES */
export function hasHours(i: number, dock: SchedulingDockModel): boolean {
    return (<DockToPlanningModel[]>dock.dockToPlannings).some((nw: DockToPlanningModel) => {
        return +(<string>nw.hour).substring(0, 2) === i && nw.remainingTime > 0;
    })
}

export function isOccupied(i: number, dock: SchedulingDockModel): boolean {
    return (<DockToPlanningModel[]>dock.dockToPlannings).some((nw: DockToPlanningModel) => {
        return +(<string>nw.hour).substring(0, 2) === i && !nw.remainingTime;
    })
}

export function isBreak(i: number, dock: SchedulingDockModel): boolean {
    return (<BreakModel[]>(<WorkingHoursModel>dock.workingHour).nonWorkingHours).some((nw: BreakModel) => {
        return +(<string>nw.startWithTime).substring(0, 2) === i;
    })
}

export function isService(i: number, dock: SchedulingDockModel): boolean {
    return dock.status === DockStatusEnum.Service &&
        +(<string>dock.startSuspendTime).substring(0, 2) <= i &&
        i <= +(<string>dock.endSuspendTime).substring(0, 2);
}

export function isAvailableHour(i: number, dock: SchedulingDockModel): boolean {
    if (!dock.workingHour) {
        return false;
    }

    // BETWEEN CASE
    if (getMiliseconds((<WorkingHoursModel>dock.workingHour).startTime) <= getMiliseconds(i < 10 ? `0${i}:00` : `${i}:00`) &&
        getMiliseconds((<WorkingHoursModel>dock.workingHour).endTime) >= getMiliseconds(i < 10 ? `0${i}:00` : `${i}:00`)) {
        return true;
    }

    // OUTSIDE CASE
    if (getMiliseconds((<WorkingHoursModel>dock.workingHour).startTime) > getMiliseconds((<WorkingHoursModel>dock.workingHour).endTime) &&
        (getMiliseconds(i < 10 ? `0${i}:00` : `${i}:00`) >= getMiliseconds((<WorkingHoursModel>dock.workingHour).startTime) ||
            getMiliseconds(i < 10 ? `0${i}:00` : `${i}:00`) < getMiliseconds((<WorkingHoursModel>dock.workingHour).endTime))) {
        return true;
    }

    return false;
}
/* UTILITIES FUNCTIONS FOR CHECKING TIMESLOTS STATUSES */

export const getTimeSlot = (index: number): string => {
  return index < 10 ? `0${index}:00 - ${(index + 1 < 10 ? '0'+(index+1)+':00' : (index+1)+':00')}` : `${index}:00 - ${index+1}:00`;
}

export const getHour = (index: number): string => {
  return `${index < 10 ? '0'+ index+':00:00' : index+':00:00'}`;
}

export const getFormatHourSlot = (index: number): string => {
  const start = +index < 10 ? `0${index}:00` : `${index}:00`;
  const end = +index + 1 < 10 ? `0${index+1}:00` :
  +index + 1 === 24 ? `00:00` : `${index+1}:00`;

  return `${start} - ${end}`;
}

export const getSlotFormatted = (timeSlot: string): number => {
  if (!timeSlot) return NaN;

  return +timeSlot.split(':')[0];
}

export const waitForElement = (selector: string) => {
  return new Promise(resolve => {
      if (document.querySelector(selector)) {
          return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver(mutations => {
          if (document.querySelector(selector)) {
              observer.disconnect();
              resolve(document.querySelector(selector));
          }
      });

      observer.observe(document.body, {
          childList: true,
          subtree: true
      });
  });
}
