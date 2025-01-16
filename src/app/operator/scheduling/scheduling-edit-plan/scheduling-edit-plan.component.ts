import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BehaviorSubject } from 'rxjs';
import { SchedulingPreviewModel } from 'src/app/core/models/scheduling.model';
import { PlanningModel, UpdatePlanningDock } from 'src/app/core/models/planning.model';

@Component({
  selector: 'scheduling-edit-plan',
  templateUrl: './scheduling-edit-plan.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulingEditPlanComponent {
  @Input() isLoading: boolean;
  @Input() filterDate: Date;
  @Input() sidenav: MatSidenav;
  @Input() planning$: BehaviorSubject<PlanningModel|null>;

  @Output() triggerFetchPlannings: EventEmitter<string | Date> = new EventEmitter();
  @Output() triggerUpdatePlanning: EventEmitter<UpdatePlanningDock> = new EventEmitter();
}
