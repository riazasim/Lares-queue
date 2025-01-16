import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {'schedulings': 'true'},
})
export class SchedulingComponent {}
