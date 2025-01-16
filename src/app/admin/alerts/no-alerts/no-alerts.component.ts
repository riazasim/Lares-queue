import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'no-alerts',
  templateUrl: './no-alerts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoAlertsComponent {}
