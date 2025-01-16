import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'no-operations',
  templateUrl: './no-operations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoOperationsComponent {}
