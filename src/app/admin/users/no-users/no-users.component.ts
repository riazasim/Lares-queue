import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'no-users',
  templateUrl: './no-users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoUsersComponent {}
