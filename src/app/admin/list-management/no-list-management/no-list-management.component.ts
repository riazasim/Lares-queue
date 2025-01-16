import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'no-list-management',
  templateUrl: './no-list-management.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoListManagementComponent {}
