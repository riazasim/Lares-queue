import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'no-station',
  templateUrl: './no-station.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoStationComponent {}
