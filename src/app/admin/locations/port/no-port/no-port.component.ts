import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'no-port',
  templateUrl: './no-port.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoPortComponent {}
